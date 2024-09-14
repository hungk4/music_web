import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./config/connectDB";


connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.set('views', './views')
app.set('view engine', 'pug');

import {routesClient} from "./routes/client/index.route";
routesClient(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})