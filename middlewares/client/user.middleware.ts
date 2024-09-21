import { Request, Response, NextFunction} from "express";
import User from "../../models/user.model";

export const infoUser = async (req: Request, res: Response, next: NextFunction) => {
  try{
    if(req.cookies.token){
      const user = await User.findOne({
        token: req.cookies.token,
        deleted: false,
      }).select("fullName email");
      
      if(user){
        res.locals.user = user;
      }
    }
  } catch(e){
    console.log(e);
  }
  
  next();
}