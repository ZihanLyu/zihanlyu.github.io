// document.addEventListener("DOMContentLoaded", function () {
//     let activeTimer = "pomodoro"; // Default timer

//     const pomodoroButton = document.getElementById("pomodoro-session");
//     const shortBreakButton = document.getElementById("short-break");
//     const longBreakButton = document.getElementById("long-break");
//     const startButton = document.getElementById("start");
//     const stopButton = document.getElementById("stop");
//     const timerMessage = document.getElementById("timer-message");

//     const pomodoroTimer = document.getElementById("pomodoro-timer");
//     const shortTimer = document.getElementById("short-timer");
//     const longTimer = document.getElementById("long-timer");

//     let countdown;
//     let timeLeft = 1500; // Default: 25 minutes (1500 seconds)

//     // Hide all timers initially
//     function hideAllTimers() {
//         pomodoroTimer.style.display = "none";
//         shortTimer.style.display = "none";
//         longTimer.style.display = "none";
//     }

//     // Show only the selected timer
//     function showTimer(timerType) {
//         hideAllTimers();
//         if (timerType === "pomodoro") {
//             pomodoroTimer.style.display = "block";
//             timeLeft = 1500;
//         } else if (timerType === "short") {
//             shortTimer.style.display = "block";
//             timeLeft = 300;
//         } else if (timerType === "long") {
//             longTimer.style.display = "block";
//             timeLeft = 600;
//         }
//         activeTimer = timerType;
//         updateTimerDisplay();
//     }

//     // Update the timer display dynamically
//     function updateTimerDisplay() {
//         const minutes = Math.floor(timeLeft / 60);
//         const seconds = timeLeft % 60;
//         const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
//         if (activeTimer === "pomodoro") {
//             pomodoroTimer.textContent = formattedTime;
//         } else if (activeTimer === "short") {
//             shortTimer.textContent = formattedTime;
//         } else if (activeTimer === "long") {
//             longTimer.textContent = formattedTime;
//         }
//     }

//     // Start the timer countdown
//     function startTimer() {
//         if (!activeTimer) {
//             timerMessage.style.display = "block";
//             return;
//         }

//         timerMessage.style.display = "none";
//         clearInterval(countdown);

//         countdown = setInterval(() => {
//             if (timeLeft <= 0) {
//                 clearInterval(countdown);
//                 alert("Time's up!");
//                 return;
//             }
//             timeLeft--;
//             updateTimerDisplay();
//         }, 1000);
//     }

//     // Stop the timer countdown
//     function stopTimer() {
//         clearInterval(countdown);
//     }

//     // Event listeners for session selection
//     pomodoroButton.addEventListener("click", () => showTimer("pomodoro"));
//     shortBreakButton.addEventListener("click", () => showTimer("short"));
//     longBreakButton.addEventListener("click", () => showTimer("long"));
//     startButton.addEventListener("click", startTimer);
//     stopButton.addEventListener("click", stopTimer);

//     // Show the default Pomodoro timer on load
//     showTimer("pomodoro");
// });
document.addEventListener("DOMContentLoaded", function () {
    let activeTimer = "pomodoro"; // Default timer

    const pomodoroButton = document.getElementById("pomodoro-session");
    const shortBreakButton = document.getElementById("short-break");
    const longBreakButton = document.getElementById("long-break");
    const startButton = document.getElementById("start");
    const stopButton = document.getElementById("stop");
    const timerMessage = document.getElementById("timer-message");

    const pomodoroTimer = document.getElementById("pomodoro-timer");
    const shortTimer = document.getElementById("short-timer");
    const longTimer = document.getElementById("long-timer");

    let countdown;
    let timeLeft = 1500; // Default: 25 minutes (1500 seconds)

    // Hide all timers initially
    function hideAllTimers() {
        pomodoroTimer.style.display = "none";
        shortTimer.style.display = "none";
        longTimer.style.display = "none";
    }

    // Show only the selected timer
    function showTimer(timerType) {
        hideAllTimers();
        if (timerType === "pomodoro") {
            pomodoroTimer.style.display = "block";
            timeLeft = 1500;
        } else if (timerType === "short") {
            shortTimer.style.display = "block";
            timeLeft = 300;
        } else if (timerType === "long") {
            longTimer.style.display = "block";
            timeLeft = 600;
        }
        activeTimer = timerType;
        updateTimerDisplay();
    }

    // Update the timer display dynamically
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        const formattedTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        
        if (activeTimer === "pomodoro") {
            pomodoroTimer.textContent = formattedTime;
        } else if (activeTimer === "short") {
            shortTimer.textContent = formattedTime;
        } else if (activeTimer === "long") {
            longTimer.textContent = formattedTime;
        }
    }

    // Save completed session data
    function saveSession(sessionType, duration) {
        const currentUser = localStorage.getItem('currentUser');
        if (!currentUser) return; // Ensure a user is logged in

        let users = JSON.parse(localStorage.getItem('users')) || {};
        if (!users[currentUser]) users[currentUser] = { tasks: [] };

        users[currentUser].tasks.push({
            type: sessionType,
            duration: duration,
            timestamp: new Date().toISOString()
        });

        localStorage.setItem('users', JSON.stringify(users));
    }

    // Start the timer countdown
    function startTimer() {
        if (!activeTimer) {
            timerMessage.style.display = "block";
            return;
        }

        timerMessage.style.display = "none";
        clearInterval(countdown);

        countdown = setInterval(() => {
            if (timeLeft <= 0) {
                clearInterval(countdown);
                alert("Time's up!");

                // Save session on completion
                saveSession(activeTimer, activeTimer === "pomodoro" ? 25 : activeTimer === "short" ? 5 : 10);
                return;
            }
            timeLeft--;
            updateTimerDisplay();
        }, 1000);
    }

    // Stop the timer countdown
    function stopTimer() {
        clearInterval(countdown);
    }

    // Event listeners for session selection
    pomodoroButton.addEventListener("click", () => showTimer("pomodoro"));
    shortBreakButton.addEventListener("click", () => showTimer("short"));
    longBreakButton.addEventListener("click", () => showTimer("long"));
    startButton.addEventListener("click", startTimer);
    stopButton.addEventListener("click", stopTimer);

    // Show the default Pomodoro timer on load
    showTimer("pomodoro");
});
