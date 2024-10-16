class Skybox {
    constructor(name, size, textureUrl, scene) {
        this.mesh = BABYLON.MeshBuilder.CreateBox(name, { size: size }, scene);
        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.backFaceCulling = false; // S'assurer que l'intérieur du cube est visible
        material.reflectionTexture = new BABYLON.Texture(textureUrl, scene);
        material.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE; // Utiliser le mode SKYBOX
        material.diffuseColor = new BABYLON.Color3(0, 0, 0); // Pas de couleur diffuse
        material.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de réflexion spéculaire
        material.disableLighting = true; // Désactiver l'éclairage pour la skybox

        this.mesh.material = material;
    }
}

// Exporter la classe pour l'utiliser dans d'autres fichiers
export default Skybox;
