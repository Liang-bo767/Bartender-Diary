# Bartender Diary

A desktop diary app with an LLM-powered bartender. Write in your diary on the right — the bartender reads it and talks to you about it on the left, like confiding in someone at the end of a long day.

Built with Electron + React + TypeScript.

## Features

- Plain text diary editor with auto-save
- One entry per day, stored locally
- Chat with an AI bartender who reads what you wrote
- Supports Claude API or local models via Ollama

## Getting Started

```bash
npm install
npm run dev
```

Then click the gear icon in the chat panel to configure your LLM provider.

### Using Claude

Select **Claude API** in settings and paste your Anthropic API key.

### Using a local model (Ollama)

1. Install [Ollama](https://ollama.com)
2. Pull a model: `ollama pull qwen2.5`
3. Select **Ollama** in settings and enter the model name

## Stack

- Electron + React + TypeScript
- Vercel AI SDK (Claude + Ollama)
- Tailwind CSS
- Local JSON file storage
