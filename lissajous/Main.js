"use strict";
var LissaJous;
(function (LissaJous) {
    LissaJous.f = FudgeCore;
    LissaJous.fAid = FudgeAid;
    window.addEventListener("load", hndLoad);
    let root = new LissaJous.f.Node("Root");
    let viewport;
    let camera;
    let speedCameraRotation = 0.2;
    let speedCameraTranslation = 0.02;
    function hndLoad(_event) {
        const canvas = document.querySelector("canvas");
        LissaJous.f.RenderManager.initialize(true);
        LissaJous.f.Debug.log("Canvas", canvas);
        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        // canvas.addEventListener("mouseup", () => document.exitPointerLock());
        // setup orbiting camera
        camera = new LissaJous.fAid.CameraOrbit(new LissaJous.f.ComponentCamera());
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
        let node = new LissaJous.fAid.Node("Alpha", LissaJous.f.Matrix4x4.TRANSLATION(new LissaJous.f.Vector3(0, 0, 0)), material, mesh);
        root.addChild(node);
        viewport.draw();
        LissaJous.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        LissaJous.f.Loop.start(LissaJous.f.LOOP_MODE.TIME_GAME, 60);
        function update(_event) {
            viewport.draw();
        }
    }
    function hndPointerMove(_event) {
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
        // viewport.draw();
    }
    function hndWheelMove(_event) {
        camera.distance = camera.distance + _event.deltaY * speedCameraTranslation;
        // viewport.draw();
    }
})(LissaJous || (LissaJous = {}));
