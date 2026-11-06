import { Visitor } from './visitor.js'
import Papa from "https://cdn.jsdelivr.net/npm/papaparse@5.5.3/+esm";

let socialMediaData = [];
let fakeUsersData = [];
let realUsersData = [];

const socket = io();

let sensorValue = 0;

const config = {
    type: Phaser.AUTO,

    width: 2000,
    height: 1080,

    backgroundColor: "#202830",
    scale: {
        mode: Phaser.Scale.FIT,       // Scales canvas to fit while maintaining aspect ratio
        autoCenter: Phaser.Scale.CENTER_BOTH // Centers canvas horizontally and vertically
    },

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
    this.load.image('old', './assets/characters/OldMan.png');
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

    /**
     * MENU ICONS
     */
    // TABS
    this.load.image("thermometer", "./assets/diagnosisIcons/tabs/thermometer.png");
    this.load.image("brain", "./assets/diagnosisIcons/tabs/brain.png");
    this.load.image("hands", "./assets/diagnosisIcons/tabs/hands.png");

    // TEMPERATURE
    this.load.image("heatStroke", "./assets/diagnosisIcons/temperature/heat_stroke.png");
    this.load.image("freezing", "./assets/diagnosisIcons/temperature/freezing.png");
    this.load.image("neutral", "./assets/diagnosisIcons/temperature/neutral.png");
    this.load.image("verbalResponse", "./assets/diagnosisIcons/temperature/verbal.png");
    this.load.image("sensoryLoss", "./assets/diagnosisIcons/temperature/sensory_loss.png");

    // MEMORY
    this.load.image("fullAccuracy", "./assets/diagnosisIcons/memory/fullAccuracy.png");
    this.load.image("memoryLoss", "./assets/diagnosisIcons/memory/memoryLoss.png");
    this.load.image("mediumAccuracy", "./assets/diagnosisIcons/memory/mediumAccuracy.png");
    this.load.image("lowAccuracy", "./assets/diagnosisIcons/memory/lowAccuracy.png");
    this.load.image("genius", "./assets/diagnosisIcons/memory/genius.png");
    this.load.image("sensoryLoss", "./assets/diagnosisIcons/memory/sensory_loss.png");
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
/**
 * AI VISITOR VARIABLES
 */
let numOfAIVisitors;
let numOfAIVisitorsLimit;
/**
 * VISITOR ANIMATION VARIABLES
 */
let visitorTargetPosX;
/**
 * KEYBOARD KEYS
 */
let enterKey;
let diagnosisKey;
/**
 * MENU VARIABLES
 */
let diagnosisButtons = [];
const diagnosisOptions = [
    // TEMPERATURE
    {
        id: "temperature",
        title: "Temperature",
        icon: "thermometer",
        columns: [
            {
                id: "highTemperature",
                title: "High Temperature Reactions",

                options: [
                    {
                        id: "heatStroke",
                        label: "Heat Stroke",
                        image: "heatStroke"
                    },
                    {
                        id: "verbalResponse",
                        label: "Verbal Response",
                        image: "verbalResponse"
                    },
                    {
                        id: "noResponse",
                        label: "No Response",
                        image: "neutral"
                    },
                    {
                        id: "sensoryLoss",
                        label: "Sensory Loss",
                        image: "sensoryLoss"
                    }
                ]
            },

            {
                id: "lowTemperature",
                title: "Low Temperature Reactions",

                options: [
                    {
                        id: "freezing",
                        label: "Freezing",
                        image: "freezing"
                    },
                    {
                        id: "verbalResponse",
                        label: "Verbal Response",
                        image: "verbalResponse"
                    },
                    {
                        id: "noResponse",
                        label: "No Response",
                        image: "neutral"
                    }
                ]
            },

            {
                id: "normalTemperature",
                title: "Normal Temperature Reactions",

                options: [
                    {
                        id: "noResponse",
                        label: "No Response",
                        image: "neutral"
                    },
                    {
                        id: "verbalResponse",
                        label: "Verbal Response",
                        image: "verbalResponse"
                    }
                ]
            }
        ]

    },
    // MEMORY
    {
        id: "memory",
        title: "Memory",
        icon: "brain",
        columns: [
            {
                id: "easyMemory",
                title: "< 5bpm Reactions",

                options: [
                    {
                        id: "fullAccuracy",
                        label: "100% Accuracy",
                        image: "fullAccuracy"
                    },
                    {
                        id: "fullAccuracy2",
                        label: "100% Accuracy",
                        image: "fullAccuracy"
                    },
                    {
                        id: "fullAccuracy3",
                        label: "100% Accuracy",
                        image: "fullAccuracy"
                    },
                    {
                        id: "memoryLoss",
                        label: "Memory Loss",
                        image: "memoryLoss"
                    }
                ]
            },

            {
                id: "mediumMemory",
                title: ">5bpm <10bpm Ractions",

                options: [
                    {
                        id: "mediumAccuracy",
                        label: "70% Accuracy",
                        image: "mediumAccuracy"
                    },
                    {
                        id: "fullAccuracy2",
                        label: "100% Accuracy",
                        image: "fullAccuracy"
                    },
                    {
                        id: "fullAccuracy3",
                        label: "100% Accuracy",
                        image: "fullAccuracy"
                    }
                ]
            },

            {
                id: "hardMemory",
                title: ">10bpm Reactions",

                options: [
                    {
                        id: "lowAccuracy",
                        label: "20% Accuracy",
                        image: "lowAccuracy"
                    },
                    {
                        id: "mediumAccuracy",
                        label: "70% Accuracy",
                        image: "mediumAccuracy"
                    },
                    {
                        id: "genius",
                        label: "100% Accuracy",
                        image: "genius"
                    }
                ]
            }
        ]
    },
    // SHAKE
    {
        id: "shake",
        title: "Shake",
        icon: "hands",
        columns: [
            {
                id: "hardShake",
                title: "Hard Shake Reactions",

                options: [
                    {
                        id: "vertigo",
                        label: "Vertigo",
                        image: "vertigo"
                    },
                    {
                        id: "unsteady",
                        label: "Unsteady",
                        image: "unsteady"
                    },
                    {
                        id: "neutral",
                        label: "Neutral",
                        image: "neutral"
                    },
                    {
                        id: "nausea",
                        label: "Nausea",
                        image: "nausea"
                    }
                ]
            },

            {
                id: "mediumShake",
                title: "Medium Shake Reactions",

                options: [
                    {
                        id: "unsteady",
                        label: "Unsteady",
                        image: "unsteady"
                    },
                    {
                        id: "annoyed",
                        label: "Annoyed",
                        image: "annoyed"
                    },
                    {
                        id: "neutral",
                        label: "Neutral",
                        image: "neutral"
                    },
                ]
            },

            {
                id: "lightShake",
                title: "Light Shake Reactions",

                options: [
                    {
                        id: "annoyed",
                        label: "Annoyed",
                        image: "annoyed"
                    },
                    {
                        id: "neutral",
                        label: "Neutral",
                        image: "neutral"
                    },
                    {
                        id: "neutral",
                        label: "Neutral",
                        image: "neutral"
                    }
                ]
            }
        ]
    }

];
let diagnosisMenu;
let menuOpen = false;
let currentCategory = "temperature";
let diagnosisGrid;


let decideButton;
let decisionMenu;
let decideMenuOpen = false;
let isTransitioning = false;
// console.log(diagnosisOptions[0]['temperature'])

function create() {
    // KEYBOARD KEYS
    enterKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.ENTER
    );

    // CREATE BACK SCENE
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'window').setScale(0.8);
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
        while (randomAiVisitor.isAi == true) {
            randomAiVisitor = visitors[Math.floor(Math.random() * visitors.length)];
        }
        // GIVE EACH AI VISITOR A RANDOM NAME FROM THE FAKE USER DATABASE
        let randomName = fakeUsersData[Math.floor(Math.random() * fakeUsersData.length)].name;
        // SOME VALUES OF THE NAMES ARE NULL SO MAKE SURE EVERYONE HAS A NAME
        while (randomName == null) {
            randomName = fakeUsersData[Math.floor(Math.random() * fakeUsersData.length)].name;
        }
        randomAiVisitor.isAi = true;
        randomAiVisitor.name = randomName;
        aiVisitors.push(randomAiVisitor);
    }



    console.log(visitors);
    // WHAT VISITOR NUMBER ARE WE AT
    visitorIndex = 0;

    diagnosisKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.D
    );


    // CREATE THE FRONT SCENE
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'reflection').setScale(0.8);
    this.add.image(this.scale.width / 2, this.scale.height / 2, 'bg').setScale(0.8);



    // LISTEN FOR ARDUINO SENSOR VALUES
    socket.on("sensorValue", (value) => {
        sensorValue = value;
    });
    // VISITOR TEXT
    visitorText = this.add.text(this.scale.width / 1.5, this.scale.height / 3, 'Hello', { fontSize: '32px', fill: '#ffffff' });

    // MENU
    createDiagnosisMenu.call(this)
    // TABS
    createDiagnosisTabs.call(this);
    // DECIDE BUTTON
    createDecideButton.call(this);
    // DECISION MENU
    createDecisionMenu.call(this);

}

function createDecideButton() {

    decideButton = this.add.container(60, 950);

    let background = this.add.rectangle(
        0,
        0,
        180,
        65,
        0xffffff
    );

    background.setOrigin(0, 0);

    background.setInteractive({
        useHandCursor: true
    });

    let text = this.add.text(
        90,
        32,
        "DECIDE",
        {
            fontSize: "28px",
            color: "#000000",
            fontStyle: "bold"
        }
    ).setOrigin(0.5);

    background.on("pointerdown", () => {

        openDecisionMenu.call(this);

    });

    decideButton.add([background, text]);

    // Keep the button above the rest of the game
    decideButton.setDepth(1000);

    // Keep it fixed to the screen
    decideButton.setScrollFactor(0);

    // Initially hidden
    decideButton.setVisible(false);

}
function createDecisionMenu() {

    decisionMenu = this.add.container(60, 750);

    let background = this.add.rectangle(
        0,
        0,
        300,
        180,
        0x24202b
    );

    background.setOrigin(0, 0);

    let title = this.add.text(
        20,
        15,
        "CHOOSE CHARACTER TYPE",
        {
            fontSize: "18px",
            color: "#ffffff",
            fontStyle: "bold"
        }
    );

    // HUMAN BUTTON
    let humanButton = this.add.rectangle(
        150,
        75,
        240,
        45,
        0xffffff
    );

    humanButton.setInteractive({
        useHandCursor: true
    });

    let humanText = this.add.text(
        150,
        75,
        "HUMAN",
        {
            fontSize: "20px",
            color: "#000000"
        }
    ).setOrigin(0.5);

    // AI BUTTON
    let aiButton = this.add.rectangle(
        150,
        135,
        240,
        45,
        0xffffff
    );

    aiButton.setInteractive({
        useHandCursor: true
    });

    let aiText = this.add.text(
        150,
        135,
        "AI",
        {
            fontSize: "20px",
            color: "#000000"
        }
    ).setOrigin(0.5);

    // Button interactions

    humanButton.on("pointerdown", () => {

        decideVisitorType.call(this, false);


    });

    aiButton.on("pointerdown", () => {

        decideVisitorType.call(this, true);

    });

    decisionMenu.add([
        background,
        title,
        humanButton,
        humanText,
        aiButton,
        aiText
    ]);

    decisionMenu.setDepth(1001);

    decisionMenu.setScrollFactor(0);

    decisionMenu.setVisible(false);

}
function openDecisionMenu() {

    if (isTransitioning) return;
    decideMenuOpen = !decideMenuOpen;
    if (decideMenuOpen) {
        decisionMenu.setVisible(decideMenuOpen);

        this.tweens.add({
            targets: decisionMenu,
            alpha: 1,
            duration: 200,
            ease: "Sine.easeOut"
        });
    }
    else {
        decisionMenu.setVisible(decideMenuOpen);

        this.tweens.add({
            targets: decisionMenu,
            alpha: 0,
            duration: 200,
            ease: "Sine.easeOut"
        });
    }


}
function decideVisitorType(AiDiagnosis) {
    if (isTransitioning || typeof activeVisitor == 'undefined') return;
    // toggleDiagnosisMenu();
    isTransitioning = true;
    toggleDiagnosisMenu.call(this);
    // Save the character's classification
    activeVisitor.AiDiagnosis = AiDiagnosis;

    // Hide the decision menu
    decisionMenu.setVisible(false);

    // Hide the decide button
    decideButton.setVisible(false);

    // Determine where the character should move
    let targetX;

    if (AiDiagnosis === true) {

        // Return to original position
        targetX = activeVisitor.initialX;

    } else {

        // Move beyond the right edge of the canvas
        targetX = this.scale.width;
        // +
        //     activeVisitor.sprite.displayWidth / 2
    }

    // Move the character
    moveVisitor.call(this, targetX);


}


function moveVisitor(targetX) {

    let visitor = activeVisitor;

    // Stop any previous movement tween
    if (visitor.movementTween) {
        visitor.movementTween.stop();
    }

    // Calculate duration based on distance
    let distance = Math.abs(targetX - visitor.sprite.x);

    let duration = distance / 300 * 1000;

    visitor.movementTween = this.tweens.add({

        targets: visitor.sprite,

        x: targetX,

        duration: duration,

        ease: "Linear",

        onComplete: () => {

            // Move to the next character after animation
            changeactiveVisitor.call(this);

        }

    });

}
function changeactiveVisitor() {

    // Deactivate the previous character
    activeVisitor.deactivate();

    // Move to the next player in the array
    visitorIndex++;
    console.log(visitorIndex);
    console.log(visitors.indexOf(activeVisitor));
    // Set visitor index to null once the max visitor is reached
    if (visitorIndex >= visitors.length) {
        visitorIndex = null;
    }

    // // Set the new active player
    // activeVisitor = visitors[visitorIndex];

    // activeVisitor.activate();

    // Update the diagnosis menu
    updateDiagnosisBorders.call(this);

    // Update the DECIDE button
    updateDecideButton();

    isTransitioning = false;

}
/**
 * CREATE DIAGNOSIS MENU
 */
function createDiagnosisMenu() {


    // Create the main menu container.
    // It starts outside the screen on the right.
    diagnosisMenu = this.add.container(1920, 0);

    // Create the menu background
    let background = this.add.rectangle(
        0, 0,
        850, 1080,
        0x24202b
    );

    background.setOrigin(0, 0);

    // Add background to the menu
    diagnosisMenu.add(background);


    // Create the menu title
    let title = this.add.text(
        30, 30,
        "DIAGNOSIS MENU",
        {
            fontSize: "48px",
            color: "#ffffff",
            fontStyle: "bold"
        }
    );

    diagnosisMenu.add(title);


    // Create a separate container for diagnosis options.
    // This allows us to replace the options when switching tabs
    // without destroying the background or category icons.
    diagnosisGrid = this.add.container(0, 0);

    diagnosisMenu.add(diagnosisGrid);


    // Create the three category tabs
    createDiagnosisTabs.call(this);


    // Set Temperature as the default category
    currentCategory = "temperature";

    // Display the Temperature diagnosis options initially
    createDiagnosisColumns.call(this);

}
/**
 * CREATE DIAGNOSIS MENU TABS
 */
function createDiagnosisTabs() {

    const tabIcons = [
        {
            id: "temperature",
            image: "thermometer"
        },
        {
            id: "memory",
            image: "brain"
        },
        {
            id: "shake",
            image: "hands"
        }
    ];

    tabIcons.forEach((tab, index) => {

        let x = 100 + index * 250;

        let icon = this.add.image(
            x,
            130,
            tab.image
        );

        icon.setDisplaySize(80, 80);

        icon.setInteractive({
            useHandCursor: true
        });

        icon.on("pointerdown", () => {

            switchDiagnosisMenu.call(this, tab.id);

        });

        diagnosisMenu.add(icon);

    });

}

function switchDiagnosisMenu(categoryId) {

    currentCategory = categoryId;

    createDiagnosisColumns.call(this);

}

/**
 * CREATE DIAGNOSIS COLUMNS
 */
function createDiagnosisColumns() {

    // Get the currently selected category
    let category = diagnosisOptions.find(
        item => item.id === currentCategory
    );

    // Clear the previous diagnosis buttons
    diagnosisGrid.removeAll(true);

    // Reset the button references
    diagnosisButtons = [];

    // Loop through the columns belonging to this category
    category.columns.forEach((column, columnIndex) => {

        const columnWidth = 250;
        const startX = 30;
        const startY = 250;

        // Calculate horizontal position
        const columnX = startX + columnIndex * 270;

        // Create column heading
        let heading = this.add.text(
            columnX,
            startY,
            column.title,
            {
                fontSize: "18px",
                color: "#ffffff",
                wordWrap: {
                    width: columnWidth
                }
            }
        ).setOrigin(0, 0);

        diagnosisGrid.add(heading);

        // Loop through the diagnosis options in this column
        column.options.forEach((option, optionIndex) => {

            const optionY = startY + 80 + optionIndex * 190;

            createDiagnosisOption.call(
                this,
                column,
                option,
                columnX,
                optionY
            );

        });

    });

    // Restore the active player's selections
    updateDiagnosisBorders.call(this);

}

function createDiagnosisOption(column, option, x, y) {

    // Create a container for the diagnosis option
    let optionContainer = this.add.container(x, y);

    // Diagnosis image
    let image = this.add.image(110, 70, option.image);

    image.setDisplaySize(130, 130);

    // Diagnosis label background
    let labelBackground = this.add.rectangle(
        110,
        150,
        180,
        35,
        0x000000
    );

    // Diagnosis label
    let label = this.add.text(
        110,
        150,
        option.label,
        {
            fontSize: "18px",
            color: "#ffffff"
        }
    ).setOrigin(0.5);

    // Selection border
    let border = this.add.rectangle(
        110,
        70,
        140,
        140
    );

    border.setStrokeStyle(4, 0xffff00);
    border.setVisible(false);

    diagnosisButtons.push({

        categoryId: currentCategory,

        columnId: column.id,

        diagnosisId: option.id,

        border: border

    });

    // Make the image interactive
    image.setInteractive({
        useHandCursor: true
    });


    // CALL SELECT DIAGNOSIS
    image.on("pointerdown", () => {

        selectDiagnosis.call(
            this,
            column.id,
            option.id
        );

    });

    optionContainer.add([
        image,
        labelBackground,
        label,
        border
    ]);

    diagnosisGrid.add(optionContainer);

    // Store reference to the border for later updates
    option.border = border;

}

function selectDiagnosis(columnId, diagnosisId) {

    if (typeof activeVisitor == 'undefined' || !activeVisitor.ready || isTransitioning) {
        return;
    }

    if (!activeVisitor || isTransitioning) {
        return;
    }

    activeVisitor.userDiagnoses[currentCategory][columnId] = diagnosisId;

    updateDiagnosisBorders.call(this);

    updateDecideButton();

}

function updateDecideButton() {

    // If there is no active player, hide the button
    if (visitors.indexOf(activeVisitor) !== visitorIndex) {
        decideButton.setVisible(false);
        return;
    }

    let hasDiagnosis = false;

    // Loop through all diagnosis categories
    for (let category in activeVisitor.userDiagnoses) {

        // Loop through the diagnoses in each category
        for (let diagnosis in activeVisitor.userDiagnoses[category]) {

            // Check if at least one diagnosis has been selected
            if (activeVisitor.userDiagnoses[category][diagnosis] !== null) {

                hasDiagnosis = true;
                break;

            }
        }

        // No need to check other categories if one was found
        if (hasDiagnosis) {
            break;
        }
    }

    // Show or hide the DECIDE button
    decideButton.setVisible(hasDiagnosis);

}


function updateDiagnosisBorders() {

    diagnosisButtons.forEach(button => {
        if (visitors.indexOf(activeVisitor) == visitorIndex) {
            let selectedDiagnosis =
                activeVisitor.userDiagnoses[button.categoryId][button.columnId];

            button.border.setVisible(
                selectedDiagnosis === button.diagnosisId
            );
        }
        else {
            button.border.setVisible(false);
        }

    });

}

function toggleDiagnosisMenu() {

    menuOpen = !menuOpen;

    if (menuOpen) {

        // Refresh borders for the currently active player
        updateDiagnosisBorders.call(this);

        this.tweens.add({
            targets: diagnosisMenu,
            x: this.scale.width - 850,
            duration: 400,
            ease: "Cubic.easeOut"
        });

    } else {

        this.tweens.add({
            targets: diagnosisMenu,
            x: this.scale.width,
            duration: 400,
            ease: "Cubic.easeIn"
        });

    }

}

function update() {
    if (typeof activeVisitor !== 'undefined' && activeVisitor.ready) {
        if (Phaser.Input.Keyboard.JustDown(diagnosisKey)) {

            toggleDiagnosisMenu.call(this);

        }
    }

    // ACTIVATE THE CURRENT VISITOR
    if (Phaser.Input.Keyboard.JustDown(enterKey)) {
        for (let visitor of visitors) {
            if (visitors.indexOf(visitor) == visitorIndex && !visitor.isActive) {
                visitor.activate();
                activeVisitor = visitor;
                // for (let diagnoses of activeVisitor.userDiagnoses) {
                //     Object.keys(diagnoses).forEach(key => {
                //         diagnoses[key] = null;
                //     });;
                // }
                for (let category in activeVisitor.userDiagnoses) {

                    for (let diagnosis in activeVisitor.userDiagnoses[category]) {

                        activeVisitor.userDiagnoses[category][diagnosis] = null;

                    }

                }
                activeVisitor.bobbing();
                activeVisitor.moveTo(visitorTargetPosX);
                console.log(activeVisitor.userDiagnoses);

            }
        }
    }
    if (typeof activeVisitor !== 'undefined' && activeVisitor.sprite.x >= visitorTargetPosX && !activeVisitor.ready) {
        activeVisitor.stopBobbing();
        console.log(activeVisitor.userDiagnoses[0])
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