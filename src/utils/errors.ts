export function getErrorMessage(
  error: unknown,
  defaultMessage: string,
): string {
  if (error instanceof Error) {
    return error.message || defaultMessage
  }
  return defaultMessage
}

export function isMaintenanceError(error: unknown): boolean {
  if (error instanceof Error && error.message) {
    const msg = error.message.toLowerCase()
    return (
      msg.includes('maintenance') ||
      msg.includes('sedang') ||
      msg.includes('perawatan')
    )
  }
  return false
}
