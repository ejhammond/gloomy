import * as React from "react"
import { IconButton, TextField } from "@material-ui/core"
import AddIcon from "@material-ui/icons/Add"
import RemoveIcon from "@material-ui/icons/Remove"

export function Counter({
  value,
  onChange,
  layout = "horizontal",
  ...delegatedProps
}: Omit<
  React.ComponentPropsWithoutRef<typeof TextField>,
  "onChange" | "value"
> & {
  value: number | string
  onChange: (num: number) => void
  layout?: "horizontal" | "vertical"
}) {
  let numValue = typeof value === "string" ? parseInt(value, 10) : value
  if (isNaN(numValue)) {
    numValue = 0
  }

  const plusButton = (
    <IconButton key="plus-button" onClick={() => onChange(numValue + 1)}>
      <AddIcon />
    </IconButton>
  )

  const minusButton = (
    <IconButton key="minus-button" onClick={() => onChange(numValue - 1)}>
      <RemoveIcon />
    </IconButton>
  )

  const textField = (
    <TextField
      key="textfield"
      type="number"
      variant="outlined"
      value={numValue === 0 ? "" : numValue}
      style={{ maxWidth: 80, backgroundColor: "white" }}
      inputProps={{
        style: { textAlign: "center", fontSize: "36px", padding: "8px" },
      }}
      onChange={event => {
        const num = parseInt(event.target.value, 10)
        if (isNaN(num)) {
          onChange(0)
        } else {
          onChange(num)
        }
      }}
      {...delegatedProps}
    />
  )

  const components =
    layout === "horizontal"
      ? [minusButton, textField, plusButton]
      : [plusButton, textField, minusButton]
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        flexWrap: "nowrap",
        flexDirection: layout === "horizontal" ? "row" : "column",
      }}
    >
      {components}
    </div>
  )
}
