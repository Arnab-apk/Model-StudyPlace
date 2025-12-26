# 3D Learning Hub

A modern, interactive 3D educational platform built with Vanilla JS, Tailwind CSS, and Google Model Viewer.

## 🚀 Deployment on Vercel

This project is optimized for Vercel deployment as a static site.

### Quick Deploy
1.  Push this folder to a GitHub repository.
2.  Import the repository in Vercel.
3.  Vercel will detect it as a static site (HTML/JS).
4.  Click **Deploy**.

### Project Structure
-   `index.html`: Landing page.
-   `viewer.html`: Main 3D application.
-   `about.html`: Information page.
-   `js/main.js`: Core logic.
-   `vercel.json`: Routing configuration.

## Features
-   **Zero Build Step**: No `npm install` or `npm build` required. Runs natively.
-   **Fast Loading**: Uses CDN for Tailwind and Model Viewer.
-   **Responsive**: Full mobile support.

## AI Chatbot Setup

The chatbot uses a backend proxy to call Google Gemini securely.

- Deploy on Vercel (recommended). The project includes `api/chat.js`.
- Set the environment variable `GOOGLE_API_KEY` to your Gemini API key.
- No client-side keys are used, and there is no fallback in code—`GOOGLE_API_KEY` must be configured on the server.

### Local Dev (Vercel CLI)

```bash
npm i -g vercel
vercel dev
```

Open `http://localhost:3000` and use the chatbot in the bottom-right.

On Windows PowerShell, you can run with a temporary env var:

```powershell
$env:GOOGLE_API_KEY="YOUR_KEY_HERE"; vercel dev
```

### Notes
- Frontend sends messages to `/api/chat` with context; responses return as JSON.
- For production, store keys only in environment variables, not client code.
