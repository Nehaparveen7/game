let inventory = [];


export function resetInventory() {

    inventory = [];

    updateInventoryUI();

}


export function addItem(item) {

    if (!inventory.includes(item)) {

        inventory.push(item);

        updateInventoryUI();

        return true;
    }

    return false;
}


export function removeItem(item) {

    const index =
        inventory.indexOf(item);

    if (index !== -1) {

        inventory.splice(index, 1);

        updateInventoryUI();

    }

}


export function hasItem(item) {

    return inventory.includes(item);

}


export function getInventory() {

    return [...inventory];

}


function updateInventoryUI() {

    const element =
        document.getElementById(
            "inventoryItems"
        );

    if (!element) return;

    if (inventory.length === 0) {

        element.textContent =
            "Empty";

        return;
    }

    element.innerHTML =
        inventory
            .map(item => `🎒 ${item}`)
            .join("<br>");

}