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

/* ═══════════════════════════════════════════════════════════════
   ⚙️ CONFIGURACIÓN — URL de Google Apps Script
   ═══════════════════════════════════════════════════════════════ */
const API_URL = "https://script.google.com/macros/s/AKfycbyazwyYNFczOgGNOplKlIP_Uc0TZQWPXD-4y6dmDxmxUFNVt7eeJTHiJmGVIAXL8Sny/exec";

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
const DEMO=(()=>{const R=[
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
return{publicaciones:ps,autores:Object.values(am),pubAutores:lk};})();

/* ── Micro components ── */
const Bdg=({children,c=P.slate,bg})=><span style={{background:bg||c+"18",color:c,fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{children}</span>;
const EBdg=({e})=>{const m={"Publicado":[P.green,P.greenBg],"Aceptado":[P.sky,P.skyBg],"En revisión":[P.gold,P.goldBg],"Enviado":[P.violet,P.violetBg],"En preparación":[P.slate,"#f1f5f9"],"Rechazado":[P.rose,P.roseBg]};const[c,bg]=m[e]||[P.slate,"#f1f5f9"];return<Bdg c={c} bg={bg}>{e||"Sin estado"}</Bdg>};
const QBdg=({q})=>{if(!q||q==="N/A"||!q.startsWith("Q"))return null;const m={Q1:[P.green,"#fff"],Q2:[P.teal,"#fff"],Q3:[P.gold,"#fff"],Q4:["#ea580c","#fff"]};const[bg,c]=m[q]||[P.slate,"#fff"];return<Bdg c={c} bg={bg}>{q}</Bdg>};
const Inp=({value,onChange,placeholder,type="text",icon:Ic})=><div style={{position:"relative"}}>{Ic&&<Ic size={15} style={{position:"absolute",left:11,top:11,color:"#94a3b8"}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:Ic?"9px 12px 9px 34px":"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=P.teal} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>;
const Sel=({value,onChange,options,placeholder,style:st})=><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:value?"#1e293b":"#94a3b8",background:"white",outline:"none",boxSizing:"border-box",...st}}><option value="">{placeholder||"Seleccionar…"}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Btn=({children,onClick,primary,danger,small,disabled,icon:Ic})=><button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:small?"5px 10px":"9px 18px",borderRadius:10,border:primary||danger?"none":"1.5px solid #e2e8f0",fontSize:small?11:13,fontWeight:primary?700:500,cursor:disabled?"not-allowed":"pointer",background:primary?`linear-gradient(135deg,${P.teal},${P.green})`:danger?P.rose:"white",color:primary||danger?"white":"#475569",opacity:disabled?.5:1,transition:"all .15s",boxShadow:primary?"0 3px 10px rgba(17,94,89,.25)":"none"}}>{Ic&&<Ic size={small?12:15}/>}{children}</button>;

/* ── Helpers ── */
function parseYear(fecha){
  if(!fecha)return null;
  const parts=fecha.split("/");
  if(parts.length===3)return parseInt(parts[2]);
  const y=parseInt(fecha);
  return isNaN(y)?null:y;
}

/* ── Export Excel ── */
function exportExcel(pubs,autores,links,filtros={}){
  let rows=pubs;
  if(filtros.anio)rows=rows.filter(p=>parseYear(p.fechaPublicacion)===parseInt(filtros.anio));
  if(filtros.tipo)rows=rows.filter(p=>p.tipoPublicacion===filtros.tipo);
  if(filtros.autorId){const ids=links.filter(l=>l.autorId===filtros.autorId).map(l=>l.pubId);rows=rows.filter(p=>ids.includes(p.id));}
  const data=rows.map(p=>{const aI=links.filter(l=>l.pubId===p.id).map(l=>l.autorId);const nm=aI.map(id=>{const a=autores.find(x=>x.id===id);return a?`${a.nombres} ${a.apellidos}`:""}).filter(Boolean).join("; ");
  return[p.titulo,nm,p.autoresExternos||"",p.tipoPublicacion,p.estadoPublicacion,p.fechaPublicacion,p.cuartil,p.revista,p.issn,p.volumen,p.numero,p.paginas,p.doi,p.url,p.indexacion1,p.indexacion2,p.indexacion3,p.registrado]});
  const headers=["Título","Autores UNO","Autores Externos","Tipo","Estado","Fecha","Cuartil","Revista","ISSN/ISBN","Vol","Núm","Págs","DOI","URL","Idx 1","Idx 2","Idx 3","Reg.DI"];
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  let xml='<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="hdr"><Font ss:Bold="1" ss:Size="10"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/></Style><Style ss:ID="def"><Font ss:Size="10"/></Style></Styles><Worksheet ss:Name="Publicaciones"><Table>';
  xml+="<Row>"+headers.map(h=>`<Cell ss:StyleID="hdr"><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")+"</Row>";
  data.forEach(r=>{xml+="<Row>"+r.map(c=>`<Cell ss:StyleID="def"><Data ss:Type="String">${esc(c)}</Data></Cell>`).join("")+"</Row>"});
  xml+="</Table></Worksheet></Workbook>";
  const blob=new Blob([xml],{type:"application/vnd.ms-excel"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`PubTracker_${new Date().toISOString().slice(0,10)}.xls`;a.click();URL.revokeObjectURL(u);
}

/* ── Export Word — Formato Institucional ── */
function exportWord(autor, pubs, links, filtros={}) {
  const aL = links.filter(l => l.autorId === autor.id);
  let aP = pubs.filter(p => aL.some(l => l.pubId === p.id));
  if(filtros.anio) aP = aP.filter(p => parseYear(p.fechaPublicacion) === parseInt(filtros.anio));
  if(filtros.tipo) aP = aP.filter(p => p.tipoPublicacion === filtros.tipo);
  const pub = aP.filter(p => p.estadoPublicacion === "Publicado").length;
  const sc = aP.filter(p => [p.indexacion1,p.indexacion2,p.indexacion3].some(i => i?.includes("Scopus"))).length;
  const wos = aP.filter(p => [p.indexacion1,p.indexacion2,p.indexacion3].some(i => i?.includes("Wos") || i?.includes("Web of Science"))).length;
  const latindex = aP.filter(p => [p.indexacion1,p.indexacion2,p.indexacion3].some(i => i?.includes("Latindex"))).length;
  const enProceso = aP.filter(p => p.estadoPublicacion !== "Publicado" && p.estadoPublicacion !== "Rechazado").length;
  const today = new Date();
  const fechaStr = today.toLocaleDateString("es-EC",{year:"numeric",month:"long",day:"numeric"});
  const periodo = filtros.anio ? `Año ${filtros.anio}` : `Enero – Diciembre ${today.getFullYear()}`;

  const pubRows = aP.map((p, i) => {
    const idx = [p.indexacion1, p.indexacion2, p.indexacion3].filter(Boolean).join(", ") || "N/A";
    const estadoColor = p.estadoPublicacion==="Publicado"?"#047857":p.estadoPublicacion==="Aceptado"?"#0369a1":"#a16207";
    return `
    <tr>
      <td style="padding:6px 8px;border:1px solid #d1d5db;text-align:center;font-weight:bold;color:#115e59;font-size:11px;">${i+1}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">
        <strong>${p.titulo}</strong>
        ${p.autoresExternos?`<br/><span style="font-size:10px;color:#6d28d9;">Coautores: ${p.autoresExternos}</span>`:""}
      </td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">${p.tipoPublicacion||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;color:${estadoColor};font-weight:600;">${p.estadoPublicacion||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;font-weight:bold;">${p.cuartil&&p.cuartil!=="N/A"?p.cuartil:"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">${p.revista||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">${p.issn||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">${p.fechaPublicacion||"—"}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;">${idx}</td>
      <td style="padding:6px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;">${p.registrado==="Sí"?"✓ Sí":"✗ No"}</td>
    </tr>`;
  }).join("");

  const tipoResumen = {};
  aP.forEach(p => { const t = p.tipoPublicacion||"Otro"; tipoResumen[t]=(tipoResumen[t]||0)+1; });
  const tipoRows = Object.entries(tipoResumen).map(([t,c])=>`<tr><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;">${t}</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;font-weight:700;">${c}</td></tr>`).join("");

  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8">
<style>
  @page { size: A4; margin: 2cm 2.5cm; }
  body { font-family: Arial, sans-serif; margin: 0; padding: 0; color: #1e293b; font-size: 12px; }
  .header-block { border-bottom: 3px solid #8B0000; padding-bottom: 10px; margin-bottom: 18px; display: flex; justify-content: space-between; align-items: center; }
  .logo-text { font-size: 14px; font-weight: bold; color: #8B0000; letter-spacing: 1px; }
  .logo-sub { font-size: 10px; color: #64748b; }
  h1 { font-size: 18px; color: #115e59; text-align: center; margin: 0 0 4px; border: none; }
  h2 { font-size: 13px; color: #0f172a; border-bottom: 2px solid #115e59; padding-bottom: 4px; margin: 20px 0 10px; text-transform: uppercase; letter-spacing: 0.5px; }
  table { width: 100%; border-collapse: collapse; margin: 8px 0; font-size: 11px; }
  th { background: #115e59; color: white; text-align: left; padding: 7px 8px; border: 1px solid #115e59; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; }
  .kpi-table td { text-align: center; padding: 10px; border: 1px solid #d1d5db; }
  .kpi-num { font-size: 22px; font-weight: bold; }
  .footer { margin-top: 30px; text-align: center; color: #94a3b8; font-size: 9px; border-top: 1px solid #e2e8f0; padding-top: 10px; }
  .info-box { background: #f0fdfa; border-left: 4px solid #115e59; padding: 10px 14px; margin-bottom: 14px; border-radius: 0 6px 6px 0; }
  .info-row { display: flex; gap: 6px; margin-bottom: 3px; font-size: 11px; }
  .info-label { font-weight: 700; color: #475569; min-width: 160px; }
  .info-value { color: #1e293b; }
</style>
</head>
<body>
  <!-- ENCABEZADO INSTITUCIONAL -->
  <div class="header-block">
    <div>
      <div class="logo-text">UNIVERSIDAD DE OTAVALO</div>
      <div class="logo-sub">Facultad de Ciencias Sociales y Pedagógicas</div>
      <div class="logo-sub">Coordinación de Investigación</div>
    </div>
    <div style="text-align:right">
      <div style="font-size:10px;color:#94a3b8;">PubTracker · Sistema de Gestión de Publicaciones</div>
      <div style="font-size:10px;color:#94a3b8;">${fechaStr}</div>
    </div>
  </div>

  <!-- TÍTULO -->
  <div style="text-align:center;margin-bottom:16px;">
    <h1>Plan Individual de Publicaciones</h1>
    <p style="font-size:14px;font-weight:bold;color:#0f172a;margin:4px 0;">${autor.nombres} ${autor.apellidos}</p>
    <p style="font-size:11px;color:#64748b;margin:2px 0;">${autor.email||""}</p>
  </div>

  <!-- DATOS DEL INFORME -->
  <div class="info-box">
    <div class="info-row"><span class="info-label">Período de evaluación:</span><span class="info-value">${periodo}</span></div>
    <div class="info-row"><span class="info-label">Fecha del informe:</span><span class="info-value">${fechaStr}</span></div>
    <div class="info-row"><span class="info-label">Fuente de datos:</span><span class="info-value">Base de datos de la Facultad de Ciencias Sociales y Pedagógicas</span></div>
    <div class="info-row"><span class="info-label">Total de registros:</span><span class="info-value">${aP.length} publicaciones${filtros.tipo?` · Tipo: ${filtros.tipo}`:""}</span></div>
  </div>

  <!-- KPIs -->
  <h2>1. Resumen de Producción Científica</h2>
  <table class="kpi-table">
    <tr>
      <td><div class="kpi-num" style="color:#115e59;">${aP.length}</div><div style="font-size:10px;color:#64748b;">Total Publicaciones</div></td>
      <td><div class="kpi-num" style="color:#047857;">${pub}</div><div style="font-size:10px;color:#64748b;">Publicadas</div></td>
      <td><div class="kpi-num" style="color:#0369a1;">${enProceso}</div><div style="font-size:10px;color:#64748b;">En Proceso</div></td>
      <td><div class="kpi-num" style="color:#a16207;">${sc}</div><div style="font-size:10px;color:#64748b;">Scopus</div></td>
      <td><div class="kpi-num" style="color:#6d28d9;">${wos}</div><div style="font-size:10px;color:#64748b;">WoS</div></td>
      <td><div class="kpi-num" style="color:#0891b2;">${latindex}</div><div style="font-size:10px;color:#64748b;">Latindex</div></td>
    </tr>
  </table>

  <!-- POR TIPO -->
  <h2>2. Distribución por Tipo de Publicación</h2>
  <table>
    <tr><th style="width:70%;">Tipo de Publicación</th><th style="width:30%;text-align:center;">Cantidad</th></tr>
    ${tipoRows}
    <tr style="background:#f0fdfa;font-weight:bold;">
      <td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;color:#115e59;">TOTAL</td>
      <td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:#115e59;">${aP.length}</td>
    </tr>
  </table>

  <!-- DETALLE DE PUBLICACIONES -->
  <h2>3. Detalle de Publicaciones en Matriz</h2>
  <table>
    <tr>
      <th style="width:3%;text-align:center;">#</th>
      <th style="width:24%;">Título / Coautores</th>
      <th style="width:10%;">Tipo</th>
      <th style="width:9%;">Estado</th>
      <th style="width:4%;text-align:center;">Q</th>
      <th style="width:14%;">Revista/Editorial</th>
      <th style="width:8%;">ISSN/ISBN</th>
      <th style="width:8%;">Fecha</th>
      <th style="width:12%;">Indexación</th>
      <th style="width:8%;text-align:center;">Reg. UO</th>
    </tr>
    ${pubRows}
  </table>

  <!-- FICHA INDIVIDUAL POR PUBLICACIÓN -->
  <h2>4. Fichas Individuales de Publicaciones</h2>
  ${aP.map((p,i)=>{
    const idx=[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"N/A";
    return `<div style="margin-bottom:14px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
      <div style="background:#115e59;color:white;padding:6px 12px;font-size:11px;font-weight:bold;">Publicación ${i+1}</div>
      <table style="margin:0;">
        <tr><td style="padding:5px 8px;border:1px solid #e2e8f0;font-weight:700;font-size:10px;color:#475569;width:35%;">${p.titulo}</td></tr>
      </table>
      <table style="margin:0;font-size:10px;">
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;width:25%;">Tipo:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;width:75%;">${p.tipoPublicacion||"—"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Estado:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.estadoPublicacion||"—"}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Revista/Editorial:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.revista||"—"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">ISSN/ISBN:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.issn||"—"}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Fecha publicación:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.fechaPublicacion||"—"}</td></tr>
        ${p.doi?`<tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">DOI:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.doi}</td></tr>`:""}
        ${p.url?`<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">URL:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.url}</td></tr>`:""}
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Indexación:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${idx}</td></tr>
        ${p.cuartil&&p.cuartil!=="N/A"?`<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Cuartil:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:bold;color:#115e59;">${p.cuartil}</td></tr>`:""}
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Registrado UO:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.registrado==="Sí"?"✓ Sí":"✗ No"}</td></tr>
        ${p.autoresExternos?`<tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#6d28d9;">Autores Externos:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;color:#6d28d9;">${p.autoresExternos}</td></tr>`:""}
      </table>
    </div>`;
  }).join("")}

  <div class="footer">
    <p>PubTracker · Coordinación de Investigación · Facultad de Ciencias Sociales y Pedagógicas · Universidad de Otavalo</p>
    <p>Informe generado automáticamente el ${fechaStr} · Este documento es de carácter informativo</p>
  </div>
</body></html>`;

  const blob = new Blob(["\ufeff", html], {type: "application/msword"});
  const u = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = u;
  a.download = `Informe_${autor.apellidos.replace(/\s/g,"_")}_${filtros.anio||new Date().getFullYear()}.doc`;
  a.click();
  URL.revokeObjectURL(u);
}

/* ════════════════════════════════════════
   MODAL REPORTE FILTRADO (Año/Tipo/Autor)
   ════════════════════════════════════════ */
function ReporteModal({autores, pubs, links, onClose}){
  const [fAnio, setFAnio] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fAutorId, setFAutorId] = useState("");

  const years = useMemo(()=>{
    const ys = new Set();
    pubs.forEach(p=>{ const y=parseYear(p.fechaPublicacion); if(y) ys.add(y); });
    return Array.from(ys).sort((a,b)=>b-a);
  },[pubs]);

  const preview = useMemo(()=>{
    let l = pubs;
    if(fAnio) l = l.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));
    if(fTipo) l = l.filter(p=>p.tipoPublicacion===fTipo);
    if(fAutorId){ const ids=links.filter(x=>x.autorId===fAutorId).map(x=>x.pubId); l=l.filter(p=>ids.includes(p.id)); }
    return l;
  },[pubs,links,fAnio,fTipo,fAutorId]);

  const handleWord = () => {
    if(fAutorId){
      const autor = autores.find(a=>a.id===fAutorId);
      if(autor) exportWord(autor, pubs, links, {anio:fAnio,tipo:fTipo});
    } else {
      autores.forEach(autor => exportWord(autor, pubs, links, {anio:fAnio,tipo:fTipo}));
    }
    onClose();
  };

  return(
    <div style={{background:"white",borderRadius:16,padding:24,maxWidth:500,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
      <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}>
        <h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Generar Reporte Word</h3>
        <button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button>
      </div>
      <p style={{fontSize:12,color:"#64748b",marginBottom:16}}>Filtra y descarga el informe institucional en formato Word.</p>
      <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
        <div>
          <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>AÑO</label>
          <select value={fAnio} onChange={e=>setFAnio(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}>
            <option value="">Todos los años</option>
            {years.map(y=><option key={y} value={y}>{y}</option>)}
          </select>
        </div>
        <div>
          <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TIPO DE PUBLICACIÓN</label>
          <Sel value={fTipo} onChange={setFTipo} options={TIPOS} placeholder="Todos los tipos"/>
        </div>
        <div>
          <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>AUTOR</label>
          <select value={fAutorId} onChange={e=>setFAutorId(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}>
            <option value="">Todos los autores (un archivo por autor)</option>
            {autores.map(a=><option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}
          </select>
        </div>
      </div>
      <div style={{background:P.tealBg,borderRadius:10,padding:"10px 14px",marginBottom:16}}>
        <p style={{fontSize:11,color:P.teal,margin:0,fontWeight:600}}>{preview.length} publicaciones coinciden con los filtros</p>
      </div>
      <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn onClick={()=>exportExcel(pubs,autores,links,{anio:fAnio,tipo:fTipo,autorId:fAutorId})} icon={FileSpreadsheet}>Excel</Btn>
        <Btn primary onClick={handleWord} icon={FileDown} disabled={preview.length===0}>Word</Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   PANTALLA LOGIN (SIN REGISTRO PÚBLICO)
   ════════════════════════════════════════ */
function AuthScreen({onLogin}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const doLogin=async()=>{if(!email||!pass)return setError("Complete todos los campos");setLoading(true);setError("");
    if(API_URL){const r=await apiPost({action:"login",email,password:pass});if(r?.ok)onLogin(r.user);else setError(r?.error||"Credenciales incorrectas. Contacte al administrador.")}
    else{if(email==="admin"&&pass==="UNO2025")onLogin({id:"admin",nombres:"ADMINISTRADOR",apellidos:"SISTEMA",email:"admin",rol:"admin"});else{const a=DEMO.autores.find(x=>x.email?.toLowerCase()===email.toLowerCase());if(a)onLogin({...a,rol:"autor"});else setError("Credenciales incorrectas. Contacte al administrador para acceder.")}}setLoading(false)};
  return(
    <div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${P.navy} 0%,${P.teal} 50%,${P.tealL} 100%)`,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
      <div style={{width:420,background:"white",borderRadius:20,boxShadow:"0 25px 80px rgba(0,0,0,.3)",overflow:"hidden",animation:"fadeUp .5s ease"}}>
        <div style={{background:`linear-gradient(135deg,${P.navy},${P.teal})`,padding:"28px 36px 20px",textAlign:"center"}}>
          <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><BookOpen size={22} style={{color:"white"}}/></div>
          <h1 style={{color:"white",fontSize:22,fontWeight:800,margin:0,fontFamily:"'Playfair Display',serif"}}>PubTracker</h1>
          <p style={{color:"rgba(255,255,255,.6)",fontSize:11,margin:"4px 0 0"}}>Facultad de Ciencias Sociales y Pedagógicas · UNO</p>
        </div>
        <div style={{padding:"6px 0 0",borderBottom:"1px solid #f1f5f9",background:"white",textAlign:"center"}}>
          <p style={{fontSize:12,fontWeight:700,color:P.teal,padding:"10px 0",margin:0}}>Iniciar Sesión</p>
        </div>
        <div style={{padding:"20px 36px 28px"}}>
          {error&&<div style={{background:P.roseBg,color:P.rose,padding:"8px 12px",borderRadius:10,fontSize:12,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><AlertCircle size={14}/>{error}</div>}
          <div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>EMAIL / USUARIO</label><Inp value={email} onChange={setEmail} placeholder="correo@uotavalo.edu.ec" type="email" icon={Mail}/></div>
          <div style={{marginBottom:18}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONTRASEÑA</label><Inp value={pass} onChange={setPass} placeholder="••••••" type="password" icon={Lock}/></div>
          <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${P.teal},${P.green})`,color:"white",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:"0 4px 16px rgba(17,94,89,.3)"}}>{loading?<Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>:<><LogIn size={16}/>Ingresar</>}</button>
          <p style={{fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:14}}>¿No tiene acceso? Comuníquese con el administrador del sistema.</p>
          {!API_URL&&<div style={{marginTop:14,padding:10,background:P.goldBg,borderRadius:10,border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>Modo Demo</p><p style={{fontSize:10,color:"#92400e",margin:"3px 0 0"}}>🔑 Admin: admin / UNO2025</p><p style={{fontSize:10,color:"#92400e",margin:"2px 0 0"}}>👤 Docente: aflores@uotavalo.edu.ec / cualquier clave</p></div>}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   FORMULARIO PUBLICACIÓN (MODAL)
   ════════════════════════════════════════ */
function PubForm({pub,autores,pubAutores,onSave,onCancel,currentUser,isAdmin}){
  const isE=!!pub;const[step,setStep]=useState(1);
  const[form,setForm]=useState(()=>pub?{...pub}:{titulo:"",tipoPublicacion:"",estadoPublicacion:"En preparación",fechaPublicacion:"",cuartil:"N/A",revista:"",issn:"",volumen:"",numero:"",paginas:"",doi:"",url:"",indexacion1:"",indexacion2:"",indexacion3:"",registrado:"No",autoresExternos:""});
  const[selA,setSelA]=useState(()=>pub?pubAutores.filter(l=>l.pubId===pub.id).map(l=>l.autorId):(currentUser?.rol!=="admin"?[currentUser?.id].filter(Boolean):[]));
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{if(!form.titulo.trim())return alert("Título requerido");if(selA.length===0)return alert("Seleccione al menos un autor");onSave({...form,id:pub?.id},selA)};
  const steps=["Información","Bibliometría","Indexación"];
  const autoresDisponibles = isAdmin ? autores : autores.filter(a=>a.id===currentUser?.id);
  return(
    <div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.12)",maxWidth:680,width:"100%"}}>
      <div style={{background:`linear-gradient(135deg,${P.navy},${P.teal})`,padding:"18px 24px",color:"white"}}><h2 style={{fontSize:17,fontWeight:700,margin:0,fontFamily:"'Playfair Display',serif"}}>{isE?"Editar Publicación":"Nueva Publicación"}</h2></div>
      <div style={{display:"flex",borderBottom:"1px solid #f1f5f9",background:"#fafbfc"}}>{steps.map((t,i)=><button key={i} onClick={()=>setStep(i+1)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:12,fontWeight:step===i+1?700:500,color:step===i+1?P.teal:step>i+1?P.green:"#94a3b8",background:step===i+1?"white":"transparent",borderBottom:step===i+1?`3px solid ${P.teal}`:"3px solid transparent"}}>{i+1}. {t}</button>)}</div>
      <div style={{padding:22,minHeight:260}}>
        {step===1&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TÍTULO *</label><Inp value={form.titulo} onChange={v=>s("titulo",v)} placeholder="Título completo"/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TIPO *</label><Sel value={form.tipoPublicacion} onChange={v=>s("tipoPublicacion",v)} options={TIPOS}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>FECHA</label><Inp value={form.fechaPublicacion} onChange={v=>s("fechaPublicacion",v)} placeholder="DD/MM/AAAA"/></div>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>AUTORES FACULTAD *</label><div style={{display:"flex",flexWrap:"wrap",gap:5,padding:8,borderRadius:10,border:"1.5px solid #e2e8f0",maxHeight:100,overflowY:"auto"}}>{autoresDisponibles.map(a=>{const sel=selA.includes(a.id);return<button key={a.id} onClick={()=>setSelA(p=>sel?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:sel?`2px solid ${P.teal}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:sel?600:400,background:sel?P.tealBg:"white",color:sel?P.teal:"#475569",cursor:"pointer"}}>{sel&&<Check size={10}/>}{a.nombres} {a.apellidos}</button>})}</div></div>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:P.violet,display:"block",marginBottom:3}}>AUTORES EXTERNOS <span style={{fontWeight:400,color:"#94a3b8"}}>(coautores de otras instituciones)</span></label><textarea value={form.autoresExternos||""} onChange={e=>s("autoresExternos",e.target.value)} placeholder="Ej: Juan Pérez (U. Central), María López (PUCE)" rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/></div>
        </div>}
        {step===2&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
          <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>REVISTA / EDITORIAL</label><Inp value={form.revista} onChange={v=>s("revista",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>ISSN / ISBN</label><Inp value={form.issn} onChange={v=>s("issn",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CUARTIL</label><Sel value={form.cuartil} onChange={v=>s("cuartil",v)} options={CUARTILES}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>VOLUMEN</label><Inp value={form.volumen} onChange={v=>s("volumen",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NÚMERO</label><Inp value={form.numero} onChange={v=>s("numero",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>PÁGINAS</label><Inp value={form.paginas} onChange={v=>s("paginas",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>DOI</label><Inp value={form.doi} onChange={v=>s("doi",v)}/></div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>URL</label><Inp value={form.url} onChange={v=>s("url",v)}/></div>
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
            <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><EBdg e={form.estadoPublicacion}/><QBdg q={form.cuartil}/>{form.tipoPublicacion&&<Bdg>{form.tipoPublicacion}</Bdg>}</div>
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
   MODAL CONFIRMAR ELIMINACIÓN
   ════════════════════════════════════════ */
function ConfirmDelete({title, message, onConfirm, onCancel}){
  return(
    <div style={{background:"white",borderRadius:16,padding:24,maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
      <div style={{textAlign:"center",marginBottom:16}}>
        <div style={{width:48,height:48,borderRadius:14,background:P.roseBg,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><Trash2 size={22} style={{color:P.rose}}/></div>
        <h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>{title}</h3>
      </div>
      <p style={{fontSize:13,color:"#64748b",textAlign:"center",marginBottom:20,lineHeight:1.5}}>{message}</p>
      <div style={{display:"flex",gap:8,justifyContent:"center"}}>
        <Btn onClick={onCancel}>Cancelar</Btn>
        <Btn danger onClick={onConfirm} icon={Trash2}>Eliminar</Btn>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════
   MODAL ALTA DOCENTE (solo admin)
   ════════════════════════════════════════ */
function DocenteForm({onSave,onClose}){
  const[n,setN]=useState("");const[a,setA]=useState("");const[e,setE]=useState("");const[p,setP]=useState("123456");
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:440,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Alta de Docente Investigador</h3><button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button></div>
    <div style={{background:P.goldBg,borderRadius:10,padding:"8px 12px",marginBottom:14,border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>⚠️ Solo el administrador puede registrar nuevos docentes</p></div>
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
   APP PRINCIPAL
   ════════════════════════════════════════════════════════ */
export default function App(){
  const[user,setUser]=useState(null);
  const[data,setData]=useState(DEMO);
  const[view,setView]=useState("pubs");
  const[showForm,setShowForm]=useState(false);
  const[editPub,setEditPub]=useState(null);
  const[statusPub,setStatusPub]=useState(null);
  const[showDocForm,setShowDocForm]=useState(false);
  const[showReporteModal,setShowReporteModal]=useState(false);
  const[deletePub,setDeletePub]=useState(null);
  const[deleteAutor,setDeleteAutor]=useState(null);
  const[sideOpen,setSideOpen]=useState(true);
  const[toast,setToast]=useState(null);
  const[loading,setLoading]=useState(false);
  const[connected,setConnected]=useState(false);
  const[search,setSearch]=useState("");
  const[fEstado,setFEstado]=useState("");
  const[fTipo,setFTipo]=useState("");
  const[fAutor,setFAutor]=useState("");
  const[fAnio,setFAnio]=useState("");

  const showToast=(m,t="success")=>{setToast({m,t});setTimeout(()=>setToast(null),3500)};
  const isAdmin=user?.rol==="admin";

  const loadData=useCallback(async()=>{if(!API_URL)return;setLoading(true);const r=await apiGet("getAll");if(r&&!r.error&&r.publicaciones){setData({publicaciones:r.publicaciones,autores:r.autores||[],pubAutores:r.pubAutores||[]});setConnected(true)}setLoading(false)},[]);
  useEffect(()=>{if(user)loadData()},[user,loadData]);

  /* ── Datos visibles según rol ── */
  const visiblePubs = useMemo(()=>{
    if(isAdmin) return data.publicaciones;
    // Autor: solo sus publicaciones
    const myPubIds = data.pubAutores.filter(l=>l.autorId===user?.id).map(l=>l.pubId);
    return data.publicaciones.filter(p=>myPubIds.includes(p.id));
  },[data, isAdmin, user]);

  const visibleAutores = useMemo(()=>{
    if(isAdmin) return data.autores;
    return data.autores.filter(a=>a.id===user?.id);
  },[data, isAdmin, user]);

  const years = useMemo(()=>{
    const ys = new Set();
    visiblePubs.forEach(p=>{ const y=parseYear(p.fechaPublicacion); if(y) ys.add(y); });
    return Array.from(ys).sort((a,b)=>b-a);
  },[visiblePubs]);

  const handleSavePub=async(pub,autorIds)=>{const isEd=!!editPub;setData(prev=>{const np=[...prev.publicaciones];const nl=prev.pubAutores.filter(l=>l.pubId!==pub.id);if(!pub.id)pub.id="P"+Date.now().toString(36);const ex=np.findIndex(p=>p.id===pub.id);if(ex>=0)np[ex]=pub;else np.push(pub);autorIds.forEach((a,i)=>nl.push({pubId:pub.id,autorId:a,orden:i+1}));return{...prev,publicaciones:np,pubAutores:nl}});setShowForm(false);setEditPub(null);
    if(API_URL){const action=isEd?"updatePub":"addPub";const body=isEd?{action,id:pub.id,pub,autoresIds:autorIds}:{action,pub,autoresIds:autorIds,userId:user?.id};const r=await apiPost(body);if(r?.ok){showToast(isEd?"Actualizada ✓":"Registrada ✓");loadData()}else showToast("Error sync: "+(r?.error||""),"error")}else showToast(isEd?"Actualizada":"Registrada")};

  const handleStatus=async(id,estado,registrado)=>{setData(prev=>({...prev,publicaciones:prev.publicaciones.map(p=>p.id===id?{...p,estadoPublicacion:estado,registrado}:p)}));setStatusPub(null);
    if(API_URL){const r=await apiPost({action:"updateStatus",id,estado,registrado});if(r?.ok)showToast("Estado actualizado ✓");else showToast("Error sync","error")}else showToast("Estado actualizado")};

  const handleDeletePub=async(pubId)=>{setData(prev=>({...prev,publicaciones:prev.publicaciones.filter(p=>p.id!==pubId),pubAutores:prev.pubAutores.filter(l=>l.pubId!==pubId)}));setDeletePub(null);
    if(API_URL){const r=await apiPost({action:"deletePub",id:pubId});if(r?.ok){showToast("Publicación eliminada ✓");loadData()}else showToast("Error al eliminar","error")}else showToast("Publicación eliminada")};

  const handleDeleteAutor=async(autorId)=>{const pubIds=data.pubAutores.filter(l=>l.autorId===autorId).map(l=>l.pubId);setData(prev=>({...prev,autores:prev.autores.filter(a=>a.id!==autorId),publicaciones:prev.publicaciones.filter(p=>!pubIds.includes(p.id)),pubAutores:prev.pubAutores.filter(l=>l.autorId!==autorId&&!pubIds.includes(l.pubId))}));setDeleteAutor(null);
    if(API_URL){const r=await apiPost({action:"deleteAutor",id:autorId});if(r?.ok){showToast("Docente eliminado ✓");loadData()}else showToast("Error al eliminar","error")}else showToast("Docente eliminado")};

  const handleAddDocente=async(doc)=>{const id="A"+Date.now().toString(36);setData(prev=>({...prev,autores:[...prev.autores,{id,nombres:doc.nombres,apellidos:doc.apellidos,email:doc.email,rol:"autor",activo:true}]}));setShowDocForm(false);
    if(API_URL){const r=await apiPost({action:"addAutor",...doc});if(r?.ok){showToast("Docente registrado ✓");loadData()}else showToast("Error: "+(r?.error||""),"error")}else showToast("Docente agregado")};

  const getAut=useCallback(pid=>data.pubAutores.filter(l=>l.pubId===pid).map(l=>data.autores.find(a=>a.id===l.autorId)).filter(Boolean),[data]);

  const filteredPubs=useMemo(()=>{
    let l=visiblePubs;
    if(search)l=l.filter(p=>p.titulo?.toLowerCase().includes(search.toLowerCase())||p.revista?.toLowerCase().includes(search.toLowerCase()));
    if(fEstado)l=l.filter(p=>p.estadoPublicacion===fEstado);
    if(fTipo)l=l.filter(p=>p.tipoPublicacion===fTipo);
    if(fAnio)l=l.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));
    if(fAutor&&isAdmin){const ids=data.pubAutores.filter(x=>x.autorId===fAutor).map(x=>x.pubId);l=l.filter(p=>ids.includes(p.id))}
    return l;
  },[visiblePubs,data,search,fEstado,fTipo,fAutor,fAnio,isAdmin]);

  const stats=useMemo(()=>{
    const ps=visiblePubs;
    const total=ps.length;
    const publicadas=ps.filter(p=>p.estadoPublicacion==="Publicado").length;
    const scopus=ps.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;
    const reg=ps.filter(p=>p.registrado==="Sí").length;
    const aceptadas=ps.filter(p=>p.estadoPublicacion==="Aceptado").length;
    const porTipo={};ps.forEach(p=>{const t=p.tipoPublicacion||"Otro";porTipo[t]=(porTipo[t]||0)+1});
    const porIdx={};ps.forEach(p=>{[p.indexacion1,p.indexacion2,p.indexacion3].forEach(idx=>{if(idx&&idx.trim()&&idx!=="0"&&idx!=="N/A"){idx.split(",").forEach(s=>{const c=s.trim();if(c)porIdx[c]=(porIdx[c]||0)+1})}})});
    const porAnio={};ps.forEach(p=>{const y=parseYear(p.fechaPublicacion);if(y)porAnio[y]=(porAnio[y]||0)+1});
    const autorRank=visibleAutores.map(a=>{const pids=data.pubAutores.filter(l=>l.autorId===a.id).map(l=>l.pubId);return{...a,count:pids.length,scopus:data.publicaciones.filter(p=>pids.includes(p.id)&&[p.indexacion1,p.indexacion2].some(i=>i?.includes("Scopus"))).length}}).sort((a,b)=>b.count-a.count);
    return{total,publicadas,scopus,reg,aceptadas,porTipo,porIdx,porAnio,autorRank}
  },[visiblePubs,visibleAutores,data]);

  if(!user)return<AuthScreen onLogin={setUser}/>;

  const menu=[
    {title:"GESTIÓN",items:[
      {id:"pubs",label:"Mis Publicaciones",icon:Library},
      {id:"nueva",label:"Nueva Publicación",icon:Plus,action:true},
    ]},
    {title:"ANÁLISIS",items:[
      {id:"dashboard",label:"Dashboard",icon:LayoutDashboard},
      {id:"autores",label:"Por Autor",icon:Users},
      {id:"indexacion",label:"Indexación",icon:Globe},
      {id:"registro",label:"Estado Registro",icon:ClipboardList},
    ]},
  ];
  if(isAdmin) menu.push({title:"ADMINISTRADOR",items:[
    {id:"docentes",label:"Gestionar Docentes",icon:UserPlus},
  ]});
  menu.push({title:"EXPORTAR",items:[
    {id:"excel",label:"Descargar Excel",icon:FileSpreadsheet,fn:()=>exportExcel(visiblePubs,data.autores,data.pubAutores)},
    {id:"reporte",label:"Reporte Word",icon:FileDown,fn:()=>setShowReporteModal(true)},
  ]});

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
          <button onClick={()=>setSideOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",color:"#94a3b8",fontSize:11,marginTop:2}}>{sideOpen?<ChevronLeft size={14}/>:<ChevronRight size={14}/>}{sideOpen&&"Colapsar"}</button>
        </div>
      </aside>

      {/* ═══ MAIN ═══ */}
      <main style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column"}}>

        {/* Header */}
        <div style={{background:"white",borderBottom:"1px solid #f1f5f9",padding:"12px 20px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:5}}>
          <div>
            <h2 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>{view==="pubs"?(isAdmin?"Todas las Publicaciones":"Mis Publicaciones"):view==="dashboard"?"Dashboard":view==="autores"?"Producción por Autor":view==="indexacion"?"Bases de Indexación":view==="registro"?"Estado de Registro":view==="docentes"?"Gestionar Docentes":"Panel"}</h2>
            <p style={{fontSize:11,color:"#94a3b8",margin:0}}>{isAdmin?"Vista Administrador — Acceso Total":`${user.nombres} ${user.apellidos} · ${stats.total} publicaciones`}</p>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"center"}}>
            {loading&&<Loader2 size={16} style={{color:P.teal,animation:"spin 1s linear infinite"}}/>}
            {API_URL&&<button onClick={loadData} style={{padding:"5px 10px",borderRadius:8,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",fontSize:11,color:P.teal,display:"flex",alignItems:"center",gap:4}}><RefreshCw size={12}/>Sync</button>}
            <Btn primary small onClick={()=>{setEditPub(null);setShowForm(true)}} icon={Plus}>Nueva</Btn>
          </div>
        </div>

        {/* ═══ DASHBOARD (KPIs + Charts) ═══ */}
        <div style={{padding:"16px 20px 8px",background:"linear-gradient(180deg, #f0fdfa 0%, #f4f5f7 100%)"}}>

          {/* FILTRO GLOBAL DE AÑO para dashboard */}
          {view==="dashboard"&&<div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
            <span style={{fontSize:11,fontWeight:700,color:"#64748b"}}>Filtrar por año:</span>
            {["",...years].map(y=><button key={y||"all"} onClick={()=>setFAnio(y)} style={{padding:"4px 12px",borderRadius:20,border:fAnio===y?`2px solid ${P.teal}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:fAnio===y?700:400,background:fAnio===y?P.tealBg:"white",color:fAnio===y?P.teal:"#475569",cursor:"pointer"}}>{y||"Todos"}</button>)}
          </div>}

          {/* KPI Cards */}
          <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:12}}>
            {[
              {l:"Total",v:stats.total,c:P.teal,i:BookOpen},
              {l:"Publicadas",v:stats.publicadas,c:P.green,i:CheckCircle2},
              {l:"Aceptadas",v:stats.aceptadas,c:P.sky,i:Clock},
              {l:"Scopus",v:stats.scopus,c:P.gold,i:Star},
              {l:"Registradas",v:stats.reg,c:P.violet,i:ClipboardList},
              {l:isAdmin?"Autores":"Mis Pubs",v:isAdmin?data.autores.length:stats.total,c:P.slate,i:Users}
            ].map((s,i)=>
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
              <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 6px",textTransform:"uppercase",letterSpacing:.8}}>Por Año</p>
              <ResponsiveContainer width="100%" height={130}><BarChart data={Object.entries(stats.porAnio).sort((a,b)=>a[0]-b[0]).map(([name,value])=>({name,value}))} margin={{left:0,right:5}}><XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} hide/><Tooltip wrapperStyle={{fontSize:11}}/><Bar dataKey="value" fill={P.teal} radius={[4,4,0,0]} barSize={20}/></BarChart></ResponsiveContainer>
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

          {/* ── DASHBOARD COMPLETO ── */}
          {view==="dashboard"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Publicaciones por Año</h3>
              <ResponsiveContainer width="100%" height={220}><AreaChart data={Object.entries(stats.porAnio).sort((a,b)=>a[0]-b[0]).map(([name,value])=>({name,value}))}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/><Area type="monotone" dataKey="value" stroke={P.teal} fill={P.tealBg} strokeWidth={2}/></AreaChart></ResponsiveContainer>
            </div>
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Distribución por Tipo</h3>
              <ResponsiveContainer width="100%" height={220}><BarChart data={Object.entries(stats.porTipo).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:10}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={120} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="value" fill={P.sky} radius={[0,5,5,0]} barSize={16}/></BarChart></ResponsiveContainer>
            </div>
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Top Indexaciones</h3>
              <ResponsiveContainer width="100%" height={220}><BarChart data={Object.entries(stats.porIdx).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:5}}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/><XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={115} tick={{fontSize:10}}/><Tooltip/><Bar dataKey="value" fill={P.violet} radius={[0,5,5,0]} barSize={14}/></BarChart></ResponsiveContainer>
            </div>
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Ranking Autores (Top 8)</h3>
              <div>{stats.autorRank.slice(0,8).map((a,i)=><div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f8fafc"}}>
                <div style={{display:"flex",alignItems:"center",gap:8}}>
                  <span style={{width:20,height:20,borderRadius:"50%",background:i<3?P.tealBg:"#f1f5f9",color:i<3?P.teal:"#94a3b8",fontSize:10,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
                  <span style={{fontSize:12,fontWeight:i<3?700:500,color:P.navy}}>{a.apellidos}, {a.nombres.split(" ")[0]}</span>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <Bdg c={P.teal}>{a.count} pubs</Bdg>
                  {a.scopus>0&&<Bdg c={P.gold} bg={P.goldBg}>{a.scopus} Scopus</Bdg>}
                </div>
              </div>)}</div>
            </div>
          </div>}

          {/* ── PUBLICACIONES ── */}
          {view==="pubs"&&<div>
            <div style={{display:"flex",gap:6,marginBottom:10,flexWrap:"wrap"}}>
              <div style={{flex:1,minWidth:180}}><Inp value={search} onChange={setSearch} placeholder="Buscar título o revista…" icon={Search}/></div>
              <select value={fAnio} onChange={e=>setFAnio(e.target.value)} style={{padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",minWidth:90}}>
                <option value="">Año</option>{years.map(y=><option key={y} value={y}>{y}</option>)}
              </select>
              <Sel value={fEstado} onChange={setFEstado} options={ESTADOS} placeholder="Estado" style={{width:"auto",minWidth:120}}/>
              <Sel value={fTipo} onChange={setFTipo} options={TIPOS} placeholder="Tipo" style={{width:"auto",minWidth:140}}/>
              {isAdmin&&<select value={fAutor} onChange={e=>setFAutor(e.target.value)} style={{padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",minWidth:130}}><option value="">Autor: Todos</option>{data.autores.map(a=><option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}</select>}
              {(fEstado||fTipo||fAutor||fAnio)&&<button onClick={()=>{setFEstado("");setFTipo("");setFAutor("");setFAnio("")}} style={{padding:"5px 10px",borderRadius:8,border:"none",background:P.roseBg,color:P.rose,fontSize:11,cursor:"pointer",fontWeight:600}}>✕ Limpiar</button>}
            </div>
            <p style={{fontSize:11,color:"#94a3b8",marginBottom:6}}>{filteredPubs.length} publicaciones {!isAdmin&&<span style={{color:P.teal,fontWeight:600}}>· Solo tus publicaciones</span>}</p>
            <div style={{display:"flex",flexDirection:"column",gap:4}}>
              {filteredPubs.map(p=>{
                const aus=getAut(p.id);
                const canEdit=isAdmin||aus.some(a=>a.id===user?.id);
                return<div key={p.id} style={{background:"white",borderRadius:10,border:"1px solid #f1f5f9",padding:"10px 14px",display:"flex",alignItems:"center",gap:10}}>
                  <div style={{flex:1,minWidth:0}}>
                    <h4 style={{fontSize:12,fontWeight:600,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.titulo}</h4>
                    <p style={{fontSize:10,color:"#94a3b8",margin:"1px 0 0"}}>{aus.map(a=>`${a.apellidos}`).join(", ")}{p.autoresExternos?<span style={{color:P.violet}}> + {p.autoresExternos.split(/[,\n]/).filter(Boolean).length} ext.</span>:""} · {p.revista||""} · {p.fechaPublicacion||""}</p>
                  </div>
                  <div style={{display:"flex",gap:4,alignItems:"center",flexShrink:0}}>
                    <EBdg e={p.estadoPublicacion}/><QBdg q={p.cuartil}/>
                    {p.registrado==="Sí"?<CheckCircle2 size={13} style={{color:P.green}}/>:<XCircle size={13} style={{color:"#e2e8f0"}}/>}
                    <button onClick={()=>setStatusPub(p)} title="Cambiar estado" style={{width:26,height:26,borderRadius:7,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:"#64748b"}}><RefreshCw size={11}/></button>
                    {canEdit&&<button onClick={()=>{setEditPub(p);setShowForm(true)}} title="Editar" style={{width:26,height:26,borderRadius:7,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:P.violet}}><Edit3 size={11}/></button>}
                    {canEdit&&<button onClick={()=>setDeletePub(p)} title="Eliminar" style={{width:26,height:26,borderRadius:7,border:"1px solid #ffe4e6",background:"#fff5f5",cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",color:P.rose}}><Trash2 size={11}/></button>}
                  </div>
                </div>
              })}
            </div>
          </div>}

          {/* ── AUTORES ── */}
          {view==="autores"&&<div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:12}}>
            {stats.autorRank.map(a=>{const pids=data.pubAutores.filter(l=>l.autorId===a.id).map(l=>l.pubId);const aP=visiblePubs.filter(p=>pids.includes(p.id));
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
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}><h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Cuartiles</h3>{(()=>{const qd={};visiblePubs.forEach(p=>{if(p.cuartil?.startsWith("Q"))qd[p.cuartil]=(qd[p.cuartil]||0)+1});const d=Object.entries(qd).sort().map(([n,v])=>({name:n,value:v}));return d.length?<><ResponsiveContainer width="100%" height={200}><PieChart><Pie data={d} cx="50%" cy="50%" innerRadius={45} outerRadius={80} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`}>{d.map((e,i)=><Cell key={i} fill={e.name==="Q1"?P.green:e.name==="Q2"?P.teal:e.name==="Q3"?P.gold:"#ea580c"}/>)}</Pie><Tooltip/></PieChart></ResponsiveContainer><div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8}}>{["Q1","Q2","Q3","Q4"].map(q=><div key={q} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:q==="Q1"?P.green:q==="Q2"?P.teal:q==="Q3"?P.gold:"#ea580c"}}>{qd[q]||0}</div><div style={{fontSize:10,color:"#94a3b8"}}>{q}</div></div>)}</div></>:<p style={{color:"#94a3b8",textAlign:"center",padding:30}}>Sin datos</p>})()}</div>
          </div>}

          {/* ── ESTADO REGISTRO ── */}
          {view==="registro"&&<div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
              <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:P.green}}>{stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Registradas</div></div>
              <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:"#cbd5e1"}}>{stats.total-stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Pendientes</div></div>
              <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:P.teal}}>{stats.total>0?Math.round(stats.reg/stats.total*100):0}%</div><div style={{fontSize:11,color:"#94a3b8"}}>Cobertura</div></div>
            </div>
            <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Pendientes de Registro</h3>
              {visiblePubs.filter(p=>p.registrado!=="Sí").map(p=>{const aus=getAut(p.id);return<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f8fafc"}}>
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
                  <th style={{padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>ACCIONES</th>
                </tr></thead>
                <tbody>{stats.autorRank.map(a=><tr key={a.id} style={{borderBottom:"1px solid #f8fafc"}}>
                  <td style={{padding:"10px 12px",fontWeight:600,color:P.navy}}>{a.nombres}</td>
                  <td style={{padding:"10px 12px",color:"#475569"}}>{a.apellidos}</td>
                  <td style={{padding:"10px 12px",color:"#94a3b8"}}>{a.email||"—"}</td>
                  <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700}}>{a.count}</td>
                  <td style={{padding:"10px 12px",textAlign:"center"}}>{a.scopus>0?<Bdg c={P.gold} bg={P.goldBg}>{a.scopus}</Bdg>:"—"}</td>
                  <td style={{padding:"10px 12px"}}><div style={{display:"flex",gap:4}}>
                    <Btn small icon={FileDown} onClick={()=>exportWord(a,data.publicaciones,data.pubAutores)}>Word</Btn>
                    <button onClick={()=>setDeleteAutor(a)} title="Eliminar docente" style={{padding:"4px 8px",borderRadius:8,border:"1px solid #ffe4e6",background:"#fff5f5",cursor:"pointer",fontSize:11,color:P.rose,display:"inline-flex",alignItems:"center",gap:4,fontWeight:600}}><Trash2 size={11}/>Eliminar</button>
                  </div></td>
                </tr>)}</tbody>
              </table>
            </div>
          </div>}

        </div>
      </main>

      {/* ═══ MODALES ═══ */}
      {showForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s"}}><PubForm pub={editPub} autores={data.autores} pubAutores={data.pubAutores} onSave={handleSavePub} onCancel={()=>{setShowForm(false);setEditPub(null)}} currentUser={user} isAdmin={isAdmin}/></div></div>}
      {statusPub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><StatusModal pub={statusPub} onSave={handleStatus} onClose={()=>setStatusPub(null)}/></div></div>}
      {showDocForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><DocenteForm onSave={handleAddDocente} onClose={()=>setShowDocForm(false)}/></div></div>}
      {showReporteModal&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ReporteModal autores={isAdmin?data.autores:visibleAutores} pubs={visiblePubs} links={data.pubAutores} onClose={()=>setShowReporteModal(false)}/></div></div>}
      {deletePub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ConfirmDelete title="Eliminar Publicación" message={`¿Seguro que deseas eliminar "${deletePub.titulo}"? Esta acción no se puede deshacer.`} onConfirm={()=>handleDeletePub(deletePub.id)} onCancel={()=>setDeletePub(null)}/></div></div>}
      {deleteAutor&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ConfirmDelete title="Eliminar Docente" message={`¿Seguro que deseas eliminar a ${deleteAutor.nombres} ${deleteAutor.apellidos} y TODAS sus publicaciones asociadas? Esta acción no se puede deshacer.`} onConfirm={()=>handleDeleteAutor(deleteAutor.id)} onCancel={()=>setDeleteAutor(null)}/></div></div>}
      {toast&&<div style={{position:"fixed",bottom:20,right:20,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,.15)",animation:"toastIn .3s",background:toast.t==="error"?P.rose:P.teal,color:"white",fontSize:12,fontWeight:600}}>{toast.t==="error"?<AlertCircle size={14}/>:<CheckCircle2 size={14}/>}{toast.m}</div>}
    </div>
  );
}
