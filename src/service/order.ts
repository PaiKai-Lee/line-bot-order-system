import pool from '../database';
import { OrderItem, OrderWithItems } from '../@types';
import { QueryResult, ResultSetHeader, Pool } from 'mysql2/promise';
import { EventEmitter } from 'node:events';
type SuccessResponse<T> = [T, null];
type ErrorResponse = [null, Error];


class OrderService extends EventEmitter {

    constructor(readonly pool: Pool) {
        super()
    }

    async createOrder(groupId: string): Promise<SuccessResponse<string> | ErrorResponse> {
        try {
            const orderId = this.generateOrderId()
            const query = 'INSERT INTO orders (group_id, order_id, status) VALUES (?,?,?)';
            const _ = await this.pool.query(query, [groupId, orderId, 0])
            return [orderId, null]
        } catch (err) {
            return [null, err as Error]
        }
    }

    async closeOrder(orderId: string): Promise<SuccessResponse<QueryResult> | ErrorResponse> {
        try {
            const query = 'UPDATE orders SET status = 1 WHERE order_id = ?';
            const [result, fields] = await this.pool.query(query, [orderId]);
            return [result, null]
        } catch (err) {
            return [null, err as Error]
        }
    }

    /**
     * Retrieves the order items associated with a specific order ID.
     *
     * @param {string} orderId - The ID of the order.
     */
    async getOrderWithItemsByOrderId(orderId: string): Promise<SuccessResponse<QueryResult> | ErrorResponse> {
        try {
            const query = `
            SELECT O.order_id, O.status, I.id, I.user_id, I.user_name, I.product_name, I.quantity, I.remark 
            FROM  orders O  
            INNER JOIN order_items I ON I.order_id = O.order_id 
            WHERE O.order_id = ? 
            ORDER BY I.user_id`;
            const [result, fields] = await this.pool.query(query, [orderId]);
            return [result, null]
        } catch (err) {
            return [null, err as Error]
        }
    }

    async addItemToOrder(orderId: string, userId: string = 'empty', userName: string, productName: string, quantity: string, remark = ''): Promise<SuccessResponse<ResultSetHeader> | ErrorResponse> {
        try {
            const query = 'INSERT INTO order_items (order_id, user_id, user_name, product_name, quantity, remark) VALUES (?, ?, ?, ?, ?, ?)';
            const [result, fields] = await this.pool.query<ResultSetHeader>(query, [orderId, userId, userName, productName, quantity, remark]);
            return [result, null]
        } catch (err) {
            return [null, err as Error]
        }
    };

    async deleteOrderItemById(itemNumber: number | string): Promise<SuccessResponse<QueryResult> | ErrorResponse> {
        try {
            const query = 'DELETE FROM order_items WHERE id = ?';
            const [result, fields] = await this.pool.query(query, [itemNumber]);
            return [result, null]
        } catch (err) {
            return [null, err as Error]
        }
    };

    generateOrderId(): string {
        const t = new Date()
        const month = ('0' + (t.getMonth() + 1)).slice(-2)
        const date = ('0' + t.getDate()).slice(-2)
        const lastNumber = (Math.floor(Math.random() * 0x10000)).toString(16).toUpperCase()
        return `PR-${t.getFullYear()}${month}${date}-${(lastNumber)}`
    };

    organizeOrderFlexMessageContent(data: OrderWithItems[]) {
        if (!data[0]) {
            return {
                orderId: '沒有訂單商品',
                orderStatus: false,
                userItems: [],
                itemsQuantity: []
            }
        }
        const { order_id, status } = data[0]
        const userItems = data.map(({ id, user_id, user_name, product_name, quantity, remark }) => {
            return {
                id,
                user_id,
                user_name,
                product_name,
                quantity,
                remark: remark || '沒有註解'
            }
        })

        const itemsQuantityMap = {} as Record<string, number>
        for (let i = 0; i < userItems.length; i++) {
            const { product_name, quantity } = userItems[i]
            if (!itemsQuantityMap[product_name]) {
                itemsQuantityMap[product_name] = 0
            }
            itemsQuantityMap[product_name] += Number(quantity)
        }

        const itemsQuantity = Object.entries(itemsQuantityMap).map(([key, value]) => {
            return {
                product_name: key,
                quantity: value
            }
        })

        return {
            orderId: order_id,
            orderStatus: Boolean(status),
            userItems,
            itemsQuantity
        }
    }

    async getLastUnfinishedOrder(): Promise<SuccessResponse<QueryResult> | ErrorResponse> {
        try {
            const query = 'SELECT * FROM orders WHERE status = 0 ORDER BY id DESC';
    async cancelOrderByOrderId(orderId: string): Promise<SuccessResponse<ResultSetHeader> | ErrorResponse> {
        try {
            const query = 'UPDATE orders SET status = 2 WHERE order_id = ? AND status = 0';
            const [result, fields] = await this.pool.query<ResultSetHeader>(query, [orderId]);
            return [result, null]
        } catch (err) {
            return [null, err as Error]
        }
    }

}

const orderService = new OrderService(pool)

export default orderService
export { OrderService }