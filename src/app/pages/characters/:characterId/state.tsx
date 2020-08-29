import * as React from "react"
import { produce } from "immer"
import { useQuery, useMutation, queryCache } from "react-query"
import firebase from "gatsby-plugin-firebase"
import { uuid } from "uuidv4"

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

type SetItemsHeadAction = {
  type: "items/head/set"
  payload: string
}

type SetItemsBodyAction = {
  type: "items/body/set"
  payload: string
}

type SetItemsHand1Action = {
  type: "items/hand1/set"
  payload: string
}

type SetItemsHand2Action = {
  type: "items/hand2/set"
  payload: string
}

type SetItemsFeetAction = {
  type: "items/feet/set"
  payload: string
}

type SetItemsEncumbranceAction = {
  type: "items/encumbrance/set"
  payload: number
}

type AddBagItemAction = {
  type: "items/bag/add"
}

type RemoveBagItemAction = {
  type: "items/bag/remove"
  payload: string
}

type SetItemsBagAction = {
  type: "items/bag/set"
  payload: {
    id: string
    value: string
  }
}

type AddStorageItemAction = {
  type: "items/storage/add"
}

type RemoveStorageItemAction = {
  type: "items/storage/remove"
  payload: string
}

type SetItemsStorageAction = {
  type: "items/storage/set"
  payload: {
    id: string
    value: string
  }
}

type CharacterAction =
  | AddBattleGoalCheckAction
  | RemoveBattleGoalCheckAction
  | SetClassIdAction
  | SetNameAction
  | SetGoldAction
  | SetNotesAction
  | AddPerkCheckAction
  | RemovePerkCheckAction
  | SetPerkChecksAction
  | SetXpAction
  | SetRetiredAction
  | SetItemsHeadAction
  | SetItemsBodyAction
  | SetItemsHand1Action
  | SetItemsHand2Action
  | SetItemsFeetAction
  | SetItemsEncumbranceAction
  | SetItemsBagAction
  | SetItemsStorageAction
  | AddBagItemAction
  | RemoveBagItemAction
  | AddStorageItemAction
  | RemoveStorageItemAction

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
      break
    case "items/head/set":
      draftState.items.head = action.payload
      break
    case "items/body/set":
      draftState.items.body = action.payload
      break
    case "items/hand1/set":
      draftState.items.hand1 = action.payload
      break
    case "items/hand2/set":
      draftState.items.hand2 = action.payload
      break
    case "items/feet/set":
      draftState.items.feet = action.payload
      break
    case "items/encumbrance/set":
      draftState.items.encumbrance = action.payload
      break
    case "items/bag/add":
      // using Date.now() as the id ensures that the items can be sorted by insertion-time
      draftState.items.bag[Date.now()] = ""
      break
    case "items/bag/remove":
      delete draftState.items.bag[action.payload]
      break
    case "items/bag/set":
      draftState.items.bag[action.payload.id] = action.payload.value
      break
    case "items/storage/add":
      draftState.items.storage[Date.now()] = ""
      break
    case "items/storage/remove":
      delete draftState.items.storage[action.payload]
      break
    case "items/storage/set":
      draftState.items.storage[action.payload.id] = action.payload.value
      break
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
    [character, mutate],
  )

  return { character, dispatchCharacterAction, status, error }
}
