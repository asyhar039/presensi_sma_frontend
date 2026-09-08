import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { getInitials } from '@/utils/user'

interface UserAvatarProps {
  className?: string
  name: string
  initials?: string
}

export function UserAvatar({ className, name, initials }: UserAvatarProps) {
  return (
    <Avatar className={className}>
      <AvatarFallback>{initials || getInitials(name)}</AvatarFallback>
    </Avatar>
  )
}
