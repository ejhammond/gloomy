import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import FormGroup from "@material-ui/core/FormGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import Checkbox from "@material-ui/core/Checkbox"
import Icon from "@material-ui/core/Icon"

import { ClassIcon } from "../../components/icons/class-icon"
import { GridContainer, GridItem } from "../../components/grid"
import { classesById } from "../../configs/classes"
import { Heading } from "../../components/heading"
import { useAppRouteContext } from "./routes"

export const Unlocks: React.FC<RouteComponentProps> = function Unlocks() {
  const { userSettings, dispatchUserSettingsAction } = useAppRouteContext()

  return (
    <GridContainer>
      <GridItem span={4}>
        <Heading component="h2">Unlocks</Heading>
        <FormGroup>
          {Object.values(classesById)
            .filter(c => c.spoilerTreatment.type === "name-hidden")
            .map(c => (
              <FormControlLabel
                key={c.id}
                control={
                  <Checkbox
                    name={c.id}
                    color="primary"
                    checked={userSettings.unlocks[c.id] === true}
                    onChange={() =>
                      dispatchUserSettingsAction({
                        type: "unlock/toggle",
                        payload: c.id,
                      })
                    }
                  />
                }
                label={
                  <div style={{ display: "flex" }}>
                    <Icon>
                      <ClassIcon classId={c.id} />
                    </Icon>
                    <span style={{ marginLeft: 8 }}>
                      {userSettings.unlocks[c.id] === true
                        ? c.name
                        : // We've filtered for only spoilerTreatment.type === "name-hidden"
                          // So we can assume that there's a safeName
                          // @ts-ignore
                          c.spoilerTreatment.safeName}
                    </span>
                  </div>
                }
              />
            ))}
          <FormControlLabel
            control={
              <Checkbox
                name="envelope-x"
                color="primary"
                checked={userSettings.unlocks["bladeswarm"] === true}
                onChange={() =>
                  dispatchUserSettingsAction({
                    type: "unlock/toggle",
                    payload: "bladeswarm",
                  })
                }
              />
            }
            label={
              <div style={{ display: "flex", alignItems: "center" }}>
                {userSettings.unlocks["bladeswarm"] === true ? (
                  <Icon>
                    <ClassIcon classId="bladeswarm" />
                  </Icon>
                ) : (
                  <Icon
                    style={{
                      fontFamily: "Pirata One",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <span>x</span>
                  </Icon>
                )}
                <span style={{ marginLeft: 8 }}>
                  {userSettings.unlocks["bladeswarm"] === true
                    ? classesById["bladeswarm"].name
                    : "Envelope X"}
                </span>
              </div>
            }
          />
        </FormGroup>
      </GridItem>
    </GridContainer>
  )
}
