// Construct a particle
class Particle {
    constructor(x, y, radius, angle, velocity, color) {
      this.x = x;
      this.y = y;
      this.radius = radius;
      this.angle = angle;
      this.velocity = velocity;
      this.color = color;
    }

    angle() {
      return Math.atan2(this.y, this.x);
    }
  }
  
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle = ["red","blue","green","purple","pink","orange","brown","yellow"];
      ctx.stroke();
      ctx.closePath();
      

      const endX = this.position.x + this.velocity.x;
      const endY = this.position.y + this.velocity.y;
      
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle = ["red","blue","green","purple","pink","orange","brown","yellow"];
      ctx.stroke();
      
      const headLen = 10;
      const angle = Math.atan2(endY - this.position.y, endX - this.position.x);
      
      ctx.beginPath();
      ctx.moveTo(endX, endY);
      ctx.lineTo(
        endX - headLen * Math.cos(angle - Math.PI/6),
        endY - headLen * Math.sin(angle - Math.PI/6)
      );
      ctx.lineTo(
        endX - headLen * Math.cos(angle + Math.PI/6),
        endY - headLen * Math.sin(angle + Math.PI/6)
      );
      ctx.lineTo(endX, endY);
      ctx.fillStyle = ["red","blue","green","purple","pink","orange","brown","yellow"];
      ctx.fill();
      ctx.closePath();
    }
    
    update(dt) {
      const deltaPosition = this.velocity.scale(dt);
      this.position = this.position.add(deltaPosition);
    }
  }
  
  function init(canvasId) {
    const canvas = document.getElementById(canvasId);
    const ctx = canvas.getContext("2d");
    
    const point = new Point(new Vector(100, 100), new Vector(-40, 0));
    
    
    point.draw(ctx);
    
    return {
      canvas,
      ctx,
      point
    };
  }
  
  function animate(scene, dt = 0.05) {
    const { canvas, ctx, point } = scene;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    point.update(dt);
    point.draw(ctx);
  }