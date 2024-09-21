import { Request, Response } from "express";
import unidecode from "unidecode";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
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
      userId: res.locals.user.id,
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
    let songs = [];
    if(res.locals.user){
      songs = await FavoriteSong.find({
        userId: res.locals.user.id
      });
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
    }
  
    res.render("client/pages/songs/favorite.pug", {
      pageTitle: "Trang bài hát yêu thích",
      songs: songs
    })
  } catch(e){
    console.log(e);
    res.redirect("back");
  }
}


// [GET] /songs/:type
export const search = async (req: Request, res: Response) => {
  try{
    const type = req.params.type;

    const keyword = `${req.query.keyword}`;
    let songsFinal = [];

    if(keyword) {
      let keywordSlug = keyword.trim(); // bỏ các khoảng trằng ở đầu và cuối
      keywordSlug = keywordSlug.replace(/\s/g, "-"); // thay thế khoảng trằng bằng dấu gạch ngang (\s = space); cờ g tìm kiếm và thay thế tất cả
      keywordSlug = keywordSlug.replace(/-+/g, "-"); // Thay thế nhiều dấu gạch ngang liên tiếp bằng một dấu gạch ngang
      keywordSlug = unidecode(keywordSlug);
  
      const regexKeyword = new RegExp(keyword, "i");
      const regexKeywordSlug = new RegExp(keywordSlug, "i");
  
      const songs = await Song.find({
        $or: [
          { title: regexKeyword}, 
          { slug: regexKeywordSlug}
        ],
        deleted: false,
        status: "active"
      }).select("title avatar singerId like slug");
    
      for (const item of songs) {
        const singerInfo = await Singer.findOne({
          _id: item.singerId
        }).select("fullName");
    
        const itemFinal = {
          title: item.title,
          avatar: item.avatar,
          singerId: item.singerId,
          like: item.like,
          slug: item.slug,
          singerFullName: singerInfo["fullName"],
        };

        songsFinal.push(itemFinal);
      }
    }

    if(type == "result"){
      res.render("client/pages/songs/list", {
        pageTitle: "Kết quả tìm kiếm: " + keyword,
        keyword: keyword,
        songs: songsFinal
      });
    } else if(type == "suggest") {
      res.json({
        code: 200,
        songs: songsFinal
      })
    } else {
        res.json({
          code: 400
        })
      }
  }catch(e){
    res.redirect("back");
  }
};

// [GET] /songs/listen/:id
export const listen = async (req: Request, res: Response) => {
  try{
    const id = req.params.id;
    const song = await Song.findOne({
      _id: id,
      status: "active",
      deleted: false
    });
    const updateListen = song.listen + 1;
    await Song.updateOne({
      _id: id,
      status: "active",
      deleted: false
    }, {
      listen: updateListen
    });
    res.json({
      code: 200,
      listen: updateListen
    });
  }catch(e){
    res.redirect("back");
  }
};