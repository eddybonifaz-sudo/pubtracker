import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, ResponsiveContainer, AreaChart, Area
} from "recharts";
import {
  BookOpen, Users, TrendingUp, FileText, Plus, Search, LogOut,
  ChevronRight, ChevronLeft, LayoutDashboard, Library, UserPlus, X, Check,
  AlertCircle, Loader2, Filter, Calendar, Globe, Award, BarChart3,
  ClipboardList, BookMarked, Save, CheckCircle2, XCircle,
  Layers, Clock, Star, Eye, Edit3, LogIn, Trash2,
  FileSpreadsheet, FileDown, RefreshCw, Shield, User, Mail, Lock, UserCheck,
  Settings, KeyRound
} from "lucide-react";
import * as XLSX from "sheetjs";

/* ═══════════════════════════════════════════════════════════════
   ⚙️ CONFIGURACIÓN — Pegue aquí su URL de Google Apps Script
   ═══════════════════════════════════════════════════════════════
   1. Crear Google Sheet → Extensiones → Apps Script
   2. Pegar google-apps-script-v2.js → Ejecutar inicializarSistema()
   3. Implementar como webapp → Copiar URL → Pegar abajo
   ═══════════════════════════════════════════════════════════════ */
const API_URL = "https://script.google.com/macros/s/AKfycbwn9Tz7fYeIg_ldcZEoo_X_C1x9pagOZx7dGC1oGk-GSEmZqZvM6DNMRbnb1d2dGU6x/exec";
// Ejemplo: const API_URL = "https://script.google.com/macros/s/AKfycbx.../exec";

/* ═══════════════════════════════════════════════════════════════
   🔑 CREDENCIALES DE ADMINISTRADOR
   ═══════════════════════════════════════════════════════════════
   Email: admin
   Contraseña: UNO2025
   
   El administrador tiene acceso completo:
   • Ver y gestionar TODAS las publicaciones
   • Dar de alta, editar y eliminar docentes
   • Cambiar estados de publicaciones
   • Registrar publicaciones para cualquier docente
   • Descargar Excel e informes Word
   • Dashboard siempre visible
   ═══════════════════════════════════════════════════════════════ */

/* ── API ── */
async function apiGet(a){if(!API_URL)return null;try{const r=await fetch(`${API_URL}?action=${a}`);return await r.json()}catch(e){return null}}
async function apiPost(b){if(!API_URL)return null;try{const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(b)});return await r.json()}catch(e){return null}}

/* ── Paleta y constantes ── */
const P={teal:"#115e59",tealL:"#0d9488",tealBg:"#ccfbf1",navy:"#0f172a",slate:"#64748b",rose:"#be123c",roseBg:"#ffe4e6",green:"#047857",greenBg:"#d1fae5",violet:"#6d28d9",violetBg:"#ede9fe",sky:"#0369a1",skyBg:"#e0f2fe",gold:"#a16207",goldBg:"#fef3c7"};
const CC=["#115e59","#a16207","#6d28d9","#be123c","#0369a1","#047857","#d97706","#9333ea","#e11d48","#0891b2","#65a30d"];
const TIPOS=["Artículo Científico","Artículo Regional","Libro","Capítulo de Libro","Proceeding","Tesis","Ponencia"];
const ESTADOS=["Publicado","Aceptado","En revisión","Enviado","En preparación","Rechazado"];
const CUARTILES=["Q1","Q2","Q3","Q4","N/A"];
const INDEXES=["Scopus","Wos(ESCI)","Web of Science","Latindex Catálogo","Latindex Directorio","DOAJ","ERIHPLUS","CLASE","REDIB","MIAR","Index Coppernicus","SciELO"];

/* ── Datos demo ── */
const DEMO=((()=>{const R=[
{n:"EDISON FERNANDO",a:"BONIFAZ ARANDA",e:"ebonifaz@uotavalo.edu.ec",est:"Publicado",t:"Los consultorios jurídicos gratuitos como espacios de formación académica",tp:"Artículo Científico",f:"25/12/2025",q:"Q2",rv:"Rev. Pedagógica Univ. y Didáctica del Derecho",is:"0719-5885",i1:"Scopus",i2:"Wos(ESCI)",i3:"Latindex Catálogo",rg:"Sí"},
{n:"ALEJANDRO",a:"FLORES SUAREZ",e:"aflores@uotavalo.edu.ec",est:"Publicado",t:"Integración del TikTok en el aula",tp:"Artículo Regional",f:"18/10/2025",q:"N/A",rv:"UEPLC",is:"2631-2689",i1:"Latindex Catálogo",i2:"",i3:"",rg:"Sí"},
{n:"ALEJANDRO",a:"FLORES SUAREZ",e:"aflores@uotavalo.edu.ec",est:"Publicado",t:"Educational Transformation through Competency-Based Learning",tp:"Artículo Científico",f:"15/12/2025",q:"Q1",rv:"Scientific Culture",is:"2407-9529",i1:"Scopus",i2:"",i3:"",rg:"Sí"},
{n:"ALEJANDRO",a:"FLORES SUAREZ",e:"aflores@uotavalo.edu.ec",est:"Aceptado",t:"Impact Of Self-Regulated Learning On Academic Performance",tp:"Artículo Científico",f:"15/10/2025",q:"Q1",rv:"Cultura Journal",is:"2065-5002",i1:"Scopus",i2:"ERIHPLUS",i3:"Index Coppernicus",rg:"Sí"},
{n:"ALEJANDRO",a:"FLORES SUAREZ",e:"aflores@uotavalo.edu.ec",est:"Publicado",t:"Formación Docente en Educación Superior",tp:"Libro",f:"6/2/2026",q:"N/A",rv:"Edulearn Academy",is:"978-9942-7494-3-7",i1:"",i2:"",i3:"",rg:"No"},
{n:"DARWIN PATRICIO",a:"GARCIA AYALA",e:"dgarcia@uotavalo.edu.ec",est:"Publicado",t:"Estrategias docentes para mejorar el rendimiento académico",tp:"Artículo Regional",f:"14/1/2026",q:"N/A",rv:"Revista UNIMAR",is:"2216-0116",i1:"ERIHPLUS",i2:"DOAJ",i3:"CLASE",rg:"No"},
{n:"DARWIN PATRICIO",a:"GARCIA AYALA",e:"dgarcia@uotavalo.edu.ec",est:"Publicado",t:"Escribir para sanar: explorando vínculos entre la escritura y la salud mental",tp:"Artículo Regional",f:"11/4/2025",q:"N/A",rv:"Academia y Virtualidad",is:"2011-0731",i1:"Latindex Catálogo",i2:"DOAJ",i3:"CLASE",rg:"Sí"},
{n:"LEDYS",a:"HERNANDEZ CHACÓN",e:"lhernandez@uotavalo.edu.ec",est:"Publicado",t:"Más allá de los indicadores: Dimensiones emergentes en la evaluación de impacto",tp:"Artículo Regional",f:"3/10/2025",q:"N/A",rv:"Revista Social Fronteriza",is:"2806-5913",i1:"Latindex Catálogo",i2:"CLASE",i3:"",rg:"Sí"},
{n:"LEDYS",a:"HERNANDEZ CHACÓN",e:"lhernandez@uotavalo.edu.ec",est:"Publicado",t:"Uso de la IA Generativa con Pensamiento Crítico en Estudiantes de la UNO",tp:"Artículo Regional",f:"16/10/2025",q:"N/A",rv:"Veritas",is:"2965-6052",i1:"Latindex Catálogo",i2:"ERIHPLUS",i3:"",rg:"Sí"},
{n:"JULIANA ELIZABETH",a:"CAICEDO PANTOJA",e:"jcaicedo@uotavalo.edu.ec",est:"Publicado",t:"Estrategias de enseñanza basadas en Realidad Aumentada",tp:"Artículo Regional",f:"6/5/2025",q:"N/A",rv:"Technology Rain Journal",is:"2953-464X",i1:"Latindex Catálogo",i2:"",i3:"",rg:"Sí"},
{n:"DALMA JOSELYN",a:"JATIVA AVILA",e:"djativa@uotavalo.edu.ec",est:"Publicado",t:"Neuroeducación emocional",tp:"Libro",f:"1/1/2026",q:"N/A",rv:"Mundos Alternos",is:"978-9942-593-07-8",i1:"",i2:"",i3:"",rg:"No"},
{n:"DALMA JOSELYN",a:"JATIVA AVILA",e:"djativa@uotavalo.edu.ec",est:"Publicado",t:"Neurodidáctica: aplicación de las neurociencias en la enseñanza",tp:"Artículo Regional",f:"1/7/2025",q:"N/A",rv:"Rev. Investigación en C. Educación",is:"3073-1461",i1:"Latindex Catálogo",i2:"",i3:"",rg:"Sí"},
{n:"KAREN ANDREA",a:"ARMAS SANCHEZ",e:"karmas@uotavalo.edu.ec",est:"Publicado",t:"Validación del ejercicio profesional como reconocimiento a la experiencia laboral",tp:"Capítulo de Libro",f:"6/11/2025",q:"N/A",rv:"Editorial Octaedro",is:"9788410792333",i1:"",i2:"",i3:"",rg:"No"},
{n:"JESUS FRANCISCO",a:"GONZALEZ ALONSO",e:"jgonzalez@uotavalo.edu.ec",est:"Publicado",t:"Gestión Educativa",tp:"Libro",f:"7/11/2025",q:"N/A",rv:"Editorial Grupo Compás",is:"978-9942-53-101-8",i1:"Scopus",i2:"",i3:"",rg:"Sí"},
];const am={};let ac=1,pc=1;const ps=[],lk=[];
R.forEach(r=>{const k=r.n+"|"+r.a;if(!am[k])am[k]={id:"A"+String(ac++).padStart(3,"0"),nombres:r.n,apellidos:r.a,email:r.e,rol:"autor",activo:true};const pid="P"+String(pc++).padStart(3,"0");ps.push({id:pid,titulo:r.t,tipoPublicacion:r.tp,estadoPublicacion:r.est,fechaPublicacion:r.f,cuartil:r.q,revista:r.rv,issn:r.is,volumen:"",numero:"",paginas:"",doi:"",url:"",indexacion1:r.i1,indexacion2:r.i2,indexacion3:r.i3,registrado:r.rg,autoresExternos:r.ext||""});lk.push({pubId:pid,autorId:am[k].id,orden:1});});
return{publicaciones:ps,autores:Object.values(am),pubAutores:lk};})());

/* ── Micro components ── */
const Bdg=({children,c=P.slate,bg})=><span style={{background:bg||c+"18",color:c,fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{children}</span>;
const EBdg=({e})=>{const m={"Publicado":[P.green,P.greenBg],"Aceptado":[P.sky,P.skyBg],"En revisión":[P.gold,P.goldBg],"Enviado":[P.violet,P.violetBg],"En preparación":[P.slate,"#f1f5f9"],"Rechazado":[P.rose,P.roseBg]};const[c,bg]=m[e]||[P.slate,"#f1f5f9"];return<Bdg c={c} bg={bg}>{e||"Sin estado"}</Bdg>};
const QBdg=({q})=>{if(!q||q==="N/A"||!q.startsWith("Q"))return null;const m={Q1:[P.green,"#fff"],Q2:[P.teal,"#fff"],Q3:[P.gold,"#fff"],Q4:["#ea580c","#fff"]};const[bg,c]=m[q]||[P.slate,"#fff"];return<Bdg c={c} bg={bg}>{q}</Bdg>};
const Inp=({value,onChange,placeholder,type="text",icon:Ic})=><div style={{position:"relative"}}>{Ic&&<Ic size={15} style={{position:"absolute",left:11,top:11,color:"#94a3b8"}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:Ic?"9px 12px 9px 34px":"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=P.teal} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>;
const Sel=({value,onChange,options,placeholder,style:st})=><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:value?"#1e293b":"#94a3b8",background:"white",outline:"none",boxSizing:"border-box",...st}}><option value="">{placeholder||"Seleccionar…"}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Btn=({children,onClick,primary,danger,small,disabled,icon:Ic})=><button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:small?"5px 10px":"9px 18px",borderRadius:10,border:primary||danger?"none":"1.5px solid #e2e8f0",fontSize:small?11:13,fontWeight:primary?700:500,cursor:disabled?"not-allowed":"pointer",background:primary?`linear-gradient(135deg,${P.teal},${P.green})`:danger?P.rose:"white",color:primary||danger?"white":"#475569",opacity:disabled?.5:1,transition:"all .15s",boxShadow:primary?"0 3px 10px rgba(17,94,89,.25)":"none"}}>{Ic&&<Ic size={small?12:15}/>}{children}</button>;

/* ── Export Excel ── */
function exportExcel(pubs,autores,links){
  const rows=pubs.map(p=>{const aI=links.filter(l=>l.pubId===p.id).map(l=>l.autorId);const nm=aI.map(id=>{const a=autores.find(x=>x.id===id);return a?`${a.nombres} ${a.apellidos}`:""}).filter(Boolean).join("; ");
  return{"Título":p.titulo,"Autores UNO":nm,"Autores Externos":p.autoresExternos||"","Tipo":p.tipoPublicacion,"Estado":p.estadoPublicacion,"Fecha":p.fechaPublicacion,"Cuartil":p.cuartil,"Revista":p.revista,"ISSN/ISBN":p.issn,"Vol":p.volumen,"Núm":p.numero,"Págs":p.paginas,"DOI":p.doi,"URL":p.url,"Idx 1":p.indexacion1,"Idx 2":p.indexacion2,"Idx 3":p.indexacion3,"Reg.DI":p.registrado}});
  const ws=XLSX.utils.json_to_sheet(rows);ws["!cols"]=[{wch:55},{wch:28},{wch:35},{wch:18},{wch:14},{wch:12},{wch:5},{wch:28},{wch:16},{wch:6},{wch:6},{wch:8},{wch:35},{wch:35},{wch:18},{wch:18},{wch:18},{wch:6}];
  const wb=XLSX.utils.book_new();XLSX.utils.book_append_sheet(wb,ws,"Publicaciones");XLSX.writeFile(wb,`PubTracker_${new Date().toISOString().slice(0,10)}.xlsx`);
}

/* ── Export Word por docente ── */
function exportWord(autor,pubs,links){
  const aL=links.filter(l=>l.autorId===autor.id);const aP=pubs.filter(p=>aL.some(l=>l.pubId===p.id));
  const pub=aP.filter(p=>p.estadoPublicacion==="Publicado").length;const sc=aP.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;
  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>body{font-family:Arial,sans-serif;margin:40px 60px;color:#1e293b}h1{color:#115e59;font-size:22px;border-bottom:3px solid #115e59;padding-bottom:8px}h2{color:#0f172a;font-size:16px;margin-top:28px;border-bottom:1px solid #e2e8f0;padding-bottom:4px}table{width:100%;border-collapse:collapse;margin:12px 0;font-size:11px}th{background:#f1f5f9;color:#475569;text-align:left;padding:8px 10px;border:1px solid #e2e8f0;font-size:10px;text-transform:uppercase}td{padding:7px 10px;border:1px solid #e2e8f0}tr:nth-child(even){background:#f8fafc}.footer{margin-top:40px;text-align:center;color:#94a3b8;font-size:10px;border-top:1px solid #e2e8f0;padding-top:12px}</style></head><body>
  <div style="text-align:center"><p style="font-size:11px;color:#94a3b8;letter-spacing:2px">UNIVERSIDAD DE OTAVALO · FACULTAD DE CIENCIAS SOCIALES Y PEDAGÓGICAS</p><h1 style="border:none;font-size:24px">Informe de Producción Científica</h1><p style="font-size:18px;color:#0f172a;font-weight:bold">${autor.nombres} ${autor.apellidos}</p><p style="color:#64748b;font-size:12px">${new Date().toLocaleDateString("es-EC",{year:"numeric",month:"long",day:"numeric"})}</p></div>
  <h2>Resumen</h2><table><tr><td style="text-align:center;width:25%"><div style="font-size:24px;font-weight:bold;color:#115e59">${aP.length}</div><div style="font-size:10px;color:#64748b">Total</div></td><td style="text-align:center;width:25%"><div style="font-size:24px;font-weight:bold;color:#047857">${pub}</div><div style="font-size:10px;color:#64748b">Publicadas</div></td><td style="text-align:center;width:25%"><div style="font-size:24px;font-weight:bold;color:#a16207">${sc}</div><div style="font-size:10px;color:#64748b">Scopus</div></td><td style="text-align:center;width:25%"><div style="font-size:24px;font-weight:bold;color:#0369a1">${aP.length-pub}</div><div style="font-size:10px;color:#64748b">En proceso</div></td></tr></table>
  <h2>Detalle de Publicaciones</h2><table><tr><th>#</th><th>Título</th><th>Tipo</th><th>Estado</th><th>Cuartil</th><th>Revista</th><th>Fecha</th><th>Indexación</th><th>Coautores Ext.</th><th>Reg.</th></tr>${aP.map((p,i)=>`<tr><td>${i+1}</td><td><strong>${p.titulo}</strong></td><td>${p.tipoPublicacion||""}</td><td>${p.estadoPublicacion||""}</td><td style="text-align:center;font-weight:bold">${p.cuartil||"—"}</td><td>${p.revista||""}</td><td>${p.fechaPublicacion||""}</td><td>${[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"—"}</td><td style="font-size:9px;color:#6d28d9">${p.autoresExternos||"—"}</td><td style="text-align:center">${p.registrado==="Sí"?"✓":"✗"}</td></tr>`).join("")}</table>
  <div class="footer"><p>PubTracker · Coordinación de Investigación · FCSyP · Universidad de Otavalo</p></div></body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/msword"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`Informe_${autor.apellidos.replace(/\s/g,"_")}_${new Date().toISOString().slice(0,10)}.doc`;a.click();URL.revokeObjectURL(u);
}

/* ════════════════════════════════════════
   PANTALLA LOGIN / REGISTRO
   ════════════════════════════════════════ */
function AuthScreen({onLogin}){
  const[mode,setMode]=useState("login");const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[nombres,setNombres]=useState("");const[apellidos,setApellidos]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const doLogin=async()=>{if(!email||!pass)return setError("Complete todos los campos");setLoading(true);setError("");
    if(API_URL){const r=await apiPost({action:"login",email,password:pass});if(r?.ok)onLogin(r.user);else setError(r?.error||"Error de conexión")}
    else{if(email==="admin"&&pass==="UNO2025")onLogin({id:"admin",nombres:"ADMINISTRADOR",apellidos:"SISTEMA",email:"admin",rol:"admin"});else{const a=DEMO.autores.find(x=>x.email?.toLowerCase()===email.toLowerCase());if(a)onLogin({...a,rol:"autor"});else setError("Admin: admin / UNO2025 · Docente: aflores@uotavalo.edu.ec / cualquier clave")}}setLoading(false)};
  const doReg=async()=>{if(!email||!pass||!nombres||!apellidos)return setError("Complete todos los campos");if(pass.length<5)return setError("Contraseña mín. 5 caracteres");setLoading(true);setError("");
    if(API_URL){const r=await apiPost({action:"register",email,password:pass,nombres,apellidos});if(r?.ok)onLogin(r.user);else setError(r?.error||"Error")}
    else setError("Registro solo funciona con Google Sheets conectado");setLoading(false)};
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${P.navy} 0%,${P.teal} 50%,${P.tealL} 100%)`,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{width:420,background:"white",borderRadius:20,boxShadow:"0 25px 80px rgba(0,0,0,.3)",overflow:"hidden",animation:"fadeUp .5s ease"}}>
        <div style={{background:`linear-gradient(135deg,${P.navy},${P.teal})`,padding:"28px 36px 20px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><BookOpen size={22} style={{color:"white"}}/></div>
          <h1 style={{color:"white",fontSize:22,fontWeight:800,margin:0,fontFamily:"'Playfair Display',serif"}}>PubTracker</h1>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:11,margin:"4px 0 0"}}>Facultad de Ciencias Sociales y Pedagógicas · UNO</p>
        </div>
        <div style={{display:"flex",borderBottom:"1px solid #f1f5f9"}}>{[["login","Iniciar Sesión"],["register","Registrarse"]].map(([k,l])=><button key={k} onClick={()=>{setMode(k);setError("")}} style={{flex:1,padding:"11px",border:"none",cursor:"pointer",fontSize:13,fontWeight:mode===k?700:500,color:mode===k?P.teal:"#94a3b8",background:mode===k?"white":"#fafbfc",borderBottom:mode===k?`3px solid ${P.teal}`:"3px solid transparent"}}>{l}</button>)}</div>
        <div style={{padding:"20px 36px 28px"}}>
          {error&&<div style={{background:P.roseBg,color:P.rose,padding:"8px 12px",borderRadius:10,fontSize:12,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><AlertCircle size={14}/>{error}</div>}
          {mode==="register"&&<><div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NOMBRES</label><Inp value={nombres} onChange={setNombres} placeholder="ALEJANDRO" icon={User}/></div><div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>APELLIDOS</label><Inp value={apellidos} onChange={setApellidos} placeholder="FLORES SUAREZ" icon={UserCheck}/></div></>}
          <div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>EMAIL</label><Inp value={email} onChange={setEmail} placeholder={mode==="login"?"admin o email docente":"correo@uotavalo.edu.ec"} type="email" icon={Mail}/></div>
          <div style={{marginBottom:18}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONTRASEÑA</label><Inp value={pass} onChange={setPass} placeholder="••••••" type="password" icon={Lock}/></div>
          <button onClick={mode==="login"?doLogin:doReg} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${P.teal},${P.green})`,color:"white",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(17,94,89,.3)"}}>{loading?<Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>:mode==="login"?<><LogIn size={16}/>Ingresar</>:<><UserPlus size={16}/>Crear Cuenta</>}</button>
          {!API_URL&&<div style={{marginTop:14,padding:10,background:P.goldBg,borderRadius:10,border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>Modo Demo</p><p style={{fontSize:10,color:"#92400e",margin:"3px 0 0"}}>🔑 Admin: admin / UNO2025</p><p style={{fontSize:10,color:"#92400e",margin:"2px 0 0"}}>👤 Docente: aflores@uotavalo.edu.ec / cualquier clave</p></div>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   FORMULARIO PUBLICACIÓN (MODAL)
   ════════════════════════════════════════ */
function PubForm({pub,autores,pubAutores,onSave,onCancel,currentUser}){
  const isE=!!pub;const[step,setStep]=useState(1);
  const[form,setForm]=useState(()=>pub?{...pub}:{titulo:"",tipoPublicacion:"",estadoPublicacion:"En preparación",fechaPublicacion:"",cuartil:"N/A",revista:"",issn:"",volumen:"",numero:"",paginas:"",doi:"",url:"",indexacion1:"",indexacion2:"",indexacion3:"",registrado:"No",autoresExternos:""});
  const[selA,setSelA]=useState(()=>pub?pubAutores.filter(l=>l.pubId===pub.id).map(l=>l.autorId):(currentUser?.rol!=="admin"?[currentUser?.id].filter(Boolean):[]));
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{if(!form.titulo.trim())return alert("Título requerido");if(selA.length===0)return alert("Seleccione al menos un autor");onSave({...form,id:pub?.id},selA)};
  const steps=["Información","Bibliometría","Indexación"];
  return(
    <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.12)",maxWidth:680,width:"100%"}}>
      <div style={{background:`linear-gradient(135deg,${P.navy},${P.teal})`,padding:"18px 24px",color:"white"}}><h2 style={{fontSize:17,fontWeight:700,margin:0,fontFamily:"'Playfair Display',serif"}}>{isE?"Editar Publicación":"Nueva Publicación"}</h2></div>
      <div style={{display:"flex",borderBottom:"1px solid #f1f5f9",background:"#fafbfc"}}>{steps.map((t,i)=><button key={i} onClick={()=>setStep(i+1)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:12,fontWeight:step===i+1?700:500,color:step===i+1?P.teal:step>i+1?P.green:"#94a3b8",background:step===i+1?"white":"transparent",borderBottom:step===i+1?`3px solid ${P.teal}`:"3px solid transparent"}}>{i+1}. {t}</button>)}</div>
      <div style={{padding:22,minHeight:260}}>
        {step===1&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TÍTULO *</label><Inp value={form.titulo} onChange={v=>s("titulo",v)} placeholder="Título completo"/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TIPO *</label><Sel value={form.tipoPublicacion} onChange={v=>s("tipoPublicacion",v)} options={TIPOS}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>FECHA</label><Inp value={form.fechaPublicacion} onChange={v=>s("fechaPublicacion",v)} placeholder="DD/MM/AAAA"/></div>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>AUTORES FACULTAD *</label><div style={{display:"flex",flexWrap:"wrap",gap:5,padding:8,borderRadius:10,border:"1.5px solid #e2e8f0",maxHeight:100,overflowY:"auto"}}>{autores.map(a=>{const sel=selA.includes(a.id);return<button key={a.id} onClick={()=>setSelA(p=>sel?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:sel?`2px solid ${P.teal}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:sel?600:400,background:sel?P.tealBg:"white",color:sel?P.teal:"#475569",cursor:"pointer"}}>{sel&&<Check size={10}/>}{a.nombres} {a.apellidos}</button>})}</div></div>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:P.violet,display:"block",marginBottom:3}}>AUTORES EXTERNOS <span style={{fontWeight:400,color:"#94a3b8"}}>(coautores de otras instituciones)</span></label><textarea value={form.autoresExternos||""} onChange={e=>s("autoresExternos",e.target.value)} placeholder="Ej: Juan Pérez (U. Central), María López (PUCE)&#10;Separe cada autor con coma o salto de línea" rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}} onFocus={e=>e.target.style.borderColor=P.violet} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/><p style={{fontSize:9,color:"#94a3b8",margin:"2px 0 0"}}>Incluya nombre completo e institución de origen. Se guardarán en la hoja de Google Sheets.</p></div>
        </div>}
        {step===2&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>REVISTA / EDITORIAL</label><Inp value={form.revista} onChange={v=>s("revista",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>ISSN / ISBN</label><Inp value={form.issn} onChange={v=>s("issn",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CUARTIL</label><Sel value={form.cuartil} onChange={v=>s("cuartil",v)} options={CUARTILES}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>VOLUMEN</label><Inp value={form.volumen} onChange={v=>s("volumen",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NÚMERO</label><Inp value={form.numero} onChange={v=>s("numero",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>PÁGINAS</label><Inp value={form.paginas} onChange={v=>s("paginas",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>DOI</label><Inp value={form.doi} onChange={v=>s("doi",v)}/></div>
        </div>}
        {step===3&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:12}}>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>ESTADO</label><Sel value={form.estadoPublicacion} onChange={v=>s("estadoPublicacion",v)} options={ESTADOS}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>REG. DIR. INV.</label><Sel value={form.registrado} onChange={v=>s("registrado",v)} options={["Sí","No"]}/></div>
          <div></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>INDEXACIÓN 1</label><Sel value={form.indexacion1} onChange={v=>s("indexacion1",v)} options={INDEXES} placeholder="Ninguna"/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>INDEXACIÓN 2</label><Sel value={form.indexacion2} onChange={v=>s("indexacion2",v)} options={INDEXES} placeholder="Ninguna"/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>INDEXACIÓN 3</label><Sel value={form.indexacion3} onChange={v=>s("indexacion3",v)} options={INDEXES} placeholder="Ninguna"/></div>
          <div style={{gridColumn:"span 3",marginTop:8,padding:14,background:"#f8fafc",borderRadius:10,border:"1px dashed #cbd5e1"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",textTransform:"uppercase",letterSpacing:1,margin:"0 0 6px"}}>Vista Previa</p>
            <h4 style={{fontSize:13,fontWeight:700,color:P.navy,margin:"0 0 5px"}}>{form.titulo||"Sin título"}</h4>
            <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:form.autoresExternos?5:0}}><EBdg e={form.estadoPublicacion}/><QBdg q={form.cuartil}/>{form.tipoPublicacion&&<Bdg>{form.tipoPublicacion}</Bdg>}</div>
            {form.autoresExternos&&<p style={{fontSize:10,color:P.violet,margin:0}}><span style={{fontWeight:600}}>Autores externos:</span> {form.autoresExternos}</p>}
          </div>
        </div>}
      </div>
      <div style={{display:"flex",justifyContent:"space-between",padding:"12px 22px",borderTop:"1px solid #f1f5f9",background:"#fafbfc"}}>
        <Btn onClick={onCancel}>Cancelar</Btn>
        <div style={{display:"flex",gap:8}}>{step>1&&<Btn onClick={()=>setStep(step-1)} icon={ChevronLeft}>Anterior</Btn>}{step<3?<Btn primary onClick={()=>setStep(step+1)}>Siguiente <ChevronRight size={13} style={{marginLeft:3}}/></Btn>:<Btn primary onClick={submit} icon={Save}>{isE?"Guardar":"Registrar"}</Btn>}</div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MODAL CAMBIAR ESTADO
   ════════════════════════════════════════ */
function StatusModal({pub,onSave,onClose}){
  const[est,setEst]=useState(pub.estadoPublicacion);const[reg,setReg]=useState(pub.registrado||"No");
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Cambiar Estado</h3><button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button></div>
    <p style={{fontSize:12,color:"#64748b",marginBottom:14,lineHeight:1.4}}>{pub.titulo}</p>
    <div style={{marginBottom:12}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>NUEVO ESTADO</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{ESTADOS.map(e=><button key={e} onClick={()=>setEst(e)} style={{padding:"5px 12px",borderRadius:20,border:est===e?`2px solid ${P.teal}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:est===e?700:400,background:est===e?P.tealBg:"white",color:est===e?P.teal:"#475569",cursor:"pointer"}}>{e}</button>)}</div></div>
    <div style={{marginBottom:18}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>REGISTRADO DIR. INVESTIGACIÓN</label><div style={{display:"flex",gap:6}}>{["Sí","No"].map(v=><button key={v} onClick={()=>setReg(v)} style={{padding:"5px 18px",borderRadius:20,border:reg===v?`2px solid ${P.teal}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:reg===v?700:400,background:reg===v?P.tealBg:"white",color:reg===v?P.teal:"#475569",cursor:"pointer"}}>{v}</button>)}</div></div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn onClick={onClose}>Cancelar</Btn><Btn primary onClick={()=>onSave(pub.id,est,reg)} icon={Check}>Actualizar</Btn></div>
  </div>);
}

/* ════════════════════════════════════════
   MODAL ALTA DOCENTE (solo admin)
   ════════════════════════════════════════ */
function DocenteForm({onSave,onClose}){
  const[n,setN]=useState("");const[a,setA]=useState("");const[e,setE]=useState("");const[p,setP]=useState("123456");
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Alta de Docente</h3><button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button></div>
    <div style={{display:"flex",flexDirection:"column",gap:10}}>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NOMBRES *</label><Inp value={n} onChange={setN} placeholder="NOMBRE COMPLETO" icon={User}/></div>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>APELLIDOS *</label><Inp value={a} onChange={setA} placeholder="APELLIDO PATERNO MATERNO" icon={UserCheck}/></div>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>EMAIL *</label><Inp value={e} onChange={setE} placeholder="docente@uotavalo.edu.ec" type="email" icon={Mail}/></div>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONTRASEÑA INICIAL</label><Inp value={p} onChange={setP} placeholder="123456" icon={KeyRound}/><p style={{fontSize:10,color:"#94a3b8",margin:"2px 0 0"}}>El docente podrá cambiarla después</p></div>
    </div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end",marginTop:16}}><Btn onClick={onClose}>Cancelar</Btn><Btn primary onClick={()=>{if(!n||!a||!e)return alert("Complete nombre, apellido y email");onSave({nombres:n.toUpperCase(),apellidos:a.toUpperCase(),email:e.toLowerCase(),password:p})}} icon={UserPlus}>Registrar Docente</Btn></div>
  </div>);
}

/* ════════════════════════════════════════════════════════
   APP PRINCIPAL — Dashboard siempre visible
   ════════════════════════════════════════════════════════ */
export default function App(){
  const[user,setUser]=useState(null);
  const[data,setData]=useState(DEMO);
  const[view,setView]=useState("pubs");
  const[showForm,setShowForm]=useState(false);
  const[editPub,setEditPub]=useState(null);
  const[statusPub,setStatusPub]=useState(null);
  const[showDocForm,setShowDocForm]=useState(false);
  const[sideOpen,setSideOpen]=useState(true);
  const[toast,setToast]=useState(null);
  const[loading,setLoading]=useState(false);
  const[connected,setConnected]=useState(false);
  const[search,setSearch]=useState("");
  const[fEstado,setFEstado]=useState("");
  const[fTipo,setFTipo]=useState("");
  const[fAutor,setFAutor]=useState("");

  const showToast=(m,t="success")=>{setToast({m,t});setTimeout(()=>setToast(null),3000)};
  const isAdmin=user?.rol==="admin";

  const loadData=useCallback(async()=>{if(!API_URL)return;setLoading(true);const r=await apiGet("getAll");if(r&&!r.error&&r.publicaciones){setData({publicaciones:r.publicaciones,autores:r.autores||[],pubAutores:r.pubAutores||[]});setConnected(true)}setLoading(false)},[]);
  useEffect(()=>{if(user)loadData()},[user,loadData]);

  const handleSavePub=async(pub,autorIds)=>{const isEd=!!editPub;setData(prev=>{const np=[...prev.publicaciones];const nl=prev.pubAutores.filter(l=>l.pubId!==pub.id);if(!pub.id)pub.id="P"+Date.now().toString(36);const ex=np.findIndex(p=>p.id===pub.id);if(ex>=0)np[ex]=pub;else np.push(pub);autorIds.forEach((a,i)=>nl.push({pubId:pub.id,autorId:a,orden:i+1}));return{...prev,publicaciones:np,pubAutores:nl}});setShowForm(false);setEditPub(null);
    if(API_URL){const action=isEd?"updatePub":"addPub";const body=isEd?{action,id:pub.id,pub,autoresIds:autorIds}:{action,pub,autoresIds:autorIds,userId:user?.id};const r=await apiPost(body);if(r?.ok){showToast(isEd?"Actualizada ✓":"Registrada ✓");loadData()}else showToast("Error sync: "+(r?.error||""),"error")}else showToast(isEd?"Actualizada":"Registrada")};

  const handleStatus=async(id,estado,registrado)=>{setData(prev=>({...prev,publicaciones:prev.publicaciones.map(p=>p.id===id?{...p,estadoPublicacion:estado,registrado}:p)}));setStatusPub(null);
    if(API_URL){const r=await apiPost({action:"updateStatus",id,estado,registrado});if(r?.ok)showToast("Estado actualizado ✓");else showToast("Error sync","error")}else showToast("Estado actualizado")};

  const handleAddDocente=async(doc)=>{const id="A"+Date.now().toString(36);setData(prev=>({...prev,autores:[...prev.autores,{id,nombres:doc.nombres,apellidos:doc.apellidos,email:doc.email,rol:"autor",activo:true}]}));setShowDocForm(false);
    if(API_URL){const r=await apiPost({action:"addAutor",...doc});if(r?.ok){showToast("Docente registrado ✓");loadData()}else showToast("Error: "+(r?.error||""),"error")}else showToast("Docente agregado")};

  const getAut=useCallback(pid=>data.pubAutores.filter(l=>l.pubId===pid).map(l=>data.autores.find(a=>a.id===l.autorId)).filter(Boolean),[data]);

  const filteredPubs=useMemo(()=>{let l=data.publicaciones;if(search)l=l.filter(p=>p.titulo?.toLowerCase().includes(search.toLowerCase())||p.revista?.toLowerCase().includes(search.toLowerCase()));if(fEstado)l=l.filter(p=>p.estadoPublicacion===fEstado);if(fTipo)l=l.filter(p=>p.tipoPublicacion===fTipo);if(fAutor){const ids=data.pubAutores.filter(x=>x.autorId===fAutor).map(x=>x.pubId);l=l.filter(p=>ids.includes(p.id))}return l},[data,search,fEstado,fTipo,fAutor]);

  const stats=useMemo(()=>{const ps=data.publicaciones;const total=ps.length;const publicadas=ps.filter(p=>p.estadoPublicacion==="Publicado").length;const scopus=ps.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;const reg=ps.filter(p=>p.registrado==="Sí").length;const aceptadas=ps.filter(p=>p.estadoPublicacion==="Aceptado").length;
    const porTipo={};ps.forEach(p=>{const t=p.tipoPublicacion||"Otro";porTipo[t]=(porTipo[t]||0)+1});
    const porIdx={};ps.forEach(p=>{[p.indexacion1,p.indexacion2,p.indexacion3].forEach(idx=>{if(idx&&idx.trim()&&idx!=="0"&&idx!=="N/A"){idx.split(",").forEach(s=>{const c=s.trim();if(c)porIdx[c]=(porIdx[c]||0)+1})}})});
    const autorRank=data.autores.map(a=>{const pids=data.pubAutores.filter(l=>l.autorId===a.id).map(l=>l.pubId);return{...a,count:pids.length,scopus:ps.filter(p=>pids.includes(p.id)&&[p.indexacion1,p.indexacion2].some(i=>i?.includes("Scopus"))).length}}).sort((a,b)=>b.count-a.count);
    return{total,publicadas,scopus,reg,aceptadas,porTipo,porIdx,autorRank}
  },[data]);

  if(!user)return<AuthScreen onLogin={setUser}/>;

  const menu=[
    {title:"GESTIÓN",items:[
      {id:"pubs",label:"Publicaciones",icon:Library},
      {id:"nueva",label:"Nueva Publicación",icon:Plus,action:true},
    ]},
    {title:"INFORMES",items:[
      {id:"autores",label:"Por Autor",icon:Users},
      {id:"indexacion",label:"Indexación",icon:Globe},
      {id:"registro",label:"Estado Registro",icon:ClipboardList},
    ]},
  ];
  if(isAdmin) menu.push({title:"ADMINISTRADOR",items:[
    {id:"docentes",label:"Gestionar Docentes",icon:UserPlus},
    {id:"altaDoc",label:"Alta Docente",icon:UserPlus,action:true,fn:()=>setShowDocForm(true)},
  ]});
  menu.push({title:"EXPORTAR",items:[{id:"excel",label:"Descargar Excel",icon:FileSpreadsheet,fn:()=>exportExcel(data.publicaciones,data.autores,data.pubAutores)}]});

  return(
    <div style={{display:"flex",minHeight:"100vh",background:"#f4f5f7",fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}`}</style>

      {/* ═══ SIDEBAR ═══ */}
      <aside style={{width:sideOpen?240:56,flexShrink:0,background:"white",borderRight:"1px solid #eef0f4",display:"flex",flexDirection:"column",transition:"width .25s",position:"sticky",top:0,height:"100vh",overflow:"hidden",zIndex:10}}>
        <div style={{padding:sideOpen?"14px 14px 10px":"14px 8px 10px",borderBottom:"1px solid #f1f5f9",display:"flex",alignItems:"center",gap:8}}>
          <div style={{width:34,height:34,borderRadius:10,background:`linear-gradient(135deg,${P.navy},${P.teal})`,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} style={{color:"white"}}/></div>
          {sideOpen&&<div><h1 style={{fontSize:14,fontWeight:800,color:P.navy,margin:0,fontFamily:"'Playfair Display',serif"}}>PubTracker</h1><p style={{fontSize:8,color:"#94a3b8",margin:0,letterSpacing:1}}>FCSyP · UNO</p></div>}
        </div>
        <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
          {menu.map(sec=><div key={sec.title} style={{marginBottom:12}}>
            {sideOpen&&<p style={{fontSize:9,fontWeight:800,color:sec.title==="ADMINISTRADOR"?P.gold:"#c0c5ce",letterSpacing:1.5,padding:"0 8px",marginBottom:3}}>{sec.title}</p>}
            {sec.items.map(it=><button key={it.id} onClick={()=>it.fn?it.fn():it.id==="nueva"?(setEditPub(null),setShowForm(true)):setView(it.id)} style={{
              width:"100%",display:"flex",alignItems:"center",gap:8,padding:sideOpen?"7px 10px":"7px 0",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",cursor:"pointer",marginBottom:1,transition:"all .15s",
              background:it.action?`linear-gradient(135deg,${P.teal},${P.green})`:view===it.id?P.tealBg:"transparent",
              color:it.action?"white":view===it.id?P.teal:"#64748b",fontSize:12,fontWeight:view===it.id||it.action?700:500
            }}><it.icon size={15}/>{sideOpen&&<span>{it.label}</span>}</button>)}
          </div>)}
        </nav>
        <div style={{padding:"8px 6px",borderTop:"1px solid #f1f5f9"}}>
          {sideOpen&&<div style={{padding:"7px 10px",background:isAdmin?"#fef3c7":"#f8fafc",borderRadius:9,marginBottom:6,border:isAdmin?"1px solid #fde68a":"none"}}>
            {isAdmin&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}><Shield size={11} style={{color:P.gold}}/><span style={{fontSize:9,fontWeight:700,color:P.gold,textTransform:"uppercase",letterSpacing:1}}>Administrador</span></div>}
            <p style={{fontSize:11,fontWeight:600,color:P.navy,margin:0}}>{user.nombres} {user.apellidos}</p>
            <p style={{fontSize:10,color:"#94a3b8",margin:0}}>{connected?"Google Sheets ✓":"Modo Demo"}</p>
          </div>}
          <button onClick={()=>setUser(null)} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",color:P.rose,fontSize:11}}><LogOut size={14}/>{sideOpen&&"Cerrar Sesión"}</button>
          <button onClick={()=>setSideOpen(!sideOpen)} style={{width:"100%",display:"flex",justifyContent:"center",padding:5,border:"none",background:"transparent",cursor:"pointer",color:"#cbd5e1",marginTop:3}}>{sideOpen?<ChevronLeft size={15}/>:<ChevronRight size={15}/>}</button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{flex:1,minWidth:0,display:"flex",flexDirection:"column"}}>
        {/* Top bar */}
        <header style={{position:"sticky",top:0,zIndex:20,background:"rgba(244,245,247,.88)",backdropFilter:"blur(12px)",borderBottom:"1px solid #eef0f4",padding:"8px 20px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <h2 style={{fontSize:16,fontWeight:800,color:P.navy,margin:0,fontFamily:"'Playfair Display',serif"}}>
            {view==="pubs"?"Publicaciones":view==="autores"?"Informe por Autor":view==="indexacion"?"Indexación":view==="registro"?"Estado de Registro":view==="docentes"?"Gestionar Docentes":""}
          </h2>
          <div style={{display:"flex",gap:6,alignItems:"center"}}>
            {loading&&<Loader2 size={15} style={{color:P.teal,animation:"spin 1s linear infinite"}}/>}
            {API_URL&&<button onClick={loadData} title="Recargar" style={{width:32,height:32,borderRadius:8,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}><RefreshCw size={13}/></button>}
            <Btn primary small onClick={()=>{setEditPub(null);setShowForm(true)}} icon={Plus}>Nueva</Btn>
            <Btn small onClick={()=>exportExcel(data.publicaciones,data.autores,data.pubAutores)} icon={FileSpreadsheet}>Excel</Btn>
          </div>
        </header>

        <div style={{flex:1,overflowY:"auto",padding:0}}>
          {/* ═══ DASHBOARD — SIEMPRE VISIBLE ═══ */}
          <div style={{padding:"16px 20px 8px",background:"linear-gradient(180deg, #f0fdfa 0%, #f4f5f7 100%)"}}>
            {/* KPI Cards */}
            <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:12}}>
              {[{l:"Total",v:stats.total,c:P.teal,i:BookOpen},{l:"Publicadas",v:stats.publicadas,c:P.green,i:CheckCircle2},{l:"Aceptadas",v:stats.aceptadas,c:P.sky,i:Clock},{l:"Scopus",v:stats.scopus,c:P.gold,i:Star},{l:"Registradas",v:stats.reg,c:P.violet,i:ClipboardList},{l:"Autores",v:data.autores.length,c:P.slate,i:Users}].map((s,i)=>
                <div key={i} style={{background:"white",borderRadius:12,padding:"12px 14px",border:"1px solid #f1f5f9",boxShadow:"0 1px 3px rgba(0,0,0,.03)"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div><p style={{fontSize:10,color:"#94a3b8",margin:0}}>{s.l}</p><p style={{fontSize:22,fontWeight:800,color:s.c,margin:"2px 0 0"}}>{s.v}</p></div>
                    <s.i size={16} style={{color:s.c,opacity:.4}}/>
                  </div>
                </div>
              )}
            </div>
            {/* Mini Charts Row */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
              <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.8}}>Por Tipo</p>
                <ResponsiveContainer width="100%" height={130}><PieChart><Pie data={Object.entries(stats.porTipo).map(([name,value])=>({name,value}))} cx="50%" cy="50%" innerRadius={28} outerRadius={52} paddingAngle={3} dataKey="value" label={({value})=>value} style={{fontSize:9}}>{Object.keys(stats.porTipo).map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}</Pie><Tooltip wrapperStyle={{fontSize:11}}/></PieChart></ResponsiveContainer>
              </div>
              <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.8}}>Indexación</p>
                <ResponsiveContainer width="100%" height={130}><BarChart data={Object.entries(stats.porIdx).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([name,value])=>({name:name.length>12?name.slice(0,10)+"…":name,value}))} layout="vertical" margin={{left:0,right:5}}><XAxis type="number" tick={{fontSize:9}} hide/><YAxis type="category" dataKey="name" width={75} tick={{fontSize:9}}/><Tooltip wrapperStyle={{fontSize:11}}/><Bar dataKey="value" fill={P.teal} radius={[0,4,4,0]} barSize={12}/></BarChart></ResponsiveContainer>
              </div>
              <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
                <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.8}}>Top Autores</p>
                <div style={{fontSize:11}}>{stats.autorRank.slice(0,5).map((a,i)=><div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"3px 0",borderBottom:i<4?"1px solid #f8fafc":"none"}}>
                  <span style={{color:P.navy,fontWeight:i<3?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:120}}>{i+1}. {a.apellidos.split(" ")[0]}</span>
                  <span style={{fontWeight:700,color:i===0?P.teal:i===1?P.gold:"#94a3b8"}}>{a.count}</span>
                </div>)}</div>
              </div>
            </div>
          </div>

          {/* ═══ CONTENT VIEWS ═══ */}
          <div style={{padding:"16px 20px",animation:"fadeIn .3s"}}>

            {/* ── PUBLICACIONES ── */}
            {view==="pubs"&&<div>
              <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
                <div style={{flex:1,minWidth:180}}><Inp value={search} onChange={setSearch} placeholder="Buscar título o revista…" icon={Search}/></div>
                <Sel value={fEstado} onChange={setFEstado} options={ESTADOS} placeholder="Estado" style={{width:"auto",minWidth:120}}/>
                <Sel value={fTipo} onChange={setFTipo} options={TIPOS} placeholder="Tipo" style={{width:"auto",minWidth:140}}/>
                <select value={fAutor} onChange={e=>setFAutor(e.target.value)} style={{padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",minWidth:130}}><option value="">Autor: Todos</option>{data.autores.map(a=><option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}</select>
                {(fEstado||fTipo||fAutor)&&<button onClick={()=>{setFEstado("");setFTipo("");setFAutor("")}} style={{padding:"5px 10px",borderRadius:8,border:"none",background:P.roseBg,color:P.rose,fontSize:11,cursor:"pointer",fontWeight:600}}>✕</button>}
              </div>
              <p style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{filteredPubs.length} publicaciones</p>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {filteredPubs.map(p=>{const aus=getAut(p.id);return<div key={p.id} style={{background:"white",borderRadius:10,border:"1px solid #f1f5f9",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontSize:12,fontWeight:600,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.titulo}</h4>
                    <p style={{fontSize:10,color:"#94a3b8",margin:"1px 0 0"}}>{aus.map(a=>`${a.apellidos}`).join(", ")}{p.autoresExternos?<span style={{color:P.violet}}> + {p.autoresExternos.split(/[,\n]/).filter(Boolean).length} ext.</span>:""} · {p.revista||""} · {p.fechaPublicacion||""}</p>
                  </div>
                  <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                    <EBdg e={p.estadoPublicacion}/><QBdg q={p.cuartil}/>
                    {p.registrado==="Sí"?<CheckCircle2 size={13} style={{color:P.green}}/>:<XCircle size={13} style={{color:"#e2e8f0"}}/>}
                    <button onClick={()=>setStatusPub(p)} title="Cambiar estado" style={{width:26,height:26,borderRadius:7,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}><RefreshCw size={11}/></button>
                    {(isAdmin||aus.some(a=>a.id===user?.id))&&<button onClick={()=>{setEditPub(p);setShowForm(true)}} title="Editar" style={{width:26,height:26,borderRadius:7,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:P.violet}}><Edit3 size={11}/></button>}
                  </div>
                </div>})}
              </div>
            </div>}

            {/* ── AUTORES ── */}
            {view==="autores"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
              {stats.autorRank.map(a=>{const pids=data.pubAutores.filter(l=>l.autorId===a.id).map(l=>l.pubId);const aP=data.publicaciones.filter(p=>pids.includes(p.id));
              return<div key={a.id} style={{background:"white",borderRadius:12,border:"1px solid #f1f5f9",padding:14}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"start",marginBottom:10}}>
                  <div><h4 style={{fontSize:13,fontWeight:700,color:P.navy,margin:0}}>{a.nombres} {a.apellidos}</h4><p style={{fontSize:10,color:"#94a3b8",margin:0}}>{a.email}</p></div>
                  <Btn small icon={FileDown} onClick={()=>exportWord(a,data.publicaciones,data.pubAutores)}>Word</Btn>
                </div>
                <div style={{display:"flex",gap:6,marginBottom:10}}>{[{l:"Total",v:a.count,c:P.teal},{l:"Scopus",v:a.scopus,c:P.gold}].map((s,i)=><div key={i} style={{flex:1,textAlign:"center",padding:6,background:s.c+"08",borderRadius:8}}><div style={{fontSize:18,fontWeight:800,color:s.c}}>{s.v}</div><div style={{fontSize:9,color:"#94a3b8"}}>{s.l}</div></div>)}</div>
                {aP.slice(0,3).map(p=><p key={p.id} style={{fontSize:10,color:"#475569",margin:"0 0 3px",overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>• {p.titulo}</p>)}
                {aP.length>3&&<p style={{fontSize:10,color:P.tealL,margin:0}}>+{aP.length-3} más</p>}
              </div>})}
            </div>}

            {/* ── INDEXACIÓN ── */}
            {view==="indexacion"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
              <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}><h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Bases de Indexación</h3><ResponsiveContainer width="100%" height={260}><BarChart data={Object.entries(stats.porIdx).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:5}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={110} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="value" fill={P.sky} radius={[0,5,5,0]} barSize={16}/></BarChart></ResponsiveContainer></div>
              <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}><h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Cuartiles</h3>{(()=>{const qd={};data.publicaciones.forEach(p=>{if(p.cuartil?.startsWith("Q"))qd[p.cuartil]=(qd[p.cuartil]||0)+1});const d=Object.entries(qd).sort().map(([n,v])=>({name:n,value:v}));return d.length?<><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={d} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{d.map((e,i)=><Cell key={i} fill={e.name==="Q1"?P.green:e.name==="Q2"?P.teal:e.name==="Q3"?P.gold:"#ea580c"}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8}}>{ ["Q1","Q2","Q3","Q4"].map(q=><div key={q} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:q==="Q1"?P.green:q==="Q2"?P.teal:q==="Q3"?P.gold:"#ea580c"}}>{qd[q]||0}</div><div style={{fontSize:10,color:"#94a3b8"}}>{q}</div></div>)}</div></>:<p style={{color:"#94a3b8",textAlign:"center",padding:30}}>Sin datos</p>})()}</div>
            </div>}

            {/* ── REGISTRO ── */}
            {view==="registro"&&<div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
                <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:P.green}}>{stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Registradas</div></div>
                <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:"#cbd5e1"}}>{stats.total-stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Pendientes</div></div>
                <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:P.teal}}>{stats.total>0?Math.round(stats.reg/stats.total*100):0}%</div><div style={{fontSize:11,color:"#94a3b8"}}>Cobertura</div></div>
              </div>
              <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
                <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Pendientes de Registro</h3>
                {data.publicaciones.filter(p=>p.registrado!=="Sí").map(p=>{const aus=getAut(p.id);return<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{flex:1,minWidth:0}}><p style={{fontSize:12,fontWeight:600,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.titulo}</p><p style={{fontSize:10,color:"#94a3b8",margin:0}}>{aus.map(a=>a.apellidos).join(", ")}</p></div>
                  <div style={{display:"flex",gap:4,flexShrink:0}}><EBdg e={p.estadoPublicacion}/><button onClick={()=>setStatusPub(p)} style={{padding:"3px 8px",borderRadius:8,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",fontSize:10,color:P.teal,fontWeight:600}}>Cambiar</button></div>
                </div>})}
              </div>
            </div>}

            {/* ── GESTIONAR DOCENTES (solo admin) ── */}
            {view==="docentes"&&isAdmin&&<div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <p style={{fontSize:12,color:"#94a3b8",margin:0}}>{data.autores.length} docentes registrados</p>
                <Btn primary small onClick={()=>setShowDocForm(true)} icon={UserPlus}>Alta Docente</Btn>
              </div>
              <div style={{background:"white",borderRadius:12,border:"1px solid #f1f5f9",overflow:"hidden"}}>
                <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
                  <thead><tr style={{borderBottom:"2px solid #f1f5f9",background:"#fafbfc"}}>
                    <th style={{textAlign:"left",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>NOMBRES</th>
                    <th style={{textAlign:"left",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>APELLIDOS</th>
                    <th style={{textAlign:"left",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>EMAIL</th>
                    <th style={{textAlign:"center",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>PUBS</th>
                    <th style={{textAlign:"center",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>SCOPUS</th>
                    <th style={{padding:"10px 12px"}}></th>
                  </tr></thead>
                  <tbody>{stats.autorRank.map(a=><tr key={a.id} style={{borderBottom:"1px solid #f8fafc"}}>
                    <td style={{padding:"10px 12px",fontWeight:600,color:P.navy}}>{a.nombres}</td>
                    <td style={{padding:"10px 12px",color:"#475569"}}>{a.apellidos}</td>
                    <td style={{padding:"10px 12px",color:"#94a3b8"}}>{a.email||"—"}</td>
                    <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700}}>{a.count}</td>
                    <td style={{padding:"10px 12px",textAlign:"center"}}>{a.scopus>0?<Bdg c={P.gold} bg={P.goldBg}>{a.scopus}</Bdg>:"—"}</td>
                    <td style={{padding:"10px 12px"}}><Btn small icon={FileDown} onClick={()=>exportWord(a,data.publicaciones,data.pubAutores)}>Word</Btn></td>
                  </tr>)}</tbody>
                </table>
              </div>
            </div>}

          </div>
        </div>
      </main>

      {/* Modales */}
      {showForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s"}}><PubForm pub={editPub} autores={data.autores} pubAutores={data.pubAutores} onSave={handleSavePub} onCancel={()=>{setShowForm(false);setEditPub(null)}} currentUser={user}/></div></div>}
      {statusPub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><StatusModal pub={statusPub} onSave={handleStatus} onClose={()=>setStatusPub(null)}/></div></div>}
      {showDocForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><DocenteForm onSave={handleAddDocente} onClose={()=>setShowDocForm(false)}/></div></div>}
      {toast&&<div style={{position:"fixed",bottom:20,right:20,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,.15)",animation:"toastIn .3s",background:toast.t==="error"?P.rose:P.teal,color:"white",fontSize:12,fontWeight:600}}>{toast.t==="error"?<AlertCircle size={14}/>:<CheckCircle2 size={14}/>}{toast.m}</div>}
    </div>
  );
}