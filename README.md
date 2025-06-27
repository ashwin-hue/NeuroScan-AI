# 🧠 NeuroScan AI — Stroke Detection System

**NeuroScan AI** is an advanced medical imaging web application that uses deep learning to detect potential stroke indicators from brain CT scans. Built with TensorFlow, Flask, and Bootstrap, this tool provides instant, AI-powered analysis for research and preliminary assessment purposes.

> ⚠️ **For Research Use Only. Not for Diagnostic Purposes.**

---

## 🚀 Live Demo

 

---

## 🧬 Features

- 🖼️ Upload brain CT scans (JPG, PNG)
- ⚡ Real-time AI prediction (Ischemia, Bleeding, Normal)
- 📈 Confidence score + diagnostic summary
- 📱 Responsive web interface
- 🔍 Find local medical specialists (location-based)
- ♻️ In-memory processing (no file storage on disk)

---

## 🔧 Technical Specifications

| Feature                | Description                        |
|------------------------|------------------------------------|
| **Model Architecture** | EfficientNet-B0                    |
| **Training Data**      | 6,650 annotated brain CT scans     |
| **Accuracy**           | 81.4% (on validation set)          |
| **Processing Time**    | Typically under 15 seconds         |
| **Tech Stack**         | Flask, TensorFlow, HTML/CSS/JS     |

---

## 📊 How It Works

1. **Upload a CT Scan** (drag & drop or file picker)
2. **AI Analyzes the Image** using EfficientNet-B0
3. **Receive Diagnosis** with:
   - Predicted stroke condition
   - Confidence score
   - Stroke status (normal / suspected)
4. **Consult a Doctor** using integrated location-based suggestions

---

## 🛠️ Installation

### 1. Clone the repository:
```bash
git clone https://github.com/yourusername/neuroscan-ai.git
cd neuroscan-ai
