import express from "express";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

if (!process.env.GEMINI_API_KEY) {
    console.error("GEMINI_API_KEY belum ada di .env");
    process.exit(1);
}

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
});

app.use(express.json({ limit: "2mb" }));
app.use(express.static(__dirname));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "assistantai.html"));
});

app.post("/api/chat", async (req, res) => {
    try {
        const { message, history = [] } = req.body;

        if (!message || !message.trim()) {
            return res.status(400).json({
                error: "Pertanyaan kosong."
            });
        }

        const previousMessages = Array.isArray(history)
            ? history.slice(-20).map(item => ({
                role: item.sender === "ai" ? "model" : "user",
                text: String(item.text || "")
                    .replace(/<[^>]*>/g, "")
            }))
            : [];

        let conversation = "";

        for (const item of previousMessages) {
            conversation += `${item.role}: ${item.text}\n\n`;
        }

        conversation += `user: ${message.trim()}`;

        const response = await ai.models.generateContent({
            model: "gemini-3.5-flash",

            contents: conversation,

            config: {
                systemInstruction: `
Kamu adalah NEXUS-ULTIMATE, AI assistant serbaguna.

Jawab pertanyaan pengguna dari berbagai bidang:
sejarah, matematika, fisika, kimia, biologi,
geografi, teknologi, pemrograman, database,
UI/UX, bahasa, sastra, filsafat, agama,
budaya, pendidikan, sains, komputer, game,
film, anime, dan pengetahuan umum.

Gunakan bahasa yang sama dengan pengguna.

Jawab dengan jelas dan natural.
Untuk matematika, hitung dengan teliti.
Untuk coding, berikan kode yang bisa digunakan.
Jangan mengarang fakta.
Jika informasi tidak pasti, katakan dengan jujur.

Jangan menggunakan template jawaban seperti:
"Topik ini melibatkan pemetaan variabel..."
Jawab langsung pertanyaan pengguna.
`
            }
        });

        const answer =
            response.text ||
            "Maaf, Gemini tidak memberikan jawaban.";

        res.json({
            success: true,
            answer: answer
        });

    } catch (error) {
        console.error("GEMINI ERROR:", error);

        res.status(500).json({
            success: false,
            error: error.message || "Terjadi kesalahan pada Gemini API."
        });
    }
});

app.listen(PORT, () => {
    console.log("");
    console.log("================================");
    console.log("      NEXUS-ULTIMATE ONLINE");
    console.log("================================");
    console.log(`Server: http://localhost:${PORT}`);
    console.log("AI: Gemini");
    console.log("Status: ACTIVE");
    console.log("================================");
});