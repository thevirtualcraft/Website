const ambientCanvas = document.querySelector("#ambient-canvas");
const xrCanvas = document.querySelector("#xr-canvas");
const statusDot = document.querySelector("#xr-status-dot");
const statusText = document.querySelector("#xr-status-text");
const xrNote = document.querySelector("#xr-note");
const arButton = document.querySelector("#enter-ar");
const vrButton = document.querySelector("#enter-vr");

const xrModes = {
  ar: "immersive-ar",
  vr: "immersive-vr",
};

let activeXrSession = null;
let xrReferenceSpace = null;
let xrGl = null;
let xrProgram = null;
let xrBuffer = null;

function fitCanvasToDisplay(canvas, context) {
  const pixelRatio = window.devicePixelRatio || 1;
  const width = Math.floor(canvas.clientWidth * pixelRatio);
  const height = Math.floor(canvas.clientHeight * pixelRatio);

  if (canvas.width !== width || canvas.height !== height) {
    canvas.width = width;
    canvas.height = height;
    context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
  }
}

function drawAmbientScene(time) {
  const context = ambientCanvas.getContext("2d");

  function frame(timestamp) {
    fitCanvasToDisplay(ambientCanvas, context);

    const width = ambientCanvas.clientWidth;
    const height = ambientCanvas.clientHeight;
    const gradient = context.createRadialGradient(
      width * 0.5,
      height * 0.2,
      20,
      width * 0.5,
      height * 0.45,
      Math.max(width, height) * 0.75,
    );

    gradient.addColorStop(0, "rgba(96, 239, 255, 0.2)");
    gradient.addColorStop(0.35, "rgba(124, 77, 255, 0.16)");
    gradient.addColorStop(1, "rgba(7, 11, 24, 0)");
    context.clearRect(0, 0, width, height);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);

    for (let index = 0; index < 42; index += 1) {
      const drift = timestamp * 0.00008;
      const x = ((index * 113 + drift * 700) % (width + 160)) - 80;
      const y = ((index * 59 + Math.sin(drift + index) * 36) % (height + 120)) - 60;
      const radius = 1.2 + (index % 4) * 0.45;

      context.beginPath();
      context.fillStyle = `rgba(180, 245, 255, ${0.1 + (index % 5) * 0.035})`;
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    }

    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame.bind(null, time));
}

function drawPreviewScene() {
  const context = xrCanvas.getContext("2d");

  function frame(timestamp) {
    fitCanvasToDisplay(xrCanvas, context);

    const width = xrCanvas.clientWidth;
    const height = xrCanvas.clientHeight;
    const centerX = width / 2;
    const centerY = height / 2;
    const rotation = timestamp * 0.0007;

    context.clearRect(0, 0, width, height);

    const background = context.createLinearGradient(0, 0, width, height);
    background.addColorStop(0, "#131b38");
    background.addColorStop(0.52, "#080d1f");
    background.addColorStop(1, "#1b1139");
    context.fillStyle = background;
    context.fillRect(0, 0, width, height);

    for (let ring = 0; ring < 5; ring += 1) {
      context.save();
      context.translate(centerX, centerY);
      context.rotate(rotation + ring * 0.42);
      context.strokeStyle = `rgba(96, 239, 255, ${0.16 - ring * 0.018})`;
      context.lineWidth = 1.5;
      context.strokeRect(
        -68 - ring * 18,
        -68 - ring * 18,
        136 + ring * 36,
        136 + ring * 36,
      );
      context.restore();
    }

    const orb = context.createRadialGradient(centerX, centerY, 8, centerX, centerY, 82);
    orb.addColorStop(0, "rgba(255, 255, 255, 0.95)");
    orb.addColorStop(0.28, "rgba(96, 239, 255, 0.78)");
    orb.addColorStop(1, "rgba(124, 77, 255, 0)");
    context.fillStyle = orb;
    context.beginPath();
    context.arc(centerX, centerY, 82, 0, Math.PI * 2);
    context.fill();

    const platformY = height * 0.72;
    context.strokeStyle = "rgba(255, 255, 255, 0.22)";
    context.lineWidth = 1;
    for (let row = 0; row < 7; row += 1) {
      const y = platformY + row * 14;
      context.beginPath();
      context.moveTo(width * 0.12, y);
      context.lineTo(width * 0.88, y);
      context.stroke();
    }

    window.requestAnimationFrame(frame);
  }

  window.requestAnimationFrame(frame);
}

function setSupportState({ arSupported, vrSupported }) {
  const supportedModes = [];

  if (arSupported) {
    supportedModes.push("AR");
    arButton.disabled = false;
  }

  if (vrSupported) {
    supportedModes.push("VR");
    vrButton.disabled = false;
  }

  if (supportedModes.length > 0) {
    statusDot.classList.add("is-supported");
    statusText.textContent = `WebXR ${supportedModes.join(" and ")} ready on this device.`;
    xrNote.textContent = "Choose a mode to request an immersive WebXR session.";
    return;
  }

  statusDot.classList.add("is-limited");
  statusText.textContent = "WebXR is not available in this browser.";
  xrNote.textContent = "You can still explore the visual showcase and open this page on a compatible headset or AR browser.";
}

async function detectWebXrSupport() {
  if (!window.isSecureContext) {
    statusDot.classList.add("is-limited");
    statusText.textContent = "WebXR needs HTTPS or localhost.";
    xrNote.textContent = "Publish this site over HTTPS to enable AR and VR session requests.";
    return;
  }

  if (!("xr" in navigator)) {
    setSupportState({ arSupported: false, vrSupported: false });
    return;
  }

  const [arSupported, vrSupported] = await Promise.all([
    navigator.xr.isSessionSupported(xrModes.ar).catch(() => false),
    navigator.xr.isSessionSupported(xrModes.vr).catch(() => false),
  ]);

  setSupportState({ arSupported, vrSupported });
}

async function requestXrSession(mode) {
  if (!("xr" in navigator) || activeXrSession) {
    return;
  }

  const sessionMode = xrModes[mode];
  let requestedSession = null;

  try {
    requestedSession = await navigator.xr.requestSession(sessionMode, {
      optionalFeatures: ["local-floor", "bounded-floor", "hand-tracking"],
    });

    await prepareXrRenderer(requestedSession);

    const preferredSpace = mode === "vr" ? "local-floor" : "local";
    xrReferenceSpace = await requestedSession.requestReferenceSpace(preferredSpace).catch(() => (
      requestedSession.requestReferenceSpace("local")
    ));

    activeXrSession = requestedSession;
    statusText.textContent = `${mode.toUpperCase()} session active.`;
    xrNote.textContent = "Use your device controls to exit the immersive session.";
    requestedSession.requestAnimationFrame(drawXrFrame);

    requestedSession.addEventListener("end", () => {
      activeXrSession = null;
      xrReferenceSpace = null;
      statusText.textContent = "WebXR session ended.";
      xrNote.textContent = "Choose a mode to launch the showcase again.";
    });
  } catch (error) {
    if (requestedSession) {
      requestedSession.end().catch(() => undefined);
      activeXrSession = null;
      xrReferenceSpace = null;
    }

    statusText.textContent = `Unable to start ${mode.toUpperCase()} right now.`;
    xrNote.textContent = error instanceof Error ? error.message : "The browser blocked the WebXR session request.";
  }
}

function createShader(gl, type, source) {
  const shader = gl.createShader(type);

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) || "Unable to compile WebXR shader.";
    gl.deleteShader(shader);
    throw new Error(message);
  }

  return shader;
}

function createXrProgram(gl) {
  const vertexShader = createShader(gl, gl.VERTEX_SHADER, `
    attribute vec2 position;
    attribute vec3 color;
    varying vec3 fragmentColor;
    uniform float rotation;

    void main() {
      float wave = sin(rotation + position.x * 3.0) * 0.08;
      mat2 spin = mat2(cos(rotation), -sin(rotation), sin(rotation), cos(rotation));
      vec2 moved = spin * vec2(position.x, position.y + wave);

      fragmentColor = color;
      gl_Position = vec4(moved * 0.58, -0.72, 1.0);
    }
  `);
  const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, `
    precision mediump float;
    varying vec3 fragmentColor;

    void main() {
      gl_FragColor = vec4(fragmentColor, 0.92);
    }
  `);
  const program = gl.createProgram();

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) || "Unable to link WebXR program.";
    gl.deleteProgram(program);
    throw new Error(message);
  }

  return program;
}

async function prepareXrRenderer(session) {
  const canvas = document.createElement("canvas");
  const gl = canvas.getContext("webgl", {
    alpha: true,
    antialias: true,
    xrCompatible: true,
  });

  if (!gl) {
    throw new Error("This device does not expose a WebGL context for WebXR rendering.");
  }

  await gl.makeXRCompatible();

  xrGl = gl;
  xrProgram = createXrProgram(gl);
  xrBuffer = gl.createBuffer();

  gl.bindBuffer(gl.ARRAY_BUFFER, xrBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([
      0, 0.78, 0.38, 0.96, 1,
      -0.72, -0.52, 0.55, 0.36, 1,
      0.72, -0.52, 1, 0.36, 0.76,
      0, -0.82, 0.38, 0.96, 1,
      -0.72, 0.48, 0.55, 0.36, 1,
      0.72, 0.48, 1, 0.36, 0.76,
    ]),
    gl.STATIC_DRAW,
  );

  session.updateRenderState({
    baseLayer: new XRWebGLLayer(session, gl),
  });
}

function drawXrFrame(timestamp, frame) {
  const session = frame.session;
  const pose = frame.getViewerPose(xrReferenceSpace);

  session.requestAnimationFrame(drawXrFrame);

  if (!pose || !xrGl || !xrProgram) {
    return;
  }

  const layer = session.renderState.baseLayer;

  xrGl.bindFramebuffer(xrGl.FRAMEBUFFER, layer.framebuffer);
  xrGl.clearColor(0.02, 0.04, 0.09, 0.78);
  xrGl.clear(xrGl.COLOR_BUFFER_BIT | xrGl.DEPTH_BUFFER_BIT);
  xrGl.useProgram(xrProgram);
  xrGl.bindBuffer(xrGl.ARRAY_BUFFER, xrBuffer);

  const stride = 5 * Float32Array.BYTES_PER_ELEMENT;
  const positionLocation = xrGl.getAttribLocation(xrProgram, "position");
  const colorLocation = xrGl.getAttribLocation(xrProgram, "color");
  const rotationLocation = xrGl.getUniformLocation(xrProgram, "rotation");

  xrGl.enableVertexAttribArray(positionLocation);
  xrGl.vertexAttribPointer(positionLocation, 2, xrGl.FLOAT, false, stride, 0);
  xrGl.enableVertexAttribArray(colorLocation);
  xrGl.vertexAttribPointer(
    colorLocation,
    3,
    xrGl.FLOAT,
    false,
    stride,
    2 * Float32Array.BYTES_PER_ELEMENT,
  );
  xrGl.uniform1f(rotationLocation, timestamp * 0.001);

  for (const view of pose.views) {
    const viewport = layer.getViewport(view);

    xrGl.viewport(viewport.x, viewport.y, viewport.width, viewport.height);
    xrGl.drawArrays(xrGl.TRIANGLES, 0, 6);
  }
}

drawAmbientScene(0);
drawPreviewScene();
detectWebXrSupport();

arButton.addEventListener("click", () => requestXrSession("ar"));
vrButton.addEventListener("click", () => requestXrSession("vr"));
