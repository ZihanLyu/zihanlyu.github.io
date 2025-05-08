const modal = document.getElementById("loginModal");
const closeBtn = document.getElementsByClassName("close")[0];
const userLoginBtn = document.getElementById("userLoginBtn");

const modalTitle = document.getElementById("modalTitle");
const avatarImg = document.getElementById("avatarImg");
const emailInput = document.getElementById("emailInput");
const loginHelp = document.getElementById("loginHelp");

const selectAvatarBtn = document.getElementById("selectAvatarBtn");
const avatarSelectionModal = document.getElementById("avatarSelectionModal");
const avatarOptions = document.getElementsByClassName("avatar-option");
const closeAvatarsBtn = document.getElementsByClassName("close-avatars")[0];
const confirmAvatarBtn = document.getElementsByClassName("confirm-avatar-btn")[0];
const selectedAvatarInput = document.getElementById("selectedAvatarInput");

userLoginBtn.onclick = function () {
    modalTitle.textContent = "User Login";
    avatarImg.src = "../images/youngman_1.png";
    emailInput.value = "";
    loginHelp.textContent = "Please enter your credentials";
    selectAvatarBtn.style.display = "block";
    modal.style.display = "block";
}
closeBtn.onclick = function () {
    modal.style.display = "none";
}

window.onclick = function (event) {
    if (event.target === modal) {
        modal.style.display = "none";
    }
    if (event.target === avatarSelectionModal) {
        avatarSelectionModal.style.display = "none";
    }
}

selectAvatarBtn.onclick = function () {
    avatarSelectionModal.style.display = "block";
}

closeAvatarsBtn.onclick = function () {
    avatarSelectionModal.style.display = "none";
}

let currentSelectedAvatar = null;

for (let i = 0; i < avatarOptions.length; i++) {
    avatarOptions[i].addEventListener("click", function () {
        for (let j = 0; j < avatarOptions.length; j++) {
            avatarOptions[j].classList.remove("avatar-selected");
        }
        this.classList.add("avatar-selected");
        currentSelectedAvatar = this.getAttribute("data-avatar");
    });
}

confirmAvatarBtn.onclick = function () {
    if (currentSelectedAvatar) {
        avatarImg.src = currentSelectedAvatar;
        selectedAvatarInput.value = currentSelectedAvatar;
        avatarSelectionModal.style.display = "none";
    } else {
        alert("Please select an avatar first!");
    }
}
