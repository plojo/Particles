"use strict";
var LissaJous;
(function (LissaJous) {
    LissaJous.f = FudgeCore;
    LissaJous.fAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let root = new LissaJous.f.Node("Root");
    let particles = new LissaJous.f.Node("Particles");
    let viewport;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        LissaJous.f.RenderManager.initialize(false, true);
        LissaJous.f.Debug.log("Canvas", canvas);
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());
        // setup orbiting camera
        camera = new LissaJous.fAid.CameraOrbit(new LissaJous.f.ComponentCamera(), 10);
        root.addChild(camera);
        // setup viewport
        viewport = new LissaJous.f.Viewport();
        viewport.initialize("Viewport", root, camera.component, canvas);
        LissaJous.f.Debug.log("Viewport", viewport);
        // setup event handling
        viewport.activatePointerEvent("\u0192pointermove" /* MOVE */, true);
        viewport.activateWheelEvent("\u0192wheel" /* WHEEL */, true);
        viewport.addEventListener("\u0192pointermove" /* MOVE */, hndPointerMove);
        viewport.addEventListener("\u0192wheel" /* WHEEL */, hndWheelMove);
        let mesh = new LissaJous.f.MeshQuad();
        let material = new LissaJous.f.Material("Alpha", LissaJous.f.ShaderUniColor, new LissaJous.f.CoatColored(LissaJous.f.Color.CSS("RED")));
        root.addChild(particles);
        particles.addChild(particle(mesh, material));
        viewport.draw();
        let omegaX = 1;
        let omegaY = 2;
        let phaseX = Math.PI / 2;
        let phaseY = 0;
        LissaJous.f.Time.game.setTimer(500, 20, () => {
            particles.addChild(particle(mesh, material));
        });
        LissaJous.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        LissaJous.f.Loop.start(LissaJous.f.LOOP_MODE.TIME_GAME, 60);
        function update(_event) {
            let time = LissaJous.f.Time.game.get() * 0.001;
            for (const child of particles.getChildren()) {
                let x = move(time, lissaJous(omegaX, time, phaseX));
                let y = gravity(time, lissaJous(omegaY, time, phaseY));
                let translation = new LissaJous.f.Vector3(x, y, 0);
                child.cmpTransform.local.translation = translation;
                // console.log(child);
                time -= 0.1;
            }
            // console.log(time);
            viewport.draw();
        }
    }
    // function update(_time: number): f.Vector3 {
    //     return new f.Vector3()
    // }
    function lissaJous(_time, _omega, _phase) {
        return Math.sin(_omega * _time + _phase);
    }
    function move(_time, _value) {
        return _value + Math.sin(_time * 0.1) * 2;
    }
    function gravity(_time, _value) {
        return _value - 1 / 2 * _time * _time * 0.01;
    }
    function particle(_mesh, _material) {
        let node = new LissaJous.fAid.Node("Alpha", LissaJous.f.Matrix4x4.TRANSLATION(new LissaJous.f.Vector3(0, 0, 0)), _material, _mesh);
        node.getComponent(LissaJous.f.ComponentMesh).pivot.scale(new LissaJous.f.Vector3(0.1, 0.1, 1));
        return node;
    }
    function hndPointerMove(_event) {
        if (!_event.buttons)
            return;
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
        // viewport.draw();
    }
    function hndWheelMove(_event) {
        camera.distance = camera.distance + _event.deltaY * speedCameraTranslation;
        // viewport.draw();
    }
})(LissaJous || (LissaJous = {}));
