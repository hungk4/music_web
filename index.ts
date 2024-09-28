import express, { Express } from "express";
import dotenv from "dotenv";
import { systemConfig } from "./config/system";
import path from "path";
import methodOverride from "method-override";

dotenv.config();

import { connectDatabase } from "./config/connectDB";


connectDatabase();

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

// cookie-parser
import cookieParser from "cookie-parser";
app.use(cookieParser());
// end cookie-parser

// method-override
app.use(methodOverride('_method'));

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


app.set('views', `${__dirname}/views`)
app.set('view engine', 'pug');


app.locals.prefixAdmin = systemConfig.prefixAdmin;

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

import {routesClient} from "./routes/client/index.route";
import {routesAdmin} from "./routes/admin/index.route";
routesClient(app);
routesAdmin(app);


app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})