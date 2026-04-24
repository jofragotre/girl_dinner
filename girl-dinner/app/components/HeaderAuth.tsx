import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import { currentUser } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function HeaderAuth() {
  const user = await currentUser()
  const isAdmin = user?.publicMetadata?.role === 'admin'

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-3">
      {isAdmin && (
        <Link
          href="/admin"
          className="text-[10px] uppercase tracking-[0.2em] font-semibold neon-pink-text hover:opacity-70 transition-opacity"
        >
          admin
        </Link>
      )}
      <SignedOut>
        <SignInButton mode="modal">
          <button className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#F5E6F0]/40 hover:text-[#F5E6F0]/70 transition-colors cursor-pointer">
            sign in
          </button>
        </SignInButton>
      </SignedOut>
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              avatarBox: 'w-7 h-7',
            },
          }}
        />
      </SignedIn>
    </div>
  )
}
