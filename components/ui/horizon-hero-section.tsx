// HeroSection.tsx
import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

// Type definitions
interface CameraPosition {
  x: number;
  y: number;
  z: number;
}

interface MountainLayer {
  distance: number;
  height: number;
  color: number;
  opacity: number;
}

interface ThreeRefs {
  scene: THREE.Scene | null;
  camera: THREE.PerspectiveCamera | null;
  renderer: THREE.WebGLRenderer | null;
  composer: EffectComposer | null;
  stars: THREE.Points[];
  nebula: THREE.Mesh | null;
  mountains: THREE.Mesh[];
  animationId: number | null;
  targetCameraX?: number;
  targetCameraY?: number;
  targetCameraZ?: number;
  locations?: number[];
}

interface SectionContent {
  line1: string;
  line2: string;
}

export const Component: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const subtitleRef = useRef<HTMLDivElement>(null);
  const scrollProgressRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  const smoothCameraPos = useRef<CameraPosition>({ x: 0, y: 30, z: 100 });
  const cameraVelocity = useRef<CameraPosition>({ x: 0, y: 0, z: 0 });
  
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [currentSection, setCurrentSection] = useState<number>(1);
  const [isReady, setIsReady] = useState<boolean>(false);
  const totalSections: number = 2;
  
  const threeRefs = useRef<ThreeRefs>({
    scene: null,
    camera: null,
    renderer: null,
    composer: null,
    stars: [],
    nebula: null,
    mountains: [],
    animationId: null
  });

  // Initialize Three.js
  useEffect(() => {
    const initThree = (): void => {
      const { current: refs } = threeRefs;
      
      // Scene setup
      refs.scene = new THREE.Scene();
      refs.scene.fog = new THREE.FogExp2(0x000000, 0.00025);

      // Camera
      refs.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        2000
      );
      refs.camera.position.z = 100;
      refs.camera.position.y = 20;

      // Renderer
      if (!canvasRef.current) return;
      
      refs.renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      refs.renderer.setSize(window.innerWidth, window.innerHeight);
      refs.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      refs.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      refs.renderer.toneMappingExposure = 0.5;

      // Post-processing
      refs.composer = new EffectComposer(refs.renderer);
      const renderPass = new RenderPass(refs.scene, refs.camera);
      refs.composer.addPass(renderPass);

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        0.8,
        0.4,
        0.85
      );
      refs.composer.addPass(bloomPass);

      // Create scene elements
      createStarField();
      createNebula();
      createMountains();
      createAtmosphere();
      getLocation();

      // Start animation
      animate();
      
      // Mark as ready after Three.js is initialized
      setIsReady(true);
    };

    const createStarField = (): void => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const starCount: number = 5000;
      
      for (let i = 0; i < 3; i++) {
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(starCount * 3);
        const colors = new Float32Array(starCount * 3);
        const sizes = new Float32Array(starCount);

        for (let j = 0; j < starCount; j++) {
          const radius: number = 200 + Math.random() * 800;
          const theta: number = Math.random() * Math.PI * 2;
          const phi: number = Math.acos(Math.random() * 2 - 1);

          positions[j * 3] = radius * Math.sin(phi) * Math.cos(theta);
          positions[j * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
          positions[j * 3 + 2] = radius * Math.cos(phi);

          // Color variation
          const color = new THREE.Color();
          const colorChoice: number = Math.random();
          if (colorChoice < 0.7) {
            color.setHSL(0, 0, 0.8 + Math.random() * 0.2);
          } else if (colorChoice < 0.9) {
            color.setHSL(0.08, 0.5, 0.8);
          } else {
            color.setHSL(0.6, 0.5, 0.8);
          }
          
          colors[j * 3] = color.r;
          colors[j * 3 + 1] = color.g;
          colors[j * 3 + 2] = color.b;

          sizes[j] = Math.random() * 2 + 0.5;
        }

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

        const material = new THREE.ShaderMaterial({
          uniforms: {
            time: { value: 0 },
            depth: { value: i }
          },
          vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            uniform float depth;
            
            void main() {
              vColor = color;
              vec3 pos = position;
              
              // Slow rotation based on depth
              float angle = time * 0.05 * (1.0 - depth * 0.3);
              mat2 rot = mat2(cos(angle), -sin(angle), sin(angle), cos(angle));
              pos.xy = rot * pos.xy;
              
              vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
              gl_PointSize = size * (300.0 / -mvPosition.z);
              gl_Position = projectionMatrix * mvPosition;
            }
          `,
          fragmentShader: `
            varying vec3 vColor;
            
            void main() {
              float dist = length(gl_PointCoord - vec2(0.5));
              if (dist > 0.5) discard;
              
              float opacity = 1.0 - smoothstep(0.0, 0.5, dist);
              gl_FragColor = vec4(vColor, opacity);
            }
          `,
          transparent: true,
          blending: THREE.AdditiveBlending,
          depthWrite: false
        });

        const stars = new THREE.Points(geometry, material);
        refs.scene.add(stars);
        refs.stars.push(stars);
      }
    };

    const createNebula = (): void => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.PlaneGeometry(8000, 4000, 100, 100);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 },
          color1: { value: new THREE.Color(0x0033ff) },
          color2: { value: new THREE.Color(0xff0066) },
          opacity: { value: 0.3 }
        },
        vertexShader: `
          varying vec2 vUv;
          varying float vElevation;
          uniform float time;
          
          void main() {
            vUv = uv;
            vec3 pos = position;
            
            float elevation = sin(pos.x * 0.01 + time) * cos(pos.y * 0.01 + time) * 20.0;
            pos.z += elevation;
            vElevation = elevation;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
          }
        `,
        fragmentShader: `
          uniform vec3 color1;
          uniform vec3 color2;
          uniform float opacity;
          uniform float time;
          varying vec2 vUv;
          varying float vElevation;
          
          void main() {
            float mixFactor = sin(vUv.x * 10.0 + time) * cos(vUv.y * 10.0 + time);
            vec3 color = mix(color1, color2, mixFactor * 0.5 + 0.5);
            
            float alpha = opacity * (1.0 - length(vUv - 0.5) * 2.0);
            alpha *= 1.0 + vElevation * 0.01;
            
            gl_FragColor = vec4(color, alpha);
          }
        `,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });

      const nebula = new THREE.Mesh(geometry, material);
      nebula.position.z = -1050;
      nebula.rotation.x = 0;
      refs.scene.add(nebula);
      refs.nebula = nebula;
    };

    const createMountains = (): void => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const layers: MountainLayer[] = [
        { distance: -50, height: 60, color: 0x1a1a2e, opacity: 1 },
        { distance: -100, height: 80, color: 0x16213e, opacity: 0.8 },
        { distance: -150, height: 100, color: 0x0f3460, opacity: 0.6 },
        { distance: -200, height: 120, color: 0x0a4668, opacity: 0.4 }
      ];

      layers.forEach((layer: MountainLayer, index: number) => {
        const points: THREE.Vector2[] = [];
        const segments: number = 50;
        
        for (let i = 0; i <= segments; i++) {
          const x: number = (i / segments - 0.5) * 1000;
          const y: number = Math.sin(i * 0.1) * layer.height + 
                           Math.sin(i * 0.05) * layer.height * 0.5 +
                           Math.random() * layer.height * 0.2 - 100;
          points.push(new THREE.Vector2(x, y));
        }
        
        points.push(new THREE.Vector2(5000, -300));
        points.push(new THREE.Vector2(-5000, -300));

        const shape = new THREE.Shape(points);
        const geometry = new THREE.ShapeGeometry(shape);
        const material = new THREE.MeshBasicMaterial({
          color: layer.color,
          transparent: true,
          opacity: layer.opacity,
          side: THREE.DoubleSide
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.position.z = layer.distance;
        mountain.position.y = layer.distance;
        mountain.userData = { baseZ: layer.distance, index };
        if (refs.scene) {
          refs.scene.add(mountain);
        }
        refs.mountains.push(mountain);
      });
    };

    const createAtmosphere = (): void => {
      const { current: refs } = threeRefs;
      if (!refs.scene) return;
      
      const geometry = new THREE.SphereGeometry(600, 32, 32);
      const material = new THREE.ShaderMaterial({
        uniforms: {
          time: { value: 0 }
        },
        vertexShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          
          void main() {
            vNormal = normalize(normalMatrix * normal);
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          varying vec3 vPosition;
          uniform float time;
          
          void main() {
            float intensity = pow(0.7 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
            vec3 atmosphere = vec3(0.3, 0.6, 1.0) * intensity;
            
            float pulse = sin(time * 2.0) * 0.1 + 0.9;
            atmosphere *= pulse;
            
            gl_FragColor = vec4(atmosphere, intensity * 0.25);
          }
        `,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        transparent: true
      });

      const atmosphere = new THREE.Mesh(geometry, material);
      refs.scene.add(atmosphere);
    };

    const animate = (): void => {
      const { current: refs } = threeRefs;
      refs.animationId = requestAnimationFrame(animate);
      
      const time: number = Date.now() * 0.001;

      // Update stars
      refs.stars.forEach((starField: THREE.Points, i: number) => {
        const material = starField.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time;
        }
      });

      // Update nebula
      if (refs.nebula) {
        const material = refs.nebula.material as THREE.ShaderMaterial;
        if (material.uniforms) {
          material.uniforms.time.value = time * 5;
        }
      }

      // Smooth camera movement with easing
      if (refs.camera && refs.targetCameraX !== undefined) {
        const smoothingFactor: number = 0.05; // Lower = smoother but slower
        
        // Calculate smooth position with easing
        smoothCameraPos.current.x += (refs.targetCameraX - smoothCameraPos.current.x) * smoothingFactor;
        smoothCameraPos.current.y += (refs.targetCameraY! - smoothCameraPos.current.y) * smoothingFactor;
        smoothCameraPos.current.z += (refs.targetCameraZ! - smoothCameraPos.current.z) * smoothingFactor;
        
        // Add subtle floating motion
        const floatX: number = Math.sin(time * 0.1) * 2;
        const floatY: number = Math.cos(time * 0.15) * 1;
        
        // Apply final position
        refs.camera.position.x = smoothCameraPos.current.x + floatX;
        refs.camera.position.y = smoothCameraPos.current.y + floatY;
        refs.camera.position.z = smoothCameraPos.current.z;
        refs.camera.lookAt(0, 10, -600);
      }

      // Parallax mountains with subtle animation
      refs.mountains.forEach((mountain: THREE.Mesh, i: number) => {
        const parallaxFactor: number = 1 + i * 0.5;
        mountain.position.x = Math.sin(time * 0.1) * 2 * parallaxFactor;
        mountain.position.y = 50 + (Math.cos(time * 0.15) * 1 * parallaxFactor);
      });

      if (refs.composer) {
        refs.composer.render();
      }
    };

    initThree();

    // Handle resize
    const handleResize = (): void => {
      const { current: refs } = threeRefs;
      if (refs.camera && refs.renderer && refs.composer) {
        refs.camera.aspect = window.innerWidth / window.innerHeight;
        refs.camera.updateProjectionMatrix();
        refs.renderer.setSize(window.innerWidth, window.innerHeight);
        refs.composer.setSize(window.innerWidth, window.innerHeight);
      }
    };

    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      const { current: refs } = threeRefs;
      
      if (refs.animationId) {
        cancelAnimationFrame(refs.animationId);
      }

      window.removeEventListener('resize', handleResize);

      // Dispose Three.js resources
      refs.stars.forEach((starField: THREE.Points) => {
        starField.geometry.dispose();
        (starField.material as THREE.Material).dispose();
      });

      refs.mountains.forEach((mountain: THREE.Mesh) => {
        mountain.geometry.dispose();
        (mountain.material as THREE.Material).dispose();
      });

      if (refs.nebula) {
        refs.nebula.geometry.dispose();
        (refs.nebula.material as THREE.Material).dispose();
      }

      if (refs.renderer) {
        refs.renderer.dispose();
      }
    };
  }, []);

  const getLocation = (): void => {
    const { current: refs } = threeRefs;
    const locations: number[] = [];
    refs.mountains.forEach((mountain: THREE.Mesh, i: number) => {
      locations[i] = mountain.position.z;
    });
    refs.locations = locations;
  };

  // GSAP Animations - Run after component is ready
  useEffect(() => {
    if (!isReady) return;
    
    // Set initial states to prevent flash
    const elements = [
      menuRef.current,
      titleRef.current,
      subtitleRef.current,
      scrollProgressRef.current,
    ].filter(Boolean); // Filter out null refs

    let tl: gsap.core.Timeline | null = null;

    if (elements.length > 0) {
      gsap.set(elements, {
        visibility: 'visible'
      });

      tl = gsap.timeline();

      // Animate menu
      

      // Animate title with split text
      if (titleRef.current) {
        const titleChars = titleRef.current.querySelectorAll('.title-char');
        tl.from(titleChars, {
          y: 200,
          opacity: 0,
          duration: 1.5,
          stagger: 0.05,
          ease: "power4.out"
        }, "-=0.5");
      }

      // Animate subtitle lines
      if (subtitleRef.current) {
        const subtitleLines = subtitleRef.current.querySelectorAll('.subtitle-line');
        tl.from(subtitleLines, {
          y: 50,
          opacity: 0,
          duration: 1,
          stagger: 0.2,
          ease: "power3.out"
        }, "-=0.8");
      }

      // Animate scroll indicator
      if (scrollProgressRef.current) {
        tl.from(scrollProgressRef.current, {
          opacity: 0,
          y: 50,
          duration: 1,
          ease: "power2.out"
        }, "-=0.5");
      }
    }

    return () => {
      if (tl) {
        tl.kill();
      }
    };
  }, [isReady]);

  // Scroll handling
  useEffect(() => {
    const handleScroll = (): void => {
      const scrollY: number = window.scrollY;
      const windowHeight: number = window.innerHeight;
      const documentHeight: number = document.documentElement.scrollHeight;
      const maxScroll: number = documentHeight - windowHeight;
      const progress: number = Math.min(scrollY / maxScroll, 1);
      
      setScrollProgress(progress);
      const newSection: number = Math.floor(progress * totalSections);
      setCurrentSection(newSection);

      const { current: refs } = threeRefs;
      
      // Calculate smooth progress through all sections
      const totalProgress: number = progress * totalSections;
      const sectionProgress: number = totalProgress % 1;
      
      // Define camera positions for each section
      const cameraPositions: CameraPosition[] = [
        { x: 0, y: 30, z: 300 },    // Section 0 - HORIZON
        { x: 0, y: 40, z: -50 },     // Section 1 - COSMOS
        { x: 0, y: 50, z: -700 }       // Section 2 - INFINITY
      ];
      
      // Get current and next positions
      const currentPos: CameraPosition = cameraPositions[newSection] || cameraPositions[0];
      const nextPos: CameraPosition = cameraPositions[newSection + 1] || currentPos;
      
      // Set target positions (actual smoothing happens in animate loop)
      refs.targetCameraX = currentPos.x + (nextPos.x - currentPos.x) * sectionProgress;
      refs.targetCameraY = currentPos.y + (nextPos.y - currentPos.y) * sectionProgress;
      refs.targetCameraZ = currentPos.z + (nextPos.z - currentPos.z) * sectionProgress;
      
      // Smooth parallax for mountains
      refs.mountains.forEach((mountain: THREE.Mesh, i: number) => {
        const speed: number = 1 + i * 0.9;
        const targetZ: number = mountain.userData.baseZ + scrollY * speed * 0.5;
        if (refs.nebula) {
          refs.nebula.position.z = (targetZ + progress * speed * 0.01) - 100;
        }
        
        // Use the same smoothing approach
        mountain.userData.targetZ = targetZ;
        const location: number = mountain.position.z;
        if (progress > 0.7) {
          mountain.position.z = 600000;
        }
        if (progress < 0.7 && refs.locations) {
          mountain.position.z = refs.locations[i];
        }
      });
      
      if (refs.nebula && refs.mountains[3]) {
        refs.nebula.position.z = refs.mountains[3].position.z;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Set initial position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, [totalSections]);

  const splitTitle = (text: string): React.ReactNode[] => {
    return text.split('').map((char: string, i: number) => (
      <span key={i} className="title-char">
        {char}
      </span>
    ));
  };

  // Section titles and subtitles for dynamic rendering
  const titles: Record<number, string> = {
    0: 'GLOBAL PAYROLL',
    1: 'BULK PAYMENTS',
    2: 'ESCROW ENGINE'
  }
  const subtitles: Record<number, SectionContent> = {
    0: {
     line1: 'One-click payroll for teams across the globe,',
      line2: 'compliant, secure, and built onchain'
    },
    1: {
     line1: 'Pay thousands in seconds, gas-optimized and secure,',
      line2: 'bulk transactions, simplified for Web3 teams'
    },
    2: {
      line1: 'Hold funds with confidence, release with certainty,',
      line2: 'escrow that moves as fast as your deals'
    }
  };

  return (
    <div ref={containerRef} className="h-screen hero-container cosmos-style">
      <canvas ref={canvasRef} className="hero-canvas" />
      
      {/* Side menu */}
      

      {/* Main content - now dynamic based on currentSection */}
      <div className="hero-content cosmos-content">
        <h1 ref={titleRef} className="hero-title">
          {titles[currentSection] || 'DEFAULT'}
        </h1>
        <div ref={subtitleRef} className="hero-subtitle cosmos-subtitle">
          <p className="subtitle-line">
            {subtitles[currentSection]?.line1}
          </p>
          <p className="subtitle-line">
            {subtitles[currentSection]?.line2}
          </p>
        </div>
      </div>

     

      {/* Additional sections for scrolling (unchanged) */}
     
    </div>
  );
};

export default Component;