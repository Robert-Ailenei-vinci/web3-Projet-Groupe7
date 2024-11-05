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
        this.scene.activeCamera.radius = this.radius *3 ;

        
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
