namespace ParticlesDeterministicFire {
    import f = FudgeCore;

    export interface Curve {
        (_translation: f.Vector3, _deltaTime: number): f.Vector3;
    }

    export class ParticleSystem extends f.Node {
        // public particles: f.Node[] = [];
        public functions: Curve[] = [];
        private elapsedtime: number = 0;

        public update(_deltaTime: number): void {
            this.elapsedtime += _deltaTime;
            let scaledTime: number = this.elapsedtime % 1;
            // console.log(scaledTime);
            for (const particle of this.getChildrenByName("Particle")) {
                let translation: f.Vector3 = particle.cmpTransform.local.translation;
                for (const curve of this.functions) {
                    translation = curve(translation, scaledTime);
                }
                particle.cmpTransform.local.translation = translation;
            }
        }
    }
}