export class Visitor {

    constructor(scene, name, image, x, y) {

        this.scene = scene;
        this.name = name;
        this.image = image;

        this.sprite = scene.add.image(x, y, image);

        this.sprite.setScale(0.45);
        this.sprite.setOrigin(0.5, 1);
        this.sprite.setTint(0xffffff);

        this.isActive = false;
        this.ready = false;
        this.aiDiagnosis = false;
        // STORE TWEEN REFERENCES
        this.bobbingTween = null;
        this.movementTween = null;
    }
    //
    activate() {
        this.isActive = true;
    }

    deactivate() {
        this.isActive = false;
    }

    // BOBBING ANIMATION
    bobbing() {
        if (this.bobbingTween && this.bobbing) {
            return;
        }

        this.bobbingTween = this.scene.tweens.add({
            targets: this.sprite,
            y: this.sprite.y + 20,
            duration: 300,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1
        });
    }

    stopBobbing() {
        if (this.bobbingTween) {
            this.bobbingTween.pause();

            this.scene.tweens.add({
                targets: this.sprite,
                y: this.sprite.y,
                duration: 80,
                ease: 'Sine.easeInOut',
                repeat: 1
            });

            this.ready = true;
        }
    }

    resumeBobbing() {
        if (this.bobbingTween) {
            this.bobbingTween.resume();
        }
    }

    moveTo(targetX) {
        this.movementTween = this.scene.tweens.add({
            targets: this.sprite,
            x: targetX,
            duration: 4000,
            ease: 'Linear'
        })
    }

}