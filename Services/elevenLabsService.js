import axios from "axios";
import { generateLessonScript } from "./openAiService";

const convertTextToSpeech = async (text) => {
  try {
    const response = await axios.post(
      "https://api.elevenlabs.io/v1/text-to-speech/JBFqnCBsd6RMkjVDRZzb",
      {
        text: text,
        model_id: "eleven_monolingual_v1",
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      },
      {
        headers: {
          "Content-Type": "application/json",
          "xi-api-key": process.env.ELEVEN_LABS_API_KEY,
        },
        responseType: "arraybuffer", // Important: audio data comes as a buffer
      }
    );

    // Return the audio data as a base64 string or a file
    return response.data;
  } catch (error) {
    console.error(
      "Error converting text to speech:",
      error.response?.data || error.message
    );
    return null;
  }
};

convertTextToSpeech(generateLessonScript);
