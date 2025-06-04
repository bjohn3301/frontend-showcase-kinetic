const preloader = document.getElementById('preloader');
const body = document.body;

body.classList.add('preloading');

function createPreloaderParticles() {
    const container = document.querySelector('.preloader-particles');
    if (!container) return;
    const numParticles = 30;
    for (let i = 0; i < numParticles; i++) {
        const particle = document.createElement('div');
        particle.classList.add('preloader-particle');
        
        const size = Math.random() * 4 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;
        
        particle.style.animationDelay = `${Math.random() * 2.5}s`;
        
        particle.style.backgroundColor = Math.random() > 0.5 ? 'var(--accent-primary)' : 'var(--accent-secondary)';
        
        container.appendChild(particle);
    }
}

if (preloader) {
    createPreloaderParticles();
    const preloaderDuration = 3000;

    setTimeout(() => {
        preloader.classList.add('loaded');
        body.classList.remove('preloading');
        body.classList.add('content-loaded');
    }, preloaderDuration);
}


document.addEventListener('DOMContentLoaded', () => {
    
    const cursorContainer = document.getElementById('custom-cursor-container');
    const auraMain = document.querySelector('#custom-cursor-container .cursor-aura-main');
    const trailElements = [];
    const numTrailElements = 10;
    const baseTrailSize = 8;
    const auraBaseSize = 40;

    let clientX = -100;
    let clientY = -100;

    if (cursorContainer && auraMain) {
        for (let i = 0; i < numTrailElements; i++) {
            const el = document.createElement('div');
            el.classList.add('cursor-trail-element');
            el.style.width = `${baseTrailSize * (1 - i / numTrailElements)}px`;
            el.style.height = `${baseTrailSize * (1 - i / numTrailElements)}px`;
            cursorContainer.appendChild(el);
            trailElements.push({
                element: el,
                x: -100,
                y: -100
            });
        }
        auraMain.style.width = `${auraBaseSize}px`;
        auraMain.style.height = `${auraBaseSize}px`;


        document.addEventListener('mousemove', e => {
            clientX = e.clientX;
            clientY = e.clientY;
        });

        const updateCursor = () => {
            let currentX = clientX;
            let currentY = clientY;

            auraMain.style.transform = `translate(-50%, -50%) translate(${currentX}px, ${currentY}px)`;

            trailElements.forEach((trail, index) => {
                trail.x += (currentX - trail.x) * (0.5 - index * 0.02);
                trail.y += (currentY - trail.y) * (0.5 - index * 0.02);
                
                trail.element.style.transform = `translate(-50%, -50%) translate(${trail.x}px, ${trail.y}px)`;
                
                currentX = trail.x;
                currentY = trail.y;
            });
            
            requestAnimationFrame(updateCursor);
        };
        updateCursor();

        const interactiveElements = document.querySelectorAll('a, button, .nav-link');
        const showcaseItems = document.querySelectorAll('.showcase-item');

        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-interactive'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-interactive'));
        });

        showcaseItems.forEach(el => {
            el.addEventListener('mouseenter', () => document.body.classList.add('cursor-on-showcase'));
            el.addEventListener('mouseleave', () => document.body.classList.remove('cursor-on-showcase'));
        });
    }

    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        });
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const mainMenu = document.querySelector('.main-menu');
    if (menuToggle && mainMenu) {
        menuToggle.addEventListener('click', () => {
            const isOpen = mainMenu.classList.toggle('open');
            menuToggle.classList.toggle('open');
            menuToggle.setAttribute('aria-expanded', isOpen);
        });
    }

    const currentPath = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll('.main-menu .nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active-link');
        }
    });

    const plexusCanvas = document.getElementById('global-plexus-canvas');
    if (plexusCanvas) {
        const ctx = plexusCanvas.getContext('2d');
        let width = plexusCanvas.width = window.innerWidth;
        let height = plexusCanvas.height = window.innerHeight;

        let mouse = { x: null, y: null, radius: (height / 100) * (width / 100) };

        window.addEventListener('mousemove', (event) => {
            mouse.x = event.clientX;
            mouse.y = event.clientY;
        });
        window.addEventListener('mouseout', () => {
            mouse.x = null;
            mouse.y = null;
        });
        window.addEventListener('resize', () => {
            width = plexusCanvas.width = window.innerWidth;
            height = plexusCanvas.height = window.innerHeight;
            mouse.radius = (height / 100) * (width / 100);
            initPlexusParticles();
        });

        class PlexusParticle {
            constructor(x, y) {
                this.x = x || Math.random() * width;
                this.y = y || Math.random() * height;
                this.size = Math.random() * 1.5 + 0.5;
                this.baseX = this.x;
                this.baseY = this.y;
                this.density = (Math.random() * 30) + 10;
                this.vx = (Math.random() - 0.5) * 0.5;
                this.vy = (Math.random() - 0.5) * 0.5;
                this.color = 'rgba(0, 255, 255, 0.5)';
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.closePath();
                ctx.fill();
            }

            update() {
                if (mouse.x != null && mouse.y != null) {
                    let dx = mouse.x - this.x;
                    let dy = mouse.y - this.y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    let forceDirectionX = dx / distance;
                    let forceDirectionY = dy / distance;
                    let maxDistance = mouse.radius;
                    let force = (maxDistance - distance) / maxDistance;
                    
                    let directionCheck = force > 0 ? -1 : 1;

                    if (distance < mouse.radius) {
                        this.x += directionCheck * forceDirectionX * force * this.size * 0.8;
                        this.y += directionCheck * forceDirectionY * force * this.size * 0.8;
                    }
                }

                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;

                this.vx *= 0.99;
                this.vy *= 0.99;
            }
        }

        let plexusParticlesArray = [];
        const numberOfPlexusParticles = Math.floor((width * height) / 15000);

        function initPlexusParticles() {
            plexusParticlesArray = [];
            for (let i = 0; i < numberOfPlexusParticles; i++) {
                plexusParticlesArray.push(new PlexusParticle());
            }
        }
        initPlexusParticles();

        function connectPlexusParticles() {
            let opacityValue = 0.3;
            for (let a = 0; a < plexusParticlesArray.length; a++) {
                for (let b = a + 1; b < plexusParticlesArray.length; b++) {
                    let dx = plexusParticlesArray[a].x - plexusParticlesArray[b].x;
                    let dy = plexusParticlesArray[a].y - plexusParticlesArray[b].y;
                    let distance = Math.sqrt(dx * dx + dy * dy);
                    const connectDistance = Math.min(width, height) / 7;

                    if (distance < connectDistance) {
                        opacityValue = 1 - (distance / connectDistance);
                        ctx.strokeStyle = `rgba(0, 255, 255, ${opacityValue * 0.3})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath();
                        ctx.moveTo(plexusParticlesArray[a].x, plexusParticlesArray[a].y);
                        ctx.lineTo(plexusParticlesArray[b].x, plexusParticlesArray[b].y);
                        ctx.stroke();
                    }
                }
            }
        }

        function animatePlexus() {
            ctx.clearRect(0, 0, width, height);
            for (let i = 0; i < plexusParticlesArray.length; i++) {
                plexusParticlesArray[i].update();
                plexusParticlesArray[i].draw();
            }
            connectPlexusParticles();
            requestAnimationFrame(animatePlexus);
        }
        animatePlexus();
    }


    if (typeof Splitting === 'function') {
        Splitting();
    }

    const heroTitleSpans = document.querySelectorAll('.hero-title span');
    heroTitleSpans.forEach(span => {
        span.classList.add('char-reveal-effect');
        span.addEventListener('mouseenter', () => {
            span.style.setProperty('--hover-random', Math.random());
        });
    });

    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        heroSubtitle.classList.add('typing');
        let i = 0;
        const typingSpeed = 100;
        let initialDelay = 1500; 
        if(heroTitleSpans.length > 0) {
            const lastSpan = heroTitleSpans[heroTitleSpans.length -1];
            const lastSpanStyle = getComputedStyle(lastSpan);
            initialDelay = (parseFloat(lastSpanStyle.animationDelay) + parseFloat(lastSpanStyle.animationDuration)) * 1000;
        }
        
        setTimeout(() => {
            function typeWriter() {
                if (i < text.length) {
                    const charSpan = document.createElement('span');
                    charSpan.classList.add('char-typed');
                    charSpan.textContent = text.charAt(i);
                    charSpan.style.animationDelay = `${i * 0.02}s`;
                    heroSubtitle.appendChild(charSpan);
                    i++;
                    setTimeout(typeWriter, typingSpeed);
                }
            }
            typeWriter();
        }, initialDelay + 500);
    }

    const blobCanvas = document.getElementById('liquid-blob-canvas');
    if (blobCanvas) {
        const blobCtx = blobCanvas.getContext('2d');
        let blobCanvasWidth = blobCanvas.width = blobCanvas.clientWidth;
        let blobCanvasHeight = blobCanvas.height = blobCanvas.clientHeight;

        let blobMouse = { 
            x: blobCanvasWidth / 2, 
            y: blobCanvasHeight / 2, 
            prevX: blobCanvasWidth / 2, 
            prevY: blobCanvasHeight / 2,
            speed: 0
        };
        
        const metaballs = [];
        const numMetaballs = 5;
        const explosionParticles = [];

        const baseBlobBlur = 10;
        const baseBlobContrast = 15;
        let currentBlobBlur = baseBlobBlur;
        let currentBlobContrast = baseBlobContrast;

        const blobAccentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
        const blobAccentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();

        class Metaball {
            constructor() {
                this.radius = Math.random() * 20 + 20;
                this.x = Math.random() * (blobCanvasWidth - 2 * this.radius) + this.radius;
                this.y = Math.random() * (blobCanvasHeight - 2 * this.radius) + this.radius;
                this.vx = (Math.random() - 0.5) * 2;
                this.vy = (Math.random() - 0.5) * 2;
                this.baseColor = `hsla(${Math.random() * 60 + 180}, 100%, 70%, 0.7)`;
                this.currentColor = this.baseColor;
            }

            update() {
                const speedFactor = 1 + blobMouse.speed / 30; 
                this.vx += (Math.random() - 0.5) * 0.3 * speedFactor;
                this.vy += (Math.random() - 0.5) * 0.3 * speedFactor;

                const dxToMouse = blobMouse.x - this.x;
                const dyToMouse = blobMouse.y - this.y;
                const distToMouse = Math.sqrt(dxToMouse * dxToMouse + dyToMouse * dyToMouse);

                if (distToMouse < this.radius * 2.5 && distToMouse > 0) {
                    this.vx -= (dxToMouse / distToMouse) * 0.4 * speedFactor;
                    this.vy -= (dyToMouse / distToMouse) * 0.4 * speedFactor;
                }
                
                this.vx = Math.max(-3 * speedFactor, Math.min(3 * speedFactor, this.vx));
                this.vy = Math.max(-3 * speedFactor, Math.min(3 * speedFactor, this.vy));

                this.vx *= 0.96;
                this.vy *= 0.96;

                this.x += this.vx;
                this.y += this.vy;

                if (this.x < this.radius) { this.x = this.radius; this.vx *= -0.8; }
                if (this.x > blobCanvasWidth - this.radius) { this.x = blobCanvasWidth - this.radius; this.vx *= -0.8; }
                if (this.y < this.radius) { this.y = this.radius; this.vy *= -0.8; }
                if (this.y > blobCanvasHeight - this.radius) { this.y = blobCanvasHeight - this.radius; this.vy *= -0.8; }

                if (blobMouse.speed > 8) {
                    const hueShift = (280 + blobMouse.speed * 1.5); 
                    this.currentColor = `hsla(${hueShift % 360}, 100%, 70%, 0.85)`;
                } else {
                    this.currentColor = this.baseColor;
                }
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = this.currentColor;
                ctx.fill();
            }
        }

        class ExplosionParticle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1.5;
                this.alpha = 1;
                const angle = Math.random() * Math.PI * 2;
                const speed = Math.random() * 4 + 2;
                this.vx = Math.cos(angle) * speed;
                this.vy = Math.sin(angle) * speed;
                this.friction = 0.97;
                this.color = Math.random() > 0.5 ? blobAccentPrimary : blobAccentSecondary;
            }

            update() {
                this.vx *= this.friction;
                this.vy *= this.friction;
                this.x += this.vx;
                this.y += this.vy;
                this.alpha -= 0.025;
            }

            draw(ctx) {
                ctx.globalAlpha = Math.max(0, this.alpha);
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.globalAlpha = 1;
            }
        }

        function initMetaballs() {
            metaballs.length = 0;
            for (let i = 0; i < numMetaballs; i++) {
                metaballs.push(new Metaball());
            }
        }
        initMetaballs();

        if (blobCanvas.parentElement) {
            blobCanvas.parentElement.addEventListener('mousemove', (e) => {
                const rect = blobCanvas.getBoundingClientRect();
                blobMouse.prevX = blobMouse.x;
                blobMouse.prevY = blobMouse.y;
                blobMouse.x = e.clientX - rect.left;
                blobMouse.y = e.clientY - rect.top;
                
                const dx = blobMouse.x - blobMouse.prevX;
                const dy = blobMouse.y - blobMouse.prevY;
                blobMouse.speed = Math.sqrt(dx * dx + dy * dy);
            });
             blobCanvas.parentElement.addEventListener('mouseleave', () => {
                blobMouse.x = blobCanvasWidth / 2;
                blobMouse.y = blobCanvasHeight / 2;
                blobMouse.speed = 0;
            });
            blobCanvas.parentElement.addEventListener('click', (e) => {
                const rect = blobCanvas.getBoundingClientRect();
                const clickX = e.clientX - rect.left;
                const clickY = e.clientY - rect.top;
                for (let i = 0; i < 25; i++) { // Aumentar número de partículas
                    explosionParticles.push(new ExplosionParticle(clickX, clickY));
                }
            });
        }

        function animateMetaballs() {
            blobCtx.clearRect(0, 0, blobCanvasWidth, blobCanvasHeight);

            let targetBlur = baseBlobBlur + blobMouse.speed / 1.5;
            let targetContrast = baseBlobContrast + blobMouse.speed;
            targetBlur = Math.min(25, targetBlur); // Limitar blur
            targetContrast = Math.min(40, targetContrast); // Limitar contraste

            currentBlobBlur += (targetBlur - currentBlobBlur) * 0.1;
            currentBlobContrast += (targetContrast - currentBlobContrast) * 0.1;

            blobCtx.filter = `blur(${currentBlobBlur}px) contrast(${currentBlobContrast})`;
            
            metaballs.forEach(ball => {
                ball.update();
                ball.draw(blobCtx);
            });
            
            blobCtx.filter = 'none';

            for (let i = explosionParticles.length - 1; i >= 0; i--) {
                explosionParticles[i].update();
                explosionParticles[i].draw(blobCtx);
                if (explosionParticles[i].alpha <= 0) {
                    explosionParticles.splice(i, 1);
                }
            }
            requestAnimationFrame(animateMetaballs);
        }
        animateMetaballs();
        
        const resizeObserverBlob = new ResizeObserver(entries => {
            for (let entry of entries) {
                blobCanvasWidth = blobCanvas.width = entry.contentRect.width;
                blobCanvasHeight = blobCanvas.height = entry.contentRect.height;
                blobMouse.x = blobCanvasWidth / 2;
                blobMouse.y = blobCanvasHeight / 2;
                initMetaballs();
            }
        });
         if (blobCanvas.parentElement) {
            resizeObserverBlob.observe(blobCanvas.parentElement);
        } else {
             window.addEventListener('resize', () => {
                blobCanvasWidth = blobCanvas.width = blobCanvas.clientWidth;
                blobCanvasHeight = blobCanvas.height = blobCanvas.clientHeight;
                blobMouse.x = blobCanvasWidth / 2;
                blobMouse.y = blobCanvasHeight / 2;
                initMetaballs();
            });
        }
    }

    const perspectiveCards = document.querySelectorAll('.perspective-card-container');
    perspectiveCards.forEach(container => {
        const card = container.querySelector('.perspective-card');
        if (card) {
            container.addEventListener('mousemove', (e) => {
                const rect = container.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / centerY * -15;
                const rotateY = (x - centerX) / centerX * 15;
                card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
            });
            container.addEventListener('mouseleave', () => {
                card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            });
        }
    });

    const glitchTextElements = document.querySelectorAll('.glitch-text-dynamic');
    glitchTextElements.forEach(el => {
        const texts = JSON.parse(el.dataset.texts || '["GLITCH"]');
        let currentIndex = 0;
        let intervalId;

        function scrambleText(text) {
            let newText = '';
            for (let i = 0; i < text.length; i++) {
                newText += Math.random() > 0.2 ? text[i] : String.fromCharCode(33 + Math.floor(Math.random() * 94));
            }
            el.textContent = newText;
            el.setAttribute('data-text-glitch', newText);
        }

        function revealText(targetText) {
            let currentText = el.textContent;
            let step = 0;
            const revealInterval = setInterval(() => {
                if (step >= targetText.length) {
                    clearInterval(revealInterval);
                    el.textContent = targetText;
                    el.setAttribute('data-text-glitch', targetText);
                    return;
                }
                currentText = targetText.substring(0, step + 1) + currentText.substring(step + 1);
                let scrambledPart = '';
                for (let i = step + 1; i < targetText.length; i++) {
                     scrambledPart += Math.random() > 0.3 ? targetText[i] : String.fromCharCode(33 + Math.floor(Math.random() * 94));
                }
                el.textContent = targetText.substring(0, step + 1) + scrambledPart.substring(step + 1);
                el.setAttribute('data-text-glitch', el.textContent);
                step++;
            }, 60);
        }
        
        function changeText() {
            currentIndex = (currentIndex + 1) % texts.length;
            const target = texts[currentIndex];
            let scrambleCount = 0;
            const scrambleInterval = setInterval(() => {
                scrambleText(target);
                scrambleCount++;
                if (scrambleCount > 10) {
                    clearInterval(scrambleInterval);
                    revealText(target);
                }
            }, 50);
        }
        
        el.textContent = texts[0];
        el.setAttribute('data-text-glitch', texts[0]);
        
        if (el.parentElement) {
            el.parentElement.addEventListener('mouseenter', () => {
                changeText();
                intervalId = setInterval(changeText, 3000);
            });
            el.parentElement.addEventListener('mouseleave', () => {
                clearInterval(intervalId);
            });
        }
    });

    const entangledGridCanvas = document.getElementById('entangled-grid-canvas');
    if (entangledGridCanvas) {
        const gridCtx = entangledGridCanvas.getContext('2d');
        let gridContainer = entangledGridCanvas.parentElement;
        let gridWidth = entangledGridCanvas.width = gridContainer.clientWidth;
        let gridHeight = entangledGridCanvas.height = gridContainer.clientHeight;
        
        let gridMousePos = { x: -1000, y: -1000 };
        let gridNodes = [];
        const gridNodeSize = 3;
        const gridHoverNodeSize = 5;
        const gridPropagationNodeSize = 4;
        const gridSpacing = 30; 
        const gridInteractionRadius = 60;
        const gridDecaySpeed = 0.03;
        const gridMaxPropagationDepth = 3;

        const gridAccentPrimary = getComputedStyle(document.documentElement).getPropertyValue('--accent-primary').trim();
        const gridAccentSecondary = getComputedStyle(document.documentElement).getPropertyValue('--accent-secondary').trim();
        const gridTextSecondary = getComputedStyle(document.documentElement).getPropertyValue('--text-secondary').trim();

        entangledGridCanvas.addEventListener('mousemove', (e) => {
            const rect = entangledGridCanvas.getBoundingClientRect();
            gridMousePos.x = e.clientX - rect.left;
            gridMousePos.y = e.clientY - rect.top;
        });
        entangledGridCanvas.addEventListener('mouseleave', () => {
            gridMousePos.x = -1000;
            gridMousePos.y = -1000;
        });

        class GridNode {
            constructor(x, y, col, row) {
                this.x = x;
                this.y = y;
                this.col = col;
                this.row = row;
                this.size = gridNodeSize;
                this.alpha = 0.3;
                this.targetAlpha = 0.3;
                this.targetSize = gridNodeSize;
                this.isHoverActivated = false;
                this.propagationDepth = Infinity;
                this.connections = [];
            }

            update() {
                const dx = this.x - gridMousePos.x;
                const dy = this.y - gridMousePos.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                this.isHoverActivated = false;
                if (dist < gridInteractionRadius) {
                    this.activate(0, true); 
                    this.isHoverActivated = true;
                }

                if (!this.isHoverActivated && this.alpha > 0.3) {
                     this.targetAlpha = Math.max(0.3, this.alpha - gridDecaySpeed);
                     this.targetSize = Math.max(gridNodeSize, this.size - gridDecaySpeed * 5);
                     if(this.targetAlpha <= 0.3) this.propagationDepth = Infinity;
                }
                
                this.alpha += (this.targetAlpha - this.alpha) * 0.1;
                this.size += (this.targetSize - this.size) * 0.1;

                this.connections.forEach(conn => {
                    conn.alpha -= gridDecaySpeed * 1.5;
                    if (conn.alpha < 0) conn.alpha = 0;
                });
                this.connections = this.connections.filter(conn => conn.alpha > 0);
            }
            
            activate(depth, byMouse = false) {
                if (depth > gridMaxPropagationDepth) return;
                if (depth >= this.propagationDepth && !byMouse) return;

                this.targetAlpha = byMouse ? 1.0 : Math.max(0.4, 0.9 - depth * 0.15);
                this.targetSize = byMouse ? gridHoverNodeSize : Math.max(gridNodeSize, gridPropagationNodeSize - depth * 0.5);
                this.propagationDepth = depth;

                if (depth < gridMaxPropagationDepth) {
                    this.propagateToNeighbors(depth + 1);
                }
            }

            propagateToNeighbors(depth) {
                const neighbors = [
                    gridNodes.find(n => n.col === this.col && n.row === this.row - 1), 
                    gridNodes.find(n => n.col === this.col && n.row === this.row + 1), 
                    gridNodes.find(n => n.col === this.col - 1 && n.row === this.row), 
                    gridNodes.find(n => n.col === this.col + 1 && n.row === this.row),
                ];
                neighbors.forEach(neighbor => {
                    if (neighbor) {
                        neighbor.activate(depth);
                        if(this.alpha > 0.35 && neighbor.alpha > 0.35) {
                            let existingConnection = this.connections.find(c => c.to === neighbor || c.from === neighbor);
                            if (!existingConnection) {
                                this.connections.push({
                                    from: this, to: neighbor, alpha: Math.min(this.alpha, neighbor.alpha) * 0.7
                                });
                            } else {
                                existingConnection.alpha = Math.max(existingConnection.alpha, Math.min(this.alpha, neighbor.alpha) * 0.7);
                            }
                        }
                    }
                });
            }

            draw(ctx) {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                let color = this.isHoverActivated ? gridAccentPrimary : (this.propagationDepth < Infinity && this.alpha > 0.35 ? gridAccentSecondary : gridTextSecondary);
                
                if(color.startsWith('#') && (color.length === 7 || color.length === 4)) {
                    let r, g, b;
                    if(color.length === 4) { // Expand shorthand hex
                        r = parseInt(color[1] + color[1], 16);
                        g = parseInt(color[2] + color[2], 16);
                        b = parseInt(color[3] + color[3], 16);
                    } else {
                        r = parseInt(color.slice(1,3), 16);
                        g = parseInt(color.slice(3,5), 16);
                        b = parseInt(color.slice(5,7), 16);
                    }
                    ctx.fillStyle = `rgba(${r},${g},${b},${this.alpha})`;
                } else if (color.startsWith('rgb')) {
                     ctx.fillStyle = `${color.replace(')', `, ${this.alpha})`).replace('rgb', 'rgba')}`;
                } else {
                    ctx.fillStyle = `rgba(160,160,192,${this.alpha})`;
                }
                ctx.fill();

                this.connections.forEach(conn => {
                    if (conn.alpha <=0) return;
                    ctx.beginPath();
                    ctx.moveTo(conn.from.x, conn.from.y);
                    ctx.lineTo(conn.to.x, conn.to.y);
                    let lineColor = conn.from.isHoverActivated || conn.to.isHoverActivated ? gridAccentPrimary : gridAccentSecondary;
                     if(lineColor.startsWith('#') && (lineColor.length === 7 || lineColor.length === 4) ) {
                        let r_lc, g_lc, b_lc;
                        if(lineColor.length === 4){
                            r_lc = parseInt(lineColor[1] + lineColor[1], 16);
                            g_lc = parseInt(lineColor[2] + lineColor[2], 16);
                            b_lc = parseInt(lineColor[3] + lineColor[3], 16);
                        } else {
                            r_lc = parseInt(lineColor.slice(1,3), 16);
                            g_lc = parseInt(lineColor.slice(3,5), 16);
                            b_lc = parseInt(lineColor.slice(5,7), 16);
                        }
                        ctx.strokeStyle = `rgba(${r_lc},${g_lc},${b_lc},${conn.alpha})`;
                    } else if (lineColor.startsWith('rgb')) {
                         ctx.strokeStyle = `${lineColor.replace(')', `, ${conn.alpha})`).replace('rgb', 'rgba')}`;
                    } else {
                        ctx.strokeStyle = `rgba(255,0,255,${conn.alpha})`;
                    }
                    ctx.lineWidth = 0.5 + conn.alpha * 0.5;
                    ctx.stroke();
                });
            }
        }

        function initGrid() {
            gridNodes = [];
            const cols = Math.floor(gridWidth / gridSpacing);
            const rows = Math.floor(gridHeight / gridSpacing);
            const offsetX = (gridWidth - (cols - 1) * gridSpacing) / 2;
            const offsetY = (gridHeight - (rows - 1) * gridSpacing) / 2;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    gridNodes.push(new GridNode(offsetX + c * gridSpacing, offsetY + r * gridSpacing, c, r));
                }
            }
        }

        function animateGrid() {
            gridCtx.clearRect(0, 0, gridWidth, gridHeight);
            gridNodes.forEach(node => {
                node.update();
            });
            gridNodes.forEach(node => {
                node.draw(gridCtx);
            });
            requestAnimationFrame(animateGrid);
        }
        
        const resizeObserverGrid = new ResizeObserver(entries => {
            for (let entry of entries) {
                gridWidth = entangledGridCanvas.width = entry.contentRect.width;
                gridHeight = entangledGridCanvas.height = entry.contentRect.height;
                initGrid();
            }
        });
        if (gridContainer) {
            resizeObserverGrid.observe(gridContainer);
        } else {
            window.addEventListener('resize', () => {
                gridWidth = entangledGridCanvas.width = window.innerWidth;
                gridHeight = entangledGridCanvas.height = window.innerHeight;
                initGrid();
            });
        }
        initGrid();
        animateGrid();
    }


    const animatedElements = document.querySelectorAll('.hero-title span, .section-title-alt, .showcase-item, .parallax-cta-title, .page-main-title, .content-block');
    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            } else {
            }
        });
    }, { threshold: 0.1 });

    animatedElements.forEach(el => {
        observer.observe(el);
    });
});