import {
  generateLessonScript,
  convertTextToSpeech,
} from "../Services/openAiService.js";

const cleanLessonScript = (script) => {
  return script
    .replace(/\*\*/g, "") // Remove Markdown bold
    .replace(/[*_~`]/g, "") // Remove other Markdown symbols like italics, strikethrough, code
    .replace(/\n+/g, " ") // Replace line breaks with spaces
    .replace(/\s{2,}/g, " ") // Collapse multiple spaces into one
    .trim();
};

export const generateLessonAudio = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const lessonScript = await generateLessonScript(topic);
    const cleanedScript = cleanLessonScript(lessonScript);

    const audioBuffer = await convertTextToSpeech(cleanedScript);

    if (!audioBuffer) {
      return res
        .status(500)
        .json({ error: "Failed to convert lesson to audio." });
    }

    res.set({
      "Content-Type": "audio/mpeg",
      "Content-Disposition": `attachment; filename="${topic}-lesson.mp3"`,
    });

    res.send(audioBuffer);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while generating the lesson audio." });
  }
};

// Controller function to generate lesson script
export const generateLesson = async (req, res) => {
  const { topic } = req.body;

  if (!topic) {
    return res.status(400).json({ error: "Topic is required" });
  }

  try {
    const lessonScript = await generateLessonScript(topic);
    const cleanedLessonScript = cleanLessonScript(lessonScript);
    res.status(200).json({ lesson: cleanedLessonScript });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while generating the lesson." });
  }
};
