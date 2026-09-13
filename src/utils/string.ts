export const strToNumber = (
  value: string | number | undefined,
): number | undefined => {
  if (value === undefined) {
    return undefined
  }

  const parsed = Number(value)
  return Number.isNaN(parsed) ? undefined : parsed
}
