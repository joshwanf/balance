import "server-only"
import { NextRequest, NextResponse } from "next/server"
import { Prisma } from "@prisma/client"
import { apiError, isApiErrorBody } from "./errors"
import { getSessionUser, SessionUser } from "./auth"

type Params = Record<string, string | string[]>
type Ctx<P extends Params> = { params: Promise<P> }

type Handler<P extends Params> = (
  request: NextRequest,
  ctx: Ctx<P>
) => Promise<Response>

type AuthedHandler<P extends Params> = (
  request: NextRequest,
  ctx: { params: P; user: SessionUser }
) => Promise<Response>

const toResponse = (e: unknown) => {
  if (isApiErrorBody(e)) {
    return NextResponse.json(e, { status: e.status })
  }
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    const status = e.code === "P2025" ? 404 : 400
    return NextResponse.json(
      apiError(status, "Database error", e.message, { code: e.code }),
      { status }
    )
  }
  console.error(e)
  return NextResponse.json(
    apiError(500, "Server error", "Something went wrong"),
    { status: 500 }
  )
}

/**
 * Same-origin check for state-changing requests: the token cookie is
 * sameSite lax, and this rejects cross-site POST/PATCH/DELETE outright.
 */
const isCrossSite = (request: NextRequest) => {
  if (["GET", "HEAD", "OPTIONS"].includes(request.method)) return false
  const origin = request.headers.get("origin")
  if (!origin) return false
  return origin !== request.nextUrl.origin
}

/** Catches thrown { title, status, ... } objects (old error formatter). */
export const withErrors =
  <P extends Params = Params>(handler: Handler<P>): Handler<P> =>
  async (request, ctx) => {
    if (isCrossSite(request)) {
      return toResponse(apiError(403, "Forbidden", "Cross-site request"))
    }
    try {
      return await handler(request, ctx)
    } catch (e) {
      return toResponse(e)
    }
  }

/** Requires a logged-in user (old isLoggedIn) and resolves params. */
export const withAuth = <P extends Params = Params>(
  handler: AuthedHandler<P>
): Handler<P> =>
  withErrors<P>(async (request, ctx) => {
    const user = await getSessionUser()
    if (!user) {
      throw apiError(401, "User isn't logged in!", "Unauthorized")
    }
    const params = ctx?.params ? await ctx.params : ({} as P)
    return handler(request, { params, user })
  })

/** Parses a JSON body, returning {} for an empty or invalid body. */
export const readJson = async <T>(request: NextRequest): Promise<Partial<T>> => {
  try {
    return (await request.json()) as Partial<T>
  } catch {
    return {}
  }
}

export const searchParam = (request: NextRequest, key: string) =>
  request.nextUrl.searchParams.get(key) ?? undefined

/** Comma-separated list param, e.g. ?ids=a,b */
export const listParam = (request: NextRequest, key: string) =>
  (request.nextUrl.searchParams.get(key) ?? "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean)

export const noContent = () => new Response(null, { status: 204 })
