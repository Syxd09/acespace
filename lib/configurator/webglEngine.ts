import { ProductConfiguration } from '@/data/configuratorData';
import { buildProductMesh, ProceduralMeshData } from './meshBuilder';
export { buildProductMesh };
export type { ProceduralMeshData };

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

export interface CadDimensionLine {
  id: string;
  start: { x: number; y: number };
  end: { x: number; y: number };
  mid: { x: number; y: number };
  label?: string | number;
  isDashed?: boolean;
}

export interface CadDimensionNode {
  id: string;
  pos: { x: number; y: number };
  label?: string;
}

export interface CadDimensionData {
  lines: CadDimensionLine[];
  nodes: CadDimensionNode[];
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
  private vaoColorBuffer: WebGLBuffer | null = null;
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
  private isTurntable = false;
  private currentMesh: ProceduralMeshData | null = null;

  // Callout Callbacks
  private onDimensionsUpdate?: (callouts: DimensionCallout[], cadData?: CadDimensionData) => void;
  private cleanupEvents?: () => void;
  private resizeObserver: ResizeObserver | null = null;

  constructor(canvas: HTMLCanvasElement, onDimensionsUpdate?: (callouts: DimensionCallout[], cadData?: CadDimensionData) => void) {
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

    if (!this.gl || this.gl.isContextLost()) {
      console.warn('WebGL is not available in current browser context.');
      return;
    }

    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    // Architectural Neutral Ground Clear Color (#f0eee8)
    gl.clearColor(0.94, 0.93, 0.91, 1.0);

    this.initShaders();
    this.buildGridGeometry();
    this.handleResize();
  }

  private initShaders() {
    if (!this.gl) return;
    const gl = this.gl;

    // Solid Surface Phong / Blinn Shader with Chrome & Metallic Details
    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec4 aColor;

      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec4 vColor;

      void main() {
        vec4 worldPos = uModel * vec4(aPosition, 1.0);
        vWorldPos = worldPos.xyz;
        vNormal = mat3(uModel) * aNormal;
        vColor = aColor;
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
      varying vec4 vColor;

      void main() {
        if (uIsWireframe == 1) {
          gl_FragColor = vec4(0.12, 0.13, 0.11, 0.85);
          return;
        }

        vec3 N = normalize(vNormal);
        if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(uCameraPos - vWorldPos);

        // Key Light (Warm Architectural Studio Spotlight)
        vec3 L1 = normalize(uLightPos1 - vWorldPos);
        float diff1 = max(dot(N, L1), 0.0);
        vec3 H1 = normalize(L1 + V);

        // Fill Light (Cool Diffuse Ambient Reflection)
        vec3 L2 = normalize(uLightPos2 - vWorldPos);
        float diff2 = max(dot(N, L2), 0.0) * 0.45;

        // Custom metallic/chrome or dark cavity test (aColor.a > 0.5)
        bool isMetal = vColor.a > 0.5;
        vec3 baseColor;
        float specPower;
        float specIntensity;

        if (isMetal) {
          baseColor = vColor.rgb;
          specPower = 64.0;
          specIntensity = 0.85;
        } else {
          // Solid surface stone with ambient occlusion multiplier (vColor.rgb)
          baseColor = uColor * vColor.rgb;
          specPower = 32.0;
          specIntensity = 0.22;
        }

        float spec1 = pow(max(dot(N, H1), 0.0), specPower);

        // Hemispherical Soft Ambient - bright & natural for architectural solid surface
        float hemi = clamp(N.y * 0.35 + 0.65, 0.0, 1.0) * 0.45 + 0.50;

        // Soft Subsurface Scatter / Chrome Rim Sheen
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0) * (isMetal ? 0.40 : 0.18);

        vec3 ambient = baseColor * hemi;
        vec3 diffuse = baseColor * (diff1 * 0.55 + diff2);
        vec3 specular = (isMetal ? vec3(1.0, 1.0, 1.0) : vec3(0.96, 0.95, 0.94)) * spec1 * specIntensity;
        vec3 rim = (isMetal ? vec3(1.0, 1.0, 1.0) : vec3(1.0)) * fresnel;

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
    if (!this.gl || this.gl.isContextLost()) return null;
    const gl = this.gl;

    const vs = gl.createShader(gl.VERTEX_SHADER);
    if (!vs) return null;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);
    if (!gl.getShaderParameter(vs, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(vs);
      if (log) console.error('VS Error:', log);
      gl.deleteShader(vs);
      return null;
    }

    const fs = gl.createShader(gl.FRAGMENT_SHADER);
    if (!fs) {
      gl.deleteShader(vs);
      return null;
    }
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);
    if (!gl.getShaderParameter(fs, gl.COMPILE_STATUS)) {
      const log = gl.getShaderInfoLog(fs);
      if (log) console.error('FS Error:', log);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }

    const prog = gl.createProgram();
    if (!prog) {
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      return null;
    }
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const log = gl.getProgramInfoLog(prog);
      if (log) console.error('Link Error:', log);
      gl.deleteShader(vs);
      gl.deleteShader(fs);
      gl.deleteProgram(prog);
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
    if (!config) return;
    this.currentConfig = config;

    // Convert hex color to float RGB with fallback
    const rawHex = (config.materialHex && typeof config.materialHex === 'string')
      ? config.materialHex
      : '#f3f2ee';
    const hex = rawHex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) / 255;
    const g = parseInt(hex.substring(2, 4), 16) / 255;
    const b = parseInt(hex.substring(4, 6), 16) / 255;
    this.materialRgb = [isNaN(r) ? 0.95 : r, isNaN(g) ? 0.94 : g, isNaN(b) ? 0.92 : b];

    this.generateProductGeometry(config);
    this.computeDimensionCallouts(config);
  }

  public getGeometryData(): ProceduralMeshData | null {
    return this.currentMesh;
  }

  private generateProductGeometry(cfg: ProductConfiguration) {
    if (!this.gl) return;
    const gl = this.gl;

    const mesh = buildProductMesh(cfg);
    this.currentMesh = mesh;

    // Bind Buffers to GPU
    if (!this.vaoVertexBuffer) this.vaoVertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoVertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.positions, gl.STATIC_DRAW);

    if (!this.vaoNormalBuffer) this.vaoNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, mesh.normals, gl.STATIC_DRAW);

    if (mesh.colors) {
      if (!this.vaoColorBuffer) this.vaoColorBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoColorBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, mesh.colors, gl.STATIC_DRAW);
    }

    if (!this.vaoIndexBuffer) this.vaoIndexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoIndexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, mesh.indices, gl.STATIC_DRAW);

    this.vertexCount = mesh.indices.length;
  }

  // -------------------------------------------------------------
  // -------------------------------------------------------------
  // Architectural CAD Dimension System & Screen Projection
  // -------------------------------------------------------------
  private computeDimensionCallouts(cfg: ProductConfiguration) {
    if (!this.onDimensionsUpdate || !this.showDimensions) {
      if (this.onDimensionsUpdate) this.onDimensionsUpdate([], { lines: [], nodes: [], isVisible: false });
      return;
    }

    const halfW = (cfg.width / 1000) / 2;
    const halfD = (cfg.depth / 1000) / 2;
    const topY = 0;
    const hasFrontApron = cfg.downstands?.front ?? ((cfg.frontApronHeight ?? 0) > 0);
    const frontApronMm = hasFrontApron ? (cfg.downstands?.heightMm ?? cfg.frontApronHeight ?? 0) : 0;
    const frontApron = frontApronMm / 1000;
    const isUpstandDisabled = cfg.upstands?.backMode === 'none';
    const isStdUpstand = !isUpstandDisabled && (cfg.upstands?.backMode === 'standard' || cfg.upstands?.type === 'standard');
    const rawUpstandMm = isUpstandDisabled ? 0 : isStdUpstand ? 80 : (cfg.rearUpstandHeight || cfg.upstands?.height || cfg.upstands?.heightMm || 0);
    const rearUpstand = rawUpstandMm / 1000;

    const lines: CadDimensionLine[] = [];
    const nodes: CadDimensionNode[] = [];

    const addLine = (id: string, p1: Vec3, p2: Vec3, label?: string | number, isDashed = false) => {
      const s1 = this.projectToScreen(p1);
      const s2 = this.projectToScreen(p2);
      if (s1.x < -1000 || s2.x < -1000) return;
      lines.push({
        id,
        start: s1,
        end: s2,
        mid: { x: (s1.x + s2.x) / 2, y: (s1.y + s2.y) / 2 },
        label,
        isDashed,
      });
    };

    const addNode = (id: string, p: Vec3, label?: string) => {
      const s = this.projectToScreen(p);
      if (s.x < -1000) return;
      nodes.push({ id, pos: s, label });
    };

    // 1. Vanity Outer Deck Boundary Corners
    const pBackLeft = new Vec3(-halfW, topY, -halfD);
    const pBackRight = new Vec3(halfW, topY, -halfD);
    const pFrontLeft = new Vec3(-halfW, topY, halfD);
    const pFrontRight = new Vec3(halfW, topY, halfD);

    // Rear top width dimension line
    addLine('back-width', pBackLeft, pBackRight, cfg.width);
    addNode('node-bl', pBackLeft);
    addNode('node-br', pBackRight);

    // Left and Right depth dimension lines
    addLine('left-depth', pBackLeft, pFrontLeft, cfg.depth);
    addNode('node-fl', pFrontLeft);

    addLine('right-depth', pBackRight, pFrontRight, cfg.depth);
    addNode('node-fr', pFrontRight);

    // Front dimension line with extension lines (offset forward)
    const frontOffset = Math.min(0.09, halfD * 0.22);
    const pFrontDimLeft = new Vec3(-halfW, topY, halfD + frontOffset);
    const pFrontDimRight = new Vec3(halfW, topY, halfD + frontOffset);

    addLine('front-ext-left', pFrontLeft, pFrontDimLeft, undefined, true);
    addLine('front-ext-right', pFrontRight, pFrontDimRight, undefined, true);
    addLine('front-width', pFrontDimLeft, pFrontDimRight, cfg.width);
    addNode('node-fdl', pFrontDimLeft);
    addNode('node-fdr', pFrontDimRight);

    // Left front corner vertical drop tick (shows 0 datum at corner)
    const T = (cfg.thickness || 12) / 1000;
    const drop = frontApron > 0 ? frontApron : T;
    const pBottomFrontLeft = new Vec3(-halfW, topY - drop, halfD);
    addLine('corner-drop', pFrontLeft, pBottomFrontLeft, undefined, true);
    addNode('node-drop', pBottomFrontLeft, '0');

    // 2. Basin Interior Dimensions & Clearances (exact CAD drafting style)
    const isNoBasin = cfg.basinModelId === 'none' || cfg.basinPlacement === 'none' || cfg.sinkIntegration === 'none';

    if (!isNoBasin) {
      let bwMm = cfg.basinWidthMm && cfg.basinWidthMm > 0 ? cfg.basinWidthMm : 274;
      let bdMm = cfg.basinDepthMm && cfg.basinDepthMm > 0 ? cfg.basinDepthMm : 274;
      if (cfg.basinModelId === 'RO' || cfg.basinModelId === 'round-bowl') {
        bwMm = cfg.basinWidthMm && cfg.basinWidthMm > 0 ? cfg.basinWidthMm : 274;
        bdMm = bwMm;
      } else if (cfg.basinModelId === 'OV' || cfg.basinModelId === 'coved-oval') {
        bwMm = cfg.basinWidthMm && cfg.basinWidthMm > 0 ? cfg.basinWidthMm : 500;
        bdMm = cfg.basinDepthMm && cfg.basinDepthMm > 0 ? cfg.basinDepthMm : 350;
      } else if (cfg.basinModelId === 'B' || cfg.basinModelId === 'crisp-rect') {
        bwMm = cfg.basinWidthMm && cfg.basinWidthMm > 0 ? cfg.basinWidthMm : 520;
        bdMm = cfg.basinDepthMm && cfg.basinDepthMm > 0 ? cfg.basinDepthMm : 350;
      }

      const bw = bwMm / 1000;
      const bd = bdMm / 1000;
      const rx = bw / 2;
      const rz = bd / 2;

      const bX = cfg.basinPlacement === 'left' ? -halfW * 0.42 : cfg.basinPlacement === 'right' ? halfW * 0.42 : 0;
      const bZ = 0;

      const distLeftMm = Math.round((bX - (-halfW)) * 1000);
      const distRightMm = Math.round((halfW - bX) * 1000);
      const backClearMm = Math.round(((bZ - rz) - (-halfD)) * 1000);
      const frontClearMm = Math.round((halfD - (bZ + rz)) * 1000);

      // Horizontal points across deck & basin:
      const pDeckLeft = new Vec3(-halfW, topY, bZ);
      const pBasinRimL = new Vec3(bX - rx, topY, bZ);
      const pBasinCenter = new Vec3(bX, topY, bZ);
      const pBasinRimR = new Vec3(bX + rx, topY, bZ);
      const pDeckRight = new Vec3(halfW, topY, bZ);

      addLine('basin-horiz-left', pDeckLeft, pBasinRimL, distLeftMm);
      addNode('node-dl', pDeckLeft);
      addNode('node-brl', pBasinRimL);

      addLine('basin-horiz-span', pBasinRimL, pBasinRimR, bwMm);
      addNode('node-bc', pBasinCenter);
      addNode('node-brr', pBasinRimR);

      addLine('basin-horiz-right', pBasinRimR, pDeckRight, distRightMm);
      addNode('node-dr', pDeckRight);

      // Vertical points across deck & basin:
      const pDeckBack = new Vec3(bX, topY, -halfD);
      const pBasinRimBack = new Vec3(bX, topY, bZ - rz);
      const pBasinRimFront = new Vec3(bX, topY, bZ + rz);
      const pDeckFront = new Vec3(bX, topY, halfD);

      addLine('basin-vert-back', pDeckBack, pBasinRimBack, backClearMm);
      addNode('node-db', pDeckBack);
      addNode('node-brb', pBasinRimBack);

      addLine('basin-vert-span', pBasinRimBack, pBasinRimFront, bdMm);
      addNode('node-brf', pBasinRimFront);

      addLine('basin-vert-front', pBasinRimFront, pDeckFront, frontClearMm);
      addNode('node-df', pDeckFront);
    }

    const cadData: CadDimensionData = {
      lines,
      nodes,
      isVisible: true,
    };

    // Backward-compatible callouts
    const callouts: DimensionCallout[] = [
      {
        id: 'width',
        label: `W: ${cfg.width} mm`,
        valueMm: cfg.width,
        screenStart: this.projectToScreen(pBackLeft),
        screenEnd: this.projectToScreen(pBackRight),
        screenMid: { x: (this.projectToScreen(pBackLeft).x + this.projectToScreen(pBackRight).x) / 2, y: (this.projectToScreen(pBackLeft).y + this.projectToScreen(pBackRight).y) / 2 },
        isVisible: true,
      },
      {
        id: 'depth',
        label: `D: ${cfg.depth} mm`,
        valueMm: cfg.depth,
        screenStart: this.projectToScreen(pBackLeft),
        screenEnd: this.projectToScreen(pFrontLeft),
        screenMid: { x: (this.projectToScreen(pBackLeft).x + this.projectToScreen(pFrontLeft).x) / 2, y: (this.projectToScreen(pBackLeft).y + this.projectToScreen(pFrontLeft).y) / 2 },
        isVisible: true,
      },
    ];

    this.onDimensionsUpdate(callouts, cadData);
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

  public toggleTurntable(): boolean {
    this.isTurntable = !this.isTurntable;
    return this.isTurntable;
  }

  public isTurntableActive(): boolean {
    return this.isTurntable;
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
        // Clamp elevation to avoid gimbal flipping while allowing full 360 degree view
        this.orbitElevation = Math.max(-Math.PI * 0.48, Math.min(Math.PI * 0.48, this.orbitElevation));
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
        this.orbitElevation = Math.max(-Math.PI * 0.48, Math.min(Math.PI * 0.48, this.orbitElevation));
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
    window.addEventListener('touchcancel', onTouchEnd);

    // Resize observer
    if (typeof ResizeObserver !== 'undefined') {
      this.resizeObserver = new ResizeObserver(() => this.handleResize());
      this.resizeObserver.observe(canvas);
    }

    this.cleanupEvents = () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);

      canvas.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchmove', onTouchMove);
      window.removeEventListener('touchend', onTouchEnd);
      window.removeEventListener('touchcancel', onTouchEnd);

      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
        this.resizeObserver = null;
      }
    };
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

    // Turntable 360 degree continuous rotation
    if (this.isTurntable && !this.isDragging) {
      this.orbitAzimuth += 0.007;
    }

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

      // Attribute: Color (Chrome & Metal Highlights)
      const aColor = gl.getAttribLocation(this.program, 'aColor');
      if (aColor !== -1 && this.vaoColorBuffer) {
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoColorBuffer);
        gl.enableVertexAttribArray(aColor);
        gl.vertexAttribPointer(aColor, 4, gl.FLOAT, false, 0, 0);
      } else if (aColor !== -1) {
        gl.disableVertexAttribArray(aColor);
        gl.vertexAttrib4f(aColor, 1.0, 1.0, 1.0, 0.0);
      }

      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoIndexBuffer);

      if (this.isWireframe) {
        gl.drawElements(gl.LINES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
      } else {
        gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
      }

      gl.disableVertexAttribArray(aPos);
      gl.disableVertexAttribArray(aNorm);
      if (aColor !== -1 && this.vaoColorBuffer) {
        gl.disableVertexAttribArray(aColor);
      }
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
      this.animFrameId = null;
    }
    if (this.cleanupEvents) {
      this.cleanupEvents();
      this.cleanupEvents = undefined;
    }
    if (this.gl) {
      if (this.vaoVertexBuffer) this.gl.deleteBuffer(this.vaoVertexBuffer);
      if (this.vaoNormalBuffer) this.gl.deleteBuffer(this.vaoNormalBuffer);
      if (this.vaoColorBuffer) this.gl.deleteBuffer(this.vaoColorBuffer);
      if (this.vaoIndexBuffer) this.gl.deleteBuffer(this.vaoIndexBuffer);
      if (this.gridVertexBuffer) this.gl.deleteBuffer(this.gridVertexBuffer);
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.gridProgram) this.gl.deleteProgram(this.gridProgram);
      this.gl = null;
    }
  }
}

