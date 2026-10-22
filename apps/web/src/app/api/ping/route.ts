import type { ApiTypes } from "@balance/api-types"

// Placeholder route showing a handler typed with the shared package.
// The Express routes in backend/src/routes/api move here one by one.
export function GET() {
  const body: Pick<ApiTypes.Session.LogOutResponse, "type"> = {
    type: "success",
  }
  return Response.json(body)
}
