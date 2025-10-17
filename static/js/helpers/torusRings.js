//Import from three.js in node modules
import * as threeModule from '../node_modules/three/build/three.module.js';

export function torusRings(counter, scene, torusGeometry, material){

    const toruses = [];

    while(counter>0){
        const torus = new threeModule.Mesh(torusGeometry, material);
        torus.rotateY(1.57);
        torus.position.x = counter-1;
        scene.add(torus);

        toruses.push(torus);

        //The counter number here determines the number of rings
        counter -= 0.1;
    }

    return toruses;

}