import { Request, Response, Router } from "express";
import { URLRequest } from "../../types";
import { nanoid } from "nanoid";
import redisClient from "../../config/redis";
import { CONFIG } from "../../config/constants";
import { getUniqueId } from "../../controller/generateId";

export const coreRouter = Router();

coreRouter.post('/shortner', async (req: Request, res: Response) => {
    try {
        const reqBody: URLRequest = req.body;
        const { url, expires_in, size } = reqBody;
        const max_ttl = CONFIG.URL.MAX_TTL;

        if (!URL.canParse(url)) {
            console.error("URL can't be parsed.");
            res.status(422).json({ success: false, message: "Please provide a valid URL." });
            return;
        }

        if (expires_in && expires_in > max_ttl) {
            console.error("The expires in time is beyond the limit.");
            res.status(422).json({ success: true, message: "Please provide a time below 86400 (24 hr)." });
            return;
        }

        const isURL = await redisClient.get(url);
        if (isURL) {
            res.status(201).json({ success: true, message: "Yeah, URL is shorten, Enjoy!!", "body": { "short_url": `${CONFIG.URL.BASE_URL}/api/v1/tiny/${isURL}` } });
            return;
        }

        // unique code generation
        const unique_id: string = getUniqueId((size) ? (size > CONFIG.URL.MAX_SIZE) ? CONFIG.URL.MAX_SIZE : size : CONFIG.URL.AVG_SIZE);

        // Set the id and url in redis
        redisClient.set(unique_id, url, 'EX', expires_in || max_ttl);
        redisClient.set(url, unique_id, 'EX', expires_in || max_ttl);


        const short_url: string = `${CONFIG.URL.BASE_URL}/api/v1/tiny/${unique_id}`;

        res.status(201).json({ success: true, message: "Yeah, URL is shorten, Enjoy!!", "body": { "short_url": `${short_url}` } });

    } catch (error) {
        console.error("Error processing your request", error);
        res.status(500).json({ success: false, message: "Error processing your request. Please try again." });
    }

});

coreRouter.get('/tiny/:id', async (req: Request<{ id: string }>, res: Response) => {
    try {
        const unique_id = req.params.id ?? null;

        if (!unique_id || unique_id.trim() === '') {
            console.error("No id found");
            res.status(500).json({ success: false, message: "Please provide a valid URL." });
            return;
        }

        const url: string | null = await redisClient.get(unique_id);

        if (!url || url.trim() === '') {
            res.status(404).json({ success: false, message: 'URL not found or expired.' });
            return;
        }

        res.redirect(url);

    } catch (error) {
        console.error("Error", error);
        res.status(500).json({ success: false, message: "No URL mapping found, Please try again." });
    }
})