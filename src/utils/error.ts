import type { AnyFormApi } from '@tanstack/react-form'

import { toast } from 'sonner'

import { FALLBACK_MESSAGE } from '@/constants/app'
import { UnprocessableEntityError } from '@/lib/api-errors'

export function getErrorMessage(
  error: unknown,
  defaultMessage: string = FALLBACK_MESSAGE,
): string {
  if (error instanceof Error) {
    return error.message || defaultMessage
  }

  return defaultMessage
}

export function formErrorHandler(
  error: unknown,
  form: AnyFormApi,
  message: string = FALLBACK_MESSAGE,
): void {
  if (
    error instanceof UnprocessableEntityError &&
    error.data &&
    Object.keys(error.data).length > 0
  ) {
    const fields = Object.fromEntries(
      Object.entries(error.data).map(([key, value]) => {
        const messages = Array.isArray(value) ? value : [value]
        return [key, messages.map((message) => ({ message }))]
      }),
    )

    form.setErrorMap({
      onServer: {
        fields,
      },
    })

    return
  }

  toast.error(getErrorMessage(error, message))
}
