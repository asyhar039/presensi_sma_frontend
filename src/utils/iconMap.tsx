import {
  IconAlertCircle,
  IconAlertTriangle,
  IconAlignLeft,
  IconAward,
  IconBook,
  IconCalendar,
  IconChevronDown,
  IconChevronLeft,
  IconCircleCheck,
  IconClock,
  IconDoor,
  IconDownload,
  IconPlus,
  IconPrinter,
  IconRefresh,
  IconTool,
  IconX,
} from '@tabler/icons-react'

const iconMap: Record<
  string,
  React.FC<{ className?: string } & Record<string, unknown>>
> = {
  'graduation-cap': IconAward as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  clock: IconClock as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'align-left': IconAlignLeft as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'chevron-left': IconChevronLeft as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'chevron-down': IconChevronDown as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'check-circle': IconCircleCheck as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'alert-circle': IconAlertCircle as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'exclamation-triangle': IconAlertTriangle as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  calendar: IconCalendar as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  door: IconDoor as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  download: IconDownload as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  plus: IconPlus as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  printer: IconPrinter as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  'book-open': IconBook as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  xmark: IconX as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  wrench: IconTool as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
  rotate: IconRefresh as unknown as React.FC<
    { className?: string } & Record<string, unknown>
  >,
}

export function RenderIcon({
  name,
  className,
  ...props
}: {
  name: string
  className?: string
}) {
  const Icon = iconMap[name]
  if (!Icon) return null
  return <Icon className={className} {...(props as Record<string, unknown>)} />
}

export default RenderIcon
