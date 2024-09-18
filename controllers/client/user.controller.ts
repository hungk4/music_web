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
      res.send("da ton tai tai khoan");
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
    
    res.redirect("back");
  } catch(e){
    res.redirect("back");
  }
}