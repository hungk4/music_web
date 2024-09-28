"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.loginPost = exports.registerPost = exports.register = exports.login = void 0;
const md5_1 = __importDefault(require("md5"));
const user_model_1 = __importDefault(require("../../models/user.model"));
const generateRandomString_helper_1 = require("../../helper/generateRandomString.helper");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/login.pug", {
        pageTitle: "Trang đăng nhập"
    });
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.render("client/pages/user/register.pug", {
        pageTitle: "Trang đăng kí tài khoản"
    });
});
exports.register = register;
const registerPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fullName = req.body.fullName;
        const email = req.body.email;
        const password = req.body.password;
        const existUser = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (existUser) {
            req.flash("error", "Email đã tồn tại");
            res.redirect("back");
            return;
        }
        const data = {
            fullName: fullName,
            email: email,
            password: (0, md5_1.default)(password),
            token: (0, generateRandomString_helper_1.generateRandomString)(30)
        };
        const user = new user_model_1.default(data);
        yield user.save();
        const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        res.cookie("token", user.token, { expires: expiresIn });
        req.flash("success", "Đăng kí tài khoản thành công");
        res.redirect("/");
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.registerPost = registerPost;
const loginPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield user_model_1.default.findOne({
            email: email,
            deleted: false
        });
        if (!user) {
            req.flash("error", "Không tồn tại email trong hệ thống");
            res.redirect("back");
            return;
        }
        if ((0, md5_1.default)(password) !== user.password) {
            req.flash("error", "Sai mật khẩu");
            res.redirect("back");
            return;
        }
        const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
        res.cookie("token", user.token, { expires: expiresIn });
        req.flash("success", "Đăng nhập thành công");
        res.redirect("/");
    }
    catch (e) {
        res.redirect("/");
    }
});
exports.loginPost = loginPost;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.clearCookie("token");
    res.redirect("/");
});
exports.logout = logout;
