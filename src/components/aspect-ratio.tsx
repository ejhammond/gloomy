import * as React from "react"

type AspectRatioBaseProps = React.HTMLAttributes<HTMLDivElement> & {
  aspectRatio: number
}

const AspectRatioBase: React.FC<AspectRatioBaseProps> = function AspectRatioBase(
  props,
) {
  const {
    aspectRatio,

    style = {},
    ...otherProps
  } = props

  return (
    <div
      style={{
        position: "relative",
        paddingBottom: `${aspectRatio * 100}%`,
        width: "100%",
        ...style,
      }}
      {...otherProps}
    />
  )
}

const AspectRatioContent: React.FC<React.HTMLAttributes<
  HTMLDivElement
>> = function AspectRatioContent(props) {
  const { style = {}, ...delegated } = props

  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
      {...delegated}
    />
  )
}

const AspectRatio: React.FC<AspectRatioBaseProps> = function AspectRatio(
  props,
) {
  const { children, ...delegated } = props

  return (
    <AspectRatioBase {...delegated}>
      <AspectRatioContent>{children}</AspectRatioContent>
    </AspectRatioBase>
  )
}

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
