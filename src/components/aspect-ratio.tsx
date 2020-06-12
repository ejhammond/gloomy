import * as React from "react"

const AspectRatioBase = React.forwardRef((props, ref) => {
  const {
    aspectRatio,

    className,
    style = {},
    ...otherProps
  } = props

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "relative",
        paddingBottom: `${aspectRatio * 100}%`,
        width: "100%",
        ...style,
      }}
      {...otherProps}
    />
  )
})

AspectRatioBase.displayName = "AspectRatioBase"

export { AspectRatioBase }

const AspectRatioContent = React.forwardRef((props, ref) => {
  const { style = {}, ...otherProps } = props

  return (
    <div
      ref={ref}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        ...style,
      }}
      {...otherProps}
    />
  )
})

AspectRatioContent.displayName = "AspectRatioContent"

export { AspectRatioContent }

const AspectRatio = React.forwardRef((props, ref) => {
  const {
    contentProps = {},

    children,
    ...baseProps
  } = props

  return (
    <AspectRatioBase ref={ref} {...baseProps}>
      <AspectRatioContent {...contentProps}>{children}</AspectRatioContent>
    </AspectRatioBase>
  )
})

AspectRatio.displayName = "AspectRatio"

export { AspectRatio }
