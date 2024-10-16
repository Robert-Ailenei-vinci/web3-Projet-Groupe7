class CelestialBody {
    constructor(name, size, position, textureUrl, scene) {
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: size }, scene);
        this.mesh.position = position;

        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(textureUrl, scene);
        this.mesh.material = material;
    }

    // Fonction pour faire tourner le corps céleste
    rotate(speed) {
        this.mesh.rotation.y += speed;
    }
}

// Exporter la classe pour l'utiliser dans d'autres fichiers
export default CelestialBody;
