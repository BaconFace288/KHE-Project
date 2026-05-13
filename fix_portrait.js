const fs = require('fs');
let css = fs.readFileSync('public/style.css', 'utf8');

const mobileResponsive = `

/* ==============================================
   MOBILE PORTRAIT — Landing page fits in viewport
   ============================================== */
@media (max-width: 768px) and (orientation: portrait),
       (max-height: 500px) and (max-width: 900px) {

  /* Let the UI layer scroll so all content is reachable */
  html, body {
    overflow: auto !important;
    overscroll-behavior: auto !important;
    height: auto !important;
    min-height: 100%;
  }

  #ui-layer {
    overflow-y: auto;
    overflow-x: hidden;
    height: auto;
    min-height: 100%;
    align-items: flex-start;    /* don't force center — let content scroll */
    padding: 12px 0 20px;
    box-sizing: border-box;
  }

  /* ── Landing page ── */
  #landing-page {
    gap: 10px;
    padding: 0 8px;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
  }

  .landing-title {
    font-size: 28px;
    margin: 4px 0 0;
  }

  /* Make the banner shorter — max 35% of viewport height */
  .landing-banner-wrap {
    width: 100%;
    max-width: 100%;
    aspect-ratio: unset;
    height: 35vh;
    min-height: 140px;
    max-height: 240px;
    border-radius: 8px;
  }

  .landing-banner {
    object-fit: cover;      /* crop sides rather than letterbox */
    object-position: center;
  }

  /* Stack PLAY button, lore/credits icons */
  .play-btn-row {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 10px;
  }

  .play-btn {
    font-size: 18px;
    padding: 12px 32px;
  }

  /* Mobile checkbox row */
  #landing-page > div[style] {
    margin-top: 6px !important;
  }

  /* ── .screen (main-menu, lobby, end) ── */
  .screen {
    padding: 20px 16px;
    min-width: unset;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 8px;
  }

  /* ── Main menu inputs ── */
  input[type="text"] {
    width: 90%;
    font-size: 15px;
    padding: 9px;
    margin-bottom: 12px;
  }

  button {
    font-size: 14px;
    padding: 10px 16px;
  }

  h1 { font-size: 22px; }
  h2 { font-size: 18px; }
}
`;

if (!css.includes('MOBILE PORTRAIT — Landing page fits')) {
  css += mobileResponsive;
  fs.writeFileSync('public/style.css', css);
  console.log('Mobile portrait responsive CSS added');
} else {
  console.log('Already present — skipping');
}
