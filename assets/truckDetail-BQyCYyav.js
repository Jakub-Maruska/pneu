import{D as m}from"./firebase-config-CqFqcOjv.js";/* empty css               */localStorage.getItem("isLoggedIn")!=="true"&&(window.location.href="../index.html");const B=new URLSearchParams(window.location.search),g=B.get("id");let E=[],c=null,a=[{id:"front-left",position:"Predné ľavé",category:"front",tire:null},{id:"front-right",position:"Predné pravé",category:"front",tire:null},{id:"rear-left-outer",position:"Zadné ľavé vonkajšie",category:"rear",tire:null},{id:"rear-left-inner",position:"Zadné ľavé vnútorné",category:"rear",tire:null},{id:"rear-right-outer",position:"Zadné pravé vonkajšie",category:"rear",tire:null},{id:"rear-right-inner",position:"Zadné pravé vnútorné",category:"rear",tire:null}];async function C(){try{if(c=(await m.getTrucks()).find(t=>t.id===g),!c){window.location.href="truck.html";return}L.textContent=c.licensePlate;const n=await m.getVehicleKm(g);n!==null&&(c.kilometers=n),k(),E=await m.getTires(),await b(),f(),y()}catch(e){console.error("Error loading data:",e)}}async function b(){try{const e=await m.getTireSlots("truck",g);e.length>0&&(a=e)}catch(e){console.error("Error loading tire slots:",e)}}let I=null;const L=document.getElementById("truckPlate"),D=document.getElementById("assignedStatus"),w=document.getElementById("completionBadge"),M=document.getElementById("frontTires"),P=document.getElementById("rearTires"),p=document.getElementById("assignModal"),A=document.getElementById("closeAssignModal");document.getElementById("assignModalTitle");document.getElementById("tireSelection");const K=document.getElementById("removeTireModal"),O=document.getElementById("cancelRemoveTire"),j=document.querySelectorAll(".storage-option-btn");document.addEventListener("DOMContentLoaded",async()=>{await C(),m.onTiresUpdate(e=>{E=e}),m.onTrucksUpdate(e=>{const n=e.find(t=>t.id===g);n&&(c=n,k())}),m.onTireSlotsUpdate("truck",g,e=>{e.length>0&&(a=e,f(),y())}),m.onVehicleKmUpdate(g,e=>{e!==null&&c&&(c.kilometers=e,k(),f())})});A.addEventListener("click",()=>$());function f(){const e=a.filter(t=>t.category==="front"),n=a.filter(t=>t.category==="rear");M.innerHTML=e.map(t=>T(t)).join(""),P.innerHTML=n.map(t=>T(t)).join(""),H()}function z(e){return e>2e5?"status-red":e>=15e4?"status-orange":"status-green"}function T(e){const n=!!e.tire;let t=0;if(n&&c){const o=c.kilometers||0,l=e.tire.km||0,r=e.tire.kmOnAssign!==void 0?e.tire.kmOnAssign:o,i=o-r;t=l+(i>0?i:0)}const s=z(t);return`
        <div class="tire-slot-card" data-slot-id="${e.id}">
            <div class="tire-slot-header">
                <h3>${e.position}</h3>
            </div>
            <div class="tire-slot-content">
                ${n?`
                    <div class="assigned-tire-new" draggable="true">
                        <div class="tire-brand-new">${e.tire.brand} <strong>${e.tire.type}</strong></div>
                        <div class="tire-size-new">${e.tire.size}</div>
                        <div class="tire-details-grid-new">
                            <div class="tire-detail-item-new">
                                <span class="detail-label-new">ID</span>
                                <span class="detail-value-new">${e.tire.customId||e.tire.id}</span>
                            </div>
                            <div class="tire-detail-item-new">
                                <span class="detail-label-new">DOT</span>
                                <span class="detail-value-new">${e.tire.dot||"-"}</span>
                            </div>
                        </div>
                        <div class="tire-km-new ${s}">
                            <span class="km-label">Najazdené km</span>
                            <span class="km-value">${R(t)}</span>
                        </div>
                    </div>
                `:`
                    <div class="empty-slot" onclick="openAssignModal('${e.id}')">
                        <div class="empty-slot-icon">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19z" stroke-dasharray="2 2"/>
                                <path d="M12 8v8m-4-4h8"/>
                            </svg>
                        </div>
                        <div class="empty-slot-text">Priradiť pneumatiku</div>
                    </div>
                `}
            </div>
            <div class="tire-slot-footer">
            ${e.tire?`
                <button class="slot-btn-new remove-btn-new" onclick="removeTire('${e.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    <span>Odobrať</span>
                </button>
            `:""}
            </div>
        </div>
    `}function R(e){return e.toLocaleString("sk-SK")}function $(){p.classList.remove("active")}function x(){K.classList.remove("active"),I=null}async function U(e){const n=a.findIndex(s=>s.id===I),t=a[n];if(n!==-1&&t.tire)try{const s=t.tire.id;let o="available";if(e==="Predaj"?o="forSale":e==="Vyhodne"&&(o="disposed"),s){const l=c.kilometers||0,r=t.tire.km||0,i=t.tire.kmOnAssign!==void 0?t.tire.kmOnAssign:l,d=l-i,u=r+(d>0?d:0);await m.updateTire(s,{status:o,km:u})}a[n].tire=null,await m.updateTireSlots("truck",g,a),x()}catch(s){console.error("Error removing tire:",s),alert("Chyba pri odoberaní pneumatiky. Skúste to znova.")}}O.addEventListener("click",x);j.forEach(e=>{e.addEventListener("click",()=>{const n=e.dataset.location;U(n)})});function Z(e){return e&&e.length===7?`${e.slice(0,2)} ${e.slice(2,5)} ${e.slice(5,7)}`:e}function k(){if(c){if(L.textContent=Z(c.licensePlate),c.kilometers!==void 0){const e=document.getElementById("truckKm");e&&(e.textContent=`${c.kilometers.toLocaleString("sk-SK")} km`)}y()}}function y(){const e=a.filter(s=>s.tire).length,n=a.length,t=e===n;D.textContent=`${e}/${n} Priradené`,w.textContent=t?"Úplné":"Neúplné",w.className=`status-badge ${t?"complete":"incomplete"}`}p.addEventListener("click",e=>{e.target===p&&$()});function H(){const e=document.querySelectorAll(".tire-slot-card");let n=null,t=null,s=null,o=!1;e.forEach(l=>{l.addEventListener("dragstart",r=>{r.target.closest(".assigned-tire-new")?(n=r.target.closest(".tire-slot-card"),setTimeout(()=>{n&&(n.style.opacity="0.5")},0)):r.preventDefault()}),l.addEventListener("dragend",()=>{n&&(n.style.opacity="1",n=null)}),l.addEventListener("dragover",r=>{r.preventDefault();const i=r.target.closest(".tire-slot-card");i&&i!==n&&i.classList.add("drag-over")}),l.addEventListener("dragleave",r=>{const i=r.target.closest(".tire-slot-card");i&&i.classList.remove("drag-over")}),l.addEventListener("drop",async r=>{r.preventDefault();const i=r.target.closest(".tire-slot-card");if(n&&i){i.classList.remove("drag-over");const d=n.dataset.slotId,u=i.dataset.slotId;d!==u&&await S(d,u)}}),l.addEventListener("touchstart",r=>{r.target.closest(".assigned-tire-new")&&(s=setTimeout(()=>{o=!0,t=r.target.closest(".tire-slot-card"),t.style.opacity="0.5"},300))}),l.addEventListener("touchmove",r=>{var i;if(o){r.preventDefault();const d=r.touches[0],u=(i=document.elementFromPoint(d.clientX,d.clientY))==null?void 0:i.closest(".tire-slot-card");e.forEach(v=>v.classList.remove("drag-over")),u&&u!==t&&u.classList.add("drag-over")}else clearTimeout(s)}),l.addEventListener("touchend",async r=>{var i;if(clearTimeout(s),o&&t){t.style.opacity="1";const d=r.changedTouches[0],u=(i=document.elementFromPoint(d.clientX,d.clientY))==null?void 0:i.closest(".tire-slot-card");if(e.forEach(v=>v.classList.remove("drag-over")),u){const v=t.dataset.slotId,h=u.dataset.slotId;v!==h&&await S(v,h)}}o=!1,t=null}),l.addEventListener("touchcancel",()=>{clearTimeout(s),t&&(t.style.opacity="1"),o=!1,t=null})})}async function S(e,n){const t=a.findIndex(o=>o.id===e),s=a.findIndex(o=>o.id===n);if(t!==-1&&s!==-1){const o=a[t].tire,l=a[s].tire;a[t].tire=l,a[s].tire=o;try{await m.updateTireSlots("truck",g,a)}catch(r){console.error("Error swapping tires:",r),a[t].tire=o,a[s].tire=l,f()}}}
