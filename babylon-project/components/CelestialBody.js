import planetDataRetrieval from './api/planetDataRetrieval.js';
import { uiPlanetDetails, addRow } from './uiPlanetDetails/uiPlanetDetails.js';

class CelestialBody {
    constructor(name, radius, position, texture, scene) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.texture = texture;
        this.scene = scene;

        // Define the min and max zoom limits
        this.minZoom = radius * 3.5;  // Minimum zoom in
        this.maxZoom = radius * 120;  // Maximum zoom out

        // Create the mesh for the celestial body
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius, segments: 16 }, scene);
        this.mesh.position = position;

        // Apply the material
        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.mesh.material = material;

        // Define a fixed camera offset position (adjusted for a good view)
        const cameraOffset = new BABYLON.Vector3(radius * 3, radius * 1.5, radius * 2);  // Adjust as needed

        // Create a TargetCamera for the celestial body
        this.camera = new BABYLON.TargetCamera(`${name}Camera`, position.add(cameraOffset), scene);

        // Set the camera's target to the celestial body
        this.camera.setTarget(this.mesh.position);

        // Attach the camera controls for interactivity
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        // Set up an event listener to handle zooming
        scene.getEngine().getRenderingCanvas().addEventListener('wheel', (event) => this.handleZoom(event));

        // Create the label for the celestial body
        this.createLabel();

        // Enable interaction with the celestial body's mesh
        this.mesh.actionManager = new BABYLON.ActionManager(scene);

        // Register an action for handling left-click on the mesh
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, async () => {
            this.handleInteraction();
            const grid = uiPlanetDetails();

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
        }));
        // Update label visibility on each render
        scene.onBeforeRenderObservable.add(() => this.updateLabelVisibility());
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

    // Méthode pour gérer l'interaction de zoom et de transparence
    handleInteraction() {
        // Zoomer sur la planète
        this.scene.activeCamera = this.camera;
        this.scene.activeCamera.radius = this.radius * 3;


    }

    // Met à jour la visibilité du label en fonction de la distance de la caméra et des obstructions
    updateLabelVisibility() {
        const camera = this.scene.activeCamera;
        const distance = BABYLON.Vector3.Distance(camera.position, this.mesh.position);

        // Ajuste l'opacité du label en fonction de la distance (seuil = radius * 5 par exemple)
        if (distance < this.radius * 5) {
            this.labelCircle.alpha = 0; // Rendre l'étiquette invisible quand proche
            // this.labelLine.alpha = 0; // Rendre l'étiquette invisible quand proche
            return;
        } else {
            this.labelCircle.alpha = 1; // Rendre l'étiquette visible quand éloigné
            //this.labelLine.alpha = 1; // Rendre l'étiquette visible quand éloigné
        }

        // Créer un rayon partant de la caméra vers le label
        const direction = this.mesh.position.subtract(camera.position).normalize();
        const ray = new BABYLON.Ray(camera.position, direction, distance);

        // Utiliser le raycast pour vérifier les collisions
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh !== this.mesh);

        // Rendre l'étiquette invisible si un autre corps céleste bloque la vue
        if (hit.hit) {
            this.labelCircle.alpha = 0; // Rendre l'étiquette invisible quand proche
            //this.labelLine.alpha = 0;
        } else {
            this.labelCircle.alpha = 1; // Rendre l'étiquette visible quand éloigné
            //this.labelLine.alpha = 1;
        }
    }

    // Méthode pour gérer le zoom avec la molette de la souris
    handleZoom(event) {
        const zoomFactor = 1.1; // Facteur de zoom de 10%

        if (this.scene.activeCamera === this.camera) {
            if (event.deltaY < 0) {
                // Zoom avant (molette vers le haut) - réduire le rayon
                this.camera.radius = Math.max(this.minZoom, this.camera.radius / zoomFactor);
            } else {
                // Zoom arrière (molette vers le bas) - augmenter le rayon
                this.camera.radius = Math.min(this.camera.radius * zoomFactor);
            }
        }
    }

}



// Exporter la classe pour l'utiliser dans d'autres fichiers
export default CelestialBody;
