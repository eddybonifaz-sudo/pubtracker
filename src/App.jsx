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
  Settings, KeyRound, Link2, Phone, GraduationCap, Camera, ExternalLink,
  AtSign, Linkedin, BookUser, FlaskConical
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   ⚙️ CONFIGURACIÓN
   ═══════════════════════════════════════════════════════════════ */
const API_URL = "https://script.google.com/macros/s/AKfycbyazwyYNFczOgGNOplKlIP_Uc0TZQWPXD-4y6dmDxmxUFNVt7eeJTHiJmGVIAXL8Sny/exec";

async function apiGet(a){if(!API_URL)return null;try{const r=await fetch(`${API_URL}?action=${a}`);return await r.json()}catch(e){return null}}
async function apiPost(b){if(!API_URL)return null;try{const r=await fetch(API_URL,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(b)});return await r.json()}catch(e){return null}}

/* ── Convierte URL de Google Drive a formato embebible como <img> ── */
function driveImgUrl(url){
  if(!url)return"";
  // https://drive.google.com/file/d/ID/view  →  thumbnail
  const m1=url.match(/\/file\/d\/([^/]+)/);
  if(m1)return`https://drive.google.com/thumbnail?id=${m1[1]}&sz=w200`;
  // https://drive.google.com/uc?export=view&id=ID  →  thumbnail
  const m2=url.match(/[?&]id=([^&]+)/);
  if(m2)return`https://drive.google.com/thumbnail?id=${m2[1]}&sz=w200`;
  // Ya es thumbnail u otro formato — devolver tal cual
  return url;
}
/* ── Avatar fallback ── */
function avatarUrl(nombres,apellidos){return`https://ui-avatars.com/api/?name=${encodeURIComponent((nombres||"U")+" "+(apellidos||""))}&background=47090A&color=fff&size=128&bold=true`;}

/* ── Color Institucional UNO ── */
const C1="#47090A";
const C1L="#6b0e10";
const C1Bg="#fdf0f0";
const NAVY="#1a0203";

const P={teal:C1,tealL:C1L,tealBg:C1Bg,navy:NAVY,slate:"#64748b",rose:"#be123c",roseBg:"#ffe4e6",green:"#047857",greenBg:"#d1fae5",violet:"#6d28d9",violetBg:"#ede9fe",sky:"#0369a1",skyBg:"#e0f2fe",gold:"#a16207",goldBg:"#fef3c7"};
const CC=[C1,"#a16207","#6d28d9","#be123c","#0369a1","#047857","#d97706","#9333ea",C1L,"#0891b2","#65a30d"];
const TIPOS=["Artículo Científico","Artículo Regional","Libro","Capítulo de Libro","Proceeding","Tesis","Ponencia"];
const ESTADOS=["Publicado","Aceptado","En revisión","Enviado","En preparación","Rechazado"];
const CUARTILES=["Q1","Q2","Q3","Q4","N/A"];
const INDEXES=["Scopus","Wos(ESCI)","Web of Science","Latindex Catálogo","Latindex Directorio","DOAJ","ERIHPLUS","CLASE","REDIB","MIAR","Index Coppernicus","SciELO"];

/* ── Datos demo ── */
const DEMO=(()=>{
  const R=[
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
    {n:"JESUS FRANCISCO",a:"GONZALEZ ALONSO",e:"jgonzalez@uotavalo.edu.ec",est:"Publicado",t:"Innovación pedagógica en educación superior",tp:"Artículo Científico",f:"10/9/2025",q:"Q2",rv:"Revista Iberoamericana de Educación",is:"1022-6508",i1:"Scopus",i2:"Latindex Catálogo",i3:"",rg:"Sí"},
  ];
  const am={};let ac=1,pc=1;const ps=[],lk=[];
  R.forEach(r=>{
    const k=r.n+"|"+r.a;
    if(!am[k])am[k]={id:"A"+String(ac++).padStart(3,"0"),nombres:r.n,apellidos:r.a,email:r.e,rol:"autor",activo:true};
    const pid="P"+String(pc++).padStart(3,"0");
    ps.push({id:pid,titulo:r.t,tipoPublicacion:r.tp,estadoPublicacion:r.est,fechaPublicacion:r.f,cuartil:r.q,revista:r.rv,issn:r.is,volumen:"",numero:"",paginas:"",doi:"",url:"",indexacion1:r.i1,indexacion2:r.i2,indexacion3:r.i3,registrado:r.rg,autoresExternos:""});
    lk.push({pubId:pid,autorId:am[k].id,orden:1});
  });
  return{publicaciones:ps,autores:Object.values(am),pubAutores:lk};
})();

/* ── Micro components ── */
const Bdg=({children,c=P.slate,bg})=><span style={{background:bg||c+"18",color:c,fontSize:11,fontWeight:600,padding:"2px 10px",borderRadius:20,whiteSpace:"nowrap"}}>{children}</span>;
const EBdg=({e})=>{const m={"Publicado":[P.green,P.greenBg],"Aceptado":[P.sky,P.skyBg],"En revisión":[P.gold,P.goldBg],"Enviado":[P.violet,P.violetBg],"En preparación":[P.slate,"#f1f5f9"],"Rechazado":[P.rose,P.roseBg]};const[c,bg]=m[e]||[P.slate,"#f1f5f9"];return<Bdg c={c} bg={bg}>{e||"Sin estado"}</Bdg>};
const QBdg=({q})=>{if(!q||q==="N/A"||!q.startsWith("Q"))return null;const m={Q1:[P.green,"#fff"],Q2:[C1,"#fff"],Q3:[P.gold,"#fff"],Q4:["#ea580c","#fff"]};const[bg,c]=m[q]||[P.slate,"#fff"];return<Bdg c={c} bg={bg}>{q}</Bdg>};
const TipoBdg=({tipo})=>tipo?<span style={{background:C1+"18",color:C1,fontSize:9,fontWeight:700,padding:"2px 8px",borderRadius:10,whiteSpace:"nowrap",border:`1px solid ${C1}28`}}>{tipo}</span>:null;
const Inp=({value,onChange,placeholder,type="text",icon:Ic})=><div style={{position:"relative"}}>{Ic&&<Ic size={15} style={{position:"absolute",left:11,top:11,color:"#94a3b8"}}/>}<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={{width:"100%",padding:Ic?"9px 12px 9px 34px":"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box"}} onFocus={e=>e.target.style.borderColor=C1} onBlur={e=>e.target.style.borderColor="#e2e8f0"}/></div>;
const Sel=({value,onChange,options,placeholder,style:st})=><select value={value} onChange={e=>onChange(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:value?"#1e293b":"#94a3b8",background:"white",outline:"none",boxSizing:"border-box",...st}}><option value="">{placeholder||"Seleccionar…"}</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>;
const Btn=({children,onClick,primary,danger,small,disabled,icon:Ic})=><button onClick={onClick} disabled={disabled} style={{display:"inline-flex",alignItems:"center",gap:6,padding:small?"5px 10px":"9px 18px",borderRadius:10,border:primary||danger?"none":"1.5px solid #e2e8f0",fontSize:small?11:13,fontWeight:primary?700:500,cursor:disabled?"not-allowed":"pointer",background:primary?`linear-gradient(135deg,${C1},${C1L})`:danger?P.rose:"white",color:primary||danger?"white":"#475569",opacity:disabled?.5:1,transition:"all .15s",boxShadow:primary?`0 3px 10px ${C1}40`:"none"}}>{Ic&&<Ic size={small?12:15}/>}{children}</button>;

function parseYear(fecha){if(!fecha)return null;const parts=fecha.split("/");if(parts.length===3)return parseInt(parts[2]);const y=parseInt(fecha);return isNaN(y)?null:y;}

/* ── Export Excel ── */
function exportExcel(pubs,autores,links,filtros={}){
  let rows=pubs;
  if(filtros.anio)rows=rows.filter(p=>parseYear(p.fechaPublicacion)===parseInt(filtros.anio));
  if(filtros.tipo)rows=rows.filter(p=>p.tipoPublicacion===filtros.tipo);
  if(filtros.autorId){const ids=links.filter(l=>l.autorId===filtros.autorId).map(l=>l.pubId);rows=rows.filter(p=>ids.includes(p.id));}
  if(rows.length===0){alert("No hay publicaciones con los filtros seleccionados");return;}
  const data=rows.map(p=>{const aI=links.filter(l=>l.pubId===p.id).map(l=>l.autorId);const nm=aI.map(id=>{const a=autores.find(x=>x.id===id);return a?`${a.nombres} ${a.apellidos}`:""}).filter(Boolean).join("; ");return[p.titulo,nm,p.autoresExternos||"",p.tipoPublicacion,p.estadoPublicacion,p.fechaPublicacion,p.cuartil,p.revista,p.issn,p.volumen,p.numero,p.paginas,p.doi,p.url,p.indexacion1,p.indexacion2,p.indexacion3,p.registrado]});
  const headers=["Título","Autores UNO","Autores Externos","Tipo","Estado","Fecha","Cuartil","Revista","ISSN/ISBN","Vol","Núm","Págs","DOI","URL","Idx 1","Idx 2","Idx 3","Reg.DI"];
  const esc=s=>String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
  let xml='<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?><Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet"><Styles><Style ss:ID="hdr"><Font ss:Bold="1" ss:Size="10"/><Interior ss:Color="#F1F5F9" ss:Pattern="Solid"/></Style><Style ss:ID="def"><Font ss:Size="10"/></Style></Styles><Worksheet ss:Name="Publicaciones"><Table>';
  xml+="<Row>"+headers.map(h=>`<Cell ss:StyleID="hdr"><Data ss:Type="String">${esc(h)}</Data></Cell>`).join("")+"</Row>";
  data.forEach(r=>{xml+="<Row>"+r.map(c=>`<Cell ss:StyleID="def"><Data ss:Type="String">${esc(c)}</Data></Cell>`).join("")+"</Row>"});
  xml+="</Table></Worksheet></Workbook>";
  const blob=new Blob([xml],{type:"application/vnd.ms-excel"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`PubTracker_${new Date().toISOString().slice(0,10)}.xls`;a.click();URL.revokeObjectURL(u);
}

/* ── Export Word ── */
function exportWord(autor,pubs,links,filtros={}){
  const aL=links.filter(l=>l.autorId===autor.id);
  let aP=pubs.filter(p=>aL.some(l=>l.pubId===p.id));
  if(filtros.anio)aP=aP.filter(p=>parseYear(p.fechaPublicacion)===parseInt(filtros.anio));
  if(filtros.tipo)aP=aP.filter(p=>p.tipoPublicacion===filtros.tipo);
  if(aP.length===0){alert(`Sin publicaciones para ${autor.apellidos} con los filtros seleccionados`);return;}
  const pub=aP.filter(p=>p.estadoPublicacion==="Publicado").length;
  const sc=aP.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;
  const wos=aP.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Wos")||i?.includes("Web of Science"))).length;
  const latindex=aP.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Latindex"))).length;
  const enProceso=aP.filter(p=>p.estadoPublicacion!=="Publicado"&&p.estadoPublicacion!=="Rechazado").length;
  const today=new Date();
  const fechaStr=today.toLocaleDateString("es-EC",{year:"numeric",month:"long",day:"numeric"});
  const periodo=filtros.anio?`Año ${filtros.anio}`:`Enero – Diciembre ${today.getFullYear()}`;

  /* ── Filas de la matriz: exactamente igual que la sección por autor del consolidado ── */
  const pubRows=aP.map((p,i)=>{
    const idx=[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"—";
    const ec=p.estadoPublicacion==="Publicado"?"#047857":p.estadoPublicacion==="Aceptado"?"#0369a1":"#a16207";
    const doiLink=p.doi?`<a href="https://doi.org/${p.doi}" style="color:#c2410c;font-size:9px;display:block;margin-bottom:2px;">🔗 DOI ↗</a>`:"";const urlLink=p.url?`<a href="${p.url}" style="color:#1d4ed8;font-size:9px;display:block;margin-bottom:2px;">🌐 URL ↗</a>`:"";const evLink=p.evidencia?`<a href="${p.evidencia}" style="color:#6d28d9;font-size:9px;display:block;">📁 OneDrive ↗</a>`:"";const urlCell=(doiLink||urlLink||evLink)||"—";
    return`<tr><td style="padding:4px 6px;border:1px solid #e2e8f0;text-align:center;color:${C1};font-size:10px;font-weight:700;">${i+1}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;"><strong>${p.titulo}</strong>${p.autoresExternos?`<br/><span style="font-size:8px;color:#6d28d9;">+ ${p.autoresExternos}</span>`:""}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${p.tipoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;color:${ec};font-weight:600;">${p.estadoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;text-align:center;font-weight:bold;">${p.cuartil&&p.cuartil!=="N/A"?p.cuartil:"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${idx}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${doiLink+urlLink+evLink||"—"}</td></tr>`;
  }).join("");

  const tipoRes={};aP.forEach(p=>{const t=p.tipoPublicacion||"Otro";tipoRes[t]=(tipoRes[t]||0)+1});
  const tipoRows=Object.entries(tipoRes).map(([t,c])=>`<tr><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;">${t}</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;font-weight:700;">${c}</td></tr>`).join("");
  const autorLinks=[autor.orcid?`ORCID: ${autor.orcid}`:"",autor.scopusId?`Scopus ID: ${autor.scopusId}`:"",autor.scholarId?`Scholar: ${autor.scholarId}`:""].filter(Boolean).join(" · ");

  /* ── Foto: convertir URL de Drive a thumbnail embebible ── */
  const fotoSrc=autor.fotoUrl?driveImgUrl(autor.fotoUrl):"";
  const fotoCell=fotoSrc
    ?`<td style="width:90px;vertical-align:middle;padding:0 16px 0 0;"><img src="${fotoSrc}" style="width:80px;height:80px;max-width:80px;max-height:80px;border-radius:50%;object-fit:cover;border:3px solid ${C1};display:block;mso-width-source:absolute;mso-height-source:absolute;" alt="Foto"/></td>`
    :`<td style="width:80px;vertical-align:middle;padding:0 16px 0 0;"><div style="width:80px;height:80px;border-radius:50%;background:${C1};color:white;font-size:28px;font-weight:900;text-align:center;line-height:80px;">${(autor.nombres||"U").charAt(0)}${(autor.apellidos||"").charAt(0)}</div></td>`;

  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>@page Section1{size:842pt 595pt;mso-page-orientation:landscape;margin:1.5cm 2cm}body{font-family:Arial,sans-serif;margin:0;padding:0;color:#1e293b;font-size:11px;mso-element:para-border-div}.hb{border-bottom:3px solid ${C1};padding-bottom:10px;margin-bottom:18px}.lt{font-size:14px;font-weight:bold;color:${C1};letter-spacing:1px}.ls{font-size:10px;color:#64748b}h2{font-size:12px;color:${NAVY};border-bottom:2px solid ${C1};padding-bottom:3px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:.5px}table{width:100%;border-collapse:collapse;margin:6px 0}th{background:${C1};color:white;text-align:left;padding:6px 8px;border:1px solid ${C1};font-size:10px;text-transform:uppercase}.kt td{text-align:center;padding:10px;border:1px solid #d1d5db}.kn{font-size:20px;font-weight:bold}.ft{margin-top:24px;text-align:center;color:#94a3b8;font-size:9px;border-top:1px solid #e2e8f0;padding-top:8px}.ib{background:${C1Bg};border-left:4px solid ${C1};padding:8px 12px;margin-bottom:12px;border-radius:0 6px 6px 0}.ir{display:flex;gap:6px;margin-bottom:2px;font-size:10px}.il{font-weight:700;color:#475569;min-width:140px}.iv{color:#1e293b}</style></head><body style="mso-section-properties:url('#Section1')">

  <div class="hb" style="display:table;width:100%;">
    <div style="display:table-row;">
      <div style="display:table-cell;vertical-align:top;">
        <div class="lt">UNIVERSIDAD DE OTAVALO</div>
        <div class="ls">Facultad de Ciencias Sociales y Pedagógicas · Coordinación de Investigación</div>
      </div>
      <div style="display:table-cell;text-align:right;vertical-align:top;">
        <div style="font-size:10px;color:#94a3b8;">PubTracker · Sistema de Gestión de Publicaciones</div>
        <div style="font-size:10px;color:#94a3b8;">${fechaStr}</div>
      </div>
    </div>
  </div>

  <table style="width:100%;border-collapse:collapse;margin-bottom:14px;border:none;">
    <tr>
      ${fotoCell}
      <td style="vertical-align:middle;padding:0;">
        <div style="font-size:20px;font-weight:900;color:${C1};font-family:Arial,sans-serif;margin:0 0 3px;">${autor.nombres} ${autor.apellidos}</div>
        ${autor.tituloAcademico?`<div style="font-size:12px;color:#64748b;margin:0 0 2px;">${autor.tituloAcademico}</div>`:""}
        <div style="font-size:11px;color:#64748b;margin:0 0 2px;">${autor.email||""}</div>
        ${autorLinks?`<div style="font-size:10px;color:#94a3b8;margin:0 0 4px;">${autorLinks}</div>`:""}
        <div style="display:inline-flex;gap:8px;flex-wrap:wrap;">
          ${autor.orcid?`<a href="https://orcid.org/${autor.orcid}" style="color:#a6ce39;font-size:10px;font-weight:bold;">ORCID ↗</a>`:""}
          ${autor.scopusId?`<a href="https://www.scopus.com/authid/detail.uri?authorId=${autor.scopusId}" style="color:#e9711c;font-size:10px;font-weight:bold;">Scopus ↗</a>`:""}
          ${autor.scholarId?`<a href="https://scholar.google.com/citations?user=${autor.scholarId}" style="color:#4285F4;font-size:10px;font-weight:bold;">Scholar ↗</a>`:""}
          ${autor.researchgate?`<a href="${autor.researchgate}" style="color:#00CCBB;font-size:10px;font-weight:bold;">ResearchGate ↗</a>`:""}
          ${autor.linkedin?`<a href="${autor.linkedin}" style="color:#0A66C2;font-size:10px;font-weight:bold;">LinkedIn ↗</a>`:""}
        </div>
      </td>
    </tr>
  </table>

  <div class="ib">
    <div class="ir"><span class="il">Período:</span><span class="iv">${periodo}</span></div>
    <div class="ir"><span class="il">Fecha del informe:</span><span class="iv">${fechaStr}</span></div>
    <div class="ir"><span class="il">Total de registros:</span><span class="iv">${aP.length} publicaciones${filtros.tipo?` · Tipo: ${filtros.tipo}`:""}</span></div>
    ${autor.departamento?`<div class="ir"><span class="il">Departamento / Carrera:</span><span class="iv">${autor.departamento}</span></div>`:""}
    ${autor.horasInvestigacion?`<div class="ir"><span class="il">Horas de Investigación:</span><span class="iv" style="font-weight:700;color:#047857;">${autor.horasInvestigacion} horas/semana</span></div>`:""}
  </div>

  <h2>1. Resumen de Producción Científica</h2>
  ${autor.horasInvestigacion?`<div style="background:#f0fdf4;border-left:4px solid #047857;border-radius:0 8px 8px 0;padding:8px 14px;margin-bottom:10px;display:flex;align-items:center;gap:14px;"><div style="font-size:24px;font-weight:900;color:#047857;">${autor.horasInvestigacion}</div><div><div style="font-size:11px;font-weight:700;color:#047857;">HORAS DE INVESTIGACIÓN</div><div style="font-size:10px;color:#64748b;">Al período ${periodo} · horas semanales asignadas</div></div></div>`:""}
  <table class="kt"><tr>
    <td><div class="kn" style="color:${C1};">${aP.length}</div><div style="font-size:10px;color:#64748b;">Total</div></td>
    <td><div class="kn" style="color:#047857;">${pub}</div><div style="font-size:10px;color:#64748b;">Publicadas</div></td>
    <td><div class="kn" style="color:#0369a1;">${enProceso}</div><div style="font-size:10px;color:#64748b;">En Proceso</div></td>
    <td><div class="kn" style="color:#a16207;">${sc}</div><div style="font-size:10px;color:#64748b;">Scopus</div></td>
    <td><div class="kn" style="color:#6d28d9;">${wos}</div><div style="font-size:10px;color:#64748b;">WoS</div></td>
    <td><div class="kn" style="color:#0891b2;">${latindex}</div><div style="font-size:10px;color:#64748b;">Latindex</div></td>
  </tr></table>

  <h2>2. Distribución por Tipo</h2>
  <table><tr><th style="width:70%;">Tipo de Publicación</th><th style="width:30%;text-align:center;">Cantidad</th></tr>${tipoRows}
  <tr style="background:${C1Bg};font-weight:bold;"><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;color:${C1};">TOTAL</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:${C1};">${aP.length}</td></tr></table>

  <h2>3. Detalle en Matriz</h2>
  <table style="table-layout:fixed;width:100%;border-collapse:collapse;margin:6px 0;font-size:10px;">
    <tr>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:3%;text-align:center;">#</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:30%;">Título</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:9%;">Tipo</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:9%;">Estado</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:4%;text-align:center;">Q</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:22%;">Indexación</th>
      <th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:8%;">Evidencia</th>
    </tr>
    ${pubRows}
  </table>

  <h2>4. Fichas Individuales</h2>
  ${aP.map((p,i)=>{
    const idx=[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"N/A";
    return`<div style="margin-bottom:14px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;">
      <div style="background:${C1};color:white;padding:6px 12px;font-size:11px;font-weight:bold;">Publicación ${i+1}</div>
      <table style="margin:0;font-size:10px;width:100%;border-collapse:collapse;">
        <tr><td colspan="2" style="padding:6px 8px;border:1px solid #e2e8f0;font-weight:700;">${p.titulo}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;width:25%;">Tipo:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.tipoPublicacion||"—"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Estado:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.estadoPublicacion||"—"}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Revista/Editorial:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.revista||"—"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">ISSN/ISBN:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.issn||"—"}</td></tr>
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Fecha:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.fechaPublicacion||"—"}</td></tr>
        <tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Indexación:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${idx}</td></tr>
        ${p.cuartil&&p.cuartil!=="N/A"?`<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Cuartil:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:bold;color:${C1};">${p.cuartil}</td></tr>`:""}
        <tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">Registrado DI:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;">${p.registrado==="Sí"?"✓ Sí":"✗ No"}</td></tr>
        ${p.doi?`<tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">DOI:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;"><a href="https://doi.org/${p.doi}" style="color:#0369a1;">${p.doi}</a></td></tr>`:""}
        ${p.url?`<tr><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#475569;">URL Publicación:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;"><a href="${p.url}" style="color:#0369a1;font-weight:600;">Ver publicación →</a></td></tr>`:""}
        ${p.evidencia?`<tr style="background:#f5f3ff;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#6d28d9;">📁 OneDrive / Respaldo:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;"><a href="${p.evidencia}" style="color:#6d28d9;font-weight:600;">Ver carpeta OneDrive →</a></td></tr>`:""}
        ${p.autoresExternos?`<tr style="background:#fafafa;"><td style="padding:4px 8px;border:1px solid #e2e8f0;font-weight:600;color:#6d28d9;">Autores Externos:</td><td style="padding:4px 8px;border:1px solid #e2e8f0;color:#6d28d9;">${p.autoresExternos}</td></tr>`:""}
      </table>
    </div>`}).join("")}

  <div class="ft">
    <p>PubTracker · Coordinación de Investigación · Facultad de Ciencias Sociales y Pedagógicas · Universidad de Otavalo</p>
    <p>Informe generado el ${fechaStr}</p>
  </div>
</body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/msword"});const u=URL.createObjectURL(blob);const a=document.createElement("a");a.href=u;a.download=`Informe_${autor.apellidos.replace(/\s/g,"_")}_${filtros.anio||new Date().getFullYear()}.doc`;a.click();URL.revokeObjectURL(u);
}

/* ═══════════════════════════════════════════════════
   EXPORT WORD CONSOLIDADO (Admin)
   ═══════════════════════════════════════════════════ */
function exportWordConsolidado(pubs, autores, links, filtros={}){
  const today=new Date();
  const fechaStr=today.toLocaleDateString("es-EC",{year:"numeric",month:"long",day:"numeric"});
  const periodo=filtros.anio?`Año ${filtros.anio}`:`Enero – Diciembre ${today.getFullYear()}`;

  // Filtrar publicaciones globales
  let allPubs=pubs;
  if(filtros.anio) allPubs=allPubs.filter(p=>parseYear(p.fechaPublicacion)===parseInt(filtros.anio));
  if(filtros.tipo) allPubs=allPubs.filter(p=>p.tipoPublicacion===filtros.tipo);
  if(allPubs.length===0){alert("No hay publicaciones con los filtros seleccionados");return;}

  // KPIs globales facultad
  const totalPubs=allPubs.length;
  const publicadas=allPubs.filter(p=>p.estadoPublicacion==="Publicado").length;
  const enProceso=allPubs.filter(p=>p.estadoPublicacion!=="Publicado"&&p.estadoPublicacion!=="Rechazado").length;
  const scopusCnt=allPubs.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;
  const wosCnt=allPubs.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Wos")||i?.includes("Web of Science"))).length;
  const q1q2=allPubs.filter(p=>p.cuartil==="Q1"||p.cuartil==="Q2").length;

  // Tabla global resumen
  const globalRows=allPubs.map((p,i)=>{
    const aI=links.filter(l=>l.pubId===p.id).map(l=>l.autorId);
    const autNm=aI.map(id=>{const a=autores.find(x=>x.id===id);return a?`${a.apellidos}`:"";}).filter(Boolean).join("; ");
    const idx=[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"N/A";
    const ec=p.estadoPublicacion==="Publicado"?"#047857":p.estadoPublicacion==="Aceptado"?"#0369a1":"#a16207";
    const gDoi=p.doi?`<a href="https://doi.org/${p.doi}" style="color:#c2410c;font-size:9px;display:block;margin-bottom:2px;">🔗 DOI ↗</a>`:"";const gUrl=p.url?`<a href="${p.url}" style="color:#1d4ed8;font-size:9px;display:block;margin-bottom:2px;">🌐 URL ↗</a>`:"";const gEv=p.evidencia?`<a href="${p.evidencia}" style="color:#6d28d9;font-size:9px;display:block;">📁 OneDrive ↗</a>`:"";const urlCell=gDoi||gUrl||gEv?"(ver cel.)":"—";
    return`<tr><td style="padding:4px 6px;border:1px solid #d1d5db;text-align:center;font-weight:bold;color:${C1};font-size:10px;">${i+1}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;"><strong>${p.titulo}</strong></td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;">${autNm||"—"}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;">${p.tipoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;color:${ec};font-weight:600;">${p.estadoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;text-align:center;font-weight:bold;">${p.cuartil&&p.cuartil!=="N/A"?p.cuartil:"—"}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;">${p.revista||"—"}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;">${idx}</td><td style="padding:4px 6px;border:1px solid #d1d5db;font-size:10px;">${gDoi+gUrl+gEv||"—"}</td></tr>`;
  }).join("");

  // Tipo resumen global
  const tipoRes={};allPubs.forEach(p=>{const t=p.tipoPublicacion||"Otro";tipoRes[t]=(tipoRes[t]||0)+1;});
  const tipoRows=Object.entries(tipoRes).sort((a,b)=>b[1]-a[1]).map(([t,c])=>`<tr><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;">${t}</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;font-weight:700;">${c}</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;">${Math.round(c/totalPubs*100)}%</td></tr>`).join("");

  // Secciones por autor
  const autorSections=autores.map(autor=>{
    const aL=links.filter(l=>l.autorId===autor.id);
    let aP=allPubs.filter(p=>aL.some(l=>l.pubId===p.id));
    if(aP.length===0)return"";
    const aRows=aP.map((p,i)=>{
      const idx=[p.indexacion1,p.indexacion2,p.indexacion3].filter(Boolean).join(", ")||"N/A";
      const ec=p.estadoPublicacion==="Publicado"?"#047857":p.estadoPublicacion==="Aceptado"?"#0369a1":"#a16207";
      const aDoi=p.doi?`<a href="https://doi.org/${p.doi}" style="color:#c2410c;font-size:9px;display:block;margin-bottom:2px;">🔗 DOI ↗</a>`:"";const aUrl=p.url?`<a href="${p.url}" style="color:#1d4ed8;font-size:9px;display:block;margin-bottom:2px;">🌐 URL ↗</a>`:"";const aEv=p.evidencia?`<a href="${p.evidencia}" style="color:#6d28d9;font-size:9px;display:block;">📁 OneDrive ↗</a>`:"";const urlCell=aDoi||aUrl||aEv;
      return`<tr><td style="padding:4px 6px;border:1px solid #e2e8f0;text-align:center;color:${C1};font-size:10px;font-weight:700;">${i+1}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;"><strong>${p.titulo}</strong></td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${p.tipoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;color:${ec};font-weight:600;">${p.estadoPublicacion||"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;text-align:center;font-weight:bold;">${p.cuartil&&p.cuartil!=="N/A"?p.cuartil:"—"}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${idx}</td><td style="padding:4px 6px;border:1px solid #e2e8f0;font-size:10px;">${aDoi+aUrl+aEv||"—"}</td></tr>`;
    }).join("");
    const aLinks=[autor.orcid?`<a href="https://orcid.org/${autor.orcid}" style="color:#a6ce39;font-size:9px;font-weight:bold;">ORCID</a>`:"",autor.scopusId?`<a href="https://www.scopus.com/authid/detail.uri?authorId=${autor.scopusId}" style="color:#e9711c;font-size:9px;font-weight:bold;">Scopus</a>`:"",autor.scholarId?`<a href="https://scholar.google.com/citations?user=${autor.scholarId}" style="color:#4285F4;font-size:9px;font-weight:bold;">Scholar</a>`:""].filter(Boolean).join(" · ");
    const fotoTag=autor.fotoUrl?`<img src="${driveImgUrl(autor.fotoUrl)}" style="width:36px;height:36px;max-width:36px;max-height:36px;border-radius:50%;object-fit:cover;border:2px solid rgba(255,255,255,0.5);margin-right:10px;vertical-align:middle;mso-width-source:absolute;mso-height-source:absolute;" alt=""/>`:""
    return`<div style="margin-bottom:20px;border:1px solid #e2e8f0;border-radius:6px;overflow:hidden;page-break-inside:avoid;">
      <div style="background:${C1};color:white;padding:7px 14px;display:flex;justify-content:space-between;align-items:center;">
        <div style="display:flex;align-items:center;">${fotoTag}<div><strong style="font-size:12px;">${autor.nombres} ${autor.apellidos}</strong>${autor.tituloAcademico?` <span style="font-size:10px;opacity:.8;">· ${autor.tituloAcademico}</span>`:""}</div></div>
        <div style="font-size:10px;opacity:.8;">${aP.length} publicaciones${autor.horasInvestigacion?` &nbsp;·&nbsp; ${autor.horasInvestigacion} hrs inv/sem`:""}${aLinks?` &nbsp;|&nbsp; ${aLinks}`:""}</div>
      </div>
      <table style="margin:0;font-size:10px;width:100%;border-collapse:collapse;">
        <tr><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:3%;">#</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:30%;">Título</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:9%;">Tipo</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:9%;">Estado</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:4%;">Q</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:22%;">Indexación</th><th style="background:${NAVY};color:white;padding:5px 6px;border:1px solid ${NAVY};font-size:9px;width:8%;">Evidencia</th></tr>
        ${aRows}
      </table>
    </div>`;
  }).join("");

  // Ranking autores para el resumen
  const rankRows=autores.map(a=>{
    const cnt=allPubs.filter(p=>links.some(l=>l.pubId===p.id&&l.autorId===a.id)).length;
    return{...a,cnt};
  }).filter(a=>a.cnt>0).sort((a,b)=>b.cnt-a.cnt)
  .map((a,i)=>`<tr${i%2===0?' style="background:#fafafa;"':''}><td style="padding:5px 8px;border:1px solid #e2e8f0;font-size:11px;text-align:center;font-weight:bold;color:${C1};">${i+1}</td><td style="padding:5px 8px;border:1px solid #e2e8f0;font-size:11px;font-weight:600;">${a.apellidos}, ${a.nombres.split(" ")[0]}</td><td style="padding:5px 8px;border:1px solid #e2e8f0;font-size:11px;text-align:center;font-weight:700;color:${C1};">${a.cnt}</td></tr>`).join("");

  const html=`<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40"><head><meta charset="utf-8"><style>@page{size:A4;margin:1.8cm 2cm}body{font-family:Arial,sans-serif;margin:0;padding:0;color:#1e293b;font-size:11px}.hb{border-bottom:3px solid ${C1};padding-bottom:10px;margin-bottom:18px;display:flex;justify-content:space-between;align-items:center}.lt{font-size:14px;font-weight:bold;color:${C1};letter-spacing:1px}.ls{font-size:10px;color:#64748b}h1{font-size:17px;color:${C1};text-align:center;margin:0 0 4px;border:none}h2{font-size:12px;color:${NAVY};border-bottom:2px solid ${C1};padding-bottom:3px;margin:18px 0 8px;text-transform:uppercase;letter-spacing:.5px}table{width:100%;border-collapse:collapse;margin:6px 0}th{background:${C1};color:white;text-align:left;padding:6px 8px;border:1px solid ${C1};font-size:10px;text-transform:uppercase}.kt td{text-align:center;padding:10px;border:1px solid #d1d5db}.kn{font-size:20px;font-weight:bold}.ft{margin-top:24px;text-align:center;color:#94a3b8;font-size:9px;border-top:1px solid #e2e8f0;padding-top:8px}.ib{background:${C1Bg};border-left:4px solid ${C1};padding:8px 12px;margin-bottom:12px;border-radius:0 6px 6px 0}.ir{display:flex;gap:6px;margin-bottom:2px;font-size:11px}.il{font-weight:700;color:#475569;min-width:140px}.iv{color:#1e293b}</style></head><body>
  <div class="hb"><div><div class="lt">UNIVERSIDAD DE OTAVALO</div><div class="ls">Facultad de Ciencias Sociales y Pedagógicas</div><div class="ls">Coordinación de Investigación</div></div><div style="text-align:right"><div style="font-size:10px;color:#94a3b8;">PubTracker · Reporte Consolidado</div><div style="font-size:10px;color:#94a3b8;">${fechaStr}</div></div></div>
  <div style="text-align:center;margin-bottom:14px;"><h1>Informe Consolidado de Producción Científica</h1><p style="font-size:13px;font-weight:bold;color:${NAVY};margin:3px 0;">Facultad de Ciencias Sociales y Pedagógicas</p></div>
  <div class="ib"><div class="ir"><span class="il">Período:</span><span class="iv">${periodo}</span></div><div class="ir"><span class="il">Fecha de generación:</span><span class="iv">${fechaStr}</span></div><div class="ir"><span class="il">Total registros:</span><span class="iv">${totalPubs} publicaciones${filtros.tipo?` · Tipo: ${filtros.tipo}`:""}</span></div><div class="ir"><span class="il">Docentes con producción:</span><span class="iv">${autores.filter(a=>allPubs.some(p=>links.some(l=>l.pubId===p.id&&l.autorId===a.id))).length} investigadores</span></div>${filtros.departamento?`<div class="ir"><span class="il">Carrera / Departamento:</span><span class="iv" style="font-weight:700;color:${C1};">${filtros.departamento}</span></div>`:""}</div>
  <h2>1. Resumen Ejecutivo de la Facultad</h2>
  <table class="kt"><tr><td><div class="kn" style="color:${C1};">${totalPubs}</div><div style="font-size:10px;color:#64748b;">Total</div></td><td><div class="kn" style="color:#047857;">${publicadas}</div><div style="font-size:10px;color:#64748b;">Publicadas</div></td><td><div class="kn" style="color:#0369a1;">${enProceso}</div><div style="font-size:10px;color:#64748b;">En Proceso</div></td><td><div class="kn" style="color:#a16207;">${scopusCnt}</div><div style="font-size:10px;color:#64748b;">Scopus</div></td><td><div class="kn" style="color:#6d28d9;">${wosCnt}</div><div style="font-size:10px;color:#64748b;">WoS</div></td><td><div class="kn" style="color:${C1};">${q1q2}</div><div style="font-size:10px;color:#64748b;">Q1/Q2</div></td></tr></table>
  <h2>2. Distribución por Tipo de Publicación</h2>
  <table><tr><th style="width:60%;">Tipo</th><th style="width:20%;text-align:center;">Cantidad</th><th style="width:20%;text-align:center;">%</th></tr>${tipoRows}<tr style="background:${C1Bg};font-weight:bold;"><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;color:${C1};">TOTAL</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:${C1};">${totalPubs}</td><td style="padding:5px 8px;border:1px solid #d1d5db;font-size:11px;text-align:center;color:${C1};">100%</td></tr></table>
  <h2>3. Ranking de Investigadores</h2>
  <table><tr><th style="width:8%;text-align:center;">#</th><th style="width:62%;">Investigador</th><th style="width:30%;text-align:center;">Publicaciones</th></tr>${rankRows}</table>
  <h2>4. Matriz Global de Publicaciones</h2>
  <table><tr><th style="width:3%;text-align:center;">#</th><th style="width:26%;">Título</th><th style="width:14%;">Autores</th><th style="width:9%;">Tipo</th><th style="width:8%;">Estado</th><th style="width:4%;text-align:center;">Q</th><th style="width:16%;">Revista/Editorial</th><th style="width:12%;">Indexación</th><th style="width:8%;text-align:center;">Evidencia</th></tr>${globalRows}</table>
  <h2>5. Detalle por Investigador</h2>
  ${autorSections}
  <div class="ft"><p>PubTracker · Coordinación de Investigación · Facultad de Ciencias Sociales y Pedagógicas · Universidad de Otavalo</p><p>Reporte consolidado generado el ${fechaStr}</p></div>
</body></html>`;
  const blob=new Blob(["\ufeff",html],{type:"application/msword"});
  const u=URL.createObjectURL(blob);
  const a=document.createElement("a");
  a.href=u;
  a.download=`Reporte_Consolidado_FCSyP_${filtros.anio||today.getFullYear()}.doc`;
  a.click();
  URL.revokeObjectURL(u);
}


function ProfileModal({user, autores, onSave, onClose, isAdmin, allAutores, onPhotoUploaded}){
  const autor = autores.find(a=>a.id===user.id) || user;
  const[tab,setTab]=useState("info");
  const[nombres,setNombres]=useState(autor.nombres||"");
  const[apellidos,setApellidos]=useState(autor.apellidos||"");
  const[email,setEmail]=useState(autor.email||"");
  const[depto,setDepto]=useState(autor.departamento||"");
  const[titulo,setTitulo]=useState(autor.tituloAcademico||"");
  // Priorizar user.fotoUrl que se actualiza reactivamente al subir foto
  const[fotUrl,setFotUrl]=useState(user.fotoUrl||autor.fotoUrl||"");
  const[orcid,setOrcid]=useState(autor.orcid||"");
  const[scopusId,setScopusId]=useState(autor.scopusId||"");
  const[schId,setSchId]=useState(autor.scholarId||"");
  const[rgUrl,setRgUrl]=useState(autor.researchgate||"");
  const[linkedin,setLinkedin]=useState(autor.linkedin||"");
  const[telefono,setTelefono]=useState(autor.telefono||"");
  const[bio,setBio]=useState(autor.bio||"");
  const[horasInv,setHorasInv]=useState(autor.horasInvestigacion||"");
  const[oldPass,setOldPass]=useState("");
  const[newPass,setNewPass]=useState("");
  const[newPass2,setNewPass2]=useState("");
  const[passMsg,setPassMsg]=useState(null);
  const[saving,setSaving]=useState(false);
  const[uploadingPhoto,setUploadingPhoto]=useState(false);

  const modoDemo = !API_URL;
  const tabs=[{id:"info",label:"Información",icon:User},{id:"redes",label:"Perfiles Académicos",icon:Link2},{id:"seguridad",label:"Seguridad",icon:Lock}];

  /* ── Subir foto a Google Drive via Apps Script ── */
  const handleFotoUpload=async(e)=>{
    const file=e.target.files?.[0];
    if(!file)return;
    if(!file.type.startsWith("image/"))return alert("Solo se permiten imágenes (JPG, PNG, WebP)");
    if(file.size>3*1024*1024)return alert("La imagen no debe superar 3 MB");
    if(modoDemo){alert("En modo demo la foto no se puede subir a Drive.\nPega directamente la URL de una imagen pública.");return;}
    setUploadingPhoto(true);
    try{
      const reader=new FileReader();
      reader.onload=async(ev)=>{
        const b64=ev.target.result.split(",")[1];
        const r=await apiPost({action:"uploadFoto",userId:user.id,fileName:file.name,mimeType:file.type,base64:b64});
        if(r?.ok&&r.url){
          setFotUrl(r.url);
          showToastLocal("Foto subida ✓ — visible en tu perfil");
          if(onPhotoUploaded) onPhotoUploaded(user.id, r.url); // actualiza sidebar y app inmediatamente
        }
        else alert("Error al subir la foto: "+(r?.error||"intente de nuevo"));
        setUploadingPhoto(false);
      };
      reader.readAsDataURL(file);
    }catch{setUploadingPhoto(false);alert("Error al procesar la imagen");}
  };

  /* ── Toast local dentro del modal ── */
  const[localToast,setLocalToast]=useState(null);
  const showToastLocal=(m)=>{setLocalToast(m);setTimeout(()=>setLocalToast(null),3000)};

  const handleSaveInfo=async()=>{
    if(!nombres.trim()||!apellidos.trim())return alert("Nombres y apellidos son requeridos");
    setSaving(true);
    const updated={...autor,nombres:nombres.toUpperCase(),apellidos:apellidos.toUpperCase(),email,departamento:depto,tituloAcademico:titulo,fotoUrl:fotUrl,orcid,scopusId,scholarId:schId,researchgate:rgUrl,linkedin,telefono,bio,horasInvestigacion:horasInv};
    await onSave(updated);
    setSaving(false);
  };

  const handleChangePass=async()=>{
    setPassMsg(null);
    if(!newPass||newPass.length<6)return setPassMsg({ok:false,msg:"La nueva contraseña debe tener al menos 6 caracteres"});
    if(newPass!==newPass2)return setPassMsg({ok:false,msg:"Las contraseñas no coinciden"});
    setSaving(true);
    const r=await apiPost({action:"changePassword",userId:user.id,oldPassword:oldPass,newPassword:newPass});
    setPassMsg(r?.ok?{ok:true,msg:"Contraseña actualizada ✓"}:{ok:false,msg:r?.error||"Error al cambiar contraseña"});
    setSaving(false);
    setOldPass("");setNewPass("");setNewPass2("");
  };

  const photoPreview = fotUrl ? driveImgUrl(fotUrl) : avatarUrl(nombres,apellidos);

  return(
    <div style={{background:"white",borderRadius:16,overflow:"hidden",maxWidth:580,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.18)"}}>
      {/* Header con foto */}
      <div style={{background:`linear-gradient(135deg,${NAVY},${C1})`,padding:"22px 24px 16px",color:"white",display:"flex",alignItems:"center",gap:16}}>
        <div style={{position:"relative",flexShrink:0}}>
          <img src={photoPreview} alt="foto" style={{width:72,height:72,borderRadius:"50%",border:"3px solid rgba(255,255,255,.4)",objectFit:"cover",background:"#fff"}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(nombres,apellidos)}}/>
        </div>
        <div style={{flex:1,minWidth:0}}>
          <h2 style={{fontSize:16,fontWeight:800,margin:0,fontFamily:"'Playfair Display',serif"}}>{nombres} {apellidos}</h2>
          <p style={{fontSize:11,color:"rgba(255,255,255,.6)",margin:"3px 0 0"}}>{depto||"Facultad de Ciencias Sociales y Pedagógicas"}</p>
          {titulo&&<p style={{fontSize:10,color:"rgba(255,255,255,.5)",margin:"2px 0 0"}}>{titulo}</p>}
        </div>
        <button onClick={onClose} style={{border:"none",background:"rgba(255,255,255,.15)",cursor:"pointer",color:"white",borderRadius:8,padding:6}}><X size={16}/></button>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",borderBottom:"1px solid #f1f5f9",background:"#fafbfc"}}>
        {tabs.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:11,fontWeight:tab===t.id?700:500,color:tab===t.id?C1:"#94a3b8",background:tab===t.id?"white":"transparent",borderBottom:tab===t.id?`3px solid ${C1}`:"3px solid transparent",display:"flex",alignItems:"center",justifyContent:"center",gap:5}}><t.icon size={13}/>{t.label}</button>)}
      </div>

      {localToast&&<div style={{background:P.greenBg,color:P.green,padding:"8px 16px",fontSize:12,fontWeight:600,display:"flex",alignItems:"center",gap:6,borderBottom:"1px solid #d1fae5"}}><CheckCircle2 size={13}/>{localToast}</div>}

      <div style={{padding:22,minHeight:260,maxHeight:"55vh",overflowY:"auto"}}>

        {/* ── Tab Información ── */}
        {tab==="info"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NOMBRES</label><Inp value={nombres} onChange={setNombres} placeholder="NOMBRES"/></div>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>APELLIDOS</label><Inp value={apellidos} onChange={setApellidos} placeholder="APELLIDOS"/></div>
          </div>
          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>EMAIL INSTITUCIONAL</label><Inp value={email} onChange={setEmail} placeholder="correo@uotavalo.edu.ec" type="email" icon={Mail}/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>DEPARTAMENTO / CARRERA</label><Inp value={depto} onChange={setDepto} placeholder="Ej: Educación Básica" icon={GraduationCap}/></div>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TÍTULO ACADÉMICO</label><Inp value={titulo} onChange={setTitulo} placeholder="Ej: Dr., Mg., MSc."/></div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TELÉFONO / WHATSAPP</label><Inp value={telefono} onChange={setTelefono} placeholder="+593 98 765 4321" icon={Phone}/></div>
            <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>HORAS DE INVESTIGACIÓN <span style={{fontWeight:400,color:"#94a3b8"}}>(h/semana)</span></label><Inp value={horasInv} onChange={setHorasInv} placeholder="Ej: 8" icon={Clock}/></div>
          </div>

          {/* ── FOTO: subida a Drive ── */}
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>FOTO DE PERFIL</label>
            <div style={{display:"flex",gap:10,alignItems:"center"}}>
              <img src={photoPreview} alt="" style={{width:52,height:52,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C1}30`,flexShrink:0}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(nombres,apellidos)}}/>
              <div style={{flex:1}}>
                {modoDemo
                  ? <><Inp value={fotUrl} onChange={v=>{setFotUrl(v);if(onPhotoUploaded&&v)onPhotoUploaded(user.id,v);}} placeholder="https://ejemplo.com/mi-foto.jpg" icon={Camera}/><p style={{fontSize:10,color:"#94a3b8",margin:"3px 0 0"}}>En modo demo pega la URL de una imagen pública</p></>
                  : <><label style={{display:"inline-flex",alignItems:"center",gap:6,padding:"8px 14px",borderRadius:10,border:`1.5px dashed ${C1}60`,background:C1Bg,cursor:"pointer",fontSize:12,fontWeight:600,color:C1}}>
                      {uploadingPhoto?<><Loader2 size={14} style={{animation:"spin 1s linear infinite"}}/>Subiendo…</>:<><Camera size={14}/>Subir foto (JPG/PNG, máx 3 MB)</>}
                      <input type="file" accept="image/*" onChange={handleFotoUpload} style={{display:"none"}} disabled={uploadingPhoto}/>
                    </label>
                    {fotUrl&&<p style={{fontSize:10,color:P.green,margin:"4px 0 0",display:"flex",alignItems:"center",gap:4}}><CheckCircle2 size={11}/>Foto guardada en Drive</p>}
                    <p style={{fontSize:10,color:"#94a3b8",margin:"3px 0 0"}}>La imagen se sube a la carpeta PubTracker en tu Google Drive</p>
                  </>
                }
              </div>
            </div>
          </div>

          <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>LÍNEAS DE INVESTIGACIÓN / BIO</label><textarea value={bio} onChange={e=>setBio(e.target.value)} placeholder="Describe tus áreas de investigación, intereses académicos…" rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/></div>
        </div>}

        {/* ── Tab Perfiles Académicos ── */}
        {tab==="redes"&&<div style={{display:"flex",flexDirection:"column",gap:14}}>
          <div style={{background:C1Bg,borderRadius:10,padding:"10px 14px",border:`1px solid ${C1}20`}}><p style={{fontSize:11,color:C1,margin:0,fontWeight:600}}>Estos identificadores aparecerán en tu informe Word y son visibles para el administrador</p></div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>ORCID iD</label>
            <Inp value={orcid} onChange={setOrcid} placeholder="0000-0000-0000-0000" icon={AtSign}/>
            <p style={{fontSize:10,color:"#94a3b8",margin:"2px 0 0"}}>Regístrate en <a href="https://orcid.org" target="_blank" rel="noreferrer" style={{color:C1}}>orcid.org</a> si aún no tienes</p>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>SCOPUS AUTHOR ID</label>
            <Inp value={scopusId} onChange={setScopusId} placeholder="Ej: 57234567890" icon={FlaskConical}/>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>GOOGLE SCHOLAR ID</label>
            <Inp value={schId} onChange={setSchId} placeholder="Código en la URL de tu perfil Scholar" icon={BookUser}/>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>RESEARCHGATE</label>
            <Inp value={rgUrl} onChange={setRgUrl} placeholder="https://www.researchgate.net/profile/Tu-Nombre" icon={Link2}/>
          </div>
          <div>
            <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>LINKEDIN</label>
            <Inp value={linkedin} onChange={setLinkedin} placeholder="https://www.linkedin.com/in/tu-perfil" icon={Linkedin}/>
          </div>
          {(orcid||scopusId||schId||rgUrl||linkedin)&&<div style={{background:"#f8fafc",borderRadius:10,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 8px",textTransform:"uppercase"}}>Vista previa de enlaces</p>
            <div style={{display:"flex",flexWrap:"wrap",gap:6}}>
              {orcid&&<a href={`https://orcid.org/${orcid}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#a6ce39",color:"white",fontSize:11,fontWeight:600,textDecoration:"none"}}><AtSign size={11}/>ORCID</a>}
              {scopusId&&<a href={`https://www.scopus.com/authid/detail.uri?authorId=${scopusId}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#e9711c",color:"white",fontSize:11,fontWeight:600,textDecoration:"none"}}><FlaskConical size={11}/>Scopus</a>}
              {schId&&<a href={`https://scholar.google.com/citations?user=${schId}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#4285F4",color:"white",fontSize:11,fontWeight:600,textDecoration:"none"}}><BookUser size={11}/>Scholar</a>}
              {rgUrl&&<a href={rgUrl} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#00CCBB",color:"white",fontSize:11,fontWeight:600,textDecoration:"none"}}><Link2 size={11}/>ResearchGate</a>}
              {linkedin&&<a href={linkedin} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:4,padding:"4px 10px",borderRadius:20,background:"#0A66C2",color:"white",fontSize:11,fontWeight:600,textDecoration:"none"}}><Linkedin size={11}/>LinkedIn</a>}
            </div>
          </div>}
        </div>}

        {/* ── Tab Seguridad ── */}
        {tab==="seguridad"&&<div style={{display:"flex",flexDirection:"column",gap:12}}>
          {modoDemo
            /* ── MODO DEMO: cambio de clave deshabilitado ── */
            ? <div style={{textAlign:"center",padding:"30px 20px"}}>
                <div style={{width:52,height:52,borderRadius:14,background:"#f1f5f9",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:12}}><Lock size={24} style={{color:"#94a3b8"}}/></div>
                <h4 style={{fontSize:14,fontWeight:700,color:P.navy,margin:"0 0 8px"}}>Cambio de contraseña no disponible</h4>
                <p style={{fontSize:12,color:"#64748b",margin:0,lineHeight:1.6}}>En modo demo no está conectado a Google Sheets.<br/>El cambio de contraseña estará disponible cuando la aplicación esté desplegada con el backend activo.</p>
                <div style={{marginTop:16,padding:"10px 14px",background:P.goldBg,borderRadius:10,border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>Para producción: el Apps Script debe implementar la acción <code>changePassword</code></p></div>
              </div>
            /* ── MODO CONECTADO: formulario normal ── */
            : <>
                <div style={{background:P.goldBg,borderRadius:10,padding:"10px 14px",border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>🔐 Por seguridad ingresa tu contraseña actual antes de cambiarla</p></div>
                <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONTRASEÑA ACTUAL</label><Inp value={oldPass} onChange={setOldPass} placeholder="Tu contraseña actual" type="password" icon={Lock}/></div>
                <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NUEVA CONTRASEÑA</label><Inp value={newPass} onChange={setNewPass} placeholder="Mínimo 6 caracteres" type="password" icon={KeyRound}/></div>
                <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONFIRMAR CONTRASEÑA</label><Inp value={newPass2} onChange={setNewPass2} placeholder="Repite la nueva contraseña" type="password" icon={KeyRound}/></div>
                {passMsg&&<div style={{background:passMsg.ok?P.greenBg:P.roseBg,color:passMsg.ok?P.green:P.rose,padding:"8px 12px",borderRadius:10,fontSize:12,display:"flex",alignItems:"center",gap:6}}>{passMsg.ok?<CheckCircle2 size={14}/>:<AlertCircle size={14}/>}{passMsg.msg}</div>}
                <Btn primary onClick={handleChangePass} disabled={saving||!oldPass||!newPass||!newPass2} icon={Lock}>Cambiar Contraseña</Btn>
              </>
          }
        </div>}
      </div>

      {/* Footer */}
      {tab!=="seguridad"&&<div style={{display:"flex",gap:8,justifyContent:"flex-end",padding:"12px 22px",borderTop:"1px solid #f1f5f9",background:"#fafbfc"}}>
        <Btn onClick={onClose}>Cancelar</Btn>
        <Btn primary onClick={handleSaveInfo} disabled={saving||uploadingPhoto} icon={saving?Loader2:Save}>{saving?"Guardando…":"Guardar Perfil"}</Btn>
      </div>}
    </div>
  );
}


function ReporteModal({autores,pubs,links,onClose,isAdmin}){
  const[fAnio,setFAnio]=useState("");const[fTipo,setFTipo]=useState("");const[fAutorId,setFAutorId]=useState("");const[fDepto,setFDepto]=useState("");
  const years=useMemo(()=>{const ys=new Set();pubs.forEach(p=>{const y=parseYear(p.fechaPublicacion);if(y)ys.add(y)});return Array.from(ys).sort((a,b)=>b-a)},[pubs]);
  const deptos=useMemo(()=>{const ds=new Set();autores.forEach(a=>{if(a.departamento)ds.add(a.departamento)});return Array.from(ds).sort()},[autores]);
  const autoresFilt=useMemo(()=>fDepto?autores.filter(a=>a.departamento===fDepto):autores,[autores,fDepto]);
  const preview=useMemo(()=>{
    let l=pubs;
    if(fAnio)l=l.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));
    if(fTipo)l=l.filter(p=>p.tipoPublicacion===fTipo);
    if(fAutorId){const ids=links.filter(x=>x.autorId===fAutorId).map(x=>x.pubId);l=l.filter(p=>ids.includes(p.id));}
    else if(fDepto){const dIds=new Set(autoresFilt.map(a=>a.id));l=l.filter(p=>links.some(x=>dIds.has(x.autorId)&&x.pubId===p.id));}
    return l;
  },[pubs,links,fAnio,fTipo,fAutorId,fDepto,autoresFilt]);
  const handleExcel=()=>{exportExcel(pubs,autores,links,{anio:fAnio,tipo:fTipo,autorId:fAutorId});if(preview.length>0)onClose()};
  const handleWord=()=>{
    if(fAutorId){const autor=autores.find(a=>a.id===fAutorId);if(autor)exportWord(autor,pubs,links,{anio:fAnio,tipo:fTipo});}
    else{const autCon=autoresFilt.filter(a=>{const aL=links.filter(l=>l.autorId===a.id);let ap=pubs.filter(p=>aL.some(l=>l.pubId===p.id));if(fAnio)ap=ap.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));if(fTipo)ap=ap.filter(p=>p.tipoPublicacion===fTipo);return ap.length>0});if(autCon.length===0){alert("No hay publicaciones con los filtros seleccionados");return;}autCon.forEach(a=>exportWord(a,pubs,links,{anio:fAnio,tipo:fTipo}));}
    onClose();
  };
  const handleConsolidado=()=>{exportWordConsolidado(pubs,autoresFilt,links,{anio:fAnio,tipo:fTipo,departamento:fDepto});onClose();};
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:500,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Generar Reporte</h3><button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button></div>
    <div style={{display:"flex",flexDirection:"column",gap:10,marginBottom:16}}>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>AÑO</label><select value={fAnio} onChange={e=>setFAnio(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}><option value="">Todos los años</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TIPO</label><Sel value={fTipo} onChange={setFTipo} options={TIPOS} placeholder="Todos los tipos"/></div>
      {isAdmin&&deptos.length>0&&<div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CARRERA / DEPARTAMENTO</label><select value={fDepto} onChange={e=>{setFDepto(e.target.value);setFAutorId("");}} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:`1.5px solid ${fDepto?C1:"#e2e8f0"}`,fontSize:13,background:"white",outline:"none",color:fDepto?C1:"inherit"}}><option value="">Todas las carreras</option>{deptos.map(d=><option key={d} value={d}>{d}</option>)}</select></div>}
      <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>AUTOR ESPECÍFICO</label><select value={fAutorId} onChange={e=>{setFAutorId(e.target.value);setFDepto("");}} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}><option value="">Todos los autores{fDepto?` de ${fDepto}`:""}</option>{autoresFilt.map(a=><option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}</select></div>
    </div>
    <div style={{background:C1Bg,borderRadius:10,padding:"10px 14px",marginBottom:12,border:`1px solid ${C1}20`}}><p style={{fontSize:11,color:C1,margin:0,fontWeight:600}}>{preview.length} publicaciones coinciden{fDepto?` · ${fDepto}`:""}</p></div>
    {isAdmin&&!fAutorId&&<div style={{background:P.goldBg,borderRadius:10,padding:"10px 14px",marginBottom:12,border:"1px solid #fde68a"}}>
      <p style={{fontSize:11,color:P.gold,fontWeight:700,margin:"0 0 6px",display:"flex",alignItems:"center",gap:5}}><Shield size={13}/>Opción administrador</p>
      <p style={{fontSize:10,color:"#92400e",margin:"0 0 8px"}}>Reporte con resumen ejecutivo {fDepto?`de ${fDepto}`:"de la facultad"} + secciones por investigador</p>
      <button onClick={handleConsolidado} disabled={preview.length===0} style={{width:"100%",padding:"8px 14px",borderRadius:10,border:"none",background:`linear-gradient(135deg,${NAVY},${C1})`,color:"white",fontSize:12,fontWeight:700,cursor:preview.length===0?"not-allowed":"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:6,opacity:preview.length===0?.5:1}}><FileDown size={14}/>Reporte Consolidado {fDepto?`· ${fDepto}`:"FCSyP"}</button>
    </div>}
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn onClick={onClose}>Cancelar</Btn><Btn onClick={handleExcel} icon={FileSpreadsheet}>Excel</Btn><Btn primary onClick={handleWord} icon={FileDown}>{fAutorId?"Word Individual":"Word por Autor"}</Btn></div>
  </div>);
}

/* ════════════════════════
   LOGIN
   ════════════════════════ */
function AuthScreen({onLogin}){
  const[email,setEmail]=useState("");const[pass,setPass]=useState("");const[loading,setLoading]=useState(false);const[error,setError]=useState("");
  const doLogin=async()=>{if(!email||!pass)return setError("Complete todos los campos");setLoading(true);setError("");
    if(API_URL){const r=await apiPost({action:"login",email,password:pass});if(r?.ok)onLogin(r.user);else setError(r?.error||"Credenciales incorrectas.")}
    else{if(email==="admin"&&pass==="UNO2025")onLogin({id:"admin",nombres:"ADMINISTRADOR",apellidos:"SISTEMA",email:"admin",rol:"admin"});else{const a=DEMO.autores.find(x=>x.email?.toLowerCase()===email.toLowerCase());if(a)onLogin({...a,rol:"autor"});else setError("Credenciales incorrectas. Contacte al administrador.")}}setLoading(false)};
  return(<div style={{minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:`linear-gradient(135deg,${NAVY} 0%,${C1} 55%,${C1L} 100%)`,fontFamily:"'DM Sans',system-ui,sans-serif"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');@keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
    <div style={{width:"min(420px,94vw)",background:"white",borderRadius:20,boxShadow:"0 25px 80px rgba(0,0,0,.35)",overflow:"hidden",animation:"fadeUp .5s ease",margin:"0 12px"}}>
      <div style={{background:`linear-gradient(135deg,${NAVY},${C1})`,padding:"24px 28px 18px",textAlign:"center"}}>
        <div style={{width:48,height:48,borderRadius:14,background:"rgba(255,255,255,.15)",display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><BookOpen size={22} style={{color:"white"}}/></div>
        <h1 style={{color:"white",fontSize:22,fontWeight:800,margin:0,fontFamily:"'Playfair Display',serif"}}>PubTracker</h1>
        <p style={{color:"rgba(255,255,255,.6)",fontSize:11,margin:"4px 0 0"}}>Facultad de Ciencias Sociales y Pedagógicas · UNO</p>
      </div>
      <div style={{padding:"6px 0 0",borderBottom:"1px solid #f1f5f9",background:"white",textAlign:"center"}}><p style={{fontSize:12,fontWeight:700,color:C1,padding:"10px 0",margin:0}}>Iniciar Sesión</p></div>
      <div style={{padding:"20px 24px 28px"}}>
        {error&&<div style={{background:P.roseBg,color:P.rose,padding:"8px 12px",borderRadius:10,fontSize:12,marginBottom:14,display:"flex",alignItems:"center",gap:6}}><AlertCircle size={14}/>{error}</div>}
        <div style={{marginBottom:10}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>EMAIL / USUARIO</label><Inp value={email} onChange={setEmail} placeholder="correo@uotavalo.edu.ec" type="email" icon={Mail}/></div>
        <div style={{marginBottom:18}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CONTRASEÑA</label><Inp value={pass} onChange={setPass} placeholder="••••••" type="password" icon={Lock}/></div>
        <button onClick={doLogin} disabled={loading} style={{width:"100%",padding:"11px",borderRadius:12,border:"none",background:`linear-gradient(135deg,${C1},${C1L})`,color:"white",fontSize:14,fontWeight:700,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,boxShadow:`0 4px 16px ${C1}40`}}>{loading?<Loader2 size={18} style={{animation:"spin 1s linear infinite"}}/>:<><LogIn size={16}/>Ingresar</>}</button>
        <p style={{fontSize:11,color:"#94a3b8",textAlign:"center",marginTop:14}}>¿No tiene acceso? Comuníquese con el administrador del sistema.</p>
        {!API_URL&&<div style={{marginTop:14,padding:10,background:P.goldBg,borderRadius:10,border:"1px solid #fde68a"}}><p style={{fontSize:11,color:P.gold,margin:0,fontWeight:600}}>Modo Demo</p><p style={{fontSize:10,color:"#92400e",margin:"3px 0 0"}}>🔑 Admin: admin / UNO2025</p><p style={{fontSize:10,color:"#92400e",margin:"2px 0 0"}}>👤 Docente: aflores@uotavalo.edu.ec / cualquier clave</p></div>}
      </div>
    </div>
  </div>);
}

/* ════════════════════════
   FORMULARIO PUBLICACIÓN
   ════════════════════════ */
function PubForm({pub,autores,pubAutores,onSave,onCancel,currentUser}){
  const isE=!!pub;const[step,setStep]=useState(1);
  const[form,setForm]=useState(()=>pub?{...pub}:{titulo:"",tipoPublicacion:"",estadoPublicacion:"En preparación",fechaPublicacion:"",cuartil:"N/A",revista:"",issn:"",volumen:"",numero:"",paginas:"",doi:"",url:"",evidencia:"",indexacion1:"",indexacion2:"",indexacion3:"",registrado:"No",autoresExternos:""});
  const[selA,setSelA]=useState(()=>pub?pubAutores.filter(l=>l.pubId===pub.id).map(l=>l.autorId):(currentUser?.rol!=="admin"?[currentUser?.id].filter(Boolean):[]));
  const s=(k,v)=>setForm(p=>({...p,[k]:v}));
  const submit=()=>{if(!form.titulo.trim())return alert("Título requerido");if(selA.length===0)return alert("Seleccione al menos un autor");onSave({...form,id:pub?.id},selA)};
  const steps=["Información","Bibliometría","Indexación"];
  return(<div style={{background:"white",borderRadius:16,overflow:"hidden",boxShadow:"0 20px 60px rgba(0,0,0,.12)",maxWidth:680,width:"100%"}}>
    <div style={{background:`linear-gradient(135deg,${NAVY},${C1})`,padding:"18px 24px",color:"white"}}><h2 style={{fontSize:17,fontWeight:700,margin:0,fontFamily:"'Playfair Display',serif"}}>{isE?"Editar Publicación":"Nueva Publicación"}</h2></div>
    <div className="steps-bar" style={{display:"flex",borderBottom:"1px solid #f1f5f9",background:"#fafbfc"}}>{steps.map((t,i)=><button key={i} onClick={()=>setStep(i+1)} style={{flex:1,padding:"10px 6px",border:"none",cursor:"pointer",fontSize:12,fontWeight:step===i+1?700:500,color:step===i+1?C1:step>i+1?P.green:"#94a3b8",background:step===i+1?"white":"transparent",borderBottom:step===i+1?`3px solid ${C1}`:"3px solid transparent"}}>{i+1}. {t}</button>)}</div>
    <div style={{padding:22,minHeight:260}}>
      {step===1&&<div className="form-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TÍTULO *</label><Inp value={form.titulo} onChange={v=>s("titulo",v)} placeholder="Título completo"/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>TIPO *</label><Sel value={form.tipoPublicacion} onChange={v=>s("tipoPublicacion",v)} options={TIPOS}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>FECHA</label><Inp value={form.fechaPublicacion} onChange={v=>s("fechaPublicacion",v)} placeholder="DD/MM/AAAA"/></div>
        <div style={{gridColumn:"span 2"}}>
          <label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>AUTORES DE LA FACULTAD * <span style={{fontWeight:400,color:"#94a3b8"}}>(selecciona todos los que participaron)</span></label>
          <div style={{display:"flex",flexWrap:"wrap",gap:5,padding:8,borderRadius:10,border:"1.5px solid #e2e8f0",maxHeight:120,overflowY:"auto"}}>
            {autores.map(a=>{const sel=selA.includes(a.id);return<button key={a.id} onClick={()=>setSelA(p=>sel?p.filter(x=>x!==a.id):[...p,a.id])} style={{display:"inline-flex",alignItems:"center",gap:4,padding:"3px 10px",borderRadius:20,border:sel?`2px solid ${C1}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:sel?600:400,background:sel?C1Bg:"white",color:sel?C1:"#475569",cursor:"pointer"}}>{sel&&<Check size={10}/>}{a.nombres} {a.apellidos}</button>})}
          </div>
        </div>
        <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:P.violet,display:"block",marginBottom:3}}>AUTORES EXTERNOS <span style={{fontWeight:400,color:"#94a3b8"}}>(de otras instituciones)</span></label><textarea value={form.autoresExternos||""} onChange={e=>s("autoresExternos",e.target.value)} placeholder="Ej: Juan Pérez (U. Central), María López (PUCE)" rows={3} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,color:"#1e293b",background:"white",outline:"none",boxSizing:"border-box",resize:"vertical",fontFamily:"inherit"}}/></div>
      </div>}
      {step===2&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12}}>
        <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>REVISTA / EDITORIAL</label><Inp value={form.revista} onChange={v=>s("revista",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>ISSN / ISBN</label><Inp value={form.issn} onChange={v=>s("issn",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>CUARTIL</label><Sel value={form.cuartil} onChange={v=>s("cuartil",v)} options={CUARTILES}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>VOLUMEN</label><Inp value={form.volumen} onChange={v=>s("volumen",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>NÚMERO</label><Inp value={form.numero} onChange={v=>s("numero",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>PÁGINAS</label><Inp value={form.paginas} onChange={v=>s("paginas",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>DOI</label><Inp value={form.doi} onChange={v=>s("doi",v)}/></div>
        <div><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:3}}>URL PUBLICACIÓN <span style={{fontWeight:400,color:"#94a3b8"}}>(enlace a la revista/editorial)</span></label><Inp value={form.url} onChange={v=>s("url",v)} placeholder="https://revista.ejemplo.com/articulo"/></div>
        <div style={{gridColumn:"span 2"}}><label style={{fontSize:10,fontWeight:600,color:"#6d28d9",display:"block",marginBottom:3}}>EVIDENCIA / RESPALDO <span style={{fontWeight:400,color:"#94a3b8"}}>(carpeta OneDrive, Drive, o archivo de constancia)</span></label><Inp value={form.evidencia||""} onChange={v=>s("evidencia",v)} placeholder="https://onedrive.live.com/..." icon={ExternalLink}/></div>
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
          <div style={{display:"flex",gap:5,flexWrap:"wrap"}}><EBdg e={form.estadoPublicacion}/><QBdg q={form.cuartil}/>{form.tipoPublicacion&&<TipoBdg tipo={form.tipoPublicacion}/>}</div>
        </div>
      </div>}
    </div>
    <div style={{display:"flex",justifyContent:"space-between",padding:"12px 22px",borderTop:"1px solid #f1f5f9",background:"#fafbfc"}}>
      <Btn onClick={onCancel}>Cancelar</Btn>
      <div style={{display:"flex",gap:8}}>{step>1&&<Btn onClick={()=>setStep(step-1)} icon={ChevronLeft}>Anterior</Btn>}{step<3?<Btn primary onClick={()=>setStep(step+1)}>Siguiente <ChevronRight size={13}/></Btn>:<Btn primary onClick={submit} icon={Save}>{isE?"Guardar":"Registrar"}</Btn>}</div>
    </div>
  </div>);
}

/* ════════════════════════════════════════
   MODAL DETALLE DE PUBLICACIÓN
   ════════════════════════════════════════ */
function DetailModal({pub, autores, links, onClose, onEdit, onStatus}){
  const aus = links.filter(l=>l.pubId===pub.id).map(l=>{const a=autores.find(x=>x.id===l.autorId);return a?`${a.nombres} ${a.apellidos}`:null;}).filter(Boolean);
  const idx = [pub.indexacion1,pub.indexacion2,pub.indexacion3].filter(Boolean);
  const ec  = pub.estadoPublicacion==="Publicado"?"#047857":pub.estadoPublicacion==="Aceptado"?"#0369a1":pub.estadoPublicacion==="En revisión"?"#d97706":"#64748b";

  const Row=({label,value,children})=>value||children?<div style={{display:"flex",gap:10,padding:"7px 0",borderBottom:"1px solid #f8fafc"}}><span style={{fontSize:11,fontWeight:700,color:"#64748b",minWidth:130,flexShrink:0}}>{label}</span><span style={{fontSize:12,color:"#1e293b",flex:1}}>{children||value}</span></div>:null;

  return(
    <div style={{background:"white",borderRadius:16,overflow:"hidden",maxWidth:600,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}}>
      {/* Header */}
      <div style={{background:`linear-gradient(135deg,${NAVY},${C1})`,padding:"18px 20px 14px",color:"white"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",gap:12}}>
          <div style={{flex:1,minWidth:0}}>
            <div style={{display:"flex",gap:6,marginBottom:6,flexWrap:"wrap"}}>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(255,255,255,.2)",color:"white"}}>{pub.tipoPublicacion||"—"}</span>
              <span style={{fontSize:10,fontWeight:700,padding:"2px 8px",borderRadius:20,background:"rgba(255,255,255,.15)",color:"white"}}>{pub.estadoPublicacion||"—"}</span>
              {pub.cuartil&&pub.cuartil!=="N/A"&&<span style={{fontSize:10,fontWeight:800,padding:"2px 8px",borderRadius:20,background:"rgba(255,255,255,.25)",color:"white"}}>{pub.cuartil}</span>}
            </div>
            <h2 style={{fontSize:14,fontWeight:700,margin:0,lineHeight:1.4,color:"white"}}>{pub.titulo}</h2>
          </div>
          <button onClick={onClose} style={{border:"none",background:"rgba(255,255,255,.15)",cursor:"pointer",color:"white",borderRadius:8,padding:6,flexShrink:0}}><X size={16}/></button>
        </div>
        {/* Links prominentes en el header */}
        {(pub.doi||pub.url||pub.evidencia)&&<div style={{display:"flex",gap:8,marginTop:10,flexWrap:"wrap"}}>
          {pub.doi&&<a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,background:"rgba(255,255,255,.15)",border:"1px solid rgba(255,255,255,.3)",color:"white",fontSize:11,fontWeight:700,textDecoration:"none"}}><ExternalLink size={12}/>DOI</a>}
          {pub.url&&<a href={pub.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,background:"rgba(255,255,255,.2)",border:"1px solid rgba(255,255,255,.35)",color:"white",fontSize:11,fontWeight:700,textDecoration:"none"}}><ExternalLink size={12}/>Ver publicación</a>}
          {pub.evidencia&&<a href={pub.evidencia} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:5,padding:"5px 12px",borderRadius:8,background:"rgba(167,139,250,.3)",border:"1px solid rgba(167,139,250,.5)",color:"white",fontSize:11,fontWeight:700,textDecoration:"none"}}><ExternalLink size={12}/>Evidencia / Respaldo</a>}
        </div>}
      </div>

      {/* Cuerpo */}
      <div style={{padding:"16px 20px",maxHeight:"52vh",overflowY:"auto"}}>
        <Row label="Autores facultad">{aus.length>0?aus.map((a,i)=><span key={i} style={{display:"inline-block",background:C1Bg,color:C1,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600,marginRight:4,marginBottom:2}}>{a}</span>):"—"}</Row>
        {pub.autoresExternos&&<Row label="Autores externos"><span style={{color:P.violet}}>{pub.autoresExternos}</span></Row>}
        <Row label="Revista / Editorial" value={pub.revista}/>
        <Row label="ISSN / ISBN" value={pub.issn}/>
        <Row label="Volumen / Número">{[pub.volumen,pub.numero].filter(Boolean).join(" / ")||"—"}</Row>
        <Row label="Páginas" value={pub.paginas}/>
        <Row label="Fecha de publicación" value={pub.fechaPublicacion}/>
        <Row label="Cuartil">{pub.cuartil&&pub.cuartil!=="N/A"?<span style={{fontWeight:800,color:C1}}>{pub.cuartil}</span>:"N/A"}</Row>
        <Row label="Indexación">
          {idx.length>0
            ? idx.map((ix,i)=><span key={i} style={{display:"inline-block",background:P.goldBg,color:P.gold,borderRadius:20,padding:"2px 8px",fontSize:11,fontWeight:600,marginRight:4,marginBottom:2}}>{ix}</span>)
            : <span style={{color:"#94a3b8"}}>Sin indexación registrada</span>}
        </Row>
        <Row label="Registrado Dir. Inv.">{pub.registrado==="Sí"?<span style={{color:P.green,fontWeight:700}}>✓ Sí</span>:<span style={{color:"#94a3b8"}}>✗ No</span>}</Row>
        {pub.doi&&<Row label="DOI"><a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noreferrer" style={{color:"#c2410c",fontWeight:600,fontSize:12,wordBreak:"break-all"}}>{pub.doi} ↗</a></Row>}
        {pub.url&&<Row label="URL Publicación"><a href={pub.url} target="_blank" rel="noreferrer" style={{color:"#1d4ed8",fontWeight:600,fontSize:12,wordBreak:"break-all"}}>{pub.url} ↗</a></Row>}
        {pub.evidencia&&<Row label="OneDrive / Respaldo"><a href={pub.evidencia} target="_blank" rel="noreferrer" style={{color:"#7c3aed",fontWeight:600,fontSize:12,wordBreak:"break-all",display:"inline-flex",alignItems:"center",gap:4}}>📁 Ver carpeta OneDrive ↗</a></Row>}
      </div>

      {/* Footer acciones */}
      <div style={{display:"flex",gap:8,justifyContent:"flex-end",padding:"12px 20px",borderTop:"1px solid #f1f5f9",background:"#fafbfc"}}>
        <Btn onClick={onClose}>Cerrar</Btn>
        <Btn onClick={()=>{onStatus(pub);onClose();}} icon={CheckCircle2}>Cambiar Estado</Btn>
        <Btn primary onClick={()=>{onEdit(pub);onClose();}} icon={Edit3}>Editar</Btn>
      </div>
    </div>
  );
}

function StatusModal({pub,onSave,onClose}){
  const[est,setEst]=useState(pub.estadoPublicacion);const[reg,setReg]=useState(pub.registrado||"No");
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:420,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:16}}><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>Cambiar Estado</h3><button onClick={onClose} style={{border:"none",background:"none",cursor:"pointer",color:"#94a3b8"}}><X size={18}/></button></div>
    <p style={{fontSize:12,color:"#64748b",marginBottom:14,lineHeight:1.4}}>{pub.titulo}</p>
    <div style={{marginBottom:12}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>NUEVO ESTADO</label><div style={{display:"flex",flexWrap:"wrap",gap:5}}>{ESTADOS.map(e=><button key={e} onClick={()=>setEst(e)} style={{padding:"5px 12px",borderRadius:20,border:est===e?`2px solid ${C1}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:est===e?700:400,background:est===e?C1Bg:"white",color:est===e?C1:"#475569",cursor:"pointer"}}>{e}</button>)}</div></div>
    <div style={{marginBottom:18}}><label style={{fontSize:10,fontWeight:600,color:"#475569",display:"block",marginBottom:4}}>REGISTRADO DIR. INVESTIGACIÓN</label><div style={{display:"flex",gap:6}}>{["Sí","No"].map(v=><button key={v} onClick={()=>setReg(v)} style={{padding:"5px 18px",borderRadius:20,border:reg===v?`2px solid ${C1}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:reg===v?700:400,background:reg===v?C1Bg:"white",color:reg===v?C1:"#475569",cursor:"pointer"}}>{v}</button>)}</div></div>
    <div style={{display:"flex",gap:8,justifyContent:"flex-end"}}><Btn onClick={onClose}>Cancelar</Btn><Btn primary onClick={()=>onSave(pub.id,est,reg)} icon={Check}>Actualizar</Btn></div>
  </div>);
}

function ConfirmDelete({title,message,onConfirm,onCancel}){
  return(<div style={{background:"white",borderRadius:16,padding:24,maxWidth:400,width:"100%",boxShadow:"0 20px 60px rgba(0,0,0,.15)"}}>
    <div style={{textAlign:"center",marginBottom:16}}><div style={{width:48,height:48,borderRadius:14,background:P.roseBg,display:"inline-flex",alignItems:"center",justifyContent:"center",marginBottom:10}}><Trash2 size={22} style={{color:P.rose}}/></div><h3 style={{fontSize:15,fontWeight:700,color:P.navy,margin:0}}>{title}</h3></div>
    <p style={{fontSize:13,color:"#64748b",textAlign:"center",marginBottom:20,lineHeight:1.5}}>{message}</p>
    <div style={{display:"flex",gap:8,justifyContent:"center"}}><Btn onClick={onCancel}>Cancelar</Btn><Btn danger onClick={onConfirm} icon={Trash2}>Eliminar</Btn></div>
  </div>);
}

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
  const[detailPub,setDetailPub]=useState(null);
  const[showDocForm,setShowDocForm]=useState(false);
  const[showReporteModal,setShowReporteModal]=useState(false);
  const[showProfile,setShowProfile]=useState(false);
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
  useEffect(()=>{let m=document.querySelector('meta[name="viewport"]');if(!m){m=document.createElement("meta");m.name="viewport";document.head.appendChild(m);}m.content="width=device-width,initial-scale=1,maximum-scale=1";},[]);

  const visiblePubs=useMemo(()=>{if(isAdmin)return data.publicaciones;const ids=data.pubAutores.filter(l=>l.autorId===user?.id).map(l=>l.pubId);return data.publicaciones.filter(p=>ids.includes(p.id))},[data,isAdmin,user]);
  const visibleAutores=useMemo(()=>isAdmin?data.autores:data.autores.filter(a=>a.id===user?.id),[data,isAdmin,user]);
  const years=useMemo(()=>{const ys=new Set();visiblePubs.forEach(p=>{const y=parseYear(p.fechaPublicacion);if(y)ys.add(y)});return Array.from(ys).sort((a,b)=>b-a)},[visiblePubs]);

  const handleSavePub=async(pub,autorIds)=>{const isEd=!!editPub;setData(prev=>{const np=[...prev.publicaciones];const nl=prev.pubAutores.filter(l=>l.pubId!==pub.id);if(!pub.id)pub.id="P"+Date.now().toString(36);const ex=np.findIndex(p=>p.id===pub.id);if(ex>=0)np[ex]=pub;else np.push(pub);autorIds.forEach((a,i)=>nl.push({pubId:pub.id,autorId:a,orden:i+1}));return{...prev,publicaciones:np,pubAutores:nl}});setShowForm(false);setEditPub(null);if(API_URL){const action=isEd?"updatePub":"addPub";const body=isEd?{action,id:pub.id,pub,autoresIds:autorIds}:{action,pub,autoresIds:autorIds,userId:user?.id};const r=await apiPost(body);if(r?.ok){showToast(isEd?"Actualizada ✓":"Registrada ✓");loadData()}else showToast("Error: "+(r?.error||""),"error")}else showToast(isEd?"Actualizada":"Registrada")};
  const handleStatus=async(id,estado,registrado)=>{setData(prev=>({...prev,publicaciones:prev.publicaciones.map(p=>p.id===id?{...p,estadoPublicacion:estado,registrado}:p)}));setStatusPub(null);if(API_URL){const r=await apiPost({action:"updateStatus",id,estado,registrado});if(r?.ok)showToast("Estado actualizado ✓");else showToast("Error sync","error")}else showToast("Estado actualizado")};
  const handleDeletePub=async(pubId)=>{setData(prev=>({...prev,publicaciones:prev.publicaciones.filter(p=>p.id!==pubId),pubAutores:prev.pubAutores.filter(l=>l.pubId!==pubId)}));setDeletePub(null);if(API_URL){const r=await apiPost({action:"deletePub",id:pubId});if(r?.ok){showToast("Eliminada ✓");loadData()}else showToast("Error","error")}else showToast("Eliminada")};
  const handleDeleteAutor=async(autorId)=>{const pubIds=data.pubAutores.filter(l=>l.autorId===autorId).map(l=>l.pubId);setData(prev=>({...prev,autores:prev.autores.filter(a=>a.id!==autorId),publicaciones:prev.publicaciones.filter(p=>!pubIds.includes(p.id)),pubAutores:prev.pubAutores.filter(l=>l.autorId!==autorId&&!pubIds.includes(l.pubId))}));setDeleteAutor(null);if(API_URL){const r=await apiPost({action:"deleteAutor",id:autorId});if(r?.ok){showToast("Docente eliminado ✓");loadData()}else showToast("Error","error")}else showToast("Docente eliminado")};
  const handleAddDocente=async(doc)=>{const id="A"+Date.now().toString(36);setData(prev=>({...prev,autores:[...prev.autores,{id,nombres:doc.nombres,apellidos:doc.apellidos,email:doc.email,rol:"autor",activo:true}]}));setShowDocForm(false);if(API_URL){const r=await apiPost({action:"addAutor",...doc});if(r?.ok){showToast("Docente registrado ✓");loadData()}else showToast("Error: "+(r?.error||""),"error")}else showToast("Docente agregado")};

  const handleSaveProfile=async(updated)=>{
    setData(prev=>({...prev,autores:prev.autores.map(a=>a.id===updated.id?updated:a)}));
    // Actualizar user también para que el sidebar y header reflejen los cambios al instante
    setUser(prev=>prev&&prev.id===updated.id?{...prev,...updated}:prev);
    if(API_URL){const r=await apiPost({action:"updatePerfil",autor:updated});if(r?.ok)showToast("Perfil actualizado ✓");else showToast("Error al guardar","error")}
    else showToast("Perfil actualizado ✓");
    setShowProfile(false);
  };
  // Actualiza la foto en data.autores Y en user inmediatamente tras subir a Drive
  const handlePhotoUploaded=(userId,url)=>{
    setData(prev=>({...prev,autores:prev.autores.map(a=>a.id===userId?{...a,fotoUrl:url}:a)}));
    setUser(prev=>prev&&prev.id===userId?{...prev,fotoUrl:url}:prev);
  };
  const getAut=useCallback(pid=>data.pubAutores.filter(l=>l.pubId===pid).map(l=>data.autores.find(a=>a.id===l.autorId)).filter(Boolean),[data]);

  const filteredPubs=useMemo(()=>{let l=visiblePubs;if(search)l=l.filter(p=>p.titulo?.toLowerCase().includes(search.toLowerCase())||p.revista?.toLowerCase().includes(search.toLowerCase()));if(fEstado)l=l.filter(p=>p.estadoPublicacion===fEstado);if(fTipo)l=l.filter(p=>p.tipoPublicacion===fTipo);if(fAnio)l=l.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));if(fAutor&&isAdmin){const ids=data.pubAutores.filter(x=>x.autorId===fAutor).map(x=>x.pubId);l=l.filter(p=>ids.includes(p.id))}return l},[visiblePubs,data,search,fEstado,fTipo,fAutor,fAnio,isAdmin]);

  /* ── dashPubs: publicaciones filtradas por año y/o autor — alimentan todos los KPIs y gráficos ── */
  const dashPubs=useMemo(()=>{let l=visiblePubs;if(fAnio)l=l.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio));if(fAutor&&isAdmin){const ids=data.pubAutores.filter(x=>x.autorId===fAutor).map(x=>x.pubId);l=l.filter(p=>ids.includes(p.id))}return l},[visiblePubs,data,fAnio,fAutor,isAdmin]);

  const stats=useMemo(()=>{
    const ps=dashPubs;
    const total=ps.length;
    const publicadas=ps.filter(p=>p.estadoPublicacion==="Publicado").length;
    const scopus=ps.filter(p=>[p.indexacion1,p.indexacion2,p.indexacion3].some(i=>i?.includes("Scopus"))).length;
    const reg=ps.filter(p=>p.registrado==="Sí").length;
    const aceptadas=ps.filter(p=>p.estadoPublicacion==="Aceptado").length;
    const porTipo={};ps.forEach(p=>{const t=p.tipoPublicacion||"Otro";porTipo[t]=(porTipo[t]||0)+1});
    const porIdx={};ps.forEach(p=>{[p.indexacion1,p.indexacion2,p.indexacion3].forEach(idx=>{if(idx&&idx.trim()&&idx!=="0"&&idx!=="N/A"){const c=idx.trim();if(c)porIdx[c]=(porIdx[c]||0)+1}})});
    const porAnio={};ps.forEach(p=>{const y=parseYear(p.fechaPublicacion);if(y)porAnio[y]=(porAnio[y]||0)+1});
    const autorRank=visibleAutores.map(a=>{const pids=data.pubAutores.filter(l=>l.autorId===a.id).map(l=>l.pubId);const ap=ps.filter(p=>pids.includes(p.id));return{...a,count:ap.length,scopus:ap.filter(p=>[p.indexacion1,p.indexacion2].some(i=>i?.includes("Scopus"))).length}}).sort((a,b)=>b.count-a.count);
    return{total,publicadas,scopus,reg,aceptadas,porTipo,porIdx,porAnio,autorRank};
  },[dashPubs,visibleAutores,data]);

  if(!user)return<AuthScreen onLogin={setUser}/>;

  const menu=[
    {title:"GESTIÓN",items:[{id:"pubs",label:"Mis Publicaciones",icon:Library},{id:"nueva",label:"Nueva Publicación",icon:Plus,action:true}]},
    {title:"ANÁLISIS",items:[{id:"dashboard",label:"Dashboard",icon:LayoutDashboard},{id:"autores",label:"Por Autor",icon:Users},{id:"indexacion",label:"Indexación",icon:Globe},{id:"registro",label:"Estado Registro",icon:ClipboardList}]},
    {title:"CUENTA",items:[{id:"perfil",label:"Mi Perfil",icon:User,fn:()=>setShowProfile(true)}]},
  ];
  if(isAdmin)menu.push({title:"ADMINISTRADOR",items:[{id:"docentes",label:"Gestionar Docentes",icon:UserPlus}]});
  menu.push({title:"EXPORTAR",items:[{id:"excel",label:"Descargar Excel",icon:FileSpreadsheet,fn:()=>exportExcel(visiblePubs,data.autores,data.pubAutores)},{id:"reporte",label:"Reporte Word",icon:FileDown,fn:()=>setShowReporteModal(true)}]});

  return(<div style={{display:"flex",minHeight:"100vh",background:"#f4f5f7",fontFamily:"'DM Sans',system-ui,sans-serif",flexDirection:"row",position:"relative"}}>
    <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap');@keyframes fadeIn{from{opacity:0}to{opacity:1}}@keyframes slideUp{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:translateY(0)}}@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}@keyframes toastIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}::-webkit-scrollbar{width:5px}::-webkit-scrollbar-thumb{background:#cbd5e1;border-radius:4px}*{box-sizing:border-box}@media(max-width:767px){.pub-grid{grid-template-columns:1fr!important}.kpi-grid{grid-template-columns:repeat(3,1fr)!important}.chart-grid{grid-template-columns:1fr!important}.filter-row{flex-wrap:wrap!important;gap:6px!important}.modal-inner{margin:0!important;border-radius:16px 16px 0 0!important;max-width:100%!important;width:100%!important}.modal-wrap{align-items:flex-end!important;padding:0!important}.form-grid{grid-template-columns:1fr!important}.form-grid [style*="span 2"]{grid-column:span 1!important}.header-actions .sync-btn{display:none}.steps-bar button{font-size:10px!important;padding:8px 3px!important}}`}</style>

    {/* OVERLAY MÓVIL — solo visible cuando el menú está abierto */}
    {mobileMenuOpen&&<div onClick={()=>setMobileMenuOpen(false)} style={{position:"fixed",inset:0,background:"rgba(0,0,0,.5)",zIndex:19}}/>}
    {/* SIDEBAR — en móvil es position:fixed fuera del flujo; en desktop es sticky */}
    <aside style={{
      background:`linear-gradient(180deg,${NAVY} 0%,${C1} 100%)`,
      display:"flex",flexDirection:"column",overflow:"hidden",
      // DESKTOP
      ...(window.innerWidth>=768 ? {
        width:sideOpen?240:56,
        flexShrink:0,
        position:"sticky",
        top:0,
        height:"100vh",
        transition:"width .25s",
        zIndex:10
      } : {
        // MÓVIL — fixed drawer, fuera del flujo
        position:"fixed",
        left:0,top:0,
        width:260,
        height:"100vh",
        transform:mobileMenuOpen?"translateX(0)":"translateX(-100%)",
        transition:"transform .3s",
        zIndex:20
      })
    }}>
      {(()=>{const showFull=sideOpen||window.innerWidth<768;return(<div style={{padding:showFull?"14px 14px 10px":"14px 8px 10px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:8,justifyContent:showFull?"flex-start":"center"}}>
        <div style={{width:34,height:34,borderRadius:10,background:"rgba(255,255,255,.15)",display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}><BookOpen size={16} style={{color:"white"}}/></div>
        {showFull&&<div><h1 style={{fontSize:14,fontWeight:800,color:"white",margin:0,fontFamily:"'Playfair Display',serif"}}>PubTracker</h1><p style={{fontSize:8,color:"rgba(255,255,255,.5)",margin:0,letterSpacing:1}}>FCSyP · UNO</p></div>}
      </div>);})()}
      <nav style={{flex:1,padding:"8px 6px",overflowY:"auto"}}>
        {menu.map(sec=><div key={sec.title} style={{marginBottom:12}}>
          {(sideOpen||window.innerWidth<768)&&<p style={{fontSize:9,fontWeight:800,color:sec.title==="ADMINISTRADOR"?"#fcd34d":"rgba(255,255,255,.4)",letterSpacing:1.5,padding:"0 8px",marginBottom:3}}>{sec.title}</p>}
          {sec.items.map(it=>{const showFull=sideOpen||window.innerWidth<768;return<button key={it.id} onClick={()=>{setMobileMenuOpen(false);it.fn?it.fn():it.id==="nueva"?(setEditPub(null),setShowForm(true)):setView(it.id)}} style={{width:"100%",display:"flex",alignItems:"center",gap:8,padding:showFull?"7px 10px":"7px 0",justifyContent:showFull?"flex-start":"center",borderRadius:9,border:"none",cursor:"pointer",marginBottom:1,transition:"all .15s",background:it.action?"rgba(255,255,255,.2)":view===it.id?"rgba(255,255,255,.18)":"transparent",color:it.action?"white":view===it.id?"white":"rgba(255,255,255,.65)",fontSize:12,fontWeight:view===it.id||it.action?700:400}}><it.icon size={15}/>{showFull&&<span>{it.label}</span>}</button>})}
        </div>)}
      </nav>
      <div style={{padding:"8px 6px",borderTop:"1px solid rgba(255,255,255,.1)"}}>
        {(sideOpen||window.innerWidth<768)&&<div style={{padding:"7px 10px",background:"rgba(255,255,255,.1)",borderRadius:9,marginBottom:6}}>
          {isAdmin&&<div style={{display:"flex",alignItems:"center",gap:4,marginBottom:2}}><Shield size={11} style={{color:"#fcd34d"}}/><span style={{fontSize:9,fontWeight:700,color:"#fcd34d",textTransform:"uppercase",letterSpacing:1}}>Administrador</span></div>}
          <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
            {(()=>{const a=data.autores.find(x=>x.id===user.id)||user;const rawUrl=user.fotoUrl||a.fotoUrl||"";const photoSrc=rawUrl?driveImgUrl(rawUrl):avatarUrl(user.nombres,user.apellidos);return<img src={photoSrc} alt="" style={{width:36,height:36,borderRadius:"50%",objectFit:"cover",border:"2px solid rgba(255,255,255,.4)",flexShrink:0}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(user.nombres,user.apellidos)}}/>})()}
            <div style={{flex:1,minWidth:0}}><p style={{fontSize:11,fontWeight:600,color:"white",margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{user.nombres} {user.apellidos}</p><p style={{fontSize:10,color:"rgba(255,255,255,.5)",margin:0}}>{connected?"Google Sheets ✓":"Modo Demo"}</p></div>
          </div>
          <button onClick={()=>setShowProfile(true)} style={{width:"100%",display:"flex",alignItems:"center",gap:5,padding:"4px 8px",borderRadius:7,border:"1px solid rgba(255,255,255,.2)",background:"rgba(255,255,255,.08)",cursor:"pointer",color:"rgba(255,255,255,.8)",fontSize:10,fontWeight:600}}><Settings size={11}/>Editar perfil</button>
        </div>}
        <button onClick={()=>{setUser(null);setMobileMenuOpen(false)}} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",justifyContent:(sideOpen||window.innerWidth<768)?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",color:"#fca5a5",fontSize:11}}><LogOut size={14}/>{(sideOpen||window.innerWidth<768)&&"Cerrar Sesión"}</button>
        {window.innerWidth>=768&&<button onClick={()=>setSideOpen(o=>!o)} style={{width:"100%",display:"flex",alignItems:"center",gap:6,padding:"7px 10px",justifyContent:sideOpen?"flex-start":"center",borderRadius:9,border:"none",background:"transparent",cursor:"pointer",color:"rgba(255,255,255,.4)",fontSize:11,marginTop:2}}>{sideOpen?<ChevronLeft size={14}/>:<ChevronRight size={14}/>}{sideOpen&&"Colapsar"}</button>}
      </div>
    </aside>

    {/* MAIN */}
    <main className="main-content" style={{flex:1,overflow:"auto",display:"flex",flexDirection:"column",minWidth:0}}>
      {/* Header */}
      <div style={{background:"white",borderBottom:"1px solid #f1f5f9",padding:"10px 16px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:5}}>
        <div style={{display:"flex",alignItems:"center",gap:10,minWidth:0}}>
          {/* Hamburguesa solo en móvil */}
          <button onClick={()=>setMobileMenuOpen(o=>!o)} style={{display:"none",padding:6,borderRadius:8,border:"none",background:C1Bg,cursor:"pointer",color:C1,flexShrink:0}} className="hamburger-btn"><Menu size={18}/></button>
          <style>{`@media(max-width:767px){.hamburger-btn{display:flex!important}.header-title{font-size:13px!important}.header-sub{display:none!important}}`}</style>
          <div style={{minWidth:0}}>
            <h2 className="header-title" style={{fontSize:15,fontWeight:700,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{view==="pubs"?(isAdmin?"Todas las Publicaciones":"Mis Publicaciones"):view==="dashboard"?"Dashboard":view==="autores"?"Por Autor":view==="indexacion"?"Indexación":view==="registro"?"Registro":view==="docentes"?"Docentes":"Panel"}</h2>
            <p className="header-sub" style={{fontSize:11,color:"#94a3b8",margin:0}}>{isAdmin?"Vista Administrador":`${user.nombres} · ${stats.total} publicaciones`}</p>
          </div>
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {loading&&<Loader2 size={16} style={{color:C1,animation:"spin 1s linear infinite"}}/>}
          {API_URL&&<button onClick={loadData} className="sync-btn" style={{padding:"5px 10px",borderRadius:8,border:`1px solid ${C1}30`,background:C1Bg,cursor:"pointer",fontSize:11,color:C1,display:"flex",alignItems:"center",gap:4}}><RefreshCw size={12}/>Sync</button>}
          <Btn primary small onClick={()=>{setEditPub(null);setShowForm(true)}} icon={Plus}>Nueva</Btn>
        </div>
      </div>

      {/* KPIs + filtros globales */}
      <div style={{padding:"14px 20px 8px",background:`linear-gradient(180deg,${C1Bg} 0%,#f4f5f7 100%)`}}>
        {/* Filtros rápidos — actualizan TODOS los KPIs y gráficos */}
        <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center",flexWrap:"wrap"}}>
          <span style={{fontSize:11,fontWeight:700,color:"#64748b"}}>Año:</span>
          {["",...years].map(y=><button key={y||"all"} onClick={()=>setFAnio(y)} style={{padding:"3px 10px",borderRadius:20,border:fAnio===y?`2px solid ${C1}`:"1.5px solid #e2e8f0",fontSize:11,fontWeight:fAnio===y?700:400,background:fAnio===y?C1Bg:"white",color:fAnio===y?C1:"#475569",cursor:"pointer"}}>{y||"Todos"}</button>)}
          {isAdmin&&<><span style={{fontSize:11,fontWeight:700,color:"#64748b",marginLeft:8}}>Autor:</span>
          <select value={fAutor} onChange={e=>setFAutor(e.target.value)} style={{padding:"3px 10px",borderRadius:20,border:`1.5px solid ${fAutor?C1:"#e2e8f0"}`,fontSize:11,background:"white",color:fAutor?C1:"#475569",outline:"none"}}>
            <option value="">Todos</option>{data.autores.map(a=><option key={a.id} value={a.id}>{a.apellidos}</option>)}
          </select></>}
          {(fAnio||fAutor)&&<button onClick={()=>{setFAnio("");setFAutor("")}} style={{padding:"3px 10px",borderRadius:20,border:"1.5px solid #e2e8f0",fontSize:11,background:"white",color:P.rose,cursor:"pointer",display:"flex",alignItems:"center",gap:3}}><X size={10}/>Limpiar</button>}
        </div>

        {/* KPI Cards */}
        <div className="kpi-grid" style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:10,marginBottom:12}}>
          {[
            {l:"Total",v:stats.total,c:C1,i:BookOpen},
            {l:"Publicadas",v:stats.publicadas,c:P.green,i:CheckCircle2},
            {l:"Aceptadas",v:stats.aceptadas,c:P.sky,i:Clock},
            {l:"Scopus",v:stats.scopus,c:P.gold,i:Star},
            {l:"Registradas",v:stats.reg,c:P.violet,i:ClipboardList},
            {l:isAdmin?"Activos":"Hrs Inv/sem",v:(()=>{if(isAdmin)return stats.autorRank.filter(a=>a.count>0).length;const me=data.autores.find(x=>x.id===user?.id)||user;const h=me?.horasInvestigacion;return h&&String(h).trim()&&String(h)!=="0"?String(h)+"h":"—"})(),c:P.green,i:Clock}
          ].map((s,i)=><div key={i} style={{background:"white",borderRadius:12,padding:"12px 14px",border:"1px solid #f1f5f9",boxShadow:"0 1px 3px rgba(0,0,0,.03)"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div><p style={{fontSize:10,color:"#94a3b8",margin:0}}>{s.l}</p><p style={{fontSize:22,fontWeight:800,color:s.c,margin:"2px 0 0"}}>{s.v}</p></div>
              <s.i size={16} style={{color:s.c,opacity:.4}}/>
            </div>
          </div>)}
        </div>

        {/* Mini Charts */}
        <div className="chart-grid" style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10}}>
          <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Por Tipo</p>
            <ResponsiveContainer width="100%" height={160}><PieChart margin={{top:16,right:16,bottom:16,left:16}}>
              <Pie data={Object.entries(stats.porTipo).map(([name,value])=>({name,value}))} cx="50%" cy="50%" innerRadius={28} outerRadius={50} paddingAngle={3} dataKey="value" label={({value})=>value} labelLine={false} style={{fontSize:9}}>
                {Object.keys(stats.porTipo).map((_,i)=><Cell key={i} fill={CC[i%CC.length]}/>)}
              </Pie><Tooltip wrapperStyle={{fontSize:11}}/>
            </PieChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Por Año</p>
            <ResponsiveContainer width="100%" height={160}><BarChart data={Object.entries(stats.porAnio).sort((a,b)=>a[0]-b[0]).map(([name,value])=>({name,value}))} margin={{left:0,right:5,top:5,bottom:5}}>
              <XAxis dataKey="name" tick={{fontSize:9}}/><YAxis tick={{fontSize:9}} hide/><Tooltip wrapperStyle={{fontSize:11}}/>
              <Bar dataKey="value" fill={C1} radius={[4,4,0,0]} barSize={20}/>
            </BarChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9"}}>
            <p style={{fontSize:10,fontWeight:700,color:"#94a3b8",margin:"0 0 4px",textTransform:"uppercase",letterSpacing:.8}}>Top Autores</p>
            <div style={{fontSize:11,marginTop:8}}>{stats.autorRank.filter(a=>a.count>0).slice(0,5).map((a,i)=><div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"4px 0",borderBottom:i<4?"1px solid #f8fafc":"none"}}>
              <span style={{color:P.navy,fontWeight:i<3?600:400,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap",maxWidth:130}}>{i+1}. {a.apellidos.split(" ")[0]}</span>
              <span style={{fontWeight:700,color:i===0?C1:i===1?P.gold:"#94a3b8"}}>{a.count}</span>
            </div>)}</div>
          </div>
        </div>
      </div>

      {/* VIEWS */}
      <div style={{padding:"16px 20px",animation:"fadeIn .3s"}}>

        {/* DASHBOARD COMPLETO */}
        {view==="dashboard"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Publicaciones por Año{fAnio?` — ${fAnio}`:""}</h3>
            <ResponsiveContainer width="100%" height={220}><AreaChart data={Object.entries(stats.porAnio).sort((a,b)=>a[0]-b[0]).map(([name,value])=>({name,value}))}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis dataKey="name" tick={{fontSize:10}}/><YAxis tick={{fontSize:10}}/><Tooltip/>
              <Area type="monotone" dataKey="value" stroke={C1} fill={C1Bg} strokeWidth={2}/>
            </AreaChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Distribución por Tipo</h3>
            <ResponsiveContainer width="100%" height={220}><BarChart data={Object.entries(stats.porTipo).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={120} tick={{fontSize:10}}/><Tooltip/>
              <Bar dataKey="value" fill={P.sky} radius={[0,5,5,0]} barSize={16}/>
            </BarChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Top Indexaciones</h3>
            <ResponsiveContainer width="100%" height={220}><BarChart data={Object.entries(stats.porIdx).sort((a,b)=>b[1]-a[1]).slice(0,8).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:5}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={115} tick={{fontSize:10}}/><Tooltip/>
              <Bar dataKey="value" fill={P.violet} radius={[0,5,5,0]} barSize={14}/>
            </BarChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Ranking Autores</h3>
            <div>{stats.autorRank.filter(a=>a.count>0).slice(0,8).map((a,i)=>{const photoSrc=a.fotoUrl?driveImgUrl(a.fotoUrl):avatarUrl(a.nombres,a.apellidos);return<div key={a.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"6px 0",borderBottom:"1px solid #f8fafc"}}>
              <div style={{display:"flex",alignItems:"center",gap:8}}>
                <span style={{width:18,height:18,borderRadius:"50%",background:i<3?C1Bg:"#f1f5f9",color:i<3?C1:"#94a3b8",fontSize:9,fontWeight:700,display:"inline-flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>{i+1}</span>
                <img src={photoSrc} alt="" style={{width:28,height:28,borderRadius:"50%",objectFit:"cover",border:`2px solid ${i<3?C1+"40":"#e2e8f0"}`,flexShrink:0}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(a.nombres,a.apellidos)}}/>
                <span style={{fontSize:12,fontWeight:i<3?700:500,color:P.navy}}>{a.apellidos}, {a.nombres.split(" ")[0]}</span>
              </div>
              <div style={{display:"flex",gap:6,alignItems:"center"}}>
                <Bdg c={C1}>{a.count}</Bdg>
                {a.scopus>0&&<Bdg c={P.gold} bg={P.goldBg}>{a.scopus} Sc</Bdg>}
              </div>
            </div>})}</div>
          </div>
        </div>}

        {/* PUBLICACIONES */}
        {view==="pubs"&&<div>
          <div style={{display:"flex",gap:8,marginBottom:12,flexWrap:"wrap",alignItems:"center"}}>
            <div style={{flex:2,minWidth:180}}><Inp value={search} onChange={setSearch} placeholder="Buscar título, revista…" icon={Search}/></div>
            <div style={{flex:1,minWidth:120}}><Sel value={fEstado} onChange={setFEstado} options={ESTADOS} placeholder="Estado"/></div>
            <div style={{flex:1,minWidth:120}}><Sel value={fTipo} onChange={setFTipo} options={TIPOS} placeholder="Tipo"/></div>
            <div style={{flex:1,minWidth:80}}><select value={fAnio} onChange={e=>setFAnio(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}><option value="">Año</option>{years.map(y=><option key={y} value={y}>{y}</option>)}</select></div>
            {isAdmin&&<div style={{flex:1,minWidth:140}}><select value={fAutor} onChange={e=>setFAutor(e.target.value)} style={{width:"100%",padding:"9px 12px",borderRadius:10,border:"1.5px solid #e2e8f0",fontSize:13,background:"white",outline:"none"}}><option value="">Autor</option>{data.autores.map(a=><option key={a.id} value={a.id}>{a.apellidos}</option>)}</select></div>}
            {(search||fEstado||fTipo||fAutor||fAnio)&&<button onClick={()=>{setSearch("");setFEstado("");setFTipo("");setFAutor("");setFAnio("")}} style={{padding:"9px 12px",borderRadius:10,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",fontSize:11,color:P.rose,display:"flex",alignItems:"center",gap:4}}><X size={12}/>Limpiar</button>}
          </div>
          <p style={{fontSize:11,color:"#94a3b8",marginBottom:8}}>{filteredPubs.length} publicaciones</p>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {filteredPubs.map(p=>{const aus=getAut(p.id);const hasLinks=p.doi||p.url;return(
              <div key={p.id} style={{background:"white",borderRadius:12,padding:"10px 14px",border:"1px solid #f1f5f9",display:"flex",gap:10,alignItems:"flex-start",boxShadow:"0 1px 3px rgba(0,0,0,.03)",transition:"box-shadow .15s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 3px 10px rgba(71,9,10,.1)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,.03)"}>
                <div style={{flex:1,minWidth:0}}>
                  {/* Título clickeable + íconos de enlace junto al título */}
                  <div style={{display:"flex",alignItems:"flex-start",gap:6,marginBottom:4}}>
                    <h4 onClick={()=>setDetailPub(p)} style={{fontSize:12,fontWeight:600,color:P.navy,margin:0,lineHeight:1.4,cursor:"pointer",flex:1}} title="Ver detalle">{p.titulo}</h4>
                    {p.doi&&<a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title={`DOI: ${p.doi}`} style={{display:"inline-flex",alignItems:"center",flexShrink:0,padding:"2px 5px",borderRadius:5,background:"#fff7ed",border:"1px solid #fed7aa",color:"#c2410c",textDecoration:"none"}}><ExternalLink size={10}/></a>}
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Ver publicación" style={{display:"inline-flex",alignItems:"center",flexShrink:0,padding:"2px 5px",borderRadius:5,background:"#eff6ff",border:"1px solid #bfdbfe",color:"#1d4ed8",textDecoration:"none"}}><ExternalLink size={10}/></a>}
                    {p.evidencia&&<a href={p.evidencia} target="_blank" rel="noreferrer" onClick={e=>e.stopPropagation()} title="Ver evidencia OneDrive" style={{display:"inline-flex",alignItems:"center",flexShrink:0,padding:"2px 6px",borderRadius:5,background:"#f5f3ff",border:"1px solid #ddd6fe",color:"#7c3aed",textDecoration:"none",fontSize:9,fontWeight:700,gap:3}}><ExternalLink size={9}/>OD</a>}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:4,flexWrap:"wrap",marginBottom:3}}>
                    <TipoBdg tipo={p.tipoPublicacion}/>
                    <span style={{fontSize:10,color:"#94a3b8"}}>{aus.map(a=>a.apellidos).join(", ")}{p.autoresExternos&&<span style={{color:P.violet}}> + ext.</span>}</span>
                    {p.revista&&<span style={{fontSize:10,color:"#94a3b8"}}>· {p.revista}</span>}
                    {p.fechaPublicacion&&<span style={{fontSize:10,color:"#94a3b8"}}>· {p.fechaPublicacion}</span>}
                  </div>
                  <div style={{display:"flex",gap:4,flexWrap:"wrap",alignItems:"center"}}>
                    <EBdg e={p.estadoPublicacion}/><QBdg q={p.cuartil}/>
                    {p.doi&&<a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" title={`DOI: ${p.doi}`} style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:6,background:"#fff7ed",border:"1px solid #fed7aa",fontSize:10,fontWeight:600,color:"#c2410c",textDecoration:"none"}}><ExternalLink size={9}/>DOI</a>}
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" title="Ver publicación" style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:6,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:10,fontWeight:600,color:"#1d4ed8",textDecoration:"none"}}><ExternalLink size={9}/>URL</a>}
                    {p.evidencia&&<a href={p.evidencia} target="_blank" rel="noreferrer" title="Ver carpeta OneDrive de evidencia" style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 7px",borderRadius:6,background:"#f5f3ff",border:"1px solid #ddd6fe",fontSize:10,fontWeight:600,color:"#7c3aed",textDecoration:"none"}}><ExternalLink size={9}/>OneDrive</a>}
                  </div>
                </div>
                <div style={{display:"flex",gap:4,flexShrink:0}}>
                  <button onClick={()=>setDetailPub(p)} title="Ver detalle" style={{padding:"4px 8px",borderRadius:8,border:"1px solid #e2e8f0",background:"#f8fafc",cursor:"pointer",color:"#475569",display:"inline-flex",alignItems:"center"}}><Eye size={12}/></button>
                  <button onClick={()=>{setEditPub(p);setShowForm(true)}} title="Editar" style={{padding:"4px 8px",borderRadius:8,border:`1px solid ${C1}30`,background:C1Bg,cursor:"pointer",color:C1,display:"inline-flex",alignItems:"center"}}><Edit3 size={12}/></button>
                  <button onClick={()=>setStatusPub(p)} title="Estado" style={{padding:"4px 8px",borderRadius:8,border:"1px solid #e2e8f0",background:"white",cursor:"pointer",color:"#64748b",display:"inline-flex",alignItems:"center"}}><CheckCircle2 size={12}/></button>
                  {(isAdmin||aus.some(a=>a.id===user?.id))&&<button onClick={()=>setDeletePub(p)} title="Eliminar" style={{padding:"4px 8px",borderRadius:8,border:"1px solid #ffe4e6",background:"#fff5f5",cursor:"pointer",color:P.rose,display:"inline-flex",alignItems:"center"}}><Trash2 size={12}/></button>}
                </div>
              </div>
            )})}
            {filteredPubs.length===0&&<div style={{textAlign:"center",padding:40,color:"#94a3b8"}}><BookOpen size={32} style={{opacity:.3,marginBottom:8}}/><p style={{margin:0}}>Sin publicaciones con los filtros actuales</p></div>}
          </div>
        </div>}

        {/* POR AUTOR */}
        {view==="autores"&&<div style={{display:"flex",flexDirection:"column",gap:10}}>
          {stats.autorRank.filter(a=>a.count>0).map(a=>{
            const pubs=data.publicaciones.filter(p=>data.pubAutores.some(l=>l.pubId===p.id&&l.autorId===a.id));
            const fp=fAnio?pubs.filter(p=>parseYear(p.fechaPublicacion)===parseInt(fAnio)):pubs;
            const photoSrc=a.fotoUrl?driveImgUrl(a.fotoUrl):avatarUrl(a.nombres,a.apellidos);
            return<div key={a.id} style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <img src={photoSrc} alt="" style={{width:40,height:40,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C1}30`,flexShrink:0}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(a.nombres,a.apellidos)}}/>
                  <div><h3 style={{fontSize:13,fontWeight:700,color:P.navy,margin:0}}>{a.nombres} {a.apellidos}</h3><p style={{fontSize:10,color:"#94a3b8",margin:0}}>{a.email}{a.tituloAcademico&&<span style={{marginLeft:6,fontWeight:600,color:C1}}>{a.tituloAcademico}</span>}</p></div>
                </div>
                <div style={{display:"flex",gap:6,alignItems:"center"}}>
                  <Bdg c={C1}>{fp.length} pubs{fAnio?` (${fAnio})`:""}</Bdg>
                  {a.scopus>0&&<Bdg c={P.gold} bg={P.goldBg}>{a.scopus} Scopus</Bdg>}
                  {a.horasInvestigacion&&<Bdg c={P.green} bg={P.greenBg}><Clock size={9} style={{marginRight:2}}/>{a.horasInvestigacion}h inv/sem</Bdg>}
                  <Btn small icon={FileDown} onClick={()=>exportWord(a,data.publicaciones,data.pubAutores,{anio:fAnio})}>Word</Btn>
                </div>
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:4}}>
                {fp.slice(0,3).map(p=><div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #f8fafc"}}>
                  <div style={{flex:1,minWidth:0}}><p style={{fontSize:11,fontWeight:500,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.titulo}</p>
                  <div style={{display:"flex",gap:4,marginTop:2,alignItems:"center"}}><TipoBdg tipo={p.tipoPublicacion}/>
                    {p.doi&&<a href={`https://doi.org/${p.doi}`} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:2,padding:"1px 5px",borderRadius:5,background:"#fff7ed",border:"1px solid #fed7aa",fontSize:9,fontWeight:600,color:"#c2410c",textDecoration:"none"}}><ExternalLink size={8}/>DOI</a>}
                    {p.url&&<a href={p.url} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:2,padding:"1px 5px",borderRadius:5,background:"#eff6ff",border:"1px solid #bfdbfe",fontSize:9,fontWeight:600,color:"#1d4ed8",textDecoration:"none"}}><ExternalLink size={8}/>URL</a>}
                    {p.evidencia&&<a href={p.evidencia} target="_blank" rel="noreferrer" style={{display:"inline-flex",alignItems:"center",gap:2,padding:"1px 5px",borderRadius:5,background:"#f5f3ff",border:"1px solid #ddd6fe",fontSize:9,fontWeight:600,color:"#7c3aed",textDecoration:"none"}}><ExternalLink size={8}/>OneDrive</a>}
                  </div></div>
                  <div style={{display:"flex",gap:4,marginLeft:8,flexShrink:0}}><EBdg e={p.estadoPublicacion}/><QBdg q={p.cuartil}/></div>
                </div>)}
                {fp.length>3&&<p style={{fontSize:10,color:"#94a3b8",margin:"4px 0 0",textAlign:"center"}}>+{fp.length-3} más</p>}
              </div>
            </div>;
          })}
        </div>}

        {/* INDEXACIÓN */}
        {view==="indexacion"&&<div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Bases de Indexación</h3>
            <ResponsiveContainer width="100%" height={260}><BarChart data={Object.entries(stats.porIdx).sort((a,b)=>b[1]-a[1]).map(([name,value])=>({name,value}))} layout="vertical" margin={{left:10}}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9"/>
              <XAxis type="number" tick={{fontSize:10}}/><YAxis type="category" dataKey="name" width={120} tick={{fontSize:10}}/><Tooltip/>
              <Bar dataKey="value" fill={C1} radius={[0,5,5,0]} barSize={16}/>
            </BarChart></ResponsiveContainer>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Cuartiles</h3>
            {(()=>{const qd={};dashPubs.forEach(p=>{if(p.cuartil?.startsWith("Q"))qd[p.cuartil]=(qd[p.cuartil]||0)+1});const d=Object.entries(qd).sort().map(([n,v])=>({name:n,value:v}));return d.length?
              <><ResponsiveContainer width="100%" height={220}><PieChart margin={{top:20,right:30,bottom:20,left:30}}>
                <Pie data={d} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4} dataKey="value" label={({name,value})=>`${name}: ${value}`} labelLine={true}>
                  {d.map((e,i)=><Cell key={i} fill={e.name==="Q1"?P.green:e.name==="Q2"?C1:e.name==="Q3"?P.gold:"#ea580c"}/>)}
                </Pie><Tooltip/>
              </PieChart></ResponsiveContainer>
              <div style={{display:"flex",justifyContent:"center",gap:16,marginTop:8}}>{["Q1","Q2","Q3","Q4"].map(q=><div key={q} style={{textAlign:"center"}}><div style={{fontSize:20,fontWeight:800,color:q==="Q1"?P.green:q==="Q2"?C1:q==="Q3"?P.gold:"#ea580c"}}>{qd[q]||0}</div><div style={{fontSize:10,color:"#94a3b8"}}>{q}</div></div>)}</div></>
              :<p style={{color:"#94a3b8",textAlign:"center",padding:30}}>Sin datos de cuartiles</p>})()}
          </div>
        </div>}

        {/* ESTADO REGISTRO */}
        {view==="registro"&&<div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:14}}>
            <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:P.green}}>{stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Registradas</div></div>
            <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:"#cbd5e1"}}>{stats.total-stats.reg}</div><div style={{fontSize:11,color:"#94a3b8"}}>Pendientes</div></div>
            <div style={{background:"white",borderRadius:12,padding:16,border:"1px solid #f1f5f9",textAlign:"center"}}><div style={{fontSize:32,fontWeight:800,color:C1}}>{stats.total>0?Math.round(stats.reg/stats.total*100):0}%</div><div style={{fontSize:11,color:"#94a3b8"}}>Cobertura</div></div>
          </div>
          <div style={{background:"white",borderRadius:12,padding:14,border:"1px solid #f1f5f9"}}>
            <h3 style={{fontSize:12,fontWeight:700,color:P.navy,margin:"0 0 10px"}}>Pendientes de Registro</h3>
            {dashPubs.filter(p=>p.registrado!=="Sí").map(p=>{const aus=getAut(p.id);return<div key={p.id} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #f8fafc"}}>
              <div style={{flex:1,minWidth:0}}><p style={{fontSize:12,fontWeight:600,color:P.navy,margin:0,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{p.titulo}</p><div style={{display:"flex",gap:4,marginTop:2}}><TipoBdg tipo={p.tipoPublicacion}/><span style={{fontSize:10,color:"#94a3b8"}}>{aus.map(a=>a.apellidos).join(", ")}</span></div></div>
              <div style={{display:"flex",gap:4,flexShrink:0}}><EBdg e={p.estadoPublicacion}/><button onClick={()=>setStatusPub(p)} style={{padding:"3px 8px",borderRadius:8,border:`1px solid ${C1}30`,background:C1Bg,cursor:"pointer",fontSize:10,color:C1,fontWeight:600}}>Cambiar</button></div>
            </div>})}
          </div>
        </div>}

        {/* GESTIONAR DOCENTES */}
        {view==="docentes"&&isAdmin&&<div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
            <p style={{fontSize:12,color:"#94a3b8",margin:0}}>{data.autores.length} docentes registrados</p>
            <Btn primary small onClick={()=>setShowDocForm(true)} icon={UserPlus}>Alta Docente</Btn>
          </div>
          <div style={{background:"white",borderRadius:12,border:"1px solid #f1f5f9",overflow:"hidden"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead><tr style={{borderBottom:"2px solid #f1f5f9",background:"#fafbfc"}}>
                {["FOTO","NOMBRES","APELLIDOS","EMAIL","PUBS","SCOPUS","ACCIONES"].map(h=><th key={h} style={{textAlign:h==="PUBS"||h==="SCOPUS"||h==="FOTO"?"center":"left",padding:"10px 12px",color:"#94a3b8",fontSize:10,fontWeight:700}}>{h}</th>)}
              </tr></thead>
              <tbody>{stats.autorRank.map(a=>{const photoSrc=a.fotoUrl?driveImgUrl(a.fotoUrl):avatarUrl(a.nombres,a.apellidos);return<tr key={a.id} style={{borderBottom:"1px solid #f8fafc"}}>
                <td style={{padding:"8px 12px",textAlign:"center"}}><img src={photoSrc} alt="" style={{width:32,height:32,borderRadius:"50%",objectFit:"cover",border:`2px solid ${C1}20`}} onError={e=>{e.target.onerror=null;e.target.src=avatarUrl(a.nombres,a.apellidos)}}/></td>
                <td style={{padding:"10px 12px",fontWeight:600,color:P.navy}}>{a.nombres}</td>
                <td style={{padding:"10px 12px",color:"#475569"}}>{a.apellidos}</td>
                <td style={{padding:"10px 12px",color:"#94a3b8"}}>{a.email||"—"}</td>
                <td style={{padding:"10px 12px",textAlign:"center",fontWeight:700,color:a.count>0?C1:"#94a3b8"}}>{a.count}</td>
                <td style={{padding:"10px 12px",textAlign:"center"}}>{a.scopus>0?<Bdg c={P.gold} bg={P.goldBg}>{a.scopus}</Bdg>:"—"}</td>
                <td style={{padding:"10px 12px"}}><div style={{display:"flex",gap:4}}>
                  <Btn small icon={FileDown} onClick={()=>exportWord(a,data.publicaciones,data.pubAutores)}>Word</Btn>
                  <button onClick={()=>setDeleteAutor(a)} style={{padding:"4px 8px",borderRadius:8,border:"1px solid #ffe4e6",background:"#fff5f5",cursor:"pointer",fontSize:11,color:P.rose,display:"inline-flex",alignItems:"center",gap:4,fontWeight:600}}><Trash2 size={11}/>Eliminar</button>
                </div></td>
              </tr>})}</tbody>
            </table>
          </div>
        </div>}

      </div>
    </main>

    {/* MODALES */}
    {detailPub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s",width:"100%",maxWidth:600}}><DetailModal pub={detailPub} autores={data.autores} links={data.pubAutores} onClose={()=>setDetailPub(null)} onEdit={p=>{setEditPub(p);setShowForm(true);}} onStatus={p=>setStatusPub(p)}/></div></div>}
    {showProfile&&<div className="modal-wrap" style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div className="modal-inner" style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s",width:"100%",maxWidth:580}}><ProfileModal user={user} autores={data.autores} onSave={handleSaveProfile} onClose={()=>setShowProfile(false)} isAdmin={isAdmin} allAutores={data.autores} onPhotoUploaded={handlePhotoUploaded}/></div></div>}
    {showForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{maxHeight:"92vh",overflowY:"auto",animation:"slideUp .3s"}}><PubForm pub={editPub} autores={data.autores} pubAutores={data.pubAutores} onSave={handleSavePub} onCancel={()=>{setShowForm(false);setEditPub(null)}} currentUser={user}/></div></div>}
    {statusPub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><StatusModal pub={statusPub} onSave={handleStatus} onClose={()=>setStatusPub(null)}/></div></div>}
    {showDocForm&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><DocenteForm onSave={handleAddDocente} onClose={()=>setShowDocForm(false)}/></div></div>}
    {showReporteModal&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ReporteModal autores={isAdmin?data.autores:visibleAutores} pubs={visiblePubs} links={data.pubAutores} onClose={()=>setShowReporteModal(false)} isAdmin={isAdmin}/></div></div>}
    {deletePub&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ConfirmDelete title="Eliminar Publicación" message={`¿Seguro que deseas eliminar "${deletePub.titulo}"? Esta acción no se puede deshacer.`} onConfirm={()=>handleDeletePub(deletePub.id)} onCancel={()=>setDeletePub(null)}/></div></div>}
    {deleteAutor&&<div style={{position:"fixed",inset:0,zIndex:50,display:"flex",alignItems:"center",justifyContent:"center",padding:16,background:"rgba(15,23,42,.55)",backdropFilter:"blur(6px)",animation:"fadeIn .2s"}}><div style={{animation:"slideUp .3s"}}><ConfirmDelete title="Eliminar Docente" message={`¿Seguro que deseas eliminar a ${deleteAutor.nombres} ${deleteAutor.apellidos} y TODAS sus publicaciones? Esta acción no se puede deshacer.`} onConfirm={()=>handleDeleteAutor(deleteAutor.id)} onCancel={()=>setDeleteAutor(null)}/></div></div>}
    {toast&&<div style={{position:"fixed",bottom:20,right:20,zIndex:100,display:"flex",alignItems:"center",gap:8,padding:"9px 16px",borderRadius:12,boxShadow:"0 8px 30px rgba(0,0,0,.15)",animation:"toastIn .3s",background:toast.t==="error"?P.rose:C1,color:"white",fontSize:12,fontWeight:600}}>{toast.t==="error"?<AlertCircle size={14}/>:<CheckCircle2 size={14}/>}{toast.m}</div>}
  </div>);
}
