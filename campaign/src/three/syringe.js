// Real syringe model (assets/models/syringe.glb), restyled for the hero's lit scene:
// clear plastic barrel with printed scale, white plunger, rubber tip, emerald hub, steel needle.
// Returned group is centred, ~`length` world units long, needle pointing along +X.
import {
    Box3, Vector3, Group, Mesh, MeshPhysicalMaterial, MeshStandardMaterial, MeshBasicMaterial,
    TextureLoader, SRGBColorSpace, DoubleSide
} from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const BASE = 'assets/models/';
let proto = null;

export function loadSyringe(length = 1.35) {
    if (!proto) {
        proto = Promise.all([
            new GLTFLoader().loadAsync(BASE + 'syringe.glb'),
            new TextureLoader().loadAsync(BASE + 'syringe-scale.webp')
        ]).then(([gltf, scale]) => build(gltf.scene, scale, length));
    }
    return proto;
}

function build(model, scaleTex, length) {
    scaleTex.flipY = false; // glTF UV convention
    scaleTex.colorSpace = SRGBColorSpace;
    const mats = {
        barrel: new MeshPhysicalMaterial({ color: '#e6f2ec', transparent: true, opacity: 0.55, roughness: 0.08, clearcoat: 1, clearcoatRoughness: 0.05, depthWrite: false, side: DoubleSide }),
        scale: new MeshBasicMaterial({ map: scaleTex, color: '#183027', transparent: true, depthWrite: false, polygonOffset: true, polygonOffsetFactor: -1 }),
        plunger: new MeshPhysicalMaterial({ color: '#f4f6f5', roughness: 0.32, clearcoat: 0.5 }),
        rubber: new MeshStandardMaterial({ color: '#2b2f2e', roughness: 0.62 }),
        adapter: new MeshPhysicalMaterial({ color: '#0f8a5f', roughness: 0.28, clearcoat: 0.7 }),
        needle: new MeshStandardMaterial({ color: '#dfe4e6', metalness: 1, roughness: 0.22 })
    };
    let needle = null;
    const decals = [];
    model.traverse(o => {
        if (!o.isMesh) return;
        const n = (o.material && o.material.name || o.name).toLowerCase();
        const key = n.includes('rubber') ? 'rubber' : n.includes('plunger') ? 'plunger' : n.includes('needle') ? 'needle' : n.includes('adapter') ? 'adapter' : 'barrel';
        o.material = mats[key];
        o.castShadow = o.receiveShadow = false;
        if (key === 'needle') needle = o;
        if (key === 'barrel') decals.push(o);
    });
    // printed millilitre scale sits just over the clear barrel
    decals.forEach(o => { const m = new Mesh(o.geometry, mats.scale); m.renderOrder = 3; o.add(m); });

    // centre, size and aim: longest axis -> X, needle end -> +X
    model.updateMatrixWorld(true);
    const box = new Box3().setFromObject(model), size = box.getSize(new Vector3()), centre = box.getCenter(new Vector3());
    const axis = size.x >= size.y && size.x >= size.z ? 'x' : size.y >= size.z ? 'y' : 'z';
    const tip = needle ? new Box3().setFromObject(needle).getCenter(new Vector3()) : centre.clone().setComponent('xyz'.indexOf(axis), Infinity);
    const sign = Math.sign(tip[axis] - centre[axis]) || 1;
    model.position.sub(centre);
    const aim = new Group();
    aim.add(model);
    if (axis === 'z') aim.rotation.y = sign * Math.PI / 2;
    else if (axis === 'y') aim.rotation.z = -sign * Math.PI / 2;
    else if (sign < 0) aim.rotation.y = Math.PI;
    const root = new Group();
    root.add(aim);
    root.scale.setScalar(length / Math.max(size.x, size.y, size.z));
    root.userData.baseScale = root.scale.x;
    root.rotation.order = 'YZX'; // yaw to the flight path, pitch with the bob, roll about the barrel
    return root;
}
