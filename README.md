# The Virtual Craft Website

A modern static landing page for thevirtualcraft.com focused on immersive
content, WebXR showcases, AR previews, and VR experiences.

## Local preview

Serve the repository root with any static server:

```sh
python3 -m http.server 4173
```

Then open `http://localhost:4173`.

WebXR session launches require a secure context, so they are available on
`localhost` during development or HTTPS in production.
