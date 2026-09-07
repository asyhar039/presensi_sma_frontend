import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerPopup,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer'
import { useMobileBreakpoint } from '@/hooks/use-breakpoints'
import { useDisclosure } from '@/hooks/use-disclosure'

export interface ResponsiveDialogProps {
  title: string
  description: string
  isOpen?: boolean
  onIsOpenChange?: (isOpen: boolean) => void
  onIsOpenChangeComplete?: (isOpen: boolean) => void
  trigger?: React.ReactElement
  children?: React.ReactNode
}

export function ResponsiveDialog({
  title,
  description,
  isOpen: controlledIsOpen,
  onIsOpenChange,
  onIsOpenChangeComplete,
  trigger,
  children,
}: ResponsiveDialogProps) {
  const isMobile = useMobileBreakpoint()
  const localDisclosure = useDisclosure(false)

  const isControlled = controlledIsOpen !== undefined
  const open = isControlled ? controlledIsOpen : localDisclosure.isOpen
  const handleOpenChange = isControlled
    ? onIsOpenChange
    : localDisclosure.toggle

  if (isMobile) {
    return (
      <Drawer
        open={open}
        onOpenChange={handleOpenChange}
        onOpenChangeComplete={onIsOpenChangeComplete}
      >
        <DrawerTrigger render={trigger} />
        <DrawerPopup>
          <div className="border-b px-4 pb-4 mb-6">
            <DrawerTitle>{title}</DrawerTitle>
            <DrawerDescription>{description}</DrawerDescription>
          </div>
          <DrawerContent>{children}</DrawerContent>
        </DrawerPopup>
      </Drawer>
    )
  }

  return (
    <Dialog
      open={open}
      onOpenChange={handleOpenChange}
      onOpenChangeComplete={onIsOpenChangeComplete}
    >
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  )
}
