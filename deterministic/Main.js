"use strict";
var ParticlesDeterministic;
(function (ParticlesDeterministic) {
    ParticlesDeterministic.f = FudgeCore;
    window.addEventListener("load", hndLoad);
    let spark = new Image();
    spark.src = "spark.png";
    let system = new ParticlesDeterministic.ParticleSystem();
    let input;
    function hndLoad(_event) {
        input = document.getElementById("time");
        document.addEventListener("keydown", handleKeyboard);
        firework();
        // loadImages(["flame1.png", "flame2.png", "flame3.png", "flame4.png"], fire);
    }
    function handleKeyboard(_event) {
        if (_event.code == ParticlesDeterministic.f.KEYBOARD_CODE.SPACE && _event.type == "keydown") {
            system.update(ParticlesDeterministic.f.Time.game.get() * 0.001);
        }
    }
    function firework() {
        const canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        // let gravity: Force = accelerationf(new f.Vector2(0, 50));
        // let drag: Force = dampingf(0.97);
        // let wind: Force = (_particle: Particle, _deltaTime: number): void => {
        //     _particle.velocity.x += _deltaTime * Math.random() * 50;
        // };
        // system.forces.push(gravity);
        // system.forces.push(drag);
        // system.forces.push(wind);
        ParticlesDeterministic.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ParticlesDeterministic.f.Loop.start(ParticlesDeterministic.f.LOOP_MODE.TIME_GAME, 60);
        emit(system, canvas.width, canvas.height);
        function update(_event) {
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
        function emit(_system, _width, _height) {
            let position = new ParticlesDeterministic.f.Vector2(_width / 2, _height / 2); //new f.Vector2(Math.random() * _width, Math.random() * _height);
            for (let index = 0; index < 100; index++) {
                let particle = new ParticlesDeterministic.Particle(position.copy);
                let alpha = fuzzy(Math.PI);
                let radius = Math.random() * 100;
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
    function fuzzy(_range, _base = 0) {
        return (_base + Math.random() - 0.5) * _range * 2;
    }
    function choose(_array) {
        return _array[Math.floor(Math.random() * _array.length)];
    }
    function renderCanvasImage(_ctx, _particles, _fade = 0) {
        for (const particle of _particles) {
            _ctx.save();
            // _ctx.globalAlpha *= (_fade - particle.age) / _fade;
            _ctx.translate(particle.position.x, particle.position.y);
            // _ctx.rotate(particle.angle);
            _ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
            _ctx.restore();
        }
    }
    function accelerationf(_force) {
        return (_particle, _deltaTime) => {
            _particle.velocity.add(ParticlesDeterministic.f.Vector2.SCALE(_force, _deltaTime));
        };
    }
    function dampingf(_damping) {
        return (_particle, _deltaTime) => {
            _particle.velocity.scale(_damping);
        };
    }
    function loadImages(_sources, _callback) {
        let loaded = 0;
        let images = [];
        function onload() { if (++loaded == _sources.length)
            _callback(images); }
        for (const src of _sources) {
            let image = new Image();
            images.push(image);
            image.onload = onload;
            image.src = src;
        }
    }
})(ParticlesDeterministic || (ParticlesDeterministic = {}));
