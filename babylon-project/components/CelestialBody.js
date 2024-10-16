class CelestialBody {
    constructor(name, radius, position, texture, scene) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.texture = texture;
        this.scene = scene;

        // Créer le mesh pour le corps céleste
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius, segments: 16 }, scene);
        this.mesh.position = position;

        // Appliquer le matériau
        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.mesh.material = material;

        // Créer la caméra pour ce corps céleste
        this.camera = new BABYLON.ArcRotateCamera(`${name}Camera`, Math.PI / 4, Math.PI / 4, radius * 3, position, scene);
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);
        
        // Positionner la caméra légèrement sur le côté du corps céleste
        this.camera.position.x += radius * 3; // Adjust this value to position the camera further away or to the side

        // Activer l'interaction avec le corps céleste
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            scene.activeCamera = this.camera; // Passer à la caméra du corps céleste
        }));
    }

    rotate(speed) {
        this.mesh.rotation.y += speed;
    }
}


// Exporter la classe pour l'utiliser dans d'autres fichiers
export default CelestialBody;
