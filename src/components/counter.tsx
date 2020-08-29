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
  value: number
  onChange: (num: number) => void
  layout?: "horizontal" | "vertical"
}) {
  const plusButton = (
    <IconButton key="plus-button" onClick={() => onChange(value + 1)}>
      <AddIcon />
    </IconButton>
  )

  const minusButton = (
    <IconButton key="minus-button" onClick={() => onChange(value - 1)}>
      <RemoveIcon />
    </IconButton>
  )

  const textField = (
    <TextField
      key="textfield"
      type="number"
      variant="outlined"
      value={value === 0 ? "" : value}
      style={{ maxWidth: 80, backgroundColor: "white" }}
      inputProps={{ style: { textAlign: "center" } }}
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
