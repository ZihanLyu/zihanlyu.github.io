const NRSTEPS = 100;
let NRPTS = 10;

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
        ctx.lineWidth = 2;
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

update() {
    this.x += this.vx;
    this.y += this.vy;
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
        this.step = 0;
        this.isAnimating = false;
        this.showTrace = true;
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
        if (this.step < NRSTEPS) {
        for (let particle of this.particles) {
            particle.update();
        }
        this.step++;
        document.getElementById("stepCounter").textContent = this.step; // Update step counter
        } else {
        this.stopAnimation();
        }
    }


    startAnimation() {
        if (!this.isAnimating) {
            this.isAnimating = true;
            this.interval = setInterval(() => {
            this.update();
            this.draw();
            }, 50);
        }
    }

    stopAnimation() {
        clearInterval(this.interval);
        this.isAnimating = false;
    }

    resetAnimation() {
        this.stopAnimation();
        for (let particle of this.particles) {
            particle.reset();
        }
        // this.step = 0;
        // this.draw();
        this.step = 0;
        // reset the step counter
        document.getElementById("stepCounter").textContent = this.step;
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

document.getElementById("generateBtn").addEventListener("click", generateParticles);
document.getElementById("resetBtn").addEventListener("click", function () { system.resetAnimation(); });
document.getElementById("toggleAnimationBtn").addEventListener("click", toggleAnimation);
document.getElementById("traceCheckbox").addEventListener("change", toggleTrace);

system.draw();
});




