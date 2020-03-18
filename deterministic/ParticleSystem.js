"use strict";
var ParticlesDeterministic;
(function (ParticlesDeterministic) {
    class Particle {
        constructor(_position = ParticlesDeterministic.f.Vector2.ZERO()) {
            this.velocity = ParticlesDeterministic.f.Vector2.ZERO();
            this.acceleration = new ParticlesDeterministic.f.Vector2(0, 50);
            // public maxAge: number = Number.MAX_SAFE_INTEGER;
            // public age: number = 0;
            this.motion = (_deltaTime) => {
                // console.log(f.Vector2.SCALE(this.acceleration, 0.5 * Math.pow(_deltaTime, 2)).toString());
                // console.log(this.position.toString());
                return ParticlesDeterministic.f.Vector2.SUM(this.sourcePosition, ParticlesDeterministic.f.Vector2.SCALE(this.velocity, _deltaTime), ParticlesDeterministic.f.Vector2.SCALE(ParticlesDeterministic.f.Vector2.SCALE(this.acceleration, _deltaTime * _deltaTime), 1 / 2));
            };
            this.sourcePosition = _position;
            this.position = this.sourcePosition.copy;
        }
        update(_deltaTime) {
            this.position = this.motion(_deltaTime);
        }
    }
    ParticlesDeterministic.Particle = Particle;
    class ParticleSystem {
        constructor() {
            this.particles = [];
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
        // public forces: Force[] = [];
        update(_deltaTime) {
            for (const particle of this.particles) {
                particle.update(_deltaTime);
            }
        }
    }
    ParticlesDeterministic.ParticleSystem = ParticleSystem;
})(ParticlesDeterministic || (ParticlesDeterministic = {}));
