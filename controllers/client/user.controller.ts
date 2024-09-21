import { Request, Response } from "express";
import md5 from 'md5';
import User from "../../models/user.model";

import {generateRandomString} from "../../helper/generateRandomString.helper";

// [GET] /user/login
export const login = async (req: Request, res: Response) => {
  res.render("client/pages/user/login.pug", {
    pageTitle: "Trang đăng nhập"
  })
}

// [GET] /user/register
export const register = async (req: Request, res: Response) => {
  res.render("client/pages/user/register.pug", {
    pageTitle: "Trang đăng kí tài khoản"
  })
}

// [POST] /user/register
export const registerPost = async (req: Request, res: Response) => {
  try{
    const fullName = req.body.fullName;
    const email = req.body.email;
    const password = req.body.password;
  
    const existUser = await User.findOne({
      email: email,
      deleted: false
    });
  
    if(existUser){
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
  
    const data = {
      fullName: fullName,
      email: email,
      password: md5(password),
      token: generateRandomString(30)
    };
    
    const user = new User(data);
    await user.save();

    const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // / Cookie expires in 30 days;
    res.cookie("token", user.token, {expires: expiresIn});

    req.flash("success", "Đăng kí tài khoản thành công");
    res.redirect("/");
  } catch(e){
    res.redirect("back");
  }
}


// [POST] /user/loginPost
export const loginPost = async (req: Request, res: Response) => {
  try{
    const {email, password} = req.body;
    const user = await User.findOne({
      email: email,
      deleted: false
    });
    if(!user){
      req.flash("error", "Không tồn tại email trong hệ thống");
      res.redirect("back");
      return;
    }
    if(md5(password) !== user.password){
      req.flash("error", "Sai mật khẩu");
      res.redirect("back");
      return;
    }
  
    const expiresIn = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // / Cookie expires in 30 days;
    res.cookie("token", user.token, {expires: expiresIn});
  
    req.flash("success", "Đăng nhập thành công");
    res.redirect("/");
  } catch(e){
    res.redirect("/");
  }
} 


// [POST] /user/logout
export const logout = async (req: Request, res: Response) => {
  res.clearCookie("token");
  res.redirect("/");
} 

