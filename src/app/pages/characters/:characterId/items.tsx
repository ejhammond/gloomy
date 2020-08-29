import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import { IconButton, Typography, TextField, Button } from "@material-ui/core"
import DeleteIcon from "@material-ui/icons/Delete"

import { GridContainer, GridItem } from "../../../../components/grid"
import { DamageIcon } from "../../../../components/icons/damage-icon"
import { Heading } from "../../../../components/heading"
import { useCharacterRouteContext } from "./routes"
import { HStack } from "../../../../components/h-stack"
import { Counter } from "../../../../components/counter"

export const Items: React.FC<RouteComponentProps> = function Items() {
  const { character, dispatchCharacterAction } = useCharacterRouteContext()

  const { items } = character

  return (
    <GridContainer>
      <GridItem span={4}>
        <Heading component="h1">Equipment</Heading>
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="head-slot">
          Head
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="head-slot"
          value={items.head}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/head/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="body-slot">
          Body
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="body-slot"
          value={items.body}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/body/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="hand1-slot">
          Hand 1
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="hand1-slot"
          value={items.hand1}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/hand1/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="hand2-slot">
          Hand 2
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="hand2-slot"
          value={items.hand2}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/hand2/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="feet-slot">
          Feet
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="feet-slot"
          value={items.feet}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/feet/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>

      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="encumbrance">
          <HStack spacing="2px">
            <DamageIcon damage={-1} />
            <span>{"'s"}</span>
          </HStack>
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <Counter
          value={items.encumbrance}
          onChange={num => {
            dispatchCharacterAction({
              type: "items/encumbrance/set",
              payload: num,
            })
          }}
        />
      </GridItem>
      <GridItem span={1}>{/* spacer */}</GridItem>
      <GridItem span={3}>
        <HStack spacing="4px" vAlign="center">
          {items.encumbrance >= 0 ? (
            <Typography color="textSecondary">Adds</Typography>
          ) : (
            <Typography color="textSecondary">Removes</Typography>
          )}
          <Typography color="textSecondary">
            {Math.abs(items.encumbrance)}
          </Typography>
          <DamageIcon damage={-1} />
          <Typography color="textSecondary">
            {Math.abs(items.encumbrance) === 1 ? "card" : "cards"}
          </Typography>
        </HStack>
      </GridItem>

      <GridItem span={4}>
        <Heading component="h1">Bag</Heading>
      </GridItem>
      {Object.entries(items.bag)
        // assumes that the ids are numerical
        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
        .map(([id, item]) => (
          <React.Fragment key={id}>
            <GridItem span={3}>
              <TextField
                variant="outlined"
                fullWidth
                value={item}
                onChange={event => {
                  dispatchCharacterAction({
                    type: "items/bag/set",
                    payload: { id, value: event.target.value },
                  })
                }}
              />
            </GridItem>
            <GridItem
              span={1}
              style={{ display: "flex", alignItems: "center" }}
            >
              <IconButton
                onClick={() =>
                  dispatchCharacterAction({
                    type: "items/bag/remove",
                    payload: id,
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </GridItem>
          </React.Fragment>
        ))}

      <GridItem span={4}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() => dispatchCharacterAction({ type: "items/bag/add" })}
          >
            Add bag item
          </Button>
        </div>
      </GridItem>

      <GridItem span={4}>
        <Heading component="h1">Storage</Heading>
      </GridItem>
      {Object.entries(items.storage)
        // assumes that the ids are numerical
        .sort(([a], [b]) => parseInt(a, 10) - parseInt(b, 10))
        .map(([id, item]) => (
          <React.Fragment key={id}>
            <GridItem span={3}>
              <TextField
                variant="outlined"
                fullWidth
                value={item}
                onChange={event => {
                  dispatchCharacterAction({
                    type: "items/storage/set",
                    payload: { id, value: event.target.value },
                  })
                }}
              />
            </GridItem>
            <GridItem
              span={1}
              style={{ display: "flex", alignItems: "center" }}
            >
              <IconButton
                onClick={() =>
                  dispatchCharacterAction({
                    type: "items/storage/remove",
                    payload: id,
                  })
                }
              >
                <DeleteIcon />
              </IconButton>
            </GridItem>
          </React.Fragment>
        ))}

      <GridItem span={4}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button
            variant="outlined"
            onClick={() =>
              dispatchCharacterAction({ type: "items/storage/add" })
            }
          >
            Add storage item
          </Button>
        </div>
      </GridItem>
    </GridContainer>
  )
}
