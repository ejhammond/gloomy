import * as React from "react"

import healIconURL from "../../images/general/heal.png"

export function HealIcon() {
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
        src={healIconURL}
        alt="Heal"
      />
    </div>
  )
}
