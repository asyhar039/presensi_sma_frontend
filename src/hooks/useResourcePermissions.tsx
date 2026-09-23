import { useAppSelector } from '../app/hooks'
import { selectUserPermissions } from '../features/auth/authSelectors'
import { canCreate, canDelete, canEdit, canView } from '../utils/permissions'

export function useResourcePermissions(resource: string) {
  const permissions = useAppSelector(selectUserPermissions)
  return {
    canCreate: canCreate(permissions, resource),
    canEdit: canEdit(permissions, resource),
    canDelete: canDelete(permissions, resource),
    canView: canView(permissions, resource),
  }
}
