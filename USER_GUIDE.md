# Active Repo - User Guide

Welcome to Active Repo! This guide will help you set up and use the automated documentation and content generation system.

## 🚀 Getting Started

### Prerequisites
1.  **Node.js 18+**: Ensure you have Node installed.
2.  **Git**: Version control system.
3.  **GitHub Account**: For hosting your code.
4.  **Google AI Studio Account**: For Gemini API access.

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/faithfulgodwinc/Active-Repo-testing.git
    cd Active-Repo-testing
    ```

2.  **Install Dependencies**
    ```bash
    npm install
    ```

3.  **Configure Environment**
    Copy `.env.example` to `.env` and fill in your keys:
    ```bash
    cp .env.example .env
    ```
    - `GITHUB_TOKEN`: Create a Classic PAT with `repo` scope.
    - `GITHUB_WEBHOOK_SECRET`: A random string you generate.
    - `GOOGLE_API_KEY`: Get from [Google AI Studio](https://aistudio.google.com/).

4.  **Run Locally**
    ```bash
    npm run dev
    ```
    The server will start at `http://localhost:3000`.

## 🌐 Deployment (Vercel)

1.  Install Vercel CLI: `npm i -g vercel`
2.  Run `vercel` in the project root to deploy.
3.  In the Vercel Dashboard, go to **Settings > Environment Variables** and add your secrets.

## 🔗 Connecting to GitHub

1.  Go to your GitHub Repo Settings -> **Webhooks**.
2.  Add a new webhook pointing to your deployed URL (e.g., `https://your-app.vercel.app/webhook`).
3.  Set Content Type to `application/json`.
4.  Paste your `GITHUB_WEBHOOK_SECRET`.
5.  Select "Just the push event".

## 🎉 Usage

Simply push code to your repository!
```bash
git add .
git commit -m "feat: add amazing new feature"
git push
```

**Active Repo** will:
1.  Analyze your changes with Gemini 3.
2.  Update your `README.md` with documentation.
3.  Generate a social post and video script (simulated queue).
