import type { IRouterContext } from '@/types/router.types'

import { Outlet, createRootRouteWithContext } from '@tanstack/react-router'

import { Devtools } from '@/components/composite/devtools'

export const Route = createRootRouteWithContext<IRouterContext>()({
  component: () => (
    <>
      <Outlet />
      <Devtools />
    </>
  ),
})
