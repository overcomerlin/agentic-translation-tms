# 🌐 Agentic-TMS: Multi-Agent Localization & Translation Pipeline

![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![Ollama](https://img.shields.io/badge/Ollama-000000?style=for-the-badge&logo=ollama&logoColor=white)

An advanced, stateful multi-agent translation pipeline built with Node.js and LangGraph.js. This project moves beyond basic CRUD operations and simple LLM prompting by orchestrating a specialized network of autonomous AI agents (Context Analyzer, Translator, Linguistic Reviewer, and Editor) to achieve highly context-aware, enterprise-grade translations.

This system is designed as a foundational core component for next-generation Translation Management Systems (TMS), explicitly decoupled from specific LLM providers to support both localized hosting (Ollama) and cloud APIs (OpenAI, Anthropic, etc).

## 🏗️ Architecture & State Machine Workflow

Unlike standard linear chains, this pipeline implements a formal state machine using LangGraph.js. A shared, centralized state object passes through individual processing nodes. This enables granular auditing of the AI's "thought process" at each step—essential for collaborative enterprise localization tools.

```mermaidm
graph TD
    Start([Injected Request]) --> A[Agent A: Context Analyzer]
    A -->|Extracts Tone & Terminology| B[Agent B: Translator]
    B -->|Generates Draft Translation| C[Agent C: Linguistic Reviewer]
    C -->|Evaluates Hallucinations / Phrasing| D{Critique Check}
    D -->|Has Issues| E[Agent D: Final Polisher/Editor]
    D -->|Is PERFECT| End([Final Translation Returned])
    E -->|Polishes Output| End
```

The Multi-Agent Pipeline Breakdown:

1. **Context Analyzer (Agent A):** Evaluates the source document to extract the intent, technical terminology (e.g., checking for Web3/Crypto specific jargon), tone, and target audience profile.

2. **Translator (Agent B):** Uses the extracted context metadata as system instructions alongside the raw source text to output a high-fidelity initial translation.

3. **Linguistic Reviewer (Agent C):** Acts as a quality assurance gate. It compares the source text against the draft and the context rules to flag awkward phrasing, translation errors, or hallucinations.

4. **Final Polisher (Agent D):** A conditional editor that only executes if Agent C flags issues. It ingests the review notes and outputs the final production-ready text.

## ⚡ Key Features

- **State Machine Orchestration:** Powered by LangGraph.js to manage complex workflows, state validation, and multi-agent data dependency.

- **Provider Agnostic Architecture:** Easily hot-swap between cloud-hosted models (OpenAI GPT-4o) and fully localized open-source deployments (Ollama / Llama 3.1 / Qwen 2.5).

- **Rich State Metadata Tracking:** Exposes the underlying audit trail (context notes, critique logs, drafts) via a REST API, allowing frontends to visualize real-time pipeline telemetry.

- **Built for Web3 Localization:** System prompts optimize for technical alignment, preventing common localization failures in complex financial and blockchain terminology (e.g., Staking, Liquidity Mining, Slashing).

## 🛠️ Tech Stack

- **Runtime Environment:** Node.js (v18+)

- **Framework & Orchestration:** LangGraph.js (@langchain/langgraph), LangChain Core

- **API Layer:** Express.js

- **LLM Engine Compatibility:** Ollama (Local) / Gemma4:e4b

## 🚀 Getting Started

1. **Prerequisites:** Ensure you have Node.js installed. If you plan to run models locally, download and configure Ollama.

```bash
# Pull a translation-optimized model if using Ollama
ollama pull gemma4:e4b
```

2. **Installation:** Clone the repository and install the dependencies

```bash
git clone https://github.com/overcomerlin/agentic-translation-tms.git
cd agentic-translation-tms
npm install
```

3. **Running the Application**

```bash
# Start the Express API server
node server.js
```

## 📡 API Reference

- Execute Agentic Translation
  - URL: `http://localhost:3000/api/translat`
  - Method: `POST`
  - Headers: `Content-Type: application/json`
  - CLI in terminal (ex.): `curl -X POST http://localhost:3000/api/translate -H "Content-Type: application/json" -d '{"text": "Staking allows users to earn yield by locking up their tokens in a smart contract. However, users should be aware of slashing risks.","targetLanguage": "Mandarin, Traditional Chinese"}'`

- Request Body:

```json
{
  "text": "Staking allows users to earn yield by locking up their tokens in a smart contract. However, users should be aware of slashing risks.",
  "targetLanguage": "Mandarin, Traditional Chinese"
}
```

- Response:

```json
{
  "status": "success",
  "data": {
    "source": "Staking allows users to earn yield by locking up their tokens in a smart contract. However, users should be aware of slashing risks.",
    "targetLanguage": "Mandarin, Traditional Chinese",
    "metadata": {
      "extractedContext": "**Tone:** Informative and Cautionary. (It presents a benefit while immediately warning of a significant risk.)\n\n**Key Terminology:** Staking, Yield, Tokens, Smart Contract, Slashing Risks.\n\n**Target Audience:** Crypto enthusiasts, DeFi participants, or novice investors considering staking/holding digital assets.",
      "draft": "**中文（繁體）翻譯：**\n\n質押（Staking）機制允許用戶將其代幣鎖定在智能合約中，從而賺取收益（Yield）。然而，用戶必須充分了解「質押風險」（Slashing Risks）。\n\n***\n\n**【專業術語解析與說明】**\n\n*   **質押 (Staking)：** 指用戶將數位資產鎖定以支持區塊鏈網路運作，從而獲得報酬。\n*   **收益 (Yield)：** 指質押行為所帶來的利息或回報。\n*   **代幣 (Tokens)：** 指數位資產。\n*   **智能合約 (Smart Contract)：** 指部署在區塊鏈上的自動執行程式碼。\n*   **質押風險 (Slashing Risks)：** 指如果用戶的行為（例如：提交了錯誤的驗證簽名或網路故障）導致網路安全受到威脅，其質押的代幣可能會被協議自動沒收或銷毀的風險。\n\n**【語氣分析】**\n此翻譯結構上先陳述了「益處」（賺取收益），隨後使用「然而」（However）引出「警告」（必須充分了解），完美體現了「資訊性與警示性」的語氣。",
      "reviewerCritique": "PERFECT"
    },
    "finalResult": "**中文（繁體）翻譯：**\n\n質押（Staking）機制允許用戶將其代幣鎖定在智能合約中，從而賺取收益（Yield）。然而，用戶必須充分了解「質押風險」（Slashing Risks）。\n\n***\n\n**【專業術語解析與說明】**\n\n*   **質押 (Staking)：** 指用戶將數位資產鎖定以支持區塊鏈網路運作，從而獲得報酬。\n*   **收益 (Yield)：** 指質押行為所帶來的利息或回報。\n*   **代幣 (Tokens)：** 指數位資產。\n*   **智能合約 (Smart Contract)：** 指部署在區塊鏈上的自動執行程式碼。\n*   **質押風險 (Slashing Risks)：** 指如果用戶的行為（例如：提交了錯誤的驗證簽名或網路故障）導致網路安全受到威脅，其質押的代幣可能會被協議自動沒收或銷毀的風險。\n\n**【語氣分析】**\n此翻譯結構上先陳述了「益處」（賺取收益），隨後使用「然而」（However）引出「警告」（必須充分了解），完美體現了「資訊性與警示性」的語氣。"
  }
}
```

## 📈 Scalability & Future Roadmap

This system architecture is built to intentionally allow for enterprise scaling patterns:

- **Human-in-the-Loop (HITL) Integration:** Adding compilation interrupts to LangGraph (interceptBefore) to pause execution at the reviewer node, prompting a human translator UI to approve or modify logs before finishing.

- **Semantic Translation Memory (RAG):** Integrating a vector database (e.g., Milvus/Pinecone) at the analyzer node level to extract high-similarity matches from historical translations and inject them directly into the agent context window.

- **Real-time Event Streaming:** Migrating the Express REST setup to Server-Sent Events (SSE) or WebSockets using LangGraph's .stream() capabilities for typing-effect progress visualizations in modern UIs.

## 👨‍💻 Author

**Jacob Lin**
_Algorithm Engineer & Full-Stack Developer_
[LinkedIn](https://www.linkedin.com/in/dachunglin) | [Email](mailto:overcomerlin@gmail.com)

_"A ranger soaring through the world of algorithms."_
