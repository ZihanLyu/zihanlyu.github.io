const cityNames = ["London", "Paris", "Tokyo"];
const countryNames = ["England", "France", "Japan"];
const imageNames = ["england.jpeg", "france.jpeg", "japan.jpeg"];
const imagePath = "../images/";
const NRCITIES = cityNames.length;

var TAB_CONTENT = '<div id="cityName" class="tabcontent"><h3>cityName</h3><img src="imageSource" alt="Image of countryName\'s Signature Food" style="width:100%; max-width:100px; display:block; margin-bottom:10px;"><p>cityName is the capital city of countryName.</p></div>';

function initTab() {
    const tabContainer = document.getElementById("tab-container");
    
    let tabButtonsHTML = '<div class="tab">';
    for (let i = 0; i < NRCITIES; i++) {
        tabButtonsHTML += `<button class="tablinks" onclick="openCity(event, '${cityNames[i]}')">${cityNames[i]}</button>`;
    }
    tabButtonsHTML += '</div>';
    
    let tabContentHTML = '';
    for (let i = 0; i < NRCITIES; i++) {
        let currentSection = TAB_CONTENT
            .replaceAll('cityName', cityNames[i])
            .replaceAll('countryName', countryNames[i])
            .replace('imageSource', imagePath + imageNames[i]);
        tabContentHTML += currentSection;
    }
    tabContainer.innerHTML = tabButtonsHTML + tabContentHTML;
    document.getElementsByClassName("tablinks")[0].click();
}

function openCity(evt, cityName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(cityName).style.display = "block";
    if (evt) {
        evt.currentTarget.className += " active";
    }
}