namespace LissaJous {
    export import f = FudgeCore;
    export import fAid = FudgeAid;

    window.addEventListener("load", hndLoad);

    let root: f.Node = new f.Node("Root");
    let viewport: f.Viewport;
    let camera: fAid.CameraOrbit;
    let speedCameraRotation: number = 0.2;
    let speedCameraTranslation: number = 0.02;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.RenderManager.initialize(true);
        f.Debug.log("Canvas", canvas);


        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());

        // setup orbiting camera
        camera = new fAid.CameraOrbit(new f.ComponentCamera());
        root.addChild(camera);

        // setup viewport
        viewport = new f.Viewport();
        viewport.initialize("Viewport", root, camera.component, canvas);
        f.Debug.log("Viewport", viewport);

        // setup event handling
        viewport.activatePointerEvent(f.EVENT_POINTER.MOVE, true);
        viewport.activateWheelEvent(f.EVENT_WHEEL.WHEEL, true);
        viewport.addEventListener(f.EVENT_POINTER.MOVE, hndPointerMove);
        viewport.addEventListener(f.EVENT_WHEEL.WHEEL, hndWheelMove);


        let mesh: f.Mesh = new f.MeshQuad();
        let material: f.Material = new f.Material("Alpha", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("RED")))
        let node: f.Node = new fAid.Node("Alpha", f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)), material, mesh);
        root.addChild(node);

        viewport.draw();

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        function update(_event: f.Eventƒ): void {
            viewport.draw();
        }

    }

    function hndPointerMove(_event: f.EventPointer): void {
        if (!_event.buttons)
            return;
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
        // viewport.draw();
    }

    function hndWheelMove(_event: WheelEvent): void {
        camera.distance = camera.distance + _event.deltaY * speedCameraTranslation;
        // viewport.draw();
    }
}