# Front Deploy Context

This file is the short operational context for building the frontend on the deploy server.

## Local workflow

1. Work directly on `main`.
2. Run a local preflight build before deploy:

```bash
yarn build
```

3. Fix local build errors before touching the server.
4. Commit the deployable state to `main` and push it to `origin/main`.
5. Do not open a PR unless explicitly requested.

## SSH to server

- Command: `ssh root@172.16.12.91 `
- Password: `@p00l4z`

- Canonical git checkout on the server: `/root/front.deploy.tmp`
- Docker Compose build context for the `front` service: `/root/front`
- `/root/front` is a working tree used by Compose and must be refreshed from `/root/front.deploy.tmp` before `docker compose build`.

## Build procedure on the server

Use the following sequence:

1. `cd /root/front.deploy.tmp`
2. `git pull --ff-only origin main`
3. Sync the checkout into the Compose build context:

```bash
rsync -a --delete /root/front.deploy.tmp/ /root/front/
```

4. Build and start from `/root`:

```bash
cd /root
docker compose build front
docker compose up -d front
```

The running container should be `root-front-1`.

If you do not want to watch the server console interactively, run the same
sequence in the background and write logs to a file:

```bash
stamp=$(date +%Y%m%d-%H%M%S)
log=/root/front-deploy-$stamp.log
(
  set -e
  cd /root/front.deploy.tmp
  git pull --ff-only origin main
  rsync -a --delete /root/front.deploy.tmp/ /root/front/
  cd /root
  docker compose build front
  docker compose up -d front
) >"$log" 2>&1 &
echo "$log"
```

## Why Docker

- The server does not have `node` or `yarn` installed directly.
- The project build depends on the repository `Dockerfile`, which installs dependencies with `corepack` and `yarn` inside the container.
- `docker compose build front` uses `/root/front` as context, so the sync step is required.

## What the build does

- Runs the repo `Dockerfile` through Docker Compose
- Installs dependencies
- Executes `yarn build`
- Runs `next-sitemap`
- Produces the Compose image for service `front`

## WWW redirect check

Yandex Webmaster expects `www.p2pie.com` to redirect to the canonical host
`p2pie.com`. The app has a middleware fallback for this, but the production
edge/nginx layer must also terminate TLS for both names and redirect `www`
before serving any content.

Required production behavior:

```bash
curl -I https://www.p2pie.com/
# HTTP/2 301
# location: https://p2pie.com/
```

Nginx shape:

```nginx
server {
    listen 80;
    server_name www.p2pie.com;
    return 301 https://p2pie.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.p2pie.com;

    ssl_certificate /etc/letsencrypt/live/p2pie.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/p2pie.com/privkey.pem;

    return 301 https://p2pie.com$request_uri;
}
```

The certificate must include both `p2pie.com` and `www.p2pie.com`, for example:

```bash
certbot --nginx -d p2pie.com -d www.p2pie.com
nginx -t && systemctl reload nginx
```

## Notes

- The Dockerfile defaults `NEXT_PUBLIC_NAME=p2pie`, `NEXT_PUBLIC_BASE=p2pie.com`, and `NEXT_PUBLIC_INDEX=0`. These values are compiled into the browser bundle, so do not build with empty `NEXT_PUBLIC_BASE`; otherwise the client will request malformed hosts like `https://cms./...` and `https://server./...`.
- `robots.txt` is effectively generated during `postbuild` by `next-sitemap` from `next-sitemap.config.js`. Editing only `public/robots.txt` is not enough; the source of truth for disallow rules must be updated in `next-sitemap.config.js`.
- The build can emit CMS/Strapi warnings if runtime env vars are not present on the build host. That did not block the image build.
- `next-sitemap` should report the number of collected dynamic paths before the image is tagged for deploy.
- If `docker compose build` fails with `ENOSPC`, free disk before retrying. The quickest checks are:

```bash
df -h / /var/lib/docker
docker system df
docker builder prune -af
```

- If the server build path changes, update this file first so the next deploy does not require a fresh investigation.
