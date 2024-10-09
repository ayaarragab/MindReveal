/**
 * @file server.js
 * @brief Main entry point for the MindReveal API application.
 * 
 * This file initializes the Express application, configures middleware,
 * establishes a database connection, and sets up API routes.
 * 
 * @note Ensure that the environment variable PORT is set before running the server.
 */

import express from "express";
import morgan from "morgan";
import cors from "cors";
import DBClient from "./config/db.js";
import router from "./routes/routes.js";

await DBClient.getConnection();

const app = express();

app.use(cors());

app.use(morgan('dev'))

app.use(express.json());

app.use('/mindreveal/api/v1/', router);

const PORT = process.env.PORT;

app.listen(PORT, () => (console.log('Hello User!')));
