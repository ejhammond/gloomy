import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import Button from "@material-ui/core/Button"
import MenuItem from "@material-ui/core/MenuItem"
import Select from "@material-ui/core/Select"
import TextField from "@material-ui/core/TextField"
import Typography from "@material-ui/core/Typography"
import FormGroup from "@material-ui/core/FormGroup"
import Checkbox from "@material-ui/core/Checkbox"
import red from "@material-ui/core/colors/red"

import { ClassId } from "../../../../types"
import { GridContainer, GridItem } from "../../../../components/grid"
import { ClassIcon } from "../../../../components/icons/class-icon"
import { classesById } from "../../../../configs/classes"
import { getLevel } from "../../../../configs/levels"
import { useCharacterRouteContext } from "./routes"
import { useCharactersRouteContext } from "../routes"
import { useAppRouteContext } from "../../routes"
import { useTheme } from "../../../../providers/theme"

function getClassDisplayName(
  classId: ClassId,
  settings: ReturnType<typeof useAppRouteContext>["userSettings"]
) {
  const klass = classesById[classId]

  if (klass.spoilerTreatment.type === "none") {
    return klass.name
  }

  if (klass.spoilerTreatment.type === "name-hidden") {
    return settings.unlocks[classId] === true
      ? klass.name
      : klass.spoilerTreatment.safeName
  }

  if (klass.spoilerTreatment.type === "completely-hidden") {
    return settings.unlocks[classId] === true ? klass.name : "???"
  }

  throw new Error("Unhandled spoilerTreatment")
}

export const Index: React.FC<RouteComponentProps> = function Index() {
  const { userSettings } = useAppRouteContext()
  const { character, dispatchCharacterAction } = useCharacterRouteContext()
  const { dispatchCharactersListAction } = useCharactersRouteContext()

  const klass =
    character.classId !== null ? classesById[character.classId] : null

  return (
    <GridContainer>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-name">
          Name
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="character-name"
          value={character.name}
          onChange={event => {
            dispatchCharacterAction({
              type: "name/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-class">
          Class
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <Select
          variant="outlined"
          fullWidth
          id="character-class"
          value={klass !== null ? klass.id : ""}
          renderValue={(classId: ClassId) => {
            return (
              <div style={{ display: "flex", alignItems: "center" }}>
                <div style={{ height: 20, width: 20, marginRight: 8 }}>
                  <ClassIcon classId={classId} />
                </div>
                <span>{getClassDisplayName(classId, userSettings)}</span>
              </div>
            )
          }}
          onChange={event => {
            const selectedClass: ClassId | null =
              event.target.value !== "" ? (event.target.value as ClassId) : null
            dispatchCharacterAction({
              type: "class-id/set",
              payload: selectedClass,
            })
          }}
        >
          <MenuItem value="">Select a class</MenuItem>
          {Object.values(classesById)
            // only show unlocked classes
            .filter(
              c =>
                c.spoilerTreatment.type === "none" ||
                userSettings.unlocks[c.id] === true
            )
            .map(classOption => (
              <MenuItem
                key={classOption.id}
                value={classOption.id}
                style={{ display: "flex", alignItems: "center" }}
              >
                <div style={{ height: 40, width: 40, marginRight: 16 }}>
                  <ClassIcon classId={classOption.id} />
                </div>
                <span>{getClassDisplayName(classOption.id, userSettings)}</span>
              </MenuItem>
            ))}
        </Select>
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-xp">
          XP
        </Typography>
      </GridItem>
      <GridItem span={2}>
        <TextField
          variant="outlined"
          fullWidth
          id="character-xp"
          type="number"
          value={character.xp !== 0 ? character.xp : ""}
          onChange={event => {
            dispatchCharacterAction({
              type: "xp/set",
              payload: parseInt(event.target.value, 10) || 0,
            })
          }}
        />
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography>
          <span style={{ fontSize: 12, color: "#999" }}>lvl</span>{" "}
          <span style={{ fontSize: 32 }}>{getLevel(character.xp)}</span>
        </Typography>
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-gold">
          Gold
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          variant="outlined"
          fullWidth
          id="character-gold"
          type="number"
          value={character.gold !== 0 ? character.gold : ""}
          onChange={event => {
            dispatchCharacterAction({
              type: "gold/set",
              payload: parseInt(event.target.value, 10) || 0,
            })
          }}
        />
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-notes">
          Notes
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          id="character-notes"
          value={character.notes}
          onChange={event => {
            dispatchCharacterAction({
              type: "notes/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography component="label" htmlFor="character-items">
          Items
        </Typography>
      </GridItem>
      <GridItem span={3}>
        <TextField
          multiline
          rows={4}
          variant="outlined"
          fullWidth
          id="character-items"
          value={character.items}
          onChange={event => {
            dispatchCharacterAction({
              type: "items/set",
              payload: event.target.value,
            })
          }}
        />
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography id="character-battle-goals-label">Battle Goals</Typography>
      </GridItem>
      <GridItem span={3}>
        <FormGroup aria-labelledby="character-battle-goals-label">
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              justifyContent: "space-between",
            }}
          >
            {Array.from({ length: 6 }).map((_, groupNumber) => (
              <BattleGoalCheckboxGroup
                key={groupNumber}
                groupNumber={groupNumber}
                battleGoalChecks={character.battleGoalChecks}
                dispatch={dispatchCharacterAction}
              />
            ))}
          </div>
        </FormGroup>
      </GridItem>
      <GridItem span={1} style={{ display: "flex", alignItems: "center" }}>
        <Typography id="retired-label">Retired</Typography>
      </GridItem>
      <GridItem span={3}>
        <Checkbox
          aria-labelledby="retired-label"
          color="primary"
          checked={character.retired}
          onChange={event => {
            dispatchCharacterAction({
              type: "retired/set",
              payload: event.target.checked,
            })
          }}
        />
      </GridItem>
      <GridItem span={4} style={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="outlined"
          style={{ color: red[700], borderColor: red[700] }}
          onClick={() =>
            dispatchCharactersListAction({
              type: "delete",
              payload: character.id,
            })
          }
        >
          Delete {character.name}
        </Button>
      </GridItem>
    </GridContainer>
  )
}

function BattleGoalCheckboxGroup({
  groupNumber,
  battleGoalChecks,
  dispatch,
}: {
  groupNumber: number
  battleGoalChecks: number
  dispatch: ReturnType<
    typeof useCharacterRouteContext
  >["dispatchCharacterAction"]
}) {
  const theme = useTheme()

  return (
    <div
      style={{
        display: "flex",
        border: `1px solid ${
          battleGoalChecks >= (groupNumber + 1) * 3
            ? theme.palette.primary.main
            : "rgba(0, 0, 0, 0.23)"
        }`,
        borderRadius: 4,
        marginBottom: 8,
      }}
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const checkboxNumber = index + groupNumber * 3 + 1
        return (
          <Checkbox
            color="primary"
            key={checkboxNumber}
            checked={battleGoalChecks >= checkboxNumber}
            onChange={event => {
              if (event.target.checked && battleGoalChecks < checkboxNumber) {
                dispatch({ type: "battle-goal-checks/add" })
              } else if (
                !event.target.checked &&
                battleGoalChecks >= checkboxNumber
              ) {
                dispatch({ type: "battle-goal-checks/remove" })
              }
            }}
          />
        )
      })}
    </div>
  )
}
