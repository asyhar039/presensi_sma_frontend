import { Outlet, createLazyFileRoute } from '@tanstack/react-router'

export const Route = createLazyFileRoute('/dashboard')({
  // TODO: add layout based on user role
  component: () => <Outlet />,
})
