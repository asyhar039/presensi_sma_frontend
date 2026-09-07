import { createLazyFileRoute } from '@tanstack/react-router'

import { Typography } from '@/components/ui/typography'

export const Route = createLazyFileRoute('/dashboard/')({
  component: () => {
    return (
      <div className="flex h-full min-h-svh w-full flex-col items-center justify-center gap-6 p-6">
        <Typography as="h1" variant="h1">
          Dashboard Page
        </Typography>
      </div>
    )
  },
})
