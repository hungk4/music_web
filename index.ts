import express, { Express } from "express";
import dotenv from "dotenv";

dotenv.config();

import { connectDatabase } from "./config/connectDB";


connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// cookie-parser
import cookieParser from "cookie-parser";
app.use(cookieParser());
// end cookie-parser

// Flash
import session from 'express-session';
import flash from 'express-flash';

app.use(session({ 
  secret: 'keyboard cat', 
  resave: false, 
  saveUninitialized: true,
  cookie: { maxAge: 60000 } 
}));
app.use(flash());
// End flash

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));

app.set('views', './views')
app.set('view engine', 'pug');

import {routesClient} from "./routes/client/index.route";
import {routesAdmin} from "./routes/admin/index.route";
routesClient(app);
routesAdmin(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})