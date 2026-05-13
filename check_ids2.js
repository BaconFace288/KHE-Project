const fs=require('fs');
const html=fs.readFileSync('public/index.html', 'utf8');
const js1=fs.readFileSync('public/game.js', 'utf8');
const js2=fs.readFileSync('public/meeting.js', 'utf8');
const js3=fs.readFileSync('public/minigame.js', 'utf8');
const regex=/document\.getElementById\(['"]([^'"]+)['"]\)/g;
let match;
const missing=[];
function check(js) {
  while((match=regex.exec(js)) !== null) {
    if(!html.includes('id="' + match[1] + '"')) missing.push(match[1]);
  }
}
check(js1);
check(js2);
check(js3);
console.log('Missing IDs: ', [...new Set(missing)].join(', '));
