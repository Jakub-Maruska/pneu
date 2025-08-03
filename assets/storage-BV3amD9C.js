import{D as p}from"./firebase-config-CqFqcOjv.js";/* empty css               */localStorage.getItem("isLoggedIn")!=="true"&&(window.location.href="../index.html");let d=[];async function f(){try{d=await p.getTires(),console.log("Loaded tires:",d),d.length>0&&(console.log("Sample tire structure:",d[0]),console.log("Sample tire ID:",d[0].id),console.log("Sample tire customId:",d[0].customId)),B(),D()}catch(o){console.error("Error loading tires:",o),d=[]}}let u=null;const G=document.getElementById("availableTires"),R=document.getElementById("forSaleTires"),w=document.getElementById("forSaleSection"),U=document.getElementById("disposedTires"),E=document.getElementById("disposedSection"),F=document.getElementById("availableCount"),O=document.getElementById("forSaleCount"),P=document.getElementById("disposedCount"),H=document.getElementById("addTireBtn"),v=document.getElementById("tireModal"),q=document.getElementById("closeModal"),L=document.getElementById("tireForm"),x=document.getElementById("modalTitle"),M=document.getElementById("submitText"),z=document.getElementById("filterSearch"),m=document.getElementById("groupDetailModal"),A=document.getElementById("closeGroupDetailModal"),K=document.getElementById("groupDetailList"),T=document.getElementById("moveTireModal"),V=document.getElementById("closeMoveTireModal"),N=document.getElementById("cancelMoveTire");document.getElementById("moveTireIdDisplay");const W=document.querySelectorAll("#moveTireModal .storage-option-btn");document.addEventListener("DOMContentLoaded",async()=>{await f(),p.onTiresUpdate(e=>{d=e,B(),D()});const o=document.getElementById("tireSize");o&&(o.addEventListener("input",y),o.dataset.lastLength="0")});H.addEventListener("click",()=>C());q.addEventListener("click",()=>$());L.addEventListener("submit",Z);z.addEventListener("input",B);function C(o=null){u=o;const e=document.getElementById("currentDotDisplay"),i=document.getElementById("tireDot");o?(x.textContent="Upraviť pneumatiku",M.textContent="Aktualizovať pneumatiku",document.getElementById("tireBrand").value=o.brand,document.getElementById("tireType").value=o.type,document.getElementById("tireSize").value=o.size,document.getElementById("tireId").value=o.customId||o.id,document.getElementById("tireKm").value=o.km??0,o.dot?e.textContent=`(Aktuálny: ${o.dot})`:e.textContent="",i.value="",i.required=!1):(x.textContent="Pridať novú pneumatiku",M.textContent="Pridať pneumatiku",L.reset(),document.getElementById("tireKm").value="0",e.textContent="",i.required=!0),v.classList.add("active");const n=document.getElementById("tireSize");n&&(n.removeEventListener("input",y),n.addEventListener("input",y),n.dataset.lastLength="0")}function $(){v.classList.remove("active"),u=null,L.reset();const o=document.getElementById("tireSize");o&&o.removeEventListener("input",y)}function Y(o){if(!/^\d{4}$/.test(o))return null;const e=parseInt(o.substring(0,2),10),i=parseInt(o.substring(2,4),10)+2e3;if(e<1||e>53)return null;const n=Math.ceil(e/4.345);return`${String(n).padStart(2,"0")}/${i}`}async function Z(o){o.preventDefault();const e=document.getElementById("tireBrand").value,i=document.getElementById("tireType").value;let n=document.getElementById("tireSize").value;const s=document.getElementById("tireId").value,t=document.getElementById("tireDot").value,l=parseInt(document.getElementById("tireKm").value)||0;let a=u?u.dot:null;if(t){const r=Y(t);if(r)a=r;else{alert("Neplatný formát DOT. Zadajte 4 číslice v tvare WWYY (napr. 1424).");return}}else if(!u){alert("DOT je povinný údaj pre nové pneumatiky.");return}try{if(u)console.log("Updating tire:",u),console.log("Update data:",{brand:e,type:i,size:n,id:s,dot:a,km:l}),await p.updateTire(u.id,{customId:s,brand:e,type:i,size:n,dot:a,km:l}),console.log("Tire updated successfully");else{const r={customId:s,brand:e,type:i,size:n,status:"available",dot:a,km:l};await p.addTire(r)}await f(),$()}catch(r){console.error("Error saving tire:",r),alert("Chyba pri ukladaní pneumatiky. Skúste to znova.")}}async function J(o){if(confirm("Ste si istí, že chcete vymazať túto pneumatiku?"))try{console.log("Attempting to delete tire with ID:",o),console.log("Available tires:",d);const e=d.find(i=>i.id===o);console.log("Found tire:",e),e?(await p.deleteTire(o),console.log("Tire deleted successfully"),await f()):(console.error("Tire not found for deletion"),alert("Pneumatika nebola nájdená."))}catch(e){console.error("Error deleting tire:",e),alert("Chyba pri mazaní pneumatiky. Skúste to znova.")}}function B(){let o=d.filter(t=>t.status==="available"),e=d.filter(t=>t.status==="forSale"),i=d.filter(t=>t.status==="disposed");const n=z.value.trim().toLowerCase();n&&(o=o.filter(t=>t.brand.toLowerCase().includes(n)||t.type.toLowerCase().includes(n)||t.size.toLowerCase().includes(n)||t.customId&&t.customId.toLowerCase().includes(n)||t.id&&t.id.toLowerCase().includes(n)||t.dot&&t.dot.toLowerCase().includes(n)),e=e.filter(t=>t.brand.toLowerCase().includes(n)||t.type.toLowerCase().includes(n)||t.size.toLowerCase().includes(n)||t.customId&&t.customId.toLowerCase().includes(n)||t.id&&t.id.toLowerCase().includes(n)||t.dot&&t.dot.toLowerCase().includes(n)),i=i.filter(t=>t.brand.toLowerCase().includes(n)||t.type.toLowerCase().includes(n)||t.size.toLowerCase().includes(n)||t.customId&&t.customId.toLowerCase().includes(n)||t.id&&t.id.toLowerCase().includes(n)||t.dot&&t.dot.toLowerCase().includes(n)));const s={};if(o.forEach(t=>{const l=`${t.brand}|${t.type}|${t.size}`;s[l]||(s[l]=[]),s[l].push(t)}),G.innerHTML=Object.keys(s).map(t=>{const l=s[t],a=l[0];return`
        <div class="tire-card group-card" onclick="showGroupDetail('${encodeURIComponent(t)}', 'available')">
          <div class="tire-card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
            <div class="tire-info">
              <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                <h3>${a.brand} ${a.type}</h3>
              </div>
              <p>${a.size}</p>
            </div>
            <span class="tire-count status-available" style="align-self: flex-start; margin-left: 1rem;">${l.length} ks</span>
          </div>
        </div>
      `}).join(""),e.length>0){const t={};e.forEach(a=>{const r=`${a.brand}|${a.type}|${a.size}`;t[r]||(t[r]=[]),t[r].push(a)}),R.innerHTML=Object.keys(t).map(a=>{const r=t[a],c=r[0];return`
          <div class="tire-card group-card" onclick="showGroupDetail('${encodeURIComponent(a)}', 'forSale')">
            <div class="tire-card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div class="tire-info">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <h3>${c.brand} ${c.type}</h3>
                </div>
                <p>${c.size}</p>
              </div>
              <span class="tire-count status-forsale" style="align-self: flex-start; margin-left: 1rem;">${r.length} ks</span>
            </div>
          </div>
        `}).join(""),w.style.display="block";const l=w.querySelector(".collapsible-content");l&&(l.style.display="none")}else w.style.display="none";if(i.length>0){const t={};i.forEach(a=>{const r=`${a.brand}|${a.type}|${a.size}`;t[r]||(t[r]=[]),t[r].push(a)}),U.innerHTML=Object.keys(t).map(a=>{const r=t[a],c=r[0];return`
          <div class="tire-card group-card" onclick="showGroupDetail('${encodeURIComponent(a)}', 'disposed')">
            <div class="tire-card-header" style="display: flex; justify-content: space-between; align-items: flex-start;">
              <div class="tire-info">
                <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                  <h3>${c.brand} ${c.type}</h3>
                </div>
                <p>${c.size}</p>
              </div>
              <span class="tire-count status-disposed" style="align-self: flex-start; margin-left: 1rem;">${r.length} ks</span>
            </div>
          </div>
        `}).join(""),E.style.display="block";const l=E.querySelector(".collapsible-content");l&&(l.style.display="none")}else E.style.display="none"}function D(){const o=d.filter(n=>n.status==="available").length,e=d.filter(n=>n.status==="forSale").length,i=d.filter(n=>n.status==="disposed").length;F.textContent=`${o} Dostupné`,O.textContent=`${e} Predávané`,P.textContent=`${i} Vyradené`}window.showGroupDetail=function(o,e="available"){const i=decodeURIComponent(o),[n,s,t]=i.split("|"),l=d.filter(g=>g.status===e&&g.brand===n&&g.type===s&&g.size===t),a=window.innerWidth<=500;let r=t,c="",S="";const h=t.match(/^(\d{3}\/\d{2}) ?R ?([\d,.]+)/i);h&&(r=h[1],c="R",S=h[2]);let I="badge-count";e==="forSale"?I="badge badge-status badge-status-forsale":e==="disposed"&&(I="badge badge-status badge-status-disposed"),K.innerHTML=`
    <div class="group-header-box">
      <div style="display:flex; justify-content:space-between; align-items:flex-start;">
        <div>
          <div style="margin-bottom:0.5rem;">
            <span style="font-weight:700; font-size:1.15rem;">${n} ${s}</span>
          </div>
          <div style="color:#6b7280; font-size:0.875rem;">${r} ${c} ${S}</div>
        </div>
        <span class="${I}">${l.length} ks</span>
      </div>
    </div>
    <div class="group-table-box">
      <div style="display:flex; justify-content:center; align-items:center; margin-bottom:0.75rem;">
        <button class="add-btn group-mobile-add-btn" style="display:flex;align-items:center;gap:0.5rem;" onclick="prefillFromGroup('${encodeURIComponent(n)}','${encodeURIComponent(s)}','${encodeURIComponent(t)}')">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          Rýchle pridanie gumy
        </button>
      </div>
      <div class="group-table-scroll">
        ${a?X(l):Q(l)}
      </div>
    </div>
  `,m.classList.add("active")};function Q(o){return`
    <table class="group-table">
      <thead>
        <tr>
          <th># ID</th>
          <th>DOT</th>
          <th>Najazdené km</th>
          <th style="text-align: right;">Akcie</th>
        </tr>
      </thead>
      <tbody>
        ${o.map(e=>`
              <tr>
                <td>${e.customId||e.id}</td>
                <td>${e.dot||"-"}</td>
                <td>${j(e.km??0)} km</td>
                <td style="text-align: right;">
                  <button class="action-btn edit-btn" onclick="editTireFromGroup('${e.customId||e.id}')" title="Upraviť">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  </button>
                  <button class="action-btn move-btn" onclick="openMoveTireModal('${e.id}')" title="Presunúť">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 3v18h18"/><path d="m3 9 6-6 6 6"/><path d="m3 15 6 6 6-6"/></svg>
                  </button>
                  <button class="action-btn delete-btn" onclick="deleteTireFromGroup('${e.customId||e.id}')" title="Vymazať">
                     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3,6 5,6 21,6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                  </button>
                </td>
              </tr>
            `).join("")}
      </tbody>
    </table>
  `}function X(o){return`
    <div class="group-mobile-list">
      ${o.map(e=>`
            <div class="group-mobile-card">
              <div class="group-mobile-row"><span class="group-mobile-label">ID:</span> <span class="group-mobile-id">${e.customId||e.id}</span></div>
              <div class="group-mobile-row"><span class="group-mobile-label">DOT:</span> <span class="group-mobile-km">${e.dot||"-"}</span></div>
              <div class="group-mobile-row"><span class="group-mobile-label">Najazdené km:</span> <span class="group-mobile-km">${j(e.km??0)} km</span></div>
              <div class="group-mobile-actions">
                <button class="group-mobile-btn edit" onclick="editTireFromGroup('${e.customId||e.id}')">Upraviť</button>
                <button class="group-mobile-btn delete" onclick="deleteTireFromGroup('${e.customId||e.id}')">Vymazať</button>
                <button class="group-mobile-btn move" onclick="openMoveTireModal('${e.id}')">Presunúť</button>
              </div>
            </div>
          `).join("")}
    </div>
  `}function j(o){return o.toLocaleString("sk-SK")}window.editTireFromGroup=function(o){console.log("editTireFromGroup called with tireId:",o),console.log("Available tires:",d);const e=d.find(i=>i.customId===o);console.log("Found tire:",e),e&&(m.classList.remove("active"),setTimeout(()=>{C(e)},100))};window.deleteTireFromGroup=function(o){console.log("deleteTireFromGroup called with tireId:",o);const e=d.find(i=>i.customId===o);console.log("Found tire for deletion:",e),e?(m.classList.remove("active"),setTimeout(async()=>{await J(e.id)},100)):(console.error("Tire not found for deletion:",o),alert("Pneumatika nebola nájdená."))};A.addEventListener("click",()=>{m.classList.remove("active")});m.addEventListener("click",o=>{o.target===m&&m.classList.remove("active")});let k=null;function b(){T.classList.remove("active"),k=null}async function _(o){if(k)try{await p.updateTire(k.id,{status:o}),await f(),b()}catch(e){console.error("Error moving tire:",e),alert("Chyba pri presúvaní pneumatiky.")}}V.addEventListener("click",b);N.addEventListener("click",b);T.addEventListener("click",o=>{o.target===T&&b()});W.forEach(o=>{o.addEventListener("click",()=>{const e=o.dataset.status;_(e)})});globalThis.prefillFromGroup=function(o,e,i){C(),document.getElementById("tireBrand").value=decodeURIComponent(o),document.getElementById("tireType").value=decodeURIComponent(e),document.getElementById("tireSize").value=decodeURIComponent(i),m.classList.remove("active"),document.getElementById("tireId").focus()};v.addEventListener("click",o=>{o.target===v&&$()});function y(o){const e=o.target,i=e.selectionStart,n=e.value;if(n.length<e.dataset.lastLength){e.dataset.lastLength=n.length;return}let s=e.value.replace(/[^0-9]/g,""),t=s;s.length>=3&&(t=s.slice(0,3)+"/"+s.slice(3)),s.length>=5&&(t=s.slice(0,3)+"/"+s.slice(3,5)+" R"+s.slice(5)),s.length>=7&&(t=s.slice(0,3)+"/"+s.slice(3,5)+" R"+s.slice(5,7)+"."+s.slice(7)),e.value=t,e.dataset.lastLength=t.length;let l=i;s.length>=3&&i>3&&l++,s.length>=5&&i>5&&(l+=2),s.length>=7&&i>7&&l++,e.setSelectionRange(l,l)}window.toggleSection=function(o){const e=document.getElementById(o),i=e.querySelector(".collapsible-content"),n=e.querySelector(".dropdown-arrow");i.style.display==="none"||i.style.display===""?(i.style.display="grid",n.style.transform="rotate(180deg)"):(i.style.display="none",n.style.transform="rotate(0deg)")};
