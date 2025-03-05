let NRPTS = 10;
let varSpeed = 1; // will implement a speedSlider that mutiplies vx,vy by varSpeed
let bgColor = '#c7c7c7';

const COLORS = [
"#FA9189", "#FCAE7C", "#FFE699", "#F9FFB5", "#B3F5BC", 
"#D6F6FF", "#E2CBF7", "#D1BDFF"
];

class Particle {
    constructor(x, y, vx, vy, color) {
        this.initX = x;
        this.initY = y;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.radius = 8;
        this.trace = [{ x, y }];
    }

    draw(ctx, showTrace) {
        if (showTrace) {
            ctx.strokeStyle = this.color + "70";
            ctx.lineWidth = 20; //Adjust the trace width same as the particle diameter
            ctx.beginPath();
            for (let pos of this.trace) {
                ctx.lineTo(pos.x, pos.y);
            }
            ctx.stroke();
        }

        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fill();

        this.drawVelocityArrow(ctx);
    }

    drawVelocityArrow(ctx) {
        let speed = Math.sqrt(this.vx * this.vx + this.vy * this.vy);
        let arrowLength = speed * 10;
        let angle = Math.atan2(this.vy, this.vx);
        let endX = this.x + arrowLength * Math.cos(angle);
        let endY = this.y + arrowLength * Math.sin(angle);

        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(this.x, this.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();

        ctx.beginPath();
        ctx.moveTo(endX, endY);
        ctx.lineTo(endX - 5 * Math.cos(angle - Math.PI / 6), endY - 5 * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(endX - 5 * Math.cos(angle + Math.PI / 6), endY - 5 * Math.sin(angle + Math.PI / 6));
        ctx.lineTo(endX, endY);
        ctx.fillStyle = "black";
        ctx.fill();
    }

    update(canvas) {
        this.x += this.vx * varSpeed;
        this.y += this.vy * varSpeed;
        // left and right boundary
        if (this.x - this.radius <= 0) {
            this.x = this.radius; 
            this.vx *= -1; 
        } else if (this.x + this.radius >= canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -1;
        }
        // top and bottom boundary
        if (this.y - this.radius <= 0) {
            this.y = this.radius;
            this.vy *= -1;
        } else if (this.y + this.radius >= canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -1;
        }

        this.trace.push({ x: this.x, y: this.y });
    }

    reset() {
        // reset position to initial
        this.x = this.initX;
        this.y = this.initY;
        this.trace = [{ x: this.x, y: this.y }];
    }
}

class ParticleSystem {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.isAnimating = false;
        this.showTrace = true;
        this.interval = null;
        this.generateParticles(NRPTS);
    }

    generateParticles(count) {
        this.particles = [];
        for (let i = 0; i < count; i++) {
            let x = Math.random() * (this.canvas.width - 100) + 50;
            let y = Math.random() * (this.canvas.height - 100) + 50;
            let vx = (Math.random() - 0.5) * 10;
            let vy = (Math.random() - 0.5) * 10;
            this.particles.push(new Particle(x, y, vx, vy, COLORS[i % COLORS.length]));
        }
        this.resetAnimation();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        for (let particle of this.particles) {
            particle.draw(this.ctx, this.showTrace);
        }
    }

    update() {
        for (let particle of this.particles) {
            particle.update(this.canvas);
        }
    }
    
    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            document.getElementById("toggleAnimationBtn").textContent = "Stop Animation";
            this.interval = setInterval(() => {
                this.update();
                this.draw();
            }, 50);
        }
    }

    stopAnimation() {
        if (this.isAnimating) {
            clearInterval(this.interval);
            this.isAnimating = false;
            document.getElementById("toggleAnimationBtn").textContent = "Start Animation";
        }
    }

    resetAnimation() {
        this.stopAnimation();
        for (let particle of this.particles) {
            particle.reset();
        }
        this.draw();
    }
}

document.addEventListener("DOMContentLoaded", function () {
    var system = new ParticleSystem("pointCanvas");

    function generateParticles() {
        NRPTS = parseInt(document.getElementById("pointCount").value) || 3;
        system.generateParticles(NRPTS);
        system.draw();
    }

    function toggleAnimation() {
        if (system.isAnimating) {
            system.stopAnimation();
        } else {
            system.startAnimation();
        }
    }

    function toggleTrace(event) {
        system.showTrace = event.target.checked;
        system.draw();
    }

    function updateSpeed(event) {
        varSpeed = parseFloat(event.target.value);
        document.getElementById("speedValue").textContent = varSpeed.toFixed(2);
    }

    function updateCanvasColor(event) {
        const color = event.target.value;
        system.canvas.style.backgroundColor = color;
        document.getElementById("backgroundColorValue").textContent = color;
    }

    document.getElementById("generateBtn").addEventListener("click", generateParticles);
    document.getElementById("resetBtn").addEventListener("click", function () { system.resetAnimation(); });
    document.getElementById("toggleAnimationBtn").addEventListener("click", toggleAnimation);
    document.getElementById("traceCheckbox").addEventListener("change", toggleTrace);
    document.getElementById("speedSlider").addEventListener("input", updateSpeed);
    document.getElementById("backgroundColorSlider").addEventListener("input", updateCanvasColor);

    system.draw();
});