declare namespace ParticlesDeterministicFire {
    import f = FudgeCore;
    interface Curve {
        (_translation: f.Vector3, _deltaTime: number): f.Vector3;
    }
    class ParticleSystem extends f.Node {
        functions: Curve[];
        private elapsedtime;
        update(_deltaTime: number): void;
    }
}
