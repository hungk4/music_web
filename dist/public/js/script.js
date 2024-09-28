// APlayer
const aplayer = document.getElementById('aplayer');
if(aplayer) {
  let dataSong = aplayer.getAttribute("data-song");
  dataSong = JSON.parse(dataSong);

  let dataSinger = aplayer.getAttribute("data-singer");
  dataSinger = JSON.parse(dataSinger);

  const ap = new APlayer({
    container: aplayer,
    lrcType: 1,
    audio: [
      {
        name: dataSong.title,
        artist: dataSinger.fullName,
        url: dataSong.audio,
        cover: dataSong.avatar,
        lrc:  dataSong.lyrics
      }
    ],
    autoplay: true
  });

  const avatar = document.querySelector(".singer-detail .inner-avatar");
  // const avatar2 = document.querySelector(".aplayer .aplayer-pic");

  let timeOutListen;

  ap.on('play', function () {
    avatar.style.animationPlayState = "running";
    // avatar2.style.animationPlayState = "running";
  });

  ap.on('canplay', function () {
    timeOutListen = ap.audio.duration*4/5 * 1000;
  });

  setTimeout(() => {
    setTimeout(() => {
      ap.on('ended', function () {
        fetch(`/songs/listen/${dataSong._id}`)
          .then(res => res.json())
          .then(data => {
            if(data.code == 200) {
              const innerNumberListen = document.querySelector(".singer-detail .inner-listen .inner-number");
              innerNumberListen.innerHTML = data.listen;
            }
          })
      });
    }, timeOutListen);
  }, 1000);

  ap.on('pause', function () {
    avatar.style.animationPlayState = "paused";
    // avatar2.style.animationPlayState = "paused";
  });
}
// End APlayer

// nut like
const buttonLike = document.querySelector(`[button-like]`);
if(buttonLike){
  buttonLike.addEventListener("click", () => {
    const songId = buttonLike.getAttribute("button-like");
    const data = {
      songId: songId,
    };
    if(buttonLike.classList.contains("active")){
      buttonLike.classList.remove("active");
      data.type="dislike";
    } else {
      buttonLike.classList.add("active");
      data.type="like";
    }
  
    
    fetch("/songs/like", {
      method: "PATCH",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if(data.code == 200){
          const innerNumber = buttonLike.querySelector(".inner-number");
          innerNumber.innerHTML = data.updateLike;
        }
      })
  })
}
// End nut like

// Favorite
const listButtonFavorite = document.querySelectorAll(`[button-favorite]`);
if(listButtonFavorite.length > 0){
  listButtonFavorite.forEach((buttonFavorite) => {
    buttonFavorite.addEventListener("click", () => {
      const id = buttonFavorite.getAttribute("button-favorite");
  
      fetch("/songs/favorite", {
        method: "PATCH",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: id
        })
      })
        .then(response => response.json())
        .then(data => {
          if(data.code == 200){
            if(data.status == "add") {
              buttonFavorite.classList.add("active");
            } else {
              buttonFavorite.classList.remove("active");
            }
          }
        })
    })
  })
}
// End Favorite

// Gợi ý tìm kiếm
const boxSearch = document.querySelector(".box-search");
if(boxSearch){
  const inputSearch = boxSearch.querySelector("input[name='keyword']");
  inputSearch.addEventListener("keyup", () => {
    const keyword = inputSearch.value;

    fetch(`/songs/search/suggest?keyword=${keyword}`)
      .then(res => res.json())
      .then(data => {
          if(data.code == 200){
            const htmlSong = data.songs.map(item => `
              <a href="/songs/detail/${item.slug}" class="inner-item">
                <div class="inner-image">
                  <img src="${item.avatar}">
                </div>
                <div class="inner-info">
                  <div class="inner-title">${item.title}</div>
                  <div class="inner-singer">
                    <i class="fa-solid fa-microphone-lines"></i> ${item.singerFullName}
                  </div>
                </div>
              </a>         
            `);
  
            const elementInnerSuggest = boxSearch.querySelector(".inner-suggest");
            const elementList = elementInnerSuggest.querySelector(".inner-list");
  
            elementList.innerHTML = htmlSong.join();
  
            if(data.songs.length > 0){
              elementInnerSuggest.classList.add("show");
            } else{
              elementInnerSuggest.classList.remove("show");
            }
          }
  
      }) 
  })
}
// End Gợi ý tìm kiếm

// show-alert
const showAlert = document.querySelector("[show-alert]");
if(showAlert){
     let time = showAlert.getAttribute("show-alert") || 3000;
     time = parseInt(time);
     
     setTimeout(() => {
      showAlert.classList.add("hidden");
    }, time);
}
// End show-alert
