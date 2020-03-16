"use strict";
var Particles;
(function (Particles) {
    class Particle {
        constructor(_position = Particles.f.Vector2.ZERO()) {
            this.velocity = Particles.f.Vector2.ZERO();
            this.maxAge = Number.MAX_SAFE_INTEGER;
            this.age = 0;
            this.position = _position;
        }
        update(_deltaTime) {
            this.age += _deltaTime;
            this.position.add(Particles.f.Vector2.SCALE(this.velocity, _deltaTime));
            return this.age < this.maxAge;
        }
    }
    Particles.Particle = Particle;
    class ParticleSystem {
        constructor() {
            this.particles = [];
            this.forces = [];
        }
        update(_deltaTime) {
            let alive = [];
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
    Particles.ParticleSystem = ParticleSystem;
})(Particles || (Particles = {}));
