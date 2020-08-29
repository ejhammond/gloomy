import * as React from "react"

export function HStack({
  children,
  spacing,
  vAlign,
  wrap = true,
}: {
  children: React.ComponentPropsWithoutRef<"div">["children"]
  spacing: React.CSSProperties["margin"]
  wrap?: boolean
  vAlign?: React.CSSProperties["alignItems"]
}) {
  const nChildren = React.Children.count(children)

  return (
    <div
      style={{
        display: "flex",
        flexWrap: wrap ? "wrap" : "nowrap",
        alignItems: vAlign,
      }}
    >
      {React.Children.map(children, (child, i) => (
        <div
          key={`h-stack-${i}`}
          style={{
            marginRight: i < nChildren - 1 ? spacing : undefined,
          }}
        >
          {child}
        </div>
      ))}
    </div>
  )
}
