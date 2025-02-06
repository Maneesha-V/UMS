import express from "express";
import { verifyToken } from "../utils/verifyUser.js"
import { verifyAdmin } from "../utils/verifyAdmin.js"
import { getUsers, adminCreateUser, adminUpdateUser, adminDeleteUser } from "../controllers/adminController.js"

const router = express.Router();

router.use(verifyToken);
router.use(verifyAdmin);

router.get('/users',getUsers)
router.post('/user/create',adminCreateUser)
router.put('/user/update/:id',adminUpdateUser)
router.delete('/user/delete/:id',adminDeleteUser)

export default router;