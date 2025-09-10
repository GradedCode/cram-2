# CramSmart - Free & Local AI Study Guide Generator

## Overview
CramSmart is a React-based application that transforms your study materials into personalized study guides. It runs a lightweight AI model directly in your browser, so it's completely free, private, and works 100% client-side. No API keys or internet connection are required for processing.

## Project Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **AI Integration**: 🤗 Transformers.js (in-browser, local model)
- **PDF Generation**: jsPDF, html2canvas

## Recent Changes (Sept 13, 2025)
- ✅ **Architectural Shift**: Migrated from a server-side AI (Google Gemini) to a free, local, in-browser model using `Transformers.js`.
- ✅ **API Key Removal**: Removed all API key-related functionality, making the app 100% free and accessible.
- ✅ **Simplified UI**: Streamlined the user interface by removing customization options in favor of a single "Generate Report" button.
- ✅ **Local AI Processing**: Implemented the `useLocalAi` hook to handle summarization, keyword extraction, and question-answering on the client-side.
- ✅ **Progress Feedback**: Added a progress bar to provide feedback to the user while the local AI models are running.
- ✅ **Code Cleanup**: Removed the obsolete `use-ai.ts` hook and related UI components.

## Project Structure
```
src/
├── components/
│   ├── ui/                 # shadcn-ui components
│   ├── CramGuidePreview.tsx    # Displays the generated report and progress
│   ├── Report.tsx           # Renders the structured AI-generated report
│   └── UploadInterface.tsx     # Handles file uploads and text extraction
├── hooks/
│   ├── use-local-ai.ts    # Manages local AI pipelines (Transformers.js)
│   └── use-toast.ts     # Manages app notifications
└── ...
```

## Features
- **Free & Local AI**: Generates study guides using a model that runs entirely in your browser. No data leaves your machine.
- **No API Keys Needed**: Completely free to use with no setup required.
- **Upload Study Materials**: Supports uploading multiple files to be processed into a single body of text.
- **AI-Powered Study Guides**: Generates a structured report with a summary, keywords, and flashcards.
- **Download as PDF**: Export your study guide as a high-quality PDF for offline access.
- **Regenerate on Demand**: Easily generate a new report if you're not happy with the first one.
- **Responsive Design**: A modern, intuitive interface that works on any device.

## Current State
✅ **WORKING** - The application is fully functional and has been successfully migrated to a local, in-browser AI model.
