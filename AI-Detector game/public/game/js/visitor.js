export class Visitor {

    constructor(scene, name, image, x, y, tint) {

        this.name = name;
        this.image = image;

        this.sprite = scene.add.image(x, y, image);

        this.sprite.setScale(0.45);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setTint(0xffffff);

        this.isActive = false;
    }
    //
    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

}