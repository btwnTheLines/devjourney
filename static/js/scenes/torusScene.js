// torusScene.js
import { threeModule, scene, camera, renderer, clock } from '../core/threeSetup.js';

import { torusRings } from '../helpers/torusRings.js';
import { sprites } from '../helpers/sprites.js';
import { cameraX, scrollX } from '../helpers/scrollLogic.js';

// IMPORTANT: these are the updated audio helpers (Option 2: StereoPanner smooth)
// Make sure the relative path matches your project structure.
import { updatePan, initAudio } from '../helpers/audio.js';

// ------------------------
// MATERIAL & GEOMETRY
// ------------------------
const material = new threeModule.MeshStandardMaterial({ color: 0xc5d2b1 });
const torusGeometry = new threeModule.TorusGeometry(1.8, 0.01, 18, 110, 6.3);

// ------------------------
// CREATE TORUSES
// ------------------------
const counter = 21;
export const toruses = torusRings(counter, scene, torusGeometry, material);

export function initTorusScene() {

  // ------------------------
  // SPREAD TORUSES ALONG X-AXIS
  // ------------------------
  const spacing = 0.3;
  toruses.forEach((torus, i) => {
    torus.position.set(i * spacing, 0, 0);
    torus.material = torus.material.clone();
  });

  // ------------------------
  // TORUS GROUP
  // ------------------------
  const torusGroup = new threeModule.Group();
  toruses.forEach(t => torusGroup.add(t));
  scene.add(torusGroup);

  // ------------------------
  // ACTIVE GROUP VARIABLES
  // ------------------------
  const groupSize = 20;
  let startIndex;
  let previousIndexLeft;
  let previousIndexRight;

  // ------------------------
  // AUDIO INIT (button id must match your base.html)
  // ------------------------
  let audioInitialized = false;
  initAudio('../static/audio/moments-part2.mp3', 'playBtn').then(() => {
    audioInitialized = true;
  });

  // ------------------------
  // FADE SPRITES FUNCTION
  // ------------------------
  function fadeSpritesInRange(startIndex, endIndex) {
    const fadeSpeed = 0.05;
    sprites.forEach((sprite, index) => {
      let targetOpacity = 0.0;
      if (index >= startIndex && index < endIndex) {
        targetOpacity = 1.0;
      }
      sprite.material.opacity += (targetOpacity - sprite.material.opacity) * fadeSpeed;
    });
  }

  function fadeSpritesOutInRange(startIndex, endIndex) {
    const fadeSpeed = 0.05;

    sprites.forEach((sprite, index) => {
      // Only fade out sprites in the specified range
      if (index >= startIndex && index < endIndex) {
        const targetOpacity = 0.0;
        sprite.material.opacity += (targetOpacity - sprite.material.opacity) * fadeSpeed;

        if (sprite.material.opacity <= 0.01) { // small threshold
          sprite.material.opacity = 0;
          if (scene.children.includes(sprite)) {
            scene.remove(sprite);
          }
        }
      }
    });
  }

  // ------------------------
  // ANIMATE LOOP
  // ------------------------
  function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // ------------------------
    // Gentle sway
    // ------------------------
    const swaySpeed = 1;
    const swayAmountX = 0.01;
    torusGroup.position.x = Math.sin(time * swaySpeed) * swayAmountX;

    // Tiny rotation
    toruses.forEach(t => t.rotation.y += 0.0001);

    // ------------------------
    // Camera X Ranges for sprite fading
    // ------------------------
    if (camera.position.x <= 0.35) {
      startIndex = undefined;
      fadeSpritesInRange(20, 23); // fade in intro sprites
      // optionally fade out previous sprites
      fadeSpritesOutInRange(0, 20);
      sprites.slice(20, 23).forEach(s => scene.add(s)); // ensure sprites are in scene
    } else if (camera.position.x > 0.35 && camera.position.x < 1) {
      previousIndexRight = 0;
      startIndex = undefined;
      fadeSpritesInRange(0, 1);
      fadeSpritesOutInRange(20, 23);
      sprites.slice(0, 1).forEach(s => scene.add(s));
    } else if (camera.position.x > 1 && camera.position.x < 5.72) {
      startIndex = 0;
      previousIndexRight = 20;
      fadeSpritesInRange(1, 2);
      fadeSpritesOutInRange(0, 1);
      sprites.slice(1, 2).forEach(s => scene.add(s));
    } else if (camera.position.x > 5.72 && camera.position.x < 12) {
      startIndex = 20;
      previousIndexRight = 40;
      previousIndexLeft = 0;
      fadeSpritesInRange(2, 3);
      fadeSpritesOutInRange(1, 2);
      sprites.slice(2, 3).forEach(s => scene.add(s));
    } else if (camera.position.x > 12 && camera.position.x < 17.75) {
      startIndex = 40;
      previousIndexRight = 60;
      previousIndexLeft = 20;
      fadeSpritesInRange(3, 5);
      fadeSpritesOutInRange(2, 3);
      sprites.slice(3, 5).forEach(s => scene.add(s));
    } else if (camera.position.x > 17.75 && camera.position.x < 24) {
      startIndex = 60;
      previousIndexRight = 80;
      previousIndexLeft = 40;
      fadeSpritesInRange(5, 7);
      fadeSpritesOutInRange(3, 5);
      sprites.slice(5, 7).forEach(s => scene.add(s));
    } else if (camera.position.x > 24 && camera.position.x < 29.75) {
      startIndex = 80;
      previousIndexRight = 100;
      previousIndexLeft = 60;
      fadeSpritesInRange(7, 9);
      fadeSpritesOutInRange(5, 7);
      sprites.slice(7, 9).forEach(s => scene.add(s));
    } else if (camera.position.x > 29.75 && camera.position.x < 36) {
      startIndex = 100;
      previousIndexRight = 120;
      previousIndexLeft = 80;
      fadeSpritesInRange(9, 11);
      fadeSpritesOutInRange(7, 9);
      sprites.slice(9, 11).forEach(s => scene.add(s));
    } else if (camera.position.x > 36 && camera.position.x < 41.7) {
      startIndex = 120;
      previousIndexRight = 140;
      previousIndexLeft = 100;
      fadeSpritesInRange(11, 13);
      fadeSpritesOutInRange(9, 11);
      sprites.slice(11, 13).forEach(s => scene.add(s));
    } else if (camera.position.x > 41.7 && camera.position.x < 48) {
      startIndex = 140;
      previousIndexRight = 160;
      previousIndexLeft = 120;
      fadeSpritesInRange(13, 15);
      fadeSpritesOutInRange(11, 13);
      sprites.slice(13, 15).forEach(s => scene.add(s));
    } else if (camera.position.x > 48 && camera.position.x < 53.7) {
      startIndex = 160;
      previousIndexRight = 180;
      previousIndexLeft = 140;
      fadeSpritesInRange(15, 17);
      fadeSpritesOutInRange(13, 15);
      sprites.slice(15, 17).forEach(s => scene.add(s));
    } else if (camera.position.x > 53.7 && camera.position.x < 59.42) {
      startIndex = 180;
      previousIndexRight = 200;
      previousIndexLeft = 160;
      fadeSpritesInRange(17, 19);
      fadeSpritesOutInRange(15, 17);
      sprites.slice(17, 19).forEach(s => scene.add(s));
    } else if (camera.position.x > 59.42) {
      startIndex = 200;
      previousIndexLeft = 180;
      fadeSpritesInRange(19, 20);
      fadeSpritesOutInRange(17, 19);
      sprites.slice(19, 20).forEach(s => scene.add(s));
    }

    // ------------------------
    // Active / Deactivated torus groups
    // ------------------------
    const deactivedGroupLeft = toruses.slice(previousIndexLeft, previousIndexLeft + groupSize);
    const deactivedGroupRight = toruses.slice(previousIndexRight, previousIndexRight + groupSize);
    const activeGroup = toruses.slice(startIndex, startIndex + groupSize);
    const radius = 0.8;

    // Reset default Y
    toruses.forEach(t => t.userTargetY = 0);

    // ------------------------
    // Color and lift logic
    // ------------------------
    if (previousIndexLeft === 180) {
      // sprite_20 ending
      activeGroup.forEach((torus, i) => {
        const distanceFromCenter = Math.abs(i - (groupSize - 1) / 2) / ((groupSize - 1) / 2);
        const color = new threeModule.Color();
        color.setHSL(0.0, 1 - 0.6 * distanceFromCenter, 0.5);
        torus.userTargetColor = color;
      });

      activeGroup.forEach(torus => torus.material.color.lerp(torus.userTargetColor, 0.05));

    } else if (camera.position.x < 0.5) {
      // reverse logic
      activeGroup.forEach((torus, i) => {
        const angle = (i / (groupSize - 1)) * Math.PI;
        torus.userTargetY = Math.sin(angle) * 2 * radius;

        const distanceFromCenter = Math.abs(i - (groupSize - 1) / 2) / ((groupSize - 1) / 2);
        const color = new threeModule.Color();
        color.setHSL(0.0, 1 - 0.6 * distanceFromCenter, 0.5);
        torus.userTargetColor = color;
      });

      activeGroup.forEach(torus => {
        torus.position.y += (torus.userTargetY - torus.position.y) * 0.05;
        torus.material.color.lerp(torus.userTargetColor, 0.05);
      });

    } else {
      // general logic for sprites 1-19
      activeGroup.forEach((torus, i) => {
        const angle = (i / (groupSize - 1)) * Math.PI;
        torus.userTargetY = Math.sin(angle) * 2 * radius;

        const distanceFromCenter = Math.abs(i - (groupSize - 1) / 2) / ((groupSize - 1) / 2);
        const color = new threeModule.Color();
        color.setHSL(204/360, 0.86 * (1 - distanceFromCenter), 0.49);
        torus.userTargetColor = color;
      });

      activeGroup.forEach(torus => {
        torus.position.y += (torus.userTargetY - torus.position.y) * 0.05;
        torus.material.color.lerp(torus.userTargetColor, 0.05);
      });
    }

    // ------------------------
    // Deactivated groups descent
    // ------------------------
    deactivedGroupLeft.forEach(torus => torus.position.y -= (torus.userTargetY + torus.position.y) * 0.05);
    deactivedGroupRight.forEach(torus => torus.position.y -= (torus.userTargetY + torus.position.y) * 0.05);

    previousIndexLeft = undefined;
    previousIndexRight = undefined;

    // ------------------------
    // Smooth camera movement
    // ------------------------
    const easing = 0.05;
    cameraX.position += (scrollX.position / 10 - cameraX.position / 10) * easing;
    camera.position.x = cameraX.position / 50;

    // ------------------------
    // Audio panning (smooth stereo, 2 full left-right sweeps across 0..60)
    // ------------------------
    if (audioInitialized) updatePan();

    renderer.render(scene, camera);
  }

  animate();
}
