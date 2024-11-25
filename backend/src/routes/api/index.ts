import express from "express"
import restoreUser from "./session/restoreUser"
import sessionRouter from "./session"
import transactionRouter from "./transaction"
import categoryRouter from "./category"
// import budgetRouter from "./budget"
import protectedRouter from "./protected/protected"

const router = express.Router()

router.use(restoreUser)
router.use("/session", sessionRouter)
router.use("/transaction", transactionRouter)
router.use("/category", categoryRouter)
// router.use("/budget", budgetRouter)
router.use("/protected", protectedRouter)

export default router
