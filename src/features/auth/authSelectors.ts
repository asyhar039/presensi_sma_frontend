export const selectUserPermissions = (state: any) =>
  state.auth?.permissions || []
