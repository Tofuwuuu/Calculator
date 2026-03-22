# Calculator

A basic calculator built with plain HTML, CSS, and JavaScript. No build step: open the files or deploy the folder as a static site.

## Run locally

- **Direct:** open `index.html` in your browser (double-click or drag into a window).
- **Static server (optional):** from this directory run any static server, for example `npx serve .`, then visit the URL it prints.

## Deploy on Render

1. Push this repository to GitHub, GitLab, or Bitbucket.
2. In the [Render](https://render.com) dashboard, choose **New +** → **Static Site**.
3. Connect the repository and select the branch to deploy.
4. Use these settings:
   - **Build command:** leave empty.
   - **Publish directory:** `.` (repository root, where `index.html` lives).

Render serves the site over HTTPS on a `*.onrender.com` URL and redeploys when you push.

### Blueprint (`render.yaml`)

This repo includes [`render.yaml`](render.yaml) so you can create the same static site with **New +** → **Blueprint**: connect the repo and apply the blueprint. You can change the `name` field if you want a different service name.

## Features

- Arithmetic: add, subtract, multiply, divide
- Clear (`C`), backspace (`⌫`), decimal point
- Division by zero shows `Error` and resets on the next input
- Keyboard: digits, `.`, `+`, `-`, `*`, `/`, `=`, `Enter` (equals), `Escape` (clear), `Backspace`
