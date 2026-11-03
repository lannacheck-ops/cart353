import { Visitor } from './visitor.js'
import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm";

let socialMediaData = [];
let fakeUsersData = [];
let realUsersData = [];

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
    this.load.text("fakeUserData", "./data/fake_socialmedia_account_detection_data/fake_users.csv");
    this.load.text("realUserData", "./data/fake_socialmedia_account_detection_data/real_users.csv");
}
/**
 * VISITORS VARIABLES
 */
let visitors = [];
let activeVisitor;
let visitorImages = ['chester', 'asian', 'cocky', 'namu', 'old', 'redhead', 'moustache', 'steven'];
let visitorIndex;
let visitorLimit;
let visitorText;
let numOfAIVisitors;
let numOfAIVisitorsLimit;
let visitorTargetPosX;
let enterKey;
function create() {
    // KEYBOARD KEYS
    enterKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // CREATE BACK SCENE
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'window').setScale(0.6);
    visitorLimit = 5;

    visitorTargetPosX = this.scale.width / 2;

    // CONVERT SOCIAL MEDIA DATASET TO JSON
    let socialMediacsvText = this.cache.text.get("socialMediaData");
    let socialMediaresult = Papa.parse(socialMediacsvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });
    socialMediaData = socialMediaresult.data;

    // CONVERT FAKE ACCOUNT DETECTION DATASET TO JSON
    let fakeUsercsvText = this.cache.text.get("fakeUserData");
    let fakeUserresult = Papa.parse(fakeUsercsvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });
    fakeUsersData = fakeUserresult.data;

    // CONVERT REAL ACCOUNT DETECTION DATASET TO JSON
    let realUsercsvText = this.cache.text.get("realUserData");
    let realUserresult = Papa.parse(realUsercsvText, {
        header: true,
        skipEmptyLines: true,
        dynamicTyping: true
    });
    realUsersData = realUserresult.data;
    console.log(fakeUsersData);
    console.log(realUsersData);
    // console.log(socialMediaData[0].Name);

    let previousImage = [];
    // NUMBER OF AI VISITORS
    numOfAIVisitorsLimit = visitorLimit - 2;
    numOfAIVisitors = Math.floor(Math.random() * numOfAIVisitorsLimit) + 1;

    console.log(numOfAIVisitors)
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
        // let randomName = socialMediaData[Math.floor(Math.random() * socialMediaData.length)].Name;
        let randomName = realUsersData[Math.floor(Math.random() * realUsersData.length)].name;
        while (randomName == null) {
            randomName = realUsersData[Math.floor(Math.random() * realUsersData.length)].name;
        }
        visitors.push(new Visitor(this, randomName, randomImage, 0, this.scale.height / 1.5));
        previousImage.push(randomImage);
        // console.log(visitors[i].name);
    }


    // SET WHICH VISITORS ARE AI
    let aiVisitors = [];

    for (let i = 0; i < numOfAIVisitors; i++) {
        // INITIALLY SET A RANDOM INDEX OF AN AI VISITOR
        let randomAiVisitor = visitors[Math.floor(Math.random() * visitors.length)];
        // IF THAT INDEX IS ALREADY AN AI CHOOSE ANOTHER RANDOM INDEX
        while (randomAiVisitor.aiDiagnosis == true) {
            randomAiVisitor = visitors[Math.floor(Math.random() * visitors.length)];
        }
        // GIVE EACH AI VISITOR A RANDOM NAME FROM THE FAKE USER DATABASE
        let randomName = fakeUsersData[Math.floor(Math.random() * fakeUsersData.length)].name;
        // SOME VALUES OF THE NAMES ARE NULL SO MAKE SURE EVERYONE HAS A NAME
        while (randomName == null) {
            randomName = fakeUsersData[Math.floor(Math.random() * fakeUsersData.length)].name;
        }
        randomAiVisitor.aiDiagnosis = true;
        randomAiVisitor.name = randomName;
        aiVisitors.push(randomAiVisitor);
    }



    console.log(visitors);
    // WHAT VISITOR NUMBER ARE WE AT
    visitorIndex = 0;

    // CREATE THE FRONT SCENE
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'reflection').setScale(0.6);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg').setScale(0.6);



    // LISTEN FOR ARDUINO SENSOR VALUES
    socket.on("sensorValue", (value) => {
        sensorValue = value;
    });
    // VISITOR TEXT
    visitorText = this.add.text(this.scale.width / 1.5, this.scale.height / 3, 'Hello', { fontSize: '32px', fill: '#ffffff' });

}


function update() {
    // ACTIVATE THE CURRENT VISITOR
    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
        for (let visitor of visitors) {
            if (visitors.indexOf(visitor) == visitorIndex && !visitor.isActive) {
                visitor.activate();
                activeVisitor = visitor;
                activeVisitor.bobbing();
                activeVisitor.moveTo(visitorTargetPosX);
                console.log(activeVisitor.sprite.x)
            }
        }
    }
    if (typeof activeVisitor !== 'undefined' && activeVisitor.sprite.x >= visitorTargetPosX) {
        activeVisitor.stopBobbing();
    }

    temperatureReaction();

}

function temperatureReaction() {
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
    if (typeof activeVisitor !== 'undefined') {
        if (activeVisitor.ready) {
            activeVisitor.sprite.setTint(colour);
        }
        else {
            activeVisitor.sprite.setTint(0xffffff);
        }
    }


}