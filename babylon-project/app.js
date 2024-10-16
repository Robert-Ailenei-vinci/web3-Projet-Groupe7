// app.js
import CelestialBody from "./components/CelestialBody.js";
import Skybox from "./components/Skybox.js";

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Créer et configurer la scène
const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Créer la caméra principale (vue générale)
    const mainCamera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 2, Math.PI / 2, 20, BABYLON.Vector3.Zero(), scene);
    mainCamera.attachControl(canvas, true);
    scene.activeCamera = mainCamera; // Définir la caméra principale

    // Ajouter une lumière hémisphérique
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    // Créer le Soleil
    const sun = new CelestialBody("sun", 2, new BABYLON.Vector3(0, 0, 0), "assets/textures/texture_soleil.jpg", scene);
    sun.mesh.material.emissiveColor = new BABYLON.Color3(1, 1, 0); // Appliquer la couleur émissive

    // Créer la skybox
    const skybox = new Skybox("skyBox", 1000.0, "assets/textures/sky_texture.jpg", scene);

    // Créer une planète (exemple : la Terre)
    const earth = new CelestialBody("earth", 1, new BABYLON.Vector3(5, 0, 0), "assets/textures/earth_texture.jpg", scene);

    return { scene, sun, earth, mainCamera };
};

// Créer la scène
const { scene, sun, earth, mainCamera } = createScene();

// Gestionnaire pour le bouton de retour
const returnButton = document.getElementById('returnButton');
returnButton.addEventListener('click', () => {
    scene.activeCamera = mainCamera; // Revenir à la caméra principale
});

// Lancer la boucle de rendu
engine.runRenderLoop(() => {
    scene.render();

    // Faire tourner le Soleil et la Terre
    sun.rotate(0.01);
    earth.rotate(0.005); // Rotation plus lente pour la Terre
});

// Adapter la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    engine.resize();
});
