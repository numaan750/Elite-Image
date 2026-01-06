import express from "express";
import { createImages, deleteImages, getAllImages, getImageById, updateImages } from "../controllers/aiImagescontroller.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/aiImagesmodels", verifyToken, getAllImages);
router.get("/aiImagesmodels/:id", verifyToken, getImageById);
router.post("/aiImagesmodels", verifyToken, createImages);
router.put("/aiImagesmodels/:id", verifyToken, updateImages);
router.delete("/aiImagesmodels/:id", verifyToken, deleteImages);

export default router;