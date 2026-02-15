<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=280&section=header&text=Human%20Activity%20Recognition&fontSize=52&fontColor=ffffff&animation=fadeIn&fontAlignY=38&desc=🏃%20Real-Time%20Deep%20Learning%20•%20LSTM%20•%20Mobile%20Sensors&descAlignY=58&descSize=18" width="100%"/>
</p>

<p align="center">
  <a href="#-quick-start"><img src="https://img.shields.io/badge/Quick_Start-▶️-00D4AA?style=for-the-badge" alt="Quick Start"/></a>
  <a href="#-live-demo"><img src="https://img.shields.io/badge/Live_Demo-📱-7C3AED?style=for-the-badge" alt="Live Demo"/></a>
  <a href="#-api-reference"><img src="https://img.shields.io/badge/API_Docs-📡-0EA5E9?style=for-the-badge" alt="API Docs"/></a>
  <a href="#-architecture"><img src="https://img.shields.io/badge/Architecture-🏗️-F59E0B?style=for-the-badge" alt="Architecture"/></a>
</p>

<p align="center">
  <img src="https://readme-typing-svg.demolab.com?font=Fira+Code&weight=600&size=22&duration=3000&pause=1000&color=7C3AED&center=true&vCenter=true&multiline=true&repeat=true&width=700&height=80&lines=🧠+Bidirectional+LSTM+%7C+96%25%2B+Accuracy;📱+Real+Phone+Sensors+→+Live+Predictions+in+~100ms" alt="Typing SVG" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Python-3.12-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"/>
  <img src="https://img.shields.io/badge/TensorFlow-2.18-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow"/>
  <img src="https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React"/>
  <img src="https://img.shields.io/badge/Flask-3.1-000000?style=for-the-badge&logo=flask&logoColor=white" alt="Flask"/>
  <img src="https://img.shields.io/badge/Vite-6.4-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Status-Active-00D4AA?style=flat-square" alt="Status"/>
  <img src="https://img.shields.io/badge/License-MIT-7C3AED?style=flat-square" alt="License"/>
  <img src="https://img.shields.io/badge/PRs-Welcome-FF6F61?style=flat-square" alt="PRs Welcome"/>
  <img src="https://img.shields.io/badge/Maintained-Yes-00D4AA?style=flat-square" alt="Maintained"/>
  <img src="https://img.shields.io/badge/Model_Accuracy-96%25+-FF6F00?style=flat-square" alt="Accuracy"/>
</p>

---

<br/>

## 📌 Quick Navigation

<p align="center">
  <a href="#-overview">Overview</a> •
  <a href="#-features">Features</a> •
  <a href="#-architecture">Architecture</a> •
  <a href="#-model-deep-dive">Model Deep Dive</a> •
  <a href="#-project-structure">Project Structure</a> •
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-live-demo">Live Demo</a> •
  <a href="#-api-reference">API Reference</a> •
  <a href="#-tech-stack">Tech Stack</a> •
  <a href="#-performance">Performance</a> •
  <a href="#-roadmap">Roadmap</a> •
  <a href="#-contributing">Contributing</a>
</p>

<br/>

---

## 🎯 Overview

<table>
<tr>
<td width="50%">

### 🤔 What is this?

A **production-grade full-stack web application** that classifies **6 human activities in real time** using your phone's accelerometer & gyroscope sensors, powered by a **Bidirectional LSTM** deep learning model trained on the UCI HAR Dataset.

> **Point your phone → Walk around → See predictions live.**

</td>
<td width="50%">

### 💡 Why does it matter?

| Problem | Solution |
|---------|----------|
| Activity tracking requires wearables | ✅ Uses built-in phone sensors |
| ML models need desktop to run | ✅ Browser sends data → server predicts |
| No real-time feedback | ✅ ~100ms end-to-end latency |
| Privacy concerns | ✅ Data processed transiently, never stored |

</td>
</tr>
</table>

### 🏷️ Activities Recognized

<p align="center">

| 🚶 Walking | 🧗 Walking Upstairs | 🏃 Walking Downstairs | 🪑 Sitting | 🧍 Standing | 🛌 Laying |
|:---:|:---:|:---:|:---:|:---:|:---:|
| MET 3.5 | MET 8.0 | MET 4.0 | MET 1.3 | MET 1.8 | MET 1.0 |

</p>

<br/>

---

## ✨ Features

<table>
<tr>
<td>

| Feature | Status | Description |
|---------|:------:|-------------|
| 🧠 **Bidirectional LSTM** | ✅ | Stacked BiLSTM with 96%+ accuracy |
| 📱 **Real Phone Sensors** | ✅ | DeviceMotion API at 50 Hz |
| 📊 **Live Sensor Charts** | ✅ | Real-time accelerometer & gyroscope waveforms |
| 🎯 **Activity Card** | ✅ | Animated hero card with emoji avatars |
| ⏱️ **Activity Timeline** | ✅ | Scrollable history with timestamps |
| 🔥 **Calorie Tracker** | ✅ | MET-based estimation with donut chart |
| 📈 **Session Stats** | ✅ | Predictions count, latency, buffer fill |
| 🌐 **REST API** | ✅ | Flask backend with structured logging |
| 🎮 **Demo Mode** | ✅ | Simulated sensors for desktop testing |
| 🔒 **Privacy First** | ✅ | Zero data retention on server |
| 📐 **Sliding Window** | ✅ | 128 timesteps, 50% overlap |
| 🐳 **Docker Support** | ✅ | Full docker-compose orchestration |
| 📱 **Mobile Responsive** | ✅ | Glassmorphic dark theme UI |
| 🌙 **Dark Mode** | ✅ | Premium dark theme with gradients |

</td>
</tr>
</table>

<br/>

---

## 🏗️ Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                        📱 MOBILE BROWSER                         │
│                                                                  │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │          DeviceMotion API  (Accel + Gyro @ 50Hz)         │   │
│   └─────────────────────────┬────────────────────────────────┘   │
│                             ▼                                    │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │           Circular Buffer (128 × 6 samples)              │   │
│   │              50% Overlap  →  Shift 64 samples            │   │
│   └─────────────────────────┬────────────────────────────────┘   │
│                             ▼                                    │
│   ┌──────────────────────────────────────────────────────────┐   │
│   │                  ⚛️  React Dashboard                      │   │
│   │                                                          │   │
│   │    ActivityCard │ SensorChart │ Timeline │ CalorieTracker │   │
│   └─────────────────────────┬────────────────────────────────┘   │
└─────────────────────────────┼────────────────────────────────────┘
                              │
                    POST /predict (JSON)
                     128 × 6 float array
                              │
                              ▼
┌──────────────────────────────────────────────────────────────────┐
│                       🖥️  FLASK BACKEND                          │
│                                                                  │
│   ┌──────────┐    ┌──────────────┐    ┌────────────────────┐    │
│   │ Validate │ →  │ StandardScale│ →  │  Bidirectional     │    │
│   │ (128 × 6)│    │ (scaler.pkl) │    │  LSTM Inference    │    │
│   └──────────┘    └──────────────┘    │  (har_model.h5)    │    │
│                                       └─────────┬──────────┘    │
│                                                 │               │
│                          ┌──────────────────────┘               │
│                          ▼                                      │
│                  { activity: "WALKING",                         │
│                    confidence: 0.94,                            │
│                    inference_ms: 97 }                           │
└──────────────────────────────────────────────────────────────────┘
```

<br/>

---

## 🔬 Model Deep Dive

<details>
<summary><b>🧠 Click to expand — LSTM Architecture, Training, & Sliding Window</b></summary>

<br/>

### Why LSTM?

Human activities produce **temporal sequences** of motion data. A simple classifier can't capture the *rhythmic stride pattern* of walking vs. the *stillness* of sitting. LSTMs process sequences step-by-step, maintaining a memory of prior timesteps — ideal for time-series classification.

### Network Architecture

```
Input Shape: (128, 6)
         │
         ▼
┌─────────────────────────────────┐
│  Bidirectional LSTM (128 units) │  ← Processes forwards AND backwards
│  return_sequences = True        │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│  BatchNormalization             │
│  Dropout (0.4)                  │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│  Bidirectional LSTM (64 units)  │  ← Hierarchical temporal features
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│  BatchNormalization             │
│  Dropout (0.4)                  │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│  Dense (64, ReLU)               │
│  Dropout (0.3)                  │
└────────────┬────────────────────┘
             ▼
┌─────────────────────────────────┐
│  Dense (6, Softmax)             │  → Output probabilities
└─────────────────────────────────┘
```

### Input Features (per timestep)

| Index | Feature | Sensor | Unit |
|:-----:|---------|--------|------|
| 0 | `ax` | Body Accelerometer X | m/s² |
| 1 | `ay` | Body Accelerometer Y | m/s² |
| 2 | `az` | Body Accelerometer Z | m/s² |
| 3 | `gx` | Body Gyroscope X | rad/s |
| 4 | `gy` | Body Gyroscope Y | rad/s |
| 5 | `gz` | Body Gyroscope Z | rad/s |

### Sliding Window & Overlap

```
Sensor Stream:  ──────────────────────────────────────────────────→ time
                |←─── 128 samples (Window 1) ──→|
                               |←─── 128 samples (Window 2) ──→|
                                              |←─── 128 (W3) ──→|
                |←─── 64 shift ───→|
```

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Window Size | 128 timesteps | ~2.56s at 50 Hz — captures full gait cycles |
| Overlap | 50% (shift = 64) | Catches activity transitions mid-window |
| Sampling Rate | 50 Hz | Matches UCI HAR dataset |
| Prediction Interval | ~1.28s | Smooth real-time feel |

### Training Details

| Metric | Value |
|--------|-------|
| Dataset | UCI HAR (10,299 windows) |
| Train / Test Split | 7,352 / 2,947 |
| Optimizer | Adam (lr=0.001) |
| Loss | Categorical Crossentropy |
| Epochs | 50 (with EarlyStopping) |
| Best Accuracy | **~96%+** |

</details>

<br/>

---

## 📁 Project Structure

```
har-activity-recognition/
│
├── 🐍 backend/
│   ├── app.py                       # Flask application factory + CORS + logging
│   ├── routes/
│   │   ├── predict.py               # POST /predict — main inference endpoint
│   │   └── health.py                # GET /health — liveness probe
│   ├── services/
│   │   ├── model_loader.py          # Singleton pattern: lazy-load model + scaler
│   │   ├── inference.py             # Full pipeline: preprocess → predict → decode
│   │   └── preprocessing.py         # StandardScaler transform (matches training)
│   ├── model/
│   │   ├── best_har_model.h5        # Trained Bidirectional LSTM weights
│   │   ├── scaler.pkl               # Fitted StandardScaler (joblib)
│   │   └── class_map.json           # { "0": "WALKING", "1": "WALKING_UPSTAIRS", ... }
│   ├── utils/
│   │   └── validators.py            # Input shape, type, NaN, range validation
│   ├── requirements.txt
│   └── Dockerfile
│
├── ⚛️  frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityCard.jsx      # Hero activity card with emoji avatars
│   │   │   ├── SensorChart.jsx       # Real-time Recharts line graph
│   │   │   ├── Timeline.jsx          # Scrollable activity history
│   │   │   ├── CalorieTracker.jsx    # Donut chart + duration progress bars
│   │   │   └── SensorPermission.jsx  # Permission flow + demo fallback
│   │   ├── services/
│   │   │   ├── sensorService.js      # DeviceMotion API + simulated 50 Hz stream
│   │   │   ├── bufferService.js      # Circular buffer with 50% overlap windowing
│   │   │   └── apiService.js         # Fetch + throttle + timeout management
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx         # Main dashboard — state hub (useReducer)
│   │   │   └── Landing.jsx           # Landing page with feature grid
│   │   ├── utils/
│   │   │   └── calorieUtils.js       # MET values, colours, icons, calorie math
│   │   ├── App.jsx                   # Router + page transitions
│   │   ├── main.jsx                  # Entry point
│   │   └── styles.css                # Full design system (dark theme + glassmorphism)
│   ├── package.json
│   └── vite.config.js
│
├── 📸 screenshots/                   # 14 high-quality screenshots (desktop + mobile)
├── 📓 notebook/                      # Jupyter training notebook + Python script
├── docker-compose.yml                # Full-stack Docker orchestration
└── README.md                         # ← You are here! 😎
```

<br/>

---

## 🚀 Quick Start

### 📋 Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Python | 3.10+ | Backend runtime |
| Node.js | 18+ | Frontend build |
| pip | Latest | Python packages |
| npm | 9+ | JS packages |

### ⚡ Installation

**1.** Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/har-activity-recognition.git
cd har-activity-recognition
```

**2.** Set up the Backend
```bash
cd backend

# Create & activate virtual environment
python -m venv venv
source venv/bin/activate          # Linux / macOS
# venv\Scripts\activate           # Windows

# Install dependencies
pip install -r requirements.txt
```

**3.** Set up the Frontend
```bash
cd frontend

# Install dependencies
npm install
```

**4.** Start the application
```bash
# Terminal 1 — Backend (port 5000)
cd backend && python app.py

# Terminal 2 — Frontend (port 3000)
cd frontend && npm run dev
```

**5.** Open the app
```
🖥️  Desktop:  http://localhost:3000  →  Click "Demo Mode"
📱  Mobile:   Use ngrok for HTTPS (required for sensor access)
```

### 📱 Mobile Access (via ngrok)

The `DeviceMotion` API requires **HTTPS** on mobile browsers. Use [ngrok](https://ngrok.com) to create a secure tunnel:

```bash
# Terminal 3
ngrok http 3000

# Open the https://xxxxx.ngrok-free.app URL on your phone
# Grant sensor access → Walk around → See real-time predictions! 🎉
```

<br/>

---

## 🐳 Docker Deployment

```bash
# Build and start both services
docker-compose up --build

# 🖥️  Frontend:  http://localhost:3000
# ⚙️  Backend:   http://localhost:5000
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `FLASK_DEBUG` | `false` | Enable Flask debug mode |
| `CORS_ORIGINS` | `http://localhost:3000` | Allowed CORS origins |
| `HAR_MODEL_PATH` | `model/best_har_model.h5` | Path to trained model |
| `HAR_SCALER_PATH` | `model/scaler.pkl` | Path to fitted scaler |
| `LAZY_LOAD` | `false` | Lazy-load model (vs. eager) |

<br/>

---

## 📱 Live Demo

### 🖥️ Desktop Views

<table>
<tr>
<td width="50%" align="center">

**Landing Page — Hero Section**

<img src="screenshots/desktop2.png" width="100%" alt="Landing page with gradient title, activity pills, and Open Dashboard button"/>

> *Gradient title, activity pills, and deep learning hero section*

</td>
<td width="50%" align="center">

**Landing Page — Feature Grid**

<img src="screenshots/desktop3.png" width="100%" alt="Feature cards: Deep Learning LSTM, Real-Time Sensors, Live Visualisation, Privacy First"/>

> *Feature cards showcasing core capabilities with glassmorphism design*

</td>
</tr>
<tr>
<td colspan="2" align="center">

**Dashboard — Sensor Permission Request**

<img src="screenshots/desktop1.png" width="80%" alt="Sensor Access Required dialog with Grant Sensor Access and Demo Mode buttons"/>

> *Clean permission flow with API status indicator and demo mode fallback*

</td>
</tr>
</table>

### 📱 Mobile Views — Complete User Journey

> Screenshots captured on a real Android device via **ngrok HTTPS tunnel**, using **actual phone sensors** for live activity recognition.

<table>
<tr>
<td width="33%" align="center">

**① Landing Page**

<img src="screenshots/ph1.jpg" width="100%" alt="Mobile landing page via ngrok"/>

> *Landing page via ngrok — deep learning badge, gradient title, activity labels*

</td>
<td width="33%" align="center">

**② Feature Cards**

<img src="screenshots/ph3.jpg" width="100%" alt="Mobile feature cards"/>

> *Feature cards — LSTM, Real-Time Sensors, Live Visualisation, Privacy First*

</td>
<td width="33%" align="center">

**③ Sensor Permission**

<img src="screenshots/ph4.jpg" width="100%" alt="Mobile sensor permission request"/>

> *Sensor permission dialog with gradient Grant Access button*

</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center">

**④ Permission (Variant)**

<img src="screenshots/ph5.jpg" width="100%" alt="Sensor permission variant view"/>

> *Alternate permission view — API online, sensor access pending*

</td>
<td width="33%" align="center">

**⑤ Walking Detection**

<img src="screenshots/ph6.jpg" width="100%" alt="Walking detected with 62% confidence"/>

> *🚶 Walking detected! 62% confidence, 101ms latency, live gyroscope stream*

</td>
<td width="33%" align="center">

**⑥ Standing Detection**

<img src="screenshots/ph2.jpg" width="100%" alt="Standing detected with 35% confidence"/>

> *🧍 Standing detected — Session stats: 24 predictions, 97ms latency*

</td>
</tr>
</table>

<table>
<tr>
<td width="33%" align="center">

**⑦ Sitting Detection**

<img src="screenshots/ph7.jpg" width="100%" alt="Sitting detected with 69% confidence"/>

> *🪑 Sitting at 69% confidence — note the flat gyroscope signal*

</td>
<td width="33%" align="center">

**⑧ Sitting Accelerometer**

<img src="screenshots/ph8.jpg" width="100%" alt="Sitting with accelerometer data shown"/>

> *Accel view during sitting — ~9.8 m/s² on Y-axis (gravity), flat X/Z*

</td>
<td width="33%" align="center">

**⑨ Climbing Upstairs**

<img src="screenshots/ph11.jpg" width="100%" alt="Walking upstairs detected"/>

> *🧗 Walking Upstairs! 105 predictions made, 154ms latency, active gyro signal*

</td>
</tr>
</table>

<table>
<tr>
<td width="50%" align="center">

**⑩ Activity Timeline**

<img src="screenshots/ph10.jpg" width="60%" alt="Activity timeline showing chronological activity changes"/>

> *Scrollable timeline — Upstairs (96%), Laying, Sitting transitions with timestamps & confidence scores. Calorie tracker shows 15.7 kcal burned.*

</td>
<td width="50%" align="center">

**⑪ Calorie Tracker**

<img src="screenshots/ph9.jpg" width="60%" alt="Calorie tracker with donut chart and activity breakdown"/>

> *Donut chart (15.5 kcal) with per-activity duration bars — Sitting 1m 8s, Upstairs 1m 2s, Walking 26s, Downstairs 25s, Laying 7s. Total session: 3m 11s.*

</td>
</tr>
</table>

<br/>

---

## 📡 API Reference

### `POST /predict`

Classify a window of sensor data into one of 6 activities.

**Request:**
```json
{
  "sensor_data": [
    [0.25, 9.81, -0.10, 1.2, -0.5, 0.3],
    [0.28, 9.78, -0.12, 1.1, -0.4, 0.2],
    "... (128 rows × 6 columns)"
  ]
}
```

**Response `200 OK`:**
```json
{
  "activity": "WALKING",
  "activity_index": 0,
  "confidence": 0.9423,
  "probabilities": {
    "WALKING": 0.9423,
    "WALKING_UPSTAIRS": 0.0312,
    "WALKING_DOWNSTAIRS": 0.0198,
    "SITTING": 0.0034,
    "STANDING": 0.0021,
    "LAYING": 0.0012
  },
  "inference_ms": 23.45
}
```

**Error `400 Bad Request`:**
```json
{
  "error": "Expected 128 timesteps, got 64."
}
```

### `GET /health`

```json
{
  "status": "healthy",
  "model_loaded": true,
  "scaler_loaded": true,
  "service": "HAR Prediction API",
  "version": "1.0.0"
}
```

<br/>

---

## 🛠️ Tech Stack

<table>
<tr>
<td align="center" width="14%"><b>Layer</b></td>
<td align="center" width="20%"><b>Technology</b></td>
<td align="center" width="66%"><b>Purpose</b></td>
</tr>
<tr>
<td align="center">🎨 Frontend</td>
<td align="center"><img src="https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black" alt="React"/></td>
<td>Component-based SPA with hooks (useState, useReducer, useEffect, useCallback)</td>
</tr>
<tr>
<td align="center">⚡ Bundler</td>
<td align="center"><img src="https://img.shields.io/badge/Vite-6.4-646CFF?logo=vite&logoColor=white" alt="Vite"/></td>
<td>Lightning-fast HMR dev server with API proxy configuration</td>
</tr>
<tr>
<td align="center">📊 Charts</td>
<td align="center"><img src="https://img.shields.io/badge/Recharts-2.15-FF6384?logo=chart.js&logoColor=white" alt="Recharts"/></td>
<td>Real-time sensor waveform line charts with toggleable accelerometer/gyroscope</td>
</tr>
<tr>
<td align="center">🎭 UI</td>
<td align="center"><img src="https://img.shields.io/badge/Bootstrap-5.3-7952B3?logo=bootstrap&logoColor=white" alt="Bootstrap"/></td>
<td>Responsive grid + custom dark glassmorphism CSS design system</td>
</tr>
<tr>
<td align="center">✨ Animation</td>
<td align="center"><img src="https://img.shields.io/badge/Framer_Motion-12-FF0050?logo=framer&logoColor=white" alt="Framer Motion"/></td>
<td>Spring-based page transitions and component animations</td>
</tr>
<tr>
<td align="center">🐍 Backend</td>
<td align="center"><img src="https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white" alt="Flask"/></td>
<td>Lightweight REST API with blueprints, CORS, structured logging</td>
</tr>
<tr>
<td align="center">🧠 ML</td>
<td align="center"><img src="https://img.shields.io/badge/TensorFlow-2.18-FF6F00?logo=tensorflow&logoColor=white" alt="TensorFlow"/></td>
<td>Bidirectional LSTM model inference (Keras .h5 format)</td>
</tr>
<tr>
<td align="center">📐 Scaling</td>
<td align="center"><img src="https://img.shields.io/badge/scikit--learn-1.6-F7931E?logo=scikitlearn&logoColor=white" alt="scikit-learn"/></td>
<td>StandardScaler to normalise input features (fitted on training data)</td>
</tr>
<tr>
<td align="center">🐳 Deploy</td>
<td align="center"><img src="https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker&logoColor=white" alt="Docker"/></td>
<td>Multi-container orchestration with health checks and volume mounts</td>
</tr>
<tr>
<td align="center">🌐 Tunnel</td>
<td align="center"><img src="https://img.shields.io/badge/ngrok-HTTPS-1F1E37?logo=ngrok&logoColor=white" alt="ngrok"/></td>
<td>HTTPS tunnel for mobile sensor access (DeviceMotion requires HTTPS)</td>
</tr>
</table>

<br/>

---

## ⚡ Performance

<table>
<tr>
<td>

| Metric | Target | Achieved |
|--------|:------:|:--------:|
| 🧠 Model Accuracy | >90% | **~96%+** ✅ |
| ⏱️ Inference Time | <100ms | **~97ms** ✅ |
| 🌐 API Response | <200ms | **~105ms** ✅ |
| 📡 Sensor Sampling | 50 Hz | **50 Hz** ✅ |
| 🪟 Window Latency | ~2.56s | **~1.28s** ✅ |
| 📦 Model Size | <10MB | **3.8 MB** ✅ |
| 🔄 Prediction Rate | ~0.7/s | **~0.8/s** ✅ |

</td>
<td>

| Frontend Metric | Value |
|----------------|:-----:|
| Bundle Size (gzipped) | ~82 KB |
| First Contentful Paint | <1.0s |
| Vite Build Time | ~8s |
| Hot Reload | <100ms |
| Components | 5 |
| Services | 3 |

</td>
</tr>
</table>

<br/>

---

## 🗺️ Roadmap

```mermaid
graph LR
    A[✅ Phase 1<br/>Core MVP] --> B[✅ Phase 2<br/>Full Dashboard]
    B --> C[🔄 Phase 3<br/>Enhancements]
    C --> D[🔮 Phase 4<br/>Future]

    style A fill:#00D4AA,stroke:#00D4AA,color:#000
    style B fill:#00D4AA,stroke:#00D4AA,color:#000
    style C fill:#F59E0B,stroke:#F59E0B,color:#000
    style D fill:#7C3AED,stroke:#7C3AED,color:#fff
```

| Phase | Feature | Status |
|:-----:|---------|:------:|
| 1 | LSTM model training on UCI HAR dataset | ✅ Done |
| 1 | Flask REST API with prediction endpoint | ✅ Done |
| 2 | React dashboard with sensor charts | ✅ Done |
| 2 | Calorie tracker, timeline, session stats | ✅ Done |
| 2 | Mobile sensor integration via DeviceMotion | ✅ Done |
| 2 | Docker deployment | ✅ Done |
| 3 | WebSocket for lower latency streaming | 🔄 Planned |
| 3 | TensorFlow.js for on-device inference | 🔄 Planned |
| 3 | PWA with offline support | 🔄 Planned |
| 4 | Multi-user session comparison | 🔮 Future |
| 4 | Exercise routine builder | 🔮 Future |
| 4 | Apple Watch / WearOS integration | 🔮 Future |

<br/>

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

```bash
# 1. Fork the repository
# 2. Create a feature branch
git checkout -b feature/awesome-feature

# 3. Make your changes and commit
git commit -m "feat: add awesome feature"

# 4. Push and create a Pull Request
git push origin feature/awesome-feature
```

### Guidelines

- Follow existing code style and project structure
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

<br/>

---

## 📜 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

<br/>

---

## 👤 Author

<p align="center">
  <img src="https://img.shields.io/badge/GitHub-Profile-181717?style=for-the-badge&logo=github&logoColor=white" alt="GitHub"/>
  <img src="https://img.shields.io/badge/LinkedIn-Connect-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="LinkedIn"/>
  <img src="https://img.shields.io/badge/Portfolio-Website-7C3AED?style=for-the-badge&logo=googlechrome&logoColor=white" alt="Portfolio"/>
  <img src="https://img.shields.io/badge/Email-Contact-EA4335?style=for-the-badge&logo=gmail&logoColor=white" alt="Email"/>
</p>

### 🎓 Skills Demonstrated in This Project

<table>
<tr>
<td width="50%">

**Machine Learning & AI**
- Deep Learning (LSTM, BiLSTM)
- Time-series classification
- Feature engineering & data preprocessing
- Model training, evaluation & deployment
- StandardScaler normalization pipeline

</td>
<td width="50%">

**Full-Stack Development**
- React 18 with hooks (useReducer, useCallback)
- Flask REST API with blueprints
- Real-time data streaming & visualization
- Responsive UI design (mobile-first)
- Docker containerization & deployment

</td>
</tr>
<tr>
<td width="50%">

**Software Engineering**
- Clean architecture (services/routes/utils)
- Singleton design pattern
- Input validation & error handling
- Structured logging
- Environment-based configuration

</td>
<td width="50%">

**Domain Knowledge**
- Signal processing (sliding window, overlap)
- Sensor data (accelerometer, gyroscope)
- Web APIs (DeviceMotion, Permissions)
- MET-based calorie estimation
- Cross-platform mobile compatibility

</td>
</tr>
</table>

<br/>

---

## 🙏 Acknowledgments

- [UCI HAR Dataset](https://archive.ics.uci.edu/ml/datasets/human+activity+recognition+using+smartphones) — Anguita et al., 2013
- [TensorFlow / Keras](https://www.tensorflow.org/) — Deep learning framework
- [React](https://react.dev/) — Frontend UI library
- [Recharts](https://recharts.org/) — Composable chart library
- [Framer Motion](https://www.framer.com/motion/) — Animation library
- [capsule-render](https://github.com/kyechan99/capsule-render) — Dynamic header images
- [Shields.io](https://shields.io/) — Badge generation

<br/>

---

## ⭐ Show Your Support

If this project helped you learn something new or you found it useful, please consider giving it a **star** ⭐

It helps others discover the project and motivates continued development!

<p align="center">
  <a href="https://github.com/YOUR_USERNAME/har-activity-recognition">
    <img src="https://img.shields.io/badge/⭐_Star_This_Repo-FFD700?style=for-the-badge" alt="Star"/>
  </a>
  <a href="https://github.com/YOUR_USERNAME/har-activity-recognition/fork">
    <img src="https://img.shields.io/badge/🍴_Fork_This_Repo-7C3AED?style=for-the-badge" alt="Fork"/>
  </a>
</p>

<br/>

<p align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=gradient&customColorList=6,11,20&height=120&section=footer&animation=twinkling" width="100%"/>
</p>

<p align="center">
  Built with ❤️ using <b>React · Flask · TensorFlow · LSTM</b>
</p>
