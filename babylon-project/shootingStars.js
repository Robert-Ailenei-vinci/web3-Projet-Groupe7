export const createShootingStar = (scene, startPosition, endPosition, color) => {
    const shootingStar = BABYLON.MeshBuilder.CreateSphere("shootingStar", { diameter: 1 }, scene);
    shootingStar.position = startPosition;

    const trail = new BABYLON.TrailMesh("trail", shootingStar, scene, 0.2, 30, true);
    const trailMaterial = new BABYLON.StandardMaterial("trailMaterial", scene);
    trailMaterial.emissiveColor = color;
    
    // Attendre 5 seconde avant de créer la traînée
    setTimeout(() => {
        trail.material = trailMaterial;
    }, 5000);

    const animation = new BABYLON.Animation(
        "shootingStarAnimation",
        "position",
        30,
        BABYLON.Animation.ANIMATIONTYPE_VECTOR3,
        BABYLON.Animation.ANIMATIONLOOPMODE_CONSTANT
    );

    const keys = [
        { frame: 0, value: startPosition },
        { frame: 500, value: endPosition }
    ];

    animation.setKeys(keys);
    shootingStar.animations.push(animation);

    scene.beginAnimation(shootingStar, 0, 500, false, 1, () => {
        shootingStar.dispose();
        trail.dispose();
    });
};
