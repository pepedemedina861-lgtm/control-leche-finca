const $=id=>document.getElementById(id);
const KEY="control_leche_vacas_v1";
let records=JSON.parse(localStorage.getItem(KEY)||"[]");
const today=new Date();
const iso=d=>{const x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`};
$("date").value=iso(today);$("monthFilter").value=iso(today).slice(0,7);
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n||0);
const num=n=>new Intl.NumberFormat("es-CO",{maximumFractionDigits:2}).format(n||0);
const save=()=>localStorage.setItem(KEY,JSON.stringify(records));
function preview(){ $("preview").textContent=money((+$("liters").value||0)*(+$("price").value||0));}
$("liters").addEventListener("input",preview);$("price").addEventListener("input",preview);
$("milkForm").addEventListener("submit",e=>{e.preventDefault();const item={id:Date.now(),date:$("date").value,liters:+$("liters").value,price:+$("price").value,note:$("note").value.trim()};if(!item.date||item.liters<=0||item.price<0)return;records.push(item);save();$("liters").value="";$("note").value="";preview();render();});
$("monthFilter").addEventListener("change",render);
function render(){
 const t=iso(today),m=t.slice(0,7);
 const sum=(arr,k)=>arr.reduce((a,r)=>a+(+r[k]||0),0);
 const day=records.filter(r=>r.date===t),month=records.filter(r=>r.date.startsWith(m));
 $("todayLiters").textContent=num(sum(day,"liters"))+" L";$("todayMoney").textContent=money(day.reduce((a,r)=>a+r.liters*r.price,0));
 $("monthLiters").textContent=num(sum(month,"liters"))+" L";$("monthMoney").textContent=money(month.reduce((a,r)=>a+r.liters*r.price,0));
 const filter=$("monthFilter").value;const list=records.filter(r=>!filter||r.date.startsWith(filter)).sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
 $("records").innerHTML=list.map(r=>`<div class="record"><div class="record-top"><span class="record-date">${new Date(r.date+"T12:00:00").toLocaleDateString("es-CO",{day:"2-digit",month:"short",year:"numeric"})}</span><span class="record-total">${money(r.liters*r.price)}</span></div><div class="record-meta">${num(r.liters)} litros × ${money(r.price)} por litro</div>${r.note?`<div class="record-note">${escapeHtml(r.note)}</div>`:""}<div class="record-actions"><button onclick="editRecord(${r.id})">Editar</button><button class="delete" onclick="deleteRecord(${r.id})">Eliminar</button></div></div>`).join("");
 $("empty").style.display=list.length?"none":"block";
 $("filteredTotals").textContent=list.length?`Total del período: ${num(sum(list,"liters"))} litros · ${money(list.reduce((a,r)=>a+r.liters*r.price,0))}`:"";
}
function escapeHtml(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
window.deleteRecord=id=>{if(confirm("¿Eliminar este registro?")){records=records.filter(r=>r.id!==id);save();render();}};
window.editRecord=id=>{const r=records.find(x=>x.id===id);if(!r)return;const liters=prompt("Litros producidos:",r.liters);if(liters===null)return;const price=prompt("Precio por litro (COP):",r.price);if(price===null)return;const note=prompt("Detalle:",r.note||"");if(note===null)return;const l=Number(liters),p=Number(price);if(!(l>0)||!(p>=0)){alert("Verifica los litros y el precio.");return;}Object.assign(r,{liters:l,price:p,note});save();render();};
$("exportBtn").addEventListener("click",()=>{const rows=[["Fecha","Litros","Precio por litro COP","Total COP","Detalle"],...records.map(r=>[r.date,r.liters,r.price,r.liters*r.price,r.note])];const csv="\uFEFF"+rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(";")).join("\n");const blob=new Blob([csv],{type:"text/csv;charset=utf-8"});const a=document.createElement("a");a.href=URL.createObjectURL(blob);a.download="control_de_leche.csv";a.click();URL.revokeObjectURL(a.href);});
if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();