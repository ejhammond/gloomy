import * as React from "react"
import { produce } from "immer"

type TransientState = {
  selectedCharacterId: string | null
  drawnCards: {}
  shield: number
  blessings: number
  curses: number
  penalties: number
  poisoned: boolean
  disarmed: boolean
  wounded: boolean
  strengthened: boolean
  muddled: boolean
  immobilized: boolean
  invisible: boolean
  stunned: boolean
  hp: number
  xp: number
  gold: number
}

const initialState = {
  selectedCharacterId: null,
  drawnCards: {},
  shield: 0,
  blessings: 0,
  curses: 0,
  penalties: 0,
  hp: 0,
  xp: 0,
  gold: 0,
  poisoned: false,
  disarmed: false,
  wounded: false,
  strengthened: false,
  muddled: false,
  immobilized: false,
  invisible: false,
  stunned: false,
}

type TransientActionType =
  | "blessings/add"
  | "blessings/remove"
  | "character/select"
  | "curses/add"
  | "curses/remove"
  | "deck/draw"
  | "deck/shuffle"
  | "disarmed/set"
  | "gold/add"
  | "gold/remove"
  | "hp/add"
  | "hp/remove"
  | "immobilized/set"
  | "invisible/set"
  | "muddled/set"
  | "penalties/add"
  | "penalties/remove"
  | "poisoned/set"
  | "shield/add"
  | "shield/remove"
  | "strengthened/set"
  | "stunned/set"
  | "xp/add"
  | "xp/remove"
  | "wounded/set"

const transientStateReducer = produce(
  (
    draftState: TransientState,
    action: { type: TransientActionType; payload?: any }
  ) => {
    switch (action.type) {
      case "character/select":
        draftState.selectedCharacterId = action.payload
        break
      case "blessings/add":
        draftState.blessings++
        break
      case "blessings/remove":
        draftState.blessings = Math.max(draftState.blessings - 1, 0)
        break
      case "curses/add":
        draftState.curses++
        break
      case "curses/remove":
        draftState.curses = Math.max(draftState.curses - 1, 0)
        break
      case "penalties/add":
        draftState.penalties++
        break
      case "penalties/remove":
        draftState.penalties = Math.max(draftState.penalties - 1, 0)
        break
      case "hp/add":
        draftState.hp++
        break
      case "hp/remove":
        draftState.hp = Math.max(draftState.hp - 1, 0)
        break
      case "shield/add":
        draftState.shield++
        break
      case "shield/remove":
        draftState.shield = Math.max(draftState.shield - 1, 0)
        break
      case "xp/add":
        draftState.xp++
        break
      case "xp/remove":
        draftState.xp = Math.max(draftState.xp - 1, 0)
        break
      case "gold/add":
        draftState.gold++
        break
      case "gold/remove":
        draftState.gold = Math.max(draftState.gold - 1, 0)
        break
      case "poisoned/set":
        draftState.poisoned = action.payload
        break
      case "disarmed/set":
        draftState.disarmed = action.payload
        break
      case "wounded/set":
        draftState.wounded = action.payload
        break
      case "strengthened/set":
        draftState.strengthened = action.payload
        break
      case "muddled/set":
        draftState.muddled = action.payload
        break
      case "immobilized/set":
        draftState.immobilized = action.payload
        break
      case "invisible/set":
        draftState.invisible = action.payload
        break
      case "stunned/set":
        draftState.stunned = action.payload
        break
      case "deck/draw":
        draftState.drawnCards[action.payload] = true
        break
      case "deck/shuffle":
        draftState.drawnCards = {}
        break
    }
  }
)

const transientStateContext = React.createContext<
  | [
      TransientState,
      React.Dispatch<{ type: TransientActionType; payload?: any }>
    ]
  | undefined
>(undefined)
const TransientStateContextProvider = transientStateContext.Provider
export function TransientStateProvider({ children }) {
  const [state, dispatch] = React.useReducer(
    transientStateReducer,
    initialState
  )

  return (
    <TransientStateContextProvider value={[state, dispatch]}>
      {children}
    </TransientStateContextProvider>
  )
}

export function useTransientState() {
  const context = React.useContext(transientStateContext)

  if (context === undefined) {
    throw new Error("Missing TransientStateContextProvider")
  }

  const [state] = context

  return state
}

export function useTransientStateDispatch() {
  const context = React.useContext(transientStateContext)

  if (context === undefined) {
    throw new Error("Missing TransientStateContextProvider")
  }

  const [, dispatch] = context

  return dispatch
}
