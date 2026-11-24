# DSA Practice Lab — 140 MCQs

A responsive React quiz app containing **140 multiple-choice questions across 14 sections**. It is designed to deploy as a free static website using **GitHub Pages**.

## Features

- 14 sections, with 10 MCQs in each section
- Select one answer for every question, then submit the section
- Instant score out of 10 and correct/incorrect answer review
- Retry the current section or restart the entire 140-question quiz
- Navigate between sections and see completion status
- Overall score and progress tracking during the current browser session
- Dark and light themes (theme preference is remembered in the browser)
- Responsive layout for desktop, tablet, and mobile
- No backend, database, API key, or paid hosting required

## Run locally

Requirements: Node.js 20.19+ or 22.12+ and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually `http://localhost:5173`.

To test the production build locally:

```bash
npm run build
npm run preview
```

## Deploy for free with GitHub Pages

This project includes a GitHub Actions workflow at `.github/workflows/deploy.yml`.

1. Create a new **public** repository on GitHub (for example, `dsa-140-mcq`).
2. Extract this ZIP file. Upload the *contents* of the `dsa-140-mcq` folder to the root of the repository. Make sure `package.json`, `index.html`, `src/`, and `.github/` are at the repository root.
3. Commit and push the files to the `main` branch.

   Or, from a terminal inside the extracted project folder, run:

   ```bash
   git init
   git add .
   git commit -m "Add DSA 140 MCQ practice app"
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
   git push -u origin main
   ```

4. On GitHub, open **Settings → Pages**.
5. Under **Build and deployment → Source**, select **GitHub Actions**.
6. Open the repository's **Actions** tab and wait for the **Deploy to GitHub Pages** workflow to finish successfully.
7. Your website URL will be shown in **Settings → Pages**. For a project repository, it will typically look like:

   `https://YOUR-USERNAME.github.io/YOUR-REPOSITORY/`

Every push to `main` automatically rebuilds and redeploys the site.

## Project structure

```text
dsa-140-mcq/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── src/
│   ├── main.jsx
│   ├── quizData.js
│   └── styles.css
├── .gitignore
├── index.html
├── package.json
└── vite.config.js
```

## Updating questions or answers

Edit `src/quizData.js`. Each question has four options and a zero-based `answer` index:

- `0` = A
- `1` = B
- `2` = C
- `3` = D

Keep exactly 10 questions in each section unless you also update the section-count assumptions in `src/main.jsx`.

## Notes on question wording

Question wording and formatting have been cleaned up for consistent display. The linked-list Nth-from-end question in Section 13 uses the standard **two-pointer** terminology rather than “sliding window pointers”; its correct option remains A. Section 11 clarifies that the common interview solution swaps the values at the two target nodes rather than physically relinking node objects.
