import dotenv from "dotenv"
dotenv.config()

import {
    middleware,
    MiddlewareConfig,
    SignatureValidationFailed,
    JSONParseError,
} from '@line/bot-sdk';
import express, { Application, NextFunction, Request, Response } from 'express';
import lineController from './controller/line-controller';

const app: Application = express();

const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

app.get(
    '/',
    async (_: Request, res: Response): Promise<Response> => {
        return res.status(200).json({
            status: 'success',
            message: 'Connected successfully!',
        });
    }
);

app.post('/webhook', middleware(middlewareConfig), lineController.lineWebhook);

app.use(express.json());
app.use(
    express.urlencoded({
        extended: true,
    })
);

app.get("/", (req, res) => {
    res.sendStatus(200);
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof SignatureValidationFailed) {
        return res.status(401).send(err.signature)
    } else if (err instanceof JSONParseError) {
        return res.status(400).send(err.raw)
    } else {
        res.status(500).send(err)
    }
})

export default app;

