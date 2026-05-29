import { RouterProvider } from 'react-router/dom'
import { router } from '../routes/router'
import { AppProviders } from './providers'

export function RootApp() {
  return <AppProviders><RouterProvider router={router} /></AppProviders>
}
