let slideIndex = 1;
showSlides(slideIndex);

function plusSlides(n) {
    showSlides(slideIndex += n);
}

function currentSlide(n) {
    showSlides(slideIndex = n);
}

function showSlides(n) {
    let i;
    let slides = document.getElementsByClassName("mySlides");
    let dots = document.getElementsByClassName("dot");
    if (n > slides.length) {slideIndex = 1}    
    if (n < 1) {slideIndex = slides.length}
    for (i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";  
    }
    for (i = 0; i < dots.length; i++) {
        dots[i].className = dots[i].className.replace(" active", "");
    }
    slides[slideIndex-1].style.display = "block";  
    dots[slideIndex-1].className += " active";
}

function displayResult() {
    const header = document.getElementById("read-me");
    if (header.innerHTML === "READ ME!") {
        header.innerHTML = "When Click on the button again, the text should be hidden!";
    } else {
        header.innerHTML = "READ ME!";
    }
}

let currentStyle = 1;
function changeStyle() {
    const stylesheet = document.getElementById("theme-link");
    if (currentStyle === 1) {
        stylesheet.href = "../css/darkMode.css";
        currentStyle = 2;
    } else {
        stylesheet.href = "../css/lightMode.css";
        currentStyle = 1;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    showSlides(slideIndex);
});