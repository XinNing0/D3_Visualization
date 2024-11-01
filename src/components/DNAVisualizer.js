// DNAVisualizer.js
import React, { useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const DNAVisualizer = () => {
    useEffect(() => {
        // Create the scene, camera, and renderer
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        document.body.appendChild(renderer.domElement);

        // Add orbit controls for camera movement
        const controls = new OrbitControls(camera, renderer.domElement);

        // Create the DNA structure
        const numBasePairs = 23;
        const helixRadius = 1;
        const helixHeight = 0.5;
        const strandMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
        const basePairMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });

        // Create strands
        const strandGeometry = new THREE.CylinderGeometry(0.05, 0.05, numBasePairs * helixHeight, 8);
        const strand1 = new THREE.Mesh(strandGeometry, strandMaterial);
        const strand2 = new THREE.Mesh(strandGeometry, strandMaterial);
        strand1.position.x = -helixRadius;
        strand2.position.x = helixRadius;

        // Add strands to the scene
        scene.add(strand1);
        scene.add(strand2);

        // Create base pairs and add them to the scene
        for (let i = 0; i < numBasePairs; i++) {
            const angle = (i / numBasePairs) * Math.PI * 2;
            const y = i * helixHeight;

            const basePair = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.5, 8), basePairMaterial);
            basePair.rotation.z = Math.PI / 2; // Rotate to align with the strands
            basePair.position.set(
                Math.cos(angle) * helixRadius,
                y,
                Math.sin(angle) * helixRadius
            );

            // Store index and base pair information for interaction
            basePair.userData = { index: i, base: `Base Pair ${i + 1}` };

            // Add click event
            basePair.onClick = () => {
                alert(`You clicked on ${basePair.userData.base}`);
                basePair.material.color.set(Math.random() * 0xffffff); // Change color on click
            };

            scene.add(basePair);
        }

        // Raycaster for detecting clicks
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();

        // Set camera position
        camera.position.z = 10;

        // Animation loop
        const animate = () => {
            requestAnimationFrame(animate);
            controls.update();
            renderer.render(scene, camera);
        };

        // Handle mouse click event
        const onMouseClick = (event) => {
            // Convert mouse coordinates to normalized device coordinates
            mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
            mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

            // Calculate objects intersecting the picking ray
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(scene.children);

            // If a base pair was clicked, trigger its onClick function
            if (intersects.length > 0) {
                const clickedObject = intersects[0].object;
                if (clickedObject.onClick) {
                    clickedObject.onClick();
                }
            }
        };

        // Add event listener for clicks
        window.addEventListener('click', onMouseClick, false);

        // Start animation
        animate();

        // Cleanup on component unmount
        return () => {
            window.removeEventListener('click', onMouseClick);
            renderer.dispose();
            document.body.removeChild(renderer.domElement);
        };
    }, []); // Empty dependency array means this effect runs once

    return (
        <div>
            <h2>3D DNA Visualization</h2>
            {/* The canvas will be rendered directly to the document body */}
        </div>
    );
};

export default DNAVisualizer;
