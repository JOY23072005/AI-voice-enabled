Here is a polished, industry-grade **README.md** tailored for your GitHub repository. It frames the project perfectly: as a highly functional, real-time web application originally built on legacy frameworks, which has now been defensively refactored to production-ready modern standards.

This layout highlights your skills in **System Architecture**, **API Migration**, and **Asynchronous UI/UX Orchestration**—exactly what technical recruiters look for.

---

# AI Voice Assistant Engine (Ren)

A high-performance, web-based conversational AI agent that orchestrates real-time, low-latency audio interaction pipelines entirely within the browser. The project leverages native browser hardware interfaces for speech-to-text and text-to-speech processing, backed by a robust, secure Django middle tier communicating with Google's latest generative AI models.

Originally architected as an exploratory project, the codebase has been completely refactored to resolve legacy API deprecations, optimize UI/UX transitions, and implement asynchronous state machine mechanics.

---

## 🛠️ System Architecture & Workflow

The system operates as a state-driven reactive loop across three main tiers:

```
[User Audio Input] ──> (Web Speech API / Mic Engine) ──> [Sanitized Text]
                                                                │
  ┌─────────────────────────────────────────────────────────────┘
  ▼
(Django Proxy Layer) ──> [Safe API Routing & Model Fallback Chain] ──> (Google AI Studio)
                                                                            │
  ┌─────────────────────────────────────────────────────────────────────────┘
  ▼
[Unified JSON Payload] ──> (State Machine Guard) ──> (SpeechSynthesis Speech Playback)

```

1. **Client Edge Input Engine**: Captures user streams via `webkitSpeechRecognition`, performing client-side validation, string normalization, and regex-based native command routing (e.g., executing system overrides like `shutdown` or executing localized quick-launch web hooks).
2. **Authenticated Proxy Gateway**: A secure Django view handles asynchronously ingested requests, checks CSRF headers, logs state history parameters to a SQL backend, and signs secure handshakes to upstream API boundaries.
3. **Failover Model Router**: Implements dynamic fault-tolerant API calls utilizing the modern, unified `google-genai` SDK. It routes traffic through a primary high-throughput model with automatic fallback degradation logic if capacity limits are breached.
4. **Hardware Mutex Lock Loop**: Controls asynchronous interfaces by dynamically stopping the microphone recording instance during text-to-speech playback, completely preventing hardware loopback echo.

---

## 🚀 Key Evolutionary Upgrades & Fixes

### 1. Unified Google GenAI SDK Migration

* **Then**: Relied on deprecated legacy libraries (`google-generativeai`) targeting older model generation endpoints.
* **Now**: Upgraded to the modern unified `google.genai` SDK. Migrated backend processing parameters to high-performance, low-latency architectures with built-in runtime failover logic:
* **Primary Model**: `gemini-3.1-flash-lite` (Optimized for instantaneous conversational latency thresholds).
* **Automated Fallback**: Gracefully degrades down to `gemini-2.5-flash-lite` on caught `ClientError` rate limits to prevent user pipeline interruption.



### 2. Microphonic Feedback Loop Elimination

* **Problem**: The web audio listener would hear the computer's speakers reading back responses, generating an infinite API call loop.
* **Solution**: Introduced a hard asynchronous mutex lock state. The `SpeechRecognition` engine is physically stopped the millisecond audio generation triggers, and safely restarts via the `SpeechSynthesisUtterance.onend` lifecycle hook only after speech playback terminates cleanly.

### 3. CSS Geometry & Centering Refactor

* **Problem**: The old layout used absolute viewport offsets (`translate(-50%, -50%)`), causing text strings with long generation payloads to clip or scroll off the top header bounds.
* **Solution**: Refactored the container layer to an auto-expanding Flexbox wrapper layout utilizing `height: auto` and `align-items: flex-start`, ensuring large code blocks expand downwards naturally and remain fully scrollable on all viewports.

### 4. Direct UI State Sync

* **Problem**: Buttons and card triggers would slip out of sync if network exceptions occurred, leaving buttons stuck in interactive "Stop" layouts.
* **Solution**: Migrated application flow controls to decoupled tracking state flags (`isStopped`, `isListeningMode`) completely independent of inner HTML string checking patterns, rendering the interface immune to race conditions.

---

## 💻 Tech Stack

* **Core Backend Framework**: Django (Python 3.12+)
* **AI Orchestration**: Unified Google GenAI SDK (`google-genai`)
* **Core Frontend Layer**: Vanilla JavaScript (ES6+), HTML5 Canvas Tracking, CSS3 (Flexbox/Transitions)
* **Hardware API Interception**: Web Speech API (`SpeechRecognition`, `SpeechSynthesisUtterance`)

---

## 🔧 Installation & Local Setup

### 1. Clone & Initialize Environment

```bash
git clone https://github.com/JOY23072005/AI-voice-enabled.git
cd AI-voice-enabled
python -m venv venv

```

Activate the virtual environment:

* **Windows**: `venv\Scripts\activate`
* **Linux/macOS**: `source venv/bin/activate`

### 2. Dependency Resolution

```bash
pip install -r requirements.txt

```

### 3. Secure Credential Allocation

Create or edit your local environment secrets file or assign the key directly within your Django `settings.py`:

```python
# VoiceEnabledAI/settings.py
API_KEY = "AIzaSy..."  # Insert your valid Google AI Studio Token here

```

### 4. Database Setup & Server Execution

```bash
python manage.py migrate
python manage.py runserver

```

Open `http://127.0.0.1:8000` inside a modern web browser (Google Chrome or Microsoft Edge recommended for premium natural audio voices).

---

## 📋 Conversational & System Override Triggers

The assistant continuously listens for standard conversation queries but intercepts the following structural commands directly on the client edge for instantaneous response execution:

* **System Interruption**: Say `"shutdown"`, `"goodbye"`, or `"exit"` to cleanly close structural mic queues and shut down active processing cycles.
* **Desktop Automation Shortcuts**:
* *"Open YouTube"* $\rightarrow$ Fires up `youtube.com` instantly in an isolated worker tab.
* *"Open Spotify"* $\rightarrow$ Launches the Spotify streaming web portal.
* *"Open Netflix"* / *"Open Hotstar"* $\rightarrow$ Direct routing to specific entertainment web apps.



---

## 📄 License

Distributed under the MIT License. See `LISCENSE.txt` for further details.