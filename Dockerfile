FROM caddy:2.10-alpine
COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html 404.html robots.txt sitemap.xml site.webmanifest favicon.svg favicon-32.png apple-touch-icon.png icon-192.png icon-512.png /srv/
COPY projetos /srv/projetos
COPY assets /srv/assets
