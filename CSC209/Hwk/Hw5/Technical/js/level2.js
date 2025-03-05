// Construct a vector class
class Vector {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    } // the center of the circle
    
    add(vector) {
      return new Vector(this.x + v.x, this.y + v.y);
    }
    
    subtract(vector) {
      return new Vector(this.x - v.x, this.y - v.y);
    }
    
    scale(scalar) {
      return new Vector(this.x * scalar, this.y * scalar);
    }
    
    magnitude() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    normalize() {
      const mag = this.magnitude();
      if (mag === 0) return new Vector(0, 0);
      return new Vector(this.x / mag, this.y / mag);
    }
    
    angle() {
      return Math.atan2(this.y, this.x);
    }
  }
  
  class Point {
    constructor(position, velocity) {
      this.position = position;
      this.velocity = velocity;
    }
    
    draw(ctx) {
      ctx.beginPath();
      ctx.arc(this.position.x, this.position.y, 20, 0, 2 * Math.PI);
      ctx.lineWidth = 2;
      ctx.strokeStyle;
      ctx.stroke();
      ctx.closePath();
      

      const endX = this.position.x + this.velocity.x;
      const endY = this.position.y + this.velocity.y;
      
      ctx.beginPath();
      ctx.moveTo(this.position.x, this.position.y);
      ctx.lineTo(endX, endY);
      ctx.lineWidth = 2;
      ctx.strokeStyle;
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
      ctx.fillStyle;
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

    const points = [
        new Point(new Vector(100, 100), new Vector(-40, 0), "red"),
        new Point(new Vector(250, 200), new Vector(0, -30), "blue"),
        new Point(new Vector(400, 300), new Vector(-20, 20), "green")
      ];
    
    for (let i = 0; i < points.length; i++) {
    points[i].draw(ctx);
    }
    
    return {
      canvas,
      ctx,
      point
    };
  }
  
  function animate(scene, dt = 0.05) {
    const { canvas, ctx, point } = scene;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // point.update(dt);
    // point.draw(ctx);
    for (let i = 0; i < points.length; i++) {
        const point = points[i];
        point.update(dt);
        point.draw(ctx);
    }
  }