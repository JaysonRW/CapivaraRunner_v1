import { Config } from './config.js';

export class Renderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        
        this.vCanvas = document.createElement('canvas');
        this.vCanvas.width = Config.BASE_WIDTH;
        this.vCanvas.height = Config.BASE_HEIGHT;
        this.vCtx = this.vCanvas.getContext('2d');
        
        this.ctx.imageSmoothingEnabled = false;
        this.vCtx.imageSmoothingEnabled = false;

        this.shakeTime = 0;
        this.shakeMagnitude = 0;
        
        // Configuração atual (setada pelo Game)
        this.currentScene = null;
        this.currentSkin = null;

        this.time = 0; // Tempo acumulado para animações simples

        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        const winW = window.innerWidth;
        const winH = window.innerHeight;
        this.canvas.width = winW;
        this.canvas.height = winH;
        this.ctx.imageSmoothingEnabled = false;
        
        const scaleX = Math.floor(winW / Config.BASE_WIDTH);
        const scaleY = Math.floor(winH / Config.BASE_HEIGHT);
        this.scale = Math.max(1, Math.min(scaleX, scaleY));
        
        this.offsetX = Math.floor((winW - (Config.BASE_WIDTH * this.scale)) / 2);
        this.offsetY = Math.floor((winH - (Config.BASE_HEIGHT * this.scale)) / 2);
    }

    triggerShake(magnitude = Config.SHAKE_STRENGTH) {
        this.shakeMagnitude = magnitude;
        this.shakeTime = 0.3;
    }

    updateShake(dt) {
        this.time += dt;
        if (this.shakeTime > 0) {
            this.shakeTime -= dt;
            if (this.shakeTime <= 0) this.shakeMagnitude = 0;
        }
    }

    clear() {
        this.vCtx.save();
        
        if (this.shakeMagnitude > 0) {
            const dx = (Math.random() - 0.5) * this.shakeMagnitude;
            const dy = (Math.random() - 0.5) * this.shakeMagnitude;
            this.vCtx.translate(dx, dy);
        }

        // Cor do Céu (Fallback)
        const skyColor = this.currentScene ? this.currentScene.colors.sky : '#87CEEB';
        this.vCtx.fillStyle = skyColor;
        this.vCtx.fillRect(0, 0, Config.BASE_WIDTH, Config.BASE_HEIGHT);
        
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    drawBackground(assets, scrollX) {
        // Usa assets definidos na cena ou padrão
        const assetKeys = this.currentScene ? this.currentScene.assets : ['BG_BOTANICO_1', 'BG_BOTANICO_2', 'BG_BOTANICO_3'];
        
        assetKeys.forEach((layerKey, index) => {
            const img = assets.getImage(layerKey);
            const speed = Config.ANIM.PARALLAX_SPEEDS[index];
            const x = -(scrollX * speed) % Config.BASE_WIDTH;
            
            if (img) {
                this.vCtx.drawImage(img, x, 0, Config.BASE_WIDTH, Config.BASE_HEIGHT);
                this.vCtx.drawImage(img, x + Config.BASE_WIDTH, 0, Config.BASE_WIDTH, Config.BASE_HEIGHT);
            } else {
                // Fallback Chão
                if (index === 2) {
                    const groundColor = this.currentScene ? this.currentScene.colors.ground : '#2E8B57';
                    this.vCtx.fillStyle = groundColor;
                    this.vCtx.fillRect(0, Config.GROUND_Y, Config.BASE_WIDTH, Config.BASE_HEIGHT - Config.GROUND_Y);
                }
            }
        });
    }

    drawAnimatedSprite(img, x, y, w, h, frameIndex, totalFrames) {
        // 1. Define o total de frames (padrão 5 se não informado)
        const numFrames = totalFrames || Config.ANIM.RUN_FRAMES;
        
        // 2. Calcula a largura exata de cada frame
        // Ex: 485px / 5 = 97px
        const frameW = img.width / numFrames;
        const frameH = img.height;

        // 3. Garante que o índice atual esteja dentro do limite (0 a numFrames-1)
        const currentFrame = Math.floor(frameIndex) % numFrames;

        // 4. Desenha usando os 9 parâmetros
        this.vCtx.drawImage(
            img,
            Math.floor(currentFrame * frameW), 0, Math.floor(frameW), Math.floor(frameH), // Source (Recorte)
            Math.floor(x), Math.floor(y), w, h // Destination (Tela)
        );
    }

    drawPlayer(player, assets, isInvulnerable) {
        let spriteKey = this.currentSkin ? this.currentSkin.spriteKey : 'PLAYER_RUN';
        
        if (player.state === 'JUMP') {
            spriteKey = 'PLAYER_JUMP';
            if (this.currentSkin && this.currentSkin.id === 'ciclista') {
                spriteKey = 'PLAYER_JUMP_CICLISTA';
            }
        } 
        if (player.state === 'SLIDE') {
            spriteKey = 'PLAYER_SLIDE';
            if (this.currentSkin && this.currentSkin.id === 'ciclista') {
                spriteKey = 'PLAYER_SLIDE_CICLISTA';
            }
        }

        const img = assets.getImage(spriteKey);

        if (img) {
            // Define número de frames baseado no estado
            let numFrames = Config.ANIM.RUN_FRAMES;
            if (player.state === 'JUMP') numFrames = Config.ANIM.JUMP_FRAMES;
            if (player.state === 'SLIDE') numFrames = Config.ANIM.SLIDE_FRAMES;

            // Fallback para imagem estática se a dimensão não bater com sprite sheet esperado
            // Se a largura for próxima da altura (proporção < 1.5), assume frame único estático
            if (img.width <= img.height * 1.5) numFrames = 1;

            this.drawAnimatedSprite(
                img, 
                player.x, player.y, player.width, player.height, 
                player.frameIndex,
                numFrames
            );
        } else {
            const skinColor = this.currentSkin ? this.currentSkin.color : Config.PLAYER_COLOR;
            this.vCtx.fillStyle = isInvulnerable ? '#00FFFF' : skinColor;
            this.vCtx.fillRect(player.x, player.y, player.width, player.height);
        }
    }

    drawEntities(spawner, assets) {
        spawner.obstacles.forEach(obs => {
            const img = assets.getImage(obs.type);
            if (img) {
                this.vCtx.drawImage(img, Math.floor(obs.x), Math.floor(obs.y), obs.w, obs.h);
            } else {
                this.vCtx.fillStyle = '#555';
                this.vCtx.fillRect(obs.x, obs.y, obs.w, obs.h);
            }
        });

        spawner.ecoFragments.forEach(eco => {
            const img = assets.getImage(eco.type);
            if (img) {
                // Se largura > altura, trata como sprite sheet animado
                if (img.width > img.height) {
                    const speed = 8; // 8 fps
                    const frameIndex = this.time * speed;
                    const numFrames = Config.ANIM.ECO_FRAMES || 5;

                    this.drawAnimatedSprite(
                        img,
                        eco.x, eco.y, eco.w, eco.h,
                        frameIndex,
                        numFrames
                    );
                } else {
                    // Imagem estática
                    this.vCtx.drawImage(img, Math.floor(eco.x), Math.floor(eco.y), eco.w, eco.h);
                }
            } else {
                this.vCtx.fillStyle = '#00FF7F';
                this.vCtx.fillRect(eco.x, eco.y, eco.w, eco.h);
                this.vCtx.strokeStyle = 'white';
                this.vCtx.strokeRect(eco.x, eco.y, eco.w, eco.h);
            }
        });
    }

    drawParticles(particleSystem) {
        particleSystem.draw(this.vCtx);
    }

    renderToScreen() {
        this.vCtx.restore();
        this.ctx.drawImage(
            this.vCanvas, 
            0, 0, Config.BASE_WIDTH, Config.BASE_HEIGHT,
            this.offsetX, this.offsetY, Config.BASE_WIDTH * this.scale, Config.BASE_HEIGHT * this.scale
        );
    }
}
