import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import exp from "constants";
import FavoriteSong from "../../models/favorite-song.model";

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

    const existSongInFavorite = await FavoriteSong.findOne({
      // userId: res.locals.user.id,
      songId: song.id
    });
    if(existSongInFavorite){
      song["isFavorite"] = true;
    }

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

// [PATCH] /songs/like
export const like = async (req: Request, res: Response) => {
  try{
    const { songId, type } = req.body;
    const song = await Song.findOne({
      _id: songId,
      deleted: false
    })
    let like = parseInt(`${song.like}`);
    if(type === 'like'){
      like += 1;
    } else {
      like -=1 ;
    };
    await Song.updateOne({
      _id: songId,
      deleted: false
    }, {
      like: like
    });

    res.json({
      code: 200,
      updateLike: like,
      message: "Cập nhật thành công!"
    })
  } catch(e){
    res.redirect("back");
  }
}

// [PATCH] /songs/favorite
export const favoritePatch = async (req: Request, res: Response) => {
  try{
    const { id } = req.body;

    const data = {
      // userId: res.locals.user.id,
      songId: id
    };
  
    const existSongInFavorite = await FavoriteSong.findOne(data);
  
    let status = "";
  
    if(existSongInFavorite) {
      await FavoriteSong.deleteOne(data);
    } else {
      const record = new FavoriteSong(data);
      await record.save();
      status = "add";
    }
  
    res.json({
      code: 200,
      status: status
    });
  } catch(e){
    res.redirect("back");
  }
};

// [GET] /songs/favorite
export const favorite = async (req: Request, res: Response) => {
  try{
    const songs = await FavoriteSong.find({});
    for(let song of songs){
      const infoSong = await Song.findOne({
        _id: song.songId
      });
      const infoSinger = await Singer.findOne({
        _id: infoSong.singerId
      });
      song["infoSong"] = infoSong;
      song["infoSinger"] = infoSinger;
    }
  
    res.render("client/pages/songs/favorite.pug", {
      pageTitle: "Trang bài hát yêu thích",
      songs: songs
    })
  } catch(e){
    res.redirect("back");
  }
}