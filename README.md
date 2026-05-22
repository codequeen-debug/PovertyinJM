# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is enabled on this template. See [this documentation](https://react.dev/learn/react-compiler) for more information.

Note: This will impact Vite dev & build performances.

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Environment Variables

This project uses Vite environment variables for Firebase and Hugging Face AI integration.

### Setup Instructions

1. Copy `.env.example` to `.env` in the root directory:
   ```bash
   cp .env.example .env
   ```

2. Add your API keys to `.env`:
   - **Firebase**: Get credentials from [Firebase Console](https://console.firebase.google.com/)
   - **Hugging Face**: Get token from [Hugging Face API Tokens](https://huggingface.co/settings/tokens)

3. Restart the Vite dev server after updating `.env`:
   ```bash
   npm run dev
   ```

### Required Environment Variables

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_HUGGING_FACE_API_KEY` (for AI chat feature)
- `VITE_HUGGING_FACE_MODEL` (default: `gpt2`)

**Note:** The `.env` file is git-ignored and will not be committed to the repository.
