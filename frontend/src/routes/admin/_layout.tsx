import { createFileRoute, Outlet } from '@tanstack/react-router'
import { adminGuard } from '@/guards/adminGuard'

// This layout route exists solely to run adminGuard via beforeLoad.
// The visual admin shell (sidebar, top bar, content area) is rendered in
// __root.tsx because the routeTree nests all admin pages under root,
// not under this layout — so this component would never wrap them visually.
export const Route = createFileRoute('/admin/_layout')({
  beforeLoad: adminGuard,
  component: () => <Outlet />,
})
