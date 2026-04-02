# ⌨️ TYPECHECK — Typing Speed Test

A brutalist terminal-themed typing speed test built with vanilla HTML, CSS, and JavaScript. Real-time WPM tracking, accuracy scoring, and character-level feedback — no frameworks, no dependencies.

---

## ✨ Features

- **Live WPM counter** — updates every second as you type
- **Character-level feedback** — green for correct, red for wrong, animated cursor on current position
- **Accuracy tracking** — calculated in real time from total keystrokes vs errors
- **3 time modes** — 15s, 30s, and 60s
- **Results screen** — net WPM, raw WPM, accuracy %, characters typed, errors, and a performance rating
- **CRT aesthetic** — scanline overlay, monospace font, terminal color palette
- **Keyboard shortcuts** — `TAB` or `ESC` to instantly restart
- **Zero dependencies** — pure HTML, CSS, and JavaScript

---

## 📁 Project Structure

```
typecheck-typing-test/
├── index.html     # Markup and layout
├── style.css      # Terminal styling, animations, results screen
└── app.js         # Typing logic, WPM/accuracy engine, timer
```

---

## 🚀 Getting Started

The project uses separate CSS and JS files, so you need a local server (browsers block local file loading for security).

### Option 1 — VS Code Live Server (easiest)

1. Install the [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) extension
2. Open the project folder in VS Code
3. Right-click `index.html` → **Open with Live Server**

### Option 2 — Node.js

```bash
npx serve .
```

### Option 3 — Python

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in your browser.

---

## 🎮 How to Use

| Action | Effect |
|---|---|
| Start typing | Timer begins automatically |
| `TAB` | Restart test |
| `ESC` | Restart test |
| Mode buttons (15s / 30s / 60s) | Switch time limit |
| Restart button (results screen) | Run again |

---

## 📊 WPM Calculation

- **Raw WPM** — total characters typed ÷ 5 ÷ elapsed minutes
- **Net WPM** — same formula but using only correct characters (penalizes errors)
- **Accuracy** — `(total keystrokes - errors) / total keystrokes × 100`

---

## 🏆 Performance Ratings

| WPM | Rating |
|---|---|
| < 30 | Keep practicing |
| 30 – 49 | Getting there |
| 50 – 69 | Above average |
| 70 – 89 | Impressive |
| 90 – 109 | 🔥 Blazing fast |
| 110+ | ⚡ Elite typist |

---

## 📄 License

MIT — free to use, modify, and distribute.