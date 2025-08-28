'use client';

import { Canvas, extend, useFrame, useThree } from '@react-three/fiber';
import { useAspect, useTexture } from '@react-three/drei';
import { useMemo, useRef, useState, useEffect } from 'react';
import * as THREE from 'three/webgpu';
import { bloom } from 'three/examples/jsm/tsl/display/BloomNode.js';
import { Mesh } from 'three';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { AnimatedBorder } from '@/components/ui/AnimatedBorder';
// Update the import path to the correct relative location
import {
  color,
  abs,
  blendScreen,
  float,
  mod,
  mx_cell_noise_float,
  oneMinus,
  smoothstep,
  texture,
  uniform,
  uv,
  vec2,
  vec3,
  pass,
  mix,
  add

} from 'three/tsl';
import { Vector2 } from 'three';
import { LiquidButton } from './liquid-glass-button';


// Define GradientButton directly for this example
const GradientButton = ({
    children,
    onClick,
    className,
    style
}: {
    children: React.ReactNode;
    onClick: () => void;
    className?: string;
    style?: React.CSSProperties;
}) => (
    <button
        onClick={onClick}
        className={cn(
            "px-8 py-4 bg-white/10 border border-white/20   text-white font-bold text-lg backdrop-blur-md",
            "hover:bg-white/20 hover:border-white/40 transition-all duration-300",
            "animate-fade-in-up opacity-0", // Animation class
            className
        )}
        style={style}
    >
        {children}
    </button>
);


const TEXTUREMAP = { src: 'https://i.postimg.cc/XYwvXN8D/img-4.png' };
const DEPTHMAP = { src: 'https://i.postimg.cc/2SHKQh2q/raw-4.webp' };

extend(THREE as any);

// Post Processing component (largely unchanged, but timing can be tweaked)
const PostProcessing = ({ strength = 1, threshold = 1 }: { strength?: number; threshold?: number; }) => {
  const { gl, scene, camera } = useThree();
  const progressRef = useRef({ value: 0 });

  const render = useMemo(() => {
    const postProcessing = new THREE.PostProcessing(gl as any);
    const scenePass = pass(scene, camera);
    const bloomPass = bloom(scenePass.getTextureNode('output'), strength, 0.5, threshold);
    postProcessing.outputNode = scenePass.add(bloomPass);
    return postProcessing;
  }, [camera, gl, scene, strength, threshold]);

  useFrame(({ clock }) => {
    // A gentler, continuous pulse after the initial scan
    progressRef.current.value = Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5;
    render.renderAsync();
  }, 1);

  return null;
};

const WIDTH = 300;
const HEIGHT = 300;



// Scene component (largely unchanged)
const Scene = () => {
  const [rawMap, depthMap] = useTexture([TEXTUREMAP.src, DEPTHMAP.src]);
  const meshRef = useRef<Mesh>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (rawMap && depthMap) setVisible(true);
  }, [rawMap, depthMap]);



  const { material, uniforms } = useMemo(() => {
    const uPointer = uniform(new THREE.Vector2(0));
    const uProgress = uniform(0);
    const strength = 0.01;
    const tDepthMap = texture(depthMap);
    const tMap = texture(rawMap, uv().add(tDepthMap.r.mul(uPointer).mul(strength)));
    const aspect = float(WIDTH).div(HEIGHT);
    const tUv = vec2(uv().x.mul(aspect), uv().y);
    const tiling = vec2(120.0);
    const tiledUv = mod(tUv.mul(tiling), 2.0).sub(1.0);
    const brightness = mx_cell_noise_float(tUv.mul(tiling).div(2));
    const dist = float(tiledUv.length());
    const dot = float(smoothstep(0.5, 0.49, dist)).mul(brightness);
    const depth = tDepthMap;
    const flow = oneMinus(smoothstep(0, 0.02, abs(depth.sub(uProgress))));
    const mask = dot.mul(flow).mul(vec3(10, 0, 0));
    const final = blendScreen(tMap, mask);
    const material = new THREE.MeshBasicNodeMaterial({ colorNode: final, transparent: true, opacity: 0 });
    return { material, uniforms: { uPointer, uProgress } };
  }, [rawMap, depthMap]);

  const [w, h] = useAspect(WIDTH, HEIGHT);

  useFrame(({ clock, pointer }) => {
    uniforms.uProgress.value = (Math.sin(clock.getElapsedTime() * 0.5) * 0.5 + 0.5);
    uniforms.uPointer.value = pointer;
    if (meshRef.current && meshRef.current.material) {
      const mat = meshRef.current.material as any;
      mat.opacity = THREE.MathUtils.lerp(mat.opacity, visible ? 1 : 0, 0.07);
    }
  });

  const scaleFactor = 0.40;
  return (
    <mesh ref={meshRef} scale={[w * scaleFactor, h * scaleFactor, 1]} material={material}>
      <planeGeometry />
    </mesh>
  );
};




// **Improved HTML Component**
export const Html: React.FC = () => {

    
    const router = useRouter();
    const service = { path: "/pages/auth?mode=payroll" };
    const headlineWords = ['Pay', 'Your', 'Workforce'];

    return (


        // Main container with background
        <div className='h-screen w-full bg-black relative' >
            
            {/* Three.js Canvas - Placed in the background */}
            <Canvas
                flat
                gl={async (props) => {
                    const renderer = new THREE.WebGPURenderer(props as any);
                    await renderer.init();
                    return renderer;
                }}
                className="absolute inset-0 z-0" // Lower z-index
            >

                <PostProcessing strength={1.2} threshold={0.8} />
                <Scene />
            </Canvas>

            {/* UI Layer with Glassmorphism */}
            <div className="absolute inset-0 z-10 flex items-center justify-center p-8">
    <div className="w-full h-full relative">
        
        {/* Layer 1: The background and border shape (this gets clipped) */}
  <AnimatedBorder />

        
        {/* Layer 2: The content (this is not clipped) */}
        <div className="w-full h-full flex flex-col items-center justify-center text-center relative px-4">

            {/* Top Border Break */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4" style={{ background: '#ac98b7ff' }}>
                <p className="text-xs text-black/100 tracking-widest uppercase">Global Web3 Finance Infrastructure</p>
            </div>

            {/* Main Content Area */}
            <div className="flex flex-col items-center justify-center">
                 {/* Unified Headline with Staggered Animation */}
                <h1 className="text-6xl md:text-8xl lg:text-9xl  tracking-tighter leading-tight text-white">
  {headlineWords.map((word, index) => (
    <span
      key={index}
      className="inline-block animate-fade-in-up opacity-0"
      style={{ animationDelay: `${0.8 + index * 0.15}s` }}
    >
      {word}&nbsp;
    </span>
  ))}
</h1>

                {/* Subtitle with Animation */}
                <p
                    className="mt-6 max-w-3xl text-xl md:text-2xl lg:text-3xl text-white/80 animate-fade-in-up opacity-0"
                    style={{ animationDelay: '1.4s' }}
                >
                    Global payroll and compliance, simplified and secured.
                </p>
            </div>
           
            {/* Bottom Border Break */}
            <div className="absolute bottom-16 left-1/2 -translate-x-1/2 translate-y-1/2 text-white/100  px-0" >
                <LiquidButton
                    onClick={() => router.push(service.path)}
                    style={{ animationDelay: '1.8s' }}
                >
                    Get's Started
                </LiquidButton>
            </div>
            
        </div>
    </div>
</div>
        </div>
    );
};

export default Html;