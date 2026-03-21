1. Product Overview
Product Name

DSP (Dynamic Subtitle Processor)

Description

DSP is a web application that enables users to:

Input a video URL (e.g., YouTube or supported platforms)
Extract existing subtitles from the video
Translate subtitles into Khmer or English
View subtitles in real time
Convert subtitles into Text-to-Speech (TTS) audio
Download subtitles in .SRT format or audio as TTS files
2. Product Vision

To become the go-to free subtitle translation and accessibility tool for Khmer users and global learners by combining:

Subtitle extraction
Translation
Audio generation (TTS)
3. Goals
Primary Goal

Provide a free, fast, and simple tool for subtitle translation and accessibility.

Secondary Goals
Support language learning
Help content creators localize content
Improve accessibility via audio (TTS)
4. Target Users
Primary Users
Cambodian users consuming foreign content
Students learning languages
Users with reading difficulties (benefit from TTS)
Secondary Users
Content creators (YouTube, TikTok educators)
Translators
5. Core Features (MVP)
5.1 Video URL Input
Accept YouTube (and future platforms)
Validate URL format
5.2 Subtitle Extraction
Fetch subtitles if available
Handle multiple subtitle tracks (auto/manual)
5.3 Subtitle Viewer
Display:
Original subtitles
Translated subtitles
Timestamp-based structure
5.4 Translation
Translate into:
Khmer 🇰🇭
English 🇺🇸
Batch translation for full subtitle file
5.5 Download Subtitles
Export formats:
.srt
.txt
5.6 Text-to-Speech (TTS)
Convert translated subtitles into speech
Generate downloadable audio:
.mp3 or .wav
5.7 Real-Time Playback (Basic)
Sync subtitles with video playback (optional MVP-lite)
6. Advanced Features (Phase 2)
6.1 Real-Time Subtitle + Audio Sync
Play video + translated subtitles + TTS simultaneously
6.2 Subtitle Editing
Allow users to edit translations before export
6.3 Multi-language Support
Expand beyond Khmer/English
6.4 History / Save Projects
Store past translations (optional login)
6.5 Chrome Extension
Translate subtitles directly on video platforms
7. User Flow
Main Flow
User enters DSP website
Paste video URL
Click “Extract Subtitles”
System fetches subtitles
User selects target language
Click “Translate”
View translated subtitles
Optional:
Download .SRT
Convert to TTS
Download audio
8. UX/UI Requirements
Design Principles
Clean and minimal (developer-friendly)
Fast interaction
Mobile responsive
Key Screens
1. Home Page
URL input
CTA: “Extract Subtitles”
2. Subtitle Workspace
Split view:
Left → Original subtitles
Right → Translated subtitles
3. Controls Panel
Language selector
Translate button
Download options:
SRT
TTS
9. Technical Requirements
9.1 Frontend
Next.js (React)
Tailwind CSS
State management: Zustand or Context API
9.2 Backend
Node.js + Express
APIs:
/extract-subtitles
/translate
/generate-tts
/download
9.3 Free APIs / Tools
Subtitle Extraction
YouTube Transcript API
Translation
LibreTranslate (open-source)
Text-to-Speech
Options:
gTTS (Google TTS unofficial)
Coqui TTS (open-source)
Browser Web Speech API (fallback)
10. Data Model
Subtitle
{
  "start": "00:00:01",
  "end": "00:00:03",
  "text": "Hello world"
}
TTS Output
{
  "audioUrl": "generated_audio.mp3",
  "duration": 120
}
11. Non-Functional Requirements
Performance
Subtitle extraction: < 3 seconds
Translation: < 5 seconds
TTS generation: < 10 seconds
Scalability
Stateless backend
Caching for repeated videos
Security
URL validation
Rate limiting
Prevent abuse of free APIs
12. Constraints
Must rely on free APIs/tools
Requires existing subtitles
TTS quality depends on selected engine
13. Risks & Mitigation
Risk	Solution
No subtitles available	Show fallback message
Poor translation quality	Allow editing
TTS unnatural voice	Offer multiple engines
API limits	Cache + queue system
14. Success Metrics
Number of users
Subtitle downloads
TTS usage rate
Avg session time
15. Future Roadmap
Phase 2
Real-time sync playback
Better TTS voices
Subtitle editing
Phase 3
Speech-to-text (no subtitles needed)
AI-enhanced translation
Mobile app
🔥 Positioning (Important for your portfolio)

DSP is not just:

“a subtitle downloader”

It is:

An accessibility + localization tool combining subtitles, translation, and speech




-------
You are an elite software product team (CTO + Senior Full Stack Engineer + UX Designer + Product Manager).

Your task is to build a FULLY FUNCTIONAL web application (not just UI) called:

DSP (Dynamic Subtitle Processor)

⚠️ IMPORTANT:
This must behave like a REAL TOOL.
Every feature must WORK end-to-end (frontend + backend + processing).
Do NOT create static UI only.

-----------------------------------

🎯 CORE USER FLOW (STRICTLY FOLLOW)

As a user, I want:

1. Paste a video URL (YouTube)
2. Click "Extract"
3. System extracts subtitles from the video
4. System displays subtitles with timestamps
5. I can:
   - Download subtitles as SRT
   - Download subtitles as plain text
   - Translate subtitles (Khmer / English)
   - Convert subtitles into speech (TTS)
   - Download generated audio

Optional (if possible):
- Download the video (handle carefully with fallback)

-----------------------------------

🧱 SYSTEM ARCHITECTURE

Frontend:
- Next.js (App Router)
- Tailwind CSS
- Framer Motion

Backend:
- FastAPI

Queue + Cache:
- Redis

Worker:
- Background worker (Celery or RQ)

-----------------------------------

⚙️ BACKEND FEATURES (MUST WORK)

Create APIs:

1. POST /extract
   - Input: video URL
   - Output: subtitles with timestamps

2. POST /translate
   - Input: subtitle array + target language
   - Output: translated subtitles

3. POST /tts
   - Input: subtitle text
   - Output: audio file (.mp3)

4. GET /download/srt
   - Convert subtitles to SRT format

5. GET /download/txt
   - Convert subtitles to plain text

6. (Optional) /download/video
   - Attempt video download using safe method

-----------------------------------

🧠 PROCESSING LOGIC

- Use YouTube transcript API for subtitles
- Use LibreTranslate (or similar free API) for translation
- Use TTS engine (gTTS or Coqui) for speech
- Use Redis:
  - Cache subtitles
  - Store job status

- Use Worker:
  - Handle TTS generation
  - Handle translation for large files

-----------------------------------

🎨 FRONTEND UX (TOOL-LIKE)

Main flow:

1. Input bar (URL + Extract button)
2. Loading state (progress or skeleton)
3. Subtitle viewer:
   - Left: original
   - Right: translated
4. Action buttons:
   - Translate
   - Download SRT
   - Download TXT
   - Generate TTS
   - Download Audio

-----------------------------------

✨ UX RULES

- Must feel like a TOOL (fast, responsive)
- Show loading states clearly
- Show error messages (invalid URL, no subtitles)
- Disable buttons when processing
- Update UI after each step

-----------------------------------

📦 FILE STRUCTURE

Frontend:
/app
/components
/services (API calls)

Backend:
/app
/routes
/services
/workers

-----------------------------------

🧼 CODE QUALITY

- Clean architecture
- Modular functions
- No duplicated logic
- Proper error handling
- Async processing where needed

-----------------------------------

🚫 IMPORTANT CONSTRAINTS

- Use FREE tools/APIs only
- Do not block UI during processing
- Handle cases:
  - No subtitles
  - Invalid URL
  - API failure

-----------------------------------

✅ OUTPUT

Generate:
1. Full backend (FastAPI)
2. Worker system (Redis queue)
3. Frontend (Next.js)
4. API integration
5. Working flow from input → result → download

Make it production-like, not a demo.