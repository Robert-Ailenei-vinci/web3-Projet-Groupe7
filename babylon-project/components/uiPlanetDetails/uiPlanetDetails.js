export function uiPlanetDetails() {

    const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

    const rect = new BABYLON.GUI.Rectangle();
    rect.width = "350px";
    rect.height = "650px"; //put this back to 100% if you wish for the full lenght
    rect.horizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    rect.verticalAlignment = BABYLON.GUI.Control.VERTICAL_ALIGNMENT_BOTTOM;
    rect.background = "black";
    rect.alpha = 1;
    advancedTexture.addControl(rect);

    const grid = new BABYLON.GUI.Grid();
    grid.addColumnDefinition(0.5);
    grid.addColumnDefinition(0.5);
    grid.width = "100%";
    grid.height = "650px"; //put this back to 100% if you wish for the full lenght
    rect.addControl(grid);

    grid.rect = rect;
    
    return grid;
}

export function addRow(grid, label, value) {
    const rowIndex = grid.rowCount;
    const labelText = new BABYLON.GUI.TextBlock();
    labelText.text = label;
    labelText.color = "white";
    labelText.fontSize = 15;
    labelText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    labelText.paddingTop = "10px";
    labelText.paddingLeft = "10px";
    grid.addControl(labelText, rowIndex, 0);

    const valueText = new BABYLON.GUI.TextBlock();
    valueText.text = value;
    valueText.color = "white";
    valueText.fontSize = 15;
    valueText.textHorizontalAlignment = BABYLON.GUI.Control.HORIZONTAL_ALIGNMENT_LEFT;
    valueText.paddingTop = "10px";
    valueText.paddingLeft = "10px";
    grid.addControl(valueText, rowIndex, 1);

    grid.addRowDefinition(1); //this is the height of the row, make it larger if not enough place, make it smaller if else
}
