import { Visitor } from './visitor.js'
import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm";

let socialMediaData = [];

const socket = io();

let player;
let sensorValue = 512;

const config = {
    type: Phaser.AUTO,

    width: 1920,
    height: 1080,

    backgroundColor: "#202830",

    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    /**
     * VISITORS
     */
    this.load.image('chester', './assets/characters/Chester.png');
    this.load.image('asian', './assets/characters/Asian.webp');
    this.load.image('cocky', './assets/characters/CockyGuy.webp');
    this.load.image('namu', './assets/characters/Namu.webp');
    this.load.image('old', './assets/characters/OldMan.webp');
    this.load.image('redhead', './assets/characters/RedHead.png');
    this.load.image('moustache', './assets/characters/RedHeadMoustache.png');
    this.load.image('steven', './assets/characters/Steven_Rudboys.webp');
    /**
     * SCENE
     */
    this.load.image('bg', './assets/scene/Nightmare_office_bg.png');
    this.load.image('window', './assets/scene/Nightmare_office_window.png');
    this.load.image('reflection', './assets/scene/Nightmare_office_reflection.png');

    /**
     * DATA
     */
    this.load.text("socialMediaData", "./data/SocialMediaUsersDataset.csv");
}
let visitors = [];
let activeVisitor;
let visitorImages = ['chester', 'asian', 'cocky', 'namu', 'old', 'redhead', 'moustache', 'steven']
let visitorLimit;
let charcText;
let walkingAnimX;
let walkingAnimY;
let playerTargetPosX;
let playerTargetPosY;
let enterKey;
let admitVisitor = false;
let visitorActive = false;
console.log(playerTargetPosY);
function create() {
    enterKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    visitorLimit = 5;

    playerTargetPosX = this.scale.width / 2;
    playerTargetPosY = this.scale.height / 1.5 + 20;

    // CONVERT SOCIAL MEDIA DATASET TO JSON
    let csvText = this.cache.text.get("socialMediaData");

    let result = Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });

    socialMediaData = result.data;

    console.log(socialMediaData);

    let previousImage = [];
    // CREATE VISITORS FOR THE DAY AND ADD THEM TO AN ARRAY
    for (let i = 0; i < visitorLimit; i++) {
        // SET A RANDOM IMAGE FOR EACH VISITOR
        let randomImage = visitorImages[Math.floor(Math.random() * visitorImages.length)];
        // MAKES SURE AN IMAGE DOESNT APPEAR TWICE AND EACH VISITOR IS A DIFFERENT IMAGE
        if (typeof previousImage !== "undefined" && previousImage.includes(randomImage)) {
            while (previousImage.includes(randomImage)) {
                randomImage = visitorImages[Math.floor(Math.random() * visitorImages.length)];
            }
        }
        visitors.push(new Visitor(this, 'Vanessa', randomImage, 0, this.scale.height / 1.5));
        previousImage.push(randomImage);
        console.log(randomImage, previousImage);
    }


    // CREATE THE FRONT SCENE
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'reflection').setScale(0.6);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg').setScale(0.6);

    console.log('./assets/Chester.png');

    // LISTEN FOR ARDUINO SENSOR VALUES
    socket.on("sensorValue", (value) => {
        sensorValue = value;
    });
    // CHARACTER TEXT
    charcText = this.add.text(this.scale.width / 1.5, this.scale.height / 3, 'Hello', { fontSize: '32px', fill: '#ffffff' });

    // ANIMATIONS
    walkingAnimX = this.tweens.add({
        targets: player,
        x: playerTargetPosX,
        duration: 4000,
        ease: 'Linear'
    });

    walkingAnimY = this.tweens.add({
        targets: player,
        y: playerTargetPosY,
        duration: 300,
        ease: 'Sine.easeInOut',
        yoyo: true,
        repeat: -1
    });
}


function update() {
    // If the player reaches the center of the screen, stop the walking animation
    if (player.x >= playerTargetPosX) {
        walkingAnimX.stop();
        walkingAnimY.stop();
        this.tweens.add({
            targets: player,
            y: this.scale.height / 1.5,
            duration: 80,
            ease: 'Sine.easeInOut',
            repeat: 1
        });
        visitorActive = true;
    }
    if (!admitVisitor) {
        walkingAnimX.pause();
        walkingAnimY.pause();
    }
    else {
        walkingAnimX.resume();
        walkingAnimY.resume();
    }
    if (Phaser.Input.Keyboard.JustDown(enterKey) && !admitVisitor) {
        admitVisitor = true;
    }
    console.log(admitVisitor);
    // Convert the Arduino reading (0–1023)
    // into a horizontal position (20–780)

    // console.log(sensorValue);
    // player.x = 20 + (sensorValue / 1023) * 1800;

    // Normalize the potentiometer value to a range of 0–1
    let amount = sensorValue / 1023;
    // console.log(amount);

    // Blend from white (255, 255, 255) to red (255, 0, 0)
    let red = 255;
    let green = Math.round(255 * (1 - amount));
    let blue = Math.round(255 * (1 - amount));

    // Convert RGB to a Phaser colour
    let colour = Phaser.Display.Color.GetColor(red, green, blue);

    // Apply the tint
    if (visitorActive) {
        player.setTint(colour);
    }
    else {
        player.setTint(0xffffff);
    }


}