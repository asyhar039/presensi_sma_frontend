import { IconArrowLeft } from '@tabler/icons-react'
import { Link } from '@tanstack/react-router'

import { Button } from '@/components/ui/button'

export function BackButton() {
  return (
    <Button
      aria-label="Back to home"
      render={<Link to="/" />}
      nativeButton={false}
      className="px-4"
      variant="ghost"
    >
      <IconArrowLeft stroke={2} />
      <span>Back</span>
    </Button>
  )
}
