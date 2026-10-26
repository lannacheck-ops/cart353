const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const { SerialPort } = require("serialport");
const { ReadlineParser } = require("@serialport/parser-readline");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve the files in the public folder
app.use(express.static("public"));

// Arduino port
const arduinoPort = "COM3";

// Connect to the Arduino
const port = new SerialPort({
    path: arduinoPort,
    baudRate: 9600
});

// Read messages from the Arduino, one line at a time
const parser = port.pipe(
    new ReadlineParser({ delimiter: "\r\n" })
);

// Listen for incoming Arduino messages
parser.on("data", (data) => {
    console.log("Arduino:", data);

    if (data.trim() === "BUTTON_PRESSED") {
        // Send the event to connected web browsers
        io.emit("buttonPressed");
    }
});

// Handle browser connections
io.on("connection", (socket) => {
    console.log("A browser connected!");
});

port.on("error", (error) => {
    console.error("Serial port error:", error.message);
});

// Start the web server
server.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
});