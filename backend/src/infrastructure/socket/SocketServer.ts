import { Server, Socket } from "socket.io";
import { Server as HttpServer } from "http";
import jwt from "jsonwebtoken";

import logger from "../../shared/utils/logger";


// ===============================
// Connected Users
// ===============================

const connectedUsers = new Map<string, string>();



// ===============================
// Types
// ===============================

interface JwtPayload {
  id: string;
  role: "company" | "manager" | "employee" | "super-admin";
}


interface AuthenticatedSocket extends Socket {
  data: {
    userId: string;
    role: string;
  };
}





// ===============================
// Initialize Socket
// ===============================


export const initSocket = (server: HttpServer) => {


  const allowedOrigins = [
    process.env.FRONTEND_URL || "",
  ];



  if(process.env.NODE_ENV !== "production"){

    allowedOrigins.push(
      "http://localhost:5173",
      "http://localhost:5174",
      "http://127.0.0.1:5173",
      "http://127.0.0.1:5174"
    );

  }





  const io = new Server(server,{


    cors:{

      origin: allowedOrigins.filter(Boolean),

      credentials:true,

      methods:[
        "GET",
        "POST"
      ]

    },


    transports:[
      "websocket",
      "polling"
    ]


  });





  // ===============================
  // Authentication Middleware
  // ===============================


  io.use((socket,next)=>{


    try{


      const token =
        socket.handshake.auth.token;



      if(!token){

        return next(
          new Error(
            "Authentication error: Token missing"
          )
        );

      }




      const decoded =
        jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET!
        ) as JwtPayload;




      socket.data.userId =
        decoded.id;


      socket.data.role =
        decoded.role;



      logger.info(
        `Socket authenticated ${decoded.id}`
      );



      next();



    }
    catch(error){


      logger.error(
        "Socket authentication failed",
        error
      );


      next(
        new Error(
          "Authentication error"
        )
      );


    }


  });






  // ===============================
  // Connection
  // ===============================


  io.on(
    "connection",
    (socket:AuthenticatedSocket)=>{


      const userId =
        socket.data.userId;



      logger.info(
        `Socket connected ${socket.id} user:${userId}`
      );





      // ===============================
      // Register User
      // ===============================


      socket.on(
        "register",
        ()=>{


          connectedUsers.set(
            userId,
            socket.id
          );


          logger.info(
            `User registered ${userId}`
          );


        }
      );







      // ===============================
      // Private Message
      // ===============================


      socket.on(
        "send-message",
        ({
          receiverId,
          message
        })=>{


          if(
            !message ||
            typeof message !== "string" ||
            message.trim().length===0
          ){

            return;

          }





          const messageData={


            senderId:userId,

            receiverId,

            message:
              message.trim(),

            createdAt:
              new Date().toISOString()


          };




          const receiverSocket =
            connectedUsers.get(
              receiverId
            );



          const senderSocket =
            connectedUsers.get(
              userId
            );





          if(receiverSocket){

            io.to(receiverSocket)
            .emit(
              "receive-message",
              messageData
            );

          }





          if(senderSocket){

            io.to(senderSocket)
            .emit(
              "receive-message",
              messageData
            );

          }


        }
      );







      // ===============================
      // Typing
      // ===============================


      socket.on(
        "typing",
        ({
          receiverId
        })=>{


          const socketId =
            connectedUsers.get(
              receiverId
            );


          if(socketId){

            io.to(socketId)
            .emit(
              "typing",
              {
                senderId:userId
              }
            );

          }


        }
      );





      socket.on(
        "stop-typing",
        ({
          receiverId
        })=>{


          const socketId =
            connectedUsers.get(
              receiverId
            );


          if(socketId){

            io.to(socketId)
            .emit(
              "stop-typing",
              {
                senderId:userId
              }
            );

          }


        }
      );








      // ===============================
      // Group Chat
      // ===============================


      socket.on(
        "join-group",
        (groupId:string)=>{


          socket.join(groupId);


        }
      );



      socket.on(
        "leave-group",
        (groupId:string)=>{


          socket.leave(groupId);


        }
      );






      socket.on(
        "send-group-message",
        ({
          groupId,
          message
        })=>{


          if(
            !message ||
            typeof message !== "string" ||
            !message.trim()
          ){

            return;

          }



          io.to(groupId)
          .emit(
            "receive-group-message",
            {

              groupId,

              senderId:userId,

              message:
                message.trim(),

              createdAt:
                new Date().toISOString()

            }
          );


        }
      );






      socket.on(
        "group-typing",
        ({
          groupId
        })=>{


          socket.to(groupId)
          .emit(
            "group-typing",
            {
              senderId:userId,
              groupId
            }
          );


        }
      );





      socket.on(
        "stop-group-typing",
        ({
          groupId
        })=>{


          socket.to(groupId)
          .emit(
            "stop-group-typing",
            {
              senderId:userId,
              groupId
            }
          );


        }
      );






      // ===============================
      // Disconnect
      // ===============================


      socket.on(
        "disconnect",
        ()=>{


          connectedUsers.delete(
            userId
          );


          logger.info(
            `Socket disconnected ${userId}`
          );


        }
      );


    }
  );




  return io;

};







// ===============================
// Emit Helpers
// ===============================



export const emitNotification = (
  io:Server,
  userId:string,
  notification:unknown
)=>{


  const socketId =
    connectedUsers.get(userId);



  if(socketId){

    io.to(socketId)
    .emit(
      "new-notification",
      notification
    );


  }

};






export const emitChatMessage = (
  io:Server,
  receiverId:string,
  messageData:{
    senderId:string;
    message:string;
    messageType?:string;
    fileUrl?:string;
    fileName?:string;
    fileSize?:number;
    mimeType?:string;
  }
)=>{


  const socketId =
    connectedUsers.get(receiverId);



  if(socketId){

    io.to(socketId)
    .emit(
      "receive-message",
      messageData
    );

  }

};






export const emitGroupMessage = (
  io:Server,
  groupId:string,
  messageData:{
    senderId:string;
    message:string;
    createdAt:string;
    senderName:string;
    messageType?:string;
    fileUrl?:string;
    fileName?:string;
    fileSize?:number;
    mimeType?:string;
  }
)=>{


  io.to(groupId)
  .emit(
    "receive-group-message",
    {
      groupId,
      ...messageData
    }
  );


};






export const emitGroupTyping = (
  io:Server,
  groupId:string,
  senderId:string
)=>{


  io.to(groupId)
  .emit(
    "group-typing",
    {
      senderId,
      groupId
    }
  );

};






export const emitGroupMemberJoined = (
  io:Server,
  groupId:string,
  userId:string,
  userName:string
)=>{


  io.to(groupId)
  .emit(
    "group-member-joined",
    {

      groupId,

      userId,

      userName,

      timestamp:
        new Date().toISOString()

    }
  );

};






export const emitGroupMemberLeft = (
  io:Server,
  groupId:string,
  userId:string,
  userName:string
)=>{


  io.to(groupId)
  .emit(
    "group-member-left",
    {

      groupId,

      userId,

      userName,

      timestamp:
        new Date().toISOString()

    }
  );

};