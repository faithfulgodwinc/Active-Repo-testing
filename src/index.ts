import express from 'express';
import dotenv from 'dotenv';
import { WebhookHandler } from './handlers/webhook';
import { config } from './config/env';

dotenv.config();

const app = express();


app.use(express.json());

const webhookHandler = new WebhookHandler();

app.get('/', (req, res) => {
    res.send('Active Repo is running!');
});

app.post('/webhook', webhookHandler.handle);

// Export app for serverless deployments (Vercel)
export default app;

// Only start the server if we're running locally or explicitly via node command
if (require.main === module) {
    app.listen(config.server.port, () => {
        console.log(`Server is running on port ${config.server.port}`);
    });
}
