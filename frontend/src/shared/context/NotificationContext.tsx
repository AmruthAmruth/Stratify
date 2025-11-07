




interface Notification{
    title:string;
    message:string;
    type:"info" | "success" | "warning" | "error"
}




interface NotificationContextType{
    nottifications:Notification[]
}


const Notifi