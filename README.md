# Active Repo

This project is a serverless Node.js/TypeScript application that automatically generates documentation, social media posts, and video scripts from your GitHub commits using Gemini 3.

## Features

- **Automated Documentation**: Updates `README.md` with every push.
- **Social Media Ready**: Generates LinkedIn/Twitter posts for your updates.
- **Video Scripts**: Creates visual prompts for AI video generators like Veo.
- **Serverless**: Deployed on Vercel.

## Setup

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up `.env` with `GITHUB_TOKEN`, `GITHUB_WEBHOOK_SECRET`, and `GOOGLE_API_KEY`.
4.  Run locally: `npm run dev`

## Deployment

Deploy to Vercel and configure the webhook URL in your GitHub repository settings.
