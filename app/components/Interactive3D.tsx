'use client';

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

interface CrossProps {
    scale?: number;
}

// 3D Cross Component
function Cross3D({ scale = 1 }: CrossProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.2;
            groupRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.05;

            // Hover effect - slight scale up
            const targetScale = hovered ? scale * 1.1 : scale;
            groupRef.current.scale.lerp(
                new THREE.Vector3(targetScale, targetScale, targetScale),
                0.1
            );
        }
    });

    // Warm clay/terracotta color
    const clayColor = '#C4A484';
    const highlightColor = '#D4B896';

    return (
        <Float
            speed={2}
            rotationIntensity={0.3}
            floatIntensity={0.5}
        >
            <group
                ref={groupRef}
                scale={scale}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Vertical bar of cross */}
                <RoundedBox
                    args={[0.4, 1.6, 0.4]}
                    radius={0.08}
                    smoothness={4}
                    position={[0, 0, 0]}
                >
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : clayColor}
                        factor={0.1}
                        speed={hovered ? 2 : 0.5}
                        roughness={0.8}
                        metalness={0.05}
                    />
                </RoundedBox>

                {/* Horizontal bar of cross */}
                <RoundedBox
                    args={[1.1, 0.35, 0.35]}
                    radius={0.06}
                    smoothness={4}
                    position={[0, 0.35, 0]}
                >
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : clayColor}
                        factor={0.1}
                        speed={hovered ? 2 : 0.5}
                        roughness={0.8}
                        metalness={0.05}
                    />
                </RoundedBox>
            </group>
        </Float>
    );
}

// Dove Component (alternative option)
function Dove3D({ scale = 1 }: CrossProps) {
    const groupRef = useRef<THREE.Group>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (groupRef.current) {
            // Gentle floating and rotation
            groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.3;
            groupRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.1;
        }
    });

    const doveColor = '#F5F0E8';
    const highlightColor = '#FFFFFF';

    return (
        <Float speed={3} rotationIntensity={0.2} floatIntensity={0.8}>
            <group
                ref={groupRef}
                scale={scale}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                {/* Body */}
                <mesh position={[0, 0, 0]}>
                    <sphereGeometry args={[0.5, 32, 32]} />
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : doveColor}
                        factor={0.05}
                        speed={1}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                {/* Head */}
                <mesh position={[0.4, 0.2, 0]}>
                    <sphereGeometry args={[0.25, 32, 32]} />
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : doveColor}
                        factor={0.05}
                        speed={1}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                {/* Left Wing */}
                <mesh position={[-0.2, 0.3, 0.4]} rotation={[0.3, 0, 0.5]}>
                    <boxGeometry args={[0.6, 0.08, 0.4]} />
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : doveColor}
                        factor={0.2}
                        speed={hovered ? 4 : 2}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                {/* Right Wing */}
                <mesh position={[-0.2, 0.3, -0.4]} rotation={[-0.3, 0, 0.5]}>
                    <boxGeometry args={[0.6, 0.08, 0.4]} />
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : doveColor}
                        factor={0.2}
                        speed={hovered ? 4 : 2}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>

                {/* Tail */}
                <mesh position={[-0.6, 0, 0]} rotation={[0, 0, 0.3]}>
                    <boxGeometry args={[0.4, 0.06, 0.3]} />
                    <MeshWobbleMaterial
                        color={hovered ? highlightColor : doveColor}
                        factor={0.1}
                        speed={1}
                        roughness={0.9}
                        metalness={0}
                    />
                </mesh>
            </group>
        </Float>
    );
}

// Heart Component (another option)
function Heart3D({ scale = 1 }: CrossProps) {
    const meshRef = useRef<THREE.Mesh>(null);
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        if (meshRef.current) {
            // Heartbeat effect
            const beat = Math.sin(state.clock.elapsedTime * 3) * 0.05 + 1;
            const hoverScale = hovered ? 1.15 : 1;
            meshRef.current.scale.setScalar(scale * beat * hoverScale);
            meshRef.current.rotation.y = state.clock.elapsedTime * 0.3;
        }
    });

    // Create heart shape
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x, y + 0.25);
    heartShape.bezierCurveTo(x, y + 0.25, x - 0.25, y, x - 0.25, y);
    heartShape.bezierCurveTo(x - 0.55, y, x - 0.55, y + 0.35, x - 0.55, y + 0.35);
    heartShape.bezierCurveTo(x - 0.55, y + 0.55, x - 0.35, y + 0.77, x, y + 1);
    heartShape.bezierCurveTo(x + 0.35, y + 0.77, x + 0.55, y + 0.55, x + 0.55, y + 0.35);
    heartShape.bezierCurveTo(x + 0.55, y + 0.35, x + 0.55, y, x + 0.25, y);
    heartShape.bezierCurveTo(x + 0.1, y, x, y + 0.25, x, y + 0.25);

    const extrudeSettings = {
        depth: 0.3,
        bevelEnabled: true,
        bevelSegments: 2,
        steps: 2,
        bevelSize: 0.05,
        bevelThickness: 0.05
    };

    const heartColor = '#E8A0A0';
    const highlightColor = '#F0B0B0';

    return (
        <Float speed={2} rotationIntensity={0.4} floatIntensity={0.6}>
            <mesh
                ref={meshRef}
                rotation={[Math.PI, 0, 0]}
                position={[0, 0.5, 0]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <extrudeGeometry args={[heartShape, extrudeSettings]} />
                <MeshWobbleMaterial
                    color={hovered ? highlightColor : heartColor}
                    factor={0.1}
                    speed={hovered ? 3 : 1}
                    roughness={0.85}
                    metalness={0.05}
                />
            </mesh>
        </Float>
    );
}

// Main Canvas Wrapper Component
interface Interactive3DProps {
    type?: 'cross' | 'dove' | 'heart';
    className?: string;
    scale?: number;
}

export default function Interactive3D({
    type = 'cross',
    className = '',
    scale = 1
}: Interactive3DProps) {
    return (
        <div className={`cursor-pointer ${className}`}>
            <Canvas
                camera={{ position: [0, 0, 4], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                {/* Ambient Light for soft overall lighting */}
                <ambientLight intensity={0.6} />

                {/* Main directional light */}
                <directionalLight
                    position={[5, 5, 5]}
                    intensity={1}
                    castShadow
                />

                {/* Fill light from below */}
                <directionalLight
                    position={[-3, -3, 2]}
                    intensity={0.3}
                    color="#FFE4C4"
                />

                {/* Warm rim light */}
                <pointLight
                    position={[0, 3, -3]}
                    intensity={0.5}
                    color="#FFF8DC"
                />

                {/* Render selected 3D object */}
                {type === 'cross' && <Cross3D scale={scale} />}
                {type === 'dove' && <Dove3D scale={scale} />}
                {type === 'heart' && <Heart3D scale={scale} />}
            </Canvas>
        </div>
    );
}
