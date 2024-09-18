import express, { Express } from "express";
import dotenv from "dotenv";
dotenv.config();

import { connectDatabase } from "./config/connectDB";


connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.set('views', './views')
app.set('view engine', 'pug');

import {routesClient} from "./routes/client/index.route";
import exp from "constants";
routesClient(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})