export const Config = {
    // Resolução Base (Pixel Art)
    BASE_WIDTH: 480,
    BASE_HEIGHT: 270,
    
    // Física
    GRAVITY: 1500,
    JUMP_FORCE: -550,
    GROUND_Y: 250,
    
    // Player
    PLAYER_WIDTH: 42,
    PLAYER_HEIGHT: 42,
    PLAYER_HITBOX_W: 20,
    PLAYER_HITBOX_H: 30,
    PLAYER_START_X: 60,
    PLAYER_COLOR: '#8B4513',
    
    // Obstáculos & Dificuldade
    OBSTACLE_SPEED: 180,
    DIFFICULTY_RAMP: 0.02,
    MAX_SPEED_MULTIPLIER: 2.5,
    SPAWN_RATE_MIN: 1.5,
    SPAWN_RATE_MAX: 3.0,
    
    // Configuração Individual de Obstáculos (Largura, Altura, Offset Y do chão)
    OBSTACLE_DATA: {
        OBSTACLE_ROCK:   { w: 50, h: 50, yOffset: 0 },
        OBSTACLE_CAN:    { w: 30, h: 40, yOffset: 0 },
        OBSTACLE_PUDDLE: { w: 50, h: 50, yOffset: -35 },
        OBSTACLE_BAG:    { w: 40, h: 40, yOffset: 25 } // Offset positivo = acima do chão
    },
    
    // Eco Fragmento
    ECO_SPAWN_MIN: 12.0,
    ECO_SPAWN_MAX: 20.0,
    ECO_SIZE: 20,
    
    // Power-Ups
    POWER_DURATION: 5.0,
    TIMESCALE_CHOOSING: 0.3,
    TIMESCALE_TURBO: 1.5,
    SCORE_MULTIPLIER_TURBO: 2,
    JUMP_BOOST_FACTOR: 1.3,
    
    // Game Feel
    SHAKE_STRENGTH: 5,
    SHAKE_DECAY: 0.9,
    PARTICLE_MAX: 100,
    PARTICLE_LIFETIME: 0.5,
    FADE_DURATION: 500,
    
    // Tutorial
    TUTORIAL_DURATION: 10,
    
    // Sistema
    STORAGE_KEY: 'capivara_data_v1',
    STORAGE_KEY_HIGHSCORE: 'capivara_highscore_v3', // Legacy support if needed
    
    // --- CONTEÚDO SPRINT 5 ---
    
    SCENES: [
        {
            id: 'botanico',
            name: 'Jardim Botânico',
            desc: 'O clássico cartão postal.',
            unlockScore: 0, // Padrão
            colors: { sky: '#87CEEB', ground: '#2E8B57' }, // Fallback
            assets: ['BG_BOTANICO_1', 'BG_BOTANICO_2', 'BG_BOTANICO_3']
        },
        {
            id: 'tangua',
            name: 'Parque Tanguá',
            desc: 'Pôr do sol deslumbrante.',
            unlockScore: 1500, // Precisa de 1500 no Botânico
            colors: { sky: '#FF7F50', ground: '#8B4513' },
            assets: ['BG_TANGUA_1', 'BG_TANGUA_2', 'BG_TANGUA_3']
        },
        {
            id: 'barigui',
            name: 'Parque Barigui',
            desc: 'Capivaras noturnas.',
            unlockScore: 3000,
            colors: { sky: '#4B0082', ground: '#006400' },
            assets: ['BG_BARIGUI_1', 'BG_BARIGUI_2', 'BG_BARIGUI_3']
        }
    ],

    SKINS: [
        {
            id: 'aventureira',
            name: 'Aventureira',
            desc: 'Pronta para tudo.',
            reqType: 'default',
            reqValue: 0,
            color: '#8B4513', // Marrom padrão
            spriteKey: 'PLAYER_RUN'
        },
        {
            id: 'ciclista',
            name: 'Ciclista',
            desc: 'Colete 50 Eco Pontos.',
            reqType: 'totalEcoPoints',
            reqValue: 50,
            color: '#FFD700', // Amarelo
            spriteKey: 'PLAYER_RUN_CICLISTA'
        },
        {
            id: 'turista',
            name: 'Turista',
            desc: 'Use 10 itens guardados.',
            reqType: 'totalStoredPowerupsUsed',
            reqValue: 10,
            color: '#1E90FF', // Azul
            spriteKey: 'PLAYER_RUN_TURISTA'
        }
    ],

    ACHIEVEMENTS: [
        { id: 'A1', name: 'Primeira Corrida', desc: 'Jogue 1 vez.', condition: (stats) => stats.totalRuns >= 1 },
        { id: 'A2', name: 'Salto Seguro', desc: 'Pule 20 vezes em uma run.', condition: (stats, runStats) => runStats && runStats.jumps >= 20 },
        { id: 'A3', name: 'Guardião', desc: 'Use 1 power-up guardado.', condition: (stats) => stats.totalStoredPowerupsUsed >= 1 },
        { id: 'A4', name: 'Escolha Sábia', desc: 'Escolha 10 power-ups.', condition: (stats) => stats.totalPowerupChoices >= 10 },
        { id: 'A5', name: 'Imune', desc: '5s com Casca Protetora.', condition: (stats, runStats) => runStats && runStats.shieldTime >= 5 },
        { id: 'A6', name: 'Turbo!', desc: '500m com Turbo ativo.', condition: (stats, runStats) => runStats && runStats.turboDistance >= 500 },
        { id: 'A7', name: 'Limpeza', desc: 'Colete 100 Eco Pontos.', condition: (stats) => stats.totalEcoPoints >= 100 },
        { id: 'A8', name: 'Curitiba Roots', desc: 'Desbloqueie todos cenários.', condition: (stats, runStats, gameData) => gameData.unlockedScenes.length >= 3 }
    ],

    // Assets Paths (Expandido)
    ASSETS: {
        SPRITES: {
            // Player Default (Skin 1)
            PLAYER_RUN: 'assets/sprites/playerrunskin1.png',
            PLAYER_JUMP: 'assets/sprites/playerjumpskin1.png',
            PLAYER_SLIDE: 'assets/sprites/playerslideskin1.png',
            // Skins (Opcionais, fallback usa cor)
            PLAYER_RUN_CICLISTA: 'assets/sprites/ciclistarunskin1.png',
            PLAYER_JUMP_CICLISTA: 'assets/sprites/ciclistasaltando.png',
            PLAYER_SLIDE_CICLISTA: 'assets/sprites/ciclistaslide.png',
            PLAYER_RUN_TURISTA: 'assets/sprites/playerrunturista.png',
            // Obstáculos
            OBSTACLE_CAN: 'assets/sprites/6464latalixoskin1.png',
            OBSTACLE_ROCK: 'assets/sprites/120120obstacolopedra.png',
            OBSTACLE_PUDDLE: 'assets/sprites/pocadaguachao.png',
            OBSTACLE_BAG: 'assets/sprites/120120obstacoloflutuante.png',
            ECO_FRAGMENT: 'assets/sprites/ecoenergyfragmentleaf.png',
            // Backgrounds Botanico
            BG_BOTANICO_1: 'assets/sprites/ceubackground.png',
            BG_BOTANICO_2: 'assets/sprites/estufajardimbackground.png',
            BG_BOTANICO_3: 'assets/sprites/chaojardimbackground.png',
            // Backgrounds Tangua
            BG_TANGUA_1: 'assets/sprites/bgtangualayer1.png',
            BG_TANGUA_2: 'assets/sprites/bgtangualayer2.png',
            BG_TANGUA_3: 'assets/sprites/bgtangualayer3.png',
            // Backgrounds Barigui
            BG_BARIGUI_1: 'assets/sprites/bgbariguilayer1.png',
            BG_BARIGUI_2: 'assets/sprites/bgbariguilayer2.png',
            BG_BARIGUI_3: 'assets/sprites/bgbariguilayer3.png'
        },
        AUDIO: {
            JUMP: 'assets/audio/jump.wav',
            PICKUP: 'assets/audio/pickup.wav',
            SELECT: 'assets/audio/select.wav',
            HIT: 'assets/audio/hit.wav',
            MUSIC: 'assets/audio/music.ogg'
        }
    },
    
    ANIM: {
        RUN_FRAMES: 5,
        JUMP_FRAMES: 5,   // Ajustado para 5 frames, igual ao sprite de corrida
        SLIDE_FRAMES: 5,  // Adicionado para suportar animação de slide
        RUN_SPEED: 0.1,
        PARALLAX_SPEEDS: [0.2, 0.5, 1.0],
        FRAME_WIDTH: 0,
        FRAME_HEIGHT: 0,
        ECO_FRAMES: 5
    }
};
