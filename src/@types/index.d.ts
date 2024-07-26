declare namespace Express {
    export interface Request {
        rawBody: string
    }
}

export type Order = {
    id: number;
    user_id: string;
    order_id: string;
    status: number;
    updated_at: Date;
    created_at: Date;
}

export type OrderItem = {
    id: number;
    user_id: string;
    order_id: string;
    user_name: string;
    product_name: string;
    quantity: number;
    remark: string;
    created_at: Date;
}

export type OrderWithItems = Pick<OrderItem, 'id' | 'user_id' | 'user_name' | 'product_name' | 'quantity' | 'remark'> & { order_id: string, status: number }
