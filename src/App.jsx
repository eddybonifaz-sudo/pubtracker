import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from "recharts";
import {
  BookOpen, Users, TrendingUp, FileText, Plus, Search, LogIn, LogOut,
  Shield, Eye, Edit3, Trash2, ChevronDown, ChevronUp, ChevronRight, ChevronLeft,
  LayoutDashboard, Library, UserPlus, X, Check, AlertCircle, Loader2,
  Filter, Download, Printer, Calendar, Globe, Award, BarChart3,
  PieChart as PieChartIcon, FileBarChart, ClipboardList, BookMarked,
  GraduationCap, Building2, Save, RotateCcw, CheckCircle2, XCircle,
  Layers, Tag, Hash, Link2, ExternalLink, Clock, Star, Zap, Menu
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   ⚙️ CONFIGURACIÓN — Pegue aquí su URL de Google Apps Script
   ═══════════════════════════════════════════════════════════
   INSTRUCCIONES:
   1. Siga la guía para crear el Apps Script en Google Sheets
   2. Copie la URL generada al implementar como aplicación web
   3. Péguela entre las comillas de API_URL abajo
   4. Si deja la URL vacía, la app funciona en modo DEMO
      con los datos precargados de la Facultad
   ═══════════════════════════════════════════════════════════ */
const API_URL = "";
// Ejemplo: const API_URL = "https://script.google.com/macros/s/AKfycbzlySbh2xDl5oSzUVDjCusDSHW2c_0-gTOuEABIVWzWWxrEtSPKU-7KEkoA5ZsuTndq/exec";

/* ── Funciones de conexión con Google Sheets ── */
async function apiGet(action) {
  if (!API_URL) return null;
  try {
    const res = await fetch(`${API_URL}?action=${action}`);
    return await res.json();
  } catch (err) {
    console.error(`Error GET ${action}:`, err);
    return null;
  }
}

async function apiPost(body) {
  if (!API_URL) return null;
  try {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    return await res.json();
  } catch (err) {
    console.error("Error POST:", err);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════════
   DATOS PRECARGADOS — Facultad Ciencias Sociales y Pedagógicas
   (Se usan como respaldo cuando API_URL está vacío)
   ═══════════════════════════════════════════════════════════ */
const SEED_DATA = (() => {
  const rawRecords = [
    { n:"EDISON FERNANDO", a:"BONIFAZ ARANDA", est:"Publicado", tit:"Los consultorios jurídicos gratuitos como espacios de formación académica: El caso Unach", tip:"Artículo Científico", f:"25/12/2025", q:"Q2", rev:"Revista Pedagógica Universitaria y Didáctica del Derecho", issn:"0719-5885", vol:"12", num:"2", pag:"81-102", doi:"https://doi.org/10.5354/0719-5885.2025.76721", url:"https://pedagogiaderecho.uchile.cl/", i1:"Scopus", i2:"Wos(ESCI)", i3:"Latindex Catálogo", reg:"Sí" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Integración del TikTok en el aula: Estrategia pedagógica para el fortalecimiento de la diversidad cultural", tip:"Artículo Regional", f:"18/10/2025", q:"N/A", rev:"Un Espacio Para La Ciencia (UEPLC)", issn:"2631-2689", vol:"8", num:"1", pag:"13-31", doi:"https://doi.org/10.64736/ueplc.2025.v8.n1.1", url:"", i1:"Latindex Catálogo", i2:"", i3:"", reg:"Sí" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"El Uso del Storytelling como Estrategia Educativa para el Manejo de Emociones en Escenarios Catastróficos", tip:"Artículo Regional", f:"30/9/2025", q:"N/A", rev:"Sciencevolution", issn:"2810-8728", vol:"4", num:"3", pag:"114–123", doi:"https://doi.org/10.61325/ser.v4i3.212", url:"", i1:"Latindex Directorio", i2:"", i3:"", reg:"Sí" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Educational Transformation through Competency-Based Learning: A Contribution to Didactic Innovation", tip:"Artículo Científico", f:"15/12/2025", q:"Q1", rev:"Scientific Culture", issn:"2407-9529", vol:"11", num:"4", pag:"570-582", doi:"10.5281/zenodo.11042546", url:"https://sci-cult.net/", i1:"Scopus", i2:"", i3:"", reg:"Sí" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Aceptado", tit:"Impact Of Self-Regulated Learning On Academic Performance Of Higher Education Students", tip:"Artículo Científico", f:"15/10/2025", q:"Q1", rev:"Cultura. Intl Journal of Philosophy of Culture and Axiology", issn:"2065-5002", vol:"22", num:"10s", pag:"267-275", doi:"", url:"", i1:"Scopus", i2:"ERIHPLUS", i3:"Index Coppernicus", reg:"Sí" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Pedagogías Innovadoras Para El Aprendizaje De Estudios Sociales en 10mo año de EGB", tip:"Artículo Regional", f:"28/8/2025", q:"N/A", rev:"Emergentes Revista Multidisciplinaria", issn:"2959-7692", vol:"5", num:"3", pag:"773–801", doi:"", url:"", i1:"Latindex Directorio", i2:"", i3:"", reg:"No" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Factores De Riesgo Psicosocial Y Burnout En Profesionales De La Educación", tip:"Artículo Regional", f:"28/8/2025", q:"N/A", rev:"Emergentes Revista Multidisciplinaria", issn:"2959-7692", vol:"5", num:"3", pag:"773-801", doi:"", url:"", i1:"Latindex Directorio", i2:"", i3:"", reg:"No" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Integración de aulas inmersivas basadas en realidad extendida (XR)", tip:"Artículo Regional", f:"30/1/2026", q:"N/A", rev:"Revista Reincisol", issn:"2953-6421", vol:"5", num:"9", pag:"1-24", doi:"", url:"", i1:"Latindex Catálogo", i2:"Index Coppernicus", i3:"", reg:"No" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Formación Docente en Educación Superior: Enfoques Pedagógicos para una Universidad Inclusiva y Digital", tip:"Libro", f:"6/2/2026", q:"N/A", rev:"Edulearn Academy SAS", issn:"978-9942-7494-3-7", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"STEAM en la Universidad Innovación Educativa para la Formación Profesional del Siglo XXI", tip:"Libro", f:"3/2/2026", q:"N/A", rev:"Editorial The Anova", issn:"978-9942-7472-6-6", vol:"", num:"", pag:"131", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"ALEJANDRO", a:"FLORES SUAREZ", est:"Publicado", tit:"Propuesta de Intervención Didáctica para Incentivar la Lectura en Estudiantes de EGB", tip:"Artículo Regional", f:"17/9/2025", q:"N/A", rev:"Tesla", issn:"2796-9320", vol:"5", num:"2", pag:"e531", doi:"", url:"", i1:"ERIHPLUS", i2:"", i3:"", reg:"Sí" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"Publicado", tit:"Estrategias docentes para mejorar el rendimiento académico en estudiantes de secundaria", tip:"Artículo Regional", f:"14/1/2026", q:"N/A", rev:"Revista UNIMAR", issn:"2216-0116", vol:"44", num:"1", pag:"", doi:"", url:"", i1:"ERIHPLUS", i2:"DOAJ", i3:"CLASE", reg:"No" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"Publicado", tit:"De Experiencias a Enseñanzas: Cómo las historias de vida promueven los valores y la ética docente", tip:"Artículo Regional", f:"15/8/2025", q:"N/A", rev:"Revista Grafía", issn:"2500-607X", vol:"21", num:"1", pag:"1-24", doi:"", url:"", i1:"Latindex Catálogo", i2:"DOAJ", i3:"", reg:"Sí" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"Publicado", tit:"Escribir para sanar: explorando vínculos entre la escritura y la salud mental", tip:"Artículo Regional", f:"11/4/2025", q:"N/A", rev:"Academia y Virtualidad", issn:"2011-0731", vol:"18", num:"1", pag:"79-87", doi:"", url:"", i1:"Latindex Catálogo", i2:"DOAJ", i3:"CLASE", reg:"Sí" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"En preparación", tit:"Enfoques integradores en la formación universitaria y práctica docente", tip:"Libro", f:"31/10/2025", q:"", rev:"Editorial Universidad de Otavalo", issn:"978-9942-772-57-2", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"En preparación", tit:"Las historias de vida: un proceso sensibilizador desde la óptica de quien investiga", tip:"Capítulo de Libro", f:"6/11/2025", q:"", rev:"Enfoques integradores", issn:"", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"Sí" },
    { n:"DARWIN PATRICIO", a:"GARCIA AYALA", est:"En preparación", tit:"La ética y los valores desde la praxis educativa en los docentes del cantón Otavalo", tip:"Capítulo de Libro", f:"6/11/2025", q:"", rev:"Editorial Dykinson", issn:"3351-3365", vol:"", num:"", pag:"276", doi:"", url:"", i1:"", i2:"", i3:"", reg:"Sí" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Más allá de los indicadores: Dimensiones emergentes en la evaluación de impacto de la educación superior", tip:"Artículo Regional", f:"3/10/2025", q:"N/A", rev:"Revista Social Fronteriza", issn:"2806-5913", vol:"5", num:"5", pag:"1-23", doi:"", url:"", i1:"Latindex Catálogo", i2:"CLASE", i3:"", reg:"Sí" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Aprendizaje disciplinar: perspectivas didácticas y metodológicas", tip:"Libro", f:"10/3/2026", q:"N/A", rev:"Editorial Cómpas", issn:"978-9942-53-149-0", vol:"", num:"", pag:"151", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Uso de la IA Generativa con Pensamiento Crítico en Estudiantes de la Universidad de Otavalo", tip:"Artículo Regional", f:"16/10/2025", q:"N/A", rev:"Veritas Revista Multidisciplinar", issn:"2965-6052", vol:"6", num:"3", pag:"629–648", doi:"", url:"", i1:"Latindex Catálogo", i2:"ERIHPLUS", i3:"", reg:"Sí" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Más Allá de la Enseñanza: Educación Emocional y Pensamiento Crítico en la Práctica Docente", tip:"Libro", f:"10/10/2025", q:"", rev:"Editorial Mundos Alternos", issn:"78-9942-7454-5-3", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"Sí" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Validación del ejercicio profesional como reconocimiento a la experiencia laboral", tip:"Capítulo de Libro", f:"6/11/2025", q:"N/A", rev:"Editorial Octaedro", issn:"9788410792333", vol:"", num:"", pag:"", doi:"10.36006/09763-1", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"LEDYS", a:"HERNANDEZ CHACÓN", est:"Publicado", tit:"Measurement of Professional Competencies in the Basic Education Program at UNO", tip:"Proceeding", f:"24/2/2025", q:"N/A", rev:"RS", issn:"978-1-914266-07-2", vol:"2", num:"2", pag:"1", doi:"", url:"", i1:"", i2:"", i3:"", reg:"Sí" },
    { n:"JULIANA ELIZABETH", a:"CAICEDO PANTOJA", est:"Publicado", tit:"Estrategias de enseñanza basadas en Realidad Aumentada retos y oportunidades en la universidad", tip:"Artículo Regional", f:"6/5/2025", q:"N/A", rev:"Technology Rain Journal", issn:"2953-464X", vol:"4", num:"1", pag:"1-21", doi:"", url:"", i1:"Latindex Catálogo", i2:"", i3:"", reg:"Sí" },
    { n:"JULIANA ELIZABETH", a:"CAICEDO PANTOJA", est:"Publicado", tit:"Uso de la IA Generativa con Pensamiento Crítico en Estudiantes de la Universidad de Otavalo", tip:"Artículo Regional", f:"16/10/2025", q:"N/A", rev:"Veritas Revista Multidisciplinar", issn:"2965-6052", vol:"6", num:"3", pag:"629–648", doi:"", url:"", i1:"Latindex Directorio", i2:"ERIHPLUS", i3:"", reg:"Sí" },
    { n:"JULIANA ELIZABETH", a:"CAICEDO PANTOJA", est:"Publicado", tit:"Validación del ejercicio profesional como reconocimiento a la experiencia laboral", tip:"Capítulo de Libro", f:"6/11/2025", q:"N/A", rev:"Editorial Octaedro", issn:"9788410792333", vol:"", num:"", pag:"", doi:"10.36006/09763-1", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"DALMA JOSELYN", a:"JATIVA AVILA", est:"Publicado", tit:"Más allá de los indicadores: Dimensiones emergentes en la evaluación de impacto de la educación superior", tip:"Artículo Regional", f:"3/10/2025", q:"N/A", rev:"Revista Social Fronteriza", issn:"2806-5913", vol:"5", num:"5", pag:"1-23", doi:"", url:"", i1:"Latindex Catálogo", i2:"CLASE", i3:"", reg:"Sí" },
    { n:"DALMA JOSELYN", a:"JATIVA AVILA", est:"Publicado", tit:"Neuroeducación emocional", tip:"Libro", f:"1/1/2026", q:"N/A", rev:"Mundos Alternos Digitales", issn:"978-9942-593-07-8", vol:"", num:"", pag:"176", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"DALMA JOSELYN", a:"JATIVA AVILA", est:"Publicado", tit:"Neurodidáctica: aplicación de las neurociencias en la enseñanza", tip:"Artículo Regional", f:"1/7/2025", q:"N/A", rev:"Rev. Investigación en Ciencias de la Educación", issn:"3073-1461", vol:"3", num:"6", pag:"80-86", doi:"", url:"", i1:"Latindex Catálogo", i2:"", i3:"", reg:"Sí" },
    { n:"DALMA JOSELYN", a:"JATIVA AVILA", est:"Publicado", tit:"Aplicación de la IA en la retroalimentación educativa: oportunidades y retos en el aula digital", tip:"Artículo Regional", f:"1/11/2025", q:"N/A", rev:"Rev. Investigación en Ciencias de la Educación", issn:"3073-1461", vol:"3", num:"6", pag:"178-189", doi:"", url:"", i1:"Latindex Catálogo", i2:"", i3:"", reg:"Sí" },
    { n:"KAREN ANDREA", a:"ARMAS SANCHEZ", est:"Publicado", tit:"Uso de la IA Generativa con Pensamiento Crítico en Estudiantes de la Universidad de Otavalo", tip:"Artículo Regional", f:"16/10/2025", q:"N/A", rev:"Veritas Revista Multidisciplinar", issn:"2965-6052", vol:"6", num:"3", pag:"629–648", doi:"", url:"", i1:"Latindex Directorio", i2:"ERIHPLUS", i3:"", reg:"Sí" },
    { n:"KAREN ANDREA", a:"ARMAS SANCHEZ", est:"Publicado", tit:"Estrategias de enseñanza basadas en Realidad Aumentada retos y oportunidades en la universidad", tip:"Artículo Regional", f:"6/5/2025", q:"N/A", rev:"Technology Rain Journal", issn:"2953-464X", vol:"4", num:"1", pag:"1-21", doi:"", url:"", i1:"Latindex Catálogo", i2:"", i3:"", reg:"Sí" },
    { n:"KAREN ANDREA", a:"ARMAS SANCHEZ", est:"Publicado", tit:"Validación del ejercicio profesional como reconocimiento a la experiencia laboral", tip:"Capítulo de Libro", f:"6/11/2025", q:"N/A", rev:"Editorial Octaedro", issn:"9788410792333", vol:"", num:"", pag:"", doi:"10.36006/09763-1", url:"", i1:"", i2:"", i3:"", reg:"No" },
    { n:"CHRISTIAN ANIBAL", a:"GONZAGA VILLAFUERTE", est:"En preparación", tit:"Gamificación en la intervención educativa: Una propuesta para intervenir en las DEA", tip:"Capítulo de Libro", f:"6/11/2025", q:"", rev:"Enfoques integradores", issn:"", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"Sí" },
    { n:"JESUS FRANCISCO", a:"GONZALEZ ALONSO", est:"Publicado", tit:"Gestión Educativa", tip:"Libro", f:"7/11/2025", q:"N/A", rev:"Editorial Grupo Compás", issn:"978-9942-53-101-8", vol:"", num:"", pag:"602", doi:"", url:"", i1:"Scopus", i2:"", i3:"", reg:"Sí" },
    { n:"SOLEDAD", a:"CAIZA", est:"En preparación", tit:"Neurodiversidad y estrategias para trabajar en el aula", tip:"Capítulo de Libro", f:"31/10/2025", q:"", rev:"Enfoques integradores", issn:"", vol:"", num:"", pag:"", doi:"", url:"", i1:"", i2:"", i3:"", reg:"No" },
  ];

  const autoresMap = {};
  let ac = 1;
  rawRecords.forEach(r => {
    const k = `${r.n}|${r.a}`;
    if (!autoresMap[k]) { autoresMap[k] = { id: `A${String(ac++).padStart(3,"0")}`, nombres: r.n, apellidos: r.a, email: "", rol: "autor", activo: true }; }
  });

  const pubs = [];
  const links = [];
  let pc = 1;
  rawRecords.forEach(r => {
    const pid = `P${String(pc++).padStart(3,"0")}`;
    pubs.push({ id: pid, titulo: r.tit, tipoPublicacion: r.tip, estadoPublicacion: r.est, fechaPublicacion: r.f, cuartil: r.q, revista: r.rev, issn: r.issn, volumen: r.vol, numero: r.num, paginas: r.pag, doi: r.doi, url: r.url, indexacion1: r.i1, indexacion2: r.i2, indexacion3: r.i3, registrado: r.reg, fechaCreacion: new Date().toISOString() });
    const ak = `${r.n}|${r.a}`;
    links.push({ pubId: pid, autorId: autoresMap[ak].id, orden: 1 });
  });

  return { publicaciones: pubs, autores: Object.values(autoresMap), pubAutores: links };
})();

/* ═══════════════════════════════════════════════
   CONSTANTES Y CATÁLOGOS
   ═══════════════════════════════════════════════ */
const PALETTE = { teal: "#115e59", tealLight: "#0d9488", tealMuted: "#ccfbf1", gold: "#a16207", goldLight: "#fef3c7", navy: "#0f172a", slate: "#64748b", rose: "#be123c", roseLight: "#ffe4e6", emerald: "#047857", emeraldLight: "#d1fae5", violet: "#6d28d9", violetLight: "#ede9fe", sky: "#0369a1", skyLight: "#e0f2fe" };
const CHART_COLORS = ["#115e59","#a16207","#6d28d9","#be123c","#0369a1","#047857","#d97706","#9333ea","#e11d48","#0891b2","#65a30d","#c026d3"];
const TIPOS_PUB = ["Artículo Científico","Artículo Regional","Libro","Capítulo de Libro","Proceeding","Tesis","Ponencia"];
const ESTADOS_PUB = ["Publicado","Aceptado","En revisión","Enviado","En preparación","Rechazado"];
const CUARTILES = ["Q1","Q2","Q3","Q4","N/A"];
const INDEXACIONES = ["Scopus","Wos(ESCI)","Web of Science","Latindex Catálogo","Latindex Directorio","DOAJ","ERIHPLUS","CLASE","REDIB","MIAR","Index Coppernicus","SciELO"];
const MESES = ["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic"];

function parseDate(str) { if (!str) return null; const p = str.split("/"); if (p.length === 3) return new Date(+p[2], +p[1]-1, +p[0]); return new Date(str); }
function uid() { return "id_" + Math.random().toString(36).substring(2, 10); }

/* ═══════════════════════════════════════════════
   MICRO-COMPONENTES
   ═══════════════════════════════════════════════ */
const Badge = ({ children, color = PALETTE.slate, bg }) => (
  <span style={{ background: bg || color + "18", color, fontSize: 11, fontWeight: 600, padding: "2px 10px", borderRadius: 20, whiteSpace: "nowrap", letterSpacing: 0.3 }}>{children}</span>
);
const EstadoBadge = ({ e }) => {
  const m = { "Publicado": [PALETTE.emerald, PALETTE.emeraldLight], "Aceptado": [PALETTE.sky, PALETTE.skyLight], "En revisión": [PALETTE.gold, PALETTE.goldLight], "Enviado": [PALETTE.violet, PALETTE.violetLight], "En preparación": [PALETTE.slate, "#f1f5f9"], "Rechazado": [PALETTE.rose, PALETTE.roseLight] };
  const [c, bg] = m[e] || [PALETTE.slate, "#f1f5f9"];
  return <Badge color={c} bg={bg}>{e || "Sin estado"}</Badge>;
};
const QuartilBadge = ({ q }) => {
  if (!q || q === "N/A" || !q.startsWith("Q")) return <Badge color="#94a3b8" bg="#f8fafc">N/A</Badge>;
  const m = { Q1: ["#fff", PALETTE.emerald], Q2: ["#fff", PALETTE.teal], Q3: ["#fff", PALETTE.gold], Q4: ["#fff", "#ea580c"] };
  const [c, bg] = m[q] || ["#fff", PALETTE.slate];
  return <Badge color={c} bg={bg}>{q}</Badge>;
};

function Tooltip2({ children, text }) {
  return <span style={{ position: "relative", cursor: "help" }} title={text}>{children}</span>;
}

function IconBtn({ icon: Icon, label, onClick, active, danger, small, disabled }) {
  return (
    <button onClick={onClick} disabled={disabled} title={label} style={{
      display: "inline-flex", alignItems: "center", gap: 6, padding: small ? "5px 10px" : "8px 16px",
      borderRadius: 10, border: "1px solid", fontSize: small ? 11 : 13, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", transition: "all 0.2s",
      borderColor: active ? PALETTE.teal : danger ? "#fecaca" : "#e2e8f0",
      background: active ? PALETTE.tealMuted : danger ? "#fff1f2" : "white",
      color: active ? PALETTE.teal : danger ? PALETTE.rose : "#475569",
      opacity: disabled ? 0.5 : 1
    }}>
      <Icon size={small ? 13 : 15} /> {label && <span>{label}</span>}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   FORMULARIO INTELIGENTE DE PUBLICACIÓN
   ═══════════════════════════════════════════════ */
function FormField({ label, required, children, hint, span = 1 }) {
  return (
    <div style={{ gridColumn: `span ${span}` }}>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: "#475569", marginBottom: 4, textTransform: "uppercase", letterSpacing: 0.8 }}>
        {label} {required && <span style={{ color: PALETTE.rose }}>*</span>}
      </label>
      {children}
      {hint && <p style={{ fontSize: 10, color: "#94a3b8", marginTop: 2 }}>{hint}</p>}
    </div>
  );
}

function TextInput({ value, onChange, placeholder, type = "text", disabled }) {
  return <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} disabled={disabled}
    style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, color: "#1e293b", background: disabled ? "#f8fafc" : "white", outline: "none", transition: "border 0.2s", boxSizing: "border-box" }}
    onFocus={e => e.target.style.borderColor = PALETTE.teal} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />;
}

function SelectInput({ value, onChange, options, placeholder }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{ width: "100%", padding: "9px 12px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 13, color: value ? "#1e293b" : "#94a3b8", background: "white", outline: "none", cursor: "pointer", boxSizing: "border-box" }}
      onFocus={e => e.target.style.borderColor = PALETTE.teal} onBlur={e => e.target.style.borderColor = "#e2e8f0"}>
      <option value="">{placeholder || "Seleccionar…"}</option>
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function AuthorPicker({ autores, selected, onChange }) {
  const [search, setSearch] = useState("");
  const filtered = autores.filter(a => !search || `${a.nombres} ${a.apellidos}`.toLowerCase().includes(search.toLowerCase()));
  const toggle = id => onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id]);
  return (
    <div>
      <div style={{ position: "relative", marginBottom: 8 }}>
        <Search size={14} style={{ position: "absolute", left: 10, top: 10, color: "#94a3b8" }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar autor…"
          style={{ width: "100%", padding: "8px 8px 8px 32px", borderRadius: 8, border: "1.5px solid #e2e8f0", fontSize: 12, outline: "none", boxSizing: "border-box" }} />
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, maxHeight: 120, overflowY: "auto", padding: 4 }}>
        {filtered.map(a => {
          const sel = selected.includes(a.id);
          return (
            <button key={a.id} onClick={() => toggle(a.id)} style={{
              display: "inline-flex", alignItems: "center", gap: 4, padding: "4px 12px", borderRadius: 20,
              border: sel ? `2px solid ${PALETTE.teal}` : "1.5px solid #e2e8f0", fontSize: 11, fontWeight: sel ? 600 : 400,
              background: sel ? PALETTE.tealMuted : "white", color: sel ? PALETTE.teal : "#475569", cursor: "pointer", transition: "all 0.15s"
            }}>
              {sel && <Check size={11} />} {a.nombres} {a.apellidos}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function PublicacionForm({ pub, autores, pubAutores, onSave, onCancel }) {
  const isEdit = !!pub;
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const [form, setForm] = useState(() => pub ? { ...pub } : {
    titulo: "", tipoPublicacion: "", estadoPublicacion: "En preparación", fechaPublicacion: "",
    cuartil: "N/A", revista: "", issn: "", volumen: "", numero: "", paginas: "",
    doi: "", url: "", indexacion1: "", indexacion2: "", indexacion3: "", registrado: "No"
  });
  const [selAutores, setSelAutores] = useState(() => pub ? pubAutores.filter(l => l.pubId === pub.id).map(l => l.autorId) : []);
  const [errors, setErrors] = useState({});

  const set = (k, v) => { setForm(p => ({ ...p, [k]: v })); setErrors(p => ({ ...p, [k]: undefined })); };

  const validate = () => {
    const e = {};
    if (!form.titulo.trim()) e.titulo = "Título obligatorio";
    if (!form.tipoPublicacion) e.tipoPublicacion = "Seleccione tipo";
    if (selAutores.length === 0) e.autores = "Seleccione al menos un autor";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) { setStep(1); return; }
    onSave({ ...form, id: pub?.id || uid(), fechaCreacion: pub?.fechaCreacion || new Date().toISOString() }, selAutores);
  };

  const stepTitles = ["Información Principal", "Datos Bibliométricos", "Indexación y Estado"];
  const stepIcons = [FileText, BookMarked, Award];

  return (
    <div style={{ background: "white", borderRadius: 16, overflow: "hidden", boxShadow: "0 20px 60px rgba(0,0,0,0.12)" }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(135deg, ${PALETTE.navy} 0%, ${PALETTE.teal} 100%)`, padding: "24px 28px", color: "white" }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, fontFamily: "'Playfair Display', serif" }}>{isEdit ? "Editar Publicación" : "Registrar Nueva Publicación"}</h2>
        <p style={{ fontSize: 12, opacity: 0.7, marginTop: 4 }}>Facultad de Ciencias Sociales y Pedagógicas — Universidad de Otavalo</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: "flex", borderBottom: "1px solid #f1f5f9", background: "#fafbfc" }}>
        {stepTitles.map((t, i) => {
          const StepIcon = stepIcons[i];
          const active = step === i + 1;
          const done = step > i + 1;
          return (
            <button key={i} onClick={() => setStep(i + 1)} style={{
              flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              padding: "14px 8px", border: "none", cursor: "pointer", fontSize: 12, fontWeight: active ? 700 : 500,
              color: active ? PALETTE.teal : done ? PALETTE.emerald : "#94a3b8",
              background: active ? "white" : "transparent",
              borderBottom: active ? `3px solid ${PALETTE.teal}` : "3px solid transparent",
              transition: "all 0.2s"
            }}>
              {done ? <CheckCircle2 size={15} /> : <StepIcon size={15} />}
              <span style={{ display: "none" }}>{t}</span>
              <span>{t}</span>
            </button>
          );
        })}
      </div>

      {/* Form body */}
      <div style={{ padding: 28, minHeight: 320 }}>
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Título de la Publicación" required span={2} hint={errors.titulo}>
              <TextInput value={form.titulo} onChange={v => set("titulo", v)} placeholder="Ingrese el título completo de la publicación" />
            </FormField>
            <FormField label="Tipo de Publicación" required hint={errors.tipoPublicacion}>
              <SelectInput value={form.tipoPublicacion} onChange={v => set("tipoPublicacion", v)} options={TIPOS_PUB} placeholder="Seleccione tipo…" />
            </FormField>
            <FormField label="Fecha de Publicación" hint="Formato: DD/MM/AAAA">
              <TextInput value={form.fechaPublicacion} onChange={v => set("fechaPublicacion", v)} placeholder="DD/MM/AAAA" />
            </FormField>
            <FormField label="Autores" required span={2} hint={errors.autores}>
              <AuthorPicker autores={autores} selected={selAutores} onChange={setSelAutores} />
            </FormField>
          </div>
        )}

        {step === 2 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <FormField label="Revista / Editorial" span={2}>
              <TextInput value={form.revista} onChange={v => set("revista", v)} placeholder="Nombre de la revista o editorial" />
            </FormField>
            <FormField label="ISSN / ISBN">
              <TextInput value={form.issn} onChange={v => set("issn", v)} placeholder="0000-0000" />
            </FormField>
            <FormField label="Cuartil">
              <SelectInput value={form.cuartil} onChange={v => set("cuartil", v)} options={CUARTILES} />
            </FormField>
            <FormField label="Volumen">
              <TextInput value={form.volumen} onChange={v => set("volumen", v)} placeholder="Ej: 12" />
            </FormField>
            <FormField label="Número">
              <TextInput value={form.numero} onChange={v => set("numero", v)} placeholder="Ej: 3" />
            </FormField>
            <FormField label="Páginas">
              <TextInput value={form.paginas} onChange={v => set("paginas", v)} placeholder="Ej: 81-102" />
            </FormField>
            <FormField label="DOI">
              <TextInput value={form.doi} onChange={v => set("doi", v)} placeholder="https://doi.org/..." />
            </FormField>
            <FormField label="URL" span={2}>
              <TextInput value={form.url} onChange={v => set("url", v)} placeholder="https://..." />
            </FormField>
          </div>
        )}

        {step === 3 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 16 }}>
            <FormField label="Estado de Publicación" span={1}>
              <SelectInput value={form.estadoPublicacion} onChange={v => set("estadoPublicacion", v)} options={ESTADOS_PUB} />
            </FormField>
            <FormField label="Registrado en Dir. Investigación">
              <SelectInput value={form.registrado} onChange={v => set("registrado", v)} options={["Sí", "No"]} />
            </FormField>
            <div></div>
            <FormField label="Indexación Principal">
              <SelectInput value={form.indexacion1} onChange={v => set("indexacion1", v)} options={INDEXACIONES} placeholder="Ninguna" />
            </FormField>
            <FormField label="Indexación Secundaria">
              <SelectInput value={form.indexacion2} onChange={v => set("indexacion2", v)} options={INDEXACIONES} placeholder="Ninguna" />
            </FormField>
            <FormField label="Otra Indexación">
              <SelectInput value={form.indexacion3} onChange={v => set("indexacion3", v)} options={INDEXACIONES} placeholder="Ninguna" />
            </FormField>

            {/* Preview */}
            <div style={{ gridColumn: "span 3", marginTop: 12, padding: 20, background: "#f8fafc", borderRadius: 12, border: "1px dashed #cbd5e1" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 12 }}>Vista Previa del Registro</p>
              <h4 style={{ fontSize: 15, fontWeight: 700, color: PALETTE.navy, marginBottom: 6 }}>{form.titulo || "Sin título"}</h4>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                {selAutores.map(aid => { const a = autores.find(x => x.id === aid); return a ? <span key={aid} style={{ fontSize: 12, color: "#475569" }}>{a.nombres} {a.apellidos}</span> : null; }).reduce((acc, el, i) => i === 0 ? [el] : [...acc, <span key={`sep${i}`} style={{ color: "#cbd5e1" }}>·</span>, el], [])}
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <EstadoBadge e={form.estadoPublicacion} />
                <QuartilBadge q={form.cuartil} />
                {form.tipoPublicacion && <Badge color="#475569">{form.tipoPublicacion}</Badge>}
                {form.revista && <Badge color={PALETTE.gold} bg={PALETTE.goldLight}>{form.revista}</Badge>}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Footer / Nav */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 28px", borderTop: "1px solid #f1f5f9", background: "#fafbfc" }}>
        <button onClick={onCancel} style={{ padding: "9px 20px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", fontSize: 13, cursor: "pointer", color: "#64748b" }}>
          Cancelar
        </button>
        <div style={{ display: "flex", gap: 10 }}>
          {step > 1 && (
            <button onClick={() => setStep(step - 1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 18px", borderRadius: 10, border: "1.5px solid #e2e8f0", background: "white", fontSize: 13, cursor: "pointer", color: "#475569" }}>
              <ChevronLeft size={15} /> Anterior
            </button>
          )}
          {step < totalSteps ? (
            <button onClick={() => setStep(step + 1)} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 22px", borderRadius: 10, border: "none", background: PALETTE.teal, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Siguiente <ChevronRight size={15} />
            </button>
          ) : (
            <button onClick={handleSubmit} style={{ display: "flex", alignItems: "center", gap: 6, padding: "9px 24px", borderRadius: 10, border: "none", background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.emerald})`, color: "white", fontSize: 13, fontWeight: 600, cursor: "pointer", boxShadow: "0 4px 12px rgba(17,94,89,0.3)" }}>
              <Save size={15} /> {isEdit ? "Guardar Cambios" : "Registrar Publicación"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   COMPONENTES DE INFORMES
   ═══════════════════════════════════════════════ */
function ReportCard({ title, children, icon: Icon, accent = PALETTE.teal }) {
  return (
    <div style={{ background: "white", borderRadius: 14, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", border: "1px solid #f1f5f9" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "14px 20px", borderBottom: "1px solid #f8fafc" }}>
        <div style={{ width: 32, height: 32, borderRadius: 8, background: accent + "14", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Icon size={16} style={{ color: accent }} />
        </div>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: PALETTE.navy, margin: 0 }}>{title}</h3>
      </div>
      <div style={{ padding: 20 }}>{children}</div>
    </div>
  );
}

/* Informe: Resumen General */
function InformeResumen({ pubs, autores, links }) {
  const total = pubs.length;
  const publicadas = pubs.filter(p => p.estadoPublicacion === "Publicado").length;
  const aceptadas = pubs.filter(p => p.estadoPublicacion === "Aceptado").length;
  const enProc = total - publicadas - aceptadas;
  const registradas = pubs.filter(p => p.registrado === "Sí").length;
  const scopus = pubs.filter(p => [p.indexacion1, p.indexacion2, p.indexacion3].some(i => i?.includes("Scopus"))).length;

  const cards = [
    { icon: BookOpen, label: "Total Publicaciones", value: total, color: PALETTE.teal },
    { icon: CheckCircle2, label: "Publicadas", value: publicadas, color: PALETTE.emerald },
    { icon: Clock, label: "Aceptadas", value: aceptadas, color: PALETTE.sky },
    { icon: Layers, label: "En Proceso", value: enProc, color: PALETTE.gold },
    { icon: Users, label: "Autores Activos", value: autores.length, color: PALETTE.violet },
    { icon: Star, label: "En Scopus", value: scopus, color: PALETTE.rose },
    { icon: Check, label: "Registradas DI", value: registradas, color: PALETTE.emerald },
    { icon: XCircle, label: "No Registradas", value: total - registradas, color: "#94a3b8" },
  ];

  const porTipo = {};
  pubs.forEach(p => { const t = p.tipoPublicacion || "Otro"; porTipo[t] = (porTipo[t] || 0) + 1; });
  const tipoData = Object.entries(porTipo).map(([name, value]) => ({ name, value }));

  const porEstado = {};
  pubs.forEach(p => { const e = p.estadoPublicacion || "Sin estado"; porEstado[e] = (porEstado[e] || 0) + 1; });
  const estadoData = Object.entries(porEstado).map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12 }}>
        {cards.map((c, i) => (
          <div key={i} style={{ background: "white", borderRadius: 12, padding: 16, border: "1px solid #f1f5f9", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0, fontWeight: 500 }}>{c.label}</p>
                <p style={{ fontSize: 28, fontWeight: 800, color: c.color, margin: "4px 0 0", fontFamily: "'DM Sans', sans-serif" }}>{c.value}</p>
              </div>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: c.color + "10", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <c.icon size={18} style={{ color: c.color }} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        <ReportCard title="Distribución por Tipo" icon={PieChartIcon} accent={PALETTE.teal}>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart><Pie data={tipoData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${value}`}>
              {tipoData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie><Tooltip /><Legend verticalAlign="bottom" wrapperStyle={{ fontSize: 11 }} /></PieChart>
          </ResponsiveContainer>
        </ReportCard>
        <ReportCard title="Distribución por Estado" icon={BarChart3} accent={PALETTE.emerald}>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={estadoData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={36}>{estadoData.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}</Bar>
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </div>
  );
}

/* Informe: Por Autor */
function InformeAutores({ pubs, autores, links }) {
  const [selAutor, setSelAutor] = useState("");
  const ranking = useMemo(() => {
    return autores.map(a => {
      const pids = links.filter(l => l.autorId === a.id).map(l => l.pubId);
      const ap = pubs.filter(p => pids.includes(p.id));
      return { ...a, total: ap.length, publicadas: ap.filter(p => p.estadoPublicacion === "Publicado").length, scopus: ap.filter(p => [p.indexacion1, p.indexacion2].some(i => i?.includes("Scopus"))).length, pubs: ap };
    }).sort((a, b) => b.total - a.total);
  }, [pubs, autores, links]);

  const barData = ranking.map(a => ({ name: `${a.apellidos.split(" ")[0]}`, total: a.total, scopus: a.scopus }));
  const selected = selAutor ? ranking.find(a => a.id === selAutor) : null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <SelectInput value={selAutor} onChange={setSelAutor} options={autores.map(a => a.id)} placeholder="Seleccione un autor para ver detalle…" />
        {selAutor && <span style={{ fontSize: 13, fontWeight: 600, color: PALETTE.teal }}>{ranking.find(a => a.id === selAutor)?.nombres} {ranking.find(a => a.id === selAutor)?.apellidos}</span>}
      </div>

      <ReportCard title="Producción Comparativa por Autor" icon={Users} accent={PALETTE.violet}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={barData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={100} tick={{ fontSize: 11 }} />
            <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="total" name="Total" fill={PALETTE.teal} radius={[0, 4, 4, 0]} barSize={16} /><Bar dataKey="scopus" name="Scopus" fill={PALETTE.gold} radius={[0, 4, 4, 0]} barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>

      {selected && (
        <ReportCard title={`Publicaciones de ${selected.nombres} ${selected.apellidos}`} icon={BookOpen} accent={PALETTE.teal}>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {selected.pubs.map(p => (
              <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", background: "#f8fafc", borderRadius: 8 }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: 13, fontWeight: 600, color: PALETTE.navy, margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.titulo}</p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{p.revista} · {p.fechaPublicacion}</p>
                </div>
                <div style={{ display: "flex", gap: 6, marginLeft: 12 }}>
                  <EstadoBadge e={p.estadoPublicacion} /><QuartilBadge q={p.cuartil} />
                </div>
              </div>
            ))}
          </div>
        </ReportCard>
      )}

      <ReportCard title="Ranking de Autores" icon={Award} accent={PALETTE.gold}>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
          <thead><tr style={{ borderBottom: "2px solid #f1f5f9" }}>
            <th style={{ textAlign: "left", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>#</th>
            <th style={{ textAlign: "left", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>AUTOR</th>
            <th style={{ textAlign: "center", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>TOTAL</th>
            <th style={{ textAlign: "center", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>PUBLICADAS</th>
            <th style={{ textAlign: "center", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>SCOPUS</th>
          </tr></thead>
          <tbody>{ranking.map((a, i) => (
            <tr key={a.id} style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", background: selAutor === a.id ? PALETTE.tealMuted : "transparent" }} onClick={() => setSelAutor(a.id)}>
              <td style={{ padding: 8 }}><span style={{ display: "inline-flex", width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: i < 3 ? PALETTE.goldLight : "#f1f5f9", color: i < 3 ? PALETTE.gold : "#94a3b8" }}>{i + 1}</span></td>
              <td style={{ padding: 8, fontWeight: 600, color: PALETTE.navy }}>{a.nombres} {a.apellidos}</td>
              <td style={{ padding: 8, textAlign: "center", fontWeight: 700 }}>{a.total}</td>
              <td style={{ padding: 8, textAlign: "center" }}><Badge color={PALETTE.emerald} bg={PALETTE.emeraldLight}>{a.publicadas}</Badge></td>
              <td style={{ padding: 8, textAlign: "center" }}>{a.scopus > 0 ? <Badge color={PALETTE.gold} bg={PALETTE.goldLight}>{a.scopus}</Badge> : <span style={{ color: "#cbd5e1" }}>—</span>}</td>
            </tr>
          ))}</tbody>
        </table>
      </ReportCard>
    </div>
  );
}

/* Informe: Indexación */
function InformeIndexacion({ pubs }) {
  const idxCount = {};
  pubs.forEach(p => {
    [p.indexacion1, p.indexacion2, p.indexacion3].forEach(idx => {
      if (idx && idx.trim() && idx !== "0" && idx !== "N/A") {
        idx.split(",").forEach(s => { const c = s.trim(); if (c) idxCount[c] = (idxCount[c] || 0) + 1; });
      }
    });
  });
  const idxData = Object.entries(idxCount).sort((a, b) => b[1] - a[1]).map(([name, value]) => ({ name, value }));

  const qCount = {};
  pubs.forEach(p => { if (p.cuartil && p.cuartil.startsWith("Q")) qCount[p.cuartil] = (qCount[p.cuartil] || 0) + 1; });
  const qData = Object.entries(qCount).sort().map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <ReportCard title="Publicaciones por Base de Indexación" icon={Globe} accent={PALETTE.sky}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={idxData} layout="vertical" margin={{ left: 10, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 11 }} />
            <Tooltip /><Bar dataKey="value" fill={PALETTE.sky} radius={[0, 6, 6, 0]} barSize={20} />
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>

      <ReportCard title="Distribución por Cuartil" icon={Award} accent={PALETTE.emerald}>
        {qData.length > 0 ? (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart><Pie data={qData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
              {qData.map((e, i) => <Cell key={i} fill={e.name === "Q1" ? PALETTE.emerald : e.name === "Q2" ? PALETTE.teal : e.name === "Q3" ? PALETTE.gold : "#ea580c"} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        ) : <p style={{ textAlign: "center", color: "#94a3b8", padding: 40 }}>Sin datos de cuartil</p>}

        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12 }}>
          {["Q1","Q2","Q3","Q4"].map(q => (
            <div key={q} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: q === "Q1" ? PALETTE.emerald : q === "Q2" ? PALETTE.teal : q === "Q3" ? PALETTE.gold : "#ea580c" }}>{qCount[q] || 0}</div>
              <div style={{ fontSize: 11, color: "#94a3b8" }}>{q}</div>
            </div>
          ))}
        </div>
      </ReportCard>

      <div style={{ gridColumn: "span 2" }}>
        <ReportCard title="Detalle de Indexación por Publicación" icon={ClipboardList} accent={PALETTE.teal}>
          <div style={{ maxHeight: 300, overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
              <thead><tr style={{ borderBottom: "2px solid #f1f5f9", position: "sticky", top: 0, background: "white" }}>
                <th style={{ textAlign: "left", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>TÍTULO</th>
                <th style={{ textAlign: "center", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>CUARTIL</th>
                <th style={{ textAlign: "left", padding: 8, color: "#94a3b8", fontWeight: 600, fontSize: 11 }}>INDEXACIONES</th>
              </tr></thead>
              <tbody>{pubs.filter(p => p.indexacion1 || p.indexacion2 || p.indexacion3).map(p => (
                <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc" }}>
                  <td style={{ padding: 8, maxWidth: 300, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: PALETTE.navy, fontWeight: 500 }}>{p.titulo}</td>
                  <td style={{ padding: 8, textAlign: "center" }}><QuartilBadge q={p.cuartil} /></td>
                  <td style={{ padding: 8 }}>
                    <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                      {[p.indexacion1, p.indexacion2, p.indexacion3].filter(Boolean).map((idx, i) => <Badge key={i} color={PALETTE.sky} bg={PALETTE.skyLight}>{idx}</Badge>)}
                    </div>
                  </td>
                </tr>
              ))}</tbody>
            </table>
          </div>
        </ReportCard>
      </div>
    </div>
  );
}

/* Informe: Temporal */
function InformeTemporal({ pubs }) {
  const porMes = {};
  pubs.forEach(p => {
    if (p.fechaPublicacion) {
      const parts = p.fechaPublicacion.split("/");
      if (parts.length === 3) {
        const k = `${parts[2]}-${parts[1].padStart(2, "0")}`;
        porMes[k] = (porMes[k] || 0) + 1;
      }
    }
  });
  const timeData = Object.entries(porMes).sort().map(([k, v]) => {
    const [y, m] = k.split("-");
    return { name: `${MESES[parseInt(m) - 1]} ${y.slice(2)}`, value: v, cumulative: 0 };
  });
  let acc = 0;
  timeData.forEach(d => { acc += d.value; d.cumulative = acc; });

  const porAnio = {};
  pubs.forEach(p => {
    if (p.fechaPublicacion) {
      const parts = p.fechaPublicacion.split("/");
      if (parts.length === 3) porAnio[parts[2]] = (porAnio[parts[2]] || 0) + 1;
    }
  });
  const anioData = Object.entries(porAnio).sort().map(([name, value]) => ({ name, value }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <ReportCard title="Producción Mensual" icon={Calendar} accent={PALETTE.teal}>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={timeData} margin={{ left: 0, right: 10 }}>
            <defs><linearGradient id="tealGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={PALETTE.teal} stopOpacity={0.3} /><stop offset="100%" stopColor={PALETTE.teal} stopOpacity={0.02} /></linearGradient></defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Area type="monotone" dataKey="value" stroke={PALETTE.teal} strokeWidth={2.5} fill="url(#tealGrad)" dot={{ r: 4, fill: PALETTE.teal }} />
          </AreaChart>
        </ResponsiveContainer>
      </ReportCard>

      <ReportCard title="Producción Acumulada" icon={TrendingUp} accent={PALETTE.violet}>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={timeData} margin={{ left: 0, right: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 11 }} />
            <Tooltip /><Line type="monotone" dataKey="cumulative" stroke={PALETTE.violet} strokeWidth={2.5} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </ReportCard>

      <div style={{ gridColumn: "span 2" }}>
        <ReportCard title="Producción por Año" icon={BarChart3} accent={PALETTE.gold}>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={anioData}><CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis dataKey="name" tick={{ fontSize: 12 }} /><YAxis tick={{ fontSize: 11 }} />
              <Tooltip /><Bar dataKey="value" fill={PALETTE.gold} radius={[8, 8, 0, 0]} barSize={50} />
            </BarChart>
          </ResponsiveContainer>
        </ReportCard>
      </div>
    </div>
  );
}

/* Informe: Registro Dir. Investigación */
function InformeRegistro({ pubs, autores, links }) {
  const registradas = pubs.filter(p => p.registrado === "Sí");
  const noRegistradas = pubs.filter(p => p.registrado !== "Sí");
  const pieData = [{ name: "Registradas", value: registradas.length }, { name: "No registradas", value: noRegistradas.length }];

  const porAutor = {};
  autores.forEach(a => { porAutor[a.id] = { ...a, reg: 0, noReg: 0 }; });
  links.forEach(l => {
    const p = pubs.find(x => x.id === l.pubId);
    if (p && porAutor[l.autorId]) {
      if (p.registrado === "Sí") porAutor[l.autorId].reg++;
      else porAutor[l.autorId].noReg++;
    }
  });
  const regData = Object.values(porAutor).filter(a => a.reg + a.noReg > 0).sort((a, b) => (b.reg + b.noReg) - (a.reg + a.noReg))
    .map(a => ({ name: a.apellidos.split(" ")[0], registradas: a.reg, pendientes: a.noReg }));

  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
      <ReportCard title="Estado de Registro" icon={ClipboardList} accent={PALETTE.emerald}>
        <ResponsiveContainer width="100%" height={240}>
          <PieChart><Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={4} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
            <Cell fill={PALETTE.emerald} /><Cell fill="#e2e8f0" />
          </Pie><Tooltip /></PieChart>
        </ResponsiveContainer>
        <div style={{ display: "flex", justifyContent: "center", gap: 24, marginTop: 8 }}>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 800, color: PALETTE.emerald }}>{registradas.length}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>Registradas</div></div>
          <div style={{ textAlign: "center" }}><div style={{ fontSize: 24, fontWeight: 800, color: "#cbd5e1" }}>{noRegistradas.length}</div><div style={{ fontSize: 11, color: "#94a3b8" }}>Pendientes</div></div>
        </div>
      </ReportCard>

      <ReportCard title="Registro por Autor" icon={Users} accent={PALETTE.teal}>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={regData} layout="vertical" margin={{ left: 10 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" /><XAxis type="number" tick={{ fontSize: 11 }} /><YAxis type="category" dataKey="name" width={90} tick={{ fontSize: 11 }} />
            <Tooltip /><Legend wrapperStyle={{ fontSize: 11 }} /><Bar dataKey="registradas" name="Registradas" stackId="a" fill={PALETTE.emerald} /><Bar dataKey="pendientes" name="Pendientes" stackId="a" fill="#e2e8f0" />
          </BarChart>
        </ResponsiveContainer>
      </ReportCard>

      <div style={{ gridColumn: "span 2" }}>
        <ReportCard title="Publicaciones Pendientes de Registro" icon={AlertCircle} accent={PALETTE.rose}>
          <div style={{ maxHeight: 260, overflowY: "auto" }}>
            {noRegistradas.length === 0 ? <p style={{ textAlign: "center", color: "#94a3b8", padding: 20 }}>Todas las publicaciones están registradas</p> :
              noRegistradas.map(p => {
                const aIds = links.filter(l => l.pubId === p.id).map(l => l.autorId);
                const names = aIds.map(id => autores.find(a => a.id === id)).filter(Boolean).map(a => `${a.nombres} ${a.apellidos}`).join(", ");
                return (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 14px", borderBottom: "1px solid #f8fafc" }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: PALETTE.navy, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{p.titulo}</p>
                      <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{names} · {p.fechaPublicacion}</p>
                    </div>
                    <EstadoBadge e={p.estadoPublicacion} />
                  </div>
                );
              })}
          </div>
        </ReportCard>
      </div>
    </div>
  );
}

/* Informe: Lista completa */
function InformeListaCompleta({ pubs, autores, links }) {
  const [search, setSearch] = useState("");
  const [fEstado, setFEstado] = useState("");
  const [fTipo, setFTipo] = useState("");
  const [fAutor, setFAutor] = useState("");
  const [fCuartil, setFCuartil] = useState("");
  const [fReg, setFReg] = useState("");

  const filtered = useMemo(() => pubs.filter(p => {
    if (search && !p.titulo.toLowerCase().includes(search.toLowerCase()) && !p.revista?.toLowerCase().includes(search.toLowerCase())) return false;
    if (fEstado && p.estadoPublicacion !== fEstado) return false;
    if (fTipo && p.tipoPublicacion !== fTipo) return false;
    if (fCuartil && p.cuartil !== fCuartil) return false;
    if (fReg && p.registrado !== fReg) return false;
    if (fAutor) { const aid = links.filter(l => l.autorId === fAutor).map(l => l.pubId); if (!aid.includes(p.id)) return false; }
    return true;
  }), [pubs, search, fEstado, fTipo, fAutor, fCuartil, fReg, links]);

  const hasFilters = fEstado || fTipo || fAutor || fCuartil || fReg;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      {/* Search */}
      <div style={{ position: "relative" }}>
        <Search size={16} style={{ position: "absolute", left: 14, top: 12, color: "#94a3b8" }} />
        <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por título o revista…"
          style={{ width: "100%", padding: "10px 14px 10px 40px", borderRadius: 12, border: "1.5px solid #e2e8f0", fontSize: 13, outline: "none", boxSizing: "border-box" }}
          onFocus={e => e.target.style.borderColor = PALETTE.teal} onBlur={e => e.target.style.borderColor = "#e2e8f0"} />
      </div>

      {/* Filters */}
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
        <Filter size={14} style={{ color: "#94a3b8" }} />
        <select value={fEstado} onChange={e => setFEstado(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, background: "white" }}>
          <option value="">Estado: Todos</option>{ESTADOS_PUB.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
        <select value={fTipo} onChange={e => setFTipo(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, background: "white" }}>
          <option value="">Tipo: Todos</option>{TIPOS_PUB.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
        <select value={fAutor} onChange={e => setFAutor(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, background: "white" }}>
          <option value="">Autor: Todos</option>{autores.map(a => <option key={a.id} value={a.id}>{a.nombres} {a.apellidos}</option>)}
        </select>
        <select value={fCuartil} onChange={e => setFCuartil(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, background: "white" }}>
          <option value="">Cuartil: Todos</option>{CUARTILES.map(q => <option key={q} value={q}>{q}</option>)}
        </select>
        <select value={fReg} onChange={e => setFReg(e.target.value)} style={{ padding: "6px 10px", borderRadius: 8, border: "1px solid #e2e8f0", fontSize: 12, background: "white" }}>
          <option value="">Registro: Todos</option><option value="Sí">Registradas</option><option value="No">No registradas</option>
        </select>
        {hasFilters && <button onClick={() => { setFEstado(""); setFTipo(""); setFAutor(""); setFCuartil(""); setFReg(""); }} style={{ fontSize: 11, color: PALETTE.rose, background: "none", border: "none", cursor: "pointer", fontWeight: 600 }}>✕ Limpiar</button>}
      </div>

      <p style={{ fontSize: 12, color: "#94a3b8" }}>{filtered.length} de {pubs.length} publicaciones</p>

      {/* Table */}
      <div style={{ background: "white", borderRadius: 14, border: "1px solid #f1f5f9", overflow: "hidden" }}>
        <div style={{ maxHeight: 500, overflowY: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
            <thead><tr style={{ borderBottom: "2px solid #f1f5f9", background: "#fafbfc", position: "sticky", top: 0, zIndex: 1 }}>
              <th style={{ textAlign: "left", padding: "10px 12px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase", letterSpacing: 0.8 }}>Título</th>
              <th style={{ textAlign: "left", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Autores</th>
              <th style={{ textAlign: "center", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Tipo</th>
              <th style={{ textAlign: "center", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Estado</th>
              <th style={{ textAlign: "center", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Q</th>
              <th style={{ textAlign: "center", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Reg.</th>
              <th style={{ textAlign: "left", padding: "10px 8px", color: "#94a3b8", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Fecha</th>
            </tr></thead>
            <tbody>{filtered.map(p => {
              const aIds = links.filter(l => l.pubId === p.id).map(l => l.autorId);
              const names = aIds.map(id => autores.find(a => a.id === id)).filter(Boolean).map(a => `${a.apellidos.split(" ")[0]}`).join(", ");
              return (
                <tr key={p.id} style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.15s" }} onMouseOver={e => e.currentTarget.style.background = "#f8fafc"} onMouseOut={e => e.currentTarget.style.background = "transparent"}>
                  <td style={{ padding: "10px 12px", maxWidth: 280, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", fontWeight: 600, color: PALETTE.navy }}>{p.titulo}</td>
                  <td style={{ padding: "10px 8px", color: "#64748b", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{names}</td>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}><Badge color="#475569">{(p.tipoPublicacion || "—").replace("Artículo ", "Art. ")}</Badge></td>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}><EstadoBadge e={p.estadoPublicacion} /></td>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}><QuartilBadge q={p.cuartil} /></td>
                  <td style={{ padding: "10px 8px", textAlign: "center" }}>{p.registrado === "Sí" ? <CheckCircle2 size={15} style={{ color: PALETTE.emerald }} /> : <XCircle size={15} style={{ color: "#e2e8f0" }} />}</td>
                  <td style={{ padding: "10px 8px", color: "#94a3b8", fontSize: 11 }}>{p.fechaPublicacion}</td>
                </tr>
              );
            })}</tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   APP PRINCIPAL
   ═══════════════════════════════════════════════ */
export default function App() {
  const [data, setData] = useState(SEED_DATA);
  const [currentView, setCurrentView] = useState("dashboard");
  const [showForm, setShowForm] = useState(false);
  const [editPub, setEditPub] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPass, setAdminPass] = useState("");
  const [sideOpen, setSideOpen] = useState(true);
  const [toast, setToast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiConnected, setApiConnected] = useState(false);

  const showToast = (msg, type = "success") => { setToast({ msg, type }); setTimeout(() => setToast(null), 3000); };

  /* ── Cargar datos desde Google Sheets al iniciar ── */
  useEffect(() => {
    if (!API_URL) {
      console.log("PubTracker: Modo DEMO (API_URL vacío). Para conectar con Google Sheets, configure la constante API_URL.");
      return;
    }
    setLoading(true);
    apiGet("getAll").then(result => {
      if (result && !result.error && result.publicaciones) {
        setData({
          publicaciones: result.publicaciones,
          autores: result.autores || [],
          pubAutores: result.pubAutores || [],
        });
        setApiConnected(true);
        console.log("PubTracker: Conectado a Google Sheets ✓");
      } else {
        console.warn("PubTracker: No se pudo conectar con la API. Usando datos demo.", result?.error);
        showToast("No se pudo conectar con Google Sheets. Usando datos de demostración.", "error");
      }
    }).finally(() => setLoading(false));
  }, []);

  /* ── Recargar datos desde la API ── */
  const reloadFromAPI = async () => {
    if (!API_URL) return;
    setLoading(true);
    const result = await apiGet("getAll");
    if (result && !result.error && result.publicaciones) {
      setData({ publicaciones: result.publicaciones, autores: result.autores || [], pubAutores: result.pubAutores || [] });
      showToast("Datos actualizados desde Google Sheets");
    }
    setLoading(false);
  };

  const handleSavePub = async (pub, autorIds) => {
    /* Guardar localmente (siempre funciona) */
    const isEdit = !!editPub;
    setData(prev => {
      const np = [...prev.publicaciones];
      const nl = prev.pubAutores.filter(l => l.pubId !== pub.id);
      const existing = np.findIndex(p => p.id === pub.id);
      if (existing >= 0) np[existing] = pub; else np.push(pub);
      autorIds.forEach((aid, i) => nl.push({ pubId: pub.id, autorId: aid, orden: i + 1 }));
      return { ...prev, publicaciones: np, pubAutores: nl };
    });
    setShowForm(false);
    setEditPub(null);

    /* Sincronizar con Google Sheets si hay API */
    if (API_URL) {
      const action = isEdit ? "updatePublicacion" : "addPublicacion";
      const body = isEdit
        ? { action, id: pub.id, publicacion: pub, autoresIds: autorIds }
        : { action, publicacion: pub, autoresIds: autorIds };
      const result = await apiPost(body);
      if (result?.success) {
        showToast(isEdit ? "Publicación actualizada y sincronizada con Google Sheets" : "Publicación registrada y sincronizada con Google Sheets");
        reloadFromAPI(); // Recargar para obtener el ID real asignado por Sheets
      } else {
        showToast("Guardado localmente, pero no se pudo sincronizar con Google Sheets", "error");
      }
    } else {
      showToast(isEdit ? "Publicación actualizada correctamente" : "Publicación registrada exitosamente");
    }
  };

  const menuSections = [
    { title: "PRINCIPAL", items: [
      { id: "dashboard", label: "Resumen General", icon: LayoutDashboard, desc: "Vista general de producción" },
      { id: "nueva", label: "Nueva Publicación", icon: Plus, desc: "Registrar publicación", action: true },
    ]},
    { title: "INFORMES", items: [
      { id: "inf-autores", label: "Por Autor", icon: Users, desc: "Producción individual" },
      { id: "inf-indexacion", label: "Indexación y Cuartil", icon: Globe, desc: "Bases de datos y cuartiles" },
      { id: "inf-temporal", label: "Evolución Temporal", icon: Calendar, desc: "Tendencias por período" },
      { id: "inf-registro", label: "Estado de Registro", icon: ClipboardList, desc: "Seguimiento Dir. Investigación" },
      { id: "inf-lista", label: "Lista Completa", icon: Library, desc: "Todas las publicaciones" },
    ]},
  ];

  const handleNav = (id) => {
    if (id === "nueva") { setEditPub(null); setShowForm(true); }
    else setCurrentView(id);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f4f5f7", fontFamily: "'DM Sans', 'Segoe UI', system-ui, sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800;1,9..40,400&family=Playfair+Display:wght@600;700;800&display=swap');
        @keyframes slideUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes toastIn { from { opacity: 0; transform: translateX(60px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        ::-webkit-scrollbar { width: 5px; } ::-webkit-scrollbar-track { background: transparent; } ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
        select:focus, input:focus { border-color: ${PALETTE.teal} !important; outline: none; box-shadow: 0 0 0 3px ${PALETTE.teal}22; }
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{
        width: sideOpen ? 260 : 60, flexShrink: 0, background: "white", borderRight: "1px solid #eef0f4",
        display: "flex", flexDirection: "column", transition: "width 0.25s ease", position: "sticky", top: 0, height: "100vh", overflow: "hidden"
      }}>
        {/* Logo */}
        <div style={{ padding: sideOpen ? "20px 20px 16px" : "20px 10px 16px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 38, height: 38, borderRadius: 10, background: `linear-gradient(135deg, ${PALETTE.navy}, ${PALETTE.teal})`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <BookOpen size={18} style={{ color: "white" }} />
          </div>
          {sideOpen && (
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 800, color: PALETTE.navy, margin: 0, fontFamily: "'Playfair Display', serif", lineHeight: 1.1 }}>PubTracker</h1>
              <p style={{ fontSize: 9, color: "#94a3b8", margin: 0, textTransform: "uppercase", letterSpacing: 1 }}>FCSyP · UNO</p>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: "12px 10px", overflowY: "auto" }}>
          {menuSections.map(sec => (
            <div key={sec.title} style={{ marginBottom: 16 }}>
              {sideOpen && <p style={{ fontSize: 9, fontWeight: 800, color: "#c0c5ce", textTransform: "uppercase", letterSpacing: 1.5, padding: "0 10px", marginBottom: 6 }}>{sec.title}</p>}
              {sec.items.map(item => {
                const active = currentView === item.id;
                return (
                  <button key={item.id} onClick={() => handleNav(item.id)} style={{
                    width: "100%", display: "flex", alignItems: "center", gap: 10, padding: sideOpen ? "9px 12px" : "9px 0",
                    justifyContent: sideOpen ? "flex-start" : "center",
                    borderRadius: 10, border: "none", cursor: "pointer", transition: "all 0.15s", marginBottom: 2,
                    background: active ? PALETTE.tealMuted : item.action ? `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.emerald})` : "transparent",
                    color: item.action ? "white" : active ? PALETTE.teal : "#64748b",
                  }}>
                    <item.icon size={17} />
                    {sideOpen && (
                      <div style={{ textAlign: "left" }}>
                        <span style={{ fontSize: 13, fontWeight: active || item.action ? 700 : 500, display: "block", lineHeight: 1.2 }}>{item.label}</span>
                        {!item.action && <span style={{ fontSize: 10, color: active ? PALETTE.tealLight : "#b0b8c4" }}>{item.desc}</span>}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div style={{ padding: "12px 10px", borderTop: "1px solid #f1f5f9" }}>
          {!isAdmin ? (
            <button onClick={() => setShowAdminLogin(true)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", justifyContent: sideOpen ? "flex-start" : "center", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: "#94a3b8", fontSize: 12 }}>
              <Shield size={16} /> {sideOpen && "Acceso Admin"}
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "4px 12px" }}>
                <div style={{ width: 7, height: 7, borderRadius: "50%", background: PALETTE.emerald }} />
                {sideOpen && <span style={{ fontSize: 11, fontWeight: 600, color: PALETTE.emerald }}>Administrador</span>}
              </div>
              <button onClick={() => setIsAdmin(false)} style={{ width: "100%", display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", justifyContent: sideOpen ? "flex-start" : "center", borderRadius: 10, border: "none", background: "transparent", cursor: "pointer", color: PALETTE.rose, fontSize: 12 }}>
                <LogOut size={16} /> {sideOpen && "Cerrar sesión"}
              </button>
            </div>
          )}
          <button onClick={() => setSideOpen(!sideOpen)} style={{ width: "100%", display: "flex", justifyContent: "center", padding: 6, border: "none", background: "transparent", cursor: "pointer", color: "#cbd5e1", marginTop: 4 }}>
            {sideOpen ? <ChevronLeft size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header style={{ position: "sticky", top: 0, zIndex: 20, background: "rgba(244,245,247,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid #eef0f4", padding: "12px 28px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: PALETTE.navy, margin: 0, fontFamily: "'Playfair Display', serif" }}>
              {currentView === "dashboard" ? "Dashboard de Producción" : currentView === "inf-autores" ? "Informe por Autor" : currentView === "inf-indexacion" ? "Informe de Indexación" : currentView === "inf-temporal" ? "Evolución Temporal" : currentView === "inf-registro" ? "Estado de Registro" : currentView === "inf-lista" ? "Lista Completa de Publicaciones" : ""}
            </h2>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 2 }}>
              <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>Facultad de Ciencias Sociales y Pedagógicas · Período 2025–2026</p>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 4, padding: "1px 8px", borderRadius: 10, fontSize: 10, fontWeight: 600, background: apiConnected ? PALETTE.emeraldLight : API_URL ? "#fef3c7" : "#f1f5f9", color: apiConnected ? PALETTE.emerald : API_URL ? PALETTE.gold : "#94a3b8" }}>
                <span style={{ width: 5, height: 5, borderRadius: "50%", background: apiConnected ? PALETTE.emerald : API_URL ? PALETTE.gold : "#cbd5e1" }}></span>
                {apiConnected ? "Google Sheets ✓" : API_URL ? "Conectando…" : "Modo Demo"}
              </span>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {loading && <Loader2 size={18} style={{ color: PALETTE.teal, animation: "spin 1s linear infinite" }} />}
            {API_URL && (
              <button onClick={reloadFromAPI} title="Recargar datos desde Google Sheets" style={{
                display: "flex", alignItems: "center", justifyContent: "center", width: 38, height: 38, borderRadius: 10,
                border: "1.5px solid #e2e8f0", background: "white", cursor: "pointer", color: "#64748b", transition: "all 0.15s"
              }} onMouseOver={e => { e.currentTarget.style.borderColor = PALETTE.teal; e.currentTarget.style.color = PALETTE.teal; }}
                onMouseOut={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.color = "#64748b"; }}>
                <RotateCcw size={16} />
              </button>
            )}
            <button onClick={() => { setEditPub(null); setShowForm(true); }} style={{
              display: "flex", alignItems: "center", gap: 8, padding: "10px 20px", borderRadius: 12, border: "none",
              background: `linear-gradient(135deg, ${PALETTE.teal}, ${PALETTE.emerald})`, color: "white", fontSize: 13, fontWeight: 700,
              cursor: "pointer", boxShadow: "0 4px 16px rgba(17,94,89,0.25)", transition: "transform 0.15s, box-shadow 0.15s"
            }} onMouseOver={e => { e.currentTarget.style.transform = "translateY(-1px)"; e.currentTarget.style.boxShadow = "0 6px 20px rgba(17,94,89,0.35)"; }}
              onMouseOut={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 4px 16px rgba(17,94,89,0.25)"; }}>
              <Plus size={17} /> Nueva Publicación
            </button>
          </div>
        </header>

        {/* Content */}
        <div style={{ flex: 1, padding: 28, animation: "fadeIn 0.3s ease" }}>
          {currentView === "dashboard" && <InformeResumen pubs={data.publicaciones} autores={data.autores} links={data.pubAutores} />}
          {currentView === "inf-autores" && <InformeAutores pubs={data.publicaciones} autores={data.autores} links={data.pubAutores} />}
          {currentView === "inf-indexacion" && <InformeIndexacion pubs={data.publicaciones} />}
          {currentView === "inf-temporal" && <InformeTemporal pubs={data.publicaciones} />}
          {currentView === "inf-registro" && <InformeRegistro pubs={data.publicaciones} autores={data.autores} links={data.pubAutores} />}
          {currentView === "inf-lista" && <InformeListaCompleta pubs={data.publicaciones} autores={data.autores} links={data.pubAutores} />}
        </div>
      </main>

      {/* ── OVERLAY: Formulario ── */}
      {showForm && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)", animation: "fadeIn 0.2s ease" }}>
          <div style={{ width: "100%", maxWidth: 720, maxHeight: "92vh", overflowY: "auto", animation: "slideUp 0.3s ease" }}>
            <PublicacionForm
              pub={editPub}
              autores={data.autores}
              pubAutores={data.pubAutores}
              onSave={handleSavePub}
              onCancel={() => { setShowForm(false); setEditPub(null); }}
            />
          </div>
        </div>
      )}

      {/* ── OVERLAY: Admin Login ── */}
      {showAdminLogin && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}>
          <div style={{ background: "white", borderRadius: 16, padding: 32, width: 380, boxShadow: "0 20px 60px rgba(0,0,0,0.15)", animation: "slideUp 0.3s ease" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: PALETTE.navy, margin: 0, fontFamily: "'Playfair Display', serif" }}>Acceso Administrador</h3>
              <button onClick={() => setShowAdminLogin(false)} style={{ border: "none", background: "none", cursor: "pointer", color: "#94a3b8" }}><X size={20} /></button>
            </div>
            <div style={{ background: PALETTE.goldLight, borderRadius: 10, padding: 12, marginBottom: 16 }}>
              <p style={{ fontSize: 11, color: PALETTE.gold, margin: 0 }}>Ingrese las credenciales para gestionar publicaciones y autores del sistema.</p>
            </div>
            <FormField label="Contraseña"><TextInput type="password" value={adminPass} onChange={setAdminPass} placeholder="Ingrese contraseña…" /></FormField>
            <button onClick={() => {
              if (adminPass === "UNO2025" || adminPass === "admin") { setIsAdmin(true); setShowAdminLogin(false); setAdminPass(""); showToast("Sesión de administrador iniciada"); }
              else { showToast("Contraseña incorrecta", "error"); }
            }} style={{ width: "100%", padding: "11px 20px", borderRadius: 10, border: "none", background: PALETTE.teal, color: "white", fontSize: 14, fontWeight: 700, cursor: "pointer", marginTop: 16 }}>
              Iniciar Sesión
            </button>
            <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", marginTop: 10 }}>Demo: UNO2025</p>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{
          position: "fixed", bottom: 24, right: 24, zIndex: 100, display: "flex", alignItems: "center", gap: 10,
          padding: "12px 20px", borderRadius: 12, boxShadow: "0 8px 30px rgba(0,0,0,0.15)", animation: "toastIn 0.3s ease",
          background: toast.type === "error" ? PALETTE.rose : PALETTE.teal, color: "white", fontSize: 13, fontWeight: 600
        }}>
          {toast.type === "error" ? <AlertCircle size={16} /> : <CheckCircle2 size={16} />}
          {toast.msg}
        </div>
      )}
    </div>
  );
}