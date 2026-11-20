export class Visitor {

    constructor(scene, userData, images, x, y) {

        this.scene = scene;
        this.name = userData.Name;
        // this.gender = userData.Gender;

        this.initialX = x;
        this.initialY = y;

        this.sprite = scene.add.container(x, y);
        this.imageContainer = scene.add.container(0, 0);
        if (userData.Gender == 'Female') {
            this.backHair = scene.add.image(0, 0, images.back_hair[Math.floor(Math.random() * images.back_hair.length)]);
            this.head = scene.add.image(0, 0, images.head[Math.floor(Math.random() * images.head.length)]);
            this.body = scene.add.image(0, 0, images.body[Math.floor(Math.random() * images.body.length)]);
            this.frontHair = scene.add.image(0, 0, images.front_hair[Math.floor(Math.random() * images.front_hair.length)]);
            this.eyes = scene.add.image(0, 0, images.eyes[Math.floor(Math.random() * images.eyes.length)]);
            this.brows = scene.add.image(0, 0, images.brows[Math.floor(Math.random() * images.brows.length)]);
            this.nose = scene.add.image(0, 0, images.nose[Math.floor(Math.random() * images.nose.length)]);
            this.mouth = scene.add.image(0, 0, images.mouth[Math.floor(Math.random() * images.mouth.length)]);
            this.imageContainer.removeAll();
            this.imageContainer.add([
                this.backHair,
                this.head,
                this.body,
                this.frontHair,
                this.eyes,
                this.brows,
                this.nose,
                this.mouth
            ])
        }
        else {
            this.head = scene.add.image(0, 0, images.head[Math.floor(Math.random() * images.head.length)]);
            this.body = scene.add.image(0, 0, images.body[Math.floor(Math.random() * images.body.length)]);
            this.hair = scene.add.image(0, 0, images.hair[Math.floor(Math.random() * images.hair.length)]);
            this.eyes = scene.add.image(0, 0, images.eyes[Math.floor(Math.random() * images.eyes.length)]);
            this.brows = scene.add.image(0, 0, images.brows[Math.floor(Math.random() * images.brows.length)]);
            this.nose = scene.add.image(0, 0, images.nose[Math.floor(Math.random() * images.nose.length)]);
            this.mouth = scene.add.image(0, 0, images.mouth[Math.floor(Math.random() * images.mouth.length)]);
            this.beard = scene.add.image(0, 0, images.beard[Math.floor(Math.random() * images.beard.length)]);
            this.imageContainer.removeAll();
            this.imageContainer.add([
                this.head,
                this.body,
                this.hair,
                this.eyes,
                this.brows,
                this.nose,
                this.mouth,
                this.beard
            ])
        }
        this.imageContainer.each((child) => {
            if (child.setOrigin) {
                child.setOrigin(0.5, 1);
            }
            if (child.setTint) {
                child.setTint(0xffffff);
            }
        });

        this.sprite.add(this.imageContainer);

        this.sprite.setScale(4);



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