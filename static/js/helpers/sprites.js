import { createTextSprite } from './createTextSprite.js'; // import our external function


// ------------------------
// Sprite array & variable
// ------------------------
let sprites = [];

// ------------------------
// Creating text sprites
// ------------------------

//To be used as the introductory sprites
// sprite_21 & sprite_22
// sprite_21
const sprite_21 = createTextSprite({
    text: 'The Torus Tube\nby\nCurby Williams',
    font: 'Bold 250px Helvetica',
    color: 'white',
    lineHeight: 250,
    canvasWidth: 5000,
    canvasHeight: 5000,
    position: { x: 0.8, y: -2.6, z: 0  },
    scale: { x: 16, y: 11, z: 1 }
});

// sprite_22
const sprite_22 = createTextSprite({
    text: 'Full-stack Developer\n+ Computer Sci Student\n+ Ex-chemical engineer',
    font: 'Bold 100px Helvetica',
    color: 'white',
    lineHeight: 100,
    canvasWidth: 5000,
    canvasHeight: 5000,
    position: { x: 0.375, y: -4.6, z: 0  },
    scale: { x: 15, y: 11, z: 1 }
});

// sprite_23
const sprite_23 = createTextSprite({
    text: 'Front-end:\nHTML, CSS, Tailwind, Bootstrap, Javascript, Three.js\n\nBackend:\nSQL, PostGreSQL, MySQL, Python, Django, Node, PHP, C++\n\nPlatforms:\nContentful, WordPress, Heroku, Github',
    font: '80px Helvetica',
    color: 'white',
    lineHeight: 100,
    canvasWidth: 5000,
    canvasHeight: 5000,
    position: { x: -1.6, y: -5.4, z: 0 },
    scale: { x: 11, y: 11, z: 1 }
});

// sprite_1
const sprite_1 = createTextSprite({
    text: 'Scroll down ↓ to move right →\n\nFor the full experience: \nEnable audio ♬ AND use headphones',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 0, y: -1.6, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_2
const sprite_2 = createTextSprite({
    text: "Welcome to 'The Torus Tube'.\nA journey through my timeline,\nwoven into an immersive\naudio-visual experience.",
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 4.2, y: -0.2, z: 0 },
    scale: { x: 5, y: 5, z: 2 }

    //position: { x: 3.8, y: -0.4, z: 0 },
    //scale: { x: 5, y: 5, z: 2 }
});

// sprite_3
const sprite_3 = createTextSprite({
    text: 'Pay attention to the audio while\nyou scroll. The audio moves\nwith you. As you move, the\naudio moves with you.',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 10.2, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// 0.09 offset between header sprites and paragraph sprites
// header sprite x position = Xpos
// paragraph sprite x position = Xpos - 0.09

// sprite_4 & sprite_5
const sprite_4 = createTextSprite({
    text: 'Education:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 16.1, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_5 = createTextSprite({
    text: 'Cape Peninsula Univeristy of Technology\nNational Diploma: Chemical Engineering\nfrom 2016 - 2020\nChemistry, Physics, Process Design,\nAdvanced mathematics',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 16, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_6 & sprite_7
const sprite_6 = createTextSprite({
    text: 'Work Experience:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 22.6, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_7 = createTextSprite({
    text: 'Chemical Engineering Intern\nElgin Fruit Juices\nfrom 2019 - 2020\nAnaerobic digestion \n+ Fruit juice concentration',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 22.51, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_8 & sprite_9
const sprite_8 = createTextSprite({
    text: 'Work Experience:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 28.1, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_9 = createTextSprite({
    text: 'Product Developer | Web Developer\nThe Good Steward project\nfrom 2020 - 2021\nFormulated and oversaw manufacture of\na custom natural meal replacement shake',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 28.01, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_10 & sprite_11
const sprite_10 = createTextSprite({
    text: 'Work Experience:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 34.2, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_11 = createTextSprite({
    text: 'Web Developer | UI/UX design\nZAknot Wedding Market\nfrom 2021 - 2022\nBuilt an online platform linking couples\nwith vendors, venues, and planners.',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 34.1, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_12 & sprite_13
const sprite_12 = createTextSprite({
    text: 'Education:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 40.1, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_13 = createTextSprite({
    text: 'University of South Africa\nBachelor of Science: Computing\nfrom 2022 - Ongoing\nHuman-computer interaction,\nDatabases, Advanced Programming',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 40, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_14 & sprite_15
const sprite_14 = createTextSprite({
    text: 'Work Experience:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 46, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_15 = createTextSprite({
    text: 'Learning Technologist | Auxilia\nfrom March 2024 - Sep 2025\nEdTech Hub (UK) & FinTech Hub (US)\nBuilt out educational content online\nfor a public-servant-focused company',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 45.91, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_16 & sprite_17
const sprite_16 = createTextSprite({
    text: 'How I work:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 52.5, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_17 = createTextSprite({
    text: '1. Detail-oriented.\n2. Calm under pressure.\n3. Clear communication is key.\n3. AI-augmented, not AI-powered.\n4. Teamwork makes the dream work.',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 52.41, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_18 & sprite_19
const sprite_18 = createTextSprite({
    text: 'Website Architecture:',
    font: 'Bold 72px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 58.1, y: -0.1, z: 0 },
    scale: { x: 5.2, y: 5.2, z: 2 }
});

const sprite_19 = createTextSprite({
    text: 'Front-end:\nHTML, CSS, Tailwind, JS, Three.js\nBackend:\nPython | Django, PostGreSQL',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x:58.01, y: -0.4, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// sprite_20
const sprite_20 = createTextSprite({
    text: 'The end.\n\nLet me know what you \nthink using the link above\n\nAudio credit to: FKJ - Moments (Part 2)',
    font: '60px Helvetica',
    color: 'white',
    lineHeight: 70,
    canvasWidth: 1500,
    canvasHeight: 1000,
    position: { x: 64.3745, y: -1.45, z: 0 },
    scale: { x: 5, y: 5, z: 2 }
});

// ------------------------
// Addding Sprites to scene & Sprite array populating
// ------------------------

sprites.push(sprite_1);
sprites.push(sprite_2);
sprites.push(sprite_3);
sprites.push(sprite_4);
sprites.push(sprite_5);
sprites.push(sprite_6);
sprites.push(sprite_7);
sprites.push(sprite_8);
sprites.push(sprite_9);
sprites.push(sprite_10);
sprites.push(sprite_11);
sprites.push(sprite_12);
sprites.push(sprite_13);
sprites.push(sprite_14);
sprites.push(sprite_15);
sprites.push(sprite_16);
sprites.push(sprite_17);
sprites.push(sprite_18);
sprites.push(sprite_19);
sprites.push(sprite_20);
sprites.push(sprite_21);
sprites.push(sprite_22);
sprites.push(sprite_23);

export { sprites };