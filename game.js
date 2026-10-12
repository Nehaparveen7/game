import {
    setCollisionObjects,
    resetPlayerLook
} from "./player.js";

import {
    generatePuzzle
} from "./puzzle.js";

import {
    getTarget,
    getTargetAtScreen
} from "./interaction.js";

import {
    resetInventory,
    addItem,
    getInventory
} from "./inventory.js";

import {
    createRoom
} from "./rooms.js";


let scene;
let camera;
let renderer;

let currentRoom = 0;
let currentRoomGroup = null;

let gameStarted = false;
let gamePaused = false;
let gameOver = false;
let gameWon = false;

let timeLeft = 20 * 60;


const roomNames = [
    "Study",
    "Laboratory",
    "Security Room",
    "Final Escape"
];


const roomProgress = [

    // ROOM 0
    {
        paperFound: false,
        usbFound: false,
        usbInserted: false,
        puzzleSolved: false,
        password: null,
        currentPuzzle: null
    },

    // ROOM 1

    {
        paperFound: false,
        usbFound: false,
        usbInserted: false,
        puzzleSolved: false,
        password: null,
        currentPuzzle: null
    },
    {
    clueFound: false,
    microscopeFound: false,
    testTubeFound: false,
    noteFound: false,

    microscopeNumber: null,
    testTubeNumber: null,
    noteNumber: null,

    numbersEntered: false,
    puzzleSolved: false,
    password: "379"
},

    // ROOM 2
    {
        clueFound: false,
        camera1Found: false,
        camera2Found: false,
        camera3Found: false,
        puzzleSolved: false,
        password: "231",
        currentPuzzle: null
    },

    // ROOM 3
    {
        puzzleSolved: false,
        password: "1010"
    }

];


// =====================================================
// INIT
// =====================================================

export function initGame(
    gameScene,
    gameCamera,
    gameRenderer
) {

    scene =
        gameScene;

    camera =
        gameCamera;

    renderer =
        gameRenderer;


    resetInventory();

    resetRoomProgress();


    gameStarted =
        false;

    gamePaused =
        false;

    gameOver =
        false;

    gameWon =
        false;


    currentRoom =
        0;

    timeLeft =
        20 * 60;


    hideGameUI();

    setupButtons();

}


// =====================================================
// START
// =====================================================

export function startGame() {

    resetInventory();

    resetRoomProgress();


    currentRoom =
        0;

    timeLeft =
        20 * 60;


    gameStarted =
        true;

    gamePaused =
        false;

    gameOver =
        false;

    gameWon =
        false;


    const gameUI =
        document.getElementById(
            "gameUI"
        );

    if (gameUI) {

        gameUI.style.display =
            "block";

    }


    const controls =
        document.getElementById(
            "controls"
        );

    if (controls) {

        controls.style.display =
            "block";

    }


    loadRoom(0);

    updateTimer();

}


// =====================================================
// RESET PROGRESS
// =====================================================

function resetRoomProgress() {

    roomProgress[0] = {
        paperFound: false,
        usbFound: false,
        usbInserted: false,
        puzzleSolved: false,
        password: null,
        currentPuzzle: null
    };


    roomProgress[1] = {
        clueFound: false,
        microscopeFound: false,
        testTubeFound: false,
        noteFound: false,
        puzzleSolved: false,
        password: "379"
    };


    roomProgress[2] = {
        clueFound: false,
        camera1Found: false,
        camera2Found: false,
        camera3Found: false,
        puzzleSolved: false,
        password: "231",
        currentPuzzle: null
    };


    roomProgress[3] = {
        puzzleSolved: false,
        password: "1010"
    };

}


// =====================================================
// LOAD ROOM
// =====================================================

function loadRoom(
    roomNumber
) {

    if (currentRoomGroup) {

        scene.remove(
            currentRoomGroup
        );

    }


    currentRoom =
        roomNumber;


    currentRoomGroup =
        createRoom(
            roomNumber
        );


    scene.add(
        currentRoomGroup
    );


    updateRoomName();


    camera.position.set(
        0,
        2.2,
        7.2
    );


    camera.rotation.set(
        0,
        0,
        0
    );


    closePuzzlePanel();


    showInteractionMessage(
        `You entered the ${roomNames[roomNumber]}.`
    );

}


// =====================================================
// GET INTERACTIVE OBJECTS
// =====================================================

function getInteractiveObjects() {

    const objects = [];


    if (!currentRoomGroup) {

        return objects;

    }


    currentRoomGroup.traverse(
        object => {

            if (
                object.userData &&
                object.userData.type
            ) {

                objects.push(
                    object
                );

            }

        }
    );


    return objects;

}


// =====================================================
// E / INTERACT BUTTON
// =====================================================

export function interact() {

    if (
        !gameStarted ||
        gamePaused ||
        gameOver ||
        gameWon
    ) {

        return;

    }


    const objects =
        getInteractiveObjects();


    const target =
        getTarget(
            camera,
            objects
        );


    if (!target) {

        showInteractionMessage(
            "Look at an object to interact."
        );

        return;

    }


    handleInteraction(
        target
    );

}


// =====================================================
// DIRECT CLICK / TAP
// =====================================================

export function interactAt(
    clientX,
    clientY
) {

    if (
        !gameStarted ||
        gamePaused ||
        gameOver ||
        gameWon
    ) {

        return;

    }


    const objects =
        getInteractiveObjects();


    const target =
        getTargetAtScreen(
            camera,
            objects,
            clientX,
            clientY,
            renderer.domElement
        );


    if (!target) {

        return;

    }


    handleInteraction(
        target
    );

}


// =====================================================
// HANDLE INTERACTION
// =====================================================

function handleInteraction(
    object
) {

    if (!object) {

        return;

    }


    const type =
        object.userData.type;


    // =================================================
    // STUDY
    // =================================================

    if (
        currentRoom === 0
    ) {

        if (
            type === "paper"
        ) {

            openStudyPaper();

            return;

        }


        if (
            type === "usb" ||
            type === "insertedUSB"
        ) {

            insertUSBIntoLaptop(
                object
            );

            return;

        }


        if (
            type === "laptop"
        ) {

            useLaptop();

            return;

        }


        if (
            type === "door"
        ) {

            openDoorLock();

            return;

        }

    }


    // =================================================
    // LABORATORY
    // =================================================

    if (
        currentRoom === 1
    ) {

        if (
            type === "labClue" ||
            type === "clue"
        ) {

            openLabClue();

            return;

        }


        if (
            type === "labObject"
        ) {

            inspectLabObject(
                object
            );

            return;

        }


        if (
            type === "labTerminal" ||
            type === "computer"
        ) {

            openLabTerminal();

            return;

        }


        if (
            type === "door"
        ) {

            openDoorLock();

            return;

        }

    }


    // =================================================
    // SECURITY ROOM
    // =================================================

    if (
        currentRoom === 2
    ) {

        if (
            type === "securityClue" ||
            type === "clue"
        ) {

            openSecurityLog();

            return;

        }


        if (
            type === "monitor"
        ) {

            inspectSecurityCamera(
                object
            );

            return;

        }


        if (
            type === "securityComputer" ||
            type === "computer"
        ) {

            openSecurityTerminal();

            return;

        }


        if (
            type === "door"
        ) {

            openDoorLock();

            return;

        }

    }


    // =================================================
    // FINAL ESCAPE
    // =================================================

    if (
        currentRoom === 3
    ) {

        if (
            type === "finalTerminal"
        ) {

            openFinalPuzzle();

            return;

        }


        if (
            type === "door"
        ) {

            openDoorLock();

            return;

        }

    }

}


// =====================================================
// STUDY PAPER
// =====================================================

function openStudyPaper() {
    const progress = roomProgress[0];

    progress.paperFound = true;

    if (!getInventory().includes("Paper Chit")) {
        addItem("Paper Chit");
    }

    updateInventory();

    showPuzzleMessage(
        "📄 PAPER CHIT",
        "INSERT AND GAIN THE KEY.\n\nThere is something on the desk that looks like it belongs in the laptop.",
        "📄"
    );
}


// =====================================================
// USB
// =====================================================

function insertUSBIntoLaptop(usb) {
    const progress = roomProgress[0];

    if (!usb || !currentRoomGroup) {
        showInteractionMessage("USB drive not found. Try again.");
        return;
    }

    if (progress.usbInserted) {
        showInteractionMessage("The USB is already inserted into the laptop.");
        return;
    }

    // Mark the USB as collected
    progress.usbFound = true;

    if (!getInventory().includes("USB Drive")) {
        addItem("USB Drive");
    }

    updateInventory();

    // Find the laptop in the current room
    let laptop = null;

    currentRoomGroup.traverse((object) => {
        if (
            object.userData &&
            object.userData.type === "laptop"
        ) {
            laptop = object;
        }
    });

    if (!laptop) {
        showInteractionMessage("Laptop not found in this room.");
        return;
    }

    // Attach the USB to the laptop
    laptop.add(usb);

    usb.position.set(1.0, 0.16, 0.05);
    usb.rotation.set(0, 0, 0);
    usb.userData.type = "insertedUSB";

    progress.usbInserted = true;

    // Turn on the laptop screen
    turnOnLaptop();

    // Show a confirmation that stays until Continue is clicked
    showPuzzleMessage(
        "USB INSERTED",
        "The USB drive has been connected successfully. The laptop is ready to reveal the next challenge.",
        "🔌"
    );

    const puzzleBox = document.getElementById("puzzleBox");

    if (!puzzleBox) {
        console.error("Could not find the puzzleBox element.");
        return;
    }

    // Prevent duplicate Continue buttons
    const oldButton = document.getElementById("usbContinueButton");

    if (oldButton) {
        oldButton.remove();
    }

    const continueButton = document.createElement("button");

    continueButton.id = "usbContinueButton";
    continueButton.textContent = "CONTINUE";

    continueButton.style.marginTop = "15px";
    continueButton.style.padding = "12px 25px";
    continueButton.style.border = "none";
    continueButton.style.borderRadius = "5px";
    continueButton.style.background = "#c49a63";
    continueButton.style.color = "#111";
    continueButton.style.fontWeight = "bold";
    continueButton.style.cursor = "pointer";

    puzzleBox.appendChild(continueButton);

    continueButton.addEventListener("click", () => {
        continueButton.remove();
        closePuzzlePanel();
        openStudyPuzzle();
    });
}

// =====================================================
// LAPTOP LIGHT
// =====================================================

function turnOnLaptop() {

    if (!currentRoomGroup) {

        return;

    }


    currentRoomGroup.traverse(
        object => {

            if (
                object.userData &&
                object.userData.type ===
                "laptopScreen"
            ) {

                if (
                    object.material &&
                    object.material.emissive
                ) {

                    object.material.emissive
                        .setHex(
                            0x063b55
                        );


                    object.material
                        .emissiveIntensity =
                        1.5;

                }

            }

        }
    );

}


// =====================================================
// LAPTOP
// =====================================================

function useLaptop() {

    const progress =
        roomProgress[0];


    if (
        !progress.usbInserted
    ) {

        showPuzzleMessage(
            "💻 LAPTOP LOCKED",
            "Insert the USB drive first.",
            "🔒"
        );

        return;

    }


    openStudyPuzzle();

}


// =====================================================
// STUDY PUZZLE
// =====================================================

function openStudyPuzzle() {
    const progress = roomProgress[0];

    if (progress.puzzleSolved) {
        showPuzzleMessage(
            "PUZZLE SOLVED",
            "You have already solved this challenge.",
            "✅"
        );

        return;
    }

    if (!progress.currentPuzzle) {
        progress.currentPuzzle = generatePuzzle();
    }

    openPuzzlePanel(
        progress.currentPuzzle,
        0
    );
}


// =====================================================
// LAB CLUE
// =====================================================

function openLabClue() {
    roomProgress[1].clueFound = true;

    console.log(
        "Laboratory clue read:",
        roomProgress[1].clueFound
    );

    showPuzzleMessage(
        "🔬 LABORATORY CLUE",
        "Three objects contain hidden numbers.\n\nFind the Microscope, Test Tube and Computer Note.\n\nThe smallest comes first.\nThe largest comes last.\nThe remaining number stays between.",
        "🔬"
    );
}


// =====================================================
// LAB OBJECT
// =====================================================

function inspectLabObject(object) {
    const progress = roomProgress[1];

    const number = object.userData.number;
    const name = object.userData.name || "Unknown Object";

    if (name === "Microscope") {
        progress.microscopeFound = true;
        progress.microscopeNumber = number;
    }

    if (name === "Test Tube") {
        progress.testTubeFound = true;
        progress.testTubeNumber = number;
    }

    if (name === "Computer Note") {
        progress.noteFound = true;
        progress.noteNumber = number;
    }

    showPuzzleMessage(
        `🔎 ${name}`,
        `You found a hidden number:\n\n${number}\n\nRemember it and inspect the other objects!`,
        "🔎"
    );
}


// =====================================================
// LAB TERMINAL
// =====================================================

function openLabTerminal() {
    const progress = roomProgress[1];

    if (currentRoom !== 1) return;

    if (!progress.clueFound) {
        showPuzzleMessage(
            "🔒 TERMINAL LOCKED",
            "Read the Laboratory clue first!",
            "🔒"
        );
        return;
    }

    if (progress.puzzleSolved) {
        showPuzzleMessage(
            "✅ LABORATORY COMPLETE",
            "You have already solved the laboratory puzzle.\n\nYour door password is 379.",
            "✅"
        );
        return;
    }

    if (
        !progress.microscopeFound ||
        !progress.testTubeFound ||
        !progress.noteFound
    ) {
        showPuzzleMessage(
            "🔬 LABORATORY TERMINAL",
            "Before using this terminal, inspect all three objects:\n\n🔭 Microscope\n🧪 Test Tube\n📝 Computer Note\n\nEach contains a hidden number.",
            "🔬"
        );
        return;
    }

    const puzzle = {
        title: "LABORATORY TERMINAL",
        question:
            `Enter the three numbers you discovered.\n\n` +
            `Microscope: ${progress.microscopeNumber}\n` +
            `Test Tube: ${progress.testTubeNumber}\n` +
            `Computer Note: ${progress.noteNumber}\n\n` +
            `Enter all three numbers together, in any order.`,
        clue: "You must identify all three numbers before arranging them.",
        answer: [
            progress.microscopeNumber,
            progress.testTubeNumber,
            progress.noteNumber
        ].map(String).sort().join(""),
        icon: "💻"
    };

    openPuzzlePanel(puzzle, 1);
}

// =====================================================
// SECURITY LOG
// =====================================================

function openSecurityLog() {

    roomProgress[2]
        .clueFound =
        true;


    showPuzzleMessage(
        "📋 SECURITY LOG",
        "Three people entered the building.\n\nA entered at 09:15.\nB entered at 09:30.\nC entered at 09:45.\n\nThe person who entered LAST used Camera 1.\nThe person who entered FIRST used Camera 2.\n\nInspect Cameras 1, 2 and 3.",
        "📋"
    );

}


// =====================================================
// SECURITY CAMERA
// =====================================================

function inspectSecurityCamera(
    object
) {

    const progress =
        roomProgress[2];


    const cameraNumber =
        object.userData.cameraNumber;


    if (
        cameraNumber === 1
    ) {

        progress.camera1Found =
            true;


        showPuzzleMessage(
            "📹 CAMERA 1",
            "Camera 1 detected Person C.\n\nPerson C entered at 09:45.",
            "📹"
        );

        return;

    }


    if (
        cameraNumber === 2
    ) {

        progress.camera2Found =
            true;


        showPuzzleMessage(
            "📹 CAMERA 2",
            "Camera 2 detected Person A.\n\nPerson A entered at 09:15.",
            "📹"
        );

        return;

    }


    if (
        cameraNumber === 3
    ) {

        progress.camera3Found =
            true;


        showPuzzleMessage(
            "📹 CAMERA 3",
            "Camera 3 detected Person B.\n\nPerson B entered at 09:30.",
            "📹"
        );

        return;

    }


    showPuzzleMessage(
        "📺 CAMERA 4",
        "Nothing useful here.\n\nJust static.",
        "📺"
    );

}


// =====================================================
// SECURITY TERMINAL
// =====================================================

function openSecurityTerminal() {

    const progress =
        roomProgress[2];


    if (
        !progress.clueFound
    ) {

        showPuzzleMessage(
            "🔒 TERMINAL LOCKED",
            "Read the Security Log first.",
            "🔒"
        );

        return;

    }


    if (
        !progress.camera1Found ||
        !progress.camera2Found ||
        !progress.camera3Found
    ) {

        showPuzzleMessage(
            "🔒 TERMINAL LOCKED",
            "Inspect Cameras 1, 2 and 3 first.",
            "🔒"
        );

        return;

    }


    if (
        progress.puzzleSolved
    ) {

        showInteractionMessage(
            "Security puzzle already solved."
        );

        return;

    }


    const puzzle = {
    title: "CCTV DEDUCTION",
    question: "Determine the correct 3-digit security code using the entry times and CCTV footage.",
    clue: "Inspect the security log and all three relevant camera feeds. Order the entries from earliest to latest.",
    answer: "231",
    icon: "📹"
};


    roomProgress[2]
        .currentPuzzle =
        puzzle;


    openPuzzlePanel(
        puzzle,
        2
    );

}


// =====================================================
// FINAL PUZZLE
// =====================================================

function openFinalPuzzle() {

    const progress =
        roomProgress[3];


    if (
        progress.puzzleSolved
    ) {

        showInteractionMessage(
            "Final puzzle already solved."
        );

        return;

    }


    const puzzle = {

        title:
            "🏁 FINAL CHALLENGE",

        question:
            "The final terminal asks:\n\nWhat is the binary representation of the decimal number 10?",

        clue:
            "Computers use only 0 and 1.\n\nThink about powers of 2.",

        answer:
            "1010",

        icon:
            "💻"

    };


    openPuzzlePanel(
        puzzle,
        3
    );

}


// =====================================================
// PUZZLE PANEL
// =====================================================


function openPuzzlePanel(puzzle, roomNumber) {
    const panel = document.getElementById("puzzlePanel");

    if (!panel) return;

    panel.style.display = "flex";

    document.getElementById("puzzleIcon").textContent =
        puzzle.icon || "🧩";

    document.getElementById("puzzleTitle").textContent =
        puzzle.title || "Puzzle";

    const description =
        document.getElementById("puzzleDescription");

    description.textContent =
        puzzle.question || puzzle.description || "Solve the puzzle.";

    description.style.whiteSpace = "pre-line";

    document.getElementById("puzzleClue").textContent =
        puzzle.clue || "";

    const input = document.getElementById("puzzleAnswer");

    // Show the answer field for actual puzzles
    input.style.display = "block";
    input.value = "";
    input.type = "text";
    input.placeholder = "Enter your answer...";

    document.getElementById("puzzleMessage").textContent = "";

    const submit = document.getElementById("submitPuzzle");

    // Show Submit for actual puzzles
    submit.style.display = "block";

    submit.onclick = () => {
        const answer = input.value.trim();

        checkPuzzleAnswer(answer, puzzle, roomNumber);
    };
}

// =====================================================
// CHECK ANSWER
// =====================================================

function checkPuzzleAnswer(answer, puzzle, roomNumber) {
    const message = document.getElementById("puzzleMessage");
    const progress = roomProgress[roomNumber];

    // LABORATORY: FIRST STAGE — identify all three numbers
    if (roomNumber === 1 && !progress.numbersEntered) {
        const expectedNumbers = [
            progress.microscopeNumber,
            progress.testTubeNumber,
            progress.noteNumber
        ].map(String).sort().join("");

        const enteredNumbers = answer.replace(/\D/g, "").split("").sort().join("");

        if (enteredNumbers !== expectedNumbers) {
            message.textContent =
                "❌ Incorrect numbers. Check the three objects and try again.";
            message.style.color = "#ff5555";
            return;
        }

        progress.numbersEntered = true;

        showPuzzleMessage(
            "🔢 STAGE 2: ARRANGE THE NUMBERS",
            "Correct! You found all three numbers.\n\nArrange them from SMALLEST to LARGEST.\n\nEnter the three-digit code.",
            "🔢"
        );

        const input = document.getElementById("puzzleAnswer");
        const submit = document.getElementById("submitPuzzle");

        input.style.display = "block";
        input.value = "";
        input.placeholder = "Smallest to largest...";
        input.focus();

        submit.style.display = "block";

        submit.onclick = () => {
            checkPuzzleAnswer(
                input.value.trim(),
                {
                    answer: [
                        progress.microscopeNumber,
                        progress.testTubeNumber,
                        progress.noteNumber
                    ]
                        .map(Number)
                        .sort((a, b) => a - b)
                        .join("")
                },
                1
            );
        };

        return;
    }

    // CHECK THE ANSWER
    const correct =
        answer.trim().toLowerCase() ===
        String(puzzle.answer).trim().toLowerCase();

    if (!correct) {
        message.textContent = "❌ Incorrect. Try again.";
        message.style.color = "#ff5555";
        return;
    }

    // MARK THE PUZZLE AS SOLVED
    progress.puzzleSolved = true;

    if (roomNumber === 0) {
        progress.password = generatePassword();

        console.log(
            "Study Room Access Code:",
            progress.password
        );
    }

    if (roomNumber === 1) {
        progress.password = "379";
    }

    if (roomNumber === 2) {
        progress.password = "231";
    }

    if (roomNumber === 3) {
        progress.password = "1010";
    }

    message.textContent = "✓ PUZZLE SOLVED!";
    message.style.color = "#59ff9a";

    setTimeout(() => {
        closePuzzlePanel();

        if (roomNumber === 3) {
            showPuzzleMessage(
                "🎉 FINAL PUZZLE SOLVED",
                "The final terminal has accepted the code.\n\nThe EXIT is now unlocked.\n\nClick the EXIT door to escape!",
                "🔓"
            );

            return;
        }

        showPuzzleMessage(
            "🔐 ACCESS CODE",
            `Puzzle solved!\n\nYour door access code is:\n\n${progress.password}\n\nEnter it at the digital lock.`,
            "🔐"
        );
    }, 1000);
}


// =====================================================
// PASSWORD GENERATOR
// =====================================================

function generatePassword() {

    return String(
        Math.floor(
            1000 +
            Math.random() * 9000
        )
    );

}


// =====================================================
// DOOR LOCK
// =====================================================

function openDoorLock() {

    const progress =
        roomProgress[
            currentRoom
        ];


    // FINAL EXIT

    if (
        currentRoom === 3
    ) {

        if (
            progress.puzzleSolved
        ) {

            winGame();

        } else {

            showPuzzleMessage(
                "🔒 FINAL EXIT",
                "Solve the final terminal puzzle first.",
                "🔒"
            );

        }

        return;

    }


    // NORMAL ROOMS

    if (
        !progress.puzzleSolved
    ) {

        showPuzzleMessage(
            "🔒 DIGITAL LOCK",
            "Solve the room's puzzle first.",
            "🔒"
        );

        return;

    }


    const panel =
        document.getElementById(
            "puzzlePanel"
        );


    panel.style.display =
        "flex";


    document.getElementById(
        "puzzleIcon"
    ).textContent =
        "🔐";


    document.getElementById(
        "puzzleTitle"
    ).textContent =
        "DIGITAL DOOR LOCK";


    document.getElementById(
        "puzzleDescription"
    ).textContent =
        "Enter the access code you received after solving the puzzle.";


    document.getElementById(
        "puzzleClue"
    ).textContent =
        "ACCESS CODE REQUIRED";


    const input = document.getElementById("puzzleAnswer");

input.style.display = "block";
input.disabled = false;
input.readOnly = false;
input.type = "text";
input.value = "";

input.placeholder =
    currentRoom === 2
        ? "Enter 3-digit code"
        : "Enter access code";

input.focus();


    const message =
        document.getElementById(
            "puzzleMessage"
        );


    message.textContent =
        "";


    const submit =
        document.getElementById(
            "submitPuzzle"
        );


    submit.style.display =
        "block";
    submit.disabled = false;


    submit.onclick =
        () => {

            const entered =
                input.value
                    .trim();


            if (
                entered ===
                String(
                    progress.password
                )
            ) {

                unlockDoor();

            } else {

                message.textContent =
                    "❌ ACCESS DENIED";

                message.style.color =
                    "#ff5555";

            }

        };

}


// =====================================================
// UNLOCK DOOR
// =====================================================

function unlockDoor() {

    closePuzzlePanel();


    showPuzzleMessage(
        "🚪 ACCESS GRANTED",
        "The digital lock has been disabled.\n\nThe door is opening...",
        "🔓"
    );


    setTimeout(
        () => {

            if (
                currentRoom < 3
            ) {

                loadRoom(
                    currentRoom + 1
                );

                setCollisionObjects(currentRoomGroup);
resetPlayerLook(camera);

            } else {

                winGame();

            }

        },
        1500
    );

}


// =====================================================
// MESSAGE PANEL
// =====================================================

function showPuzzleMessage(title, message, icon = "ℹ️") {
    const panel = document.getElementById("puzzlePanel");
    if (!panel) return;

    panel.style.display = "flex";

    document.getElementById("puzzleIcon").textContent = icon;
    document.getElementById("puzzleTitle").textContent = title;

    const description = document.getElementById("puzzleDescription");
    description.textContent = message;
    description.style.whiteSpace = "pre-line";

    const input = document.getElementById("puzzleAnswer");
    input.style.display = "none";
    input.value = "";

    const submit = document.getElementById("submitPuzzle");
    submit.style.display = "none";

    document.getElementById("puzzleClue").textContent = "";
    document.getElementById("puzzleMessage").textContent = "";
}

// =====================================================
// CLOSE PUZZLE
// =====================================================

export function closePuzzlePanel() {
    const panel = document.getElementById("puzzlePanel");

    if (panel) {
        panel.style.display = "none";
    }
}


// =====================================================
// HINT
// =====================================================

export function showHint() {

    if (!gameStarted) {

        return;

    }


    // STUDY

    if (
        currentRoom === 0
    ) {

        const progress =
            roomProgress[0];


        if (
            !progress.paperFound
        ) {

            showInteractionMessage(
                "Hint: Find and read the paper chit."
            );

        }

        else if (
            !progress.usbInserted
        ) {

            showInteractionMessage(
                "Hint: Insert the USB drive into the laptop."
            );

        }

        else {

            showInteractionMessage(
                "Hint: Solve the encrypted laptop puzzle."
            );

        }

        return;

    }


    // LAB

    if (
        currentRoom === 1
    ) {

        const progress =
            roomProgress[1];


        if (
            !progress.clueFound
        ) {

            showInteractionMessage(
                "Hint: Find the Laboratory Clue."
            );

        }

        else if (
            !progress.microscopeFound ||
            !progress.testTubeFound ||
            !progress.noteFound
        ) {

            showInteractionMessage(
                "Hint: Inspect the Microscope, Test Tube and Computer Note."
            );

        }

        else {

            showInteractionMessage(
                "Hint: Arrange 3, 7 and 9 from smallest to largest."
            );

        }

        return;

    }


    // SECURITY

    if (
        currentRoom === 2
    ) {

        const progress =
            roomProgress[2];


        if (
            !progress.clueFound
        ) {

            showInteractionMessage(
                "Hint: Find the Security Log."
            );

        }

        else if (
            !progress.camera1Found ||
            !progress.camera2Found ||
            !progress.camera3Found
        ) {

            showInteractionMessage(
                "Hint: Inspect Cameras 1, 2 and 3."
            );

        }

        else {

            showInteractionMessage(
                "Hint: Arrange cameras from earliest entry to latest entry."
            );

        }

        return;

    }


    // FINAL

    showInteractionMessage(
        "Hint: Convert decimal 10 into binary."
    );

}


// =====================================================
// PAUSE
// =====================================================

export function togglePause() {

    if (
        !gameStarted ||
        gameOver ||
        gameWon
    ) {

        return;

    }


    gamePaused =
        !gamePaused;


    const pauseMenu =
        document.getElementById(
            "pauseMenu"
        );


    if (pauseMenu) {

        pauseMenu.style.display =
            gamePaused
                ? "flex"
                : "none";

    }

}


// =====================================================
// TIMER
// =====================================================

export function updateGame(
    delta
) {

    if (
        !gameStarted ||
        gamePaused ||
        gameOver ||
        gameWon
    ) {

        return;

    }


    timeLeft -=
        delta;


    if (
        timeLeft <= 0
    ) {

        timeLeft =
            0;

        loseGame();

    }


    updateTimer();

}


function updateTimer() {

    const timer =
        document.getElementById(
            "timer"
        );


    if (!timer) {

        return;

    }


    const minutes =
        Math.floor(
            timeLeft / 60
        );


    const seconds =
        Math.floor(
            timeLeft % 60
        );


    timer.textContent =
        `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

}


// =====================================================
// ROOM NAME
// =====================================================

function updateRoomName() {

    const element =
        document.getElementById(
            "roomName"
        );


    if (element) {

        element.textContent =
            roomNames[
                currentRoom
            ];

    }

}


// =====================================================
// INTERACTION MESSAGE
// =====================================================

function showInteractionMessage(
    message
) {

    const element =
        document.getElementById(
            "interactionText"
        );


    if (!element) {

        return;

    }


    element.textContent =
        message;


    element.style.display =
        "block";


    clearTimeout(
        window.interactionTimeout
    );


    window.interactionTimeout =
        setTimeout(
            () => {

                element.style.display =
                    "none";

            },
            2500
        );

}


// =====================================================
// INVENTORY
// =====================================================

function updateInventory() {

    const container =
        document.getElementById(
            "inventoryItems"
        );


    if (!container) {

        return;

    }


    const items =
        getInventory();


    if (
        !items ||
        items.length === 0
    ) {

        container.textContent =
            "Empty";

        return;

    }


    container.innerHTML =
        items
            .map(
                item =>
                    `<div class="inventoryItem">🎒 ${item}</div>`
            )
            .join("");

}


// =====================================================
// BUTTONS
// =====================================================

function setupButtons() {

    const inventoryButton =
        document.getElementById(
            "inventoryButton"
        );


    if (inventoryButton) {

        inventoryButton.onclick =
            () => {

                updateInventory();


                const inventory =
                    document.getElementById(
                        "inventory"
                    );


                if (inventory) {

                    inventory.style.display =
                        "flex";

                }

            };

    }


    const closeInventory =
        document.getElementById(
            "closeInventory"
        );


    if (closeInventory) {

        closeInventory.onclick =
            () => {

                const inventory =
                    document.getElementById(
                        "inventory"
                    );


                if (inventory) {

                    inventory.style.display =
                        "none";

                }

            };

    }


    const closePuzzle =
        document.getElementById(
            "closePuzzle"
        );


    if (closePuzzle) {

        closePuzzle.onclick =
            closePuzzlePanel;

    }


    const resume =
        document.getElementById(
            "resumeButton"
        );


    if (resume) {

        resume.onclick =
            togglePause;

    }


    const restart =
        document.getElementById(
            "restartButton"
        );


    if (restart) {

        restart.onclick =
            restartGame;

    }


    const playAgain =
        document.getElementById(
            "playAgainButton"
        );


    if (playAgain) {

        playAgain.onclick =
            restartGame;

    }

}


// =====================================================
// HIDE GAME UI
// =====================================================

function hideGameUI() {

    const gameUI =
        document.getElementById(
            "gameUI"
        );


    if (gameUI) {

        gameUI.style.display =
            "none";

    }

}


// =====================================================
// GAME OVER
// =====================================================

function loseGame() {

    gameOver =
        true;


    const panel =
        document.getElementById(
            "gameOver"
        );


    if (panel) {

        panel.style.display =
            "flex";

    }

}


// =====================================================
// VICTORY
// =====================================================

function winGame() {

    gameWon =
        true;


    const panel =
        document.getElementById(
            "victory"
        );


    if (panel) {

        panel.style.display =
            "flex";

    }


    const text =
        document.getElementById(
            "victoryText"
        );


    if (text) {

        text.textContent =
            "🎉 You solved every puzzle, unlocked every room and escaped the building!";
    }

}


// =====================================================
// RESTART
// =====================================================

function restartGame() {

    const gameOverPanel =
        document.getElementById(
            "gameOver"
        );


    const victoryPanel =
        document.getElementById(
            "victory"
        );


    if (gameOverPanel) {

        gameOverPanel.style.display =
            "none";

    }


    if (victoryPanel) {

        victoryPanel.style.display =
            "none";

    }


    closePuzzlePanel();

    startGame();

}