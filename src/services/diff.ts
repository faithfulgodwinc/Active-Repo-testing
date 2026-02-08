import { FileDiff } from '../types';

export class DiffService {
    private static readonly IGNORED_FILES = [
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        '.env',
        '.env.example',
        '.gitignore',
        'node_modules/',
        'dist/',
        'build/',
        'coverage/',
        '.ds_store',
        'thumbs.db'
    ];

    private static readonly IGNORED_EXTENSIONS = [
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.pdf', '.zip', '.tar', '.gz'
    ];

    static filterDiffs(files: FileDiff[]): FileDiff[] {
        return files.filter(file => {
            // Check if file is in ignored list or directory
            const isIgnored = this.IGNORED_FILES.some(ignored =>
                file.filename.includes(ignored) ||
                (ignored.endsWith('/') && file.filename.startsWith(ignored))
            );

            if (isIgnored) return false;

            // Check extension
            const hasIgnoredExtension = this.IGNORED_EXTENSIONS.some(ext =>
                file.filename.toLowerCase().endsWith(ext)
            );

            if (hasIgnoredExtension) return false;

            // Keep only files with patches (actual text changes)
            return !!file.patch;
        });
    }

    static formatDiffForAi(files: FileDiff[]): string {
        return files.map(file => {
            return `File: ${file.filename}\nStatus: ${file.status}\nChanges:\n${file.patch}\n`;
        }).join('\n---\n\n');
    }
}
