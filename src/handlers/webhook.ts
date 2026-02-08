import { Request, Response } from 'express';
import { GitHubService } from '../services/github';
import { DiffService } from '../services/diff';
import { GeminiService } from '../services/gemini';
import { QueueService } from '../services/queue';

export class WebhookHandler {
    private githubService: GitHubService;

    constructor() {
        this.githubService = new GitHubService();
    }

    public handle = async (req: Request, res: Response) => {
        const event = req.header('x-github-event');

        if (event !== 'push') {
            console.log(`Ignoring event: ${event}`);
            res.status(200).send('Ignored non-push event');
            return;
        }

        const payload = req.body;
        const { ref, repository, head_commit } = payload;

        if (!head_commit) {
            console.log('No head commit found.');
            res.status(200).send('No head commit');
            return;
        }

        console.log(`Processing push event for ${repository.full_name}, ref: ${ref}, commit: ${head_commit.id}`);

        try {
            const commitDiffs = await this.githubService.getCommitDiff(
                repository.owner.name || repository.owner.login, // Handle both object and string formats if needed, though usually object
                repository.name,
                head_commit.id
            );

            const filteredDiffs = DiffService.filterDiffs(commitDiffs);

            if (filteredDiffs.length === 0) {
                console.log('No relevant changes found in this commit.');
                res.status(200).send('No relevant changes');
                return;
            }

            const formattedDiff = DiffService.formatDiffForAi(filteredDiffs);

            console.log(`Extracted diff length: ${formattedDiff.length}`);
            console.log('--- Diff Preview ---');
            console.log(formattedDiff.substring(0, 500) + (formattedDiff.length > 500 ? '...' : ''));

            // Phase 2: Call Gemini
            const geminiService = new GeminiService();
            const aiContent = await geminiService.generateContent(formattedDiff);

            if (!aiContent) {
                console.log('Gemini determined the changes are not significant.');
                res.status(200).json({ message: 'Skipped: Not significant' });
                return;
            }

            console.log('--- AI Generated Content ---');
            console.log('Documentation:', aiContent.documentation.substring(0, 100) + '...');
            console.log('Social Post:', aiContent.social_post);

            // Phase 3: "Hype" Deployment

            // 1. Update README
            await this.githubService.updateReadme(
                repository.owner.name || repository.owner.login,
                repository.name,
                aiContent.documentation
            );

            // 2. Queue Video Generation (Veo)
            const queueService = new QueueService();
            await queueService.enqueueVideoGeneration(aiContent.video_script, {
                repo: repository.full_name,
                commit: head_commit.id
            });

            // Phase 5: Dashboard Update
            const hype = {
                id: head_commit.id,
                repo: repository.full_name,
                message: head_commit.message || 'No commit message',
                timestamp: new Date().toISOString(),
                social_post: aiContent.social_post,
                documentation: aiContent.documentation
            };
            const { HypeStore } = require('../services/store'); // Lazy load to avoid circular deps if any
            HypeStore.getInstance().add(hype);

            res.status(200).json({
                message: 'Processed successfully',
                diffLength: formattedDiff.length,
                fileCount: filteredDiffs.length,
                actions: {
                    readme_updated: true,
                    video_queued: true,
                    dashboard_updated: true
                },
                aiContent: {
                    social_post: aiContent.social_post,
                    documentation_snippet: aiContent.documentation.substring(0, 50) + '...'
                }
            });

        } catch (error) {
            console.error('Error processing webhook:', error);
            res.status(500).send('Internal Server Error');
        }
    };
}
