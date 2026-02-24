import express from "express";
import { addCredits, deductCredits, deleteUser, getAllUsers, getUserById, googleLogin, loginUser, signupUser, updateUser } from "../controllers/loginUsercontroller.js";

const router = express.Router();


router.get("/loginUser", getAllUsers);
router.get("/loginUser/:id", getUserById);
router.post("/loginUser/login", loginUser);
router.post("/loginUser", signupUser);
router.post("/loginUser/google", googleLogin);
router.put("/loginUser/:id",  updateUser);
router.put("/loginUser/:id/deduct-credits", deductCredits);
router.delete("/loginUser/:id", deleteUser);
router.put("/loginUser/:id/add-credits", addCredits);


export default router;