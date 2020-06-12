import * as React from "react"
import { produce } from "immer"
import { useQuery, useMutation, queryCache } from "react-query"
import firebase from "gatsby-plugin-firebase"

import { Character, ClassId } from "../../../../types"
import { useAsyncDebounce } from "../../../../hooks/use-async-debounce"
import { useUser } from "../../../providers/auth"

type AddBattleGoalCheckAction = {
  type: "battle-goal-checks/add"
}

type RemoveBattleGoalCheckAction = {
  type: "battle-goal-checks/remove"
}

type SetClassIdAction = {
  type: "class-id/set"
  payload: ClassId | null
}

type SetGoldAction = {
  type: "gold/set"
  payload: number
}

type SetItemsAction = {
  type: "items/set"
  payload: string
}

type SetNameAction = {
  type: "name/set"
  payload: string
}

type SetNotesAction = {
  type: "notes/set"
  payload: string
}

type SetRetiredAction = {
  type: "retired/set"
  payload: boolean
}

type AddPerkCheckAction = {
  type: "perk-checks/add"
  payload: string // perkId
}

type RemovePerkCheckAction = {
  type: "perk-checks/remove"
  payload: string // perkId
}

type SetPerkChecksAction = {
  type: "perk-checks/set"
  payload: { [perkId: string]: number }
}

type SetXpAction = {
  type: "xp/set"
  payload: number
}

type CharacterAction =
  | AddBattleGoalCheckAction
  | RemoveBattleGoalCheckAction
  | SetClassIdAction
  | SetNameAction
  | SetGoldAction
  | SetNotesAction
  | SetItemsAction
  | AddPerkCheckAction
  | RemovePerkCheckAction
  | SetPerkChecksAction
  | SetXpAction
  | SetRetiredAction

const getNextState = produce<
  (draftState: Character, action: CharacterAction) => void
>((draftState, action) => {
  switch (action.type) {
    case "battle-goal-checks/add":
      draftState.battleGoalChecks++
      break
    case "battle-goal-checks/remove":
      draftState.battleGoalChecks--
      break
    case "name/set":
      draftState.name = action.payload
      break
    case "class-id/set":
      draftState.classId = action.payload
      // remove existing perk-checks if the class changes
      draftState.perkChecks = {}
      break
    case "xp/set":
      draftState.xp = action.payload
      break
    case "gold/set":
      draftState.gold = action.payload
      break
    case "notes/set":
      draftState.notes = action.payload
      break
    case "items/set":
      draftState.items = action.payload
      break
    case "perk-checks/set":
      draftState.perkChecks = action.payload
      break
    case "perk-checks/add":
      if (typeof draftState.perkChecks[action.payload] !== "number") {
        draftState.perkChecks[action.payload] = 0
      }
      draftState.perkChecks[action.payload]++
      break
    case "perk-checks/remove":
      if (typeof draftState.perkChecks[action.payload] !== "number") {
        draftState.perkChecks[action.payload] = 0
      }
      draftState.perkChecks[action.payload]--
      break
    case "retired/set":
      draftState.retired = action.payload
  }
})

export function useCharacter(characterId: string) {
  const user = useUser()

  const queryKey = ["character", characterId] as const

  const { status, data: character, error } = useQuery(queryKey, async () => {
    const snapshot = await firebase
      .firestore()
      .collection("characters")
      .doc(characterId)
      .get()

    return snapshot.data() as Character
  })

  // we debounce the mutate fn so that we don't fire off too many network requests while the user is typing
  // the onMutate fn will still get called
  const debouncedMutateFn = useAsyncDebounce(async (character: Character) => {
    return firebase
      .firestore()
      .collection("characters")
      .doc(characterId)
      .set({
        ...character,
        updatedAt: firebase.firestore.Timestamp.now(),
      })
  }, 1000)

  const [mutate] = useMutation(debouncedMutateFn, {
    onMutate: character => {
      // cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
      queryCache.cancelQueries(queryKey)

      // snapshot current value for rollback
      const previousCharacter = queryCache.getQueryData(queryKey)

      // optimistically update
      queryCache.setQueryData(queryKey, character)

      // return a rollback fn
      return () => {
        queryCache.setQueryData(queryKey, previousCharacter)
      }
    },
    onError: (error, settings, onMutateResult) => {
      // the result of onMutate is our rollback fn
      const rollback = onMutateResult as VoidFunction

      rollback()
    },
    // always refetch (regardless of success vs error)
    onSettled: () => {
      queryCache.refetchQueries(queryKey)
      queryCache.refetchQueries(["characters-list", user.id])
    },
  })

  const dispatchCharacterAction = React.useCallback(
    (action: CharacterAction) => {
      const nextState = getNextState(character, action)

      mutate(nextState)
    },
    [character, mutate]
  )

  return { character, dispatchCharacterAction, status, error }
}
