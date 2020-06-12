import * as React from "react"

import shuffleIconURL from "../../images/general/shuffle.png"

export function ShuffleIcon() {
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
        src={shuffleIconURL}
        alt="Shuffle"
      />
    </div>
  )
}
