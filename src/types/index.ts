export interface CommitInfo {
    id: string;
    message: string;
    author: {
        name: string;
        email: string;
        username?: string;
    };
    url: string;
    timestamp: string;
}

export interface FileDiff {
    filename: string;
    status: 'added' | 'removed' | 'modified' | 'renamed' | 'copied' | 'changed' | 'unchanged';
    patch?: string;
    additions: number;
    deletions: number;
}

export interface PushEvent {
    ref: string;
    before: string;
    after: string;
    repository: {
        name: string;
        full_name: string;
        owner: {
            name: string;
            email?: string;
            login: string;
        };
    };
    commits: CommitInfo[];
    head_commit: CommitInfo;
}

export interface AiOutput {
    documentation: string;
    social_post: string;
    video_script: string;
}
