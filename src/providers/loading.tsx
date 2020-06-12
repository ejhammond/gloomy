import * as React from "react"

const loadingContext = React.createContext<{
  loadingCount: number
  incrementLoadingCount: () => void
  decrementLoadingCount: () => void
}>(undefined)

const LoadingContextProvider = loadingContext.Provider

export function LoadingProvider({ children }) {
  const [loadingCount, setLoadingCount] = React.useState(0)

  const incrementLoadingCount = React.useCallback(() => {
    setLoadingCount(prevCount => {
      return prevCount + 1
    })
  }, [])

  const decrementLoadingCount = React.useCallback(() => {
    setLoadingCount(prevCount => {
      return prevCount - 1
    })
  }, [])

  return (
    <LoadingContextProvider
      value={{ loadingCount, decrementLoadingCount, incrementLoadingCount }}
    >
      {children}
    </LoadingContextProvider>
  )
}

export function Loading() {
  const context = React.useContext(loadingContext)

  if (context === undefined) {
    throw new Error("Missing LoadingProvider")
  }

  const { incrementLoadingCount, decrementLoadingCount } = context

  React.useEffect(() => {
    incrementLoadingCount()

    return decrementLoadingCount
  })

  return null
}

export function useLoading() {
  const context = React.useContext(loadingContext)

  if (context === undefined) {
    throw new Error("Missing LoadingProvider")
  }

  const { loadingCount } = context

  return loadingCount !== 0
}
