namespace LissaJous {
    export import f = FudgeCore;
    export import fAid = FudgeAid;

    window.addEventListener("load", hndLoad);

    let root: f.Node = new f.Node("Root");
    let particles: f.Node = new f.Node("Particles");
    let viewport: f.Viewport;
    let camera: fAid.CameraOrbit;
    let speedCameraRotation: number = 0.2;
    let speedCameraTranslation: number = 0.02;

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        f.RenderManager.initialize(false, true);
        f.Debug.log("Canvas", canvas);

        // enable unlimited mouse-movement (user needs to click on canvas first)
        canvas.addEventListener("mousedown", canvas.requestPointerLock);
        canvas.addEventListener("mouseup", () => document.exitPointerLock());

        // setup orbiting camera
        camera = new fAid.CameraOrbit(new f.ComponentCamera(), 10);
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
        let material: f.Material = new f.Material("Alpha", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("RED")));

        root.addChild(particles);
        particles.addChild(particle(mesh, material));


        viewport.draw();

        let omegaX: number = 1;
        let omegaY: number = 2;
        let phaseX: number = Math.PI / 2;
        let phaseY: number = 0;

        f.Time.game.setTimer(500, 20, () => {
            particles.addChild(particle(mesh, material));
        });

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        function update(_event: f.Eventƒ): void {
            let time: number = f.Time.game.get() * 0.001;
            for (const child of particles.getChildren()) {
                let x: number = move(time, lissaJous(omegaX, time, phaseX));
                let y: number = gravity(time, lissaJous(omegaY, time, phaseY));
                let translation: f.Vector3 = new f.Vector3(x, y, 0);
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

    function lissaJous(_time: number, _omega: number, _phase: number): number {
        return Math.sin(_omega * _time + _phase);
    }

    function move(_time: number, _value: number): number {
        return _value + Math.sin(_time * 0.1) * 2;
    }

    function gravity(_time: number, _value: number): number {
        return _value - 1 / 2 * _time * _time * 0.01; 
    }

    function particle(_mesh: f.Mesh, _material: f.Material): f.Node {
        let node: f.Node = new fAid.Node("Alpha", f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)), _material, _mesh);
        node.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(0.1, 0.1, 1));
        return node;
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