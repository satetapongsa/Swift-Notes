# ✨ Swift Notes

**Swift Notes** is a premium, minimalist note-taking application designed for speed, security, and intelligent organization. Built with a modern tech stack and a stunning glassmorphism aesthetic, it provides a seamless writing experience across all your devices.

![Swift Notes Banner](public/banner.png)

## 🚀 Key Features

- **⚡ Blazing Fast Creation**: Start a new note in seconds with our streamlined "Zen" workflow.
- **✨ AI Summarization**: Powered by **Groq (Llama 3)**. Instantly summarize long notes with a single click at lightning speed.
- **🔐 Phone-Style Security**: Secure your sensitive thoughts with a mobile-inspired 6-digit PIN lock, complete with automatic validation and haptic-style feedback.
- **📁 Smart Organization**: Categorize notes into beautiful, color-coded folders.
- **🌍 Collaborative Workspaces**: Share your ideas and collaborate with others in real-time.
- **🗑️ Smart Trash**: Deleted something by mistake? Recover it from the trash or delete it permanently.
- **🌓 Premium Aesthetics**: Full glassmorphism design system with smooth animations and a responsive mobile-first layout.

## 🛠️ Tech Stack

- **Frontend**: React (Vite), Lucide Icons, Glassmorphism CSS.
- **Backend**: Neon PostgreSQL (Serverless Database).
- **ORM**: Drizzle ORM for type-safe database interactions.
- **AI**: Groq API (Llama 3 70B) for high-performance summarization.
- **Mobile**: Capacitor for Android/iOS deployment.

## 📦 Mobile Installation (Android APK)

We are proud to release the first official version of Swift Notes for Android!

1.  Go to the **[Releases](https://github.com/satetapongsa/Swift-Notes/releases)** page on GitHub.
2.  Download the `SwiftNotes-v1.0.0.apk`.
3.  Transfer the file to your Android phone.
4.  Open the file and allow installation from "Unknown Sources" if prompted.
5.  Enjoy a premium note-taking experience on the go!

## 💻 Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/satetapongsa/Swift-Notes.git
   cd Swift-Notes
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file and add your `DATABASE_URL` and `VITE_GROQ_API_KEY`.

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 Security Note

Sensitive credentials (like API keys and Database URLs) are managed via `.env` files and are **never** committed to version control. Please refer to `.env.example` for the required configuration.

---

### 🎉 v1.0.0 First Release
This is the official first release of Swift Notes. We've focused on stability, aesthetic excellence, and core features to get you started with the best note-taking experience.

Created with ❤️ by [satetapongsa]
