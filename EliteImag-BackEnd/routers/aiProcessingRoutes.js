import express from "express";
import { getHDRConfig, processImageWithAI } from "../controllers/aiProcessingController.js";

const router = express.Router();

// AI image processing route
router.post("/process-image", processImageWithAI);
router.get("/hdr-config", getHDRConfig);


export default router;