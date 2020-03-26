"use strict";
var ParticlesDeterministicFire;
(function (ParticlesDeterministicFire) {
    var f = FudgeCore;
    class ParticleSystem extends f.Node {
        constructor() {
            super(...arguments);
            // public particles: f.Node[] = [];
            this.functions = [];
            this.elapsedtime = 0;
        }
        update(_deltaTime) {
            this.elapsedtime += _deltaTime;
            let scaledTime = this.elapsedtime % 1;
            // console.log(scaledTime);
            for (const particle of this.getChildrenByName("Particle")) {
                let translation = particle.cmpTransform.local.translation;
                for (const curve of this.functions) {
                    translation = curve(translation, scaledTime);
                }
                particle.cmpTransform.local.translation = translation;
            }
        }
    }
    ParticlesDeterministicFire.ParticleSystem = ParticleSystem;
})(ParticlesDeterministicFire || (ParticlesDeterministicFire = {}));
