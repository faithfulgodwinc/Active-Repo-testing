import { Octokit } from 'octokit';
import { config } from '../config/env';
import { FileDiff } from '../types';

export class GitHubService {
    private octokit: Octokit;

    constructor() {
        this.octokit = new Octokit({
            auth: config.github.token,
        });
    }

    async getCommitDiff(owner: string, repo: string, ref: string): Promise<FileDiff[]> {
        try {
            const response = await this.octokit.request('GET /repos/{owner}/{repo}/commits/{ref}', {
                owner,
                repo,
                ref,
            });

            if (!response.data.files) {
                return [];
            }

            return response.data.files.map((file: any) => ({
                filename: file.filename,
                status: file.status,
                patch: file.patch,
                additions: file.additions,
                deletions: file.deletions,
            }));
        } catch (error) {
            console.error('Error fetching commit diff:', error);
            throw error;
        }
    }

    async updateReadme(owner: string, repo: string, content: string): Promise<void> {
        const path = 'README.md';
        const message = 'docs: update README via Active Repo';

        try {
            // 1. Get current README to find SHA
            let sha: string | undefined;
            let currentContent = '';

            try {
                const { data } = await this.octokit.request('GET /repos/{owner}/{repo}/contents/{path}', {
                    owner,
                    repo,
                    path,
                });

                if (!Array.isArray(data) && data.type === 'file') {
                    sha = data.sha;
                    currentContent = Buffer.from(data.content, 'base64').toString('utf-8');
                }
            } catch (e: any) {
                if (e.status !== 404) throw e;
                // File doesn't exist, will create it
            }

            // 2. Append new content
            // Add a header and the new documentation
            const newContent = `\n\n## Update - ${new Date().toISOString().split('T')[0]}\n\n${content}\n\n${currentContent}`;
            const encodedContent = Buffer.from(newContent).toString('base64');

            // 3. Update file
            await this.octokit.request('PUT /repos/{owner}/{repo}/contents/{path}', {
                owner,
                repo,
                path,
                message,
                content: encodedContent,
                sha,
            });

            console.log(`Successfully updated README.md for ${owner}/${repo}`);
        } catch (error) {
            console.error('Error updating README:', error);
            throw error;
        }
    }
}
