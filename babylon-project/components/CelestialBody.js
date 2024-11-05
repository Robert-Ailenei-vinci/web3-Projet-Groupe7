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
        this.camera = new BABYLON.ArcRotateCamera(`${name}Camera`, Math.PI / 4, Math.PI / 4, radius + 4.5, position, scene);
        this.camera.attachControl(scene.getEngine().getRenderingCanvas(), true);

        // Positionner la caméra légèrement sur le côté du corps céleste
        this.camera.position.x += radius * 3;

        // Créer l'étiquette de texte
        this.createLabel();

        // Activer l'interaction avec le mesh du corps céleste
        this.mesh.actionManager = new BABYLON.ActionManager(scene);
        this.mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, () => {
            this.handleInteraction();
        }));
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
        this.scene.activeCamera.radius = this.radius * 3 ;

        // Rendre l'étiquette transparente
        if (this.labelRect) {
            this.labelRect.alpha = 0.2; // Ajuste l'opacité (0 pour invisible, 1 pour opaque)
        }
    }
}

export default CelestialBody;
