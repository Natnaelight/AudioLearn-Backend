import { OpenAI } from "openai";
import dotenv from "dotenv";
import axios from "axios";
import http from "https";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Function to fetch up-to-date content from the web using RapidAPI Google Search API
const fetchWebContent = async (query) => {
  const options = {
    method: "GET",
    hostname: "google-search72.p.rapidapi.com",
    port: null,
    path: `/search?q=${encodeURIComponent(query)}&lr=en-US&num=10`,
    headers: {
      "x-rapidapi-key": process.env.WEB_API_KEY,
      "x-rapidapi-host": "google-search72.p.rapidapi.com",
    },
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      const chunks = [];

      res.on("data", (chunk) => {
        chunks.push(chunk);
      });

      res.on("end", () => {
        const body = Buffer.concat(chunks);
        try {
          const data = JSON.parse(body.toString());
          const summaries =
            data.items?.map((item) => item.snippet).join("\n") || "";
          resolve(summaries);
        } catch (error) {
          console.error(
            "Error parsing web content:",
            error,
            "\nResponse body:",
            body.toString()
          );
          reject("");
        }
      });
    });

    req.on("error", (error) => {
      console.error("Error fetching web content:", error);
      reject("");
    });

    req.end();
  });
};

// Function to generate enhanced educational lesson script
const generateLessonScript = async (topic) => {
  try {
    const webContent = await fetchWebContent(topic);

    const messages = [
      {
        role: "system",
        content:
          "You are an expert educator creating engaging, audio-friendly educational content. Keep it clear, structured, and conversational with a natural flow, storytelling elements, and reflection questions. Ensure the content feels like a spontaneous spoken lesson, varying transitions and avoiding repetitive structure.",
      },
      {
        role: "user",
        content: `
      Create a compelling and well-structured educational lesson on the topic: "${topic}".
      Use relevant up-to-date information: ${webContent}
      Ensure the content is conversational and flows naturally. Avoid rigid section headers like 'Introduction', 'Reflection', and 'Conclusion'—instead, use organic transitions like "Let’s dive into…", "Now, think about this…", or "Before we wrap up, here’s something to consider…".
      Include engaging real-world examples and reflection questions while keeping a lively and friendly tone.
      Remove any markdown symbols like * or # and ensure the content is clean and audio-friendly.
      `,
      },
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4-turbo",
      messages: messages,
      temperature: 0.7,
    });

    return completion.choices[0].message.content.trim();
  } catch (error) {
    console.error(
      "Error generating lesson script:",
      error.response?.data || error.message
    );
    return "There was an error generating the lesson script.";
  }
};

// Function to convert lesson script to audio using Eleven Labs API
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

    // Return the audio data as a buffer
    return response.data;
  } catch (error) {
    console.error(
      "Error converting text to speech:",
      error.response?.data
        ? JSON.stringify(error.response.data, null, 2)
        : error.message
    );
    return null;
  }
};

export { generateLessonScript, convertTextToSpeech };
