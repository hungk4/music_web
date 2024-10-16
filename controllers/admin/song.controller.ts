import { Request, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";

import { systemConfig } from "../../config/system";

// [GET] /admin/songs
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false
  });
  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lý bài hát",
    songs: songs
  });
};

// [GET] /admin/songs/detail/:songId
export const detail = async (req: Request, res: Response) => {
  try{
    const id = req.params.songId;
 
    const song = await Song.findOne({
      _id: id,
      deleted: false
    });
    const topic = await Topic.findOne({
      _id: song.topicId,
      deleted: false
    }).select("title");
    
    const singer = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).select("fullName");

    res.render("admin/pages/songs/detail.pug", {
      pageTitle: "Chi tiết bài hát",
      song: song,
      topic: topic,
      singer: singer
    });

  } catch(e){
    res.redirect("back");
  }
};

// [GET] /admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  }).select("title");
  const singers = await Singer.find({
    deleted: false
  }).select("fullName");
  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers
  });
};

// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  try {
    if(req.body.avatar) {
      req.body.avatar = req.body.avatar[0];
    }
    if(req.body.audio) {
      req.body.audio = req.body.audio[0];
    }
    const song = new Song(req.body);
    await song.save();
    res.redirect(`/${systemConfig.prefixAdmin}/songs`);
  } catch(e){
    res.redirect("back");
  }
}

export const edit = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;
    const song = await Song.findOne({
      _id: id,
      deleted: false
    });
    const topics = await Topic.find({
      deleted: false
    }).select("title");
    const singers = await Singer.find({
      deleted: false
    }).select("fullName");
    res.render("admin/pages/songs/edit", {
      pageTitle: "Chỉnh sửa bài hát",
      topics: topics,
      singers: singers,
      song: song
    });
  } catch(e){
    res.redirect("back");
  }
}

export const editPatch = async (req: Request, res: Response) => {
  try {
    const id: string = req.params.id;

    if(req.body.avatar) {
      req.body.avatar = req.body.avatar[0];
    }
    if(req.body.audio) {
      req.body.audio = req.body.audio[0];
    }

    await Song.updateOne({
      _id: id,
      deleted: false
    }, req.body);

    res.redirect("back");
  } catch(e){
    res.redirect("back");
  }
}