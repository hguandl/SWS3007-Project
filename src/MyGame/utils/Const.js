let _C = {
    gameViewport: [0, 0, 970, 600],       // viewport (orgX, orgY, width, height)
    attackVP: 25,

    // action
    none: 0,
    attack: 1,
    skill: 2,
    change: 3,
    item: 4,
<<<<<<< HEAD

    // game status
=======
    // game turnEndStatus
>>>>>>> dev
    waiting: 1,
    commandGiven: 2,
    displaying: 3,
    // character turnEndStatus
    BuffStatus: 1,
    changeHP: 2,
    changeVP: 3,

    // Buff type
    numeric: 0,
    percent: 1,

    // character type
    Monster: 0,
    Hero: 1,
};

const TURN = {
    monster: 0,
    hero: 1
};

const ALL_SPRITE_TEXTURE = [
    "assets/hero/fight/Monk Tang.png",
    "assets/hero/fight/Monkey King.png",
    "assets/hero/fight/monster.png",
    "assets/hero/fight/The Pigsy.png",
];
