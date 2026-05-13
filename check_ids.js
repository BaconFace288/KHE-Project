const fs=require('fs');
const html=fs.readFileSync('public/index.html', 'utf8');
const ids = ['main-menu','lobby-screen','game-ui','end-screen','landing-page','play-btn','info-caveman','info-agent','role-modal','role-modal-icon','role-modal-title','role-modal-body','role-modal-close','info-lore','lore-modal','lore-modal-body','lore-modal-close','info-credits','credits-modal','credits-modal-close','player-name','room-code-input','create-btn','join-btn','start-btn','restart-btn','error-msg','kick-msg'];
ids.forEach(id => { 
  if(!html.includes('id="' + id + '"')) console.log('Missing: ' + id) 
});
