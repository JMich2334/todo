# To-Do's

A simple daily to-do list: three priority levels, a time estimate per task, and a running total of how much work is still on the board. Tasks save to the browser's local storage, so they persist on the device without an account or backend.

## Run locally

```bash
npm install
npm run dev
```

## Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/todo-priorities.git
git push -u origin main
```

## Deploy on Vercel

1. Go to vercel.com and click **Add New → Project**.
2. Import the GitHub repo.
3. Vercel auto-detects Vite. Leave the defaults:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Click **Deploy**.

Every push to `main` redeploys automatically.

## Add it to your phone's home screen

Open the deployed URL in Safari or Chrome → Share → **Add to Home Screen**. It launches full-screen like a native app.

## Notes

- Data lives in `localStorage` under the key `todos-v3`. It's per-device and per-browser — clearing site data wipes the list.
- To sync across devices later, swap the two `localStorage` calls in `src/App.jsx` for API calls to a backend of your choice.
