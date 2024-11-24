import express from "express"
import restoreUser from "./session/restoreUser"
import protectedRouter from "./protected/protected"
import sessionRouter from "./session"
import transactionRouter from "./transaction"
import budgetRouter from "./budget"
import itemRouter from "./item"

const router = express.Router()

router.use(restoreUser)
router.use("/session", sessionRouter)
router.use("/transaction", transactionRouter)
router.use("/budget", budgetRouter)
router.use("/item", itemRouter)
router.use("/protected", protectedRouter)

export default router
