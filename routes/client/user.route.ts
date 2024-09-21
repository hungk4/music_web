import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/user.controller";


router.get("/register", controller.register);

router.post("/register", controller.registerPost)

router.get("/login", controller.login);

router.post("/login", controller.loginPost);

router.get("/logout", controller.logout);

export const userRoute = router;