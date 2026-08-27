'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,ShoppingCart,Plus,Minus,X,Instagram,Clock3,Bike,WalletCards,Star,Flame,Heart} from 'lucide-react';
import {supabase} from '@/lib/supabase';

type Cat={id:string;name:string;slug:string;emoji:string|null};
type Prod={id:string;category_id:string;name:string;description:string|null;price:number;image_url:string|null;is_available:boolean;is_promo:boolean};
type Cart={p:Prod;q:number};

const money=(n:number)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const catImg:Record<string,string>={
 hamburguesas:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
 'pollo-smash':'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85',
 'mini-hamburpizza':'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=900&q=85',
 pizzas:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85',
 tacos:'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85',
 burritos:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85',
 'milanesas-de-carne':'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=85',
 'sandwich-pollo-vacio':'https://images.unsplash.com/photo-1553909489-cd47e0907980?auto=format&fit=crop&w=900&q=85',
 'papas-fritas':'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=900&q=85',
 pizzetas:'https://images.unsplash.com/photo-1579751626657-72bc17010498?auto=format&fit=crop&w=900&q=85',
 wraps:'https://images.unsplash.com/photo-1626700051175-6818013e1d4f?auto=format&fit=crop&w=900&q=85',
 'pollo-kentucky':'https://images.unsplash.com/photo-1626645738196-c2a7c87a8f58?auto=format&fit=crop&w=900&q=85',
 quesadilla:'https://images.unsplash.com/photo-1551504734-5ee1c4a1479b?auto=format&fit=crop&w=900&q=85'
};

export default function Page(){
 const[cats,setCats]=useState<Cat[]>([]),[products,setProducts]=useState<Prod[]>([]),[active,setActive]=useState('all'),[q,setQ]=useState('');
 const[cart,setCart]=useState<Cart[]>([]),[drawer,setDrawer]=useState(false),[name,setName]=useState(''),[delivery,setDelivery]=useState('Retiro'),[address,setAddress]=useState(''),[payment,setPayment]=useState('Efectivo'),[obs,setObs]=useState('');
 useEffect(()=>{Promise.all([supabase.from('categories').select('*').eq('is_active',true).order('sort_order'),supabase.from('products').select('*').order('sort_order')]).then(([c,p])=>{setCats((c.data||[]) as Cat[]);setProducts((p.data||[]) as Prod[])})},[]);
 useEffect(()=>{try{const s=localStorage.getItem('kenjhi-cart-v2');if(s)setCart(JSON.parse(s))}catch{}},[]);
 useEffect(()=>{try{localStorage.setItem('kenjhi-cart-v2',JSON.stringify(cart))}catch{}},[cart]);

 const filtered=useMemo(()=>products.filter(p=>{const c=cats.find(x=>x.id===p.category_id);return(active==='all'||c?.slug===active)&&(p.name+' '+(p.description||'')+' '+(c?.name||'')).toLowerCase().includes(q.toLowerCase())}),[products,cats,active,q]);
 const count=cart.reduce((a,i)=>a+i.q,0),total=cart.reduce((a,i)=>a+i.p.price*i.q,0);
 const add=(p:Prod)=>setCart(v=>{const x=v.find(i=>i.p.id===p.id);return x?v.map(i=>i.p.id===p.id?{...i,q:i.q+1}:i):[...v,{p,q:1}]});
 const qty=(id:string,d:number)=>setCart(v=>v.map(i=>i.p.id===id?{...i,q:i.q+d}:i).filter(i=>i.q>0));
 const imageFor=(p:Prod)=>p.image_url||catImg[cats.find(c=>c.id===p.category_id)?.slug||'hamburguesas']||catImg.hamburguesas;

 const send=()=>{if(!name.trim())return alert('Ingresá tu nombre.');if(delivery==='Envío'&&!address.trim())return alert('Ingresá la dirección.');if(!cart.length)return;
  const lines=cart.map(i=>'• '+i.p.name+' x'+i.q+' — '+money(i.p.price*i.q));
  const msg=['Hola Kenjhi 👋','','Quiero hacer este pedido:',...lines,'','TOTAL: '+money(total),'','👤 '+name,'🚚 '+delivery+(address?' — '+address:''),'💳 '+payment,obs?'📝 '+obs:''].filter(Boolean).join('\n');
  window.open('https://wa.me/5493498432943?text='+encodeURIComponent(msg),'_blank');
 };

 return <div className="site">
  <header className="top">
   <a className="brandLockup" href="#top"><img src="/kenjhi-logo.jpg" alt="Kenjhi"/><div className="wordmark wordmarkPaint"><i className="logoSlash slashOne"/><i className="logoSlash slashTwo"/><strong>KENJHI</strong><span>FAST FOOD</span></div></a>
   <nav><a className="activeLink" href="#top">INICIO</a><a href="#menu">MENÚ</a><a href="#destacados">COMBOS</a><a href="#menu">PROMOS</a><a href="#contacto">CONTACTO</a></nav>
   <div className="topActions"><a className="ig" href="https://www.instagram.com/kenjhi44/" target="_blank"><Instagram size={18}/>@kenjhi44</a><button className="miniCart" onClick={()=>setDrawer(true)}><ShoppingCart size={20}/><b>{count}</b></button><a className="waTop" href="https://wa.me/5493498432943" target="_blank"><small>PEDÍ POR WHATSAPP</small><strong>+54 9 3498 432943</strong></a></div>
  </header>

  <section className="infoStrip">
   <div><Clock3/><p><b>MIÉRCOLES A DOMINGO</b><span>19:00 a 23:30</span></p></div>
   <div><Bike/><p><b>RETIRO Y ENVÍOS</b><span>San Justo y alrededores</span></p></div>
   <div><WalletCards/><p><b>PAGÁ COMO QUIERAS</b><span>Efectivo o transferencia</span></p></div>
  </section>

  <main id="top">
   <section className="hero2"><i className="paint paintViolet pv1"/><i className="paint paintOrange po1"/><i className="paint paintViolet pv2"/><i className="paint paintOrange po2"/>
    <div className="heroCopy">
      <h1>SABORES<br/><em>QUE ENAMORAN</em></h1>
      <p className="script">Hechos con amor, para vos</p>
      <a className="orderBtn" href="#menu">HACÉ TU PEDIDO</a>
    </div>
    <div className="heroFood">
      <img className="burgerHero" src="https://pngimg.com/d/burger_sandwich_PNG4104.png" alt="Hamburguesa gourmet Kenjhi"/>
      <img className="pizzaHero" src="https://pngimg.com/d/pizza_PNG43988.png" alt="Pizza pepperoni Kenjhi"/>
    </div>
   </section>

   <section className="promoRow" id="destacados">
    <a href="#menu" className="promo purple" onClick={()=>setActive('hamburguesas')}><div><small>COMBOS</small><strong>EXPLOSIVOS</strong><p>MÁS RICOS,<br/>MÁS COMPLETOS</p><b>→</b></div><img src={catImg.hamburguesas}/></a>
    <a href="#menu" className="promo orange" onClick={()=>setActive('pizzas')}><div><small>PIZZAS</small><strong>GIGANTES</strong><p>PARA<br/>COMPARTIR</p><b>→</b></div><img src={catImg.pizzas}/></a>
    <a href="#menu" className="promo pink" onClick={()=>setActive('tacos')}><div><small>TACOS</small><strong>IRRESISTIBLES</strong><p>POLLO, VACÍO<br/>O MIXTOS</p><b>→</b></div><img src={catImg.tacos}/></a>
   </section>

   <section className="menuDark" id="menu">
    <div className="menuHead"><div><h2>MENÚ</h2><span></span></div><button onClick={()=>{setActive('all');setQ('')}}>Ver todo →</button></div>
    <div className="menuTools">
      <div className="chips2"><button className={active==='all'?'sel':''} onClick={()=>setActive('all')}>Todo</button>{cats.map(c=><button key={c.id} className={active===c.slug?'sel':''} onClick={()=>setActive(c.slug)}>{c.name}</button>)}</div>
      <div className="search2"><Search size={18}/><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar producto..."/></div>
    </div>
    <div className="productGrid">{filtered.map(p=>{const c=cats.find(x=>x.id===p.category_id);return <article className={!p.is_available?'disabled':''} key={p.id}>
      <div className="productPhoto"><img src={imageFor(p)} alt={p.name}/>{p.is_promo&&<span>PROMO</span>}</div>
      <div className="productInfo"><small>{c?.name}</small><h3>{p.name}</h3><p>{p.description||'Preparado al momento, con todo el sabor Kenjhi.'}</p><div className="productBottom"><strong>{money(p.price)}</strong><button disabled={!p.is_available} onClick={()=>add(p)}><Plus/></button></div></div>
    </article>})}</div>
   </section>

   <section className="benefits"><div><Star/><p><b>CALIDAD PREMIUM</b><span>Ingredientes frescos y seleccionados.</span></p></div><div><Flame/><p><b>SABOR ÚNICO</b><span>Recetas originales que nos hacen únicos.</span></p></div><div><Heart/><p><b>HECHO CON AMOR</b><span>Para que disfrutes siempre lo mejor.</span></p></div></section>
  </main>

  <footer id="contacto"><p>© 2026 Kenjhi Fast Food<br/>Todos los derechos reservados.</p><a href="https://www.instagram.com/kenjhi44/" target="_blank"><Instagram size={18}/>@kenjhi44</a></footer>
  <a className="floatingWa" href="https://wa.me/5493498432943" target="_blank" aria-label="WhatsApp">
    <svg viewBox="0 0 448 512" aria-hidden="true"><path fill="currentColor" d="M380.9 97.1C339 55.1 283.2 32 223.9 32 101.5 32 2 131.5 2 253.9c0 44.9 11.7 88.6 33.9 127L0 480l102.3-26.8c37.5 20.5 79.7 31.3 121.6 31.3h.1c122.3 0 224.1-99.5 224.1-221.9 0-59.3-25.2-115-67.2-157.5zM223.9 447.8c-37.3 0-73.8-10-105.6-28.9l-7.6-4.5-60.7 15.9 16.2-59.2-4.9-7.7C40.5 330.3 29.5 292.1 29.5 253.9 29.5 146.7 116.7 59.5 224 59.5c51.9 0 100.7 20.2 137.4 57 36.7 36.7 58.9 85.5 58.9 137.4 0 107.3-89.1 193.9-196.4 193.9zm101.8-145.3c-5.5-2.8-32.8-16.1-37.9-17.9-5.1-1.9-8.8-2.8-12.5 2.8s-14.3 17.9-17.6 21.5c-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.6-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.3-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.3 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.8-10.5-6.6z"/></svg>
  </a>

  {count>0&&!drawer&&<button className="stickyCart" onClick={()=>setDrawer(true)}><span><ShoppingCart size={18}/>{count} productos</span><b>{money(total)} →</b></button>}
  {drawer&&<div className="overlay" onMouseDown={()=>setDrawer(false)}><aside onMouseDown={e=>e.stopPropagation()}>
    <div className="drawerHead"><div><small>TU PEDIDO</small><h2>Carrito</h2></div><button onClick={()=>setDrawer(false)}><X/></button></div>
    <div className="items">{cart.length?cart.map(i=><div className="item" key={i.p.id}><div><b>{i.p.name}</b><span>{money(i.p.price*i.q)}</span></div><div className="qty"><button onClick={()=>qty(i.p.id,-1)}><Minus/></button>{i.q}<button onClick={()=>qty(i.p.id,1)}><Plus/></button></div></div>):<p>Tu carrito está vacío.</p>}</div>
    <div className="total"><span>Total</span><b>{money(total)}</b></div>
    <div className="form"><input placeholder="Tu nombre *" value={name} onChange={e=>setName(e.target.value)}/><select value={delivery} onChange={e=>setDelivery(e.target.value)}><option>Retiro</option><option>Envío</option></select>{delivery==='Envío'&&<input placeholder="Dirección *" value={address} onChange={e=>setAddress(e.target.value)}/>}<select value={payment} onChange={e=>setPayment(e.target.value)}><option>Efectivo</option><option>Transferencia</option><option>Combinado</option></select><textarea placeholder="Observaciones / alergias" value={obs} onChange={e=>setObs(e.target.value)}/><button className="checkout" onClick={send}>ENVIAR PEDIDO POR WHATSAPP</button></div>
  </aside></div>}
 </div>
}