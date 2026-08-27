'use client';
import {useEffect,useMemo,useState} from 'react';
import {Search,ShoppingBag,Plus,Minus,X,Instagram,Clock3,MapPin} from 'lucide-react';
import {supabase} from '@/lib/supabase';

type Cat={id:string;name:string;slug:string;emoji:string|null};
type Prod={id:string;category_id:string;name:string;description:string|null;price:number;image_url:string|null;is_available:boolean;is_promo:boolean};
type Cart={p:Prod;q:number};
const money=(n:number)=>new Intl.NumberFormat('es-AR',{style:'currency',currency:'ARS',maximumFractionDigits:0}).format(n);
const notes:Record<string,string>={
 tacos:'Podés pedir pollo, vacío o mixtos. Agregados disponibles por unidad.',
 pizzas:'Podés pedir pizzas mixtas. Aclaralo en observaciones.',
 pizzetas:'Sabores sujetos a disponibilidad.',
 'pollo-kentucky':'Elegí tu aderezo favorito para acompañar.'
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
 const send=()=>{if(!name.trim())return alert('Ingresá tu nombre.');if(delivery==='Envío'&&!address.trim())return alert('Ingresá la dirección.');if(!cart.length)return;
  const lines=cart.map(i=>'• '+i.p.name+' x'+i.q+' — '+money(i.p.price*i.q));
  const msg=['Hola Kenjhi 👋','','Quiero hacer este pedido:',...lines,'','TOTAL: '+money(total),'','👤 '+name,'🚚 '+delivery+(address?' — '+address:''),'💳 '+payment,obs?'📝 '+obs:''].filter(Boolean).join('\n');
  window.open('https://wa.me/5493498432943?text='+encodeURIComponent(msg),'_blank');
 };
 return <div className="app">
  <header><a className="brand" href="#"><img src="/kenjhi-logo.jpg"/><span><b>KENJHI</b><small>FAST FOOD</small></span></a><nav><a href="#menu">MENÚ</a><a href="https://www.instagram.com/kenjhi44/" target="_blank">INSTAGRAM</a></nav><button className="cart" onClick={()=>setDrawer(true)}><ShoppingBag size={18}/>{count}</button></header>
  <main>
   <section className="hero"><div className="heroText"><span className="open">● PEDIDOS ONLINE</span><p className="over">ROTISERÍA · SAN JUSTO, SANTA FE</p><h1>HAMBRE<br/><em>DE KENJHI.</em></h1><p className="lead">Hamburguesas, pizzas, tacos y mucho más. Elegí, armá tu pedido y mandalo directo por WhatsApp.</p><div className="actions"><a href="#menu">VER MENÚ</a><a className="ghost" href="https://wa.me/5493498432943" target="_blank">WHATSAPP</a></div><div className="hours"><Clock3 size={17}/> Miércoles a domingo · 19:00 a 23:30</div></div><div className="heroLogo"><div className="glow"/><img src="/kenjhi-logo.jpg"/></div></section>
   <section className="menu" id="menu"><div className="title"><div><p className="over orange">NUESTRO MENÚ</p><h2>Elegí tu antojo.</h2></div><span>{products.length} opciones</span></div>
    <div className="search"><Search size={19}/><input placeholder="Buscar hamburguesa, cheddar, pizza..." value={q} onChange={e=>setQ(e.target.value)}/></div>
    <div className="chips"><button className={active==='all'?'sel':''} onClick={()=>setActive('all')}>🔥 Todo</button>{cats.map(c=><button key={c.id} className={active===c.slug?'sel':''} onClick={()=>setActive(c.slug)}>{c.emoji} {c.name}</button>)}</div>
    {active!=='all'&&notes[active]&&<div className="note">{notes[active]}</div>}
    <div className="grid">{filtered.map(p=>{const c=cats.find(x=>x.id===p.category_id);return <article key={p.id} className={!p.is_available?'off':''}><div className="pic">{p.image_url?<img src={p.image_url}/>:<div className="food">{c?.emoji||'🍔'}<small>KENJHI</small></div>}{p.is_promo&&<i>PROMO</i>}</div><div className="body"><small>{c?.name}</small><h3>{p.name}</h3>{p.description&&<p>{p.description}</p>}<div><strong>{money(p.price)}</strong><button disabled={!p.is_available} onClick={()=>add(p)}><Plus/></button></div></div></article>)}</div>
   </section>
   <section className="stripe"><div><p className="over">KENJHI FAST FOOD</p><h2>COMIDA RICA.<br/>SIN VUELTAS.</h2></div><p>Tu rotisería de San Justo. Pedidos simples, sabores grandes y atención directa por WhatsApp.</p></section>
   <section className="contact"><div><p className="over orange">CONTACTO</p><h2>¿Listo para pedir?</h2><p><Clock3 size={17}/> Mié–Dom · 19:00–23:30</p></div><div><a href="https://wa.me/5493498432943" target="_blank">WhatsApp</a><a href="https://www.instagram.com/kenjhi44/" target="_blank"><Instagram size={18}/>@kenjhi44</a></div></section>
  </main>
  <footer><div className="brand"><img src="/kenjhi-logo.jpg"/><span><b>KENJHI</b><small>FAST FOOD</small></span></div><span>San Justo · Santa Fe</span></footer>
  {count>0&&!drawer&&<button className="sticky" onClick={()=>setDrawer(true)}><span><ShoppingBag size={18}/>{count} productos</span><b>{money(total)} →</b></button>}
  {drawer&&<div className="overlay" onMouseDown={()=>setDrawer(false)}><aside onMouseDown={e=>e.stopPropagation()}><div className="drawerHead"><div><p className="over orange">TU PEDIDO</p><h2>Carrito</h2></div><button onClick={()=>setDrawer(false)}><X/></button></div><div className="items">{cart.length?cart.map(i=><div className="item" key={i.p.id}><div><b>{i.p.name}</b><span>{money(i.p.price*i.q)}</span></div><div className="qty"><button onClick={()=>qty(i.p.id,-1)}><Minus/></button>{i.q}<button onClick={()=>qty(i.p.id,1)}><Plus/></button></div></div>):<p>Tu carrito está vacío.</p>}</div><div className="total"><span>Total</span><b>{money(total)}</b></div><div className="form"><input placeholder="Tu nombre *" value={name} onChange={e=>setName(e.target.value)}/><select value={delivery} onChange={e=>setDelivery(e.target.value)}><option>Retiro</option><option>Envío</option></select>{delivery==='Envío'&&<input placeholder="Dirección *" value={address} onChange={e=>setAddress(e.target.value)}/>}<select value={payment} onChange={e=>setPayment(e.target.value)}><option>Efectivo</option><option>Transferencia</option><option>Combinado</option></select><textarea placeholder="Observaciones / alergias" value={obs} onChange={e=>setObs(e.target.value)}/><button className="wa" onClick={send}>ENVIAR PEDIDO POR WHATSAPP</button></div></aside></div>}
 </div>
}