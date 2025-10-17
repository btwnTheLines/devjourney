import * as threeModule from '../node_modules/three/build/three.module.js';

/**
 * Create a 3D text sprite
 * @param {Object} options - configuration options
 * @param {string} options.text - text content, use '\n' for multiple lines
 * @param {string} options.font - canvas font string, e.g., 'italic 60px Verdana'
 * @param {string} options.color - fill color
 * @param {number} options.lineHeight - vertical space between lines
 * @param {number} options.canvasWidth - canvas width
 * @param {number} options.canvasHeight - canvas height
 * @param {Object} options.position - {x, y, z} position in scene
 * @param {Object} options.scale - {x, y, z} scale of sprite
 * @returns {THREE.Sprite} - Three.js sprite object
 */

export function createTextSprite({
    text = '',
    font = '30px Arial',
    color = 'white',
    lineHeight = 40,
    canvasWidth = 1024,
    canvasHeight = 512,
    position = { x: 0, y: 0, z: 0 },
    scale = { x: 1, y: 1, z: 1 },
    initialOpacity = 0.0 
}) {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');

    // Draw text
    ctx.font = font;
    ctx.fillStyle = color;

    const lines = text.split('\n');
    let y = lineHeight; // initial vertical position

    lines.forEach(line => {
        ctx.fillText(line, 0, y);
        y += lineHeight;
    });

    // Create texture & sprite
    const texture = new threeModule.CanvasTexture(canvas);
    const material = new threeModule.SpriteMaterial({ 
        map: texture,
        transparent: true,
        opacity: initialOpacity
    });

    const sprite = new threeModule.Sprite(material);

    // Apply scale & position
    sprite.scale.set(scale.x, scale.y, scale.z);
    sprite.position.set(position.x, position.y, position.z);

    sprite.userData.targetOpacity = initialOpacity;

    return sprite;
}