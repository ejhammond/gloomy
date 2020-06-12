import * as React from "react"
import { ThemeProvider } from "./theme"
import { LoadingProvider } from "./loading"

export function Providers({ children }) {
  return (
    <ThemeProvider>
      <LoadingProvider>{children}</LoadingProvider>
    </ThemeProvider>
  )
}
