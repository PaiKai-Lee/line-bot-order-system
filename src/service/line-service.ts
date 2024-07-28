import orderService from './order';
import { ACTIONS, ORDER_STATUS } from '../utils/constant';

import {
    webhook,
    ClientConfig,
    messagingApi,
} from '@line/bot-sdk';
import getHelpFlexMessage from '../flexMessages/helpFlexMessage';
import getOrderFlexMessage from '../flexMessages/orderFlexMessage';

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_ACCESS_TOKEN || '',
};

// Create a new LINE SDK client.
const client = new messagingApi.MessagingApiClient(clientConfig);

class LineService {

    currentOrderId: string | null = null;

    groupCurrentOrderId: { [groupId: string]: string | null } = {};

    client: messagingApi.MessagingApiClient;

    constructor(client: messagingApi.MessagingApiClient) {
        this.client = client;
    }

    /**
     * 初始化，確認訂單是不是已完成，如果不是就恢復到記憶體快取
     */
    async init (){
        orderService.getLastUnfinishedOrder().then(([lastUnfinishedOrders, err]) => {
            if (err) {
                console.log(err);
                return;
            }
            console.log('未完成訂單', lastUnfinishedOrders);
            if (lastUnfinishedOrders) {
                // @ts-ignore
                lastUnfinishedOrders.forEach(undefinedOrder => {
                    const { group_id, order_id } = undefinedOrder;
                    this.groupCurrentOrderId[group_id] = order_id;
                });
            }
        })
    }

    async handleTextEvent(event: webhook.Event) {
        // Check if for a text message
        if (event.type !== 'message' || !event.replyToken || event.message.type !== 'text') return;

        const replyToken = event.replyToken;
        const textMessage = event.message.text.trim();
        const userId = event.source?.userId;
        const groupId = event.source?.type === 'group' ? event.source.groupId : 'no-group-id';

        // #開頭才是跟機器人溝通
        if (!textMessage.startsWith('#')) return;

        const [action, _] = textMessage.split(' ');

        if (action === ACTIONS.NewOrder) {
            if (this.groupCurrentOrderId[groupId]) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `上筆購物尚未結束，單號: ${this.groupCurrentOrderId[groupId]}` }] });
            const [orderId, err] = await orderService.createOrder(groupId)
            if (err) {
                console.error('無法創建新購物清單:', err);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '無法創建新購物清單，請稍後再試' }] });
            }

            this.groupCurrentOrderId[groupId] = orderId
            return this.client.replyMessage({
                replyToken, messages: [
                    { type: 'text', text: `新購物清單已創建，單號: ${orderId}` },
                    { type: 'text', text: `開始新增商品請輸入 \n #姓名 商品名稱 數量 註解 \n (EX: #王小名 牛奶 10 註解可有可無)` }
                ]
            });

        } else if (action === ACTIONS.OrderComplete) {
            const currentOrderId = this.groupCurrentOrderId[groupId]
            if (!currentOrderId) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '尚無購物清單，請先創建購物清單' }] });

            const [_, err] = await orderService.closeOrder(currentOrderId)
            if (err) {
                console.error('訂單成立異常:', err);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '訂單成立異常' }] });
            }

            this.groupCurrentOrderId[groupId] = null
            const [results, err2] = await orderService.getOrderItemsByOrderId(currentOrderId)
            if (err2) {
                console.error('訂單搜尋異常:', err2);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '訂單搜尋異常' }] });
            }
            // @ts-ignore
            const messageContent = orderService.organizeOrderFlexMessageContent(currentOrderId, ORDER_STATUS.Complete, results)
            const orderFlexMessage = getOrderFlexMessage(messageContent)
            orderService.emit('completeOrder', {
                orderId: currentOrderId,
                orderItems: results
            })
            // @ts-ignore
            return this.client.replyMessage({ replyToken, messages: [orderFlexMessage] });
        } else if (action === ACTIONS.OrderSearch) {
            const orderId = textMessage.split(ACTIONS.OrderSearch)[1].trim();

            const [
                [orderResult, orderError],
                [orderItemsResults, orderItemsError]
            ] = await Promise.all([
                orderService.getOrderByOrderId(orderId),
                orderService.getOrderItemsByOrderId(orderId)
            ])

            if (orderError || orderItemsError) {
                console.error('訂單搜尋異常:', orderError || orderItemsError);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '訂單搜尋異常' }] });
            }

            if (orderResult.length === 0) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `查無相關訂單，單號: ${orderId}` }] });

            const { order_id, status } = orderResult[0]

            // @ts-ignore
            const messageContent = orderService.organizeOrderFlexMessageContent(order_id, status, orderItemsResults)
            const orderFlexMessage = getOrderFlexMessage(messageContent)
            // @ts-ignore
            return this.client.replyMessage({ replyToken, messages: [orderFlexMessage] });
        } else if (action === ACTIONS.OrderCancel) {
            const orderId = textMessage.split(ACTIONS.OrderCancel)[1].trim();

            const [result, err] = await orderService.cancelOrderByOrderId(orderId)
            if (err) {
                console.error('訂單取消異常:', err);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '訂單取消異常' }] });
            }

            if (result.affectedRows === 0) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `無法取消訂單，單號: ${orderId}` }] });

            return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `已取消訂單，單號: ${orderId}` }] });
        } else if (action === ACTIONS.ItemDelete) {
            if (!this.groupCurrentOrderId[groupId]) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '尚無購物清單，請先創建購物清單' }] });
            const itemNumber = textMessage.split(ACTIONS.ItemDelete)[1].trim();
            const [result, err] = await orderService.deleteOrderItemById(itemNumber)
            if (err) {
                console.error('刪除購物項目異常:', err);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '刪除購物項目異常' }] });
            }
            return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `已刪除購物清單項目，項目編號: ${itemNumber}` }] });
        } else if (action === ACTIONS.Help) {
            const helpFlexMessage = getHelpFlexMessage()
            // @ts-ignore
            return this.client.replyMessage({ replyToken, messages: [helpFlexMessage] });
        } else {
            const currentOrderId = this.groupCurrentOrderId[groupId]
            // 跟小幫手溝通又沒有特定的指令，視為加入購物清單
            if (!currentOrderId) return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '尚無購物清單，請先創建購物清單' }] });
            const content = textMessage.split('#')[1].trim();
            const [userName, productName, quantity, remark] = content.split(' ');

            if (!userName || !productName || !quantity) {
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '格式錯誤' }] });
            }
            if (isNaN(parseInt(quantity))) {
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '數量必須為數字' }] });
            }

            if (parseInt(quantity) < 1) {
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '數量必須大於 0' }] });
            }
            const [result, err] = await orderService.addItemToOrder(currentOrderId, userId, userName, productName, quantity, remark);
            if (err) {
                console.error('加入購物清單異常:', err);
                return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: '加入購物清單異常' }] });
            }
            return this.client.replyMessage({ replyToken, messages: [{ type: 'text', text: `已加入購物清單，項目編號: ${result.insertId}` }] });
        }
    }
}

const lineService = new LineService(client)

export default lineService

