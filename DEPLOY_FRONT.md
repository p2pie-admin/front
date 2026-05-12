# Front Deploy Context

This file is the short operational context for building the frontend on the deploy server.

## Local workflow

1. Make and commit the frontend changes in this repository.
2. If needed, push the branch to GitHub.
3. Do not open a PR unless explicitly requested.

## Remote server

- Host: `172.16.12.91`
- User: `root`
- Real git checkout on the server: `/root/front.deploy.tmp`
- The `/root/front` directory is not the git checkout used for deploy.

## Build procedure on the server

Use the following sequence:

1. `cd /root/front.deploy.tmp`
2. `git pull --ff-only origin main`
3. Build with Docker:

```bash
DOCKER_BUILDKIT=0 docker build -t front:main .
```

## Why Docker

- The server does not have `node` or `yarn` installed directly.
- The project build depends on the repository `Dockerfile`, which installs dependencies with `corepack` and `yarn` inside the container.
- In practice, the legacy Docker builder (`DOCKER_BUILDKIT=0`) completed successfully on this server.

## What the build does

- Runs the repo `Dockerfile`
- Installs dependencies
- Executes `yarn build`
- Runs `next-sitemap`
- Produces the image `front:main`

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

- The build can emit CMS/Strapi warnings if runtime env vars are not present on the build host. That did not block the image build.
- If the server build path changes, update this file first so the next deploy does not require a fresh investigation.
