import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";

export const index = async (req: Request, res: Response) => {
  try{
    const songs = await Song
      .find({
      deleted: false,
      status: "active"
    })
      .sort({like: "desc"})
      .limit(5)
      .select("title avatar singerId like slug");
  
    for (const item of songs) {
      const singerInfo = await Singer.findOne({
        _id: item.singerId
      }).select("fullName");
  
      item["singerFullName"] = singerInfo["fullName"];
    }
    res.render("client/pages/home/index.pug", {
      pageTitle: "Top bài hát được yêu thích nhất",
      songs: songs
    })
  } catch(e){
    res.redirect("back");
  }
}