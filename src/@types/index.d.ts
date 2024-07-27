declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production' | 'test';
            PORT: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASSWORD: string;
            DB_NAME: string;
            LINE_ACCESS_TOKEN: string;
            LINE_CHANNEL_SECRET: string;
            SPREADSHEET_ID: string;
            SHEET_NAME: string;
        }
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