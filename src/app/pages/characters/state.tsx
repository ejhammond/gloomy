import * as React from "react"
import { useQuery, useMutation, queryCache } from "react-query"
import firebase from "gatsby-plugin-firebase"
import { uuid } from "uuidv4"

import { useUser } from "../../providers/auth"
import { Character } from "../../../types"
import { navigate } from "gatsby"

function makeNewCharacter(): Character {
  return {
    id: uuid(),
    name: "",
    classId: null,
    xp: 0,
    gold: 0,
    notes: "",
    items: {
      head: "",
      body: "",
      hand1: "",
      hand2: "",
      feet: "",
      bag: {},
      storage: {},
      encumbrance: 0,
    },
    battleGoalChecks: 0,
    perkChecks: {},
    retired: false,
    createdAt: firebase.firestore.Timestamp.now(),
    updatedAt: firebase.firestore.Timestamp.now(),
  }
}

type CharactersListEntry = Pick<
  Character,
  "id" | "name" | "xp" | "classId" | "retired"
>

type CharactersList = {
  [characterId: string]: CharactersListEntry
}

type AddCharacterAction = {
  type: "add"
}

type DeleteCharacterAction = {
  type: "delete"
  payload: string // characterId
}

type CharactersListAction = AddCharacterAction | DeleteCharacterAction

export function useCharactersList() {
  const user = useUser()

  const charactersListQueryKey = ["characters-list", user.id] as const

  const {
    status: queryStatus,
    data: charactersList,
    error: queryError,
    isFetching: queryIsFetching,
  } = useQuery(charactersListQueryKey, async () => {
    const snapshot = await firebase
      .firestore()
      .collection("characters")
      .where("ownerId", "==", user.id)
      .orderBy("updatedAt", "desc")
      // ideally, we'd only fetch the data that we need
      // but firestore doesn't support selecting fields
      // so we'll query for all of the data, and then transform the response to select the fields
      // this way we provide the proper interface to the rest of the app
      // and we can change this query to select fields once that's supported
      .withConverter<CharactersListEntry>({
        fromFirestore: docSnap => {
          const { id, name, xp, classId, retired } = docSnap.data() as Character

          return {
            id,
            name,
            xp,
            classId,
            retired,
          }
        },
        // toFirestore is required, but it's not used since we're only using .get() on this query
        toFirestore: m => m,
      })
      .get()

    return snapshot.docs
      .map(d => d.data() as CharactersListEntry)
      .reduce((acc, character) => {
        acc[character.id] = character
        return acc
      }, {}) as CharactersList
  })

  const [
    performDeleteMutation,
    { status: deleteStatus, error: deleteError },
  ] = useMutation(
    async (characterId: string) => {
      return firebase
        .firestore()
        .collection("characters")
        .doc(characterId)
        .delete()
    },
    {
      onMutate: characterId => {
        // the query key for the character data
        const characterQueryKey = ["character", characterId] as const

        // cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        queryCache.cancelQueries(charactersListQueryKey)
        queryCache.cancelQueries(characterQueryKey)

        // snapshot current values for rollback
        const previousCharacters = queryCache.getQueryData<CharactersList>(
          charactersListQueryKey,
        )
        const previousCharacter = queryCache.getQueryData<Character>(
          characterQueryKey,
        )

        const nextCharacters = { ...previousCharacters }
        delete nextCharacters[characterId]

        // optimistically update
        queryCache.setQueryData(charactersListQueryKey, nextCharacters)
        queryCache.setQueryData(characterQueryKey, undefined)

        // return a rollback fn
        return () => {
          queryCache.setQueryData(charactersListQueryKey, previousCharacters)
          queryCache.setQueryData(characterQueryKey, previousCharacter)
        }
      },
      onSuccess: (data, characterId) => {
        // if the mutation is successful, we can completely remove the character query
        const characterQueryKey = ["character", characterId] as const
        queryCache.removeQueries(characterQueryKey)
      },
      onError: (error, characterId, onMutateResult) => {
        // the result of onMutate is our rollback fn
        const rollback = onMutateResult as VoidFunction

        // roll back optimistically
        // adds the character back to the charactersList and restores the character data
        rollback()

        // go back to the db to make sure that we've got the latest character data
        const characterQueryKey = ["character", characterId] as const
        queryCache.refetchQueries(characterQueryKey)
      },
      onSettled: () => {
        queryCache.refetchQueries(charactersListQueryKey)
      },
    },
  )

  const [
    performAddMutation,
    { status: addStatus, error: addError },
  ] = useMutation(
    async (character: Character) => {
      return firebase
        .firestore()
        .collection("characters")
        .doc(character.id)
        .set({
          ownerId: user.id,
          ...character,
        })
    },
    {
      onSuccess: (data, character) => {
        // refetch the characters-list because we've mutated it
        queryCache.refetchQueries(charactersListQueryKey)

        // head over to the character page now that the new character is successfully added to the db
        navigate(`/app/characters/${character.id}`)
      },
    },
  )

  const dispatchCharactersListAction = React.useCallback(
    (action: CharactersListAction) => {
      switch (action.type) {
        case "add":
          const newCharacter = makeNewCharacter()
          performAddMutation(newCharacter)
          break
        case "delete":
          performDeleteMutation(action.payload)
          break
      }
    },
    [performAddMutation, performDeleteMutation],
  )

  return {
    charactersList,
    dispatchCharactersListAction,
    statuses: {
      query: queryStatus,
      add: addStatus,
      delete: deleteStatus,
    },
    errors: {
      query: queryError,
      add: addError,
      delete: deleteError,
    },
    revalidations: {
      query: queryIsFetching,
    },
  }
}
