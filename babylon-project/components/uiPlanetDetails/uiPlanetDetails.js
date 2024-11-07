// createPlanetInfoUI.js

export function uiPlanetDetails() {
    // Create a full screen UI
    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    // Create a container for the text block
    const rect = new BABYLON.GUI.Rectangle();
    rect.width = "250px"; // Adjust the width as needed
    rect.height = "100%";
    rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    rect.background = "black";
    rect.alpha = 1; // Adjust transparency as needed
    advancedTexture.addControl(rect);

    // Create a text block
    const textBlock = new BABYLON.GUI.TextBlock();
    textBlock.text = "";
    textBlock.color = "white";
    textBlock.fontSize = 15;
    textBlock.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    textBlock.textVerticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_TOP;
    textBlock.paddingTop = "20px"; // Adjust padding as needed
    textBlock.paddingLeft = "-70px"; // Adjust padding as needed
    rect.addControl(textBlock);

    return textBlock;
}
