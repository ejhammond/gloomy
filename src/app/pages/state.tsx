import * as React from "react"
import { produce } from "immer"
import firebase from "gatsby-plugin-firebase"
import { useQuery, useMutation, queryCache } from "react-query"

import { useUser } from "../providers/auth"
import { classesById } from "../../configs/classes"
import { ClassId } from "../../types"

type UserSettings = {
  unlocks: { [C in keyof typeof classesById]: boolean }
}

type UserSettingsAction = {
  type: "unlock/toggle"
  payload: ClassId | "envelope-x"
}

const getNextState = produce<
  (draftState: UserSettings, action: UserSettingsAction) => void
>((draftState, action) => {
  const { type, payload } = action

  switch (type) {
    case "unlock/toggle":
      draftState.unlocks[payload] = !draftState.unlocks[payload]
  }
})

export function useUserSettings() {
  const user = useUser()

  const queryKey = ["user-settings", user.id] as const

  const { status, data: userSettings, error } = useQuery(queryKey, async () => {
    const snapshot = await firebase
      .firestore()
      .collection("users")
      .doc(user.id)
      .get()

    return snapshot.data() as UserSettings
  })

  const [mutate] = useMutation(
    async (settings: UserSettings) => {
      return firebase.firestore().collection("users").doc(user.id).set(settings)
    },
    {
      onMutate: settings => {
        // cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
        queryCache.cancelQueries(queryKey)

        // snapshot current value for rollback
        const previousSettings = queryCache.getQueryData(queryKey)

        // optimistically update
        queryCache.setQueryData(queryKey, settings)

        // return a rollback fn
        return () => {
          queryCache.setQueryData(queryKey, previousSettings)
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
      },
    }
  )

  const dispatchUserSettingsAction = React.useCallback(
    (action: UserSettingsAction) => {
      const nextState = getNextState(userSettings, action)

      mutate(nextState)
    },
    [userSettings, mutate]
  )

  return { userSettings, dispatchUserSettingsAction, status, error }
}
