const imageNames = ["spring", "summer", "fall", "winter"];
const NRIMAGES = imageNames.length; //since its calling imageNames, so it has to placed below imageNames

var SECTION = '<button class="accordion">Section 4</button><div class="panel"><p><a href="../images/winter.jpg" download>Download Winter image</a></p></div>';

function initSection() {
    const container = document.getElementById("accordion-container");
    let sectionsHTML = '';
    
    for (let i = 0; i < NRIMAGES; i++) {
        let currentSection = SECTION
            .replace('Section 4', `Section ${i + 1}`)
            .replace('winter', imageNames[i])
            .replace('Winter', imageNames[i].charAt(0).toUpperCase() + imageNames[i].slice(1));
        
        sectionsHTML += currentSection;
    }
    container.innerHTML = sectionsHTML;
    toggleFunction();
}

function toggleFunction() {
    const acc = document.getElementsByClassName("accordion");
    
    for (let i = 0; i < acc.length; i++) {
        acc[i].addEventListener("click", function() {
            this.classList.toggle("active");
            const panel = this.nextElementSibling;
            
            if (panel.style.maxHeight) {
                panel.style.maxHeight = null;
            } else {
                panel.style.maxHeight = panel.scrollHeight + "px";
            }
        });
    }
}