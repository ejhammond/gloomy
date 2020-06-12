import * as React from "react"
import { RouteComponentProps, Redirect } from "@reach/router"

export const AppIndex: React.FC<RouteComponentProps> = function AppIndex() {
  return <Redirect to="characters" noThrow />
}
