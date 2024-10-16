import CelestialBody from './components/CelestialBody.js';
import Skybox from './components/Skybox.js';

const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Créer et configurer la scène
const createScene = () => {
    const scene = new BABYLON.Scene(engine);

    // Créer la caméra principale (vue générale)
    const mainCamera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 4, 100, new BABYLON.Vector3(0, 10, 0), scene);
    mainCamera.attachControl(canvas, true);
    scene.activeCamera = mainCamera; // Définir la caméra principale

    // Gestionnaire pour le bouton de retour
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        scene.activeCamera = mainCamera; // Revenir à la caméra principale
    });

    // Ajouter une lumière hémisphérique
    const light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(1, 1, 0), scene);
    light.intensity = 0.7;

    // Créer la skybox
    const skybox = new Skybox("skyBox", 1000.0, "assets/textures/sky_texture.jpg", scene);

    return { scene, mainCamera };
};

// Charger les données depuis db.json et créer les corps célestes
const loadCelestialBodies = async (scene) => {
    const response = await fetch('./db.json');
    const data = await response.json();

    // Créer un tableau pour stocker les corps célestes
    const celestialBodies = [];

    // Itérer à travers chaque planète et créer un CelestialBody
    data.planets.forEach(planet => {
        const position = new BABYLON.Vector3(planet.distanceFromSun * 10, 0, 0); // Ajuster l'échelle
        const celestialBody = new CelestialBody(planet.name, planet.radius, position, planet.texture, scene);
        celestialBodies.push(celestialBody);
    });

    // Ajouter le Soleil comme un corps céleste
    data.astralBodies.forEach(sun => {
        const position = new BABYLON.Vector3(sun.distanceFromSun, 0, 0); // Position du soleil
        const celestialBody = new CelestialBody(sun.name, sun.radius, position, sun.texture, scene);
        celestialBodies.push(celestialBody);
    });

    return celestialBodies;
};

// Créer la scène
const { scene, mainCamera } = createScene();

// Charger les corps célestes
loadCelestialBodies(scene).then(celestialBodies => {
    // Lancer la boucle de rendu
    engine.runRenderLoop(() => {
        scene.render();

        // Faire tourner chaque corps céleste
        celestialBodies.forEach(body => {
            body.rotate(0.01); // Ajuster la vitesse de rotation ici
        });
    });
});

// Adapter la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    engine.resize();
});
