import { useMemo } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getInitials } from '@/utils/user'

interface UserAvatarProps {
  className?: string
  name: string
  initials?: string
  avatar?: string | null
}

export function UserAvatar({
  className,
  name,
  initials,
  avatar,
}: UserAvatarProps) {
  const avatarUrl = useMemo(() => {
    if (!avatar) {
      return undefined
    }

    if (avatar.startsWith('avatar:')) {
      return `/images/avatar/${avatar.slice(7)}.png`
    }

    return avatar
  }, [avatar])

  return (
    <Avatar className={className}>
      {avatarUrl && <AvatarImage src={avatarUrl} alt={name} />}
      <AvatarFallback>{initials || getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
