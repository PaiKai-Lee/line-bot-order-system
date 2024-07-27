import { OrderItem } from "../@types";
import GoogleSheets from "../libs/googleSheet";
import orderService from "../service/order";
import { getCurrentTime } from "../utils/time";

export default function registerEventsHandler(sheetService: GoogleSheets) {

    orderService.on('completeOrder', async (event: { orderId: string, orderItems: Omit<OrderItem, 'created_at' | 'order_id'>[] }) => {
        try {
            const spreadsheetId = process.env.SPREADSHEET_ID
            const sheetName = process.env.SHEET_NAME
            const { orderId, orderItems } = event
            const time = getCurrentTime()
            const appendValue = orderItems.map(({ id: item_id, user_id, user_name, product_name, quantity, remark }) => [orderId, item_id, user_id, user_name, product_name, quantity, remark, time])
            await sheetService.appendValues(spreadsheetId, `${sheetName}!A1`, appendValue)
        } catch (err) {
            console.error(err)
        }
    })

}