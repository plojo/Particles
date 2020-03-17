declare namespace Particles {
    interface Force {
        (particle: Particle, deltaTime: number): void;
    }
    class Particle {
        position: f.Vector2;
        velocity: f.Vector2;
        angle: number;
        angularVelocity: number;
        image: CanvasImageSource;
        maxAge: number;
        age: number;
        constructor(_position?: f.Vector2);
        update(_deltaTime: number): boolean;
    }
    class ParticleSystem {
        particles: Particle[];
        forces: Force[];
        update(_deltaTime: number): void;
    }
}
