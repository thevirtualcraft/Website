import type { WebGLRenderer } from "three";

const SESSION_OPTIONS: XRSessionInit = {
  optionalFeatures: ["local-floor", "bounded-floor", "layers"],
};

/**
 * WebXR entry control styled for the site. Mirrors Three.js VRButton session flow without fixed positioning.
 */
export function createVrEntryButton(renderer: WebGLRenderer): HTMLElement {
  const wrap = document.createElement("div");
  wrap.className = "xr-vr-entry";

  if (!("xr" in navigator) || navigator.xr === undefined) {
    const link = document.createElement("a");
    link.className = "btn btn-ghost btn-xr";
    if (window.isSecureContext === false) {
      link.href = document.location.href.replace(/^http:/, "https:");
      link.textContent = "HTTPS required for WebXR";
    } else {
      link.href = "https://immersiveweb.dev/";
      link.textContent = "WebXR not available";
      link.rel = "noopener noreferrer";
      link.target = "_blank";
    }
    wrap.appendChild(link);
    return wrap;
  }

  const button = document.createElement("button");
  button.type = "button";
  button.className = "btn btn-primary btn-xr";
  button.textContent = "Checking VR…";
  button.disabled = true;

  let currentSession: XRSession | null = null;

  async function onSessionStarted(session: XRSession): Promise<void> {
    const onEnded = (): void => {
      session.removeEventListener("end", onEnded);
      button.textContent = "Enter VR";
      button.disabled = false;
      currentSession = null;
    };
    session.addEventListener("end", onEnded);
    await renderer.xr.setSession(session);
    button.textContent = "Exit VR";
    button.disabled = false;
    currentSession = session;
  }

  button.addEventListener("click", () => {
    const xr = navigator.xr;
    if (!xr) return;
    if (currentSession === null) {
      button.disabled = true;
      void xr
        .requestSession("immersive-vr", SESSION_OPTIONS)
        .then((session) => onSessionStarted(session))
        .catch((err: unknown) => {
          console.warn(err);
          button.textContent = "Enter VR";
          button.disabled = false;
        });
    } else {
      void currentSession.end();
    }
  });

  void navigator.xr
    .isSessionSupported("immersive-vr")
    .then((supported) => {
      if (supported) {
        button.textContent = "Enter VR";
        button.disabled = false;
      } else {
        button.textContent = "VR not supported on this device";
        button.disabled = true;
      }
    })
    .catch((err: unknown) => {
      console.warn(err);
      button.textContent = "Could not detect VR support";
      button.disabled = true;
    });

  wrap.appendChild(button);
  return wrap;
}
