import * as React from "react"
import Typography from "@material-ui/core/Typography"

export function Heading({ children, component }) {
  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <div
        style={{
          flexGrow: 1,
          height: 1,
          backgroundColor: "black",
          marginRight: 8,
        }}
      />
      <Typography
        variant="h5"
        component={component}
        style={{ fontFamily: "Pirata One", margin: 0 }}
      >
        {children}
      </Typography>
      <div
        style={{
          flexGrow: 1,
          height: 1,
          marginLeft: 8,
          backgroundColor: "black",
        }}
      />
    </div>
  )
}
