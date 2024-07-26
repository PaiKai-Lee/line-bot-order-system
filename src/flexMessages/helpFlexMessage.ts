import { FlexMessage } from "@line/bot-sdk";

export default function getHelpFlexMessage(): FlexMessage {
    return {
        type: 'flex',
        altText: 'Help',
        contents: {
            "type": "bubble",
            "size": "mega",
            "body": {
                "type": "box",
                "layout": "vertical",
                "contents": [
                    {
                        "type": "text",
                        "text": "小幫手使用指引",
                        "weight": "bold",
                        "color": "#1DB446",
                        "size": "md"
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
                                        "text": "##",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "小幫手使用指引",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "lg",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "#新購物",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "建立新的一筆購物清單",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "lg",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "#訂單成立",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "確認訂單成立",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "none",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "#查詢 [訂單編號]",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "查詢訂單內容",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "none",
                                        "align": "end"
                                    }
                                ]
                            },
                            {
                                "type": "box",
                                "layout": "horizontal",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "#刪除 [項目編號]",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "刪除購物清單項目",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "none",
                                        "align": "end"
                                    }
                                ]
                            }, {
                                "type": "box",
                                "layout": "vertical",
                                "contents": [
                                    {
                                        "type": "text",
                                        "text": "#姓名 商品名稱 數量 註解",
                                        "size": "xs",
                                        "color": "#111111",
                                        "flex": 0,
                                        "weight": "bold",
                                        "margin": "none"
                                    },
                                    {
                                        "type": "text",
                                        "text": "新增購物清單項目",
                                        "size": "sm",
                                        "color": "#555555",
                                        "margin": "none",
                                        "align": "end"
                                    }
                                ]
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