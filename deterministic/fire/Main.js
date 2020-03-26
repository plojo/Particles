"use strict";
var ParticlesDeterministicFire;
(function (ParticlesDeterministicFire) {
    ParticlesDeterministicFire.f = FudgeCore;
    ParticlesDeterministicFire.fAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let root = new ParticlesDeterministicFire.f.Node("Root");
    let particleSystem = new ParticlesDeterministicFire.ParticleSystem("System");
    let viewport;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        ParticlesDeterministicFire.f.RenderManager.initialize(false, true);
        ParticlesDeterministicFire.f.Debug.log("Canvas", canvas);
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        // setup orbiting camera
        camera = new ParticlesDeterministicFire.fAid.CameraOrbit(new ParticlesDeterministicFire.f.ComponentCamera(), 10);
        root.addChild(camera);
        // setup viewport
        viewport = new ParticlesDeterministicFire.f.Viewport();
        viewport.initialize("Viewport", root, camera.component, canvas);
        ParticlesDeterministicFire.f.Debug.log("Viewport", viewport);
        // setup event handling
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.activateWheelEvent("\u0192wheel" /* WHEEL */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.addEventListener("\u0192wheel" /* WHEEL */, hndWheelMove);
        let mesh = new ParticlesDeterministicFire.f.MeshCube();
        let material = new ParticlesDeterministicFire.f.Material("Alpha", ParticlesDeterministicFire.f.ShaderUniColor, new ParticlesDeterministicFire.f.CoatColored(ParticlesDeterministicFire.f.Color.CSS("RED")));
        root.addChild(particleSystem);
        particleSystem.addChild(particle(mesh, material));
        let lift = accelerationFunction(new ParticlesDeterministicFire.f.Vector3(0, 5, 0));
        let drag = dampingFunction(0.975);
        // let wind: Curve = (_translation: f.Vector3, _deltaTime: number): f.Vector3 => {
        //     _translation.x += _deltaTime * rand(.1);
        //     return _translation;
        // };
        let path = (_translation, _deltaTime) => {
            _translation.x += _deltaTime * 1;
            return _translation;
        };
        particleSystem.functions.push(lift);
        particleSystem.functions.push(drag);
        // particleSystem.functions.push(wind);
        particleSystem.functions.push(path);
        viewport.draw();
        // f.Time.game.setTimer(500, 20, () => {
        //     particles.addChild(particle(mesh, material));
        // });
        ParticlesDeterministicFire.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ParticlesDeterministicFire.f.Loop.start(ParticlesDeterministicFire.f.LOOP_MODE.TIME_GAME, 60);
        function update(_event) {
            let deltaTime = ParticlesDeterministicFire.f.Loop.timeFrameGame / 1000;
            particleSystem.update(deltaTime);
            viewport.draw();
        }
    }
    function particle(_mesh, _material) {
        let node = new ParticlesDeterministicFire.fAid.Node("Particle", ParticlesDeterministicFire.f.Matrix4x4.TRANSLATION(new ParticlesDeterministicFire.f.Vector3(0, 0, 0)), _material, _mesh);
        node.getComponent(ParticlesDeterministicFire.f.ComponentMesh).pivot.scale(new ParticlesDeterministicFire.f.Vector3(0.1, 0.1, 0.1));
        return node;
    }
    function hndPointerMove(_event) {
        if (!_event.buttons)
            return;
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
    }
    function hndWheelMove(_event) {
        camera.distance = camera.distance + _event.deltaY * speedCameraTranslation;
    }
    function rand(_range, _base = 0) {
        return (_base + Math.random() - 0.5) * _range * 2;
    }
    function accelerationFunction(_force) {
        return (_translation, _deltaTime) => {
            return ParticlesDeterministicFire.f.Vector3.SCALE(_force, (.5 * _deltaTime * _deltaTime));
            // _translation.add(f.Vector3.SCALE(_force, (.5 * _deltaTime * _deltaTime)));
        };
    }
    function dampingFunction(_damping) {
        return (_translation, _deltaTime) => {
            return ParticlesDeterministicFire.f.Vector3.SCALE(_translation, _damping);
        };
    }
})(ParticlesDeterministicFire || (ParticlesDeterministicFire = {}));
