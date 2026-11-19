export class Visitor {

    constructor(scene, userData, image, x, y) {

        this.scene = scene;
        this.name = userData.Name;

        this.initialX = x;
        this.initialY = y;

        this.sprite = scene.add.container(x, y);
        this.image = scene.add.image(0, 0, image);
        this.image.setOrigin(0.5, 1);
        this.image.setTint(0xffffff);
        this.sprite.add(this.image);

        this.sprite.setScale(0.45);
        // this.sprite.each((child) => {
        //     if (child.setTint) {
        //         child.setTint(0xff0000);
        //     }
        // });


        this.isActive = false;
        this.ready = false;
        this.AiDiagnosis = null;
        this.isAi = false;
        // STORE TWEEN REFERENCES
        this.bobbingTween = null;
        this.movementTween = null;

        // Store this character's diagnoses
        this.userDiagnoses = {

            temperature: {
                highTemperature: null,
                lowTemperature: null,
                normalTemperature: null
            },

            memory: {
                easyMemory: null,
                mediumMemory: null,
                hardMemory: null
            },

            shake: {
                hardShake: null,
                mediumShake: null,
                lightShake: null
            }

        };
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