import planetDataRetrieval from './api/planetDataRetrieval.js';
import { uiPlanetDetails, addRow } from './uiPlanetDetails/uiPlanetDetails.js';

class CelestialBody {
    static selectedPlanet = null; // Propriété statique pour la planète actuellement sélectionnée
    static allPlanets = [];

    constructor(name, radius, distanceFromSun, texture, scene,orbitalPeriod,rotationPeriod) {
        this.name = name;
        this.radius = radius;
        this.distanceFromSun = distanceFromSun;
        this.texture = texture;
        this.scene = scene;
        this.isDetailsVisible = false; // Détails non affichés par défaut
        this.orbitalPeriod = orbitalPeriod;
        this.orbitalSpeed = 0.1;
        this.angle = 0; // Vitesse de rotation par défaut
        this.rotationPeriod = rotationPeriod * 0.01;
        this.lastPosition = new BABYLON.Vector3(distanceFromSun, 0, 0); // Ajouter une propriété pour stocker la dernière position

        CelestialBody.allPlanets.push(this);

       

        // Create the mesh for the celestial body
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius, segments: 16 }, scene);
        this.mesh.position = new BABYLON.Vector3(this.distanceFromSun, 0, 0);;

        // Apply the material
        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);

        if (name.toLowerCase() !== "soleil") {
            // Définir la couleur spéculaire sur noir pour un matériau mat
            material.specularColor = new BABYLON.Color3(0, 0, 0);
            // Créer l'animation de l'orbite
            this.createOrbitAnimation();
        }

        if (name.toLowerCase() === "soleil") {
            material.emissiveColor = new BABYLON.Color3(1, 0.5, 0); // Couleur émissive orange

        // Create a glow layer for the halo effect
        const glowLayer = new BABYLON.GlowLayer("glow", scene);
        new BABYLON.GlowLayer("glow", scene, { 
            mainTextureFixedSize: 256,
            blurKernelSize: 64
        });
        glowLayer.intensity=10;
        }
        
        
        this.mesh.material = material;
     
        
        // Create the label for the celestial body
        this.createLabel();

        // Enable interaction with the celestial body's mesh
        this.mesh.actionManager = new BABYLON.ActionManager(scene);

        // Register an action for handling left-click on the mesh
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger,  () => {
            this.handleInteraction();
        }));
        // Update label visibility on each render
    }
    updateOrbit() {
        this.angle += this.orbitalSpeed;
        this.mesh.position.x = this.distanceFromSun * Math.cos(this.angle);
        this.mesh.position.z = this.distanceFromSun * Math.sin(this.angle);
    }
    static updateCameraTarget() {
        if (CelestialBody.selectedPlanet) {
            const selectedPlanet = CelestialBody.selectedPlanet;
            selectedPlanet.scene.activeCamera.target = selectedPlanet.mesh.position;
        }
    }
    static updateAllOrbitalSpeeds(newSpeed) {
        CelestialBody.allPlanets.forEach(planet => {
            planet.orbitalSpeed = newSpeed;
        });
    }

    rotate(speed) {
        this.mesh.rotation.y += speed;
    }

    // Créer un label 2D
    createLabel() {
        // Créer une texture dynamique pour le GUI
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Créer un label circulaire
        const circle = new BABYLON.GUI.Ellipse();
        circle.width = "60px";
        circle.height = "60px";
        circle.thickness = 2;
        circle.color = "white";
        circle.background = "black"; // Couleur de fond du cercle

        // Ajouter le texte dans le cercle
        const label = new BABYLON.GUI.TextBlock();
        label.text = this.name;
        label.color = "white";
        label.fontSize = 14;
        circle.addControl(label); // Ajouter le texte dans le cercle

        // Ajouter le cercle au GUI
        advancedTexture.addControl(circle);
        circle.linkWithMesh(this.mesh); // Attache le label à la position de la planète
        circle.linkOffsetX = this.radius + 119.5; // Positionne le label légèrement à côté de la planète
        circle.linkOffsetY = -this.radius + 3.5; // Ajuste légèrement la hauteur du label par rapport à la planète



        // Rendre le cercle cliquable
        circle.onPointerClickObservable.add(() => {
            this.handleInteraction();
        });

        // Stocker les références pour pouvoir ajuster la visibilité
        this.labelCircle = circle;
    }

    // Méthode pour gérer l'interaction Lors du clic sur un astre ou son label
    async handleInteraction() {
        // Si cette planète est déjà sélectionnée, ignorez le clic
        if (CelestialBody.selectedPlanet === this) return;

        // Masquer les détails de la planète précédemment sélectionnée
        if (CelestialBody.selectedPlanet) {
            CelestialBody.selectedPlanet.hideDetails(); // Masquer les détails de l'ancienne planète
        }

        // Mettre à jour la planète sélectionnée
        CelestialBody.selectedPlanet = this;

        // Créer ou configurer une caméra ArcRotate pour orbiter autour de la planète
        if (!this.orbitCamera) {
            this.orbitCamera = new BABYLON.ArcRotateCamera(
                `${this.name}OrbitCamera`,
                BABYLON.Tools.ToRadians(90), // angle horizontal de départ
                BABYLON.Tools.ToRadians(75), // angle vertical de départ
                this.radius * 10, // distance initiale de la caméra
                this.mesh.position.clone(), // point de focalisation (centre de la planète)
                this.scene
            );
            // Configuration des limites de la caméra
            this.orbitCamera.lowerRadiusLimit = this.radius * 2;
            this.orbitCamera.upperRadiusLimit = this.radius * 20;
            this.orbitCamera.angularSensibilityX = 1000; // Réduire la sensibilité de rotation
            this.orbitCamera.angularSensibilityY = 1000;
            this.orbitCamera.wheelPrecision = 50; // Ajuster la précision de la molette
        
            this.scene.onBeforeRenderObservable.add(() => {
                if (this.scene.activeCamera === this.orbitCamera) {
                    // Mettre à jour la position cible de la caméra en douceur
                    const targetPosition = this.mesh.position;
                    const smoothFactor = 0.1; // Facteur de lissage (ajuster selon les besoins)
                    
                    this.orbitCamera.target = BABYLON.Vector3.Lerp(
                        this.orbitCamera.target,
                        targetPosition,
                        smoothFactor
                    );
                }
            });
        } else {
            // Mettre à jour la position cible si la caméra existe déjà
            this.orbitCamera.target = this.mesh.position.clone();
        }

        // Basculer vers la caméra d'orbite
        this.scene.activeCamera = this.orbitCamera;
        this.orbitCamera.attachControl(this.scene.getEngine().getRenderingCanvas(), true); // Permettre le contrôle par l'utilisateur


        const grid = uiPlanetDetails();
        this.uiRect = grid.rect; // Stockez une référence dans l'instance de classe
        this.isDetailsVisible = true;


            // Évitez de rajouter plusieurs fois l'événement en vérifiant d'abord
            if (!this.returnButtonListenerAdded) {
                const returnButton = document.getElementById('returnButton');
                returnButton.addEventListener('click', () => {
                    this.hideDetails();
                    this.orbitCamera.detachControl(); // Détache le contrôle utilisateur de cette caméra
                    CelestialBody.selectedPlanet = null; // Réinitialisez la planète sélectionnée
                });
                this.returnButtonListenerAdded = true;
            }


            try {
                const planetDetails = await planetDataRetrieval(this.name);
                addRow(grid, '', ''); //placeholder for the first row of the table, DO NOT DELETE
                addRow(grid, "Nom:", planetDetails.name);
                addRow(grid, "Nom en anglais:", planetDetails.englishName);
                addRow(grid, "Est une planète:", planetDetails.isPlanet ? 'Oui' : 'Non');
                addRow(grid, "Lunes:", planetDetails.moons ? planetDetails.moons.length : 'Aucune');
                addRow(grid, "Aphélie:", `${planetDetails.aphelion} km`);
                addRow(grid, "Périhélie:", `${planetDetails.perihelion} km`);
                addRow(grid, "Demi-grand axe:", `${planetDetails.semimajorAxis} km`);
                addRow(grid, "Excentricité:", planetDetails.eccentricity);
                addRow(grid, "Inclinaison:", `${planetDetails.inclination}°`);
                addRow(grid, "Masse:", `${planetDetails.mass.massValue} x 10^${planetDetails.mass.massExponent} kg`);
                addRow(grid, "Volume:", `${planetDetails.vol.volValue} x 10^${planetDetails.vol.volExponent} km³`);
                addRow(grid, "Densité:", `${planetDetails.density} g/cm³`);
                addRow(grid, "Gravité:", `${planetDetails.gravity} m/s²`);
                addRow(grid, "Vitesse d'échappement:", `${planetDetails.escape} m/s`);
                addRow(grid, "Rayon moyen:", `${planetDetails.meanRadius} km`);
                addRow(grid, "Rayon équatorial:", `${planetDetails.equaRadius} km`);
                addRow(grid, "Rayon polaire:", `${planetDetails.polarRadius} km`);
                addRow(grid, "Aplatissement:", planetDetails.flattening);
                addRow(grid, "Inclinaison axiale:", `${planetDetails.axialTilt}°`);
                addRow(grid, "Température moyenne:", `${planetDetails.avgTemp} K`);
                addRow(grid, "Orbite sidérale:", `${planetDetails.sideralOrbit} jours`);
                addRow(grid, "Rotation sidérale:", `${planetDetails.sideralRotation} heures`);
            } catch (error) {
                console.error('Error fetching planet details:', error);
            }

    }

    hideDetails() {
        if (this.uiRect) {
            this.uiRect.alpha = 0; // Rendre le rectangle invisible
        }
        if (this.grid) {
            this.grid.dispose(); // Détruire la grille
            this.grid = null;
            this.uiRect = null;
            this.isDetailsVisible = false;
        }
    }
    


    static get speedMultiplier() {
        return document.getElementById("mySlider").value;
    }
    
    
    createOrbitAnimation() {
        // Créez une animation de position pour simuler une orbite circulaire
        const orbitAnimation = new BABYLON.Animation(
            `${this.name}OrbitAnimation`,
            "position",
            60, // fréquence d'images (frame rate)
            BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );

        // Définissez les étapes de l'animation
        const frames = [];
        const orbitPath = []; // Points pour dessiner la ligne d'orbite
        for (let i = 0; i <= 360; i += 1) {
            const radians = BABYLON.Tools.ToRadians(i);
            const x = Math.cos(radians) * this.distanceFromSun;
            const z = Math.sin(radians) * this.distanceFromSun;
            frames.push({ frame: i, value: new BABYLON.Vector3(x, 0, z) });
            orbitPath.push(new BABYLON.Vector3(x, 0, z)); // Ajouter le point au chemin d'orbite
        }

        // Appliquez les images-clés à l'animation
        orbitAnimation.setKeys(frames);

        // Ajoutez l'animation à la planète
        this.mesh.animations.push(orbitAnimation);

        // Démarrez l'animation avec une durée basée sur la période orbitale
        
        // Créez une ligne pour l'orbite
        this.orbitLine = BABYLON.MeshBuilder.CreateLines(`${this.name}OrbitLine`, { points: orbitPath }, this.scene);
        this.orbitLine.color = new BABYLON.Color3(1, 1, 1); // Couleur blanche pour la ligne d'orbite
        this.orbitLine.alpha = 0.2;
        
        // === Nouvelle Animation : Rotation de la planète sur elle-même ===
        const rotationAnimation = new BABYLON.Animation(
            `${this.name}RotationAnimation`,
            "rotation.y",
            60, // fréquence d'images (frame rate)
            BABYLON.Animation.ANIMATIONTYPE_FLOAT,
            BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE
        );
        
        const rotationFrames = [
            { frame: 0, value: 0 },
            { frame: 360, value: BABYLON.Tools.ToRadians(360) } // Une rotation complète
        ];
        
        rotationAnimation.setKeys(rotationFrames);

        // Ajoutez l'animation de rotation au mesh
        this.mesh.animations.push(rotationAnimation);

        this.scene.beginAnimation(this.mesh, 0, 360, true, (360 / this.orbitalPeriod / 30) * CelestialBody.speedMultiplier);
    }

    updateOrbitAnimationSpeed() {
        // Find the existing animation
        const animatable = this.scene.getAnimatableByTarget(this.mesh);
        if (animatable) {
            // Update the speed ratio of the animation
            animatable.speedRatio = (360 / this.orbitalPeriod / 30) * CelestialBody.speedMultiplier;
        }
    }
    
    static updateAllAnimationsSpeed(newSpeed) {
        CelestialBody.allPlanets.forEach(planet => {
            if (planet.name.toLowerCase() !== "soleil") {
                planet.orbitalSpeed = newSpeed;
                planet.updateOrbitAnimationSpeed();
            }
        });
        CelestialBody.updateCameraTarget();
    }
    
    static get speedMultiplier() {
        return parseFloat(document.getElementById("mySlider").value);
    }

}
// Exporter la classe pour l'utiliser dans d'autres fichiers
export default CelestialBody;
