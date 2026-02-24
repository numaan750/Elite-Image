import express from "express";
import { processImageWithAI } from "../controllers/aiProcessingController.js";

const router = express.Router();

// AI image processing route
router.post("/process-image", processImageWithAI);

export default router;