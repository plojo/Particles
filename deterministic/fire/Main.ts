namespace ParticlesDeterministicFire {
    export import f = FudgeCore;
    export import fAid = FudgeAid;

    window.addEventListener("load", hndLoad);

    let root: f.Node = new f.Node("Root");
    let particleSystem: ParticleSystem = new ParticleSystem("System");
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

        let mesh: f.Mesh = new f.MeshCube();
        let material: f.Material = new f.Material("Alpha", f.ShaderUniColor, new f.CoatColored(f.Color.CSS("RED")));

        root.addChild(particleSystem);
        particleSystem.addChild(particle(mesh, material));

        let lift: Curve = accelerationFunction(new f.Vector3(0, 5, 0));
        let drag: Curve = dampingFunction(0.975);
        // let wind: Curve = (_translation: f.Vector3, _deltaTime: number): f.Vector3 => {
        //     _translation.x += _deltaTime * rand(.1);
        //     return _translation;
        // };
        let path: Curve = (_translation: f.Vector3, _deltaTime: number): f.Vector3 => {
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

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        function update(_event: f.Eventƒ): void {
            let deltaTime: number = f.Loop.timeFrameGame / 1000;
            particleSystem.update(deltaTime);
            viewport.draw();
        }

    }

    function particle(_mesh: f.Mesh, _material: f.Material): f.Node {
        let node: f.Node = new fAid.Node("Particle", f.Matrix4x4.TRANSLATION(new f.Vector3(0, 0, 0)), _material, _mesh);
        node.getComponent(f.ComponentMesh).pivot.scale(new f.Vector3(0.1, 0.1, 0.1));
        return node;
    }

    function hndPointerMove(_event: f.EventPointer): void {
        if (!_event.buttons)
            return;
        camera.rotateY(_event.movementX * speedCameraRotation);
        camera.rotateX(_event.movementY * speedCameraRotation);
    }

    function hndWheelMove(_event: WheelEvent): void {
        camera.distance = camera.distance + _event.deltaY * speedCameraTranslation;
    }

    function rand(_range: number, _base: number = 0): number {
        return (_base + Math.random() - 0.5) * _range * 2;
    }

    function accelerationFunction(_force: f.Vector3): Curve {
        return (_translation: f.Vector3, _deltaTime: number): f.Vector3 => {
            return f.Vector3.SCALE(_force, (.5 * _deltaTime * _deltaTime));
            // _translation.add(f.Vector3.SCALE(_force, (.5 * _deltaTime * _deltaTime)));
        };
    }

    function dampingFunction(_damping: number): Curve {
        return (_translation: f.Vector3, _deltaTime: number): f.Vector3 => {
            return f.Vector3.SCALE(_translation, _damping);
        };
    }
}