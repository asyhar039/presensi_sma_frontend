# Role-Based Access Control (RBAC) System Documentation

## Overview
Sistem RBAC berbasis permissions memungkinkan kontrol akses yang fleksibel berdasarkan permission spesifik, bukan hanya nama role. Ini memudahkan penambahan role baru tanpa perubahan kode yang ekstensif.

## Architecture

### Backend (PHP)
**File: `app/permissions.php`**
- Mendefinisikan semua permissions yang tersedia
- Memetakan setiap permission ke role yang memilikinya
- Menyediakan helper functions untuk checking permissions

**Middleware: `app/middleware.php`**
- `requireApiPermission($permission)` - Ensure user has specific permission
- `requireApiAnyPermission($permissions)` - Ensure user has at least one permission
- Integrate dengan sistem autentikasi yang ada

**Endpoints**
- Semua endpoint CRUD menggunakan `requirePermission()` bukan `requireApiAdmin()`
- Endpoint me.php mengembalikan user permissions

### Frontend (React)
**Hook: `hooks/usePermissions.js`**
- `usePermissions(user)` - Returns permissions object dengan helper methods
- Methods: `hasPermission()`, `canView()`, `canCreate()`, `canEdit()`, `canDelete()`

**Constants: `constants/permissions.js`**
- Defined all available permissions
- Mapped permissions to roles

**Components:**
- `PermissionGuard` - Conditional rendering based on permissions
- `Layout` - Filters menu items berdasarkan user permissions
- `TableView` - Shows/hides action buttons based on permissions

## Permission Structure

```
Format: {resource}.{action}

Resources:
- dashboard
- siswa
- guru
- kelas
- mapel
- jadwal
- absensi
- laporan

Actions:
- view
- create
- edit
- delete
- input
- scan
- export
```

## Adding a New Role

### 1. Backend - Add Role to Database
```sql
-- Add new role to ENUM in users table
ALTER TABLE users MODIFY role ENUM('admin', 'guru', 'class_teacher', 'principal', 'student') NOT NULL;
```

### 2. Backend - Define Permissions
Edit `app/permissions.php` dan tambahkan role ke `ROLE_PERMISSIONS`:

```php
const ROLE_PERMISSIONS = [
    'admin' => [ /* existing */ ],
    'guru' => [ /* existing */ ],
    'class_teacher' => [
        'dashboard.view',
        'siswa.view',
        'kelas.view',
        'absensi.view', 
        'absensi.input',
        'laporan.view'
    ],
    'principal' => [
        'dashboard.view',
        'siswa.view',
        'guru.view',
        'kelas.view',
        'laporan.view',
        'laporan.export'
    ]
];
```

### 3. Frontend - Add Role Permissions
Edit `src/constants/permissions.js`:

```javascript
export const ROLE_PERMISSIONS = {
    admin: [ /* existing */ ],
    guru: [ /* existing */ ],
    class_teacher: [
        PERMISSIONS.DASHBOARD_VIEW,
        PERMISSIONS.SISWA_VIEW,
        PERMISSIONS.KELAS_VIEW,
        PERMISSIONS.ABSENSI_VIEW,
        PERMISSIONS.ABSENSI_INPUT,
        PERMISSIONS.LAPORAN_VIEW
    ]
};
```

### 4. Login Handler
Backend `api/auth/login.php` dan Frontend `hooks/useAdminDashboard.js` otomatis support role baru karena menggunakan database values.

## Usage Examples

### Backend - Check Permission
```php
require_once __DIR__ . '/../../app/middleware.php';

// Require specific permission
requirePermission('siswa.create');

// Check multiple permissions
if (hasAnyPermission(['laporan.view', 'laporan.export'])) {
    // Allow access
}
```

### Frontend - Hide/Show Elements
```jsx
import { usePermissions } from '../hooks/usePermissions';
import { PermissionGuard } from '../components/PermissionGuard';

function MyComponent({ user }) {
  const { canEdit, canDelete } = usePermissions(user);

  return (
    <div>
      {/* Hide button if user can't edit */}
      {canEdit('siswa') && <button>Edit</button>}
      
      {/* Using PermissionGuard component */}
      <PermissionGuard 
        permission="siswa.delete" 
        permissions={user?.permissions}
      >
        <button>Delete</button>
      </PermissionGuard>
    </div>
  );
}
```

### Frontend - Filter Menu
Menu items automatically filtered berdasarkan user permissions di `Layout.jsx`:
```jsx
const visibleMenu = menuItems.filter((item) =>
  permissions.includes(item.permission)
);
```

## Current Roles

### Admin
- Full access: dashboard, siswa (CRUD), guru (CRUD), kelas (CRUD), mapel (CRUD), jadwal (CRUD), absensi (view & input), laporan (view & export)

### Guru
- Limited access: dashboard, siswa (view), kelas (view), mapel (view), jadwal (view), absensi (view & input), laporan (view)

### Student
- Only: absensi.scan (QR code scanning)

## Benefits

1. **Flexibility**: Tambah role baru tanpa mengubah kode aplikasi
2. **Granular Control**: Control permissions di level granular, bukan hanya role
3. **Easy Maintenance**: Semua permissions terdefinisi di satu tempat
4. **Security**: Permission checks di setiap endpoint API
5. **Consistency**: Frontend & Backend memiliki permission model yang sama
6. **Scalability**: Mudah menambah permissions baru tanpa breaking changes

## Future Enhancements

1. **Database-driven Permissions**: Store role-permission mappings di database untuk dynamic changes
2. **Resource-level Permissions**: Grant permissions berdasarkan resource specific (e.g., guru hanya bisa edit data siswanya)
3. **Audit Logging**: Track semua permission-based actions
4. **Permission Management UI**: Admin interface untuk manage roles & permissions
