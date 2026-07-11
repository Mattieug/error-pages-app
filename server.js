const express = require('express');
const app = express();

// URL de l'image de fond — modifiable via variable d'environnement dans Coolify
const BG_IMAGE_URL = process.env.BG_IMAGE_URL || '';

const messages = {
  400: ["Requête invalide", "Le serveur n'a pas compris votre requête."],
  404: ["Cette page n'existe pas", "La ressource demandée est introuvable ou a été déplacée."],
  502: ["Service temporairement injoignable", "Le service en amont ne répond pas correctement."],
  503: ["Service en maintenance", "Le service est momentanément indisponible, réessayez plus tard."],
  521: ["Serveur d'origine hors ligne", "Le serveur qui héberge ce service est actuellement injoignable."],
  1033: ["Tunnel Cloudflare déconnecté", "La liaison entre Cloudflare et le serveur d'origine est coupée."],
};

app.get('/error', (req, res) => {
  const code = req.query.code || '500';
  const ip = req.query.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  const host = req.query.host || req.headers['host'] || 'inconnu';
  const numericCode = Number.isInteger(+code) ? +code : 500;

  res.status(numericCode).send(renderPage(code, ip, host));
});

function renderPage(code, ip, host) {
  const [msg, explanation] = messages[code] || ["Une erreur est survenue", "Une erreur inattendue s'est produite."];
  const timestamp = new Date().toLocaleString('fr-FR', { dateStyle: 'short', timeStyle: 'short' });

  const bgLayer = BG_IMAGE_URL
    ? `linear-gradient(180deg, rgba(4,10,20,0.55), rgba(4,10,20,0.88)), url('${BG_IMAGE_URL}')`
    : `linear-gradient(135deg, #0a1628, #1e3a5f)`;

  return `<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Erreur ${code} — guiofamily.fr</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, 'Segoe UI', Inter, system-ui, sans-serif;
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    padding: 2rem; position: relative; overflow: hidden; background-color: #0a1628;
    background-image: ${bgLayer}; background-size: cover; background-position: center;
  }
  .card {
    position: relative; z-index: 1; background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.14); border-radius: 20px;
    padding: 3rem 3.5rem; max-width: 520px; width: 100%; text-align: center;
    box-shadow: 0 25px 70px rgba(0,0,0,0.45);
  }
  .logo {
    width: 60px; height: 60px; margin: 0 auto 1.25rem; border-radius: 50%;
    border: 3px solid #5eb3f0; display: flex; align-items: center; justify-content: center;
    font-weight: 700; font-size: 1.4rem; color: #fff;
  }
  .brand-name {
    font-size: 0.8rem; letter-spacing: 0.08em; color: rgba(255,255,255,0.55);
    text-transform: uppercase; margin-bottom: 2rem; font-weight: 500;
  }
  .code {
    font-size: 5rem; font-weight: 800;
    background: linear-gradient(135deg, #7fc4f5, #ffffff);
    -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
    line-height: 1; margin-bottom: 0.75rem; letter-spacing: -0.02em;
  }
  .message { font-size: 1.35rem; color: #fff; font-weight: 600; margin-bottom: 0.5rem; }
  .explanation { font-size: 0.95rem; color: rgba(255,255,255,0.65); margin-bottom: 2rem; line-height: 1.55; }
  .meta {
    border-top: 1px solid rgba(255,255,255,0.14); padding-top: 1.25rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 1rem 1.25rem; text-align: left;
  }
  .meta-label {
    color: rgba(255,255,255,0.4); text-transform: uppercase; letter-spacing: 0.06em;
    font-size: 0.68rem; margin-bottom: 0.2rem; font-weight: 600;
  }
  .meta-value { color: rgba(255,255,255,0.9); font-family: 'SF Mono', Consolas, monospace; font-size: 0.85rem; word-break: break-all; }
  .footer { margin-top: 1.75rem; font-size: 0.75rem; color: rgba(255,255,255,0.35); }
  @media (max-width: 480px) {
    .card { padding: 2.25rem 1.75rem; }
    .code { font-size: 3.75rem; }
    .meta { grid-template-columns: 1fr; }
  }
</style>
</head>
<body>
  <div class="card">
    <div class="logo">g</div>
    <p class="brand-name">guiofamily.fr</p>
    <p class="code">${code}</p>
    <p class="message">${msg}</p>
    <p class="explanation">${explanation}</p>
    <div class="meta">
      <div><div class="meta-label">Hôte demandé</div><div class="meta-value">${host}</div></div>
      <div><div class="meta-label">Votre IP</div><div class="meta-value">${ip}</div></div>
      <div><div class="meta-label">Code erreur</div><div class="meta-value">${code}</div></div>
      <div><div class="meta-label">Horodatage</div><div class="meta-value">${timestamp}</div></div>
    </div>
    <p class="footer">Si le problème persiste, contactez l'administrateur</p>
  </div>
</body>
</html>`;
}

app.listen(3000, '0.0.0.0');
