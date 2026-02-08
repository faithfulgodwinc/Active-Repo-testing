import express from 'express';
import dotenv from 'dotenv';
import { WebhookHandler } from './handlers/webhook';
import { config } from './config/env';

dotenv.config();

const app = express();


app.use(express.json());

import { HypeHandler } from './handlers/hypes';
import path from 'path';

// ... (existing code)

const webhookHandler = new WebhookHandler();
const hypeHandler = new HypeHandler();

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, '../public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

app.get('/api/hypes', hypeHandler.getAll);
app.post('/webhook', webhookHandler.handle);

// Export app for serverless deployments (Vercel)
export default app;

// Only start the server if we're running locally or explicitly via node command
if (require.main === module) {
    app.listen(config.server.port, () => {
        console.log(`Server is running on port ${config.server.port}`);
    });
}
