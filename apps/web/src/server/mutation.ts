import "server-only"
import { revalidatePath } from "next/cache"
import { requireUser, type SessionUser } from "./auth"

/** An action result that means nothing changed, so there is nothing to refresh */
const isFailure = (result: unknown) =>
  result === null ||
  (typeof result === "object" &&
    "status" in result &&
    (result as { status: unknown }).status === "error")

/**
 * Runs a change for the logged-in user (redirecting to / when there is
 * none), then re-renders everything under /my-balance: the layout's
 * account and category lookups and whichever page is open. Skipped when
 * `fn` returns null or `{ status: "error" }`.
 *
 * Every Server Action that writes data goes through here, so none has to
 * remember its own auth check or revalidatePath.
 */
export const userMutation = async <R>(
  fn: (user: SessionUser) => Promise<R>,
): Promise<R> => {
  const user = await requireUser()
  const result = await fn(user)
  if (!isFailure(result)) revalidatePath("/my-balance", "layout")
  return result
}
