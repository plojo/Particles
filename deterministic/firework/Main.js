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
    }
    function handleKeyboard(_event) {
        if (_event.code == ParticlesDeterministic.f.KEYBOARD_CODE.SPACE && _event.type == "keydown") {
            system.update(ParticlesDeterministic.f.Time.game.get() * 0.001);
        }
    }
    function firework() {
        const canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        ParticlesDeterministic.f.Loop.addEventListener("loopFrame" /* LOOP_FRAME */, update);
        ParticlesDeterministic.f.Loop.start(ParticlesDeterministic.f.LOOP_MODE.TIME_GAME, 60);
        emit(system, canvas.width, canvas.height);
        function update(_event) {
            system.update(input.valueAsNumber);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "lighter";
            renderCanvasImage(ctx, system.particles);
            ctx.globalCompositeOperation = "source-over";
        }
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
})(ParticlesDeterministic || (ParticlesDeterministic = {}));
