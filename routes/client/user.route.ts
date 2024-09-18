import express from "express";
const router = express.Router();

import * as controller from "../../controllers/client/user.controller";

router.get("/login", controller.login);

router.get("/register", controller.register);

router.post("/register", controller.registerPost)

export const userRoute = router;