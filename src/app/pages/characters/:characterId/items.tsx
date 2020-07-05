import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import Typography from "@material-ui/core/Typography"

import { GridContainer, GridItem } from "../../../../components/grid"

import { useCharacterRouteContext } from "./routes"

export const Items: React.FC<RouteComponentProps> = function Items() {
  const { character, dispatchCharacterAction } = useCharacterRouteContext()

  return <Typography>Items</Typography>
}
