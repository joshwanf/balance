import { getSessionUser } from "@/server/auth"
import { SignupButton } from "@/components/Landing/SignupButton"
import { LoginButton } from "@/components/Landing/LoginButton"
import Link from "next/link"

export const TopBar = async () => {
  const user = await getSessionUser()

  return (
    <nav className="py-4 flex justify-end">
      <div>
        {!user ? (
          <>
            <SignupButton />
            <LoginButton />
          </>
        ) : (
          <Link
            href="/my-balance"
            className="mx-1 px-6 py-2 bg-slate-500 text-white rounded-lg hover:bg-slate-900 transition-all duration-1000"
          >
            My Balance
          </Link>
        )}
      </div>
    </nav>
  )
}
