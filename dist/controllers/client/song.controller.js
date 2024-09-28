"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.listen = exports.search = exports.favorite = exports.favoritePatch = exports.like = exports.detail = exports.list = void 0;
const unidecode_1 = __importDefault(require("unidecode"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugTopic = req.params.slugTopic;
        const topic = yield topic_model_1.default.findOne({
            slug: slugTopic,
            deleted: false,
            status: "active"
        });
        const songs = yield song_model_1.default.find({
            topicId: topic.id,
            deleted: false,
            status: "active"
        }).select("title avatar singerId like slug");
        for (const item of songs) {
            const singerInfo = yield singer_model_1.default.findOne({
                _id: item.singerId
            }).select("fullName");
            item["singerFullName"] = singerInfo["fullName"];
        }
        res.render("client/pages/songs/list", {
            pageTitle: topic.title,
            songs: songs
        });
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const slugSong = req.params.slugSong;
        const song = yield song_model_1.default.findOne({
            slug: slugSong,
            status: "active",
            deleted: false
        });
        const singer = yield singer_model_1.default.findOne({
            _id: song.singerId,
            deleted: false
        }).select("fullName");
        const topic = yield topic_model_1.default.findOne({
            _id: song.topicId,
            deleted: false
        }).select("title");
        const existSongInFavorite = yield favorite_song_model_1.default.findOne({
            songId: song.id
        });
        if (existSongInFavorite) {
            song["isFavorite"] = true;
        }
        res.render("client/pages/songs/detail.pug", {
            pageTitle: "Chi tiết bài hát",
            song: song,
            topic: topic,
            singer: singer
        });
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { songId, type } = req.body;
        const song = yield song_model_1.default.findOne({
            _id: songId,
            deleted: false
        });
        let like = parseInt(`${song.like}`);
        if (type === 'like') {
            like += 1;
        }
        else {
            like -= 1;
        }
        ;
        yield song_model_1.default.updateOne({
            _id: songId,
            deleted: false
        }, {
            like: like
        });
        res.json({
            code: 200,
            updateLike: like,
            message: "Cập nhật thành công!"
        });
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.like = like;
const favoritePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.body;
        const data = {
            userId: res.locals.user.id,
            songId: id
        };
        const existSongInFavorite = yield favorite_song_model_1.default.findOne(data);
        let status = "";
        if (existSongInFavorite) {
            yield favorite_song_model_1.default.deleteOne(data);
        }
        else {
            const record = new favorite_song_model_1.default(data);
            yield record.save();
            status = "add";
        }
        res.json({
            code: 200,
            status: status
        });
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.favoritePatch = favoritePatch;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let songs = [];
        if (res.locals.user) {
            songs = yield favorite_song_model_1.default.find({
                userId: res.locals.user.id
            });
            for (let song of songs) {
                const infoSong = yield song_model_1.default.findOne({
                    _id: song.songId
                });
                const infoSinger = yield singer_model_1.default.findOne({
                    _id: infoSong.singerId
                });
                song["infoSong"] = infoSong;
                song["infoSinger"] = infoSinger;
            }
        }
        res.render("client/pages/songs/favorite.pug", {
            pageTitle: "Trang bài hát yêu thích",
            songs: songs
        });
    }
    catch (e) {
        console.log(e);
        res.redirect("back");
    }
});
exports.favorite = favorite;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const type = req.params.type;
        const keyword = `${req.query.keyword}`;
        let songsFinal = [];
        if (keyword) {
            let keywordSlug = keyword.trim();
            keywordSlug = keywordSlug.replace(/\s/g, "-");
            keywordSlug = keywordSlug.replace(/-+/g, "-");
            keywordSlug = (0, unidecode_1.default)(keywordSlug);
            const regexKeyword = new RegExp(keyword, "i");
            const regexKeywordSlug = new RegExp(keywordSlug, "i");
            const songs = yield song_model_1.default.find({
                $or: [
                    { title: regexKeyword },
                    { slug: regexKeywordSlug }
                ],
                deleted: false,
                status: "active"
            }).select("title avatar singerId like slug");
            for (const item of songs) {
                const singerInfo = yield singer_model_1.default.findOne({
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
        if (type == "result") {
            res.render("client/pages/songs/list", {
                pageTitle: "Kết quả tìm kiếm: " + keyword,
                keyword: keyword,
                songs: songsFinal
            });
        }
        else if (type == "suggest") {
            res.json({
                code: 200,
                songs: songsFinal
            });
        }
        else {
            res.json({
                code: 400
            });
        }
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.search = search;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const id = req.params.id;
        const song = yield song_model_1.default.findOne({
            _id: id,
            status: "active",
            deleted: false
        });
        const updateListen = song.listen + 1;
        yield song_model_1.default.updateOne({
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
    }
    catch (e) {
        res.redirect("back");
    }
});
exports.listen = listen;
