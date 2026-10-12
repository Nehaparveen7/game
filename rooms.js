// ============================================================
// ESCAPE ROOM 3D — CINEMATIC ROOM DESIGN
// Three.js r180
// ============================================================

import * as THREE from
    "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";


// ============================================================
// MATERIALS
// ============================================================

const materials = {
    wood: new THREE.MeshStandardMaterial({
        color: 0x51301d,
        roughness: 0.68
    }),

    darkWood: new THREE.MeshStandardMaterial({
        color: 0x29180f,
        roughness: 0.65
    }),

    polishedWood: new THREE.MeshStandardMaterial({
        color: 0x704326,
        roughness: 0.35
    }),

    floor: new THREE.MeshStandardMaterial({
        color: 0x30231b,
        roughness: 0.82
    }),

    wall: new THREE.MeshStandardMaterial({
        color: 0x39302a,
        roughness: 0.9
    }),

    darkWall: new THREE.MeshStandardMaterial({
        color: 0x171d26,
        roughness: 0.85
    }),

    labWall: new THREE.MeshStandardMaterial({
        color: 0x8795a3,
        roughness: 0.9
    }),

    metal: new THREE.MeshStandardMaterial({
        color: 0x505963,
        metalness: 0.65,
        roughness: 0.35
    }),

    blackMetal: new THREE.MeshStandardMaterial({
        color: 0x11151a,
        metalness: 0.6,
        roughness: 0.3
    }),

    screen: new THREE.MeshStandardMaterial({
        color: 0x061321,
        emissive: 0x071c35,
        emissiveIntensity: 0.8,
        roughness: 0.25
    }),

    greenGlass: new THREE.MeshStandardMaterial({
        color: 0x4dffb0,
        emissive: 0x087a45,
        emissiveIntensity: 0.5
    }),

    gold: new THREE.MeshStandardMaterial({
        color: 0xc49a63,
        metalness: 0.7,
        roughness: 0.3
    }),

    white: new THREE.MeshStandardMaterial({
        color: 0xd5d9dc,
        roughness: 0.8
    }),

    paper: new THREE.MeshStandardMaterial({
        color: 0xd6c7a7,
        roughness: 1
    }),

    carpet: new THREE.MeshStandardMaterial({
        color: 0x39211d,
        roughness: 1
    })
};


// ============================================================
// BASIC BUILDING HELPERS
// ============================================================

function box(
    group,
    width,
    height,
    depth,
    x,
    y,
    z,
    material,
    type = null,
    options = {}
) {
    const geometry = new THREE.BoxGeometry(
        width,
        height,
        depth
    );

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (options.rotationY !== undefined) {
        mesh.rotation.y = options.rotationY;
    }

    if (options.rotationX !== undefined) {
        mesh.rotation.x = options.rotationX;
    }

    if (type) {
        mesh.userData.type = type;
    }

    if (options.userData) {
        Object.assign(
            mesh.userData,
            options.userData
        );
    }

    group.add(mesh);

    return mesh;
}


function cylinder(
    group,
    radiusTop,
    radiusBottom,
    height,
    x,
    y,
    z,
    material,
    type = null
) {
    const geometry = new THREE.CylinderGeometry(
        radiusTop,
        radiusBottom,
        height,
        20
    );

    const mesh = new THREE.Mesh(
        geometry,
        material
    );

    mesh.position.set(x, y, z);

    mesh.castShadow = true;
    mesh.receiveShadow = true;

    if (type) {
        mesh.userData.type = type;
    }

    group.add(mesh);

    return mesh;
}


function addLight(
    group,
    color,
    intensity,
    distance,
    x,
    y,
    z
) {
    const light = new THREE.PointLight(
        color,
        intensity,
        distance
    );

    light.position.set(x, y, z);

    light.castShadow = true;

    group.add(light);

    return light;
}


// ============================================================
// ROOM STRUCTURE
// ============================================================

function createFloor(group, material) {
    box(
        group,
        20,
        0.3,
        20,
        0,
        -0.2,
        0,
        material
    );

    // Floorboard lines.

    for (let i = -9; i <= 9; i += 1.5) {
        box(
            group,
            19.5,
            0.012,
            0.025,
            0,
            -0.035,
            i,
            materials.darkWood
        );
    }
}


function createWalls(group, wallMaterial) {
    // Back wall, with a door opening in the middle.

    box(
        group,
        7.2,
        6,
        0.35,
        -6.4,
        3,
        -9.85,
        wallMaterial
    );

    box(
        group,
        7.2,
        6,
        0.35,
        6.4,
        3,
        -9.85,
        wallMaterial
    );

    box(
        group,
        5.6,
        1.7,
        0.35,
        0,
        5.15,
        -9.85,
        wallMaterial
    );

    // Left and right walls.

    box(
        group,
        0.35,
        6,
        20,
        -9.85,
        3,
        0,
        wallMaterial
    );

    box(
        group,
        0.35,
        6,
        20,
        9.85,
        3,
        0,
        wallMaterial
    );

    // Ceiling.

    box(
        group,
        20,
        0.25,
        20,
        0,
        6.1,
        0,
        wallMaterial
    );

    // Baseboards.

    for (const side of [-1, 1]) {
        box(
            group,
            0.12,
            0.25,
            19.5,
            side * 9.55,
            0.12,
            0,
            materials.darkWood
        );
    }

    box(
        group,
        19.5,
        0.25,
        0.12,
        0,
        0.12,
        -9.55,
        materials.darkWood
    );
}


// ============================================================
// WALL PAINTINGS
// ============================================================

function createPainting(
    group,
    x,
    y,
    z,
    width,
    height,
    side = "back"
) {
    const paintingGroup = new THREE.Group();

    paintingGroup.position.set(x, y, z);

    if (side === "left") {
        paintingGroup.rotation.y = Math.PI / 2;
    } else if (side === "right") {
        paintingGroup.rotation.y = -Math.PI / 2;
    }

    // Frame.

    box(
        paintingGroup,
        width,
        height,
        0.12,
        0,
        0,
        0,
        materials.gold
    );

    // Dark border.

    box(
        paintingGroup,
        width - 0.16,
        height - 0.16,
        0.04,
        0,
        0,
        0.07,
        materials.darkWood
    );

    // Artwork surface.

    const artMaterial = new THREE.MeshStandardMaterial({
        color: 0x574335,
        roughness: 0.9,
        emissive: 0x160d08,
        emissiveIntensity: 0.2
    });

    box(
        paintingGroup,
        width - 0.3,
        height - 0.3,
        0.025,
        0,
        0,
        0.1,
        artMaterial
    );

    // Decorative shapes suggest an old painting.

    box(
        paintingGroup,
        width * 0.45,
        height * 0.15,
        0.018,
        0,
        height * 0.2,
        0.12,
        materials.polishedWood
    );

    cylinder(
        paintingGroup,
        width * 0.09,
        width * 0.12,
        0.02,
        0,
        -height * 0.12,
        0.13,
        materials.gold
    ).rotation.x = Math.PI / 2;

    group.add(paintingGroup);

    return paintingGroup;
}


// ============================================================
// BOOKSHELF
// ============================================================

function createBookshelf(
    group,
    x,
    z,
    width = 2.5,
    height = 4.5
) {
    box(
        group,
        width,
        height,
        0.55,
        x,
        height / 2,
        z,
        materials.darkWood
    );

    box(
        group,
        width + 0.12,
        0.12,
        0.65,
        x,
        height,
        z,
        materials.polishedWood
    );

    // Shelf openings.

    for (let i = 1; i <= 4; i++) {
        box(
            group,
            width - 0.15,
            0.08,
            0.5,
            x,
            i * (height / 5),
            z + 0.3,
            materials.wood
        );
    }

    // Books.

    const bookColors = [
        0x743b2b,
        0x273c35,
        0x8a7047,
        0x26384c,
        0x5a2929,
        0x786447
    ];

    for (let shelf = 0; shelf < 5; shelf++) {
        let cursor = x - width / 2 + 0.2;

        const right = x + width / 2 - 0.15;

        while (cursor < right - 0.15) {
            const bookWidth =
                0.12 + Math.random() * 0.16;

            const bookHeight =
                0.35 + Math.random() * 0.45;

            const bookMaterial =
                new THREE.MeshStandardMaterial({
                    color: bookColors[
                        Math.floor(
                            Math.random() *
                            bookColors.length
                        )
                    ],
                    roughness: 0.85
                });

            box(
                group,
                bookWidth,
                bookHeight,
                0.25,
                cursor + bookWidth / 2,
                shelf * (height / 5) +
                    bookHeight / 2 +
                    0.12,
                z + 0.1,
                bookMaterial
            );

            cursor += bookWidth + 0.025;
        }
    }
}


// ============================================================
// DESK
// ============================================================

function createDesk(
    group,
    x,
    z,
    width = 4,
    depth = 1.8,
    y = 1.1
) {
    // Desktop.

    box(
        group,
        width,
        0.22,
        depth,
        x,
        y,
        z,
        materials.polishedWood
    );

    // Legs.

    for (const sideX of [-1, 1]) {
        for (const sideZ of [-1, 1]) {
            box(
                group,
                0.18,
                y,
                0.18,
                x + sideX * (width / 2 - 0.2),
                y / 2,
                z + sideZ * (depth / 2 - 0.15),
                materials.darkWood
            );
        }
    }

    // Front drawer.

    box(
        group,
        width * 0.65,
        0.38,
        0.12,
        x,
        y - 0.28,
        z + depth / 2 - 0.05,
        materials.wood
    );

    for (const dx of [-0.45, 0.45]) {
        box(
            group,
            0.12,
            0.04,
            0.035,
            x + dx,
            y - 0.28,
            z + depth / 2 + 0.025,
            materials.gold
        );
    }
}


// ============================================================
// CHAIR
// ============================================================

function createChair(group, x, z) {
    // Seat.

    box(
        group,
        1.1,
        0.18,
        1,
        x,
        0.95,
        z,
        materials.darkWood
    );

    // Backrest.

    box(
        group,
        1.1,
        1.35,
        0.18,
        x,
        1.65,
        z + 0.42,
        materials.wood
    );

    // Legs.

    for (const dx of [-0.42, 0.42]) {
        for (const dz of [-0.35, 0.35]) {
            box(
                group,
                0.12,
                0.9,
                0.12,
                x + dx,
                0.45,
                z + dz,
                materials.darkWood
            );
        }
    }
}

// ============================================================
// STUDY LAMP
// ============================================================

function createDeskLamp(group, x, y, z) {
    cylinder(
        group,
        0.3,
        0.3,
        0.1,
        x,
        y,
        z,
        materials.blackMetal
    );

    cylinder(
        group,
        0.045,
        0.06,
        0.65,
        x,
        y + 0.32,
        z,
        materials.gold
    );

    const shade = new THREE.MeshStandardMaterial({
        color: 0xc49a63,
        emissive: 0xffa84a,
        emissiveIntensity: 0.5
    });

    const lampShade = cylinder(
        group,
        0.12,
        0.35,
        0.28,
        x,
        y + 0.68,
        z,
        shade
    );

    lampShade.rotation.z = 0.12;

    addLight(
        group,
        0xffb765,
        3.5,
        7,
        x,
        y + 0.55,
        z + 0.1
    );
}


// ============================================================
// SIDE TABLE + VASE
// ============================================================

function createSideTable(group, x, z) {
    createDesk(
        group,
        x,
        z,
        1.25,
        1.1,
        0.95
    );

    for (const dx of [-0.45, 0.45]) {
        cylinder(
            group,
            0.045,
            0.06,
            0.85,
            x + dx,
            0.43,
            z,
            materials.darkWood
        );
    }

    // Vase.

    const vaseMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x36463b,
            roughness: 0.25,
            metalness: 0.25
        });

    cylinder(
        group,
        0.2,
        0.12,
        0.45,
        x,
        1.3,
        z,
        vaseMaterial
    );

    // Stems.

    for (let i = 0; i < 5; i++) {
        const stem = cylinder(
            group,
            0.015,
            0.015,
            0.55,
            x + (Math.random() - 0.5) * 0.22,
            1.65,
            z + (Math.random() - 0.5) * 0.15,
            new THREE.MeshStandardMaterial({
                color: 0x355333
            })
        );

        stem.rotation.z =
            (Math.random() - 0.5) * 0.5;

        // Leaves.

        box(
            group,
            0.08,
            0.22,
            0.04,
            stem.position.x + 0.06,
            1.8,
            z,
            new THREE.MeshStandardMaterial({
                color: 0x527849
            })
        );
    }
}


// ============================================================
// LAPTOP
// ============================================================

function createLaptop(group) {
    // Laptop base.

    box(
        group,
        1.5,
        0.09,
        0.95,
        -0.55,
        1.28,
        -1.0,
        materials.metal,
        "laptop"
    );

    // Keyboard.

    box(
        group,
        1.2,
        0.015,
        0.48,
        -0.55,
        1.335,
        -0.92,
        materials.blackMetal
    );

    // Screen frame.

    box(
        group,
        1.5,
        1.0,
        0.09,
        -0.55,
        1.82,
        -1.42,
        materials.blackMetal,
        "laptopScreen"
    );

    // Screen surface.

    box(
        group,
        1.34,
        0.82,
        0.025,
        -0.55,
        1.82,
        -1.365,
        materials.screen
    );

    // Small camera.

    cylinder(
        group,
        0.025,
        0.025,
        0.02,
        -0.55,
        2.27,
        -1.35,
        materials.gold
    );
}


// ============================================================
// STUDY PAPER AND USB
// No floating labels.
// ============================================================

function createStudyClues(group) {

    // =================================================
    // REALISTIC AGED PAPER CLUE
    // =================================================

    const paperGroup = new THREE.Group();

    paperGroup.position.set(1.0, 1.255, -0.65);
    paperGroup.rotation.y = -0.12;
    paperGroup.rotation.x = -0.025;

    // Aged cream paper.

    const paperMaterial = new THREE.MeshStandardMaterial({
        color: 0xe8d7ae,
        roughness: 1,
        side: THREE.DoubleSide
    });

    // Main paper sheet.

    const paper = new THREE.Mesh(
        new THREE.BoxGeometry(1.0, 0.025, 0.8),
        paperMaterial
    );

    paper.castShadow = true;
    paper.receiveShadow = true;
    paper.userData.type = "paper";
    paper.userData.name = "Clue Paper";

    paperGroup.add(paper);

    // Slightly darker paper border.

    const borderMaterial = new THREE.MeshStandardMaterial({
        color: 0xb49a6d,
        roughness: 1
    });

    // Top and bottom border details.

    for (const z of [-0.37, 0.37]) {
        const edge = new THREE.Mesh(
            new THREE.BoxGeometry(0.94, 0.006, 0.012),
            borderMaterial
        );

        edge.position.set(0, 0.016, z);
        paperGroup.add(edge);
    }

    // Handwritten-style heading.

    const headingCanvas = document.createElement("canvas");
    headingCanvas.width = 512;
    headingCanvas.height = 256;

    const ctx = headingCanvas.getContext("2d");

    ctx.clearRect(0, 0, 512, 256);

    ctx.fillStyle = "#403020";
    ctx.textAlign = "center";

    ctx.font = "bold 35px Georgia";
    ctx.fillText("IMPORTANT CLUE", 256, 48);

    // Underline.

    ctx.strokeStyle = "#6b4930";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(95, 62);
    ctx.lineTo(417, 62);
    ctx.stroke();

    // Clue text.

    ctx.font = "italic bold 28px Georgia";
    ctx.fillText("INSERT AND", 256, 112);
    ctx.fillText("GAIN THE KEY", 256, 151);

    // Small handwritten decoration.

    ctx.font = "italic 19px Georgia";
    ctx.fillText("Think carefully...", 256, 199);

    const textTexture = new THREE.CanvasTexture(headingCanvas);
    textTexture.colorSpace = THREE.SRGBColorSpace;

    const textMaterial = new THREE.MeshBasicMaterial({
        map: textTexture,
        transparent: true,
        side: THREE.DoubleSide,
        depthWrite: false
    });

    // Place writing on the upper surface of the paper.

    const writing = new THREE.Mesh(
        new THREE.PlaneGeometry(0.88, 0.44),
        textMaterial
    );

    writing.rotation.x = -Math.PI / 2;
    writing.position.set(0, 0.014, 0);
    paperGroup.add(writing);

    // Small folded corner.

    const corner = new THREE.Mesh(
        new THREE.PlaneGeometry(0.18, 0.18),
        new THREE.MeshStandardMaterial({
            color: 0xc7b58d,
            roughness: 1,
            side: THREE.DoubleSide
        })
    );

    corner.rotation.x = -Math.PI / 2;
    corner.rotation.z = Math.PI / 4;
    corner.position.set(0.39, 0.018, -0.29);

    paperGroup.add(corner);

    group.add(paperGroup);

    // =================================================
    // METALLIC USB DRIVE
    // =================================================

    const usbMetal =
        new THREE.MeshStandardMaterial({
            color: 0x9ba1a7,
            metalness: 0.95,
            roughness: 0.18
        });

    const usbDark =
        new THREE.MeshStandardMaterial({
            color: 0x292d32,
            metalness: 0.65,
            roughness: 0.28
        });

    const usbX = 1.95;
    const usbY = 1.34;
    const usbZ = -0.65;

    // Dark casing.

    const usbBody = box(
        group,
        0.52,
        0.16,
        0.24,
        usbX,
        usbY,
        usbZ,
        usbDark,
        "usb"
    );

    usbBody.rotation.y = -0.2;
    usbBody.userData.name = "USB Drive";

    // Metallic upper surface.

    const usbTop = box(
        group,
        0.42,
        0.025,
        0.18,
        usbX - 0.025,
        usbY + 0.09,
        usbZ,
        usbMetal
    );

    usbTop.rotation.y = -0.2;

    // USB connector.

    const connector = box(
        group,
        0.18,
        0.105,
        0.19,
        usbX + 0.33,
        usbY,
        usbZ,
        usbMetal
    );

    connector.rotation.y = -0.2;

    // Connector end.

    const connectorEnd = box(
        group,
        0.025,
        0.075,
        0.15,
        usbX + 0.425,
        usbY,
        usbZ,
        materials.gold
    );

    connectorEnd.rotation.y = -0.2;

    // Small indicator.

    box(
        group,
        0.055,
        0.025,
        0.045,
        usbX - 0.12,
        usbY + 0.11,
        usbZ,
        materials.greenGlass
    );
}

// ============================================================
// STUDY ROOM
// ============================================================

function createStudy(group) {
    createFloor(group, materials.floor);
    createWalls(group, materials.wall);

    // Warm room lighting.

    addLight(
        group,
        0xffa45b,
        18,
        25,
        0,
        4.8,
        0
    );

    addLight(
        group,
        0xffb56e,
        8,
        12,
        -5,
        3.5,
        1
    );

    addLight(
        group,
        0xffc184,
        8,
        12,
        5,
        3.5,
        1
    );

    // Rug.

    box(
        group,
        7,
        0.025,
        5,
        0,
        0.005,
        1.0,
        materials.carpet
    );

    // Decorative rug border.

    for (const side of [-1, 1]) {
        box(
            group,
            0.06,
            0.012,
            4.8,
            side * 3.35,
            0.025,
            1.0,
            materials.gold
        );
    }

    // Desk and chair.

    createDesk(
        group,
        0,
        -1.0,
        5.4,
        1.8,
        1.15
    );

    createChair(
        group,
        0,
        1.0
    );

    // Laptop and puzzle objects.

    createLaptop(group);
    createStudyClues(group);

    // Lamp moved to the desk's left side.

    createDeskLamp(
        group,
        -1.9,
        1.3,
        -1.0
    );

    // Books and pen holder.

    box(
        group,
        0.9,
        0.14,
        0.65,
        1.8,
        1.3,
        -1.0,
        materials.darkWood
    );

    box(
        group,
        0.9,
        0.12,
        0.65,
        1.8,
        1.43,
        -1.0,
        materials.gold
    );

    cylinder(
        group,
        0.12,
        0.15,
        0.3,
        -2.1,
        1.42,
        -0.6,
        materials.metal
    );

    // Bookshelf on left wall.

    createBookshelf(
        group,
        -8.5,
        -1.5,
        1.8,
        4.8
    );

    // Side tables and vases.

    createSideTable(
        group,
        7.3,
        -2.5
    );

    createSideTable(
        group,
        -7.1,
        3.0
    );

    // Wall paintings.

    createPainting(
        group,
        -5.7,
        3.6,
        -9.55,
        2.0,
        2.5,
        "back"
    );

    createPainting(
        group,
        7.1,
        3.5,
        -9.55,
        1.8,
        2.4,
        "back"
    );

    createPainting(
        group,
        -9.55,
        3.7,
        -3.0,
        1.8,
        2.5,
        "left"
    );

    // Window frame.

    box(
        group,
        3.6,
        3.2,
        0.12,
        0,
        3.4,
        -9.55,
        materials.darkWood
    );

    box(
        group,
        3.35,
        2.95,
        0.05,
        0,
        3.4,
        -9.47,
        new THREE.MeshStandardMaterial({
            color: 0x08172d,
            emissive: 0x061126,
            emissiveIntensity: 0.8,
            roughness: 0.3
        })
    );

    // Window dividers.

    box(
        group,
        0.08,
        2.9,
        0.05,
        0,
        3.4,
        -9.42,
        materials.darkWood
    );

    box(
        group,
        3.3,
        0.08,
        0.05,
        0,
        3.4,
        -9.42,
        materials.darkWood
    );

    // Door.

    createDoor(group);
}


// ============================================================
// DOOR
// ============================================================

function createDoor(group) {
    // Door itself.

    const door = box(
        group,
        3.0,
        4.0,
        0.2,
        0,
        2.0,
        -9.45,
        materials.darkWood,
        "door"
    );

    door.userData.name = "Locked Door";

    // Decorative inset.

    box(
        group,
        2.45,
        3.35,
        0.06,
        0,
        2.0,
        -9.32,
        materials.wood
    );

    box(
        group,
        2.15,
        3.05,
        0.04,
        0,
        2.0,
        -9.27,
        materials.darkWood
    );

    // Lock panel.

    box(
        group,
        0.45,
        0.65,
        0.14,
        1.0,
        2.1,
        -9.2,
        materials.blackMetal,
        "door"
    );

    // Handle.

    cylinder(
        group,
        0.06,
        0.06,
        0.18,
        -1.0,
        2.0,
        -9.17,
        materials.gold
    ).rotation.x = Math.PI / 2;

    // Green lock indicator.

    box(
        group,
        0.12,
        0.12,
        0.04,
        1.0,
        2.45,
        -9.1,
        materials.greenGlass
    );
}


// ============================================================
// LABORATORY EQUIPMENT
// ============================================================

function createLabBench(group, x, z, width = 5) {
    createDesk(
        group,
        x,
        z,
        width,
        1.8,
        1.05
    );

    // Metal legs.

    for (const dx of [-width / 2 + 0.25, width / 2 - 0.25]) {
        for (const dz of [-0.65, 0.65]) {
            box(
                group,
                0.12,
                1.0,
                0.12,
                x + dx,
                0.5,
                z + dz,
                materials.metal
            );
        }
    }
}


function createTestTube(
    group,
    x,
    y,
    z,
    liquidColor
) {
    const glass =
        new THREE.MeshStandardMaterial({
            color: 0xc8e6f2,
            metalness: 0.05,
            roughness: 0.12,
            transparent: true,
            opacity: 0.45
        });

    cylinder(
        group,
        0.12,
        0.12,
        0.7,
        x,
        y,
        z,
        glass,
        "labObject"
    ).userData.number = 3;

    cylinder(
        group,
        0.095,
        0.095,
        0.25,
        x,
        y - 0.2,
        z,
        new THREE.MeshStandardMaterial({
            color: liquidColor,
            emissive: liquidColor,
            emissiveIntensity: 0.15,
            roughness: 0.2
        })
    );
}


function createLabCharts(group) {
    // Periodic-table-style chart.

    createPainting(
        group,
        -1.8,
        4.2,
        -9.55,
        3.0,
        1.8,
        "back"
    );

    // Chart grid.

    const chartMaterial =
        new THREE.MeshStandardMaterial({
            color: 0xc9d8dc,
            roughness: 0.9
        });

    box(
        group,
        2.7,
        1.5,
        0.04,
        -1.8,
        4.2,
        -9.42,
        chartMaterial
    );

    for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 7; col++) {
            const cellColor = [
                0x729bb7,
                0x86a98a,
                0xc4b06f,
                0xb67b7b
            ][(row + col) % 4];

            box(
                group,
                0.29,
                0.2,
                0.025,
                -2.85 + col * 0.35,
                4.72 - row * 0.31,
                -9.38,
                new THREE.MeshStandardMaterial({
                    color: cellColor,
                    roughness: 0.8
                })
            );
        }
    }

    // Additional experiment charts.

    createPainting(
        group,
        2.2,
        4.1,
        -9.55,
        1.6,
        1.7,
        "back"
    );

    createPainting(
        group,
        4.5,
        4.1,
        -9.55,
        1.5,
        1.7,
        "back"
    );

    // Wall clock.

    cylinder(
        group,
        0.55,
        0.55,
        0.12,
        -5.0,
        4.0,
        -9.4,
        materials.blackMetal
    );

    cylinder(
        group,
        0.47,
        0.47,
        0.13,
        -5.0,
        4.0,
        -9.32,
        materials.white
    );

    // Clock hands.

    box(
        group,
        0.035,
        0.32,
        0.025,
        -5.0,
        4.08,
        -9.23,
        materials.blackMetal
    );

    box(
        group,
        0.27,
        0.035,
        0.025,
        -4.9,
        4.0,
        -9.23,
        materials.blackMetal
    );
}


function createMicroscope(group, x, z) {
    cylinder(
        group,
        0.42,
        0.42,
        0.12,
        x,
        1.25,
        z,
        materials.blackMetal,
        "labObject"
    ).userData.number = 7;

    box(
        group,
        0.25,
        0.75,
        0.25,
        x,
        1.65,
        z,
        materials.metal,
        "labObject",
        {
            userData: {
                number: 7,
                name: "Microscope"
            }
        }
    );

    box(
        group,
        0.2,
        0.18,
        0.7,
        x,
        2.05,
        z + 0.18,
        materials.blackMetal,
        "labObject",
        {
            userData: {
                number: 7,
                name: "Microscope"
            }
        }
    );
}


function createLab(group) {
    createFloor(
        group,
        new THREE.MeshStandardMaterial({
            color: 0x4b5259,
            roughness: 0.8
        })
    );

    createWalls(
        group,
        materials.labWall
    );

    // Cool laboratory lighting.

    addLight(
        group,
        0x8fcaff,
        22,
        25,
        0,
        4.8,
        0
    );

    addLight(
        group,
        0x4095ff,
        10,
        14,
        -5,
        3,
        0
    );

    addLight(
        group,
        0x53a9ff,
        10,
        14,
        5,
        3,
        0
    );

    // Laboratory benches.

    createLabBench(
        group,
        -5.8,
        -0.5,
        5
    );

    createLabBench(
        group,
        0,
        -3.8,
        6
    );

    createLabBench(
        group,
        5.7,
        -0.5,
        5
    );

    // Microscope.

    createMicroscope(
        group,
        -5.8,
        -0.5
    );

    // Numbered test tube.

    createTestTube(
        group,
        0,
        1.75,
        -3.8,
        0x19d8ff
    );

    createTestTube(
        group,
        0.65,
        1.75,
        -3.8,
        0x35e88b
    );

    createTestTube(
        group,
        1.3,
        1.75,
        -3.8,
        0xff5757
    );

    // Computer note.

    box(
        group,
        0.9,
        0.035,
        0.65,
        5.8,
        1.25,
        -0.5,
        materials.paper,
        "labObject",
        {
            userData: {
                number: 9,
                name: "Computer Note"
            }
        }
    );

    // Computer note markings.

    for (let i = 0; i < 4; i++) {
        box(
            group,
            0.5,
            0.008,
            0.015,
            5.8,
            1.275,
            -0.7 + i * 0.13,
            materials.darkWood
        );
    }

    // Laboratory terminal.

    box(
        group,
        1.5,
        1.2,
        0.15,
        0,
        2.0,
        -6.0,
        materials.blackMetal,
        "labTerminal"
    );

    box(
        group,
        1.3,
        0.95,
        0.035,
        0,
        2.0,
        -5.9,
        materials.screen
    );

    // Wall charts and clock.

    createLabCharts(group);

    // Wall cabinet.

    box(
        group,
        2.5,
        1.5,
        0.65,
        7.7,
        4.2,
        -5.5,
        materials.metal
    );

    box(
        group,
        2.3,
        1.3,
        0.05,
        7.7,
        4.2,
        -5.1,
        materials.screen
    );

    // Door.

    createDoor(group);
}

// ============================================================
// SECURITY ROOM
// ============================================================

function createSecurityCamera(
    group,
    x,
    y,
    z,
    rotationY = 0
) {
    const cameraHousing = box(
        group,
        0.55,
        0.35,
        0.55,
        x,
        y,
        z,
        materials.blackMetal
    );

    cameraHousing.rotation.y = rotationY;

    cylinder(
        group,
        0.13,
        0.13,
        0.18,
        x,
        y,
        z - 0.3,
        materials.metal
    );

    cylinder(
        group,
        0.085,
        0.085,
        0.04,
        x,
        y,
        z - 0.4,
        materials.screen
    );

    // Red status light.

    box(
        group,
        0.06,
        0.06,
        0.03,
        x + 0.15,
        y + 0.08,
        z - 0.42,
        new THREE.MeshStandardMaterial({
            color: 0xff2525,
            emissive: 0xff0000,
            emissiveIntensity: 1.2
        })
    );
}


function createMonitor(
    group,
    x,
    y,
    z,
    number
) {
    const monitor = box(
        group,
        1.25,
        0.85,
        0.13,
        x,
        y,
        z,
        materials.blackMetal,
        "monitor",
        {
            userData: {
                cameraNumber: number
            }
        }
    );

    // Screen surface.

    box(
        group,
        1.1,
        0.69,
        0.035,
        x,
        y,
        z + 0.08,
        new THREE.MeshStandardMaterial({
            color: 0x10253a,
            emissive: 0x12365a,
            emissiveIntensity: 0.65
        })
    );

    // Simulated CCTV feed lines.

    for (let i = 0; i < 4; i++) {
        box(
            group,
            0.85,
            0.025,
            0.015,
            x,
            y - 0.22 + i * 0.12,
            z + 0.11,
            new THREE.MeshStandardMaterial({
                color: 0x4a90b8,
                emissive: 0x102f49,
                emissiveIntensity: 0.5
            })
        );
    }

    // Stand.

    box(
        group,
        0.15,
        0.3,
        0.15,
        x,
        y - 0.55,
        z,
        materials.metal
    );

    return monitor;
}


function createSecurity(group) {
    createFloor(
        group,
        new THREE.MeshStandardMaterial({
            color: 0x202a34,
            roughness: 0.85
        })
    );

    createWalls(
        group,
        materials.darkWall
    );

    // Blue security lighting.

    addLight(
        group,
        0x6daeff,
        17,
        25,
        0,
        4.8,
        0
    );

    addLight(
        group,
        0x2865b2,
        10,
        15,
        -5,
        3,
        0
    );

    // Security desk.

    createDesk(
        group,
        -4.0,
        3.0,
        7.0,
        2.0,
        1.1
    );

    // Four monitors.

    for (let i = 0; i < 4; i++) {
        createMonitor(
            group,
            -6.3 + i * 1.55,
            2.1,
            2.2,
            i + 1
        );
    }

    // Desktop computer tower.

    box(
        group,
        0.55,
        1.0,
        0.75,
        -7.0,
        1.65,
        3.0,
        materials.blackMetal
    );

    // Security log paper.

    box(
        group,
        0.85,
        0.035,
        0.65,
        -2.2,
        1.25,
        3.0,
        materials.paper,
        "securityClue"
    );

    // Terminal.

    box(
        group,
        1.5,
        1.15,
        0.15,
        0,
        2.0,
        -5.7,
        materials.blackMetal,
        "securityComputer"
    );

    box(
        group,
        1.3,
        0.9,
        0.04,
        0,
        2.0,
        -5.6,
        materials.screen
    );

    // CCTV camera mounted high.

    createSecurityCamera(
        group,
        -7.0,
        5.25,
        -9.1
    );

    // Wall clock.

    cylinder(
        group,
        0.52,
        0.52,
        0.12,
        0,
        4.2,
        -9.4,
        materials.blackMetal
    );

    cylinder(
        group,
        0.44,
        0.44,
        0.13,
        0,
        4.2,
        -9.31,
        materials.white
    );

    box(
        group,
        0.035,
        0.28,
        0.025,
        0,
        4.27,
        -9.22,
        materials.blackMetal
    );

    box(
        group,
        0.25,
        0.035,
        0.025,
        0.1,
        4.2,
        -9.22,
        materials.blackMetal
    );

    // Investigation board.

    box(
        group,
        2.7,
        1.6,
        0.15,
        3.8,
        3.5,
        -9.4,
        materials.darkWood
    );

    box(
        group,
        2.5,
        1.4,
        0.05,
        3.8,
        3.5,
        -9.3,
        new THREE.MeshStandardMaterial({
            color: 0x394b5a,
            roughness: 0.95
        })
    );

    // Board notes.

    for (let i = 0; i < 5; i++) {
        box(
            group,
            0.3,
            0.25,
            0.03,
            3.0 + (i % 3) * 0.7,
            3.85 - Math.floor(i / 3) * 0.5,
            -9.25,
            materials.paper
        );
    }

    createDoor(group);
}


// ============================================================
// FINAL ESCAPE ROOM
// ============================================================

function createFinalRoom(group) {
    const stoneMaterial =
        new THREE.MeshStandardMaterial({
            color: 0x292526,
            roughness: 0.95
        });

    createFloor(
        group,
        new THREE.MeshStandardMaterial({
            color: 0x211c1b,
            roughness: 0.65
        })
    );

    createWalls(
        group,
        stoneMaterial
    );

    // Dramatic amber lighting.

    addLight(
        group,
        0xffa14a,
        20,
        24,
        0,
        4.5,
        0
    );

    addLight(
        group,
        0xffb65c,
        8,
        10,
        -7,
        3.5,
        0
    );

    addLight(
        group,
        0xffb65c,
        8,
        10,
        7,
        3.5,
        0
    );

    // Floor carpet.

    box(
        group,
        6.5,
        0.025,
        9,
        0,
        0.005,
        1,
        materials.carpet
    );

    // Central computer desk.

    createDesk(
        group,
        0,
        -1.5,
        4.5,
        1.8,
        1.15
    );

    // Final computer.

    box(
        group,
        2.1,
        1.35,
        0.16,
        0,
        2.1,
        -2.1,
        materials.blackMetal,
        "finalTerminal"
    );

    box(
        group,
        1.85,
        1.1,
        0.04,
        0,
        2.1,
        -2.0,
        new THREE.MeshStandardMaterial({
            color: 0x06131f,
            emissive: 0x0a2c48,
            emissiveIntensity: 1.0
        })
    );

    // Keyboard.

    box(
        group,
        1.3,
        0.05,
        0.45,
        0,
        1.3,
        -0.65,
        materials.blackMetal
    );

    // Paintings on the back wall.

    createPainting(
        group,
        -5.6,
        3.8,
        -9.55,
        2.3,
        2.6,
        "back"
    );

    createPainting(
        group,
        0,
        4.2,
        -9.55,
        3.4,
        2.0,
        "back"
    );

    createPainting(
        group,
        5.6,
        3.8,
        -9.55,
        2.3,
        2.6,
        "back"
    );

    // Side-wall paintings.

    createPainting(
        group,
        -9.55,
        3.4,
        -2.5,
        2.0,
        2.7,
        "left"
    );

    createPainting(
        group,
        9.55,
        3.4,
        -2.5,
        2.0,
        2.7,
        "right"
    );

    // Decorative wall lamps.

    for (const x of [-7.3, 7.3]) {
        box(
            group,
            0.25,
            0.45,
            0.18,
            x,
            3.0,
            -9.2,
            materials.gold
        );

        addLight(
            group,
            0xffa34b,
            4,
            7,
            x,
            3.0,
            -8.8
        );
    }

    // Small pedestal and statue-like decoration.

    box(
        group,
        0.9,
        1.0,
        0.9,
        -7.2,
        0.5,
        -4.0,
        materials.darkWood
    );

    cylinder(
        group,
        0.25,
        0.32,
        0.75,
        -7.2,
        1.4,
        -4.0,
        materials.gold
    );

    // Exit door.

    const exitDoor = box(
        group,
        3.2,
        4.3,
        0.2,
        0,
        2.15,
        -9.45,
        materials.darkWood,
        "door"
    );

    exitDoor.userData.name = "Final Exit";

    box(
        group,
        2.7,
        3.8,
        0.05,
        0,
        2.15,
        -9.32,
        materials.blackMetal
    );

    box(
        group,
        0.12,
        0.8,
        0.1,
        1.0,
        2.0,
        -9.22,
        materials.gold
    );
}

// ============================================================
// ROOM CREATION
// ============================================================

export function createRoom(roomNumber) {
    const group = new THREE.Group();

    if (roomNumber === 0) {
        createStudy(group);
    }

    if (roomNumber === 1) {
        createLab(group);
    }

    if (roomNumber === 2) {
        createSecurity(group);
    }

    if (roomNumber === 3) {
        createFinalRoom(group);
    }

    return group;
}
