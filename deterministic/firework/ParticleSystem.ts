namespace ParticlesDeterministic {
    export interface Force {
        (particle: Particle, deltaTime: number): void;
    }

    export class Particle {
        public sourcePosition: f.Vector2;
        public position: f.Vector2;
        public velocity: f.Vector2 = f.Vector2.ZERO();
        public acceleration: f.Vector2 = new f.Vector2(0, 50);
        // public angle: number = 0;
        // public angularVelocity: number = 0;
        public image: CanvasImageSource;

        constructor(_position: f.Vector2 = f.Vector2.ZERO()) {
            this.sourcePosition = _position;
            this.position = this.sourcePosition.copy;
        }

        public update(_deltaTime: number): void {
            this.position = this.motion(_deltaTime);
        }
        // public maxAge: number = Number.MAX_SAFE_INTEGER;
        // public age: number = 0;
        private motion = (_deltaTime: number) => {
            // console.log(f.Vector2.SCALE(this.acceleration, 0.5 * Math.pow(_deltaTime, 2)).toString());
            // console.log(this.position.toString());
            return f.Vector2.SUM(this.sourcePosition, f.Vector2.SCALE(this.velocity, _deltaTime), f.Vector2.SCALE(f.Vector2.SCALE(this.acceleration, _deltaTime * _deltaTime), 1 / 2));
        }
        // public update(_deltaTime: number): boolean {
        // this.age += _deltaTime;
        // this.position.add(f.Vector2.SCALE(this.velocity, _deltaTime));
        // this.angle += this.angularVelocity * _deltaTime;
        // return this.age < this.maxAge;
        // }
    }

    export class ParticleSystem {
        public particles: Particle[] = [];
        // public forces: Force[] = [];

        public update(_deltaTime: number): void {
            for (const particle of this.particles) {
                particle.update(_deltaTime);
            }
        }
        // public update(_deltaTime: number): void {
        //     let alive: Particle[] = [];
        //     for (const particle of this.particles) {
        //         for (const force of this.forces) {
        //             force(particle, _deltaTime);
        //         }
        //         if (particle.update(_deltaTime)) {
        //             alive.push(particle);
        //         }
        //     }
        //     this.particles = alive;
        // }
    }
}