"use strict";
var Particles;
(function (Particles) {
    Particles.f = FudgeCore;
    window.addEventListener("load", hndLoad);
    let spark = new Image();
    spark.src = "spark.png";
    function hndLoad(_event) {
        // firework();
        loadImages(["flame1.png", "flame2.png", "flame3.png", "flame4.png"], fire);
    }
    function firework() {
        const canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        let system = new Particles.ParticleSystem();
        let gravity = accelerationf(new Particles.f.Vector2(0, 50));
        let drag = dampingf(0.97);
        let wind = (_particle, _deltaTime) => {
            _particle.velocity.x += _deltaTime * Math.random() * 50;
        };
        system.forces.push(gravity);
        system.forces.push(drag);
        system.forces.push(wind);
        window.setInterval(() => {
            if (Math.random() < 0.01) {
                emit(system, canvas.width, canvas.height);
            }
            system.update(1 / 30);
            ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.globalCompositeOperation = "lighter";
            renderCanvasImage(ctx, system.particles);
            ctx.globalCompositeOperation = "source-over";
        }, 1000 / 30);
        function emit(_system, _width, _height) {
            let position = new Particles.f.Vector2(Math.random() * _width, Math.random() * _height);
            for (let index = 0; index < 100; index++) {
                let particle = new Particles.Particle(position.copy);
                let alpha = fuzzy(Math.PI);
                let radius = Math.random() * 100;
                particle.velocity.x = Math.cos(alpha) * radius;
                particle.velocity.y = Math.sin(alpha) * radius;
                particle.image = spark;
                particle.maxAge = fuzzy(0.5, 2);
                _system.particles.push(particle);
            }
        }
    }
    function fire(_images) {
        const canvas = document.querySelector("canvas");
        let ctx = canvas.getContext("2d");
        let system = new Particles.ParticleSystem();
        let lift = accelerationf(new Particles.f.Vector2(0, -50));
        let drag = dampingf(0.975);
        let wind = (_particle, _deltaTime) => {
            _particle.velocity.x += _deltaTime * fuzzy(50);
        };
        system.forces.push(lift);
        system.forces.push(drag);
        system.forces.push(wind);
        window.setInterval(() => {
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
        }, 1000 / 30);
        function emit(_system, images, _width, _height) {
            let position = new Particles.f.Vector2(_width / 2 + fuzzy(5), _height / 2 + fuzzy(5) + _height / 4);
            let particle = new Particles.Particle(position);
            let alpha = fuzzy(Math.PI);
            let radius = Math.sqrt(Math.random() + 0.1) * 100;
            particle.image = choose(images);
            radius *= 32 / Math.max(25, particle.image.width);
            particle.velocity.x = Math.cos(alpha) * radius;
            particle.velocity.y = Math.sin(alpha) * radius - 4;
            particle.angularVelocity = fuzzy(1.5);
            particle.angle = fuzzy(Math.PI);
            particle.maxAge = 5;
            _system.particles.push(particle);
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
            _ctx.globalAlpha *= (_fade - particle.age) / _fade;
            _ctx.translate(particle.position.x, particle.position.y);
            _ctx.rotate(particle.angle);
            _ctx.drawImage(particle.image, -particle.image.width / 2, -particle.image.height / 2);
            _ctx.restore();
        }
    }
    function accelerationf(_force) {
        return (_particle, _deltaTime) => {
            _particle.velocity.add(Particles.f.Vector2.SCALE(_force, _deltaTime));
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
})(Particles || (Particles = {}));
