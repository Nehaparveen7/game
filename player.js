import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const keys = {};

let joystickX = 0;
let joystickY = 0;

let yaw = 0;
let pitch = 0;

const speed = 3.5;

// Player dimensions.
const PLAYER_RADIUS = 0.38;
const PLAYER_HEIGHT = 1.8;

// Room boundaries.
const ROOM_LIMIT = 9.1;

// Objects that block movement.
let collisionObjects = [];


// =====================================================
// KEYBOARD
// =====================================================

// KEYBOARD CONTROLS
window.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;

    // Allow normal typing in input fields
    if (
        activeElement &&
        (
            activeElement.tagName === "INPUT" ||
            activeElement.tagName === "TEXTAREA" ||
            activeElement.isContentEditable
        )
    ) {
        return;
    }

    keys[event.key.toLowerCase()] = true;

    // Prevent scrolling while moving in the game
    if (
        ["w", "a", "s", "d", " "].includes(
            event.key.toLowerCase()
        )
    ) {
        event.preventDefault();
    }
});

window.addEventListener("keyup", (event) => {
    keys[event.key.toLowerCase()] = false;
});


// =====================================================
// COLLISION SETUP
// =====================================================

export function setCollisionObjects(roomGroup) {
    collisionObjects = [];

    if (!roomGroup) return;

    roomGroup.updateMatrixWorld(true);

    roomGroup.traverse((object) => {
        if (!object.isMesh) return;

        // Don't collide with paper, USB, monitors,
        // puzzle targets, or other small interactables.
        const type = object.userData?.type;

        const nonBlockingTypes = [
            "paper",
            "usb",
            "insertedUSB",
            "laptop",
            "laptopScreen",
            "labClue",
            "securityClue",
            "labObject",
            "monitor",
            "labTerminal",
            "securityComputer",
            "finalTerminal",
            "computer"
        ];

        if (type && nonBlockingTypes.includes(type)) {
            return;
        }

        // Only use physical room objects for collision.
        const bounds = new THREE.Box3()
            .setFromObject(object);

        const size = new THREE.Vector3();
        bounds.getSize(size);

        // Ignore lights, tiny decorative details,
        // floor markings, and extremely small meshes.
        if (
            size.x < 0.12 &&
            size.y < 0.12 &&
            size.z < 0.12
        ) {
            return;
        }

        // Ignore ceiling and floor surfaces.
        if (bounds.max.y < 0.25) return;
        if (bounds.min.y > PLAYER_HEIGHT + 1.5) return;

        collisionObjects.push(bounds);
    });
}


// =====================================================
// COLLISION TEST
// =====================================================

function collidesAt(x, z) {
    const playerBox = new THREE.Box3(
        new THREE.Vector3(
            x - PLAYER_RADIUS,
            0.1,
            z - PLAYER_RADIUS
        ),
        new THREE.Vector3(
            x + PLAYER_RADIUS,
            PLAYER_HEIGHT,
            z + PLAYER_RADIUS
        )
    );

    for (const objectBox of collisionObjects) {
        if (playerBox.intersectsBox(objectBox)) {
            return true;
        }
    }

    return false;
}


// =====================================================
// JOYSTICK
// =====================================================

export function setupJoystick() {
    const joystick =
        document.getElementById("joystick");

    const knob =
        document.getElementById("joystickKnob");

    if (!joystick || !knob) return;

    let active = false;

    joystick.addEventListener(
        "pointerdown",
        (event) => {
            active = true;

            joystick.setPointerCapture(event.pointerId);

            updateJoystick(event);
        }
    );

    joystick.addEventListener(
        "pointermove",
        (event) => {
            if (!active) return;

            updateJoystick(event);
        }
    );

    function updateJoystick(event) {
        const rect = joystick.getBoundingClientRect();

        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        let dx = event.clientX - centerX;
        let dy = event.clientY - centerY;

        const maxDistance = rect.width * 0.3;

        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > maxDistance) {
            dx = dx / distance * maxDistance;
            dy = dy / distance * maxDistance;
        }

        joystickX = dx / maxDistance;
        joystickY = dy / maxDistance;

        knob.style.transform =
            `translate(${dx}px, ${dy}px)`;
    }

    function stopJoystick() {
        active = false;

        joystickX = 0;
        joystickY = 0;

        knob.style.transform = "translate(0px, 0px)";
    }

    joystick.addEventListener("pointerup", stopJoystick);
    joystick.addEventListener("pointercancel", stopJoystick);
    joystick.addEventListener("lostpointercapture", stopJoystick);
}


// =====================================================
// MOUSE LOOK
// =====================================================

export function setupMouseLook(camera, renderer) {
    if (!camera || !renderer) return;

    renderer.domElement.addEventListener("click", () => {
        if (window.innerWidth > 768) {
            if (
                document.pointerLockElement !==
                renderer.domElement
            ) {
                renderer.domElement.requestPointerLock();
            }
        }
    });

    document.addEventListener("mousemove", (event) => {
        if (
            document.pointerLockElement !==
            renderer.domElement
        ) {
            return;
        }

        yaw -= event.movementX * 0.002;
        pitch -= event.movementY * 0.002;

        pitch = Math.max(
            -Math.PI / 3,
            Math.min(Math.PI / 3, pitch)
        );

        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;
    });
}


// =====================================================
// MOBILE LOOK
// =====================================================

export function setupMobileLook(camera) {
    let lastX = null;
    let lastY = null;

    document.addEventListener("touchstart", (event) => {
        if (window.innerWidth > 768) return;

        const touch = event.touches[0];

        if (!touch) return;

        if (touch.clientX < window.innerWidth * 0.4) {
            return;
        }

        const excluded = [
            "#joystick",
            "#interactButton",
            "#gameUI",
            "#puzzlePanel",
            "#controls",
            "#inventory",
            "#pauseMenu",
            "#startScreen"
        ];

        if (
            excluded.some((selector) =>
                event.target.closest(selector)
            )
        ) {
            return;
        }

        lastX = touch.clientX;
        lastY = touch.clientY;
    }, { passive: true });

    document.addEventListener("touchmove", (event) => {
        if (window.innerWidth > 768) return;

        const touch = event.touches[0];

        if (!touch || lastX === null) return;

        yaw -= (touch.clientX - lastX) * 0.005;
        pitch -= (touch.clientY - lastY) * 0.005;

        pitch = Math.max(
            -Math.PI / 3,
            Math.min(Math.PI / 3, pitch)
        );

        camera.rotation.order = "YXZ";
        camera.rotation.y = yaw;
        camera.rotation.x = pitch;

        lastX = touch.clientX;
        lastY = touch.clientY;
    }, { passive: true });

    document.addEventListener("touchend", () => {
        lastX = null;
        lastY = null;
    });
}


// =====================================================
// RESET LOOK WHEN CHANGING ROOMS
// =====================================================

export function resetPlayerLook(camera) {
    yaw = 0;
    pitch = 0;

    if (camera) {
        camera.rotation.order = "YXZ";
        camera.rotation.set(0, 0, 0);
    }
}


// =====================================================
// PLAYER MOVEMENT
// =====================================================

export function updatePlayer(camera, delta = 0.016) {
    if (!camera) return;

    let forward = 0;
    let sideways = 0;

    if (keys["w"]) forward += 1;
    if (keys["s"]) forward -= 1;
    if (keys["a"]) sideways -= 1;
    if (keys["d"]) sideways += 1;

    forward -= joystickY;
    sideways += joystickX;

    const length = Math.sqrt(
        forward * forward + sideways * sideways
    );

    if (length > 1) {
        forward /= length;
        sideways /= length;
    }

    if (length === 0) return;

    const moveDistance = speed * Math.min(delta, 0.05);

    const dx =
        (
            -Math.sin(yaw) * forward +
            Math.cos(yaw) * sideways
        ) * moveDistance;

    const dz =
        (
            -Math.cos(yaw) * forward -
            Math.sin(yaw) * sideways
        ) * moveDistance;

    const nextX = THREE.MathUtils.clamp(
        camera.position.x + dx,
        -ROOM_LIMIT,
        ROOM_LIMIT
    );

    const nextZ = THREE.MathUtils.clamp(
        camera.position.z + dz,
        -ROOM_LIMIT,
        ROOM_LIMIT
    );

    // Test X and Z separately so the player can slide
    // along a desk instead of getting completely stuck.

    if (!collidesAt(nextX, camera.position.z)) {
        camera.position.x = nextX;
    }

    if (!collidesAt(camera.position.x, nextZ)) {
        camera.position.z = nextZ;
    }

    camera.position.y = 2.2;
}