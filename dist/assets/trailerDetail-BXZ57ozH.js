import{D as u}from"./firebase-config-Cu0ruEyn.js";localStorage.getItem("isLoggedIn")!=="true"&&(window.location.href="../index.html");const x=new URLSearchParams(window.location.search),g=x.get("id");let T=[],d=null,o=[{id:"left-front",position:"Ľavé predné",tire:null},{id:"left-middle",position:"Ľavé stredné",tire:null},{id:"left-rear",position:"Ľavé zadné",tire:null},{id:"right-front",position:"Pravé predné",tire:null},{id:"right-middle",position:"Pravé stredné",tire:null},{id:"right-rear",position:"Pravé zadné",tire:null}];async function C(){try{if(d=(await u.getTrailers()).find(t=>t.id===g),!d){window.location.href="trailer.html";return}I.textContent=d.licensePlate;const i=await u.getVehicleKm(g);i!==null&&(d.kilometers=i),h(),T=await u.getTires(),await B(),f(),y()}catch(e){console.error("Error loading data:",e)}}async function B(){try{const e=await u.getTireSlots("trailer",g);e.length>0&&(o=e)}catch(e){console.error("Error loading tire slots:",e)}}let E=null;const I=document.getElementById("trailerPlate"),b=document.getElementById("assignedStatus"),k=document.getElementById("completionBadge"),P=document.getElementById("trailerTires"),p=document.getElementById("assignModal"),D=document.getElementById("closeAssignModal");document.getElementById("assignModalTitle");document.getElementById("tireSelection");const A=document.getElementById("removeTireModal"),M=document.getElementById("cancelRemoveTire"),K=document.querySelectorAll(".storage-option-btn");document.addEventListener("DOMContentLoaded",async()=>{await C(),u.onTiresUpdate(e=>{T=e}),u.onTrailersUpdate(e=>{const i=e.find(t=>t.id===g);i&&(d=i,h())}),u.onTireSlotsUpdate("trailer",g,e=>{e.length>0&&(o=e,f(),y())}),u.onVehicleKmUpdate(g,e=>{e!==null&&d&&(d.kilometers=e,h(),f())})});D.addEventListener("click",()=>L());function f(){P.innerHTML=o.map(e=>z(e)).join(""),N()}function O(e){return e>2e5?"status-red":e>=15e4?"status-orange":"status-green"}function z(e){const i=!!e.tire;let t=0;if(i&&d){const a=d.kilometers||0,l=e.tire.km||0,n=e.tire.kmOnAssign!==void 0?e.tire.kmOnAssign:a,r=a-n;t=l+(r>0?r:0)}const s=O(t);return`
        <div class="tire-slot-card" data-slot-id="${e.id}">
            <div class="tire-slot-header">
                <h3>${e.position}</h3>
            </div>
            <div class="tire-slot-content">
                ${i?`
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
    `}function R(e){return e.toLocaleString("sk-SK")}function L(){p.classList.remove("active")}function $(){A.classList.remove("active"),E=null}async function U(e){const i=o.findIndex(s=>s.id===E),t=o[i];if(i!==-1&&t.tire)try{const s=t.tire.id;let a="available";if(e==="Predaj"?a="forSale":e==="Vyhodne"&&(a="disposed"),s){const l=d.kilometers||0,n=t.tire.km||0,r=t.tire.kmOnAssign!==void 0?t.tire.kmOnAssign:l,c=l-r,m=n+(c>0?c:0);await u.updateTire(s,{status:a,km:m})}o[i].tire=null,await u.updateTireSlots("trailer",g,o),$()}catch(s){console.error("Error removing tire:",s),alert("Chyba pri odoberaní pneumatiky. Skúste to znova.")}}M.addEventListener("click",$);K.forEach(e=>{e.addEventListener("click",()=>{const i=e.dataset.location;U(i)})});function j(e){return e&&e.length===7?`${e.slice(0,2)} ${e.slice(2,5)} ${e.slice(5,7)}`:e}function h(){if(d){if(I.textContent=j(d.licensePlate),d.kilometers!==void 0){const e=document.getElementById("trailerKm");e&&(e.textContent=`${d.kilometers.toLocaleString("sk-SK")} km`)}y()}}function y(){const e=o.filter(s=>s.tire).length,i=o.length,t=e===i;b.textContent=`${e}/${i} Priradené`,k.textContent=t?"Úplné":"Neúplné",k.className=`status-badge ${t?"complete":"incomplete"}`}p.addEventListener("click",e=>{e.target===p&&L()});function N(){const e=document.querySelectorAll(".tire-slot-card");let i=null,t=null,s=null,a=!1;e.forEach(l=>{l.addEventListener("dragstart",n=>{n.target.closest(".assigned-tire-new")?(i=n.target.closest(".tire-slot-card"),setTimeout(()=>{i&&(i.style.opacity="0.5")},0)):n.preventDefault()}),l.addEventListener("dragend",()=>{i&&(i.style.opacity="1",i=null)}),l.addEventListener("dragover",n=>{n.preventDefault();const r=n.target.closest(".tire-slot-card");r&&r!==i&&r.classList.add("drag-over")}),l.addEventListener("dragleave",n=>{const r=n.target.closest(".tire-slot-card");r&&r.classList.remove("drag-over")}),l.addEventListener("drop",async n=>{n.preventDefault();const r=n.target.closest(".tire-slot-card");if(i&&r){r.classList.remove("drag-over");const c=i.dataset.slotId,m=r.dataset.slotId;c!==m&&await S(c,m)}}),l.addEventListener("touchstart",n=>{n.target.closest(".assigned-tire-new")&&(s=setTimeout(()=>{a=!0,t=n.target.closest(".tire-slot-card"),t.style.opacity="0.5"},300))}),l.addEventListener("touchmove",n=>{var r;if(a){n.preventDefault();const c=n.touches[0],m=(r=document.elementFromPoint(c.clientX,c.clientY))==null?void 0:r.closest(".tire-slot-card");e.forEach(v=>v.classList.remove("drag-over")),m&&m!==t&&m.classList.add("drag-over")}else clearTimeout(s)}),l.addEventListener("touchend",async n=>{var r;if(clearTimeout(s),a&&t){t.style.opacity="1";const c=n.changedTouches[0],m=(r=document.elementFromPoint(c.clientX,c.clientY))==null?void 0:r.closest(".tire-slot-card");if(e.forEach(v=>v.classList.remove("drag-over")),m){const v=t.dataset.slotId,w=m.dataset.slotId;v!==w&&await S(v,w)}}a=!1,t=null}),l.addEventListener("touchcancel",()=>{clearTimeout(s),t&&(t.style.opacity="1"),a=!1,t=null})})}async function S(e,i){const t=o.findIndex(a=>a.id===e),s=o.findIndex(a=>a.id===i);if(t!==-1&&s!==-1){const a=o[t].tire,l=o[s].tire;o[t].tire=l,o[s].tire=a;try{await u.updateTireSlots("trailer",g,o)}catch(n){console.error("Error swapping tires:",n),o[t].tire=a,o[s].tire=l,f()}}}
