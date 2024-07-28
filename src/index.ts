import dotenv from "dotenv"
dotenv.config()

import { createServer } from 'http'
import app from './app';
import path from 'path';
import registerEventsHandler from './events';
import GoogleSheets from "./libs/googleSheet";
import lineService from "./service/line-service";

const PORT: number | string = process.env.PORT || 3000;

const sheetsService = new GoogleSheets({
    CREDENTIALS_PATH: path.join(process.cwd(), 'credentials.json'),
    SCOPES: ['https://www.googleapis.com/auth/spreadsheets'],
});

async function bootstrap() {
    const server = createServer(app);
    registerEventsHandler(sheetsService);
    await lineService.init()
    server.listen(PORT, () => {
        console.log(`LINE Bot 正在監聽 ${PORT} 端口`);
    });
};
bootstrap()