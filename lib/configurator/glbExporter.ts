import { ProceduralMeshData } from './meshBuilder';
export type { ProceduralMeshData };

/**
 * Exports procedural architectural geometry into a standard binary glTF 2.0 (.glb) container
 * compliant with Google Scene Viewer (Android) and Apple Quick Look (iOS via model-viewer).
 *
 * Metric scale: 1.0 world unit = 1.0 meter.
 */
export function exportGeometryToGlb(mesh: ProceduralMeshData): Uint8Array {
  const { positions, normals, indices } = mesh;
  const numVertices = positions.length / 3;
  const numIndices = indices.length;

  // Compute AABB bounding box for glTF accessor min/max
  let minX = Infinity, minY = Infinity, minZ = Infinity;
  let maxX = -Infinity, maxY = -Infinity, maxZ = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    if (x < minX) minX = x;
    if (y < minY) minY = y;
    if (z < minZ) minZ = z;
    if (x > maxX) maxX = x;
    if (y > maxY) maxY = y;
    if (z > maxZ) maxZ = z;
  }

  // Fallback if empty mesh
  if (!isFinite(minX)) {
    minX = minY = minZ = -0.5;
    maxX = maxY = maxZ = 0.5;
  }

  // Calculate buffer lengths with 4-byte alignment
  const posBytes = positions.byteLength;
  const normBytes = normals.byteLength;
  const idxBytes = indices.byteLength;

  // Align offsets to 4-byte multiples
  const align4 = (n: number) => (n + 3) & ~3;

  const posOffset = 0;
  const normOffset = align4(posOffset + posBytes);
  const idxOffset = align4(normOffset + normBytes);
  const totalBinLength = align4(idxOffset + idxBytes);

  // Construct binary buffer
  const binBuffer = new Uint8Array(totalBinLength);
  binBuffer.set(new Uint8Array(positions.buffer, positions.byteOffset, posBytes), posOffset);
  binBuffer.set(new Uint8Array(normals.buffer, normals.byteOffset, normBytes), normOffset);
  binBuffer.set(new Uint8Array(indices.buffer, indices.byteOffset, idxBytes), idxOffset);

  // Material color: default to architectural mineral white
  const rgb = mesh.colorRgb || [0.95, 0.94, 0.92];

  // Construct glTF JSON Structure
  const gltf = {
    asset: {
      version: '2.0',
      generator: 'Ace Spaces India Parametric Architectural Engine',
      copyright: 'Ace Spaces India Private Limited',
    },
    scene: 0,
    scenes: [
      {
        nodes: [0],
      },
    ],
    nodes: [
      {
        mesh: 0,
        name: mesh.name || 'Ace Spaces Architectural Solid Surface',
      },
    ],
    meshes: [
      {
        name: mesh.name || 'Architectural Surface Mesh',
        primitives: [
          {
            attributes: {
              POSITION: 0,
              NORMAL: 1,
            },
            indices: 2,
            material: 0,
            mode: 4, // TRIANGLES
          },
        ],
      },
    ],
    materials: [
      {
        name: 'DuPont™ Corian® Mineral Solid Surface',
        pbrMetallicRoughness: {
          baseColorFactor: [rgb[0], rgb[1], rgb[2], 1.0],
          roughnessFactor: 0.48, // Tactile honed architectural mineral
          metallicFactor: 0.04,  // Non-metallic mineral matrix
        },
        doubleSided: true,
      },
    ],
    accessors: [
      {
        bufferView: 0,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: numVertices,
        type: 'VEC3',
        min: [minX, minY, minZ],
        max: [maxX, maxY, maxZ],
      },
      {
        bufferView: 1,
        byteOffset: 0,
        componentType: 5126, // FLOAT
        count: numVertices,
        type: 'VEC3',
      },
      {
        bufferView: 2,
        byteOffset: 0,
        componentType: 5123, // UNSIGNED_SHORT
        count: numIndices,
        type: 'SCALAR',
      },
    ],
    bufferViews: [
      {
        buffer: 0,
        byteOffset: posOffset,
        byteLength: posBytes,
        target: 34962, // ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: normOffset,
        byteLength: normBytes,
        target: 34962, // ARRAY_BUFFER
      },
      {
        buffer: 0,
        byteOffset: idxOffset,
        byteLength: idxBytes,
        target: 34963, // ELEMENT_ARRAY_BUFFER
      },
    ],
    buffers: [
      {
        byteLength: totalBinLength,
      },
    ],
  };

  const jsonText = JSON.stringify(gltf);
  const encoder = new TextEncoder();
  const jsonRaw = encoder.encode(jsonText);
  const jsonPadding = (4 - (jsonRaw.length % 4)) % 4;
  const jsonChunkLength = jsonRaw.length + jsonPadding;

  const binPadding = (4 - (binBuffer.length % 4)) % 4;
  const binChunkLength = binBuffer.length + binPadding;

  // 12 bytes header + 8 bytes JSON chunk header + jsonChunkLength + 8 bytes BIN chunk header + binChunkLength
  const totalGlbLength = 12 + 8 + jsonChunkLength + 8 + binChunkLength;

  const glbBuffer = new Uint8Array(totalGlbLength);
  const dataView = new DataView(glbBuffer.buffer);

  // 1. GLB Header (12 bytes)
  dataView.setUint32(0, 0x46546c67, true); // Magic: "glTF"
  dataView.setUint32(4, 2, true);          // Version: 2
  dataView.setUint32(8, totalGlbLength, true); // Total file length

  // 2. JSON Chunk Header (8 bytes)
  let offset = 12;
  dataView.setUint32(offset, jsonChunkLength, true); // JSON chunk length
  dataView.setUint32(offset + 4, 0x4e4f534a, true); // Chunk type: "JSON"
  offset += 8;

  // JSON Chunk Payload
  glbBuffer.set(jsonRaw, offset);
  offset += jsonRaw.length;
  // Pad JSON with spaces (0x20)
  for (let i = 0; i < jsonPadding; i++) {
    glbBuffer[offset + i] = 0x20;
  }
  offset += jsonPadding;

  // 3. BIN Chunk Header (8 bytes)
  dataView.setUint32(offset, binChunkLength, true); // BIN chunk length
  dataView.setUint32(offset + 4, 0x004e4942, true); // Chunk type: "BIN\0"
  offset += 8;

  // BIN Chunk Payload
  glbBuffer.set(binBuffer, offset);
  offset += binBuffer.length;
  // Pad BIN with zeroes (0x00)
  for (let i = 0; i < binPadding; i++) {
    glbBuffer[offset + i] = 0x00;
  }

  return glbBuffer;
}

/**
 * Creates a browser Blob and Object URL from procedural mesh geometry
 */
export function createGlbBlobUrl(mesh: ProceduralMeshData): string {
  const glbBytes = exportGeometryToGlb(mesh);
  const blob = new Blob([glbBytes.buffer as ArrayBuffer], { type: 'model/gltf-binary' });
  return URL.createObjectURL(blob);
}
