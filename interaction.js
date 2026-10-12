import * as THREE from
"https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const raycaster =
    new THREE.Raycaster();

const center =
    new THREE.Vector2(0, 0);


// =====================================================
// GET OBJECTS
// =====================================================

function findInteractiveObject(
    hitObject
) {

    let object =
        hitObject;

    while (
        object &&
        !object.userData?.type &&
        object.parent
    ) {

        object =
            object.parent;

    }

    if (
        object &&
        object.userData &&
        object.userData.type
    ) {

        return object;

    }

    return null;

}


// =====================================================
// CENTER RAYCAST
// Used by E / INTERACT
// =====================================================

export function getTarget(
    camera,
    objects
) {

    if (
        !camera ||
        !objects ||
        objects.length === 0
    ) {

        return null;

    }


    raycaster.setFromCamera(
        center,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            objects,
            true
        );


    for (
        const hit
        of hits
    ) {

        const object =
            findInteractiveObject(
                hit.object
            );

        if (object) {

            return object;

        }

    }


    // Nearby fallback

    const playerPosition =
        camera.position;

    let nearest = null;

    let nearestDistance = 3.5;


    for (
        const object
        of objects
    ) {

        if (
            !object ||
            !object.userData?.type
        ) {

            continue;

        }


        const worldPosition =
            new THREE.Vector3();


        object.getWorldPosition(
            worldPosition
        );


        const distance =
            playerPosition.distanceTo(
                worldPosition
            );


        if (
            distance < nearestDistance
        ) {

            nearest =
                object;

            nearestDistance =
                distance;

        }

    }


    return nearest;

}


// =====================================================
// CLICK / TOUCH RAYCAST
// Used when the player actually clicks an object
// =====================================================

export function getTargetAtScreen(
    camera,
    objects,
    clientX,
    clientY,
    element
) {

    if (
        !camera ||
        !objects ||
        !element
    ) {

        return null;

    }


    const rect =
        element.getBoundingClientRect();


    const mouse =
        new THREE.Vector2();


    mouse.x =
        (
            (clientX - rect.left)
            /
            rect.width
        ) * 2 - 1;


    mouse.y =
        -(
            (clientY - rect.top)
            /
            rect.height
        ) * 2 + 1;


    raycaster.setFromCamera(
        mouse,
        camera
    );


    const hits =
        raycaster.intersectObjects(
            objects,
            true
        );


    for (
        const hit
        of hits
    ) {

        const object =
            findInteractiveObject(
                hit.object
            );

        if (object) {

            return object;

        }

    }


    return null;

}