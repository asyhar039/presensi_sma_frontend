import {
  RouterProvider as BaseRouterProvider,
  createRouter,
} from '@tanstack/react-router'

import { LoadingScreen } from '@/components/composite/loading-screen'
import { NotFound } from '@/components/composite/not-found'
import { useAuth } from '@/context/auth-context'
import { queryClient } from '@/lib/react-query'
import { routeTree } from '@/routeTree.gen'

export const router = createRouter({
  routeTree,
  context: {
    // biome-ignore lint/style/noNonNullAssertion: The auth will be provided in the RouterProvider component, so we can assert it as non-null here.
    auth: undefined!,
    queryClient,
  },
  search: {
    strict: true,
  },
  scrollRestorationBehavior: 'smooth',
  defaultPreload: 'intent',
  defaultPreloadStaleTime: 0,
  defaultPendingMinMs: 0,
  defaultPendingComponent: () => <LoadingScreen message="Loading pages..." />,
  defaultNotFoundComponent: () => <NotFound />,
  notFoundMode: 'root',
})

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }

  interface HistoryState {
    redirectTo?: string
    state?: string
  }
}

export function RouterProvider() {
  const auth = useAuth()

  return <BaseRouterProvider router={router} context={{ auth }} />
}
