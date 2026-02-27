export class InputHandler {
    constructor() {
        this.keys = {};
        this.actions = {
            JUMP: false,
            SLIDE: false,
            START: false,
            USE_SLOT: false,
            CHOICE_1: false,
            CHOICE_2: false,
            CHOICE_3: false,
            MUTE: false
        };

        this.pressed = {}; // Para detectar "press" único (não hold)
        this.touches = []; // Rastreia toques ativos

        // Keyboard Listeners
        window.addEventListener('keydown', (e) => this.onKeyDown(e));
        window.addEventListener('keyup', (e) => this.onKeyUp(e));

        // Touch Listeners (Mobile)
        window.addEventListener('touchstart', (e) => this.onTouchStart(e), { passive: false });
        window.addEventListener('touchend', (e) => this.onTouchEnd(e), { passive: false });
        window.addEventListener('touchcancel', (e) => this.onTouchEnd(e), { passive: false });
        window.addEventListener('touchmove', (e) => e.preventDefault(), { passive: false }); // Previne scroll
    }

    onKeyDown(e) {
        this.keys[e.code] = true;
        this.pressed[e.code] = true; // Marca que foi pressionado neste frame
        this.updateActions();
    }

    onKeyUp(e) {
        this.keys[e.code] = false;
        this.pressed[e.code] = false;
        this.updateActions();
    }

    // --- Touch Handling ---

    onTouchStart(e) {
        // Se não for botão de UI (ex: menu), previne comportamento padrão
        if (e.target.tagName !== 'BUTTON') {
            e.preventDefault();
        }
        
        this.updateTouchState(e.touches);
    }

    onTouchEnd(e) {
        if (e.target.tagName !== 'BUTTON') {
            e.preventDefault();
        }
        this.updateTouchState(e.touches);
    }

    updateTouchState(touchList) {
        // Reseta estados de toque
        let touchJump = false;
        let touchSlide = false;
        const halfWidth = window.innerWidth / 2;

        for (let i = 0; i < touchList.length; i++) {
            const t = touchList[i];
            const x = t.clientX;

            if (x < halfWidth) {
                touchSlide = true; // Lado Esquerdo = Slide
            } else {
                touchJump = true;  // Lado Direito = Jump
            }
        }

        // Atualiza chaves virtuais de toque
        this.keys['TouchJump'] = touchJump;
        this.keys['TouchSlide'] = touchSlide;
        
        // Simula "pressed" para pulo (para menus ou ações de clique único)
        if (touchJump && !this.actions.JUMP) {
            this.pressed['TouchJump'] = true;
        }

        this.updateActions();
    }

    // ----------------------

    updateActions() {
        this.actions.JUMP = this.keys['Space'] || this.keys['ArrowUp'] || this.keys['KeyW'] || this.keys['TouchJump'];
        this.actions.SLIDE = this.keys['ArrowDown'] || this.keys['KeyS'] || this.keys['TouchSlide'];
        
        // Start também aceita toque na direita (pulo) para iniciar
        this.actions.START = this.keys['Space'] || this.keys['Enter'] || this.keys['TouchJump'];
        
        this.actions.USE_SLOT = this.keys['KeyE'];
        this.actions.CHOICE_1 = this.keys['Digit1'] || this.keys['Numpad1'];
        this.actions.CHOICE_2 = this.keys['Digit2'] || this.keys['Numpad2'];
        this.actions.CHOICE_3 = this.keys['Digit3'] || this.keys['Numpad3'];
        this.actions.MUTE = this.keys['KeyM'];
    }

    isActionActive(actionName) {
        return this.actions[actionName];
    }
    
    // Verifica se foi pressionado neste frame (útil para toggles)
    wasPressed(code) {
        // Verifica teclas físicas ou virtuais de toque
        if (this.pressed[code]) {
            this.pressed[code] = false; // Consome o evento
            return true;
        }
        // Fallback para toque genérico se 'Space' for solicitado (para menus)
        if (code === 'Space' && this.pressed['TouchJump']) {
            this.pressed['TouchJump'] = false;
            return true;
        }
        return false;
    }
    
    reset() {
        this.keys = {};
        this.pressed = {};
        this.actions = { 
            JUMP: false, SLIDE: false, START: false, 
            USE_SLOT: false, CHOICE_1: false, CHOICE_2: false, CHOICE_3: false, MUTE: false 
        };
    }
}
