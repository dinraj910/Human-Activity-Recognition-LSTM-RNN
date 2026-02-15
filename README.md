# 🏃 Human Activity Recognition — Full-Stack Web Application

> Real-time human activity classification using a **Bidirectional LSTM** deep learning model, streaming sensor data from your mobile browser.

![Python](https://img.shields.io/badge/Python-3.11-3776AB?logo=python&logoColor=white)
![TensorFlow](https://img.shields.io/badge/TensorFlow-2.18-FF6F00?logo=tensorflow&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Architecture](#architecture)
- [Model Details](#model-details)
- [Sliding Window & Overlap](#sliding-window--overlap)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [API Reference](#api-reference)
- [Deployment](#deployment)
- [Screenshots](#screenshots)

---

## 🧠 Overview

This application classifies **6 human activities** in real time:

| Activity            | MET Value | Description |
|---------------------|-----------|-------------|
| 🚶 WALKING          | 3.5       | Normal pace walking |
| 🧗 WALKING_UPSTAIRS | 8.0       | Climbing stairs |
| 🏃 WALKING_DOWNSTAIRS| 4.0      | Descending stairs |
| 🪑 SITTING          | 1.3       | Seated position |
| 🧍 STANDING         | 1.8       | Upright standing |
| 🛌 LAYING           | 1.0       | Lying down |

The system uses the **UCI HAR Dataset** accelerometer and gyroscope signals captured at 50 Hz.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Mobile Browser                        │
│  ┌──────────────────────────────────────────────────┐   │
│  │   DeviceMotion API (Accelerometer + Gyroscope)   │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          ▼                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Circular Buffer (128 timesteps)           │   │
│  │         50% overlap → shift 64 samples            │   │
│  └───────────────────────┬──────────────────────────┘   │
│                          ▼                               │
│  ┌──────────────────────────────────────────────────┐   │
│  │              React Dashboard                      │   │
│  │  • Activity Card  • Sensor Chart  • Timeline     │   │
│  │  • Calorie Tracker  • Session Stats              │   │
│  └───────────────────────┬──────────────────────────┘   │
└──────────────────────────┼──────────────────────────────┘
                           │ POST /predict
                           ▼
┌──────────────────────────────────────────────────────────┐
│                    Flask Backend                          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ Validate   │→ │ Scale data  │→ │ LSTM Inference   │  │
│  │ (128 × 6)  │  │ (scaler.pkl)│  │ (har_model.h5)   │  │
│  └────────────┘  └─────────────┘  └──────────────────┘  │
│                                          │               │
│                    ┌─────────────────────┘               │
│                    ▼                                     │
│            { activity, confidence }                      │
└──────────────────────────────────────────────────────────┘
```

---

## 🔬 Model Details

### Why LSTM?

Human activities produce **temporal sequences** of sensor data. LSTMs (Long Short-Term Memory networks) excel at learning patterns across time steps — they can capture the rhythmic stride pattern of walking vs. the stillness of sitting.

### Architecture

```
Input(128, 6)
  → Bidirectional LSTM(128 units, return_sequences=True)
  → BatchNormalization → Dropout(0.4)
  → Bidirectional LSTM(64 units)
  → BatchNormalization → Dropout(0.4)
  → Dense(64, ReLU) → Dropout(0.3)
  → Dense(6, Softmax) → Output
```

- **Bidirectional**: Processes sequences forwards AND backwards for richer context
- **Stacked**: Two LSTM layers extract hierarchical temporal features
- **Regularisation**: BatchNorm + Dropout prevent overfitting
- **Accuracy**: ~96%+ on UCI HAR test set

### Input Features (per timestep)

| Index | Feature | Source |
|-------|---------|--------|
| 0 | ax | Body Accelerometer X |
| 1 | ay | Body Accelerometer Y |
| 2 | az | Body Accelerometer Z |
| 3 | gx | Body Gyroscope X |
| 4 | gy | Body Gyroscope Y |
| 5 | gz | Body Gyroscope Z |

---

## 📐 Sliding Window & Overlap

```
Sensor Stream:  ──────────────────────────────────────────────────→
                |← 128 samples (Window 1) →|
                                |← 128 samples (Window 2) →|
                                                |← 128 (W3) →|
                |←── 64 shift ──→|
```

- **Window size**: 128 timesteps (~2.56 seconds at 50 Hz)
- **Overlap**: 50% (shift = 64 samples)
- **Why overlap?** Activity transitions often occur mid-window. Overlapping ensures we don't miss transition boundaries and provides smoother predictions.

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | React 18 + Vite | SPA framework |
| UI | Bootstrap 5 + Custom CSS | Responsive design |
| Charts | Recharts | Real-time sensor plots |
| Animations | Framer Motion | Smooth transitions |
| Backend | Flask 3.1 | REST API |
| ML | TensorFlow / Keras | LSTM inference |
| Scaling | scikit-learn | StandardScaler |
| Deploy | Docker + Gunicorn | Production serving |

---

## 📁 Project Structure

```
har-activity-recognition/
├── backend/
│   ├── app.py                  # Flask application factory
│   ├── routes/
│   │   ├── predict.py          # POST /predict endpoint
│   │   └── health.py           # GET /health endpoint
│   ├── services/
│   │   ├── model_loader.py     # Singleton model/scaler loader
│   │   ├── inference.py        # Full prediction pipeline
│   │   └── preprocessing.py    # StandardScaler transform
│   ├── model/
│   │   ├── har_model.h5        # Trained LSTM model
│   │   ├── scaler.pkl          # Fitted StandardScaler
│   │   └── class_map.json      # Index → label mapping
│   ├── utils/
│   │   └── validators.py       # Input shape/range validation
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ActivityCard.jsx     # Current activity hero card
│   │   │   ├── SensorChart.jsx      # Real-time sensor graph
│   │   │   ├── Timeline.jsx         # Activity change history
│   │   │   ├── CalorieTracker.jsx   # Calorie ring + duration bars
│   │   │   └── SensorPermission.jsx # Permission request flow
│   │   ├── services/
│   │   │   ├── sensorService.js     # DeviceMotion + simulation
│   │   │   ├── bufferService.js     # Circular buffer + windowing
│   │   │   └── apiService.js        # Fetch calls + throttling
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx        # Main dashboard (state hub)
│   │   │   └── Landing.jsx          # Landing page
│   │   ├── utils/
│   │   │   └── calorieUtils.js      # MET values, colours, helpers
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── styles.css               # Design system
│   ├── package.json
│   └── vite.config.js
│
├── docker-compose.yml
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites

- **Python 3.10+**
- **Node.js 18+**
- **Trained model files** in `backend/model/`:
  - `har_model.h5` (or `best_har_model.h5` renamed)
  - `scaler.pkl`

### 1. Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate   # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Place your model files
# cp /path/to/best_har_model.h5 model/har_model.h5
# cp /path/to/scaler.pkl model/scaler.pkl

# Run development server
python app.py
# → API available at http://localhost:5000
```

### 2. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start dev server (proxies API to :5000)
npm run dev
# → Dashboard at http://localhost:3000
```

### 3. Using the App

1. Open `http://localhost:3000` on your **mobile browser** for real sensors
2. Or click **"Demo Mode"** on desktop to use simulated data
3. Grant sensor permissions when prompted
4. Watch the dashboard update in real time!

---

## 📡 API Reference

### `POST /predict`

Predict human activity from a sensor window.

**Request:**
```json
{
  "sensor_data": [
    [0.25, 9.81, -0.10, 1.2, -0.5, 0.3],
    ...
  ]
}
```
- `sensor_data`: 128 rows × 6 columns (float)

**Response (200):**
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

**Error Response (400):**
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

---

## 🐳 Deployment

### Docker (Recommended)

```bash
# Build and run both services
docker-compose up --build

# Backend: http://localhost:5000
# Frontend: http://localhost:3000
```

### Production Considerations

1. **Single Gunicorn worker** — TF models are memory-heavy; use threads, not forks
2. **CORS** — Set `CORS_ORIGINS` env var to your frontend domain
3. **HTTPS** — Required for DeviceMotion API on most mobile browsers
4. **Model caching** — Model loads once at startup via singleton pattern
5. **Rate limiting** — Frontend throttles API calls to ~1.5/sec max

---

## 📊 Performance

| Metric | Target | Actual |
|--------|--------|--------|
| Model Accuracy | >90% | ~96% |
| Inference Time | <100ms | ~25ms |
| API Response | <200ms | ~40ms |
| Sensor Sampling | 50 Hz | 50 Hz |
| Window Latency | ~2.56s | ~1.28s (w/ overlap) |

---

## 📜 License

This project is built for educational and portfolio purposes using the
[UCI HAR Dataset](https://archive.ics.uci.edu/ml/datasets/human+activity+recognition+using+smartphones).

---

<p align="center">
  Built with ❤️ using React · Flask · TensorFlow · LSTM
</p>
