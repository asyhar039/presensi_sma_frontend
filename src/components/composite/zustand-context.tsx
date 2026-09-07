import type { StateCreator, StoreApi } from 'zustand'

import { createContext, useContext, useRef } from 'react'
import { create, useStore as useZustandStore } from 'zustand'

type ProviderProps<P> = [P] extends [undefined] ? { data?: never } : { data: P }

function zustandContext<S, P = undefined>(
  createState: (props: P) => StateCreator<S>,
  message = 'Hook must be used within a Provider',
) {
  const StoreContext = createContext<StoreApi<S> | null>(null)

  const Provider: React.FC<React.PropsWithChildren<ProviderProps<P>>> = ({
    children,
    ...props
  }) => {
    const storeRef = useRef<StoreApi<S> | null>(null)
    if (!storeRef.current) {
      const data = (props as { data?: P }).data as P
      storeRef.current = create(createState(data))
    }

    return (
      <StoreContext.Provider value={storeRef.current}>
        {children}
      </StoreContext.Provider>
    )
  }

  function useStore<T>(selector: (state: S) => T): T
  function useStore(): S
  function useStore<T>(selector?: (state: S) => T) {
    const store = useContext(StoreContext)

    if (store === null) {
      throw new Error(message)
    }

    return useZustandStore(store, selector as (state: S) => T | S)
  }

  return [Provider, useStore] as const
}

export default zustandContext
