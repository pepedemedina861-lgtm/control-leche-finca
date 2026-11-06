const $=id=>document.getElementById(id);
const COWKEY="olivo_cows_v1", MILKKEY="olivo_milk_v1";
let cows=JSON.parse(localStorage.getItem(COWKEY)||"[]"), milk=JSON.parse(localStorage.getItem(MILKKEY)||"[]");
const today=new Date(), iso=d=>{let x=new Date(d);return `${x.getFullYear()}-${String(x.getMonth()+1).padStart(2,"0")}-${String(x.getDate()).padStart(2,"0")}`};
const money=n=>new Intl.NumberFormat("es-CO",{style:"currency",currency:"COP",maximumFractionDigits:0}).format(n||0);
const qty=n=>new Intl.NumberFormat("es-CO",{maximumFractionDigits:2}).format(n||0);
const save=()=>{localStorage.setItem(COWKEY,JSON.stringify(cows));localStorage.setItem(MILKKEY,JSON.stringify(milk));};
$("todayLabel").textContent=today.toLocaleDateString("es-CO",{weekday:"long",day:"numeric",month:"long",year:"numeric"});
$("milkDate").value=iso(today);$("cowEntry").value=iso(today);$("reportMonth").value=iso(today).slice(0,7);
function go(view){document.querySelectorAll(".view").forEach(v=>v.classList.toggle("hidden",v.id!=="view-"+view));document.querySelectorAll(".tab").forEach(b=>b.classList.toggle("active",b.dataset.view===view));render();}
document.querySelectorAll(".tab").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.go)));
function statusClass(s){return s==="Gestante"?"gestante":s==="Seca"?"seca":s==="En tratamiento"?"tratamiento":s==="Vendida"?"vendida":""}
function render(){
 const day=milk.filter(r=>r.date===iso(today)), active=cows.filter(c=>c.status==="En producción");
 $("dashLiters").textContent=qty(day.reduce((a,r)=>a+r.liters,0))+" L";$("dashMoney").textContent=money(day.reduce((a,r)=>a+r.liters*r.price,0));
 $("dashCows").textContent=cows.length;$("dashActive").textContent=active.length;
 $("cowTotal").textContent=cows.length;$("cowProducing").textContent=active.length;$("cowOther").textContent=cows.length-active.length;
 const search=$("cowSearch").value.toLowerCase();
 const shown=cows.filter(c=>(c.code+" "+c.name+" "+c.breed).toLowerCase().includes(search));
 $("cowList").innerHTML=shown.map(c=>`<div class="item"><div class="itemtop"><div><div class="itemtitle">${esc(c.code)} · ${esc(c.name)}</div><div class="sub">${esc(c.breed||"Raza no especificada")}${c.entry?" · Ingreso: "+c.entry:""}</div></div><span class="status ${statusClass(c.status)}">${esc(c.status)}</span></div>${c.notes?`<div class="sub">${esc(c.notes)}</div>`:""}<div class="actions"><button onclick="editCow('${c.id}')">Editar</button><button class="danger" onclick="removeCow('${c.id}')">Eliminar</button></div></div>`).join("");
 $("cowEmpty").style.display=shown.length?"none":"block";
 $("milkCow").innerHTML='<option value="">Selecciona una vaca</option>'+cows.filter(c=>c.status!=="Vendida").map(c=>`<option value="${c.id}">${esc(c.code)} - ${esc(c.name)} (${esc(c.status)})</option>`).join("");
 const sorted=[...milk].sort((a,b)=>b.date.localeCompare(a.date)||b.id-a.id);
 const recordHTML=r=>{let c=cows.find(x=>x.id===r.cowId);return `<div class="item"><div class="itemtop"><div><div class="itemtitle">${esc(c?c.code+" · "+c.name:"Vaca eliminada")}</div><div class="sub">${r.date} · ${qty(r.liters)} L × ${money(r.price)}</div></div><b>${money(r.liters*r.price)}</b></div>${r.note?`<div class="sub">${esc(r.note)}</div>`:""}<div class="actions"><button class="danger" onclick="removeMilk(${r.id})">Eliminar</button></div></div>`};
 $("milkRecords").innerHTML=sorted.slice(0,20).map(recordHTML).join("");$("milkEmpty").style.display=sorted.length?"none":"block";
 $("recentRecords").innerHTML=sorted.slice(0,4).map(recordHTML).join("");$("recentEmpty").style.display=sorted.length?"none":"block";
 const month=$("reportMonth").value, data=milk.filter(r=>!month||r.date.startsWith(month));
 $("reportLiters").textContent=qty(data.reduce((a,r)=>a+r.liters,0))+" L";$("reportMoney").textContent=money(data.reduce((a,r)=>a+r.liters*r.price,0));
 $("cowReport").innerHTML=cows.map(c=>{let rs=data.filter(r=>r.cowId===c.id),l=rs.reduce((a,r)=>a+r.liters,0),v=rs.reduce((a,r)=>a+r.liters*r.price,0);return `<div class="item itemtop"><div><div class="itemtitle">${esc(c.code)} · ${esc(c.name)}</div><div class="sub">${qty(l)} litros registrados</div></div><b>${money(v)}</b></div>`}).join("")||'<div class="empty">Registra vacas para ver el reporte.</div>';
}
function esc(s){return String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function openCow(c){$("cowId").value=c?.id||"";$("cowCode").value=c?.code||"";$("cowName").value=c?.name||"";$("cowBreed").value=c?.breed||"";$("cowStatus").value=c?.status||"En producción";$("cowEntry").value=c?.entry||iso(today);$("cowNotes").value=c?.notes||"";$("cowDialogTitle").textContent=c?"Editar vaca":"Nueva vaca";$("cowDialog").showModal();}
$("addCowBtn").addEventListener("click",()=>openCow());$("closeCow").addEventListener("click",()=>$("cowDialog").close());
$("cowForm").addEventListener("submit",e=>{e.preventDefault();let id=$("cowId").value,code=$("cowCode").value.trim(),name=$("cowName").value.trim();if(cows.some(c=>c.code.toLowerCase()===code.toLowerCase()&&c.id!==id)){alert("Ya existe una vaca con ese código o arete.");return;}let obj={id:id||String(Date.now()),code,name,breed:$("cowBreed").value.trim(),status:$("cowStatus").value,entry:$("cowEntry").value,notes:$("cowNotes").value.trim()};if(id)cows=cows.map(c=>c.id===id?obj:c);else cows.push(obj);save();$("cowDialog").close();render();});
window.editCow=id=>{let c=cows.find(x=>x.id===id);if(c)openCow(c)};
window.removeCow=id=>{let c=cows.find(x=>x.id===id);if(!c)return;if(confirm(`¿Eliminar a ${c.name}? Sus registros históricos de leche se conservarán.`)){cows=cows.filter(x=>x.id!==id);save();render();}};
function updateTotal(){$("milkTotal").textContent=money((+$("milkLiters").value||0)*(+$("milkPrice").value||0))}
$("milkLiters").addEventListener("input",updateTotal);$("milkPrice").addEventListener("input",updateTotal);
$("milkForm").addEventListener("submit",e=>{e.preventDefault();let cowId=$("milkCow").value,liters=+$("milkLiters").value,price=+$("milkPrice").value;if(!cowId){alert("Selecciona una vaca.");return;}if(liters<=0||price<0){alert("Verifica los litros y el precio.");return;}milk.push({id:Date.now(),date:$("milkDate").value,cowId,liters,price,note:$("milkNote").value.trim()});save();$("milkLiters").value="";$("milkNote").value="";updateTotal();render();alert("Producción guardada.");});
window.removeMilk=id=>{if(confirm("¿Eliminar este registro de producción?")){milk=milk.filter(r=>r.id!==id);save();render();}};
$("cowSearch").addEventListener("input",render);$("reportMonth").addEventListener("change",render);
$("exportBtn").addEventListener("click",()=>{let rows=[["Fecha","Código vaca","Nombre","Litros","Precio litro COP","Total COP","Observaciones"],...milk.map(r=>{let c=cows.find(x=>x.id===r.cowId)||{};return [r.date,c.code||"",c.name||"",r.liters,r.price,r.liters*r.price,r.note]})];let csv="\uFEFF"+rows.map(row=>row.map(v=>`"${String(v??"").replace(/"/g,'""')}"`).join(";")).join("\n");let a=document.createElement("a"),url=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.href=url;a.download="granja_el_olivo_registros.csv";a.click();URL.revokeObjectURL(url);});
if("serviceWorker"in navigator)addEventListener("load",()=>navigator.serviceWorker.register("./sw.js").catch(()=>{}));
render();