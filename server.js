const express = require('express');
const path = require('path');
const app = express();

// Sert uniquement l'image de fond, placée à la racine du repo
app.get('/background_guiofamily.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'background_guiofamily.png'));
});
app.get('/background_guiofamily_mobile.png', (req, res) => {
  res.sendFile(path.join(__dirname, 'background_guiofamily_mobile.png'));
});

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
    padding: 2rem; background-color: #ffffff;
    background-image: url('https://errors-page.guiofamily.fr/background_guiofamily.png');
    background-size: cover; background-position: center;
  }
  .card {
    background: rgba(255,255,255,0.94);
    border: 1px solid rgba(15,23,42,0.08);
    border-radius: 18px; padding: 2.75rem 3.25rem; max-width: 480px; width: 100%;
    text-align: center; box-shadow: 0 20px 50px rgba(15,23,42,0.12), 0 4px 12px rgba(15,23,42,0.06);
  }
  .code { font-size: 4.5rem; font-weight: 800; color: #1a6fb0; line-height: 1; margin-bottom: 0.6rem; letter-spacing: -0.02em; }
  .message { font-size: 1.3rem; color: #0f172a; font-weight: 600; margin-bottom: 0.5rem; }
  .explanation { font-size: 0.95rem; color: #64748b; margin-bottom: 2rem; line-height: 1.55; }
  .meta {
    border-top: 1px solid rgba(15,23,42,0.08); padding-top: 1.15rem;
    display: grid; grid-template-columns: 1fr 1fr; gap: 0.9rem 1.1rem; text-align: left;
  }
  .meta-label { color: #94a3b8; text-transform: uppercase; letter-spacing: 0.06em; font-size: 0.66rem; margin-bottom: 0.2rem; font-weight: 600; }
  .meta-value { color: #1e293b; font-family: 'SF Mono', Consolas, monospace; font-size: 0.82rem; word-break: break-all; }
  .footer { margin-top: 1.6rem; font-size: 0.75rem; color: #94a3b8; }
  @media (max-width: 640px) {
    body {
      background-image: url('https://errors-page.guiofamily.fr/background_guiofamily_mobile.png');
      padding: 1.25rem;
    }
    .card { padding: 2rem 1.5rem; max-width: 100%; }
    .code { font-size: 3.25rem; }
    .message { font-size: 1.15rem; }
    .explanation { font-size: 0.88rem; }
    .meta { grid-template-columns: 1fr; gap: 0.75rem; }
  }
</style>
</head>
<body>
  <div class="card">
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
