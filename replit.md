# CramSmart - AI-Powered Study Guide Generator

## Overview
CramSmart is a React-based application that transforms your study materials into personalized, AI-powered study guides. Upload your notes, select your preferences, and generate a comprehensive report complete with a summary, keywords, and flashcards.

## Project Architecture
- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite 5.4.19
- **UI Framework**: shadcn-ui components with Tailwind CSS
- **AI Integration**: Google Gemini Pro
- **PDF Generation**: jsPDF, html2canvas

## Recent Changes (Sept 12, 2025)
- ✅ **AI Integration**: Integrated Google Gemini Pro for dynamic content generation.
- ✅ **API Key Management**: Added an input field for users to enter and save their Gemini API key in local storage.
- ✅ **Customizable Reports**: Implemented options for users to customize the number of flashcards (5-20) and the summary length (short, medium, long).
- ✅ **Regenerate Reports**: Added a "Regenerate" button to allow users to request a new report.
- ✅ **PDF Downloads**: Enabled users to download their generated study guides as a PDF.
- ✅ **UI Enhancements**: Added new components for sliders, toggle groups, and improved user feedback with toasts and error messages.

## Project Structure
```
src/
├── components/
│   ├── ui/           # shadcn-ui components
│   ├── CramGuidePreview.tsx  # Displays the generated report and customization options
│   ├── Report.tsx         # Renders the structured AI-generated report
│   └── UploadInterface.tsx   # Handles file uploads and text extraction
├── hooks/
│   ├── use-ai.ts      # Communicates with the Gemini API
│   └── use-toast.ts   # Manages app notifications
└── ...
```

## Features
- **Upload Study Materials**: Supports uploading multiple files to be processed into a single body of text.
- **AI-Powered Study Guides**: Generates a structured report with a summary, keywords, and flashcards.
- **Customizable Content**:
    - Choose the number of flashcards (5-20).
    - Select the desired summary length (short, medium, or long).
- **Secure API Key Storage**: Saves your Gemini API key locally for convenient reuse.
- **Download as PDF**: Export your study guide as a high-quality PDF for offline access.
- **Regenerate on Demand**: Don't like the first report? Regenerate it with a single click.
- **Responsive Design**: A modern, intuitive interface that works on any device.

## Current State
✅ **WORKING** - The application is fully functional and deployed. All new features have been tested and are working as expected.
