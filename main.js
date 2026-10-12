import {
    initGame,
    startGame,
    updateGame,
    interact,
    interactAt,
    showHint,
    togglePause
} from "./game.js";

import {
    updatePlayer,
    setupJoystick,
    setupMouseLook,
    setupMobileLook,
    setCollisionObjects,
    resetPlayerLook
} from "./player.js";

import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// =====================================================
// SCENE
// =====================================================

const scene =
    new THREE.Scene();

scene.background =
    new THREE.Color(
        0x101010
    );


// =====================================================
// CAMERA
// =====================================================

const camera =
    new THREE.PerspectiveCamera(
        75,
        window.innerWidth /
        window.innerHeight,
        0.1,
        1000
    );


camera.position.set(
    0,
    2.2,
    6
);


// =====================================================
// RENDERER
// =====================================================

const renderer =
    new THREE.WebGLRenderer({
        antialias: true
    });


renderer.setSize(
    window.innerWidth,
    window.innerHeight
);


renderer.setPixelRatio(
    Math.min(
        window.devicePixelRatio,
        2
    )
);


renderer.shadowMap.enabled =
    true;


document.body.appendChild(
    renderer.domElement
);


// =====================================================
// LIGHTING
// =====================================================

const hemisphere =
    new THREE.HemisphereLight(
        0xffffff,
        0x222222,
        2
    );


scene.add(
    hemisphere
);


const light =
    new THREE.PointLight(
        0xffffff,
        40,
        30
    );


light.position.set(
    0,
    4,
    0
);


light.castShadow =
    true;


scene.add(
    light
);


// =====================================================
// GAME INIT
// =====================================================

initGame(
    scene,
    camera,
    renderer
);


// =====================================================
// START BUTTON
// =====================================================

const startButton =
    document.getElementById(
        "startButton"
    );


if (startButton) {

    startButton.addEventListener(
        "click",
        () => {

            const startScreen =
                document.getElementById(
                    "startScreen"
                );


            if (startScreen) {

                startScreen.style.display =
                    "none";

            }


            startGame();

        }
    );

}


// =====================================================
// PC - E KEY
// =====================================================

window.addEventListener("keydown", (event) => {
    // Ignore repeated key presses
    if (event.repeat) return;

    // Allow typing normally inside input fields
    const activeElement = document.activeElement;

    if (
        activeElement &&
        (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA"
        )
    ) {
        return;
    }

    if (event.key.toLowerCase() === "e") {
        event.preventDefault();
        interact();
    }
});


// =====================================================
// MOBILE INTERACT BUTTON
// =====================================================

const interactButton =
    document.getElementById(
        "interactButton"
    );


if (interactButton) {

    interactButton.addEventListener(
        "click",
        event => {

            event.preventDefault();
            event.stopPropagation();

            interact();

        }
    );

}


// =====================================================
// DIRECT CLICK ON OBJECTS
// =====================================================

renderer.domElement.addEventListener(
    "click",
    event => {

        interactAt(
            event.clientX,
            event.clientY
        );

    }
);


// =====================================================
// HINT
// =====================================================

const hintButton =
    document.getElementById(
        "hintButton"
    );


if (hintButton) {

    hintButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            showHint();

        }
    );

}


// =====================================================
// PAUSE
// =====================================================

const pauseButton =
    document.getElementById(
        "pauseButton"
    );


if (pauseButton) {

    pauseButton.addEventListener(
        "click",
        event => {

            event.preventDefault();

            togglePause();

        }
    );

}


// =====================================================
// CLOSE CONTROLS
// =====================================================

const closeControls =
    document.getElementById(
        "closeControls"
    );


if (closeControls) {

    closeControls.addEventListener(
        "click",
        () => {

            const controls =
                document.getElementById(
                    "controls"
                );


            if (controls) {

                controls.style.display =
                    "none";

            }

        }
    );

}


// =====================================================
// CONTROLS
// =====================================================

setupJoystick();

setupMouseLook(
    camera,
    renderer
);

setupMobileLook(
    camera
);


// =====================================================
// GAME LOOP
// =====================================================

const clock =
    new THREE.Clock();


function animate() {

    requestAnimationFrame(
        animate
    );


    const delta =
        clock.getDelta();


    updatePlayer(
        camera
    );


    updateGame(
        delta
    );


    renderer.render(
        scene,
        camera
    );

}


animate();


// =====================================================
// RESIZE
// =====================================================

window.addEventListener(
    "resize",
    () => {

        camera.aspect =
            window.innerWidth /
            window.innerHeight;


        camera.updateProjectionMatrix();


        renderer.setSize(
            window.innerWidth,
            window.innerHeight
        );

    }
);


// =====================================================
// LOADING SCREEN
// =====================================================

setTimeout(
    () => {

        const loading =
            document.getElementById(
                "loading"
            );


        if (loading) {

            loading.style.display =
                "none";

        }

    },
    1000
);