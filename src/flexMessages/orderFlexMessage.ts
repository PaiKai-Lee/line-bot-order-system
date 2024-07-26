import { FlexComponent, FlexMessage } from "@line/bot-sdk";
import { OrderItem } from "../@types";


type UserItems = Pick<OrderItem, 'id' | 'user_id' | 'user_name' | 'product_name' | 'quantity' | 'remark'>
type itemsQuantity = Pick<UserItems, 'product_name' | 'quantity'>

export default function getOrderFlexMessage(payLoad: { orderId: string, orderStatus: boolean, userItems: UserItems[], itemsQuantity: itemsQuantity[] }): FlexMessage {

    const userItemsContent: FlexComponent[] = payLoad.userItems.map(item => {
        return {
            type: 'box',
            layout: 'horizontal',
            contents: [
                {
                    "type": "text",
                    "text": item.user_name,
                    "size": "sm",
                    "color": "#111111",
                    "flex": 1
                },
                {
                    "type": "text",
                    "text": `${item.id}`,
                    "size": "sm",
                    "color": "#111111",
                    "flex": 1
                },
                {
                    "type": "text",
                    "text": item.product_name,
                    "flex": 1,
                    "color": "#111111",
                    "size": "sm",
                    "wrap": true
                },
                {
                    "type": "text",
                    "text": `${item.quantity}`,
                    "flex": 1,
                    "color": "#111111",
                    "size": "sm"
                },
                {
                    "type": "text",
                    "text": item.remark,
                    "flex": 1,
                    "color": "#111111",
                    "size": "xs",
                    "wrap": true
                }
            ]
        }
    })

    const itemsQuantityContent: FlexComponent[] = payLoad.itemsQuantity.map(item => {
        return {
            type: 'box',
            layout: 'horizontal',
            contents: [
                {
                    "type": "text",
                    "text": item.product_name,
                    "size": "sm",
                    "color": "#111111",
                    "flex": 1
                },
                {
                    "type": "text",
                    "text": `${item.quantity}`,
                    "size": "sm",
                    "color": "#111111",
                    "flex": 2
                }
            ]
        }
    })

    return {
        type: 'flex',
        altText: 'order',
        contents: {
            "type": "bubble",
            "size": "giga",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "contents": [
                            {
                                "type": "text",
                                "text": "訂單",
                                "weight": "bold",
                                "color": "#1DB446",
                                "size": "lg",
                                "margin": "none",
                                "flex": 1
                            },
                            {
                                "type": "text",
                                "text": payLoad.orderId,
                                "size": "sm",
                                "flex": 2,
                                "align": "end"
                            }
                        ],
                        "position": "relative",
                        "alignItems": "center",
                        "offsetTop": "none",
                        "paddingAll": "none"
                    },
                    {
                        "type": "separator",
                        "margin": "xl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "xxl",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "姓名",
                                        "size": "md",
                                        "color": "#111111",
                                        "flex": 1,
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "text": "項目編號",
                                        "size": "md",
                                        "color": "#111111",
                                        "flex": 1,
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "text": "品項",
                                        "flex": 1,
                                        "color": "#111111",
                                        "size": "md",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "text": "數量",
                                        "flex": 1,
                                        "color": "#111111",
                                        "size": "md",
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "text": "備註",
                                        "flex": 1,
                                        "color": "#111111",
                                        "size": "md",
                                        "weight": "bold"
                                    }
                                ]
                            },
                            ...userItemsContent
                        ],
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "box",
                        "layout": "vertical",
                        "margin": "xxl",
                        "spacing": "sm",
                        "contents": [
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "品項",
                                        "size": "md",
                                        "color": "#111111",
                                        "flex": 1,
                                        "weight": "bold"
                                    },
                                    {
                                        "type": "text",
                                        "text": "累積數量",
                                        "size": "md",
                                        "color": "#111111",
                                        "flex": 2,
                                        "weight": "bold"
                                    },
                                ]
                            },
                            ...itemsQuantityContent
                        ],
                    },
                    {
                        "type": "separator",
                        "margin": "xxl"
                    },
                    {
                        "type": "box",
                        "layout": "horizontal",
                        "margin": "md",
                        "contents": [
                            {
                                "type": "text",
                                "text": payLoad.orderStatus ? "已成立" : "尚未成立",
                                "color": payLoad.orderStatus ? "#1DB446" : "#FF0000",
                                "size": "sm",
                                "align": "end"
                            }
                        ]
                    }
                ]
            },
            "styles": {
                "footer": {
                    "separator": true
                }
            }
        }
    }
}