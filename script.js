const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>[...r.querySelectorAll(s)];
const reduceMotion=matchMedia('(prefers-reduced-motion:reduce)').matches;

// ---------- Medición: todo evento va a window.dataLayer (lo lee Google Tag Manager) ----------
// El ID de GTM y la variante se configuran en index.html (window.ARQ_AB).
const AB=window.ARQ_AB||{variant:'B'};
const viewName=()=>{const p=document.getElementById('view-personal');return p&&!p.hidden?'personal':'empresas'};
const track=(event,params={})=>{
  window.dataLayer=window.dataLayer||[];
  window.dataLayer.push(Object.assign({event,variant:AB.variant,view:viewName()},params));
};

// ---------- Header fijo con fondo al hacer scroll ----------
const nav=$('#nav');
const onScroll=()=>nav.classList.toggle('stuck',window.scrollY>140);
addEventListener('scroll',onScroll,{passive:true});onScroll();

// ---------- Aparición suave al entrar en pantalla ----------
const els=$$('.reveal');
if('IntersectionObserver' in window){
  const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
  els.forEach(el=>io.observe(el));
}else{els.forEach(el=>el.classList.add('in'))}

// ---------- Carruseles infinitos de logos: 3 copias del set para que el loop (-33.33%) no tenga saltos ----------
$$('.marquee-track').forEach(track=>{
  const set=[...track.children];
  for(let i=0;i<2;i++)set.forEach(n=>{const c=n.cloneNode();c.setAttribute('aria-hidden','true');track.appendChild(c)});
});

// ---------- Video del hero (vista personal): fuente según el ancho; se pausa si la vista no se ve ----------
const hv=$('#hero-video');
let hvReady=false;
function heroVideo(play){
  if(!hv)return;
  if(play&&!hvReady){hv.src=innerWidth<1024?hv.dataset.mobileSrc:hv.dataset.desktopSrc;hvReady=true}
  if(play&&!reduceMotion)hv.play().catch(()=>{});else hv.pause();
}

// ---------- Carrusel de testimonios (uno por vista): flechas, puntos y avance automático ----------
$$('.quotes').forEach(q=>{
  const section=q.closest('section'),cards=[...q.children],dots=$('.dots',section),arrows=$$('.arrows button',section);
  const visible=()=>q.offsetWidth>0;
  const step=()=>cards.length>1?cards[1].offsetLeft-cards[0].offsetLeft:q.clientWidth;
  const idx=()=>visible()&&step()?Math.round(q.scrollLeft/step()):0;
  const perView=()=>visible()?Math.round(q.clientWidth/cards[0].offsetWidth)||1:1;
  const maxIdx=()=>Math.max(0,cards.length-perView());
  const go=i=>visible()&&q.scrollTo({left:Math.max(0,Math.min(i,maxIdx()))*step(),behavior:'smooth'});
  cards.forEach((_,i)=>{const b=document.createElement('button');b.type='button';b.onclick=()=>go(i);dots.appendChild(b)});
  const sync=()=>{if(!visible())return;[...dots.children].forEach((d,i)=>{d.style.display=i>maxIdx()?'none':'';d.classList.toggle('on',i===Math.min(idx(),maxIdx()))})};
  q.addEventListener('scroll',sync,{passive:true});addEventListener('resize',sync);sync();
  arrows[0].onclick=()=>go(idx()-1);
  arrows[1].onclick=()=>go(idx()>=maxIdx()?0:idx()+1);
  let hold=false;
  section.addEventListener('mouseenter',()=>hold=true);section.addEventListener('mouseleave',()=>hold=false);
  if(!reduceMotion)setInterval(()=>{if(!hold&&!document.hidden&&visible())go(idx()>=maxIdx()?0:idx()+1)},5000);
});

// ---------- Calculadora de cambio (vista personal). Tasas de referencia: reemplazar por la tasa en vivo ----------
const calc=$('#calc');
if(calc){
  const RATE={buy:3305.34,sell:3277.05}; // COP por 1 USDc (valores de referencia de la web de ARQ)
  const amt=$('#calc-amt'),out=$('#calc-out'),fromL=$('#calc-from'),toL=$('#calc-to'),rateL=$('#calc-rate'),swap=$('#calc-swap');
  const flagFrom=$('#calc-flag-from'),flagTo=$('#calc-flag-to');
  const FLAG_CO='assets/co.DbTl_jdJ.svg',FLAG_US='assets/us.BxQaODEj.svg';
  let copToUsd=true;
  const fmt=(n,d)=>n.toLocaleString('es-CO',{minimumFractionDigits:d,maximumFractionDigits:d});
  const render=()=>{
    const v=parseFloat(String(amt.value).replace(/\./g,'').replace(',','.'))||0;
    fromL.textContent=copToUsd?'COP':'USDc';toL.textContent=copToUsd?'USDc':'COP';
    if(flagFrom&&flagTo){flagFrom.src=copToUsd?FLAG_CO:FLAG_US;flagTo.src=copToUsd?FLAG_US:FLAG_CO}
    out.textContent=copToUsd?fmt(v/RATE.buy,2):fmt(v*RATE.sell,0);
    rateL.textContent=copToUsd?'1 USDc = '+fmt(RATE.buy,2)+' COP':'1 USDc = '+fmt(RATE.sell,2)+' COP';
  };
  amt.addEventListener('input',render);
  swap.addEventListener('click',()=>{copToUsd=!copToUsd;amt.value=copToUsd?'1000000':'300';render()});
  render();
}

// ---------- Eventos de medición ----------
// cta_click: cada botón del cuerpo que lleva data-cta (hero, productos, conversor, modal, etc.)
$$('[data-cta]').forEach(a=>a.addEventListener('click',()=>{
  track('cta_click',{cta:a.dataset.cta,cta_text:a.textContent.trim().replace(/\s+/g,' ').slice(0,60)});
}));

// scroll_depth: una vez por vista al llegar al 50 % y al 75 % de la página
const scrollSeen=new Set();
let scrollTick=false;
addEventListener('scroll',()=>{
  if(scrollTick)return;scrollTick=true;
  requestAnimationFrame(()=>{
    scrollTick=false;
    const pct=(scrollY+innerHeight)/document.documentElement.scrollHeight*100;
    [50,75].forEach(n=>{
      const key=viewName()+'-'+n;
      if(pct>=n&&!scrollSeen.has(key)){scrollSeen.add(key);track('scroll_depth',{percent:n})}
    });
  });
},{passive:true});

// calculator_use: la primera vez que alguien usa el conversor (vista personal)
let calcTracked=false;
const trackCalc=action=>{if(!calcTracked){calcTracked=true;track('calculator_use',{action})}};
const calcEl=document.getElementById('calc');
if(calcEl){
  calcEl.addEventListener('input',()=>trackCalc('input'));
  calcEl.addEventListener('click',e=>{if(e.target.closest('#calc-swap'))trackCalc('swap')});
}

// ---------- Modal "De DolarApp a ARQ" (se abre solo al hacer clic en el banner) ----------
const bm=$('#brand-modal'),bmOpen=$('#brand-open');
if(bm&&bmOpen){
  const closeBtn=$('#brand-close'),okBtn=$('#brand-ok');
  const focusables=()=>$$('button,a[href]',bm);
  const open=()=>{
    bm.classList.add('open');bm.setAttribute('aria-hidden','false');document.body.classList.add('modal-open');
    setTimeout(()=>okBtn.focus(),50);
  };
  const close=()=>{
    bm.classList.remove('open');bm.setAttribute('aria-hidden','true');document.body.classList.remove('modal-open');
    bmOpen.focus();
  };
  bmOpen.addEventListener('click',open);
  closeBtn.addEventListener('click',close);okBtn.addEventListener('click',close);
  bm.addEventListener('click',e=>{if(e.target===bm)close()});
  addEventListener('keydown',e=>{
    if(!bm.classList.contains('open'))return;
    if(e.key==='Escape')close();
    if(e.key==='Tab'){ // mantiene el foco dentro del modal
      const f=focusables(),first=f[0],last=f[f.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus()}
      else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus()}
    }
  });
}

// ---------- Navbar ----------
// Logo: sube al inicio (hero). Funcionalidades, Clientes/Opiniones, Ayuda y el botón no navegan a ningún lado.
$$('#nav .noop').forEach(a=>a.addEventListener('click',e=>e.preventDefault()));
$$('#nav [data-top]').forEach(a=>a.addEventListener('click',e=>{
  e.preventDefault();
  scrollTo({top:0,behavior:reduceMotion?'auto':'smooth'});
}));

// Empresas / Personal: cambian de vista dentro de la misma página (sin navegar a otro archivo,
// así funciona también en vistas previas y abriendo el archivo local).
const views={empresas:$('#view-empresas'),personal:$('#view-personal')};
if(views.empresas&&views.personal){
  const TITLES={empresas:'ARQ business | Variación B (estructura Nu)',personal:'ARQ personal | Variación B (estructura Nu)'};
  const show=(name,fromUser)=>{
    if(!views[name])name='empresas';
    Object.entries(views).forEach(([k,v])=>{v.hidden=k!==name});
    $$('#nav [data-view]').forEach(a=>{
      const on=a.dataset.view===name;
      a.classList.toggle('active',on);
      if(on)a.setAttribute('aria-current','page');else a.removeAttribute('aria-current');
    });
    $$('#nav [data-t-empresas]').forEach(a=>{a.textContent=name==='personal'?a.dataset.tPersonal:a.dataset.tEmpresas});
    document.title=TITLES[name];
    heroVideo(name==='personal');
    if(fromUser)scrollTo(0,0);
    try{history.replaceState(null,'',name==='personal'?'#personal':'#empresas')}catch(_){}
    track('view_change',{view:name,from_user:!!fromUser});
    dispatchEvent(new Event('resize')); // reajusta los carruseles de la vista que acaba de mostrarse
  };
  $$('#nav [data-view]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();show(a.dataset.view,true)}));
  show(location.hash==='#personal'?'personal':'empresas',false);
}else if(hv){
  heroVideo(true); // página personal independiente
}
