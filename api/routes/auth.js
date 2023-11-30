import Express from "express";
import {login,register,logout} from "../controllers/auth.js";

const router = Express.Router()

router.get("login",login)
router.get("register",register)
router.get("logout",logout)

export default router;