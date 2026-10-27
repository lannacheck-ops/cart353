const socket = io();

let player;
let sensorValue = 512;

const config = {
    type: Phaser.AUTO,

    width: 800,
    height: 400,

    backgroundColor: "#202830",

    scene: {
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);


function create() {

    // Create a square representing the player
    player = this.add.rectangle(
        400,
        200,
        40,
        40,
        0x66cc88
    );

    // Listen for Arduino sensor values
    socket.on("sensorValue", (value) => {
        sensorValue = value;
    });
}


function update() {

    // Convert the Arduino reading (0–1023)
    // into a horizontal position (20–780)

    console.log(sensorValue);
    player.x = 20 + (sensorValue / 1023) * 760;

}