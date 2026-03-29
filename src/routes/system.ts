import { Router } from "express";

export const systemRouter = Router();

systemRouter.get('/', (_req, res) => {
    res.json({ success: true, message: 'URL Shortener API' });
});

systemRouter.get('/health', (_req, res) => {
    res.json({ success: true, status: 'ok' });
});