const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Créer et configurer la caméra
    const camera = new BABYLON.ArcRotateCamera("camera1", Math.PI / 2, Math.PI / 2, 10, BABYLON.Vector3.Zero(), scene);
    camera.attachControl(canvas, true);

    // Ajouter une lumière hémisphérique pour éclairer la scène
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    // Créer une sphère représentant le Soleil
    const sphere = BABYLON.MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);

    // Appliquer un matériau émissif pour simuler la luminosité du Soleil
    const emissiveMaterial = new BABYLON.StandardMaterial("emissiveMaterial", scene);
    emissiveMaterial.emissiveColor = new BABYLON.Color3(1, 1, 0); // Couleur jaune pour simuler la lumière solaire
    emissiveMaterial.diffuseTexture = new BABYLON.Texture("assets/textures/texture_soleil.jpg", scene);

    sphere.material = emissiveMaterial;

    // Créer une skybox (cube)
    const skybox = BABYLON.MeshBuilder.CreateBox("skyBox", { size: 1000.0 }, scene);

    // Appliquer un matériau standard avec une seule image panoramique
    const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", scene);
    skyboxMaterial.backFaceCulling = false; // S'assurer que l'intérieur du cube est visible
    skyboxMaterial.reflectionTexture = new BABYLON.Texture("assets/textures/sky_texture.jpg", scene);
    skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE; // Utiliser le mode SKYBOX
    skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0); // Pas de couleur diffuse
    skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0); // Pas de réflexion spéculaire
    skyboxMaterial.disableLighting = true; // Désactiver l'éclairage pour la skybox

    skybox.material = skyboxMaterial;

    return scene;
};

// Créer la scène
const scene = createScene();

// Lancer la boucle de rendu
engine.runRenderLoop(() => {
    scene.render();

    // Faire tourner la sphère représentant le Soleil
    const soleilTourne = scene.getMeshByName("sphere");
    if (soleilTourne) {
        soleilTourne.rotation.y += 0.01; // Ajuster la vitesse de rotation ici
    }
});

// Adapter la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    engine.resize();
});
