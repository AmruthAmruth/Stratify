import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/DataBase";
import morgan from "morgan";
import * as rfs from "rotating-file-stream";
import path from "path";
import fs from "fs";
import cors, { CorsOptions } from "cors";
import cookieParser from "cookie-parser";
import http from "http";
import helmet from "helmet";

import { errorMiddleware } from "./interfaces/middleware/ErrorMiddleware";
import router from "./router";
import { validateEnv } from "./config/validateEnv";
import logger from "./shared/utils/logger";

import { initSocket } from "./infrastructure/socket/SocketServer";
import { SocketService } from "./shared/services/SocketService";

import { MeetingScheduler } from "./infrastructure/scheduler/MeetingScheduler";
import { MeetingRepository } from "./infrastructure/repositories/MeetingRepository";
import { ProjectRepository } from "./infrastructure/repositories/ProjectRepository";
import { NotificationRepository } from "./infrastructure/repositories/NotificationRepository";
import { agentLog } from "./shared/utils/agentDebugLog";
import { CookieConfig } from "./config/CookieConfig";


dotenv.config();

validateEnv();


const app = express();

app.set("trust proxy", 1);


// ===============================
// CORS CONFIGURATION
// ===============================
const allowedOrigins = [
  "https://stratify-sigma.vercel.app",
  "http://localhost:5173",
  "http://localhost:5174",
];


if(process.env.FRONTEND_URL){
  allowedOrigins.push(process.env.FRONTEND_URL);
}


const corsOptions: CorsOptions = {
  origin: (origin, callback) => {

    console.log("REQUEST ORIGIN:", origin);

    if (!origin) {
      // #region agent log
      agentLog("C", "main.ts:cors", "CORS no Origin header — allowing without ACAO reflect", {
        origin: null,
        decision: "allow-no-origin",
        allowedOrigins,
      });
      // #endregion
      return callback(null, true);
    }


    if (allowedOrigins.includes(origin)) {
      // #region agent log
      agentLog("C", "main.ts:cors", "CORS origin allowed", {
        origin,
        decision: "allow",
        callbackValue: true,
      });
      // #endregion
      return callback(null, true);
    }


    console.log("BLOCKED ORIGIN:", origin);

    // #region agent log
    agentLog("C", "main.ts:cors", "CORS origin blocked — no ACAO will be set", {
      origin,
      decision: "block",
      allowedOrigins,
    });
    // #endregion
    return callback(null, false);
  },

  credentials: true,

  methods: [
    "GET",
    "POST",
    "PUT",
    "PATCH",
    "DELETE",
    "OPTIONS",
  ],

  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
  ],
};

// IMPORTANT: CORS FIRST
app.use(cors(corsOptions));

// Express 5 rejects app.options("*"); cors() above already handles OPTIONS.
// Keep a named wildcard compatible with path-to-regexp v8+ for explicit preflight.
app.options("/{*splat}", cors(corsOptions));




// ===============================
// SECURITY
// ===============================


app.use(
  helmet({
    crossOriginResourcePolicy: {
      policy: "cross-origin",
    },
  })
);



// ===============================
// BODY PARSERS
// ===============================


app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(cookieParser());



// ===============================
// LOGGING
// ===============================


const logDirectory = path.join(
  __dirname,
  "logs"
);


if (!fs.existsSync(logDirectory)) {
  fs.mkdirSync(logDirectory);
}


const accessLogStream = rfs.createStream(
  "access.log",
  {
    interval: "1d",
    path: logDirectory,
    maxFiles: 7,
  }
);


app.use(
  morgan("combined", {
    stream: accessLogStream,
  })
);



if (process.env.NODE_ENV !== "production") {

  app.use(
    morgan("dev")
  );


  app.use(
    (req, _res, next) => {

      console.log(
        `${req.method} ${req.originalUrl}`
      );

      console.log(
        "Origin:",
        req.headers.origin
      );


      next();
    }
  );

}



// ===============================
// DATABASE
// ===============================


connectDB()
.then(() => {
  logger.info("MongoDB Connected");
})
.catch((err)=>{

  logger.error(err);

  if(process.env.NODE_ENV !== "production"){
    process.exit(1);
  }

});



// ===============================
// STATIC FILES
// ===============================


app.use(
  "/uploads",
  express.static(
    path.join(__dirname,"../uploads")
  )
);



// ===============================
// HEALTH CHECK
// ===============================


app.get(
  "/health",
  (req,res)=>{

    // #region agent log
    agentLog("A", "main.ts:health", "Health check CORS/cookie diagnostics", {
      receivedOrigin: req.headers.origin ?? null,
      NODE_ENV: process.env.NODE_ENV ?? null,
      cookieSameSite: CookieConfig.sameSite,
      cookieSecure: CookieConfig.secure,
      FRONTEND_URL: process.env.FRONTEND_URL ?? null,
      allowedOrigins,
    });
    // #endregion

    res.json({

      status:"ok",

      uptime:process.uptime(),

      timestamp:new Date()
      .toISOString(),

      environment:
      process.env.NODE_ENV || "development",

      // debug session a9000f — remove after fix verified
      debugCors: {
        receivedOrigin: req.headers.origin ?? null,
        allowedOrigins,
        cookieSameSite: CookieConfig.sameSite,
        cookieSecure: CookieConfig.secure,
        envCOOKIE_SAME_SITE: process.env.COOKIE_SAME_SITE ?? null,
        envCOOKIE_SECURE: process.env.COOKIE_SECURE ?? null,
      },

    });

  }
);



// ===============================
// ROUTES
// ===============================


app.use( 
  "/api",
  router
);



// ===============================
// ERROR HANDLER
// ===============================


app.use(
  errorMiddleware
);



// ===============================
// SOCKET SERVER
// ===============================


const server = http.createServer(app);


const io = initSocket(server);


SocketService.setIO(io);



// ===============================
// SCHEDULER
// ===============================


const meetingScheduler =
new MeetingScheduler(
  new MeetingRepository(),
  new ProjectRepository(),
  new NotificationRepository()
);


meetingScheduler.start();



// ===============================
// SERVER START
// ===============================


const PORT =
Number(process.env.PORT) || 7000;


server.listen(
  PORT,
  ()=>{

    logger.info(
      `Server running on port ${PORT}`
    );

    logger.info(
      `Allowed origins: ${allowedOrigins.join(", ")}`
    );

  }
);


server.timeout = 30000;


export { io };