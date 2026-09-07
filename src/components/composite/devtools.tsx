import React, { Suspense } from 'react'

import { IS_PRODUCTION } from '@/constants/app'

const TanStackDevtools = React.lazy(() =>
  import('@tanstack/react-devtools').then((mod) => ({
    default: mod.TanStackDevtools,
  })),
)

const TanStackRouterDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-router-devtools').then((mod) => ({
    default: mod.TanStackRouterDevtoolsPanel,
  })),
)

const TanStackFormDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-form-devtools').then((mod) => ({
    default: mod.FormDevtoolsPanel,
  })),
)

const TanStackQueryDevtoolsPanel = React.lazy(() =>
  import('@tanstack/react-query-devtools').then((mod) => ({
    default: mod.ReactQueryDevtoolsPanel,
  })),
)

export function Devtools() {
  if (IS_PRODUCTION) return null

  return (
    <Suspense fallback={null}>
      <TanStackDevtools
        config={{
          position: 'middle-right',
          defaultOpen: false,
        }}
        plugins={[
          {
            name: 'Tanstack Router',
            render: <TanStackRouterDevtoolsPanel />,
          },
          {
            name: 'Tanstack Form',
            render: <TanStackFormDevtoolsPanel />,
          },
          {
            name: 'Tanstack Query',
            render: <TanStackQueryDevtoolsPanel />,
          },
        ]}
      />
    </Suspense>
  )
}
