namespace ParticlesDeterministic {
    export import f = FudgeCore;

    window.addEventListener("load", hndLoad);
    let spark: HTMLImageElement = new Image();
    spark.src = "spark.png";
    let system: ParticleSystem = new ParticleSystem();
    let input: HTMLInputElement;

    function hndLoad(_event: Event): void {
        input = <HTMLInputElement>document.getElementById("time");
        document.addEventListener("keydown", handleKeyboard);
        firework();
        // loadImages(["flame1.png", "flame2.png", "flame3.png", "flame4.png"], fire);
    }

    function handleKeyboard(_event: KeyboardEvent): void {    
        if (_event.code == f.KEYBOARD_CODE.SPACE && _event.type == "keydown") {
            system.update(f.Time.game.get() * 0.001);
        }
      }

    function firework(): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");

        // let gravity: Force = accelerationf(new f.Vector2(0, 50));
        // let drag: Force = dampingf(0.97);
        // let wind: Force = (_particle: Particle, _deltaTime: number): void => {
        //     _particle.velocity.x += _deltaTime * Math.random() * 50;
        // };

        // system.forces.push(gravity);
        // system.forces.push(drag);
        // system.forces.push(wind);

        f.Loop.addEventListener(f.EVENT.LOOP_FRAME, update);
        f.Loop.start(f.LOOP_MODE.TIME_GAME, 60);
        emit(system, canvas.width, canvas.height);
        function update(_event: f.Eventƒ): void {
            // console.log(f.Time.game.get());
            // if (Math.random() < 0.01) {
            //     emit(system, canvas.width, canvas.height);
            // }
            // input.value = (f.Time.game.get() * 0.001).toString();
            system.update(input.valueAsNumber);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "lighter";
            renderCanvasImage(ctx, system.particles);
            ctx.globalCompositeOperation = "source-over";
        }
        // window.setInterval(
        //     () => {
        //         if (Math.random() < 0.01) {
        //             emit(system, canvas.width, canvas.height);
        //         }
        //         system.update(1 / 30);
        //         ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
        //         ctx.fillRect(0, 0, canvas.width, canvas.height);
        //         ctx.globalCompositeOperation = "lighter";
        //         renderCanvasImage(ctx, system.particles);
        //         ctx.globalCompositeOperation = "source-over";
        //     },
        //     1000 / 30);

        function emit(_system: ParticleSystem, _width: number, _height: number): void {
            let position: f.Vector2 = new f.Vector2(_width / 2, _height / 2); //new f.Vector2(Math.random() * _width, Math.random() * _height);
            for (let index: number = 0; index < 100; index++) {
            let particle: Particle = new Particle(position.copy);
            let alpha: number = fuzzy(Math.PI);
            let radius: number = Math.random() * 100;
            particle.velocity.x = Math.cos(alpha) * radius;
            particle.velocity.y = Math.sin(alpha) * radius;
            // particle.velocity.x = 50;
            // particle.velocity.y = 0;
            particle.image = spark;
            // particle.maxAge = fuzzy(0.5, 2);
            _system.particles.push(particle);
            }
        }
    }

    function fuzzy(_range: number, _base: number = 0): number {
        return (_base + Math.random() - 0.5) * _range * 2;
    }

    function renderCanvasImage(_ctx: CanvasRenderingContext2D, _particles: Particle[], _fade: number = 0): void {
        for (const particle of _particles) {
            _ctx.save();
            // _ctx.globalAlpha *= (_fade - particle.age) / _fade;
            _ctx.translate(particle.position.x, particle.position.y);
            // _ctx.rotate(particle.angle);
            _ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
            _ctx.restore();
        }
    }
}