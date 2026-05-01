import { createImmersiveScene } from "./webxr/immersiveScene";
import { createVrEntryButton } from "./webxr/vrEntryButton";

function iconVr(): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M9 11a3 3 0 11-6 0 3 3 0 016 0zm12 0a3 3 0 11-6 0 3 3 0 016 0zM3 11V9a4 4 0 014-4h10a4 4 0 014 4v2M3 11v1a4 4 0 004 4h1m-5-5h.01M21 11v1a4 4 0 01-4 4h-1m4-5h.01"/></svg>`;
}

export function mountApp(root: HTMLElement): void {
  root.innerHTML = `
    <canvas id="xr-canvas" aria-hidden="true"></canvas>
    <div class="site-wrap">
      <div class="site-inner">
        <header class="site-header">
          <a class="logo" href="#">The Virtual <span>Craft</span></a>
          <nav class="nav" aria-label="Primary">
            <a href="#immersive">WebXR</a>
            <a href="#showcase">Showcase</a>
            <a href="#about">About</a>
          </nav>
        </header>

        <section class="hero" aria-labelledby="hero-heading">
          <p class="hero-badge"><span class="pulse" aria-hidden="true"></span> Immersive web</p>
          <h1 id="hero-heading">Spatial stories that surround you</h1>
          <p class="hero-lead">
            We design and ship immersive experiences—virtual showcases, interactive worlds,
            and WebXR-native content that runs in the browser with no install required.
          </p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="#immersive">${iconVr()} Enter the demo</a>
            <a class="btn btn-ghost" href="#showcase">View capabilities</a>
          </div>
          <dl class="hero-meta">
            <div>
              <dt>Pipeline</dt>
              <dd>GLTF · WebXR · Real-time 3D</dd>
            </div>
            <div>
              <dt>Focus</dt>
              <dd>Showrooms · Training · Art</dd>
            </div>
          </dl>
        </section>

        <section id="about" class="section" aria-labelledby="about-heading">
          <div class="section-head">
            <p class="section-label">Why immersive</p>
            <h2 id="about-heading">Built for presence, not flat frames</h2>
            <p class="section-desc">
              The Virtual Craft partners with teams who need audiences to feel scale, depth,
              and emotion—whether in VR headsets or on desktop with a living 3D canvas behind every scroll.
            </p>
          </div>
          <div class="grid-3">
            <article class="card">
              <div class="card-icon" aria-hidden="true">◈</div>
              <h3>Spatial storytelling</h3>
              <p>Guided journeys through branded environments, narrative beats, and interactive hotspots.</p>
            </article>
            <article class="card">
              <div class="card-icon" aria-hidden="true">◎</div>
              <h3>Product &amp; venue XR</h3>
              <p>Configurable spaces for launches, configurators, and remote walkthroughs that feel tangible.</p>
            </article>
            <article class="card">
              <div class="card-icon" aria-hidden="true">✦</div>
              <h3>Web-first delivery</h3>
              <p>Reach users on Meta Quest, Pico, and desktop browsers from one deployment surface.</p>
            </article>
          </div>
        </section>

        <section id="immersive" class="section" aria-labelledby="xr-heading">
          <div class="xr-panel">
            <div class="xr-panel-inner">
              <p class="section-label">WebXR demo</p>
              <h2 id="xr-heading">Step inside the showcase</h2>
              <p>
                Use a VR headset with a Chromium-based browser (Quest Browser, Chrome) for the full experience.
                On desktop you still get a live real-time scene—your gateway to immersive builds.
              </p>
              <div class="xr-actions" id="xr-button-mount"></div>
              <p class="xr-hint" id="xr-hint">
                Tip: serve over <code>https://</code> for WebXR. Local development with Vite uses secure contexts when configured.
              </p>
              <p class="xr-status" id="xr-status" role="status"></p>
            </div>
            <div class="xr-preview" aria-hidden="true">
              <div class="xr-preview-ring"><span aria-hidden="true">🥽</span></div>
              <p class="xr-preview-caption">Live scene synced with the canvas behind this page</p>
            </div>
          </div>
        </section>

        <section id="showcase" class="section" aria-labelledby="showcase-heading">
          <div class="section-head">
            <p class="section-label">Capabilities</p>
            <h2 id="showcase-heading">What we showcase</h2>
            <p class="section-desc">
              From ambient exhibition halls to tight product narratives—each experience is tuned for the device in hand.
            </p>
          </div>
          <div class="grid-3">
            <article class="card">
              <div class="card-icon" aria-hidden="true">◇</div>
              <h3>Brand worlds</h3>
              <p>Ownable 3D spaces that mirror your visual language and motion design.</p>
            </article>
            <article class="card">
              <div class="card-icon" aria-hidden="true">⬡</div>
              <h3>Interactive media</h3>
              <p>Spatial audio, video planes, and triggers that respond to gaze and controllers.</p>
            </article>
            <article class="card">
              <div class="card-icon" aria-hidden="true">⎔</div>
              <h3>Analytics-ready</h3>
              <p>Structure scenes for measurement—sessions, engagement paths, and conversion events.</p>
            </article>
          </div>
        </section>

        <footer class="site-footer">
          <div class="footer-row">
            <div>
              <p class="logo">The Virtual <span>Craft</span></p>
              <p class="footer-copy">© ${new Date().getFullYear()} The Virtual Craft. Immersive content for the open web.</p>
            </div>
            <div class="footer-links">
              <a href="mailto:hello@thevirtualcraft.com">hello@thevirtualcraft.com</a>
              <a href="#immersive">WebXR</a>
            </div>
          </div>
        </footer>
      </div>
    </div>
  `;

  const canvas = document.querySelector<HTMLCanvasElement>("#xr-canvas");
  const mount = document.querySelector<HTMLElement>("#xr-button-mount");
  const statusEl = document.querySelector<HTMLElement>("#xr-status");

  if (!canvas || !mount) {
    return;
  }

  const { renderer, dispose } = createImmersiveScene(canvas);
  const vrWrap = createVrEntryButton(renderer);
  const vrBtn = vrWrap.querySelector("button, a");
  vrBtn?.setAttribute("aria-describedby", "xr-hint");
  mount.appendChild(vrWrap);

  function setXRStatus(): void {
    if (!statusEl) return;
    const xr = navigator.xr;
    if (!xr) {
      statusEl.textContent = "WebXR is not available in this browser.";
      statusEl.className = "xr-status blocked";
      return;
    }
    void xr.isSessionSupported("immersive-vr").then((supported) => {
      if (supported) {
        statusEl.textContent = "VR session supported — use Enter VR when ready.";
        statusEl.className = "xr-status ready";
      } else {
        statusEl.textContent =
          "VR not supported here (try Quest Browser or Chrome with a headset). Desktop preview remains active.";
        statusEl.className = "xr-status blocked";
      }
    }).catch(() => {
      statusEl.textContent = "Could not query WebXR support.";
      statusEl.className = "xr-status error";
    });
  }
  setXRStatus();

  renderer.xr.addEventListener("sessionstart", () => {
    if (statusEl) {
      statusEl.textContent = "Session active — look around and use your controllers.";
      statusEl.className = "xr-status ready";
    }
  });
  renderer.xr.addEventListener("sessionend", () => {
    setXRStatus();
  });

  window.addEventListener("beforeunload", () => {
    dispose();
  });
}
