import CelestialBody from './components/CelestialBody.js';
import { createShootingStar } from './shootingStars.js';
const canvas = document.getElementById('renderCanvas');
const engine = new BABYLON.Engine(canvas, true);

// Créer et configurer la scène
const createScene = () => {
    const scene = new BABYLON.Scene(engine);
    scene.clearColor = new BABYLON.Color4(0, 0, 0, 1); // Couleur de fond de la scène

    // Créer la caméra principale (vue générale)
    const mainCamera = new BABYLON.ArcRotateCamera("mainCamera", Math.PI / 4, Math.PI / 4, 100, new BABYLON.Vector3(0, 10, 0), scene);
    mainCamera.attachControl(canvas, true);
    scene.activeCamera = mainCamera; // Définir la caméra principale

    // Gestionnaire pour le bouton de retour
    const returnButton = document.getElementById('returnButton');
    returnButton.addEventListener('click', () => {
        scene.activeCamera = mainCamera; // Revenir à la caméra principale
        
    });




    
    // Ajouter une lumière point pour simuler le soleil
    const sunPointLight = new BABYLON.PointLight("sunPointLight", new BABYLON.Vector3(0, 0, 0), scene);
    sunPointLight.diffuse = new BABYLON.Color3(1, 1, 0.7); // Orange
    sunPointLight.specular = new BABYLON.Color3(1, 1, 0.8); // Jaune-rougeâtre
    sunPointLight.intensity = 1; // Augmenter l'intensité de la lumière

 // Ajouter une lumière hémisphérique pour l'éclairage ambiant
 //c est pour la patie de la planete qui n est pas illuminee directement par le soleil.
    const ambientLight = new BABYLON.HemisphericLight("ambientLight", new BABYLON.Vector3(0, 1, 0), scene);
    ambientLight.diffuse = new BABYLON.Color3(0.2, 0.2, 0.2); // Couleur diffuse de la lumière ambiante
    ambientLight.specular = new BABYLON.Color3(0, 0, 0); // Couleur spéculaire de la lumière ambiante
    ambientLight.groundColor = new BABYLON.Color3(0, 0, 0); // Couleur du sol de la lumière ambiante



    // Fonction pour créer un système de particules pour les étoiles
    const createStarParticleSystem = (color, number, type) => {
        const starParticleSystem = new BABYLON.ParticleSystem("stars", number, scene);
        starParticleSystem.particleTexture = new BABYLON.Texture("./skybox/blanc.png", scene); // Assurez-vous d'avoir une texture d'étoile
    
        // Configurer les particules
        starParticleSystem.color1 = color; // Couleur des particules
        starParticleSystem.color2 = color; // Couleur des particules
        starParticleSystem.colorDead = new BABYLON.Color4(0, 0, 0, 0); // Couleur des particules mortes
    
        starParticleSystem.minSize = 7; // Taille minimale des particules
        starParticleSystem.maxSize = 8; // Taille maximale des particules
    
        starParticleSystem.minLifeTime = Number.MAX_VALUE; // Durée de vie minimale des particules (infinie)
        starParticleSystem.maxLifeTime = Number.MAX_VALUE; // Durée de vie maximale des particules (infinie)
    
        starParticleSystem.emitRate = 10; // Taux d'émission des particules
    
        starParticleSystem.blendMode = BABYLON.ParticleSystem.BLENDMODE_ADD; // Mode de mélange des particules pour augmenter la luminosité
    
        starParticleSystem.gravity = new BABYLON.Vector3(0, 0, 0); // Gravité appliquée aux particules
    
        starParticleSystem.direction1 = new BABYLON.Vector3(0, 0, 0); // Direction des particules
        starParticleSystem.direction2 = new BABYLON.Vector3(0, 0, 0); // Direction des particules
    
        starParticleSystem.minAngularSpeed = 0; // Vitesse angulaire minimale des particules
        starParticleSystem.maxAngularSpeed = Math.PI; // Vitesse angulaire maximale des particules
    
        starParticleSystem.minEmitPower = 0.5; // Puissance d'émission minimale des particules
        starParticleSystem.maxEmitPower = 100; // Puissance d'émission maximale des particules
        starParticleSystem.updateSpeed = 0.01; // Vitesse de mise à jour du système de particules
    
        // Définir la fonction de positionnement des particules
        starParticleSystem.startPositionFunction = function(worldMatrix, positionToUpdate) {
            const position = randomPositionInHollowSphere(6000, 9000); // Distance minimale et maximale des étoiles
            BABYLON.Vector3.TransformCoordinatesToRef(position, worldMatrix, positionToUpdate);
        };
    
        // Démarrer le système de particules
        starParticleSystem.start();
    
        // Émettre toutes les particules manuellement
        starParticleSystem.manualEmitCount = starParticleSystem.getCapacity();
    
        // Désactiver l'émission continue
        starParticleSystem.emitRate = 0;
    
        // Ajouter une glow layer pour les étoiles de type "aura"
        if (type === "aura") {
            const glowLayer = new BABYLON.GlowLayer("glow", scene);
            glowLayer.intensity = 0.5; // Ajuster l'intensité de la glow layer
        }
    
        return starParticleSystem;
    };
    
    // Créer des systèmes de particules pour les étoiles de différentes couleurs
    createStarParticleSystem(new BABYLON.Color4(1, 1, 1, 1), 18000, "normale"); // Étoiles blanches
    createStarParticleSystem(new BABYLON.Color4(1, 1, 0, 1), 1000, "aura"); // Étoiles jaunes avec glow layer
    createStarParticleSystem(new BABYLON.Color4(1, 0.5, 0, 1), 500 , "aura"); // Étoiles cyan
    // Créer des étoiles filantes périodiquement
    const createRandomShootingStar = () => {
    const startPosition = randomPositionInHollowSphere(800, 2000);
    const endPosition = randomPositionInHollowSphere(800, 2000);
    const color = new BABYLON.Color3(1, 1, 1);

    createShootingStar(scene, startPosition, endPosition, color);
};

// Créer des étoiles filantes toutes les 5 secondes
setInterval(createRandomShootingStar, 5000);
  // Créer des nuages cosmiques
    return { scene, mainCamera };
};

// Fonction pour générer des positions aléatoires dans une sphère creuse
function randomPositionInHollowSphere(minRadius, maxRadius) {
    const u = Math.random();
    const v = Math.random();
    const theta = 2 * Math.PI * u;
    const phi = Math.acos(2 * v - 1);
    const r = Math.cbrt(Math.random() * (Math.pow(maxRadius, 3) - Math.pow(minRadius, 3)) + Math.pow(minRadius, 3));
    const sinTheta = Math.sin(theta);
    const cosTheta = Math.cos(theta);
    const sinPhi = Math.sin(phi);
    const cosPhi = Math.cos(phi);
    const x = r * sinPhi * cosTheta;
    const y = r * sinPhi * sinTheta;
    const z = r * cosPhi;
    return new BABYLON.Vector3(x, y, z);
}

// Charger les données depuis db.json et créer les corps célestes
const loadCelestialBodies = async (scene) => {
    const response = await fetch('./db.json');
    const data = await response.json();

    // Créer un tableau pour stocker les corps célestes
    const celestialBodies = [];

    // Itérer à travers chaque planète et créer un CelestialBody
    data.planets.forEach(planet => {
        const position = new BABYLON.Vector3(planet.distanceFromSun * 10, 0, 0); // Ajuster l'échelle
        const celestialBody = new CelestialBody(
            planet.name,
            planet.radius,
            planet.distanceFromSun * 10,
            planet.texture,
            scene,
            planet.orbitalPeriod
            
        );
        celestialBodies.push(celestialBody);
    });

    // Ajouter le Soleil comme un corps céleste
    data.astralBodies.forEach(sun => {
        const position = new BABYLON.Vector3(sun.distanceFromSun, 0, 0); // Position du soleil
        const celestialBody = new CelestialBody(sun.name, sun.radius, sun.distanceFromSun, sun.texture, scene);
        celestialBodies.push(celestialBody);
    });

    // Remplir le menu avec les astres
    populateCelestialMenu(celestialBodies);

    return celestialBodies;
};

// Créer la scène
const { scene, mainCamera } = createScene();

// Charger les corps célestes
loadCelestialBodies(scene).then(celestialBodies => {
    // Lancer la boucle de rendu
    engine.runRenderLoop(() => {
        scene.render();
        CelestialBody.updateCameraTarget();
        // Faire tourner chaque corps céleste
        celestialBodies.forEach(body => {
            body.updateOrbit(); // Ajuster la vitesse de rotation ici
        });
        if (CelestialBody.selectedPlanet) {
            scene.activeCamera.target = CelestialBody.selectedPlanet.mesh.position;
        }
    });
});

function populateCelestialMenu(celestialBodies) {
    const celestialList = document.getElementById('celestialList');

    celestialBodies.forEach(body => {
        const listItem = document.createElement('li');
        listItem.textContent = body.name;
        listItem.style.cursor = "pointer";
        listItem.style.padding = "5px";
        
        // Ajouter un écouteur de clic qui appelle handleInteraction de l'astre correspondant
        listItem.addEventListener('click', () => body.handleInteraction());

        celestialList.appendChild(listItem);
    });
}

// Adapter la taille du canvas lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    engine.resize();
});

const slider = document.getElementById("mySlider");
const outputSlider = document.getElementById("outputSlider");

outputSlider.innerHTML = `Vitesse: x${slider.value}`;

slider.oninput = function() {
    outputSlider.innerHTML = `Vitesse: x${slider.value}`;
    
    // Update the rotation speed for all planets
    CelestialBody.updateAllAnimationsSpeed(parseFloat(slider.value));
    
    // Ensure the camera follows the selected planet
    if (CelestialBody.selectedPlanet) {
        scene.activeCamera.target = CelestialBody.selectedPlanet.mesh.position;
    }
}
document.getElementById("mySlider").addEventListener("input", () => {
    CelestialBody.updateAllAnimationsSpeed();
});