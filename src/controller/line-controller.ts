import lineService from '../service/line-service';

import {
    webhook,
    HTTPFetchError,
} from '@line/bot-sdk';
import { RequestHandler, Request, Response } from 'express';

const lineWebhook: RequestHandler = async (req: Request, res: Response): Promise<Response> => {
    /**
     * Process the webhook events.
     * 
     * @param req - The request object from Express.
     * @param res - The response object from Express.
     * @returns A Promise that resolves to an Express response.
     */

    const callbackRequest: webhook.CallbackRequest = req.body;
    const events: webhook.Event[] = callbackRequest.events!;

    // Process all the received events asynchronously.

    events.map((event: webhook.Event) => {
        try {
            lineService.handleTextEvent(event);
        } catch (err: unknown) {
            if (err instanceof HTTPFetchError) {
                console.error(err.status);
                console.error(err.headers.get('x-line-request-id'));
                console.error(err.body);
                console.error(err.stack);
            } else if (err instanceof Error) {
                console.error(err);
            }
        }
    })

    // Return a successful message.
    return res.status(200).json({
        status: 'success'
    });
};

export default { lineWebhook };
