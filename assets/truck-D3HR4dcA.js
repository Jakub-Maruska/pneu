import{D as o}from"./firebase-config-Cu0ruEyn.js";localStorage.getItem("isLoggedIn")!=="true"&&(window.location.href="../index.html");let r=[],d={},v={},m,w,f,k;async function y(){try{const[t,s,n]=await Promise.all([o.getTrucks(),o.getAllVehicleKms(),o.getAllTireSlots("truck")]);r=t,d=s,v=n,a(),l(),c()}catch(t){console.error("Error loading trucks:",t),r=[]}}function a(){r.forEach(t=>{const s=d[t.id]||0,n=v[t.id]||[],e=n.filter(u=>u.tire).length,g=n.length>0?n.length:6;t.kilometers=s,t.tiresAssigned=e,t.totalTires=g,t.status=T(n,s)})}function T(t,s){const n=t.filter(i=>i.tire);if(n.length===0)return"unknown";const e=n.map(i=>{const x=i.tire.km||0,p=i.tire.kmOnAssign!==void 0?i.tire.kmOnAssign:s,h=s-p;return x+(h>0?h:0)});return e.some(i=>i>=2e5)?"danger":e.some(i=>i>=15e4&&i<2e5)?"warning":"good"}document.addEventListener("DOMContentLoaded",async()=>{m=document.getElementById("truckGrid"),w=document.getElementById("goodCount"),f=document.getElementById("warningCount"),k=document.getElementById("dangerCount"),await y(),o.onTrucksUpdate(async t=>{r=t,a(),l(),c()}),o.onAllVehicleKmsUpdate(t=>{d=t,a(),l(),c()})});function l(){m.innerHTML=r.map(t=>L(t)).join("")}function c(){const t=r.filter(e=>e.status==="good").length,s=r.filter(e=>e.status==="warning").length,n=r.filter(e=>e.status==="danger").length;console.log("Updating truck stats:",{good:t,warning:s,danger:n,total:r.length}),console.log("Truck statuses:",r.map(e=>({id:e.id,status:e.status}))),w.textContent=`${t} Dobrý`,f.textContent=`${s} Pozor`,k.textContent=`${n} Kritické`}function C(t){return t&&t.length===7?`${t.slice(0,2)} ${t.slice(2,5)} ${t.slice(5,7)}`:t}function $(t){switch(t){case"good":return"Dobrý";case"warning":return"Pozor";case"danger":return"Kritické";case"unknown":return"Neznáme";default:return"Neznáme"}}function L(t){return Math.round(t.tiresAssigned/t.totalTires*100),`
        <div class="vehicle-card" onclick="window.location.href='truck-detail.html?id=${t.id}'">
            <div class="vehicle-card-content">
                <div class="vehicle-info">
                    <div class="vehicle-icon ${t.status||"good"}">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                            <path d="M15 18H9"/>
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                            <circle cx="17" cy="18" r="2"/>
                            <circle cx="7" cy="18" r="2"/>
                        </svg>
                    </div>
                    <div class="vehicle-details">
                        <h3>${C(t.licensePlate)}</h3>
                        <div class="vehicle-meta">
                            <span>${t.tiresAssigned}/${t.totalTires} pneumatík</span>
                        </div>
                    </div>
                </div>
                <div class="vehicle-status">
                    <div class="status-icon ${t.status||"unknown"}">
                        ${t.status==="good"?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>':t.status==="warning"?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>':t.status==="danger"?'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>':'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'}
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-info">
                    <span>Stav pneumatík</span>
                    <span>${$(t.status)}</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${t.status||"unknown"}" style="width: 100%"></div>
                </div>
            </div>
        </div>
    `}
