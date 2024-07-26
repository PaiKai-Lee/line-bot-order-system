
const pad = (num: number) => num.toString().padStart(2, '0');
export const getCurrentTime = () => {
    const date = new Date();
    const year = pad(date.getFullYear());
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());
    const minute = pad(date.getMinutes());
    const second = pad(date.getSeconds());
    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}