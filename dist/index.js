"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const system_1 = require("./config/system");
const path_1 = __importDefault(require("path"));
const method_override_1 = __importDefault(require("method-override"));
dotenv_1.default.config();
const connectDB_1 = require("./config/connectDB");
(0, connectDB_1.connectDatabase)();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
const cookie_parser_1 = __importDefault(require("cookie-parser"));
app.use((0, cookie_parser_1.default)());
app.use((0, method_override_1.default)('_method'));
const express_session_1 = __importDefault(require("express-session"));
const express_flash_1 = __importDefault(require("express-flash"));
app.use((0, express_session_1.default)({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60000 }
}));
app.use((0, express_flash_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use(express_1.default.static(`${__dirname}/public`));
app.set('views', `${__dirname}/views`);
app.set('view engine', 'pug');
app.locals.prefixAdmin = system_1.systemConfig.prefixAdmin;
app.use('/tinymce', express_1.default.static(path_1.default.join(__dirname, 'node_modules', 'tinymce')));
const index_route_1 = require("./routes/client/index.route");
const index_route_2 = require("./routes/admin/index.route");
(0, index_route_1.routesClient)(app);
(0, index_route_2.routesAdmin)(app);
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
