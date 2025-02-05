import express from "express";
import { verifyToken } from "../utils/verifyUser.js"
import { verifyAdmin } from "../utils/verifyAdmin.js"
import { getUsers } from "../controllers/adminController.js"

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users',getUsers)

export default router;