import { Request, Response } from 'express';
import { HypeStore } from '../services/store';

export class HypeHandler {
    public getAll = (req: Request, res: Response) => {
        const hypes = HypeStore.getInstance().getAll();
        res.status(200).json(hypes);
    };
}
