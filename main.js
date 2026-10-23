const $=s=>document.querySelector(s);
$('#mx').textContent=Q.length;const done=new Set();let cur=0,slotKey=null;
const store={get(k){try{return localStorage.getItem('foto:'+k)}catch(e){return null}},set(k,v){try{v?localStorage.setItem('foto:'+k,v):localStorage.removeItem('foto:'+k)}catch(e){toast('Sem espaço para salvar a foto')}}};

/* ---------- 3D ---------- */
const cv=$('#c'),R=new THREE.WebGLRenderer({canvas:cv,antialias:true});
R.setPixelRatio(Math.min(devicePixelRatio,2));
const S=new THREE.Scene();S.background=new THREE.Color(0x0b1f2d);S.fog=new THREE.Fog(0x0b1f2d,25,120);
const cam=new THREE.PerspectiveCamera(60,1,.1,300);
S.add(new THREE.AmbientLight(0x9ab0c2,.8));
const sun=new THREE.DirectionalLight(0xffe2c4,.9);sun.position.set(10,20,10);S.add(sun);
const grid=new THREE.GridHelper(400,100,0xf79a5b,0x4f829d);grid.position.y=-8;S.add(grid);
const sp=new Float32Array(3000);for(let i=0;i<3000;i+=3){sp[i]=(Math.random()-.5)*260;sp[i+1]=Math.random()*70-4;sp[i+2]=-Math.random()*(Q.length*20+120)+30}
const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.BufferAttribute(sp,3));
S.add(new THREE.Points(sg,new THREE.PointsMaterial({color:0xe8ddb5,size:.5})));
const mat=(c,e)=>new THREE.MeshStandardMaterial({color:c,flatShading:true,emissive:e||0,emissiveIntensity:.5});
function label(a,b){const k=document.createElement('canvas');k.width=512;k.height=128;const x=k.getContext('2d');
x.fillStyle='#17405a';x.fillRect(0,0,512,128);x.strokeStyle='#e8ddb5';x.lineWidth=8;x.strokeRect(4,4,504,120);
x.fillStyle='#f79a5b';x.font='24px monospace';x.textAlign='center';x.fillText(a,256,44);
x.fillStyle='#e8ddb5';x.font='bold 34px monospace';x.fillText(b,256,92);
const s=new THREE.Sprite(new THREE.SpriteMaterial({map:new THREE.CanvasTexture(k)}));s.scale.set(7,1.75,1);return s}
const P=Q.map((_,i)=>new THREE.Vector3(Math.sin(i*1.4)*9,Math.sin(i*.9)*2,-i*20));
const crystals=[];
Q.forEach((q,i)=>{const g=new THREE.Group();g.position.copy(P[i]);
const pl=new THREE.Mesh(new THREE.CylinderGeometry(4.2,3,1,8),mat(0x4f829d));pl.position.y=-.5;g.add(pl);
const top=new THREE.Mesh(new THREE.CylinderGeometry(3.6,3.6,.2,8),mat(0x17405a,0x17405a));top.position.y=.05;g.add(top);
const ring=new THREE.Mesh(new THREE.TorusGeometry(3.7,.12,6,8),mat(0xf79a5b,0xf79a5b));ring.rotation.x=Math.PI/2;ring.position.y=.2;g.add(ring);
const cr=new THREE.Mesh(new THREE.OctahedronGeometry(1.6),mat(q.c,q.c));cr.position.y=3.6;cr.userData.i=i;g.add(cr);crystals.push(cr);

const lb=label(q.tag,q.t);lb.position.y=6.6;g.add(lb);
for(let j=0;j<5;j++){const b=new THREE.Mesh(new THREE.BoxGeometry(.5,.5,.5),mat(0x4f829d));b.position.set((Math.random()-.5)*16,Math.random()*8-3,(Math.random()-.5)*10);b.userData.s=Math.random()*.02+.005;g.add(b)}
S.add(g)});
const coins=[];
for(let i=0;i<Q.length-1;i++)for(let j=1;j<6;j++){const c=new THREE.Mesh(new THREE.OctahedronGeometry(.4),mat(0xf79a5b,0xf79a5b));
c.position.lerpVectors(P[i],P[i+1],j/6);c.position.y+=1.6+Math.sin(j)*.4;S.add(c);coins.push(c)}
const av=new THREE.Group();
const bd=new THREE.Mesh(new THREE.BoxGeometry(1,1,1),mat(0xf79a5b,0xf79a5b));bd.position.y=.5;
const hd=new THREE.Mesh(new THREE.BoxGeometry(.8,.8,.8),mat(0xe8ddb5));hd.position.y=1.5;
const ey=new THREE.Mesh(new THREE.BoxGeometry(.6,.14,.1),mat(0x17405a));ey.position.set(0,1.6,.41);
av.add(bd,hd,ey);S.add(av);const base=P[0].clone();av.position.copy(base);
let yaw=0,pitch=.35,drag=null,moved=0;
cv.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY};moved=0});
addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;moved+=Math.abs(dx)+Math.abs(dy);
yaw=Math.max(-1.3,Math.min(1.3,yaw-dx*.005));pitch=Math.max(.08,Math.min(.9,pitch+dy*.004));drag={x:e.clientX,y:e.clientY}});
addEventListener('pointerup',e=>{if(drag&&moved<6&&e.target===cv)pick(e);drag=null});
const ray=new THREE.Raycaster(),m2=new THREE.Vector2();
function pick(e){m2.set(e.clientX/innerWidth*2-1,-(e.clientY/innerHeight)*2+1);ray.setFromCamera(m2,cam);
const h=ray.intersectObjects(crystals);if(h.length){const i=h[0].object.userData.i;if(i===cur)openQ(i,'rel');else go(i)}}
function resize(){R.setSize(innerWidth,innerHeight);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}
addEventListener('resize',resize);resize();
const t0=performance.now();
function loop(){requestAnimationFrame(loop);const t=(performance.now()-t0)/1000;
crystals.forEach((c,i)=>{c.rotation.y=t*.9+i;c.position.y=3.6+Math.sin(t*1.5+i)*.35;c.scale.setScalar(i===cur?1.25+Math.sin(t*4)*.06:1)});
coins.forEach((c,i)=>{c.rotation.y=t*2+i});
S.children.forEach(g=>g.children&&g.children.forEach(b=>{if(b.userData.s){b.rotation.x+=b.userData.s;b.rotation.y+=b.userData.s}}));
const tg=P[cur].clone();tg.y+=.2;const d=base.distanceTo(tg);
base.lerp(tg,.04);av.position.copy(base);
if(d>1.5)av.position.y+=Math.abs(Math.sin(t*7))*.22;/* pulinho só enquanto anda; mude .22 para pular mais/menos */
grid.position.z=Math.round(base.z/4)*4;
if(d>.5){av.rotation.y=Math.atan2(tg.x-av.position.x,tg.z-av.position.z)}else av.rotation.y*=.9;
const D=16,off=new THREE.Vector3(Math.sin(yaw)*D*Math.cos(pitch),Math.sin(pitch)*D+2,Math.cos(yaw)*D*Math.cos(pitch));
cam.position.lerp(base.clone().add(off),.06);cam.lookAt(base.x,base.y+3,base.z-2);
R.render(S,cam)}loop();

/* ---------- jogo / UI ---------- */
function go(i){cur=(i+Q.length)%Q.length;$('#name').innerHTML=`<small>${Q[cur].tag}${done.has(cur)?' ✔':''}</small>${Q[cur].t}`}
go(0);
function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(toast.h);toast.h=setTimeout(()=>t.classList.remove('on'),2400)}
function slotHTML(i,j){const k=i+'-'+j,own=store.get(k),img=own||(Q[i].fotos||[])[j];
return `<div class="slot${img?' has':''}" tabindex="0" role="button" data-k="${k}">${img?`<img src="${img}" alt="">${own?'<button class="rm" data-rm="'+k+'" aria-label="Remover foto">X</button>':''}`:'+ '+Q[i].slots[j]+'<br>(clique para escolher)'}</div>`}
function _openQ(i){const q=Q[i];let body;
const sl=q.slots.map((_,j)=>slotHTML(i,j)).join('');
if(q.list){body=`<div class="about"><ul class="list">${q.list.map((x,n)=>`<li><b>0${n+1}</b>${x}</li>`).join('')}</ul>${sl}</div>`}
else body=`<div class="cards">${q.cards.map((x,n)=>`<div class="card"><h3>${CARDS[n]}</h3><p>${x}</p></div>`).join('')}</div><div class="slots">${sl}</div><p class="hint">Imagens (${q.t.toLowerCase()}): clique em um espaço para colocar suas fotos.</p>`;
$('#panel').innerHTML=`<div class="tb"><div>${q.tag}</div><span><button class="x" id="cl" aria-label="Fechar">X</button></span></div><div class="bd"><h2>${q.t}</h2>${body}</div>`;
$('#panel').classList.add('on');$('#panel').scrollTop=0;$('#cl').focus();
if(!done.has(i)){done.add(i);const x=Math.round(done.size/Q.length*100);$('#lv').textContent=done.size;$('#xp').style.width=x+'%';$('#xpt').textContent=x;
toast(done.size===Q.length?'🏆 DIÁRIO COMPLETO!':'+'+Math.round(100/Q.length)+' XP · Fase concluída');go(cur)}}
function closeQ(){$('#panel').classList.remove('on')}
$('#panel').addEventListener('click',e=>{
if(e.target.closest('#cl'))return closeQ();
const r=e.target.closest('[data-rm]');if(r){e.stopPropagation();store.set(r.dataset.rm,null);return openQ(cur)}
const s=e.target.closest('.slot');if(s){slotKey=s.dataset.k;$('#file').click()}});
$('#panel').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('slot')){e.preventDefault();slotKey=e.target.dataset.k;$('#file').click()}});
$('#file').addEventListener('change',e=>{const f=e.target.files[0];e.target.value='';if(!f||!slotKey)return;
const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,900/Math.max(im.width,im.height)),c=document.createElement('canvas');
c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);store.set(slotKey,c.toDataURL('image/jpeg',.8));openQ(cur)};im.src=fr.result};fr.readAsDataURL(f)});
$('#start').onclick=()=>{$('#title').style.display='none';$('#hud').hidden=false;$('#nav').hidden=false;toast('Use ← → para viajar entre as fases')};
$('#prev').onclick=()=>go(cur-1);$('#next').onclick=()=>go(cur+1);$('#open').onclick=()=>openQ(cur,'rel');
addEventListener('keydown',e=>{if($('#title').style.display!=='none')return;
if(e.key==='Escape')closeQ();if($('#panel').classList.contains('on'))return;
if(e.key==='ArrowLeft'||e.key==='a')go(cur-1);if(e.key==='ArrowRight'||e.key==='d')go(cur+1);if(e.key==='Enter'||e.key===' ')openQ(cur,'rel')});

/* ---------- abas: relato / mais fotos / vibe ---------- */
let tab='rel';
const esc=s=>String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const jget=(k,d)=>{try{return JSON.parse(store.get(k))||d}catch(e){return d}};
const getX=i=>jget('x'+i,[]),getV=i=>jget('v'+i,Q[i].music||{});
const fin=document.createElement('input');fin.type='file';fin.accept='image/*';fin.multiple=true;fin.hidden=true;document.body.appendChild(fin);
const lb=document.createElement('div');lb.id='lb';lb.innerHTML='<img alt="">';document.body.appendChild(lb);lb.onclick=()=>lb.classList.remove('on');
const shrink=f=>new Promise(r=>{const fr=new FileReader();fr.onload=()=>{const im=new Image();im.onload=()=>{const s=Math.min(1,800/Math.max(im.width,im.height)),c=document.createElement('canvas');c.width=im.width*s;c.height=im.height*s;c.getContext('2d').drawImage(im,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.75))};im.onerror=()=>r(null);im.src=fr.result};fr.readAsDataURL(f)});
function showTab(t){tab=t;['rel','fotos','vibe'].forEach(k=>{const e=$('#t-'+k);if(e)e.style.display=k===t?'block':'none'});
document.querySelectorAll('#panel .tab').forEach(b=>b.classList.toggle('on',b.dataset.tab===t))}
function openQ(i,tb){if(tb)tab=tb;if(i===0&&tab==='fotos')tab='rel';_openQ(i);
const bd=$('#panel .bd'),h2=bd.querySelector('h2'),st=Q[i].extras||[],x=st.concat(getX(i)),v=getV(i);
const rel=document.createElement('div');rel.id='t-rel';while(h2.nextSibling)rel.appendChild(h2.nextSibling);
const tabs=document.createElement('div');tabs.className='tabs';
tabs.innerHTML=`<button class="tab" data-tab="rel">RELATO</button>${i>0?`<button class="tab" data-tab="fotos">+ FOTOS (${x.length})</button>`:''}<button class="tab" data-tab="vibe">♪ VIBE</button>`;
h2.after(tabs);tabs.after(rel);
let after=rel;
if(i>0){const f=document.createElement('div');f.id='t-fotos';
f.innerHTML=`<div class="slots">${x.map((d,n)=>`<div class="slot has xph"><img src="${d}" alt="Foto extra ${n+1}">${n>=st.length?`<button class="rm" data-xr="${n-st.length}" aria-label="Remover foto">X</button>`:''}</div>`).join('')}<div class="slot addx" tabindex="0" role="button">+ Adicionar fotos<br>(pode escolher várias)</div></div><p class="hint">Clique numa foto para ampliar.</p>`;
rel.after(f);after=f}
const ok=/^https?:\/\//i.test(v.l||''),w=document.createElement('div');w.id='t-vibe';
w.innerHTML=`<div class="vibe"><div class="disc"></div><div class="np"><small>♪ VIBE DA AULA</small><b>${esc(v.t)||'Nenhuma música ainda'}</b><span>${esc(v.a)}</span><div class="eq"><i></i><i></i><i></i><i></i><i></i></div></div></div>
<div class="pl" id="pl"></div>${v.n?`<p class="note">“${esc(v.n)}”</p>`:''}${ok?`<a class="lnk" href="${esc(v.l)}" target="_blank" rel="noopener noreferrer">↗ ABRIR LINK</a>`:''}
<div class="vf"><label>Música<input id="vt" value="${esc(v.t)}"></label><label>Artista<input id="va" value="${esc(v.a)}"></label><label>Link (YouTube, Spotify…)<input id="vl" value="${esc(v.l)}" placeholder="https://"></label><label>Vibe do dia<textarea id="vn" rows="2">${esc(v.n)}</textarea></label><button id="sv">SALVAR VIBE</button></div>`;
after.after(w);showTab(tab);initPlayer(i)}
$('#panel').addEventListener('click',e=>{const t=e.target;let h=true;
const tb=t.closest('[data-tab]'),xr=t.closest('[data-xr]');
if(tb)showTab(tb.dataset.tab);
else if(xr){const a=getX(cur);a.splice(+xr.dataset.xr,1);store.set('x'+cur,JSON.stringify(a));openQ(cur)}
else if(t.closest('.addx'))fin.click();
else if(t.closest('.xph')){$('#lb img').src=t.closest('.xph').querySelector('img').src;lb.classList.add('on')}
else if(t.closest('#sv')){store.set('v'+cur,JSON.stringify({t:$('#vt').value.trim(),a:$('#va').value.trim(),l:$('#vl').value.trim(),n:$('#vn').value.trim()}));openQ(cur);toast('Vibe salva ♪')}
else if(t.closest('#pp'))toggleAudio(cur)
else if(t.closest('#vrm'))rmAudio(cur)
else h=false;
if(h)e.stopPropagation()},true);
$('#panel').addEventListener('keydown',e=>{if((e.key==='Enter'||e.key===' ')&&e.target.classList.contains('addx')){e.preventDefault();e.stopPropagation();fin.click()}},true);
fin.addEventListener('change',async e=>{const fs=[...e.target.files];e.target.value='';const i=cur,a=getX(i);
for(const f of fs){const d=await shrink(f);if(d)a.push(d)}store.set('x'+i,JSON.stringify(a));openQ(i)});
addEventListener('keydown',e=>{if(e.key==='Escape')lb.classList.remove('on')});

/* ---------- música: toca dentro do site ---------- */
const bgm=new Audio();bgm.loop=true;let bgmPh=-1;
const idb=(m,k,v)=>new Promise((res,rej)=>{const r=indexedDB.open('diario',1);r.onupgradeneeded=()=>r.result.createObjectStore('a');
r.onsuccess=()=>{const s=r.result.transaction('a',m==='get'?'readonly':'readwrite').objectStore('a'),q=m==='get'?s.get(k):m==='put'?s.put(v,k):s.delete(k);q.onsuccess=()=>res(q.result);q.onerror=()=>rej(q.error)};r.onerror=()=>rej(r.error)});
const mus=document.createElement('button');mus.id='mus';mus.hidden=true;mus.onclick=()=>bgm.paused?bgm.play():bgm.pause();$('#nav').appendChild(mus);
function sync(){const on=!bgm.paused&&bgmPh===cur,pp=$('#pp'),v=$('#t-vibe');if(pp)pp.textContent=on?'❚❚':'▶';if(v)v.classList.toggle('playing',on||v.dataset.emb==='1');
mus.hidden=bgmPh<0;mus.textContent=bgm.paused?'♪ ▶':'♪ ❚❚'}
setInterval(sync,400);
bgm.addEventListener('timeupdate',()=>{const s=$('#sk');if(s&&bgmPh===cur&&bgm.duration)s.value=bgm.currentTime/bgm.duration*1000});
bgm.addEventListener('error',()=>{if(bgm.src)toast('Não consegui tocar esse áudio')});
async function audioSrc(i){try{const b=await idb('get','a'+i);if(b)return{src:URL.createObjectURL(b),own:true}}catch(e){}const l=getV(i).l||'';return{src:/\.(mp3|ogg|wav|m4a|aac)(\?.*)?$/i.test(l)?l:'',own:false}}
async function initPlayer(i){const pl=$('#pl'),up=$('#vaf');
if(up)up.onchange=async e=>{const f=e.target.files[0];if(!f)return;try{await idb('put','a'+i,f);if(bgmPh===i){bgm.pause();bgmPh=-1}toast('Áudio salvo ♪');openQ(i,'vibe')}catch(err){toast('Não consegui salvar o áudio')}};
const em=embedOf(getV(i).l);
if(em){pl.innerHTML=`<iframe src="${em.u}" height="${em.h}" style="border:0;border-radius:8px" allow="autoplay; encrypted-media; clipboard-write" loading="lazy" title="Player da vibe"></iframe><p class="hint">Se o player não aparecer, use ↗ ABRIR LINK.</p>`;$('#t-vibe').dataset.emb='1';sync();return}
const a=await audioSrc(i);if(!$('#pl')||cur!==i)return;
if(!a.src){pl.innerHTML='<p class="hint">Cole abaixo um link do YouTube, Spotify ou SoundCloud (ou de um .mp3) e clique em SALVAR VIBE para tocar aqui.</p>';return}
pl.dataset.src=a.src;
pl.innerHTML=`<button id="pp" aria-label="Tocar ou pausar">▶</button><input id="sk" type="range" min="0" max="1000" value="0" aria-label="Progresso"><input id="vo" type="range" min="0" max="1" step=".05" value="${bgm.volume}" aria-label="Volume">${a.own?'<button id="vrm" class="mini">REMOVER ÁUDIO</button>':''}`;
$('#sk').oninput=e=>{if(bgmPh===i&&bgm.duration)bgm.currentTime=e.target.value/1000*bgm.duration};
$('#vo').oninput=e=>{bgm.volume=+e.target.value};sync()}
function toggleAudio(i){const s=$('#pl').dataset.src;if(!s)return;
if(bgmPh!==i){bgm.src=s;bgmPh=i;bgm.play().catch(()=>toast('Não consegui tocar o áudio'))}else bgm.paused?bgm.play():bgm.pause()}
function rmAudio(i){idb('del','a'+i).then(()=>{if(bgmPh===i){bgm.pause();bgmPh=-1}openQ(i,'vibe')})}

/* ---------- links que viram player embutido ---------- */
function embedOf(l){let u;try{u=new URL(l)}catch(e){return null}
const h=u.hostname.replace(/^(www|m|music)\./,''),p=u.pathname.split('/').filter(Boolean),E=encodeURIComponent,yt='https://www.youtube-nocookie.com/embed/';
if(h==='youtu.be'&&p[0])return{u:yt+E(p[0])+'?rel=0',h:230};
if(h==='youtube.com'){const v=u.searchParams.get('v'),L=u.searchParams.get('list');
if(v)return{u:yt+E(v)+'?rel=0'+(L?'&list='+E(L):''),h:230};
if(['shorts','embed','live'].includes(p[0])&&p[1])return{u:yt+E(p[1])+'?rel=0',h:230};
if(L)return{u:yt+'videoseries?list='+E(L),h:230}}
if(h==='open.spotify.com'){const k=p.findIndex(x=>['track','album','playlist','episode','show','artist'].includes(x));
if(k>-1&&p[k+1])return{u:'https://open.spotify.com/embed/'+p[k]+'/'+E(p[k+1]),h:['track','episode'].includes(p[k])?152:352}}
if(h==='soundcloud.com'&&p.length)return{u:'https://w.soundcloud.com/player/?color=%23f79a5b&url='+E(l),h:166};
return null}
