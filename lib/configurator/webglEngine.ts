import { ProductConfiguration } from '@/data/configuratorData';

// Precision 3D Vector & Matrix Mathematics
export class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  set(x: number, y: number, z: number): this {
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  clone(): Vec3 {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v: Vec3): this {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return this;
  }

  sub(v: Vec3): this {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
    return this;
  }

  scale(s: number): this {
    this.x *= s;
    this.y *= s;
    this.z *= s;
    return this;
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  cross(v: Vec3): this {
    const x = this.y * v.z - this.z * v.y;
    const y = this.z * v.x - this.x * v.z;
    const z = this.x * v.y - this.y * v.x;
    this.x = x;
    this.y = y;
    this.z = z;
    return this;
  }

  length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
  }

  normalize(): this {
    const len = this.length();
    if (len > 0.00001) {
      this.x /= len;
      this.y /= len;
      this.z /= len;
    }
    return this;
  }
}

export class Mat4 {
  elements: Float32Array;

  constructor() {
    this.elements = new Float32Array([
      1, 0, 0, 0,
      0, 1, 0, 0,
      0, 0, 1, 0,
      0, 0, 0, 1
    ]);
  }

  identity(): this {
    const e = this.elements;
    e[0] = 1; e[1] = 0; e[2] = 0; e[3] = 0;
    e[4] = 0; e[5] = 1; e[6] = 0; e[7] = 0;
    e[8] = 0; e[9] = 0; e[10] = 1; e[11] = 0;
    e[12] = 0; e[13] = 0; e[14] = 0; e[15] = 1;
    return this;
  }

  perspective(fovyRad: number, aspect: number, near: number, far: number): this {
    const f = 1.0 / Math.tan(fovyRad / 2);
    const nf = 1 / (near - far);
    const e = this.elements;
    e[0] = f / aspect; e[1] = 0; e[2] = 0; e[3] = 0;
    e[4] = 0; e[5] = f; e[6] = 0; e[7] = 0;
    e[8] = 0; e[9] = 0; e[10] = (far + near) * nf; e[11] = -1;
    e[12] = 0; e[13] = 0; e[14] = (2 * far * near) * nf; e[15] = 0;
    return this;
  }

  lookAt(eye: Vec3, center: Vec3, up: Vec3): this {
    const z = eye.clone().sub(center).normalize();
    const x = up.clone().cross(z).normalize();
    const y = z.clone().cross(x);

    const e = this.elements;
    e[0] = x.x; e[1] = y.x; e[2] = z.x; e[3] = 0;
    e[4] = x.y; e[5] = y.y; e[6] = z.y; e[7] = 0;
    e[8] = x.z; e[9] = y.z; e[10] = z.z; e[11] = 0;
    e[12] = -x.dot(eye);
    e[13] = -y.dot(eye);
    e[14] = -z.dot(eye);
    e[15] = 1;
    return this;
  }

  multiply(m: Mat4): this {
    const ae = this.elements;
    const be = m.elements;
    const te = new Float32Array(16);

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        te[j * 4 + i] =
          ae[i] * be[j * 4] +
          ae[i + 4] * be[j * 4 + 1] +
          ae[i + 8] * be[j * 4 + 2] +
          ae[i + 12] * be[j * 4 + 3];
      }
    }
    this.elements.set(te);
    return this;
  }
}

export interface DimensionCallout {
  id: string;
  label: string;
  valueMm: number;
  screenStart: { x: number; y: number };
  screenEnd: { x: number; y: number };
  screenMid: { x: number; y: number };
  isVisible: boolean;
}

// -------------------------------------------------------------
// Interactive 3D Solid Surface WebGL Engine
// -------------------------------------------------------------
export class Configurator3DEngine {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private animFrameId: number | null = null;

  // Camera & Orbit State
  private cameraEye = new Vec3(0, 1.2, 2.2);
  private cameraTarget = new Vec3(0, 0, 0);
  private cameraUp = new Vec3(0, 1, 0);

  private orbitAzimuth = 0.55; // radians
  private orbitElevation = 0.42; // radians
  private orbitDistance = 2.4; // world units
  private targetDistance = 2.4;

  private isDragging = false;
  private isPanning = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Scene Shader Programs & Buffers
  private program: WebGLProgram | null = null;
  private gridProgram: WebGLProgram | null = null;

  private vaoVertexBuffer: WebGLBuffer | null = null;
  private vaoNormalBuffer: WebGLBuffer | null = null;
  private vaoIndexBuffer: WebGLBuffer | null = null;
  private vertexCount = 0;

  private gridVertexBuffer: WebGLBuffer | null = null;
  private gridIndexBuffer: WebGLBuffer | null = null;
  private gridVertexCount = 0;

  // Configuration Cache
  private currentConfig: ProductConfiguration | null = null;
  private materialRgb = [0.95, 0.94, 0.92]; // Default Glacier White
  private isWireframe = false;
  private showDimensions = true;

  // Callout Callbacks
  private onDimensionsUpdate?: (callouts: DimensionCallout[]) => void;

  constructor(canvas: HTMLCanvasElement, onDimensionsUpdate?: (callouts: DimensionCallout[]) => void) {
    this.canvas = canvas;
    this.onDimensionsUpdate = onDimensionsUpdate;
    this.initWebGL();
    this.bindEvents();
    this.render();
  }

  private initWebGL() {
    this.gl = this.canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    if (!this.gl) {
      console.warn('WebGL is not available in current browser context.');
      return;
    }

    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    // Architectural Neutral Ground Clear Color (#f0eee8)
    gl.clearColor(0.94, 0.93, 0.91, 1.0);

    this.initShaders();
    this.buildGridGeometry();
    this.handleResize();
  }

  private initShaders() {
    if (!this.gl) return;
    const gl = this.gl;

    // Solid Surface Phong / Blinn Shader
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;

      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;

      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        vec4 worldPos = uModel * vec4(aPosition, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = mat3(uModel) * aNormal;
        gl_Position = uProjection * uView * worldPos;
      }
    `;

    const fsSource = `
      precision mediump float;

      uniform vec3 uColor;
      uniform vec3 uLightPos1;
      uniform vec3 uLightPos2;
      uniform vec3 uCameraPos;
      uniform int uIsWireframe;

      varying vec3 vNormal;
      varying vec3 vWorldPos;

      void main() {
        if (uIsWireframe == 1) {
          gl_FragColor = vec4(0.12, 0.13, 0.11, 0.85);
          return;
        }

        vec3 N = normalize(vNormal);
        vec3 V = normalize(uCameraPos - vWorldPos);

        // Key Light (Warm Architectural Studio Spotlight)
        vec3 L1 = normalize(uLightPos1 - vWorldPos);
        float diff1 = max(dot(N, L1), 0.0);
        vec3 H1 = normalize(L1 + V);
        float spec1 = pow(max(dot(N, H1), 0.0), 32.0);

        // Fill Light (Cool Diffuse Ambient Reflection)
        vec3 L2 = normalize(uLightPos2 - vWorldPos);
        float diff2 = max(dot(N, L2), 0.0) * 0.45;

        // Hemispherical Soft Ambient
        float hemi = clamp(N.y * 0.5 + 0.5, 0.0, 1.0) * 0.35 + 0.25;

        // Soft Subsurface Scatter Sheen characteristic of solid surface minerals
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0) * 0.18;

        vec3 ambient = uColor * hemi;
        vec3 diffuse = uColor * (diff1 * 0.75 + diff2);
        vec3 specular = vec3(0.96, 0.95, 0.94) * spec1 * 0.22;
        vec3 rim = vec3(1.0) * fresnel;

        vec3 finalColor = ambient + diffuse + specular + rim;
        gl_FragColor = vec4(finalColor, 1.0);
      }
    `;

    this.program = this.createProgram(vsSource, fsSource);

    // Ground Grid Studio Shader
    const gridVs = `
      attribute vec3 aPosition;
      uniform mat4 uProjection;
      uniform mat4 uView;
      void main() {
        gl_Position = uProjection * uView * vec4(aPosition, 1.0);
      }
    `;
    const gridFs = `
      precision mediump float;
      void main() {
        gl_FragColor = vec4(0.12, 0.13, 0.11, 0.09);
      }
    `;
    this.gridProgram = this.createProgram(gridVs, gridFs);
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram | null {
    if (!this.gl) return null;
    const gl = this.gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      console.error('VS Error:', gl.getShaderInfoLog(vs));
      return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      console.error('FS Error:', gl.getShaderInfoLog(fs));
      return null;
    }

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      console.error('Link Error:', gl.getProgramInfoLog(prog));
      return null;
    }

    return prog;
  }

  private buildGridGeometry() {
    if (!this.gl) return;
    const gl = this.gl;

    const size = 3.6;
    const step = 0.2;
    const vertices: number[] = [];
    const yLevel = -0.55;

    for (let x = -size; x <= size; x += step) {
      vertices.push(x, yLevel, -size);
      vertices.push(x, yLevel, size);
    }
    for (let z = -size; z <= size; z += step) {
      vertices.push(-size, yLevel, z);
      vertices.push(size, yLevel, z);
    }

    this.gridVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    this.gridVertexCount = vertices.length / 3;
  }

  // -------------------------------------------------------------
  // Parametric Procedural Geometry Generation
  // -------------------------------------------------------------
  public updateConfiguration(config: ProductConfiguration) {
    this.currentConfig = config;

    // Convert hex color to float RGB
    const hex = config.materialHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    this.materialRgb = [r, g, b];

    this.generateProductGeometry(config);
    this.computeDimensionCallouts(config);
  }

  private generateProductGeometry(cfg: ProductConfiguration) {
    if (!this.gl) return;
    const gl = this.gl;

    const verts: number[] = [];
    const norms: number[] = [];
    const indices: number[] = [];

    // Scale mm to world units: 1000mm = 1.0 unit
    const W = cfg.width / 1000;
    const D = cfg.depth / 1000;
    const T = cfg.thickness / 1000;
    const frontApron = cfg.frontApronHeight / 1000;
    const rearUpstand = cfg.rearUpstandHeight / 1000;

    const halfW = W / 2;
    const halfD = D / 2;
    const topY = 0;
    const bottomDeckY = topY - T;

    // Helper: Push a quad (2 triangles) with uniform normal
    const pushQuad = (
      p1: [number, number, number],
      p2: [number, number, number],
      p3: [number, number, number],
      p4: [number, number, number],
      n: [number, number, number]
    ) => {
      const idx = verts.length / 3;
      verts.push(...p1, ...p2, ...p3, ...p4);
      norms.push(...n, ...n, ...n, ...n);
      indices.push(idx, idx + 1, idx + 2, idx, idx + 2, idx + 3);
    };

    // Helper: Push a 3D box defined by min and max bounds
    const pushBox = (
      minX: number, minY: number, minZ: number,
      maxX: number, maxY: number, maxZ: number
    ) => {
      // Top face (+Y)
      pushQuad([minX, maxY, maxZ], [maxX, maxY, maxZ], [maxX, maxY, minZ], [minX, maxY, minZ], [0, 1, 0]);
      // Bottom face (-Y)
      pushQuad([minX, minY, minZ], [maxX, minY, minZ], [maxX, minY, maxZ], [minX, minY, maxZ], [0, -1, 0]);
      // Front face (+Z)
      pushQuad([minX, minY, maxZ], [maxX, minY, maxZ], [maxX, maxY, maxZ], [minX, maxY, maxZ], [0, 0, 1]);
      // Back face (-Z)
      pushQuad([maxX, minY, minZ], [minX, minY, minZ], [minX, maxY, minZ], [maxX, maxY, minZ], [0, 0, -1]);
      // Left face (-X)
      pushQuad([minX, minY, minZ], [minX, minY, maxZ], [minX, maxY, maxZ], [minX, maxY, minZ], [-1, 0, 0]);
      // Right face (+X)
      pushQuad([maxX, minY, maxZ], [maxX, minY, minZ], [maxX, maxY, minZ], [maxX, maxY, maxZ], [1, 0, 0]);
    };

    // 1. Deck Solid Surface: Top Horizontal Worktop
    if (cfg.basinModelId === 'none' || cfg.basinPlacement === 'none') {
      // Solid continuous unbroken slab
      pushBox(-halfW, bottomDeckY, -halfD, halfW, topY, halfD);
    } else {
      // Deck with Basin Cutouts (Center, Left, Right, or Dual)
      const basinWidth = 0.5; // ~500mm
      const basinDepth = 0.34; // ~340mm
      const basinDepthDrop = 0.14; // ~140mm bowl depth

      const basinPositions: number[] = [];
      if (cfg.basinPlacement === 'center') {
        basinPositions.push(0);
      } else if (cfg.basinPlacement === 'left') {
        basinPositions.push(-halfW * 0.45);
      } else if (cfg.basinPlacement === 'right') {
        basinPositions.push(halfW * 0.45);
      } else if (cfg.basinPlacement === 'dual') {
        const span = halfW * 0.52;
        basinPositions.push(-span, span);
      }

      // Left perimeter collar
      const firstB = basinPositions[0];
      const leftCollarMin = -halfW;
      const leftCollarMax = firstB - basinWidth / 2;
      if (leftCollarMax > leftCollarMin) {
        pushBox(leftCollarMin, bottomDeckY, -halfD, leftCollarMax, topY, halfD);
      }

      // Right perimeter collar
      const lastB = basinPositions[basinPositions.length - 1];
      const rightCollarMin = lastB + basinWidth / 2;
      const rightCollarMax = halfW;
      if (rightCollarMax > rightCollarMin) {
        pushBox(rightCollarMin, bottomDeckY, -halfD, rightCollarMax, topY, halfD);
      }

      // Front & Rear rims around each basin
      for (const bX of basinPositions) {
        const bMinX = bX - basinWidth / 2;
        const bMaxX = bX + basinWidth / 2;
        const bMinZ = -basinDepth / 2;
        const bMaxZ = basinDepth / 2;

        // Front rim (+Z)
        pushBox(bMinX, bottomDeckY, bMaxZ, bMaxX, topY, halfD);
        // Rear rim (-Z)
        pushBox(bMinX, bottomDeckY, -halfD, bMaxX, topY, bMinZ);

        // Thermoformed Seamless Coved Basin Cavity
        const bowlBottomY = bottomDeckY - basinDepthDrop;
        // Basin Bottom
        pushQuad(
          [bMinX + 0.03, bowlBottomY, bMaxZ - 0.03],
          [bMaxX - 0.03, bowlBottomY, bMaxZ - 0.03],
          [bMaxX - 0.03, bowlBottomY, bMinZ + 0.03],
          [bMinX + 0.03, bowlBottomY, bMinZ + 0.03],
          [0, 1, 0]
        );
        // Basin Interior Walls (Inward facing normals)
        // Back wall
        pushQuad([bMinX + 0.03, bowlBottomY, bMinZ + 0.03], [bMaxX - 0.03, bowlBottomY, bMinZ + 0.03], [bMaxX, bottomDeckY, bMinZ], [bMinX, bottomDeckY, bMinZ], [0, 0.4, 0.9]);
        // Front wall
        pushQuad([bMaxX - 0.03, bowlBottomY, bMaxZ - 0.03], [bMinX + 0.03, bowlBottomY, bMaxZ - 0.03], [bMinX, bottomDeckY, bMaxZ], [bMaxX, bottomDeckY, bMaxZ], [0, 0.4, -0.9]);
        // Left wall
        pushQuad([bMinX + 0.03, bowlBottomY, bMaxZ - 0.03], [bMinX + 0.03, bowlBottomY, bMinZ + 0.03], [bMinX, bottomDeckY, bMinZ], [bMinX, bottomDeckY, bMaxZ], [0.9, 0.4, 0]);
        // Right wall
        pushQuad([bMaxX - 0.03, bowlBottomY, bMinZ + 0.03], [bMaxX - 0.03, bowlBottomY, bMaxZ - 0.03], [bMaxX, bottomDeckY, bMaxZ], [bMaxX, bottomDeckY, bMinZ], [-0.9, 0.4, 0]);

        // Chrome Waste Drain Collar at basin center bottom
        const dR = 0.024;
        pushBox(bX - dR, bowlBottomY - 0.002, -dR, bX + dR, bowlBottomY + 0.003, dR);

        // Deck Tap hole cutout ring if selected
        if (cfg.tapHoles > 0 && cfg.tapPosition !== 'wall') {
          const tapZ = -halfD + 0.06;
          pushBox(bX - 0.018, topY - 0.001, tapZ - 0.018, bX + 0.018, topY + 0.004, tapZ + 0.018);
        }
      }

      // Center divider between dual basins if dual
      if (cfg.basinPlacement === 'dual' && basinPositions.length === 2) {
        const midMinX = basinPositions[0] + basinWidth / 2;
        const midMaxX = basinPositions[1] - basinWidth / 2;
        if (midMaxX > midMinX) {
          pushBox(midMinX, bottomDeckY, -halfD, midMaxX, topY, halfD);
        }
      }
    }

    // 2. Front Downstand (Apron drop fascia)
    if (frontApron > 0) {
      const apronBottomY = bottomDeckY - frontApron;
      pushBox(-halfW, apronBottomY, halfD - 0.015, halfW, bottomDeckY, halfD);
    }

    // 3. Left Return Downstand (Apron)
    if (cfg.hasLeftApron && frontApron > 0) {
      const apronBottomY = bottomDeckY - frontApron;
      pushBox(-halfW, apronBottomY, -halfD, -halfW + 0.015, bottomDeckY, halfD - 0.015);
    }

    // 4. Right Return Downstand (Apron)
    if (cfg.hasRightApron && frontApron > 0) {
      const apronBottomY = bottomDeckY - frontApron;
      pushBox(halfW - 0.015, apronBottomY, -halfD, halfW, bottomDeckY, halfD - 0.015);
    }

    // 5. Rear Upstand (Splashback with coved junction)
    if (rearUpstand > 0) {
      const upstandTopY = topY + rearUpstand;
      pushBox(-halfW, topY, -halfD, halfW, upstandTopY, -halfD + 0.015);
    }

    // 6. Left Return Upstand
    if (cfg.hasLeftUpstand && rearUpstand > 0) {
      const upstandTopY = topY + rearUpstand;
      pushBox(-halfW, topY, -halfD + 0.015, -halfW + 0.015, upstandTopY, halfD);
    }

    // 7. Right Return Upstand
    if (cfg.hasRightUpstand && rearUpstand > 0) {
      const upstandTopY = topY + rearUpstand;
      pushBox(halfW - 0.015, topY, -halfD + 0.015, halfW, upstandTopY, halfD);
    }

    // Bind Buffers to GPU
    if (!this.vaoVertexBuffer) this.vaoVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    if (!this.vaoNormalBuffer) this.vaoNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(norms), gl.STATIC_DRAW);

    if (!this.vaoIndexBuffer) this.vaoIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    this.vertexCount = indices.length;
  }

  // -------------------------------------------------------------
  // Dimension Callouts Screen Coordinates Projection
  // -------------------------------------------------------------
  private computeDimensionCallouts(cfg: ProductConfiguration) {
    if (!this.onDimensionsUpdate || !this.showDimensions) {
      if (this.onDimensionsUpdate) this.onDimensionsUpdate([]);
      return;
    }

    const halfW = (cfg.width / 1000) / 2;
    const halfD = (cfg.depth / 1000) / 2;
    const topY = 0;
    const frontApron = cfg.frontApronHeight / 1000;
    const rearUpstand = cfg.rearUpstandHeight / 1000;

    // 1. Width Dimension Callout (Front edge)
    const pW1 = new Vec3(-halfW, topY, halfD + 0.08);
    const pW2 = new Vec3(halfW, topY, halfD + 0.08);
    const sW1 = this.projectToScreen(pW1);
    const sW2 = this.projectToScreen(pW2);

    // 2. Depth Dimension Callout (Right side)
    const pD1 = new Vec3(halfW + 0.08, topY, -halfD);
    const pD2 = new Vec3(halfW + 0.08, topY, halfD);
    const sD1 = this.projectToScreen(pD1);
    const sD2 = this.projectToScreen(pD2);

    // 3. Front Apron Height Callout
    const pA1 = new Vec3(-halfW - 0.06, topY - (cfg.thickness / 1000) - frontApron, halfD);
    const pA2 = new Vec3(-halfW - 0.06, topY, halfD);
    const sA1 = this.projectToScreen(pA1);
    const sA2 = this.projectToScreen(pA2);

    // 4. Upstand Height Callout
    const pU1 = new Vec3(halfW + 0.06, topY, -halfD);
    const pU2 = new Vec3(halfW + 0.06, topY + rearUpstand, -halfD);
    const sU1 = this.projectToScreen(pU1);
    const sU2 = this.projectToScreen(pU2);

    const callouts: DimensionCallout[] = [
      {
        id: 'width',
        label: `W: ${cfg.width} mm`,
        valueMm: cfg.width,
        screenStart: sW1,
        screenEnd: sW2,
        screenMid: { x: (sW1.x + sW2.x) / 2, y: (sW1.y + sW2.y) / 2 },
        isVisible: true,
      },
      {
        id: 'depth',
        label: `D: ${cfg.depth} mm`,
        valueMm: cfg.depth,
        screenStart: sD1,
        screenEnd: sD2,
        screenMid: { x: (sD1.x + sD2.x) / 2, y: (sD1.y + sD2.y) / 2 },
        isVisible: true,
      },
    ];

    if (frontApron > 0) {
      callouts.push({
        id: 'apron',
        label: `Apron: ${cfg.frontApronHeight} mm`,
        valueMm: cfg.frontApronHeight,
        screenStart: sA1,
        screenEnd: sA2,
        screenMid: { x: (sA1.x + sA2.x) / 2, y: (sA1.y + sA2.y) / 2 },
        isVisible: true,
      });
    }

    if (rearUpstand > 0) {
      callouts.push({
        id: 'upstand',
        label: `Splashback: ${cfg.rearUpstandHeight} mm`,
        valueMm: cfg.rearUpstandHeight,
        screenStart: sU1,
        screenEnd: sU2,
        screenMid: { x: (sU1.x + sU2.x) / 2, y: (sU1.y + sU2.y) / 2 },
        isVisible: true,
      });
    }

    this.onDimensionsUpdate(callouts);
  }

  private projectToScreen(worldPoint: Vec3): { x: number; y: number } {
    const aspect = (this.canvas.width || 800) / (this.canvas.height || 600);
    const proj = new Mat4().perspective(45 * Math.PI / 180, aspect, 0.1, 100);
    const view = new Mat4().lookAt(this.cameraEye, this.cameraTarget, this.cameraUp);
    const pv = proj.multiply(view);

    const m = pv.elements;
    const x = worldPoint.x * m[0] + worldPoint.y * m[4] + worldPoint.z * m[8] + m[12];
    const y = worldPoint.x * m[1] + worldPoint.y * m[5] + worldPoint.z * m[9] + m[13];
    const w = worldPoint.x * m[3] + worldPoint.y * m[7] + worldPoint.z * m[11] + m[15];

    if (w < 0.001) return { x: -9999, y: -9999 };

    const ndcX = x / w;
    const ndcY = y / w;

    const screenX = (ndcX * 0.5 + 0.5) * this.canvas.clientWidth;
    const screenY = (1.0 - (ndcY * 0.5 + 0.5)) * this.canvas.clientHeight;

    return { x: screenX, y: screenY };
  }

  // -------------------------------------------------------------
  // Camera Viewpoint Switcher & Orbiting
  // -------------------------------------------------------------
  public setViewpoint(view: 'isometric' | 'front' | 'top' | 'side') {
    switch (view) {
      case 'isometric':
        this.orbitAzimuth = 0.55;
        this.orbitElevation = 0.42;
        this.targetDistance = 2.4;
        break;
      case 'front':
        this.orbitAzimuth = 0.0;
        this.orbitElevation = 0.05;
        this.targetDistance = 2.2;
        break;
      case 'top':
        this.orbitAzimuth = 0.0;
        this.orbitElevation = Math.PI / 2 - 0.01;
        this.targetDistance = 2.1;
        break;
      case 'side':
        this.orbitAzimuth = Math.PI / 2;
        this.orbitElevation = 0.05;
        this.targetDistance = 2.0;
        break;
    }
    this.cameraTarget.set(0, 0, 0);
  }

  public resetCamera() {
    this.setViewpoint('isometric');
  }

  public toggleWireframe(): boolean {
    this.isWireframe = !this.isWireframe;
    return this.isWireframe;
  }

  public toggleDimensions(): boolean {
    this.showDimensions = !this.showDimensions;
    if (this.currentConfig) {
      this.computeDimensionCallouts(this.currentConfig);
    }
    return this.showDimensions;
  }

  public getCanvasDataURL(): string {
    return this.canvas.toDataURL('image/png');
  }

  // -------------------------------------------------------------
  // Render Loop & Event Binding
  // -------------------------------------------------------------
  private bindEvents() {
    const canvas = this.canvas;

    const onMouseDown = (e: MouseEvent) => {
      this.isDragging = true;
      this.isPanning = e.button === 2 || e.shiftKey;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (this.isPanning) {
        // Pan camera target
        const factor = 0.0018 * this.orbitDistance;
        this.cameraTarget.x -= dx * factor * Math.cos(this.orbitAzimuth);
        this.cameraTarget.z += dx * factor * Math.sin(this.orbitAzimuth);
        this.cameraTarget.y += dy * factor;
      } else {
        // Orbit angles
        this.orbitAzimuth -= dx * 0.008;
        this.orbitElevation += dy * 0.008;
        // Clamp elevation to avoid gimbal flipping
        this.orbitElevation = Math.max(-0.15, Math.min(Math.PI / 2 - 0.02, this.orbitElevation));
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      this.isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      this.targetDistance += e.deltaY * 0.002;
      this.targetDistance = Math.max(0.8, Math.min(5.5, this.targetDistance));
    };

    // Touch Support for Mobile / iPad
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        touchStartDist = Math.hypot(dx, dy);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;

        this.orbitAzimuth -= dx * 0.008;
        this.orbitElevation += dy * 0.008;
        this.orbitElevation = Math.max(-0.15, Math.min(Math.PI / 2 - 0.02, this.orbitElevation));
      } else if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        const diff = touchStartDist - dist;
        touchStartDist = dist;
        this.targetDistance += diff * 0.005;
        this.targetDistance = Math.max(0.8, Math.min(5.5, this.targetDistance));
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
    };

    const onContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);

    canvas.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });
    window.addEventListener('touchend', onTouchEnd);

    // Resize observer
    if (typeof ResizeObserver !== 'undefined') {
      const ro = new ResizeObserver(() => this.handleResize());
      ro.observe(canvas);
    }
  }

  public handleResize() {
    if (!this.canvas || !this.gl) return;
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    if (this.canvas.width !== width * dpr || this.canvas.height !== height * dpr) {
      this.canvas.width = width * dpr;
      this.canvas.height = height * dpr;
      this.gl.viewport(0, 0, this.canvas.width, this.canvas.height);
    }
  }

  private render = () => {
    if (!this.gl || !this.program) return;
    const gl = this.gl;

    // Smooth camera distance interpolation (lerp)
    this.orbitDistance += (this.targetDistance - this.orbitDistance) * 0.12;

    // Calculate eye coordinate from spherical orbit
    const cosElev = Math.cos(this.orbitElevation);
    const sinElev = Math.sin(this.orbitElevation);
    const eyeX = this.cameraTarget.x + this.orbitDistance * cosElev * Math.sin(this.orbitAzimuth);
    const eyeY = this.cameraTarget.y + this.orbitDistance * sinElev;
    const eyeZ = this.cameraTarget.z + this.orbitDistance * cosElev * Math.cos(this.orbitAzimuth);
    this.cameraEye.set(eyeX, eyeY, eyeZ);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    const aspect = (this.canvas.width || 800) / (this.canvas.height || 600);
    const projMatrix = new Mat4().perspective(45 * Math.PI / 180, aspect, 0.1, 100);
    const viewMatrix = new Mat4().lookAt(this.cameraEye, this.cameraTarget, this.cameraUp);
    const modelMatrix = new Mat4().identity();

    // 1. Render Studio Ground Shadow Grid
    if (this.gridProgram && this.gridVertexBuffer) {
      gl.useProgram(this.gridProgram);
      const uProj = gl.getUniformLocation(this.gridProgram, 'uProjection');
      const uView = gl.getUniformLocation(this.gridProgram, 'uView');
      gl.uniformMatrix4fv(uProj, false, projMatrix.elements);
      gl.uniformMatrix4fv(uView, false, viewMatrix.elements);

      const aPos = gl.getAttribLocation(this.gridProgram, 'aPosition');
      gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      gl.drawArrays(gl.LINES, 0, this.gridVertexCount);
      gl.disableVertexAttribArray(aPos);
    }

    // 2. Render Architectural Product Mesh
    if (this.vertexCount > 0 && this.vaoVertexBuffer && this.vaoNormalBuffer && this.vaoIndexBuffer) {
      gl.useProgram(this.program);

      const uProj = gl.getUniformLocation(this.program, 'uProjection');
      const uView = gl.getUniformLocation(this.program, 'uView');
      const uModel = gl.getUniformLocation(this.program, 'uModel');
      const uColor = gl.getUniformLocation(this.program, 'uColor');
      const uLightPos1 = gl.getUniformLocation(this.program, 'uLightPos1');
      const uLightPos2 = gl.getUniformLocation(this.program, 'uLightPos2');
      const uCameraPos = gl.getUniformLocation(this.program, 'uCameraPos');
      const uIsWireframe = gl.getUniformLocation(this.program, 'uIsWireframe');

      gl.uniformMatrix4fv(uProj, false, projMatrix.elements);
      gl.uniformMatrix4fv(uView, false, viewMatrix.elements);
      gl.uniformMatrix4fv(uModel, false, modelMatrix.elements);

      gl.uniform3fv(uColor, this.materialRgb);
      gl.uniform3f(uLightPos1, 2.5, 4.0, 3.0); // Warm studio Key
      gl.uniform3f(uLightPos2, -3.0, 2.0, -2.5); // Cool Studio Fill
      gl.uniform3f(uCameraPos, this.cameraEye.x, this.cameraEye.y, this.cameraEye.z);
      gl.uniform1i(uIsWireframe, this.isWireframe ? 1 : 0);

      // Attribute: Position
      const aPos = gl.getAttribLocation(this.program, 'aPosition');
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoVertexBuffer);
      gl.enableVertexAttribArray(aPos);
      gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

      // Attribute: Normal
      const aNorm = gl.getAttribLocation(this.program, 'aNormal');
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoNormalBuffer);
      gl.enableVertexAttribArray(aNorm);
      gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoIndexBuffer);

      if (this.isWireframe) {
        gl.drawElements(gl.LINES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
      }

      gl.disableVertexAttribArray(aPos);
      gl.disableVertexAttribArray(aNorm);
    }

    // Update 3D Dimension Callouts positions every frame if visible
    if (this.currentConfig && this.showDimensions) {
      this.computeDimensionCallouts(this.currentConfig);
    }

    this.animFrameId = requestAnimationFrame(this.render);
  };

  public destroy() {
    if (this.animFrameId !== null) {
      cancelAnimationFrame(this.animFrameId);
    }
    if (this.gl) {
      if (this.vaoVertexBuffer) this.gl.deleteBuffer(this.vaoVertexBuffer);
      if (this.vaoNormalBuffer) this.gl.deleteBuffer(this.vaoNormalBuffer);
      if (this.vaoIndexBuffer) this.gl.deleteBuffer(this.vaoIndexBuffer);
      if (this.gridVertexBuffer) this.gl.deleteBuffer(this.gridVertexBuffer);
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.gridProgram) this.gl.deleteProgram(this.gridProgram);
    }
  }
}
