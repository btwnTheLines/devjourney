// Import base setup (you already have this file set up in your structure)
import { threeModule, scene, camera, renderer, clock } from '../core/threeSetup.js';

export function initProfilesScene() {
    console.log("✅ initProfilesScene is running!");

    // ------------------------
    // CAMERA SETTINGS
    // ------------------------

    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    // ------------------------
    // LIGHTS
    // ------------------------

    const ambientLight = new threeModule.AmbientLight(0xd10679, 1);
    scene.add(ambientLight);

    const pointLight = new threeModule.PointLight(0xd10679, 20);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    const rimLight = new threeModule.PointLight(0x00ffff, 5);
    rimLight.position.set(-10, -10, -10);
    scene.add(rimLight);

    // ------------------------
    // MATERIALS (Glass and glow)
    // ------------------------

    const glassMaterialOuter = new threeModule.MeshPhysicalMaterial({
        color: 0xffffff,
        metalness: 0.1,
        roughness: 0.05,
        transmission: 1,
        thickness: 3,
        ior: 1.5,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
    });

    const glassMaterialInner = new threeModule.MeshPhysicalMaterial({
        color: 0x404040,
        metalness: 0.2,
        roughness: 0.05,
        transmission: 0.9,
        thickness: 1.5,
        ior: 1.45,
        clearcoat: 1,
        clearcoatRoughness: 0,
        transparent: true,
        opacity: 0.5,
        depthWrite: false,
    });

    // ------------------------
    // HELPER — HEXAGON PRISM CREATOR
    // ------------------------

    function createHexPrism(radius, height, material) {
        const shape = new threeModule.Shape();
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const x = Math.cos(angle) * radius;
            const y = Math.sin(angle) * radius;
            if (i === 0) shape.moveTo(x, y);
            else shape.lineTo(x, y);
        }
        shape.closePath();

        const extrudeSettings = { steps: 1, depth: height, bevelEnabled: false };
        const geometry = new threeModule.ExtrudeGeometry(shape, extrudeSettings);
        geometry.center();

        return new threeModule.Mesh(geometry, material);
    }

    // ------------------------
    // CREATE PRISMS
    // ------------------------

    const innerPrism = createHexPrism(3.5, 7, glassMaterialInner);
    const outerPrism = createHexPrism(7, 10, glassMaterialOuter);

    scene.add(outerPrism);
    outerPrism.add(innerPrism);

    // ------------------------
    // EDGE LINES
    // ------------------------

    const edgeMaterialOuter = new threeModule.LineBasicMaterial({
        color: 0xd4b020,
        transparent: true,
        opacity: 0.4,
        polygonOffset: true,
        polygonOffsetFactor: -1,
    });

    const edgeMaterialInner = new threeModule.LineBasicMaterial({
        color: 0x00ffff,
        transparent: true,
        opacity: 0.4,
        polygonOffset: true,
        polygonOffsetFactor: -1,
    });

    const edgesOuter = new threeModule.EdgesGeometry(outerPrism.geometry);
    const lineOuter = new threeModule.LineSegments(edgesOuter, edgeMaterialOuter);
    outerPrism.add(lineOuter);

    const edgesInner = new threeModule.EdgesGeometry(innerPrism.geometry);
    const lineInner = new threeModule.LineSegments(edgesInner, edgeMaterialInner);
    innerPrism.add(lineInner);

    // ------------------------
    // TORUSES (floating rings)
    // ------------------------

    const toruses = [];
    const torusRadius = 2.2;
    const tubeRadius = 0.0005;

    for (let i = 0; i < 3; i++) {
        const torusGeo = new threeModule.TorusGeometry(torusRadius, tubeRadius, 16, 100);
        const torusMat = new threeModule.MeshLambertMaterial({
            color: 0xaf15b3,
            wireframe: true,
            transparent: true,
            opacity: 0.4
        });
        const torus = new threeModule.Mesh(torusGeo, torusMat);
        torus.rotation.x = i * (Math.PI / 3);
        torus.rotation.y = i * (Math.PI / 4);
        innerPrism.add(torus);
        toruses.push(torus);
    }

    // ------------------------
    // CENTER GLOWING SPHERE
    // ------------------------

    const sphereGeo = new threeModule.SphereGeometry(0.25, 32, 32);
    const sphereMat = new threeModule.MeshStandardMaterial({
        color: 0x00ffff,
        emissive: 0x00ffff,
        emissiveIntensity: 20,
        roughness: 0,
        metalness: 0.2,
    });
    const sphere = new threeModule.Mesh(sphereGeo, sphereMat);
    innerPrism.add(sphere);

    const coreLight = new threeModule.PointLight(0xffffff, 2, 50, 2);
    sphere.add(coreLight);

    // ------------------------
    // OUTER PARTICLE SPHERE
    // ------------------------

    const particleCount = 5000;
    const particleRadius = 15;
    const particlesGeo = new threeModule.BufferGeometry();
    const positions = [];

    for (let i = 0; i < particleCount; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        const x = particleRadius * Math.sin(phi) * Math.cos(theta);
        const y = particleRadius * Math.sin(phi) * Math.sin(theta);
        const z = particleRadius * Math.cos(phi);
        positions.push(x, y, z);
    }

    particlesGeo.setAttribute('position', new threeModule.Float32BufferAttribute(positions, 3));

    const particlesMat = new threeModule.PointsMaterial({
        color: 0xffffff,
        size: 0.05,
        transparent: true,
        opacity: 0.8,
        depthWrite: false,
        blending: threeModule.AdditiveBlending
    });

    const particleSphere = new threeModule.Points(particlesGeo, particlesMat);
    scene.add(particleSphere);

    // ------------------------
    // MOUSE INTERACTIVITY
    // ------------------------

    const mouse = { x: 0, y: 0 };
    window.addEventListener('mousemove', (event) => {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    });

    // ------------------------
    // ANIMATION LOOP
    // ------------------------

    function animate() {
        requestAnimationFrame(animate);

        const elapsed = clock.getElapsedTime();

        // Rotate prisms normally
        outerPrism.rotation.y = elapsed * 0.2;
        innerPrism.rotation.x = Math.sin(elapsed * 0.4) * 0.4;
        innerPrism.rotation.y = elapsed * 0.3;

        // ------------------------
        // INTERACTIVE UPDATES
        // ------------------------

        // Outer prism tilts slightly with mouse
        outerPrism.rotation.x = mouse.y * 0.2; // tilt up/down
        outerPrism.rotation.z = mouse.x * 0.2; // tilt left/right

        // Inner prism "morph" by scaling axes based on mouse
        innerPrism.scale.x = 1 + mouse.x * 0.2;
        innerPrism.scale.y = 1 + mouse.y * 0.2;
        innerPrism.scale.z = 1 + (mouse.x + mouse.y) * 0.1;

        // Inner sphere color changes with mouse
        const r = Math.min(Math.max((mouse.x + 1) / 2, 0), 1);
        const g = Math.min(Math.max((mouse.y + 1) / 2, 0), 1);
        const b = 1 - r * 0.5;
        sphere.material.color.setRGB(r, g, b);
        sphere.material.emissive.setRGB(r, g, b);

        // Rotate toruses
        toruses.forEach((torus, i) => {
            torus.rotation.x += 0.01 * (i + 1);
            torus.rotation.y += 0.008 * (i + 1);
        });

        // Glowing sphere pulse
        const scale = 1 + Math.sin(elapsed * 4) * 0.1;
        sphere.scale.setScalar(scale);
        coreLight.intensity = 2.2 + Math.sin(elapsed * 6) * 0.4;

        // Animate particle sphere slowly
        particleSphere.rotation.y += 0.0005;
        particleSphere.rotation.x += 0.0003;

        renderer.render(scene, camera);
    }

    animate();
}
