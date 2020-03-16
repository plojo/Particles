namespace Particles {
    export import f = FudgeCore;

    window.addEventListener("load", hndLoad);
    let spark: HTMLImageElement = new Image();
    spark.src = "spark.png";

    function hndLoad(_event: Event): void {
        const canvas: HTMLCanvasElement = document.querySelector("canvas");
        let ctx: CanvasRenderingContext2D = canvas.getContext("2d");
        let system: ParticleSystem = new ParticleSystem();

        let gravity: Force = accelerationf(new f.Vector2(0, 50));
        let drag: Force = dampingf(0.97);
        let wind: Force = (_particle: Particle, _deltaTime: number): void => {
            _particle.velocity.x += _deltaTime * Math.random() * 50;
        };

        system.forces.push(gravity);
        system.forces.push(drag);
        system.forces.push(wind);

        emit(system, canvas.width, canvas.height);

        window.setInterval(
            () => {
                if (Math.random() < 0.01) {
                    emit(system, canvas.width, canvas.height);
                }
                system.update(1 / 30);
                ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
                ctx.fillRect(0, 0, canvas.width, canvas.height);
                ctx.globalCompositeOperation = "lighter";
                renderCanvasImage(ctx, system.particles);
                ctx.globalCompositeOperation = "source-over";
            },
            1000 / 30);
    }

    function fuzzy(_range: number, _base: number = 0): number {
        return (_base + Math.random() - 0.5) * _range * 2;
    }

    function choice(_array: any[]) {
        return _array[Math.floor(Math.random() * _array.length)];
    }

    function renderCanvasImage(_ctx: CanvasRenderingContext2D, _particles: Particle[], _fade: any = 0): void {
        for (const particle of _particles) {
            _ctx.save();
            _ctx.translate(particle.position.x, particle.position.y);
            _ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
            _ctx.restore();
        }
    }

    function emit(_system: ParticleSystem, _width: number, _height: number): void {
        let position: f.Vector2 = new f.Vector2(Math.random() * _width, Math.random() * _height);
        for (let index: number = 0; index < 100; index++) {
            let particle: Particle = new Particle(position.copy);
            let alpha: number = fuzzy(Math.PI);
            let radius: number = Math.random() * 100;
            particle.velocity.x = Math.cos(alpha) * radius;
            particle.velocity.y = Math.sin(alpha) * radius;
            particle.image = spark;
            particle.maxAge = fuzzy(0.5, 2);
            _system.particles.push(particle);
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

}