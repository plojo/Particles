declare namespace ParticlesDeterministic {
    interface Force {
        (particle: Particle, deltaTime: number): void;
    }
    class Particle {
        sourcePosition: f.Vector2;
        position: f.Vector2;
        velocity: f.Vector2;
        acceleration: f.Vector2;
        image: CanvasImageSource;
        constructor(_position?: f.Vector2);
        update(_deltaTime: number): void;
        private motion;
    }
    class ParticleSystem {
        particles: Particle[];
        update(_deltaTime: number): void;
    }
}
