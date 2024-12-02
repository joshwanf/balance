import { uuidv7 } from "uuidv7"
import { ApiTypes } from "../../../types/api"
import { pc } from "../../../utils/prismaClient"
import { setTokenCookie } from "../../../utils/auth"

type Req = ApiTypes.Session.CreateRequest
type Res = ApiTypes.Session.CreateResponse
type Handler = ApiTypes.CustomRouteHandler<Req, Res>

const route: Handler = async (req, res, next) => {
  const { firstName, lastName, username, email, password } = req.body
  const isValidFirstname = firstName && firstName.length > 0
  const isValidLastname = lastName && lastName.length > 0
  const isValidUsername = username && username.length >= 4
  const isValidPassword = password && password.length >= 6

  const isValidBody =
    isValidFirstname && isValidLastname && isValidUsername && isValidPassword

  if (!isValidBody) {
    return next({
      title: "Create user",
      error: "Include a first name, last name, username, email, and password",
      status: 400,
    })
  }

  const existingUser = await pc.user.findFirst({
    where: { OR: [{ username: username }, { email: email }] },
  })
  if (existingUser) {
    return next({
      title: "Create user",
      error: "Username/email already exist",
      status: 400,
    })
  }

  const result = await pc.$transaction(async prisma => {
    const newUser = await prisma.user.create({
      data: {
        id: uuidv7(),
        firstName,
        lastName,
        email,
        username,
        hashedPassword: password,
      },
    })

    const { hashedPassword, ...safeUser } = newUser
    return safeUser
  })
  req.user = result
  setTokenCookie(res, result)
  res.status(200).send(result)
}

export default route
