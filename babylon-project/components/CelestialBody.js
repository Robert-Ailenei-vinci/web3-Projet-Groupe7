// CelestialBody.js
class CelestialBody {
    constructor(name, size, position, textureUrl, scene) {
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: size }, scene);
        this.mesh.position = position;

        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(textureUrl, scene);
        this.mesh.material = material;

        // Créer une caméra attachée au corps céleste
        this.camera = new BABYLON.ArcRotateCamera(`${name}Camera`, Math.PI / 2, Math.PI / 2, size * 3, this.mesh.position, scene);
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        this.camera.lowerRadiusLimit = size; // Limite de distance pour la caméra
        this.camera.upperRadiusLimit = size * 10; // Limite supérieure pour la caméra

        // Activer l'interaction avec le corps céleste
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            scene.activeCamera = this.camera; // Passer à la caméra du corps céleste
        }));
    }

    // Fonction pour faire tourner le corps céleste
    rotate(speed) {
        this.mesh.rotation.y += speed;
    }
}

// Exporter la classe pour l'utiliser dans d'autres fichiers
export default CelestialBody;
