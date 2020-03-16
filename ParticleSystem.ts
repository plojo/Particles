namespace Particles {
    export interface Force {
        (particle: Particle, deltaTime: number): void;
    }

    export class Particle {
        public position: f.Vector2;
        public velocity: f.Vector2 = f.Vector2.ZERO();
        public maxAge: number = Number.MAX_SAFE_INTEGER;
        public image: CanvasImageSource;
        private age: number = 0;

        constructor(_position: f.Vector2 = f.Vector2.ZERO()) {
            this.position = _position;
        }

        public update(_deltaTime: number): boolean {
            this.age += _deltaTime;
            this.position.add(f.Vector2.SCALE(this.velocity, _deltaTime));
            return this.age < this.maxAge;
        }
    }

    export class ParticleSystem {
        public particles: Particle[] = [];
        public forces: Force[] = [];

        public update(_deltaTime: number): void {
            let alive: Particle[] = [];
            for (const particle of this.particles) {
                for (const force of this.forces) {
                    force(particle, _deltaTime);
                }
                if (particle.update(_deltaTime)) {
                    alive.push(particle);
                }
            }
            this.particles = alive;
        }
    }
}