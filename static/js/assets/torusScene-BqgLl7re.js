import{M as F,C as D,S as I,a as L,c as i,G,s as p,b as Y,d as _,r as j,e as R,T as U}from"./threeSetup-DqEBOZEK.js";function X(h,x,o,n){const c=[];for(;h>0;){const a=new F(o,n);a.rotateY(1.57),a.position.x=h-1,x.add(a),c.push(a),h-=.1}return c}function s({text:h="",font:x="30px Arial",color:o="white",lineHeight:n=40,canvasWidth:c=1024,canvasHeight:a=512,position:v={x:0,y:0,z:0},scale:r={x:1,y:1,z:1},initialOpacity:l=0}){const z=document.createElement("canvas");z.width=c,z.height=a;const d=z.getContext("2d");d.font=x,d.fillStyle=o;const m=h.split(`
`);let T=n;m.forEach(A=>{d.fillText(A,0,T),T+=n});const f=new D(z),H=new I({map:f,transparent:!0,opacity:l}),u=new L(H);return u.scale.set(r.x,r.y,r.z),u.position.set(v.x,v.y,v.z),u.userData.targetOpacity=l,u}let t=[];const O=s({text:`The Torus Tube
by
Curby Williams`,font:"Bold 250px Helvetica",color:"white",lineHeight:250,canvasWidth:5e3,canvasHeight:5e3,position:{x:.8,y:-2.6,z:0},scale:{x:16,y:11,z:1}}),J=s({text:`Full-stack Developer
+ Computer Sci Student
+ Ex-chemical engineer`,font:"Bold 100px Helvetica",color:"white",lineHeight:100,canvasWidth:5e3,canvasHeight:5e3,position:{x:.375,y:-4.6,z:0},scale:{x:15,y:11,z:1}}),N=s({text:`Front-end:
HTML, CSS, Tailwind, Bootstrap, Javascript, Three.js

Backend:
SQL, PostGreSQL, MySQL, Python, Django, Node, PHP, C++

Platforms:
Contentful, WordPress, Heroku, Github`,font:"80px Helvetica",color:"white",lineHeight:100,canvasWidth:5e3,canvasHeight:5e3,position:{x:-1.6,y:-5.4,z:0},scale:{x:11,y:11,z:1}}),Q=s({text:`Scroll down ↓ to move right →

For the full experience: 
Enable audio ♬ AND use headphones`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:0,y:-1.6,z:0},scale:{x:5,y:5,z:2}}),Z=s({text:`Welcome to 'The Torus Tube'.
A journey through my timeline,
woven into an immersive
audio-visual experience.`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:4.2,y:-.2,z:0},scale:{x:5,y:5,z:2}}),$=s({text:`Pay attention to the audio while
you scroll. The audio moves
with you. As you move, the
audio moves with you.`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:10.2,y:-.4,z:0},scale:{x:5,y:5,z:2}}),q=s({text:"Education:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:16.1,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),K=s({text:`Cape Peninsula Univeristy of Technology
National Diploma: Chemical Engineering
from 2016 - 2020
Chemistry, Physics, Process Design,
Advanced mathematics`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:16,y:-.4,z:0},scale:{x:5,y:5,z:2}}),V=s({text:"Work Experience:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:22.6,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),ee=s({text:`Chemical Engineering Intern
Elgin Fruit Juices
from 2019 - 2020
Anaerobic digestion 
+ Fruit juice concentration`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:22.51,y:-.4,z:0},scale:{x:5,y:5,z:2}}),te=s({text:"Work Experience:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:28.1,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),ie=s({text:`Product Developer | Web Developer
The Good Steward project
from 2020 - 2021
Formulated and oversaw manufacture of
a custom natural meal replacement shake`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:28.01,y:-.4,z:0},scale:{x:5,y:5,z:2}}),oe=s({text:"Work Experience:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:34.2,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),ne=s({text:`Web Developer | UI/UX design
ZAknot Wedding Market
from 2021 - 2022
Built an online platform linking couples
with vendors, venues, and planners.`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:34.1,y:-.4,z:0},scale:{x:5,y:5,z:2}}),ae=s({text:"Education:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:40.1,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),se=s({text:`University of South Africa
Bachelor of Science: Computing
from 2022 - Ongoing
Human-computer interaction,
Databases, Advanced Programming`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:40,y:-.4,z:0},scale:{x:5,y:5,z:2}}),ce=s({text:"Work Experience:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:46,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),re=s({text:`Learning Technologist | Auxilia
from March 2024 - Sep 2025
EdTech Hub (UK) & FinTech Hub (US)
Built out educational content online
for a public-servant-focused company`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:45.91,y:-.4,z:0},scale:{x:5,y:5,z:2}}),le=s({text:"How I work:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:52.5,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),pe=s({text:`1. Detail-oriented.
2. Calm under pressure.
3. Clear communication is key.
3. AI-augmented, not AI-powered.
4. Teamwork makes the dream work.`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:52.41,y:-.4,z:0},scale:{x:5,y:5,z:2}}),he=s({text:"Website Architecture:",font:"Bold 72px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:58.1,y:-.1,z:0},scale:{x:5.2,y:5.2,z:2}}),de=s({text:`Front-end:
HTML, CSS, Tailwind, JS, Three.js
Backend:
Python | Django, PostGreSQL`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:58.01,y:-.4,z:0},scale:{x:5,y:5,z:2}}),ue=s({text:`The end.

Let me know what you 
think using the link above

Audio credit to: FKJ - Moments (Part 2)`,font:"60px Helvetica",color:"white",lineHeight:70,canvasWidth:1500,canvasHeight:1e3,position:{x:64.3745,y:-1.45,z:0},scale:{x:5,y:5,z:2}});t.push(Q);t.push(Z);t.push($);t.push(q);t.push(K);t.push(V);t.push(ee);t.push(te);t.push(ie);t.push(oe);t.push(ne);t.push(ae);t.push(se);t.push(ce);t.push(re);t.push(le);t.push(pe);t.push(he);t.push(de);t.push(ue);t.push(O);t.push(J);t.push(N);let M={},k={};M.position=0;k.position=0;window.addEventListener("wheel",h=>{M.position+=h.deltaY*.5,M.position=Math.max(0,Math.min(M.position,15*(w.length-1)))});const W=new(window.AudioContext||window.webkitAudioContext);let B,y=null,g=null;async function xe(h){const o=await(await fetch(h)).arrayBuffer();B=await W.decodeAudioData(o)}function fe(){if(!B){console.error("Audio not loaded yet!");return}y&&(y.stop(),y.disconnect(),y=null),y=W.createBufferSource(),y.buffer=B,g||(g=W.createPanner(),g.panningModel="HRTF",g.distanceModel="linear",g.refDistance=1,g.maxDistance=5,g.rolloffFactor=1.5,g.connect(W.destination)),y.connect(g),y.start(),y.onended=()=>{y.disconnect(),y=null}}function ge(){if(!g)return;const h=i.position.x/62*(2*Math.PI*2),x=2,o=Math.cos(h)*x,n=Math.sin(h)*x,c=0;g.positionX.value=o,g.positionY.value=c,g.positionZ.value=n;const a=i.position.x-o,v=i.position.y-c,r=i.position.z-n,l=Math.sqrt(a*a+v*v+r*r);console.log(`Sound pos: x=${o.toFixed(2)}, z=${n.toFixed(2)}, distance=${l.toFixed(2)}`)}async function ye(h,x){await xe(h);const o=document.getElementById(x);o.disabled=!1,o.addEventListener("click",async()=>{W.state==="suspended"&&await W.resume(),fe(),o.innerText==="Enable Audio ♬"?o.innerText="Disable Audio ♬":o.innerText="Enable Audio ♬"})}const ve=new R({color:12964529}),me=new U(1.8,.01,18,110,6.3),He=21,w=X(He,p,me,ve);function ze(){w.forEach((d,m)=>{d.position.set(m*.3,0,0),d.material=d.material.clone()});const x=new G;w.forEach(d=>x.add(d)),p.add(x);const o=20;let n,c,a,v=!1;ye("../static/audio/moments-part2.mp3","playBtn").then(()=>{v=!0});function r(d,m){t.forEach((f,H)=>{let u=0;H>=d&&H<m&&(u=1),f.material.opacity+=(u-f.material.opacity)*.05})}function l(d,m){t.forEach((f,H)=>{H>=d&&H<m&&(f.material.opacity+=(0-f.material.opacity)*.05,f.material.opacity<=.01&&(f.material.opacity=0,p.children.includes(f)&&p.remove(f)))})}function z(){requestAnimationFrame(z);const d=Y.getElapsedTime(),m=1,T=.01;x.position.x=Math.sin(d*m)*T,w.forEach(e=>e.rotation.y+=1e-4),i.position.x<=.35?(n=void 0,r(20,23),l(0,20),t.slice(20,23).forEach(e=>p.add(e))):i.position.x>.35&&i.position.x<1?(a=0,n=void 0,r(0,1),l(20,23),t.slice(0,1).forEach(e=>p.add(e))):i.position.x>1&&i.position.x<5.72?(n=0,a=20,r(1,2),l(0,1),t.slice(1,2).forEach(e=>p.add(e))):i.position.x>5.72&&i.position.x<12?(n=20,a=40,c=0,r(2,3),l(1,2),t.slice(2,3).forEach(e=>p.add(e))):i.position.x>12&&i.position.x<17.75?(n=40,a=60,c=20,r(3,5),l(2,3),t.slice(3,5).forEach(e=>p.add(e))):i.position.x>17.75&&i.position.x<24?(n=60,a=80,c=40,r(5,7),l(3,5),t.slice(5,7).forEach(e=>p.add(e))):i.position.x>24&&i.position.x<29.75?(n=80,a=100,c=60,r(7,9),l(5,7),t.slice(7,9).forEach(e=>p.add(e))):i.position.x>29.75&&i.position.x<36?(n=100,a=120,c=80,r(9,11),l(7,9),t.slice(9,11).forEach(e=>p.add(e))):i.position.x>36&&i.position.x<41.7?(n=120,a=140,c=100,r(11,13),l(9,11),t.slice(11,13).forEach(e=>p.add(e))):i.position.x>41.7&&i.position.x<48?(n=140,a=160,c=120,r(13,15),l(11,13),t.slice(13,15).forEach(e=>p.add(e))):i.position.x>48&&i.position.x<53.7?(n=160,a=180,c=140,r(15,17),l(13,15),t.slice(15,17).forEach(e=>p.add(e))):i.position.x>53.7&&i.position.x<59.42?(n=180,a=200,c=160,r(17,19),l(15,17),t.slice(17,19).forEach(e=>p.add(e))):i.position.x>59.42&&(n=200,c=180,r(19,20),l(17,19),t.slice(19,20).forEach(e=>p.add(e)));const f=w.slice(c,c+o),H=w.slice(a,a+o),u=w.slice(n,n+o),A=.8;w.forEach(e=>e.userTargetY=0),c===180?(u.forEach((e,E)=>{const C=Math.abs(E-(o-1)/2)/((o-1)/2),S=new _;S.setHSL(0,1-.6*C,.5),e.userTargetColor=S}),u.forEach(e=>e.material.color.lerp(e.userTargetColor,.05))):i.position.x<.5?(u.forEach((e,E)=>{const C=E/(o-1)*Math.PI;e.userTargetY=Math.sin(C)*2*A;const S=Math.abs(E-(o-1)/2)/((o-1)/2),b=new _;b.setHSL(0,1-.6*S,.5),e.userTargetColor=b}),u.forEach(e=>{e.position.y+=(e.userTargetY-e.position.y)*.05,e.material.color.lerp(e.userTargetColor,.05)})):(u.forEach((e,E)=>{const C=E/(o-1)*Math.PI;e.userTargetY=Math.sin(C)*2*A;const S=Math.abs(E-(o-1)/2)/((o-1)/2),b=new _;b.setHSL(204/360,.86*(1-S),.49),e.userTargetColor=b}),u.forEach(e=>{e.position.y+=(e.userTargetY-e.position.y)*.05,e.material.color.lerp(e.userTargetColor,.05)})),f.forEach(e=>e.position.y-=(e.userTargetY+e.position.y)*.05),H.forEach(e=>e.position.y-=(e.userTargetY+e.position.y)*.05),c=void 0,a=void 0;const P=.05;k.position+=(M.position/10-k.position/10)*P,i.position.x=k.position/50,v&&ge(),j.render(p,i)}z()}export{ze as initTorusScene,w as toruses};
