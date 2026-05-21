import { ChatOllama } from "@langchain/ollama"; // 1. Change the import
import { StateGraph, END } from "@langchain/langgraph";
import { SystemMessage, HumanMessage } from "@langchain/core/messages";
// import * as dotenv from "dotenv";

// dotenv.config();

// 2. Initialize Ollama instead of OpenAI
const llm = new ChatOllama({
  baseUrl: "http://localhost:11434", // Default local port
  model: "gemma4:e4b",
  temperature: 0.2,
});

const translationState = {
  sourceText: { value: null },
  targetLanguage: { value: null },
  contextAndTone: { value: null },
  draftTranslation: { value: null },
  critique: { value: null },
  finalTranslation: { value: null },
};

async function analyzeContext(state) {
  console.log("In analyzeContext");
  const prompt = `Analyze the following text. Identify the tone, key terminology, and target audience. Be concise. \n\nText: ${state.sourceText}`;
  const response = await llm.invoke([new HumanMessage(prompt)]);
  return { contextAndTone: response.content };
}

async function generateDraft(state) {
  console.log("In generateDraft");
  const systemMsg = new SystemMessage(
    `You are an expert translator. Translate the text into ${state.targetLanguage}. Use the following context and tone guidelines: ${state.contextAndTone}`,
  );
  const userMsg = new HumanMessage(state.sourceText);
  const response = await llm.invoke([systemMsg, userMsg]);
  return { draftTranslation: response.content };
}

async function reviewTranslation(state) {
  console.log("In reviewTranslation");
  const prompt = `You are a strict linguistic reviewer. Review this translation from English to ${state.targetLanguage}. 
  Source: ${state.sourceText}
  Draft Translation: ${state.draftTranslation}
  Context/Tone: ${state.contextAndTone}
  
  Identify any awkward phrasing, hallucinations, or loss of technical accuracy. If it's perfect, reply with "PERFECT". Otherwise, list specific corrections.`;
  const response = await llm.invoke([new HumanMessage(prompt)]);
  return { critique: response.content };
}

async function polishTranslation(state) {
  console.log("In polishTranslation");
  if (state.critique.includes("PERFECT")) {
    return { finalTranslation: state.draftTranslation };
  }

  const prompt = `You are the final editor. Fix the draft translation based on the reviewer's critique.
  Draft: ${state.draftTranslation}
  Critique: ${state.critique}
  
  Output ONLY the final polished translation without any introductory text.`;
  const response = await llm.invoke([new HumanMessage(prompt)]);
  return { finalTranslation: response.content };
}

const workflow = new StateGraph({ channels: translationState })
  .addNode("analyzer", analyzeContext)
  .addNode("translator", generateDraft)
  .addNode("reviewer", reviewTranslation)
  .addNode("polisher", polishTranslation)
  .addEdge("analyzer", "translator")
  .addEdge("translator", "reviewer")
  .addEdge("reviewer", "polisher")
  .addEdge("polisher", END);

workflow.setEntryPoint("analyzer");

export const translationPipeline = workflow.compile();
