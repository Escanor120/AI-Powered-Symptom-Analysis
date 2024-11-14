import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import OpenAI from 'openai';

const port = 3001;

const openai = new OpenAI({
    apiKey: "" // Replace this with your actual API key
});

const app = express();
app.use(bodyParser.json());
app.use(cors());

app.post("/chat", async (req, res) => {
    const { prompt, severity } = req.body;

    try {
        const stream = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ 
                role: "user", 
                content: `Patient Symptom Analysis:
                          Severity Level: ${severity}
                          Symptoms/Description: ${prompt}. 
                          Please provide potential diagnoses, recommended triage level, and immediate care suggestions.` 
            }],
            stream: true,
        });

        let responseData = "";

        for await (const chunk of stream) {
            const content = chunk.choices[0]?.delta?.content || "";
            responseData += content;
        }

        res.json({ response: responseData });
    } catch (error) {
        console.error("Error during API request:", error);
        res.status(500).json({ error: "Failed to generate response" });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
