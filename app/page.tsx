import { Button } from '@/components/ui/button'
import { UserButton } from '@clerk/nextjs'
import { auth } from '@clerk/nextjs/server'
import Link from 'next/link'

export default async function HomePage() {
  const { userId } = auth()

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <nav className="border-b bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-2xl font-bold text-gray-900">Retail ERP</h1>
            <div className="flex items-center gap-4">
              {userId ? (
                <>
                  <Link href="/dashboard">
                    <Button>Go to Dashboard</Button>
                  </Link>
                  <UserButton afterSignOutUrl="/" />
                </>
              ) : (
                <Link href="/sign-in">
                  <Button>Sign In</Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Modern ERP for Retail Business
          </h2>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            Streamline your inventory, sales, and operations with our comprehensive ERP solution
          </p>
          <div className="mt-5 max-w-md mx-auto sm:flex sm:justify-center md:mt-8">
            {!userId && (
              <Link href="/sign-up">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started
                </Button>
              </Link>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}