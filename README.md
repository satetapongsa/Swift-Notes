# ✨ Swift Notes

**Swift Notes** is a premium, minimalist note-taking application designed for speed, security, and intelligent organization. Built with a modern tech stack and a stunning glassmorphism aesthetic, it provides a seamless writing experience across all your devices.

![Swift Notes Banner](https://raw.githubusercontent.com/satetapongsa/Swift-Notes/main/src/assets/hero.png)

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
- **Security**: Passcode hashing and secure session management.

## 📦 Setup & Installation

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
   Create a `.env` file in the root directory and add your credentials:
   ```env
   # Neon PostgreSQL Database URL
   DATABASE_URL=your_neon_db_url_here

   # Groq API Key (for AI features)
   VITE_GROQ_API_KEY=your_groq_api_key_here
   ```

4. **Push Database Schema**:
   ```bash
   npx drizzle-kit push
   ```

5. **Run Development Server**:
   ```bash
   npm run dev
   ```

## 🔐 Security Note

Sensitive credentials (like API keys and Database URLs) are managed via `.env` files and are **never** committed to version control. Please refer to `.env.example` for the required configuration.

---

Created with ❤️ by [Swift Notes Team]
