// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAppSelector(selector: (state: any) => any): any {
  return selector({ auth: { permissions: [] } })
}

export function useAppDispatch(): () => void {
  return () => {}
}
