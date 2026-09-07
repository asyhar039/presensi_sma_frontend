import type { Button } from '@/components/ui/button'

import { deepEqual } from '@tanstack/react-router'
import { create } from 'zustand'

export interface ConfirmationCallback {
  close: () => void
  loading: (loading: boolean) => void
}

export interface ConfirmationData {
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>
  title?: string
  description?: string
  hideCancel?: boolean
  hideClose?: boolean
  hideAction?: boolean
  actionLabel?: string
  cancelLabel?: string
  actionVariant?: React.ComponentProps<typeof Button>['variant']
  cancelVariant?: React.ComponentProps<typeof Button>['variant']
  onAction?: (props: ConfirmationCallback) => Promise<void> | void
  onCancel?: (props: ConfirmationCallback) => void
}

interface ConfirmationState {
  data: ConfirmationData | null
  isOpen: boolean
  isActionLoading: boolean
  isCancelLoading: boolean
  show: (data: ConfirmationData) => void
  close: () => void
  actionLoading: (isLoading: boolean) => void
  cancelLoading: (isLoading: boolean) => void
}

export const useConfirmationStore = create<ConfirmationState>((set, get) => ({
  data: null,
  isOpen: false,
  isActionLoading: false,
  isCancelLoading: false,
  show: (data) => set({ data, isOpen: true }),
  close: () => {
    const { isActionLoading, isCancelLoading, data } = get()
    if (isActionLoading || isCancelLoading) return
    set({ isOpen: false })
    const timeout = setTimeout(() => {
      const newData = get().data
      if (deepEqual(data, newData)) {
        set({ data: null })
      }
      clearTimeout(timeout)
    }, 500)
  },
  actionLoading: (isLoading) => set({ isActionLoading: isLoading }),
  cancelLoading: (isLoading) => set({ isCancelLoading: isLoading }),
}))
