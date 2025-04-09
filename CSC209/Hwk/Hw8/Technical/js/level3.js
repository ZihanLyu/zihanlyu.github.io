function showSelectedImage() {
    const selectedId = document.getElementById("imageSelect").value;
    const images = document.querySelectorAll(".slideshow img");

    images.forEach(img => {
        img.style.display = (img.id === selectedId) ? "block" : "none";
    });

    const captions = document.querySelectorAll(".caption");
    captions.forEach((caption, index) => {
        caption.style.display = ("img" + index === selectedId) ? "block" : "none";
    });
}