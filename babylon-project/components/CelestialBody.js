import planetDataRetrieval from './api/planetDataRetrieval.js'

class CelestialBody {
    
    constructor(name, radius, position, texture, scene) {
        this.name = name;
        this.radius = radius;
        this.position = position;
        this.texture = texture;
        this.scene = scene;

        // Définir les limites de zoom
        this.minZoom = radius * 3.5;  // Zoom avant minimum
        this.maxZoom = radius * 120; // Zoom arrière maximum

        // Créer le mesh pour le corps céleste
        this.mesh = BABYLON.MeshBuilder.CreateSphere(name, { diameter: radius, segments: 16 }, scene);
        this.mesh.position = position;

        // Appliquer le matériau
        const material = new BABYLON.StandardMaterial(`${name}Material`, scene);
        material.diffuseTexture = new BABYLON.Texture(texture, scene);
        this.mesh.material = material;

        // Créer la caméra pour ce corps céleste
        this.camera = new BABYLON.ArcRotateCamera(`${name}Camera`, Math.PI / 4, Math.PI / 4, this.minZoom , position, scene);
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        // Positionner la caméra légèrement sur le côté du corps céleste
        //this.camera.position.x += radius * 3;

        // Créer l'étiquette de texte
        this.createLabel();

    

        // Configurer l'écouteur de molette pour gérer le zoom par pourcentage
        scene.getEngine().getRenderingCanvas().addEventListener('wheel', (event) => this.handleZoom(event));


        // Activer l'interaction avec le mesh du corps céleste
        this.mesh.actionManager = new BABYLON.ActionManager(scene);

        // Enregistrer une action pour gérer le clic gauche sur le mesh
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            this.handleInteraction();
            
        }));

        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, async () => {
            try {
                const planetDetails = await planetDataRetrieval(this.name);
                console.log('Fetched Planet Details:', planetDetails);
            } catch (error) {
                console.error('Error fetching planet details:', error);
            }
        }));


        // Appeler la mise à jour de la visibilité du label dans la boucle de rendu
        scene.onBeforeRenderObservable.add(() => this.updateLabelVisibility());
    }

    rotate(speed) {
        this.mesh.rotation.y += speed;
    }

    // Créer un label 2D
    createLabel() {
        // Créer une texture dynamique pour le GUI
        const advancedTexture = BABYLON.GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");

        // Créer le texte de l'étiquette
        const label = new BABYLON.GUI.TextBlock();
        label.text = this.name;
        label.color = "white";
        label.fontSize = 24;

        // Conteneur pour positionner l'étiquette par rapport à la planète
        this.labelRect = new BABYLON.GUI.Rectangle();
        this.labelRect.width = "150px";
        this.labelRect.height = "40px";
        this.labelRect.thickness = 0;
        this.labelRect.linkOffsetY = -this.radius * 2;
        this.labelRect.addControl(label);

        // Lier l'étiquette à la planète
        advancedTexture.addControl(this.labelRect);
        this.labelRect.linkWithMesh(this.mesh);

        // Rendre l'étiquette cliquable
        this.labelRect.onPointerClickObservable.add(() => {
            this.handleInteraction();
        });
    }

    // Méthode pour gérer l'interaction de zoom et de transparence
    handleInteraction() {
        // Zoomer sur la planète
        this.scene.activeCamera = this.camera;
        this.scene.activeCamera.radius = this.radius *3 ;

        
    }

    // Met à jour la visibilité du label en fonction de la distance de la caméra et des obstructions
    updateLabelVisibility() {
        const camera = this.scene.activeCamera;
        const distance = BABYLON.Vector3.Distance(camera.position, this.mesh.position);

        // Ajuste l'opacité du label en fonction de la distance (seuil = radius * 5 par exemple)
        if (distance < this.radius * 5) {
            this.labelRect.alpha = 0; // Rendre l'étiquette invisible quand proche
            return;
        } else {
            this.labelRect.alpha = 1; // Rendre l'étiquette visible quand éloigné
        }

        // Créer un rayon partant de la caméra vers le label
        const direction = this.mesh.position.subtract(camera.position).normalize();
        const ray = new BABYLON.Ray(camera.position, direction, distance);

        // Utiliser le raycast pour vérifier les collisions
        const hit = this.scene.pickWithRay(ray, (mesh) => mesh !== this.mesh);

        // Rendre l'étiquette invisible si un autre corps céleste bloque la vue
        if (hit.hit) {
            this.labelRect.alpha = 0; // Rendre l'étiquette transparente si obstruée
        } else {
            this.labelRect.alpha = 1; // Rendre l'étiquette visible si non obstruée
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
