export interface Hype {
    id: string;
    repo: string;
    message: string;
    timestamp: string;
    social_post: string;
    documentation: string;
}

export class HypeStore {
    private static instance: HypeStore;
    private hypes: Hype[] = [];

    private constructor() { }

    public static getInstance(): HypeStore {
        if (!HypeStore.instance) {
            HypeStore.instance = new HypeStore();
        }
        return HypeStore.instance;
    }

    public add(hype: Hype) {
        this.hypes.unshift(hype);
        if (this.hypes.length > 20) {
            this.hypes.pop();
        }
    }

    public getAll(): Hype[] {
        return this.hypes;
    }
}
