// preview upload image
const uploadImageInput = document.querySelector("[upload-image-input]");
const uploadImagePreview = document.querySelector("[upload-image-preview]");
if(uploadImageInput){
  uploadImageInput.addEventListener("change", (event) => {
    const file = uploadImageInput.files[0];
    if(file) {
      uploadImagePreview.src = URL.createObjectURL(file)
    }
  })
}
// end preview upload image

// preview upload image
const uploadAudio = document.querySelector("[upload-audio]");
console.log(uploadAudio);
if(uploadAudio){
  const uploadAudioInput = document.querySelector("[upload-audio-input]");
  const uploadAudioPlay = uploadAudio.querySelector("[upload-audio-play]");
  const source = uploadAudioPlay.querySelector("source");

  uploadAudioInput.addEventListener("change", (event) => {
    const file = uploadAudioInput.files[0];
    if(file) {
      source.src = URL.createObjectURL(file);
      uploadAudioPlay.load();
    }
  })
}
// end preview upload image