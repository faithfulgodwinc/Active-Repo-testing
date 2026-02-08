import dotenv from 'dotenv';

dotenv.config();

export const config = {
    github: {
        token: process.env.GITHUB_TOKEN || '',
        webhookSecret: process.env.GITHUB_WEBHOOK_SECRET || '',
    },
    google: {
        apiKey: process.env.GOOGLE_API_KEY || '',
    },
    server: {
        port: parseInt(process.env.PORT || '3000', 10),
    },
};

if (!config.github.token) {
    console.warn('WARNING: GITHUB_TOKEN is not set.');
}
if (!config.google.apiKey) {
    console.warn('WARNING: GOOGLE_API_KEY is not set.');
}
