import { redirect } from 'next/navigation'

export default function HomePage() {
  // Redirect to sign-in page since we don't have a dashboard yet
  redirect('/auth/signin')
}