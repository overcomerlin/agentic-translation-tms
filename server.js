import express from "express";
import { translationPipeline } from "./translationGraph.js";
// import * as dotenv from "dotenv";

// dotenv.config();

const app = express();
app.use(express.json());

app.post("/api/translate", async (req, res) => {
  const { text, targetLanguage } = req.body;

  if (!text || !targetLanguage) {
    return res.status(400).json({ error: "Missing text or targetLanguage" });
  }

  try {
    // Initial state injected into the LangGraph workflow
    const initialState = {
      sourceText: text,
      targetLanguage: targetLanguage,
    };

    console.log("Starting agentic translation pipeline...");

    // Run the graph
    // We use .invoke() for a single run. For real-time updates to a frontend,
    // you would use .stream() and Server-Sent Events (SSE) or WebSockets.
    const finalState = await translationPipeline.invoke(initialState);

    res.json({
      status: "success",
      data: {
        source: finalState.sourceText,
        targetLanguage: finalState.targetLanguage,
        metadata: {
          extractedContext: finalState.contextAndTone,
          draft: finalState.draftTranslation,
          reviewerCritique: finalState.critique,
        },
        finalResult: finalState.finalTranslation,
      },
    });
  } catch (error) {
    console.error("Pipeline Error:", error);
    res.status(500).json({ error: "Translation pipeline failed." });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Binance TMS Agent Pipeline running on http://localhost:${PORT}`);
});
