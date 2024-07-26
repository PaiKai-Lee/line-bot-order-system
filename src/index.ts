import dotenv from "dotenv"
dotenv.config()

import {
    middleware,
    MiddlewareConfig,
    SignatureValidationFailed,
    JSONParseError,
} from '@line/bot-sdk';
import express, { Application, NextFunction, Request, Response } from 'express';
import path from 'path';
import lineController from './controller/line-controller';
import registerEventsHandler from './events';
import GoogleSheets from "./libs/googleSheet";

const app: Application = express();
const PORT: number | string = process.env.PORT || 3000;

const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const sheetsService = new GoogleSheets({
    CREDENTIALS_PATH: path.join(process.cwd(), 'credentials.json'),
    SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
});

registerEventsHandler(sheetsService);

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

app.listen(PORT, () => {
    console.log(`LINE Bot 正在監聽 ${PORT} 端口`);
});

