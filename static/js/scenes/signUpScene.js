import { threeModule, scene, camera, renderer, clock } from '../core/threeSetup.js';

export function initSignUpScene() {
    console.log("✅ initSignUpScene is running!");

    // ------------------------
    // CAMERA SETTINGS
    // ------------------------
    camera.position.z = 10;           // Zoom: decrease to zoom in, increase to zoom out
    camera.position.y = 2;            // Vertical offset
    camera.rotation.x = -0.2;         // Tilt the vortex for 3D perspective

    // ------------------------
    // PARTICLE SETTINGS
    // ------------------------
    const particleCount = 80000;      // Total number of particles
    const particleSize = 0.0025;       // Size of each particle
    const spiralTurns = 10;            // Number of spiral rotations
    const spiralHeight = 10;           // Vertical height of vortex
    const spiralRadius = 10;           // Max radius from center
    const randomness = 2;           // Scatter of particles (X,Y,Z)

    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const baseColor = new threeModule.Color(0xffffff); // Default color
    const coreColor = new threeModule.Color(0x83cfde); // Glowing center

    // ------------------------
    // GENERATE VORTEX PARTICLES
    // ------------------------
// ------------------------
// GENERATE VORTEX PARTICLES (flattened Y)
// ------------------------
for (let i = 0; i < particleCount; i++) {
    const t = (i / particleCount) * spiralTurns * Math.PI * 4; // Angle around spiral
    const radius = Math.random() * spiralRadius;               // Radius from center
    const y = (Math.random() - 0.5) * spiralHeight;           // Uniform vertical spread

    // Positions (X,Y,Z)
    positions[i * 3] = Math.cos(t) * radius + (Math.random() - 0.5) * randomness;
    positions[i * 3 + 1] = y + (Math.random() - 0.5) * randomness;
    positions[i * 3 + 2] = Math.sin(t) * radius + (Math.random() - 0.5) * randomness;

    // Colors (all start as white)
    colors[i * 3] = baseColor.r;
    colors[i * 3 + 1] = baseColor.g;
    colors[i * 3 + 2] = baseColor.b;
}


    const geometry = new threeModule.BufferGeometry();
    geometry.setAttribute('position', new threeModule.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new threeModule.BufferAttribute(colors, 3));

    const material = new threeModule.PointsMaterial({
        size: particleSize,
        vertexColors: true,
        transparent: true,
        opacity: 0.9,
        depthWrite: false
    });

    const particles = new threeModule.Points(geometry, material);
    scene.add(particles);

    // ------------------------
    // MOUSE INTERACTION
    // ------------------------
    const mouse = new threeModule.Vector2(-100, -100); // offscreen default

    window.addEventListener('mousemove', (event) => {
        // Normalized coordinates -1 to 1
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // ------------------------
    // ANIMATION LOOP
    // ------------------------
    function animate() {
        requestAnimationFrame(animate);
        const elapsed = clock.getElapsedTime();

        const positionsAttr = particles.geometry.getAttribute('position');
        const colorsAttr = particles.geometry.getAttribute('color');

        // Rotate entire vortex slowly around Y-axis
        particles.rotation.y += 0.00025;

        // Mouse interaction parameters
        const radiusEffect = 0.6;  // smaller = more concentrated effect
        const intensity = 1.25;     // increase for stronger blue

        for (let i = 0; i < particleCount; i++) {
            const ix = i * 3;
            const iy = i * 3 + 1;
            const iz = i * 3 + 2;

            // Convert particle to screen space
            const particleVector = new threeModule.Vector3(
                positionsAttr.array[ix],
                positionsAttr.array[iy],
                positionsAttr.array[iz]
            );
            particleVector.project(camera);

            // Distance to mouse in normalized device coords
            const dx = particleVector.x - mouse.x;
            const dy = particleVector.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Apply color effect: closer to mouse = more blue
            if (dist < radiusEffect) {
                const factor = 1 - dist / radiusEffect;
                colorsAttr.array[ix] = baseColor.r * (1 - factor) + coreColor.r * factor * intensity;
                colorsAttr.array[iy] = baseColor.g * (1 - factor) + coreColor.g * factor * intensity;
                colorsAttr.array[iz] = baseColor.b * (1 - factor) + coreColor.b * factor * intensity;

                // Optional: move particles slightly away from mouse
                positionsAttr.array[ix] += dx * 0.01 * factor;
                positionsAttr.array[iy] += dy * 0.01 * factor;
            } else {
                // Fade back to base color
                colorsAttr.array[ix] += (baseColor.r - colorsAttr.array[ix]) * 0.5;
                colorsAttr.array[iy] += (baseColor.g - colorsAttr.array[iy]) * 0.5;
                colorsAttr.array[iz] += (baseColor.b - colorsAttr.array[iz]) * 0.5;
            }

            // Ensure particle stays roughly in bounds
            positionsAttr.array[iy] = Math.max(Math.min(positionsAttr.array[iy], spiralHeight / 2), -spiralHeight / 2);
        }

        positionsAttr.needsUpdate = true;
        colorsAttr.needsUpdate = true;

        renderer.render(scene, camera);
    }

    animate();
}
