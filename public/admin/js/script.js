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