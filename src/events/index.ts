import GoogleSheets from "../libs/googleSheet";
import orderService from "../service/order";
import { getCurrentTime } from "../utils/time";
type CompleteOrderEvent = {
    order_id: string,
    id: string,
    user_id: string,
    user_name: string,
    product_name: string,
    quantity: string,
    remark: string

}
export default function registerEventsHandler(sheetService: GoogleSheets) {

    orderService.on('completeOrder', async (event: CompleteOrderEvent[]) => {
        const time = getCurrentTime()
        const appendValue = event.map(({ order_id, id: item_id, user_id, user_name, product_name, quantity, remark }) => [order_id, item_id, user_id, user_name, product_name, quantity, remark, time])
        await sheetService.appendValues('1rb2wJs_0CxDUO3invL6e8tcFmfHueDCU6NLTGO-hdv0', '訂單內容!A1', appendValue)
    })

}