import express from "express";
import { deleteUser, getAllUsers, getUserById, loginUser, signupUser, updateUser } from "../controllers/loginUsercontroller.js";

const router = express.Router();


router.get("/loginUser", getAllUsers);
router.get("/loginUser/:id", getUserById);
router.post("/loginUser/login", loginUser);
router.post("/loginUser", signupUser);
router.put("/loginUser/:id",  updateUser);
router.delete("/loginUser/:id", deleteUser);

export default router;