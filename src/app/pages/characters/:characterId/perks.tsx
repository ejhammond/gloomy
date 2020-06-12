import * as React from "react"
import { RouteComponentProps } from "@reach/router"
import Checkbox from "@material-ui/core/Checkbox"
import Typography from "@material-ui/core/Typography"

import { GridContainer, GridItem } from "../../../../components/grid"
import { Heading } from "../../../../components/heading"
import { useCharacterRouteContext } from "./routes"
import { classesById } from "../../../../configs/classes"
import { perks } from "../../../../configs/perks"
import { PerkData } from "../../../../types"
import { AttackModifierCard } from "../../../../components/attack-modifier-card"
import { HStack } from "../../../../components/h-stack"
import { parseCardType } from "../../../../configs/cards"

const countToString = {
  1: "one",
  2: "two",
  3: "three",
  4: "four",
}

export const Perks: React.FC<RouteComponentProps> = function Perks() {
  const { character, dispatchCharacterAction } = useCharacterRouteContext()

  const klass =
    character.classId !== null ? classesById[character.classId] : null

  const klassPerks = klass.perks.map(p => ({
    ...p,
    ...perks[p.id],
    checks: character.perkChecks[p.id] ?? 0,
  }))

  return (
    <GridContainer>
      <GridItem span={4}>
        <Heading component="h1">Perks</Heading>
      </GridItem>
      <GridItem
        span={4}
        style={{
          display: "grid",
          gridTemplateColumns: "max-content auto",
          gridRowGap: 8,
          alignItems: "center",

          marginBottom: 16,
        }}
      >
        {klassPerks.map(perk => (
          <React.Fragment key={perk.id}>
            <span>
              {Array.from({ length: perk.stock }).map((_, i) => (
                <Checkbox
                  color="primary"
                  key={`perk-${perk.id}/${i}`}
                  id={`perk-${perk.id}/${i}`}
                  checked={perk.checks > i}
                  onChange={e => {
                    if (e.target.checked) {
                      dispatchCharacterAction({
                        type: "perk-checks/add",
                        payload: perk.id,
                      })
                    } else {
                      dispatchCharacterAction({
                        type: "perk-checks/remove",
                        payload: perk.id,
                      })
                    }
                  }}
                />
              ))}
            </span>
            {/*
          The way that the checkboxes work is kinda interesting
          They always fill from left to right
          So, even if you click on the third checkbox in a row, the first one will get the check

          We can leverage that behavior with our label
          We make the label point to the last checkbox in the row
          So tapping the label multiple times will fill in each checkbox one-by-one
          However, if you tap the label after they're all full, the last checkbox will un-check
          That feels weird, so we'll just disable the label once all checkboxes are full
        */}
            <label
              htmlFor={
                perk.checks < perk.stock
                  ? `perk-${perk.id}/${perk.stock - 1}`
                  : undefined
              }
            >
              <PerkDescription
                deckModifications={perk.deckModifications}
                nonDeckEffect={perk.nonDeckEffect}
              />
            </label>
          </React.Fragment>
        ))}
      </GridItem>
    </GridContainer>
  )
}

function PerkDescription({
  deckModifications,
  nonDeckEffect,
}: {
  deckModifications: PerkData["deckModifications"]
  nonDeckEffect?: PerkData["nonDeckEffect"]
}) {
  const { add, remove } = deckModifications

  const modificationType =
    add !== undefined && remove !== undefined
      ? "replace"
      : add !== undefined
      ? "add"
      : remove !== undefined
      ? "remove"
      : "none"

  let template: string
  switch (modificationType) {
    case "add":
      template =
        nonDeckEffect !== undefined ? `${nonDeckEffect} and add $a` : "Add $a"
      break
    case "remove":
      template =
        nonDeckEffect !== undefined
          ? `${nonDeckEffect} and remove $a`
          : "Remove $r"
      break
    case "replace":
      template =
        nonDeckEffect !== undefined
          ? `${nonDeckEffect} and replace $r with $a`
          : "Replace $r with $a"
      break
    case "none":
      template = nonDeckEffect !== undefined ? nonDeckEffect : ""
  }

  const templateParts = template.split(" ")
  const descriptionParts = []
  templateParts.forEach(part => {
    if (part === "$a") {
      add.forEach((a, i) => {
        descriptionParts.push(
          countToString[a.count] !== undefined
            ? countToString[a.count]
            : a.count
        )
        descriptionParts.push(
          <AttackModifierCard
            variant="inline"
            card={parseCardType(a.cardType)}
          />
        )
        descriptionParts.push(a.count === 1 ? "card" : "cards")
        if (i < add.length - 1) {
          descriptionParts.push("and")
        }
      })
    } else if (part === "$r") {
      remove.forEach((r, i) => {
        descriptionParts.push(
          countToString[r.count] !== undefined
            ? countToString[r.count]
            : r.count
        )
        descriptionParts.push(
          <AttackModifierCard
            variant="inline"
            card={parseCardType(r.cardType)}
          />
        )
        descriptionParts.push(r.count === 1 ? "card" : "cards")
        if (i < remove.length - 1) {
          descriptionParts.push("and")
        }
      })
    } else {
      descriptionParts.push(part)
    }
  })

  return (
    <Typography component="div">
      <HStack spacing={4}>
        {descriptionParts.map((p, i) => {
          return <span key={i}>{p}</span>
        })}
      </HStack>
    </Typography>
  )
}
