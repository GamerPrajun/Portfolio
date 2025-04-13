class Particle {
    constructor() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = Math.random() * 2 + 1;
        this.speedX = 0;
        this.speedY = 0;
        this.opacity = Math.random() * 0.5 + 0.3;
        this.color = `rgba(255, 255, 255, ${this.opacity})`;
        this.glowSize = this.size * 4;
        this.scatterForce = 0.2 + Math.random() * 0.3; // Random scatter force for each particle
    }

    update(mouseX, mouseY) {
        // Calculate distance to mouse
        const dx = mouseX - this.x;
        const dy = mouseY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        // Scatter away from mouse
        if (distance < 150) {
            const angle = Math.atan2(dy, dx);
            const force = (150 - distance) / 150;
            
            // Move away from mouse (opposite direction)
            this.speedX -= Math.cos(angle) * force * this.scatterForce;
            this.speedY -= Math.sin(angle) * force * this.scatterForce;
        }

        // Apply friction
        this.speedX *= 0.95;
        this.speedY *= 0.95;

        // Update position
        this.x += this.speedX;
        this.y += this.speedY;

        // Keep particles within bounds
        if (this.x < 0) this.x = window.innerWidth;
        if (this.x > window.innerWidth) this.x = 0;
        if (this.y < 0) this.y = window.innerHeight;
        if (this.y > window.innerHeight) this.y = 0;
    }

    draw(ctx) {
        // Draw glow
        const gradient = ctx.createRadialGradient(
            this.x, this.y, 0,
            this.x, this.y, this.glowSize
        );
        gradient.addColorStop(0, `rgba(255, 255, 255, ${this.opacity * 0.8})`);
        gradient.addColorStop(0.5, `rgba(255, 255, 255, ${this.opacity * 0.3})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.glowSize, 0, Math.PI * 2);
        ctx.fill();

        // Draw dot
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

class ParticleSystem {
    constructor() {
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        
        // Setup canvas with improved properties
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '0';
        this.canvas.style.backgroundColor = 'transparent';
        document.body.insertBefore(this.canvas, document.body.firstChild);

        // Create particles
        for (let i = 0; i < 30; i++) {
            this.particles.push(new Particle());
        }

        // Event listeners
        window.addEventListener('mousemove', (e) => {
            this.mouseX = e.clientX;
            this.mouseY = e.clientY;
        });

        window.addEventListener('resize', () => {
            this.resizeCanvas();
            // Reposition particles on resize
            this.particles.forEach(particle => {
                particle.x = Math.random() * window.innerWidth;
                particle.y = Math.random() * window.innerHeight;
            });
        });

        // Initial setup
        this.resizeCanvas();

        // Start animation
        this.animate();
    }

    resizeCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.scale(dpr, dpr);
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            particle.update(this.mouseX, this.mouseY);
            particle.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

// Initialize particle system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
}); 