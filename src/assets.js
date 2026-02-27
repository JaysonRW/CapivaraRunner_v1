export class AssetManager {
    constructor() {
        this.images = {};
        this.audio = {};
        this.isMuted = false;
        this.bgMusic = null;
        
        // Inicializa AudioContext para sons sintéticos (fallback)
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    async loadAll(assetList) {
        const imagePromises = Object.entries(assetList.SPRITES).map(([key, src]) => 
            this.loadImage(key, src)
        );
        
        const audioPromises = Object.entries(assetList.AUDIO).map(([key, src]) => 
            this.loadAudio(key, src)
        );

        await Promise.all([...imagePromises, ...audioPromises]);
    }

    loadImage(key, src) {
        return new Promise((resolve) => {
            const img = new Image();
            const timeout = setTimeout(() => {
                console.warn(`Img timeout: ${src}`);
                this.images[key] = null;
                resolve();
            }, 3000);

            img.onload = () => { clearTimeout(timeout); this.images[key] = img; resolve(); };
            img.onerror = () => { clearTimeout(timeout); console.warn(`Img missing: ${src}`); this.images[key] = null; resolve(); };
            img.src = src;
        });
    }

    loadAudio(key, src) {
        return new Promise((resolve) => {
            const aud = new Audio();
            const timeout = setTimeout(() => {
                console.warn(`Audio timeout: ${src}`);
                this.audio[key] = null;
                resolve();
            }, 3000);

            // Adiciona listener para erro de carregamento (comum se arquivo for vazio/inválido)
            aud.addEventListener('error', () => {
                clearTimeout(timeout);
                console.warn(`Audio error/missing: ${src}`);
                this.audio[key] = null;
                resolve();
            });

            aud.oncanplaythrough = () => { clearTimeout(timeout); this.audio[key] = aud; resolve(); };
            aud.src = src;
        });
    }

    getImage(key) { return this.images[key]; }

    playAudio(key, loop = false) {
        if (this.isMuted) return;

        // Tenta retomar AudioContext se estiver suspenso (política de autoplay)
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
        
        const sound = this.audio[key];
        
        // Se o arquivo de áudio não carregou, usa sintetizador
        if (!sound) {
            this.playSynth(key);
            return;
        }
        
        // Se for música, trata diferente (apenas uma instância)
        if (key === 'MUSIC') {
            if (!this.bgMusic) this.bgMusic = sound;
            this.bgMusic.loop = true;
            this.bgMusic.volume = 0.3;
            this.bgMusic.play().catch(e => console.log("Music play failed:", e));
            return;
        }

        // SFX: Clona para sobreposição
        try {
            const clone = sound.cloneNode();
            clone.volume = 0.5;
            clone.play().catch(e => console.log("SFX play failed:", e));
        } catch (e) {
            this.playSynth(key);
        }
    }

    // Sintetizador simples para fallback
    playSynth(key) {
        if (!this.audioCtx) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        
        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        const now = this.audioCtx.currentTime;

        switch (key) {
            case 'JUMP':
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, now);
                osc.frequency.exponentialRampToValueAtTime(600, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'PICKUP':
                osc.type = 'sine';
                osc.frequency.setValueAtTime(1000, now);
                osc.frequency.exponentialRampToValueAtTime(2000, now + 0.1);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
                
            case 'HIT':
                osc.type = 'sawtooth';
                osc.frequency.setValueAtTime(100, now);
                osc.frequency.exponentialRampToValueAtTime(50, now + 0.3);
                gain.gain.setValueAtTime(0.2, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
                osc.start(now);
                osc.stop(now + 0.3);
                break;
                
            case 'SELECT':
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(400, now);
                gain.gain.setValueAtTime(0.1, now);
                gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                osc.start(now);
                osc.stop(now + 0.1);
                break;
        }
    }

    stopMusic() {
        if (this.bgMusic) {
            this.bgMusic.pause();
            this.bgMusic.currentTime = 0;
        }
    }

    toggleMute() {
        this.isMuted = !this.isMuted;
        if (this.isMuted) {
            if (this.bgMusic) this.bgMusic.pause();
        } else {
            if (this.bgMusic) this.bgMusic.play().catch(() => {});
        }
        return this.isMuted;
    }
}
