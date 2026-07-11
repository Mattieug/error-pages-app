const express = require('express');
const app = express();

const messages = {
  400: "Requête invalide",
  404: "Cette page n'existe pas",
  502: "Le service est temporairement injoignable",
  503: "Service en maintenance",
  521: "Le serveur d'origine est hors ligne",
  1033: "Le tunnel Cloudflare est déconnecté",
};

app.get('/error', (req, res) => {
  const code = req.query.code || '500';
  const ip = req.query.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const host = req.query.host || req.headers['host'];
  res.status(Number.isInteger(+code) ? +code : 500).send(renderPage(code, ip, host));
});

function renderPage(code, ip, host) {
  const msg = messages[code] || "Une erreur est survenue";
  return `<!DOCTYPE html>
<html lang="fr"><head><meta charset="UTF-8"><title>Erreur ${code}</title>
<style>
body { font-family: system-ui, sans-serif; background: #0f172a; color: #e2e8f0;
       display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; }
.card { background: #1e293b; padding: 2.5rem 3rem; border-radius: 12px; text-align: center; max-width: 480px; }
.code { font-size: 4rem; font-weight: 700; color: #f87171; margin: 0; }
.msg { font-size: 1.2rem; margin: 0.5rem 0 1.5rem; }
.meta { font-size: 0.85rem; color: #94a3b8; border-top: 1px solid #334155; padding-top: 1rem; }
</style></head>
<body><div class="card">
  <p class="code">${code}</p>
  <p class="msg">${msg}</p>
  <div class="meta">Hôte demandé : ${host}<br>Votre IP : ${ip}<br>${new Date().toLocaleString('fr-FR')}</div>
</div></body></html>`;
}

app.listen(3000, '0.0.0.0');
