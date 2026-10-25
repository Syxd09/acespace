import { BasinConfiguration, CONFIGURATOR_MATERIALS } from '@/data/basinConfiguratorData';
import { buildStandaloneBasinMesh } from './basinMeshBuilder';
import { ProceduralMeshData } from './meshBuilder';
import { Vec3, Mat4, DimensionCallout, CadDimensionData, CadDimensionLine, CadDimensionNode } from './webglEngine';

export interface ScaleFigureScreenPos {
  head: { x: number; y: number };
  feet: { x: number; y: number };
  hand: { x: number; y: number };
  datumLeft: { x: number; y: number };
  datumRight: { x: number; y: number };
  plumbingBottom: { x: number; y: number };
  isVisible: boolean;
  scaleHeightPx: number;
}

export class Basin3DEngine {
  private canvas: HTMLCanvasElement;
  private gl: WebGLRenderingContext | null = null;
  private animFrameId: number | null = null;

  // Camera & Orbit State
  private cameraEye = new Vec3(0, 0.45, 0.85);
  private cameraTarget = new Vec3(0, 0.08, 0);
  private cameraUp = new Vec3(0, 1, 0);

  private orbitAzimuth = 0.65; // radians
  private orbitElevation = 0.45; // radians
  private orbitDistance = 0.95; // world units (meters)
  private targetDistance = 0.95;

  private isDragging = false;
  private isPanning = false;
  private lastMouseX = 0;
  private lastMouseY = 0;

  // Shader Programs & Buffers
  private program: WebGLProgram | null = null;
  private gridProgram: WebGLProgram | null = null;

  private vaoVertexBuffer: WebGLBuffer | null = null;
  private vaoNormalBuffer: WebGLBuffer | null = null;
  private vaoColorBuffer: WebGLBuffer | null = null;
  private vaoIndexBuffer: WebGLBuffer | null = null;
  private vertexCount = 0;

  private gridVertexBuffer: WebGLBuffer | null = null;
  private gridVertexCount = 0;

  // Configuration Cache
  private currentConfig: BasinConfiguration | null = null;
  private materialRgb = [0.95, 0.94, 0.92];
  private isWireframe = false;
  private showDimensions = true;
  private isTurntable = false;
  private currentMesh: ProceduralMeshData | null = null;
  private needsRender = true;

  // Texture Cache
  private textureCache = new Map<string, WebGLTexture>();
  private activeTexture: WebGLTexture | null = null;
  private currentTextureUrl: string | null = null;

  // Callbacks
  private onDimensionsUpdate?: (callouts: DimensionCallout[], cadData?: CadDimensionData) => void;
  private onScaleFigureUpdate?: (pos: ScaleFigureScreenPos | null) => void;
  private cleanupEvents?: () => void;
  private resizeObserver: ResizeObserver | null = null;

  constructor(
    canvas: HTMLCanvasElement,
    onDimensionsUpdate?: (callouts: DimensionCallout[], cadData?: CadDimensionData) => void,
    onScaleFigureUpdate?: (pos: ScaleFigureScreenPos | null) => void
  ) {
    this.canvas = canvas;
    this.onDimensionsUpdate = onDimensionsUpdate;
    this.onScaleFigureUpdate = onScaleFigureUpdate;
    this.initWebGL();
    this.bindEvents();
    this.requestRender();
    this.render();
  }

  public setScaleFigureCallback(cb: (pos: ScaleFigureScreenPos | null) => void) {
    this.onScaleFigureUpdate = cb;
    if (this.currentConfig) {
      this.computeDimensionCallouts(this.currentConfig);
    }
  }

  public requestRender() {
    this.needsRender = true;
  }

  private initWebGL() {
    this.gl = this.canvas.getContext('webgl', {
      antialias: true,
      alpha: true,
      preserveDrawingBuffer: true,
      powerPreference: 'high-performance',
    });

    if (!this.gl || this.gl.isContextLost()) {
      console.warn('WebGL not available for Basin3DEngine');
      return;
    }

    const gl = this.gl;
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);
    gl.disable(gl.CULL_FACE);

    // Warm architectural neutral background
    gl.clearColor(0.94, 0.93, 0.91, 1.0);

    this.initShaders();
    this.buildGridGeometry();
    this.handleResize();
  }

  private initShaders() {
    if (!this.gl) return;
    const gl = this.gl;

    const vsSource = `
      attribute vec3 aPosition;
      attribute vec3 aNormal;
      attribute vec4 aColor;

      uniform mat4 uProjection;
      uniform mat4 uView;
      uniform mat4 uModel;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vLocalPos;
      varying vec4 vColor;

      void main() {
        vLocalPos = aPosition;
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
      uniform sampler2D uTexture;
      uniform int uHasTexture;
      uniform float uTextureScale;

      varying vec3 vNormal;
      varying vec3 vWorldPos;
      varying vec3 vLocalPos;
      varying vec4 vColor;

      void main() {
        if (uIsWireframe == 1) {
          gl_FragColor = vec4(0.12, 0.13, 0.11, 0.85);
          return;
        }

        vec3 N = normalize(vNormal);
        if (!gl_FrontFacing) N = -N;
        vec3 V = normalize(uCameraPos - vWorldPos);

        // Key Light
        vec3 L1 = normalize(uLightPos1 - vWorldPos);
        float diff1 = max(dot(N, L1), 0.0);
        vec3 H1 = normalize(L1 + V);

        // Fill Light
        vec3 L2 = normalize(uLightPos2 - vWorldPos);
        float diff2 = max(dot(N, L2), 0.0) * 0.45;

        // Bottom Underside Bounce Fill Light
        float diff3 = max(dot(N, vec3(0.0, -1.0, 0.0)), 0.0) * 0.45;

        bool isMetal = vColor.a > 0.5;
        vec3 baseColor;
        float specPower;
        float specIntensity;

        if (isMetal) {
          baseColor = vColor.rgb;
          specPower = 64.0;
          specIntensity = 0.85;
        } else {
          vec3 texSample = uColor;
          if (uHasTexture == 1) {
            vec3 blending = pow(abs(N), vec3(4.0));
            float bSum = blending.x + blending.y + blending.z;
            blending = blending / max(bSum, 0.00001);

            vec2 uvX = vLocalPos.zy * uTextureScale;
            vec2 uvY = vLocalPos.xz * uTextureScale;
            vec2 uvZ = vLocalPos.xy * uTextureScale;

            vec4 colX = texture2D(uTexture, uvX);
            vec4 colY = texture2D(uTexture, uvY);
            vec4 colZ = texture2D(uTexture, uvZ);

            texSample = (colX * blending.x + colY * blending.y + colZ * blending.z).rgb;
          }

          baseColor = texSample * vColor.rgb;
          specPower = 32.0;
          specIntensity = 0.22;
        }

        float spec1 = pow(max(dot(N, H1), 0.0), specPower);
        float hemi = clamp(N.y * 0.35 + 0.65, 0.0, 1.0) * 0.45 + 0.50;
        float fresnel = pow(1.0 - max(dot(N, V), 0.0), 3.0) * (isMetal ? 0.40 : 0.18);

        vec3 ambient = baseColor * hemi;
        vec3 diffuse = baseColor * (diff1 * 0.55 + diff2 + diff3);
        vec3 specular = (isMetal ? vec3(1.0) : vec3(0.96, 0.95, 0.94)) * spec1 * specIntensity;
        vec3 rim = (isMetal ? vec3(1.0) : vec3(1.0)) * fresnel;

        gl_FragColor = vec4(ambient + diffuse + specular + rim, 1.0);
      }
    `;

    this.program = this.createProgram(vsSource, fsSource);

    // Grid Shader
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
        gl_FragColor = vec4(0.12, 0.13, 0.11, 0.08);
      }
    `;
    this.gridProgram = this.createProgram(gridVs, gridFs);
  }

  private createProgram(vsSource: string, fsSource: string): WebGLProgram | null {
    if (!this.gl || this.gl.isContextLost()) return null;
    const gl = this.gl;

    const vs = gl.createShader(gl.VERTEX_SHADER)!;
    gl.shaderSource(vs, vsSource);
    gl.compileShader(vs);

    const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
    gl.shaderSource(fs, fsSource);
    gl.compileShader(fs);

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    return prog;
  }

  private buildGridGeometry() {
    if (!this.gl) return;
    const gl = this.gl;

    const size = 1.6;
    const step = 0.1;
    const vertices: number[] = [];
    const yLevel = -0.001;

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

  public updateConfiguration(config: BasinConfiguration) {
    if (!config) return;
    this.currentConfig = config;

    const rawHex = (config.materialHex || '#f6f3ef').replace('#', '');
    const r = parseInt(rawHex.substring(0, 2), 16) / 255;
    const g = parseInt(rawHex.substring(2, 4), 16) / 255;
    const b = parseInt(rawHex.substring(4, 6), 16) / 255;
    this.materialRgb = [isNaN(r) ? 0.95 : r, isNaN(g) ? 0.94 : g, isNaN(b) ? 0.92 : b];

    const targetMat = CONFIGURATOR_MATERIALS.find(m => m.slug === config.materialSlug);
    const cleanSlug = (config.materialSlug || 'corian-glacier-white').replace(/^corian-/, '').toLowerCase().trim();
    const texturePath = targetMat?.swatchImage || `/materials/swatches/${cleanSlug}.jpg`;
    this.loadMaterialTexture(texturePath);

    this.generateBasinGeometry(config);
    this.computeDimensionCallouts(config);
    this.requestRender();
  }

  private loadMaterialTexture(url: string) {
    if (!this.gl) return;
    const gl = this.gl;

    if (this.currentTextureUrl === url && this.activeTexture) return;
    this.currentTextureUrl = url;

    if (this.textureCache.has(url)) {
      this.activeTexture = this.textureCache.get(url)!;
      this.requestRender();
      return;
    }

    const texture = gl.createTexture()!;
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(
      gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE,
      new Uint8Array([Math.round(this.materialRgb[0] * 255), Math.round(this.materialRgb[1] * 255), Math.round(this.materialRgb[2] * 255), 255])
    );
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

    this.activeTexture = texture;
    this.textureCache.set(url, texture);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (!this.gl) return;
      const potCanvas = document.createElement('canvas');
      potCanvas.width = 512;
      potCanvas.height = 512;
      const ctx = potCanvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(img, 0, 0, 512, 512);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 1);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, potCanvas);
        gl.generateMipmap(gl.TEXTURE_2D);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      }
      this.requestRender();
    };
    img.src = url;
  }

  private generateBasinGeometry(cfg: BasinConfiguration) {
    if (!this.gl) return;
    const gl = this.gl;

    const mesh = buildStandaloneBasinMesh(cfg);
    this.currentMesh = mesh;

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

  public getGeometryData(): ProceduralMeshData | null {
    return this.currentMesh;
  }

  // CAD Dimension Projection for Standalone Basin (Width W, Depth D, Height H)
  private computeDimensionCallouts(cfg: BasinConfiguration) {
    const halfW = (cfg.width / 1000) / 2;
    const halfD = (cfg.depth / 1000) / 2;
    const H = cfg.height / 1000;

    // 1. Calculate Human Scale Figure screen coordinates (1.70m standing woman)
    // Floor is at Y = -0.85m, head at Y = +0.85m (1.70m tall).
    // Woman stands to the left of the basin at X = -halfW - 0.06m
    const womanX = -halfW - 0.06;
    const pFeet = new Vec3(womanX, -0.85, 0);
    const pHead = new Vec3(womanX, 0.85, 0);
    const pHand = new Vec3(-halfW - 0.01, 0.02, 0);

    const sFeet = this.projectToScreen(pFeet);
    const sHead = this.projectToScreen(pHead);
    const sHand = this.projectToScreen(pHand);

    if (this.onScaleFigureUpdate) {
      // Show scale figure in architectural elevation / perspective angles, but hide when looking directly underneath or straight top-down
      const isVisible = this.orbitElevation > -0.25 && this.orbitElevation < 1.25 && sFeet.x > -500 && sHead.x > -500 && Math.abs(sFeet.y - sHead.y) > 30;
      const scaleHeightPx = Math.abs(sFeet.y - sHead.y);
      this.onScaleFigureUpdate({
        head: sHead,
        feet: sFeet,
        hand: sHand,
        datumLeft: sFeet,
        datumRight: sHand,
        plumbingBottom: sHand,
        isVisible,
        scaleHeightPx,
      });
    }

    if (!this.onDimensionsUpdate || !this.showDimensions) {
      if (this.onDimensionsUpdate) this.onDimensionsUpdate([], { lines: [], nodes: [], isVisible: false });
      return;
    }

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

    // Plumbing Centerline Drop Line (Matching Reference Images 1, 2, 3, 4)
    addLine('cad-plumb', new Vec3(0, 0, 0), new Vec3(0, -0.16, 0), undefined, true);

    // 1. WIDTH DIMENSION (Top Length: -halfW to +halfW at rim level H)
    const offsetTop = 0.025;
    const pRimLeft = new Vec3(-halfW, H, 0);
    const pRimRight = new Vec3(halfW, H, 0);
    const pDimLeft = new Vec3(-halfW, H + offsetTop, 0);
    const pDimRight = new Vec3(halfW, H + offsetTop, 0);
    const pHandExtension = new Vec3(womanX + 0.04, H, 0);

    // Extension line to woman's hand (Matching Reference Image 1)
    addLine('w-ext-hand', pRimLeft, pHandExtension, undefined, true);
    addLine('w-ext-l', pRimLeft, pDimLeft, undefined, true);
    addLine('w-ext-r', pRimRight, pDimRight, undefined, true);
    addLine('w-span', pDimLeft, pDimRight, `${cfg.width} mm`);
    addNode('n-w-l', pDimLeft);
    addNode('n-w-r', pDimRight);

    // 2. HEIGHT DIMENSION on the RIGHT (0 to H, free from woman silhouette)
    const offsetRight = Math.max(0.04, halfW * 0.16);
    const pRightBase = new Vec3(halfW + offsetRight, 0, 0);
    const pRightTop = new Vec3(halfW + offsetRight, H, 0);
    const pRightBaseRef = new Vec3(halfW, 0, 0);
    const pRightTopRef = new Vec3(halfW, H, 0);

    addLine('h-ext-base', pRightBaseRef, pRightBase, undefined, true);
    addLine('h-ext-top', pRightTopRef, pRightTop, undefined, true);
    addLine('h-span', pRightBase, pRightTop, `${cfg.height} mm`);
    addNode('n-h-b', pRightBase);
    addNode('n-h-t', pRightTop);

    const cadData: CadDimensionData = {
      lines,
      nodes,
      isVisible: true,
    };

    const callouts: DimensionCallout[] = [
      {
        id: 'width',
        label: `L: ${cfg.width} mm`,
        valueMm: cfg.width,
        screenStart: this.projectToScreen(pDimLeft),
        screenEnd: this.projectToScreen(pDimRight),
        screenMid: this.projectToScreen(new Vec3(0, H + offsetTop, 0)),
        isVisible: true,
      },
      {
        id: 'height',
        label: `H: ${cfg.height} mm`,
        valueMm: cfg.height,
        screenStart: this.projectToScreen(pRightBase),
        screenEnd: this.projectToScreen(pRightTop),
        screenMid: this.projectToScreen(new Vec3(halfW + offsetRight, H / 2, 0)),
        isVisible: true,
      },
    ];

    this.onDimensionsUpdate(callouts, cadData);
  }

  private projectToScreen(worldPos: Vec3): { x: number; y: number } {
    if (!this.canvas) return { x: -9999, y: -9999 };

    const fovy = (42 * Math.PI) / 180;
    const aspect = this.canvas.width / Math.max(this.canvas.height, 1);
    const proj = new Mat4().perspective(fovy, aspect, 0.05, 50.0);
    const view = new Mat4().lookAt(this.cameraEye, this.cameraTarget, this.cameraUp);
    const vp = proj.multiply(view);

    const m = vp.elements;
    const x = worldPos.x;
    const y = worldPos.y;
    const z = worldPos.z;

    const clipW = m[3] * x + m[7] * y + m[11] * z + m[15];
    if (clipW <= 0.001) return { x: -9999, y: -9999 };

    const clipX = (m[0] * x + m[4] * y + m[8] * z + m[12]) / clipW;
    const clipY = (m[1] * x + m[5] * y + m[9] * z + m[13]) / clipW;

    const rect = this.canvas.getBoundingClientRect();
    const screenX = ((clipX + 1) * 0.5) * rect.width;
    const screenY = ((1 - clipY) * 0.5) * rect.height;

    return { x: screenX, y: screenY };
  }

  // Camera Orbit & Viewpoint Controls
  public setViewpoint(view: 'isometric' | 'front' | 'top' | 'side' | 'bottom') {
    switch (view) {
      case 'isometric':
        this.orbitAzimuth = 0.65;
        this.orbitElevation = 0.45;
        this.orbitDistance = 0.95;
        this.cameraTarget.set(0, 0.05, 0);
        break;
      case 'front':
        this.orbitAzimuth = 0;
        this.orbitElevation = 0.04;
        this.orbitDistance = 1.35;
        this.cameraTarget.set(0, 0.05, 0);
        break;
      case 'top':
        this.orbitAzimuth = 0;
        this.orbitElevation = 1.48; // looking straight down
        this.orbitDistance = 0.95;
        this.cameraTarget.set(0, 0.05, 0);
        break;
      case 'side':
        this.orbitAzimuth = Math.PI / 2;
        this.orbitElevation = 0.12;
        this.orbitDistance = 0.85;
        this.cameraTarget.set(0, 0.05, 0);
        break;
      case 'bottom':
        this.orbitAzimuth = 0;
        this.orbitElevation = -1.30; // looking straight up at underside
        this.orbitDistance = 0.95;
        this.cameraTarget.set(0, 0.05, 0);
        break;
    }
    this.updateCameraVectors();
    this.requestRender();
  }

  public resetCamera() {
    this.setViewpoint('isometric');
  }

  public toggleDimensions(): boolean {
    this.showDimensions = !this.showDimensions;
    if (this.currentConfig) {
      this.computeDimensionCallouts(this.currentConfig);
    }
    this.requestRender();
    return this.showDimensions;
  }

  public toggleWireframe(): boolean {
    this.isWireframe = !this.isWireframe;
    this.requestRender();
    return this.isWireframe;
  }

  public toggleTurntable(): boolean {
    this.isTurntable = !this.isTurntable;
    this.requestRender();
    return this.isTurntable;
  }

  public getCanvasDataURL(): string {
    return this.canvas.toDataURL('image/png', 1.0);
  }

  private updateCameraVectors() {
    const cosEle = Math.cos(this.orbitElevation);
    const sinEle = Math.sin(this.orbitElevation);
    const cosAzi = Math.cos(this.orbitAzimuth);
    const sinAzi = Math.sin(this.orbitAzimuth);

    const eyeX = this.cameraTarget.x + this.orbitDistance * cosEle * sinAzi;
    const eyeY = this.cameraTarget.y + this.orbitDistance * sinEle;
    const eyeZ = this.cameraTarget.z + this.orbitDistance * cosEle * cosAzi;

    this.cameraEye.set(eyeX, eyeY, eyeZ);

    if (this.currentConfig) {
      this.computeDimensionCallouts(this.currentConfig);
    }
  }

  private handleResize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.floor(rect.width * dpr);
    const height = Math.floor(rect.height * dpr);

    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
      if (this.gl) {
        this.gl.viewport(0, 0, width, height);
      }
      this.requestRender();
    }
  }

  private bindEvents() {
    const canvas = this.canvas;

    const onMouseDown = (e: MouseEvent) => {
      e.preventDefault();
      if (e.button === 0) {
        this.isDragging = true;
        this.isPanning = false;
      } else if (e.button === 2) {
        this.isPanning = true;
        this.isDragging = false;
      }
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (!this.isDragging && !this.isPanning) return;
      const dx = e.clientX - this.lastMouseX;
      const dy = e.clientY - this.lastMouseY;
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (this.isDragging) {
        this.orbitAzimuth += dx * 0.008;
        this.orbitElevation = Math.max(-1.50, Math.min(1.50, this.orbitElevation + dy * 0.008));
        this.updateCameraVectors();
        this.requestRender();
      } else if (this.isPanning) {
        const panSpeed = 0.0012 * this.orbitDistance;
        const forward = this.cameraTarget.clone().sub(this.cameraEye).normalize();
        const right = forward.clone().cross(this.cameraUp).normalize();
        const up = right.clone().cross(forward).normalize();

        this.cameraTarget.add(right.scale(-dx * panSpeed)).add(up.scale(dy * panSpeed));
        this.updateCameraVectors();
        this.requestRender();
      }
    };

    const onMouseUp = () => {
      this.isDragging = false;
      this.isPanning = false;
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const zoomFactor = e.deltaY > 0 ? 1.08 : 0.92;
      this.orbitDistance = Math.max(0.35, Math.min(3.5, this.orbitDistance * zoomFactor));
      this.updateCameraVectors();
      this.requestRender();
    };

    const onContextMenu = (e: Event) => e.preventDefault();

    // Touch events
    let touchStartDist = 0;
    const onTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        this.isDragging = true;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;
      } else if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 1 && this.isDragging) {
        const dx = e.touches[0].clientX - this.lastMouseX;
        const dy = e.touches[0].clientY - this.lastMouseY;
        this.lastMouseX = e.touches[0].clientX;
        this.lastMouseY = e.touches[0].clientY;

        this.orbitAzimuth += dx * 0.008;
        this.orbitElevation = Math.max(-1.50, Math.min(1.50, this.orbitElevation + dy * 0.008));
        this.updateCameraVectors();
        this.requestRender();
      } else if (e.touches.length === 2) {
        const curDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        if (touchStartDist > 0) {
          const factor = touchStartDist / curDist;
          this.orbitDistance = Math.max(0.35, Math.min(2.5, this.orbitDistance * (1 + (factor - 1) * 0.4)));
          this.updateCameraVectors();
          this.requestRender();
        }
        touchStartDist = curDist;
      }
    };

    const onTouchEnd = () => {
      this.isDragging = false;
      touchStartDist = 0;
    };

    canvas.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    canvas.addEventListener('wheel', onWheel, { passive: false });
    canvas.addEventListener('contextmenu', onContextMenu);
    canvas.addEventListener('touchstart', onTouchStart, { passive: false });
    canvas.addEventListener('touchmove', onTouchMove, { passive: false });
    canvas.addEventListener('touchend', onTouchEnd);

    this.resizeObserver = new ResizeObserver(() => this.handleResize());
    this.resizeObserver.observe(canvas);

    this.cleanupEvents = () => {
      canvas.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
      canvas.removeEventListener('wheel', onWheel);
      canvas.removeEventListener('contextmenu', onContextMenu);
      canvas.removeEventListener('touchstart', onTouchStart);
      canvas.removeEventListener('touchmove', onTouchMove);
      canvas.removeEventListener('touchend', onTouchEnd);
      if (this.resizeObserver) this.resizeObserver.disconnect();
    };
  }

  private render = () => {
    if (this.isTurntable) {
      this.orbitAzimuth += 0.007;
      this.updateCameraVectors();
      this.needsRender = true;
    }

    if (this.needsRender && this.gl && this.program) {
      this.needsRender = false;
      const gl = this.gl;

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      const fovy = (42 * Math.PI) / 180;
      const aspect = this.canvas.width / Math.max(this.canvas.height, 1);
      const proj = new Mat4().perspective(fovy, aspect, 0.05, 50.0);
      const view = new Mat4().lookAt(this.cameraEye, this.cameraTarget, this.cameraUp);
      const model = new Mat4().identity();

      // 1. Draw Ground Grid (hide when looking up from underneath so bottom of sink is crystal-clear)
      if (this.gridProgram && this.gridVertexBuffer && this.orbitElevation > -0.05) {
        gl.useProgram(this.gridProgram);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.gridProgram, 'uProjection'), false, proj.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.gridProgram, 'uView'), false, view.elements);

        const aGridPos = gl.getAttribLocation(this.gridProgram, 'aPosition');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.gridVertexBuffer);
        gl.enableVertexAttribArray(aGridPos);
        gl.vertexAttribPointer(aGridPos, 3, gl.FLOAT, false, 0, 0);

        gl.drawArrays(gl.LINES, 0, this.gridVertexCount);
        gl.disableVertexAttribArray(aGridPos);
      }

      // 2. Draw Standalone Basin Mesh
      if (this.vertexCount > 0 && this.vaoVertexBuffer && this.vaoNormalBuffer && this.vaoIndexBuffer) {
        gl.useProgram(this.program);

        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uProjection'), false, proj.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uView'), false, view.elements);
        gl.uniformMatrix4fv(gl.getUniformLocation(this.program, 'uModel'), false, model.elements);

        gl.uniform3fv(gl.getUniformLocation(this.program, 'uColor'), this.materialRgb);
        gl.uniform3f(gl.getUniformLocation(this.program, 'uLightPos1'), 1.8, 2.4, 2.0);
        gl.uniform3f(gl.getUniformLocation(this.program, 'uLightPos2'), -1.6, 1.4, -1.8);
        gl.uniform3f(gl.getUniformLocation(this.program, 'uCameraPos'), this.cameraEye.x, this.cameraEye.y, this.cameraEye.z);
        gl.uniform1i(gl.getUniformLocation(this.program, 'uIsWireframe'), this.isWireframe ? 1 : 0);

        // Texture Unit
        if (this.activeTexture) {
          gl.activeTexture(gl.TEXTURE0);
          gl.bindTexture(gl.TEXTURE_2D, this.activeTexture);
          gl.uniform1i(gl.getUniformLocation(this.program, 'uTexture'), 0);
          gl.uniform1i(gl.getUniformLocation(this.program, 'uHasTexture'), 1);
          gl.uniform1f(gl.getUniformLocation(this.program, 'uTextureScale'), 2.2);
        } else {
          gl.uniform1i(gl.getUniformLocation(this.program, 'uHasTexture'), 0);
        }

        // Positions
        const aPos = gl.getAttribLocation(this.program, 'aPosition');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoVertexBuffer);
        gl.enableVertexAttribArray(aPos);
        gl.vertexAttribPointer(aPos, 3, gl.FLOAT, false, 0, 0);

        // Normals
        const aNorm = gl.getAttribLocation(this.program, 'aNormal');
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoNormalBuffer);
        gl.enableVertexAttribArray(aNorm);
        gl.vertexAttribPointer(aNorm, 3, gl.FLOAT, false, 0, 0);

        // Colors
        const aCol = gl.getAttribLocation(this.program, 'aColor');
        if (aCol !== -1 && this.vaoColorBuffer) {
          gl.bindBuffer(gl.ARRAY_BUFFER, this.vaoColorBuffer);
          gl.enableVertexAttribArray(aCol);
          gl.vertexAttribPointer(aCol, 4, gl.FLOAT, false, 0, 0);
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.vaoIndexBuffer);

        if (this.isWireframe) {
          gl.drawElements(gl.LINES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        } else {
          gl.drawElements(gl.TRIANGLES, this.vertexCount, gl.UNSIGNED_SHORT, 0);
        }

        gl.disableVertexAttribArray(aPos);
        gl.disableVertexAttribArray(aNorm);
        if (aCol !== -1) gl.disableVertexAttribArray(aCol);
      }
    }

    this.animFrameId = requestAnimationFrame(this.render);
  };

  public destroy() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    if (this.cleanupEvents) this.cleanupEvents();
    if (this.gl) {
      if (this.vaoVertexBuffer) this.gl.deleteBuffer(this.vaoVertexBuffer);
      if (this.vaoNormalBuffer) this.gl.deleteBuffer(this.vaoNormalBuffer);
      if (this.vaoColorBuffer) this.gl.deleteBuffer(this.vaoColorBuffer);
      if (this.vaoIndexBuffer) this.gl.deleteBuffer(this.vaoIndexBuffer);
      if (this.gridVertexBuffer) this.gl.deleteBuffer(this.gridVertexBuffer);
      if (this.program) this.gl.deleteProgram(this.program);
      if (this.gridProgram) this.gl.deleteProgram(this.gridProgram);
    }
  }
}
