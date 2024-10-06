import express from "express";
import morgan from "morgan";
import cors from "cors";
import DBClient from "./config/db.js";
import router from "./routes/routes.js";
import category from "./models/category.js";

await DBClient.getConnection();

const app = express();

app.use(cors());

app.use(morgan('dev'))

app.use(express.json());

app.use('/mindreveal/api/v1/', router);

const PORT = process.env.PORT;

app.listen(PORT, () => (console.log('Hello User!')));
