const socket = io();

const status = document.getElementById("status");
const visual = document.getElementById("visual");
const counter = document.getElementById("counter");

let buttonPresses = 0;

// Detect when the browser connects to Node.js
socket.on("connect", () => {
    status.textContent = "Connected! Press your Arduino button.";
});

// Listen for button presses from the Arduino
socket.on("buttonPressed", () => {

    buttonPresses++;

    // Update the text
    status.textContent = "Arduino button pressed!";

    // Change the visual element's color
    visual.classList.toggle("active");

    // Update the counter
    counter.textContent = `Button presses: ${buttonPresses}`;

});