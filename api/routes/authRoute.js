import express from "express"
import { signin, signup, google, signout, adminSignIn, googleAdmin } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup",signup)
router.post("/signin",signin)
router.post("/google",google)
router.get("/signout",signout)
router.post("/admin/signin",adminSignIn)
router.post("/admin/google",googleAdmin)

export default router;