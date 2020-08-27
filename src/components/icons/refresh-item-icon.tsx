import * as React from "react"

import refreshIconURL from "../../images/general/refresh.png"

export function RefreshItemIcon() {
  return (
    <div
      style={{
        width: "inherit",
        height: "inherit",

        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        style={{ maxWidth: "100%", maxHeight: "100%" }}
        src={refreshIconURL}
        alt="Refresh an item"
      />
    </div>
  )
}
