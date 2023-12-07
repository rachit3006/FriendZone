import express from "express";
import { login,register,logout,search } from "../controllers/auth.js";

const router = express.Router()

router.post("/login", login)
router.post("/register", register)
router.post("/logout", logout)
router.post("/search", search)

export default router