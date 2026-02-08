import { DiffService } from './diff';
import { FileDiff } from '../types';

const mockDiffs: FileDiff[] = [
    {
        filename: 'src/index.ts',
        status: 'modified',
        patch: '@@ -1,5 +1,7 @@\n import express from "express";',
        additions: 2,
        deletions: 0
    },
    {
        filename: 'package-lock.json',
        status: 'modified',
        patch: '@@ -1,5 +1,7 @@\n lockfile changes',
        additions: 100,
        deletions: 50
    },
    {
        filename: 'README.md',
        status: 'modified',
        patch: '@@ -1,5 +1,7 @@\n # Title',
        additions: 1,
        deletions: 1
    },
    {
        filename: 'image.png',
        status: 'added',
        // binary files won't have patch usually, but let's test extension filtering
        patch: undefined,
        additions: 0,
        deletions: 0
    },
    {
        filename: '.env',
        status: 'added',
        patch: 'SECRET=123',
        additions: 1,
        deletions: 0
    }
];

// Simple test runner since we don't have Jest set up yet
console.log('Running DiffService Tests...');

const filtered = DiffService.filterDiffs(mockDiffs);
console.log(`Initial count: ${mockDiffs.length}`);
console.log(`Filtered count: ${filtered.length}`);

const passed = filtered.length === 2 &&
    filtered.some(f => f.filename === 'src/index.ts') &&
    filtered.some(f => f.filename === 'README.md');

if (passed) {
    console.log('✅ Diff filtering test passed');
} else {
    console.error('❌ Diff filtering test failed');
    console.log('Filtered files:', filtered.map(f => f.filename));
}

const formatted = DiffService.formatDiffForAi(filtered);
if (formatted.includes('File: src/index.ts') && formatted.includes('File: README.md')) {
    console.log('✅ Diff formatting test passed');
} else {
    console.error('❌ Diff formatting test failed');
}
