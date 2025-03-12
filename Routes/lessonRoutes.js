import express from "express";
import { generateLesson } from "../Controllers/lessonController.js";
import { generateLessonAudio } from "../Controllers/lessonController.js";

const router = express.Router();

// POST route to generate lesson script based on a topic
router.post("/generate", generateLesson);

// POST route to generate lesson audio based on a topic
router.post("/generate-audio", generateLessonAudio);

export default router;
