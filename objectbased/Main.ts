namespace Particles {
    export import f = FudgeCore;

    window.addEventListener("load", hndLoad);
    let spark: HTMLImageElement = new Image();
    spark.src = "spark.png";

    function hndLoad(_event: Event): void {
        // firework();
        loadImages(["flame1.png", "flame2.png", "flame3.png", "flame4.png"], fire);
    }

    // function firework(): void {
    //     const canvas: HTMLCanvasElement = document.querySelector("canvas");
    //     let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
    //     let system: ParticleSystem = new ParticleSystem();

    //     let gravity: Force = accelerationf(new f.Vector2(0, 50));
    //     let drag: Force = dampingf(0.97);
    //     let wind: Force = (_particle: Particle, _deltaTime: number): void => {
    //         _particle.velocity.x += _deltaTime * Math.random() * 50;
    //     };

    //     system.forces.push(gravity);
    //     system.forces.push(drag);
    //     system.forces.push(wind);

    //     window.setInterval(
    //         () => {
    //             if (Math.random() < 0.01) {
    //                 emit(system, canvas.width, canvas.height);
    //             }
    //             system.update(1 / 30);
    //             ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    //             ctx.fillRect(0, 0, canvas.width, canvas.height);
    //             ctx.globalCompositeOperation = "lighter";
    //             renderCanvasImage(ctx, system.particles);
    //             ctx.globalCompositeOperation = "source-over";
    //         },
    //         1000 / 30);

    //     function emit(_system: ParticleSystem, _width: number, _height: number): void {
    //         let position: f.Vector2 = new f.Vector2(Math.random() * _width, Math.random() * _height);
    //         for (let index: number = 0; index < 100; index++) {
    //             let particle: Particle = new Particle(position.copy);
    //             let alpha: number = fuzzy(Math.PI);
    //             let radius: number = Math.random() * 100;
    //             particle.velocity.x = Math.cos(alpha) * radius;
    //             particle.velocity.y = Math.sin(alpha) * radius;
    //             particle.image = spark;
    //             particle.maxAge = fuzzy(0.5, 2);
    //             _system.particles.push(particle);
    //         }
    //     }
    // }

    function fire(_images: HTMLImageElement[]): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        let system: ParticleSystem = new ParticleSystem();

        let lift: Force = accelerationf(new f.Vector2(0, -50));
        let drag: Force = dampingf(0.975);
        let wind: Force = (_particle: Particle, _deltaTime: number): void => {
            _particle.velocity.x += _deltaTime * fuzzy(50);
        };

        system.forces.push(lift);
        system.forces.push(drag);
        system.forces.push(wind);

        window.setInterval(
            () => {
                while (Math.random() < 0.8) {
                    emit(system, _images, canvas.width, canvas.height);
                }
                system.update(1 / 30);
                ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "lighter";
                ctx.globalAlpha = 0.6;
                renderCanvasImage(ctx, system.particles, 5);
                ctx.globalAlpha = 1.0;
                ctx.globalCompositeOperation = "source-over";
            },
            1000 / 30);

        function emit(_system: ParticleSystem, images: HTMLImageElement[], _width: number, _height: number): void {
            let position: f.Vector2 = new f.Vector2(_width / 2 + fuzzy(5), _height / 2 + fuzzy(5) + _height / 4);
            let particle: Particle = new Particle(position);
            let alpha: number = fuzzy(Math.PI);
            let radius: number = Math.sqrt(Math.random() + 0.1) * 100;
            particle.image = choose(images);
            radius *= 32 / Math.max(25, <number>particle.image.width);

            particle.velocity.x = Math.cos(alpha) * radius;
            particle.velocity.y = Math.sin(alpha) * radius - 4;
            particle.angularVelocity = fuzzy(1.5);
            particle.angle = fuzzy(Math.PI);
            particle.maxAge = 5;
            _system.particles.push(particle);

        }
    }

    function fuzzy(_range: number, _base: number = 0): number {
        return (_base + Math.random() - 0.5) * _range * 2;
    }

    function choose(_array: CanvasImageSource[]): CanvasImageSource {
        return _array[Math.floor(Math.random() * _array.length)];
    }

    function renderCanvasImage(_ctx: CanvasRenderingContext2D, _particles: Particle[], _fade: number = 0): void {
        for (const particle of _particles) {
            _ctx.save();
            _ctx.globalAlpha *= (_fade - particle.age) / _fade;
            _ctx.translate(particle.position.x, particle.position.y);
            _ctx.rotate(particle.angle);
            _ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
            _ctx.restore();
        }
    }

    function accelerationf(_force: f.Vector2): Force {
        return (_particle: Particle, _deltaTime: number): void => {
            _particle.velocity.add(f.Vector2.SCALE(_force, _deltaTime));
        };
    }

    function dampingf(_damping: number): Force {
        return (_particle: Particle, _deltaTime: number): void => {
            _particle.velocity.scale(_damping);
        }
    }

    function loadImages(_sources: string[], _callback: { (images: HTMLImageElement[]): void }): void {
        let loaded: number = 0;
        let images: HTMLImageElement[] = [];
        function onload(): void { if (++loaded == _sources.length) _callback(images); }
        for (const src of _sources) {
            let image: HTMLImageElement = new Image();
            images.push(image);
            image.onload = onload;
            image.src = src;
        }
    }
}