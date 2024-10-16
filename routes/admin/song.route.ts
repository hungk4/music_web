import express from "express";
import multer from "multer";
const router = express.Router();

const upload = multer();

import * as controller from "../../controllers/admin/song.controller";
import * as uploadCoud from "../../middlewares/admin/uploadCloud.middelware";

router.get("/", controller.index);

router.get("/detail/:songId", controller.detail);

router.get("/create", controller.create);

router.post(
  "/create",
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "audio",
      maxCount: 1
    }
  ]),
  uploadCoud.uploadFields,
  controller.createPost
);

router.get("/edit/:id", controller.edit);

router.patch(
  "/edit/:id",  
  upload.fields([
    {
      name: "avatar",
      maxCount: 1
    },
    {
      name: "audio",
      maxCount: 1
    }
  ]),
  uploadCoud.uploadFields, 
  controller.editPatch);
export const songRoute = router;