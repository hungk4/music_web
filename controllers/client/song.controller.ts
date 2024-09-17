import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";

// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  try{
    const slugTopic: string = req.params.slugTopic;

    const topic = await Topic.findOne({
      slug: slugTopic,
      deleted: false,
      status: "active"
    });
  
    const songs = await Song.find({
      topicId: topic.id,
      deleted: false,
      status: "active"
    }).select("title avatar singerId like slug");
  
    for (const item of songs) {
      const singerInfo = await Singer.findOne({
        _id: item.singerId
      }).select("fullName");
  
      item["singerFullName"] = singerInfo["fullName"];
    }
  
    res.render("client/pages/songs/list", {
      pageTitle: topic.title,
      songs: songs
    });
  } catch(e){
    res.redirect("back");
  }
};

// [GET] /songs/detail/:slugSong
export const detail = async (req: Request, res: Response) => {
  try{
    const slugSong: string = req.params.slugSong;

    const song = await Song.findOne({
      slug: slugSong,
      status: "active",
      deleted: false
    });

    const singer = await Singer.findOne({
      _id: song.singerId,
      deleted: false
    }).select("fullName")

    const topic = await Topic.findOne({
      _id: song.topicId,
      deleted: false
    }).select("title")

    res.render("client/pages/songs/detail.pug", {
      pageTitle: "Chi tiết bài hát",
      song: song,
      topic: topic,
      singer: singer
    })
  } catch(e){
    res.redirect("back");
  }
}