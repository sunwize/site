<script setup lang="ts">
const canvas = useTemplateRef<HTMLCanvasElement>("canvas");
const isFallbackVisible = ref(false);

const size = 180;
const renderScale = 4;
const imageSrc = "/images/portrait.jpg";
const imageAlt = "Portrait de Colin Clisson";
let cleanup: (() => void) | null = null;

const vertexShaderSource = `
precision mediump float;

attribute vec2 a_position;
attribute vec2 a_texCoord;

uniform float u_mouseActive;
uniform float u_mouseActivation;
uniform vec2 u_laggedMouse;
uniform float u_time;

varying vec2 v_texCoord;

void main() {
  vec2 position = a_position;

  if (u_mouseActive > 0.5) {
    vec2 mousePosition = vec2(
      (u_laggedMouse.x - 0.5) * 2.0,
      (0.5 - u_laggedMouse.y) * 2.0
    );

    float distanceToMouse = length(position - mousePosition);
    float displacementRadius = 1.0;
    float displacementStrength = 0.03;
    float influence = 0.5 / (1.0 + distanceToMouse * distanceToMouse * 2.0);
    float radiusFalloff = 1.0 - smoothstep(displacementRadius * 0.6, displacementRadius, distanceToMouse);
    float edgeDistanceX = min(abs(position.x), 1.0 - abs(position.x));
    float edgeDistanceY = min(abs(position.y), 1.0 - abs(position.y));
    float edgeDistance = min(edgeDistanceX, edgeDistanceY);
    float edgeFalloff = edgeDistance > 0.05 ? smoothstep(0.05, 0.2, edgeDistance) : 0.0;
    influence = influence * displacementStrength * radiusFalloff * edgeFalloff * u_mouseActivation;

    if (influence > 0.001) {
      vec2 pushDirection = distanceToMouse > 0.01
        ? normalize(position - mousePosition)
        : vec2(0.0);
      float pulse = sin(u_time * 3.0 + distanceToMouse * 10.0) * 0.1 + 1.0;
      position += pushDirection * influence * pulse;
    }
  }

  gl_Position = vec4(position, 0.0, 1.0);
  v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouseVelocity;
uniform float u_mouseActive;
uniform vec2 u_laggedMouse;

varying vec2 v_texCoord;

float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
  vec2 pixelCoord = v_texCoord * u_resolution;
  float dotSize = 3.35;
  float spacing = 4.35;
  vec2 gridCount = floor(u_resolution / spacing);
  vec2 gridOffset = (u_resolution - gridCount * spacing) * 0.5;
  vec2 adjustedCoord = pixelCoord - gridOffset;
  vec2 gridPos = floor(adjustedCoord / spacing) * spacing + spacing * 0.5;
  vec2 gridUv = (gridPos + gridOffset) / u_resolution;

  if (gridUv.x < 0.0 || gridUv.x > 1.0 || gridUv.y < 0.0 || gridUv.y > 1.0) {
    discard;
  }

  vec4 sourceColor = texture2D(u_texture, gridUv);
  float brightness = dot(sourceColor.rgb, vec3(0.299, 0.587, 0.114));
  float baseDotSize = dotSize * smoothstep(0.08, 0.92, 1.0 - brightness);
  float distanceToDot = length(adjustedCoord - gridPos);
  float circle = 1.0 - smoothstep(baseDotSize - 0.45, baseDotSize + 0.45, distanceToDot);

  vec2 gridCoord = floor((gridPos + gridOffset) / spacing);
  float distanceFromEdge = min(
    min(pixelCoord.x, u_resolution.x - pixelCoord.x),
    min(pixelCoord.y, u_resolution.y - pixelCoord.y)
  );
  float fadeZone = random(gridCoord + vec2(123.45, 678.90)) * u_resolution.y * 0.18;
  float edgeFactor = clamp(distanceFromEdge / max(fadeZone, 1.0), 0.0, 1.0);
  float showProbability = edgeFactor * 0.82 + 0.18;

  if (random(gridCoord) > showProbability) {
    circle = 0.0;
  }

  vec2 dotCenter = gridPos + gridOffset;
  vec2 mousePixel = u_laggedMouse * u_resolution;
  float mouseDistance = length(dotCenter - mousePixel);
  float velocity = length(u_mouseVelocity);
  float baseRadius = 400.0;
  float velocityRadius = velocity * 20.0;
  float influenceRadius = baseRadius + velocityRadius;
  float mouseInfluence = 0.0;

  if (u_mouseActive > 0.5 && mouseDistance < influenceRadius) {
    mouseInfluence = 0.75 - mouseDistance / influenceRadius;
  }

  float mouseHideNoise = random(gridCoord + vec2(9.87, 6.54));
  float recoverySeed = random(gridCoord + vec2(2.34, 7.89));
  float recoveryTime = 0.1 + recoverySeed * 1.0;
  float recovery = sin(u_time / recoveryTime + recoverySeed * 6.28) * 0.5 + 0.5;
  float mouseFade = 1.0;

  if (mouseHideNoise < 0.5) {
    float sizeFactor = baseDotSize / dotSize;
    float fadeDuration = 0.5 + sizeFactor * 1.0;
    float fadeSpeed = mouseInfluence * 3.0;
    float fadeProgress = clamp(fadeSpeed - recovery * 2.0, 0.0, 1.0);
    mouseFade = 1.0 - smoothstep(0.0, fadeDuration, fadeProgress * fadeDuration);
  }

  circle *= mouseFade;

  float sizeDelay = baseDotSize / dotSize * 1.15;
  float randomDelay = random(gridCoord + vec2(456.78, 901.23)) * 0.75;
  float fadeIn = smoothstep(sizeDelay + randomDelay, sizeDelay + randomDelay + 0.16, u_time);
  circle *= fadeIn;

  gl_FragColor = vec4(vec3(0.0), circle);
}
`;

function createShader(gl: WebGLRenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);

  if (!shader) {
    return null;
  }

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function createProgram(gl: WebGLRenderingContext) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(
    gl,
    gl.FRAGMENT_SHADER,
    fragmentShaderSource
  );

  if (!vertexShader || !fragmentShader) {
    return null;
  }

  const program = gl.createProgram();

  if (!program) {
    return null;
  }

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    gl.deleteProgram(program);
    return null;
  }

  return program;
}

function loadTexture(gl: WebGLRenderingContext, src: string) {
  const texture = gl.createTexture();

  if (!texture) {
    return null;
  }

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    1,
    1,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    new Uint8Array([255, 255, 255, 0])
  );

  const image = new Image();
  image.addEventListener("load", () => {
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  });
  image.addEventListener("error", () => {
    isFallbackVisible.value = true;
  });
  image.src = src;

  return texture;
}

onUnmounted(() => {
  cleanup?.();
});

onMounted(async () => {
  await nextTick();

  const element = canvas.value;

  if (!element) {
    return;
  }

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    isFallbackVisible.value = true;
    return;
  }

  const gl = element.getContext("webgl", {
    alpha: true,
    antialias: false,
    premultipliedAlpha: false,
  });

  if (!gl) {
    isFallbackVisible.value = true;
    return;
  }

  // Keep the shader grid and supersampling identical across display densities.
  element.width = size * renderScale;
  element.height = size * renderScale;

  const program = createProgram(gl);
  const texture = loadTexture(gl, imageSrc);

  if (!program || !texture) {
    isFallbackVisible.value = true;
    return;
  }

  const positionLocation = gl.getAttribLocation(program, "a_position");
  const texCoordLocation = gl.getAttribLocation(program, "a_texCoord");
  const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
  const timeLocation = gl.getUniformLocation(program, "u_time");
  const textureLocation = gl.getUniformLocation(program, "u_texture");
  const mouseVelocityLocation = gl.getUniformLocation(
    program,
    "u_mouseVelocity"
  );
  const mouseActiveLocation = gl.getUniformLocation(program, "u_mouseActive");
  const mouseActivationLocation = gl.getUniformLocation(
    program,
    "u_mouseActivation"
  );
  const laggedMouseLocation = gl.getUniformLocation(program, "u_laggedMouse");

  const positions: number[] = [];
  const texCoords: number[] = [];
  const indices: number[] = [];
  const divisions = 50;

  for (let y = 0; y <= divisions; y += 1) {
    for (let x = 0; x <= divisions; x += 1) {
      positions.push((x / divisions) * 2 - 1, (y / divisions) * 2 - 1);
      texCoords.push(x / divisions, 1 - y / divisions);
    }
  }

  for (let y = 0; y < divisions; y += 1) {
    for (let x = 0; x < divisions; x += 1) {
      const topLeft = y * (divisions + 1) + x;
      indices.push(topLeft, topLeft + 1, topLeft + divisions + 1);
      indices.push(
        topLeft + 1,
        topLeft + divisions + 2,
        topLeft + divisions + 1
      );
    }
  }

  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  const texCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(texCoords), gl.STATIC_DRAW);

  const indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(indices),
    gl.STATIC_DRAW
  );

  const mouse = { x: 0.5, y: 0.5 };
  const laggedMouse = { x: 0.5, y: 0.5 };
  const velocity = { x: 0, y: 0 };
  let mouseActive = 0;
  let mouseActivation = 0;
  let lastTime = performance.now();
  let animationFrame = 0;

  const handlePointerMove = (event: PointerEvent) => {
    const rect = element.getBoundingClientRect();
    const nextMouse = {
      x: (event.clientX - rect.left) / rect.width,
      y: (event.clientY - rect.top) / rect.height,
    };
    const now = performance.now();
    const delta = Math.max(now - lastTime, 1);

    velocity.x = velocity.x * 0.9 + ((nextMouse.x - mouse.x) / delta) * 100;
    velocity.y = velocity.y * 0.9 + ((nextMouse.y - mouse.y) / delta) * 100;

    if (mouseActive === 0) {
      laggedMouse.x = nextMouse.x;
      laggedMouse.y = nextMouse.y;
    }

    mouse.x = nextMouse.x;
    mouse.y = nextMouse.y;
    mouseActive = 1;
    lastTime = now;
  };

  const handlePointerLeave = () => {
    mouse.x = 0.5;
    mouse.y = 0.5;
    velocity.x = 0;
    velocity.y = 0;
    mouseActive = 0;
  };

  const render = (time: number) => {
    laggedMouse.x += (mouse.x - laggedMouse.x) * 0.15;
    laggedMouse.y += (mouse.y - laggedMouse.y) * 0.15;
    mouseActivation += (mouseActive - mouseActivation) * 0.06;

    gl.viewport(0, 0, element.width, element.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.useProgram(program);

    gl.enableVertexAttribArray(positionLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

    gl.enableVertexAttribArray(texCoordLocation);
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.vertexAttribPointer(texCoordLocation, 2, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.uniform2f(resolutionLocation, element.width, element.height);
    gl.uniform1f(timeLocation, time * 0.001);
    gl.uniform2f(mouseVelocityLocation, velocity.x, velocity.y);
    gl.uniform1f(mouseActiveLocation, mouseActive);
    gl.uniform1f(mouseActivationLocation, mouseActivation);
    gl.uniform2f(laggedMouseLocation, laggedMouse.x, laggedMouse.y);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.uniform1i(textureLocation, 0);
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);

    animationFrame = requestAnimationFrame(render);
  };

  element.addEventListener("pointermove", handlePointerMove);
  element.addEventListener("pointerleave", handlePointerLeave);
  animationFrame = requestAnimationFrame(render);

  cleanup = () => {
    cancelAnimationFrame(animationFrame);
    element.removeEventListener("pointermove", handlePointerMove);
    element.removeEventListener("pointerleave", handlePointerLeave);
    gl.deleteBuffer(positionBuffer);
    gl.deleteBuffer(texCoordBuffer);
    gl.deleteBuffer(indexBuffer);
    gl.deleteTexture(texture);
    gl.deleteProgram(program);
    cleanup = null;
  };
});
</script>

<template>
  <figure class="relative size-[180px]">
    <canvas
      ref="canvas"
      aria-hidden="true"
      class="block size-[180px]"
      :class="{ invisible: isFallbackVisible }"
      width="180"
      height="180"
    />
    <img
      class="absolute inset-0 size-[180px] object-cover grayscale"
      :class="{ invisible: !isFallbackVisible }"
      :src="imageSrc"
      alt=""
      aria-hidden="true"
      width="180"
      height="180"
    />
    <figcaption class="sr-only">{{ imageAlt }}</figcaption>
  </figure>
</template>
