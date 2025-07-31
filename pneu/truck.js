// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Global trucks array
let trucks = []

// DOM elements
let truckGrid, goodCount, warningCount, dangerCount

// Load trucks from database
async function loadTrucks() {
  try {
    trucks = await DatabaseService.getTrucks()
    
    // Pre každé auto načítam sloty a vypočítam aktuálny počet pneumatík a status
    for (let truck of trucks) {
      try {
        const slots = await DatabaseService.getTireSlots('truck', truck.id)
        const assignedCount = slots.filter(slot => slot.tire).length
        const totalSlots = slots.length
        
        // Aktualizujem truck objekt s aktuálnymi hodnotami
        truck.tiresAssigned = assignedCount
        truck.totalTires = totalSlots
        
        // Vypočítam status podľa kilometrov pneumatík
        truck.status = calculateVehicleStatus(slots)
      } catch (error) {
        console.error(`Error loading slots for truck ${truck.id}:`, error)
        truck.tiresAssigned = 0
        truck.totalTires = 6 // Predvolený počet slotov
        truck.status = 'good' // Predvolený status
      }
    }
    
    renderTrucks()
    updateStats()
  } catch (error) {
    console.error('Error loading trucks:', error)
    // Fallback to empty array
    trucks = []
  }
}

// Calculate vehicle status based on tire kilometers
function calculateVehicleStatus(vehicleSlots) {
  const assignedTires = vehicleSlots.filter(slot => slot.tire && slot.tire.km !== undefined);
  
  if (assignedTires.length === 0) {
    return 'unknown'; // No tires assigned, status is unknown
  }
  
  // Check if any tire has over 200,000 km (critical)
  const hasCriticalTire = assignedTires.some(tire => (tire.tire.km || 0) >= 200000);
  if (hasCriticalTire) {
    return 'danger';
  }
  
  // Check if any tire has between 150,000-200,000 km (warning)
  const hasWarningTire = assignedTires.some(tire => {
    const km = tire.tire.km || 0;
    return km >= 150000 && km < 200000;
  });
  if (hasWarningTire) {
    return 'warning';
  }
  
  // All tires are under 150,000 km (good)
  return 'good';
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize DOM elements
  truckGrid = document.getElementById("truckGrid")
  goodCount = document.getElementById("goodCount")
  warningCount = document.getElementById("warningCount")
  dangerCount = document.getElementById("dangerCount")
  
  await loadTrucks()
  
  // Set up real-time listener for truck updates
  DatabaseService.onTrucksUpdate(async (updatedTrucks) => {
    trucks = updatedTrucks
    
    // Pre každé auto načítam sloty a vypočítam aktuálny počet pneumatík a status
    for (let truck of trucks) {
      try {
        const slots = await DatabaseService.getTireSlots('truck', truck.id)
        const assignedCount = slots.filter(slot => slot.tire).length
        const totalSlots = slots.length
        
        // Aktualizujem truck objekt s aktuálnymi hodnotami
        truck.tiresAssigned = assignedCount
        truck.totalTires = totalSlots
        
        // Vypočítam status podľa kilometrov pneumatík
        truck.status = calculateVehicleStatus(slots)
      } catch (error) {
        console.error(`Error loading slots for truck ${truck.id}:`, error)
        truck.tiresAssigned = 0
        truck.totalTires = 6 // Predvolený počet slotov
        truck.status = 'good' // Predvolený status
      }
    }
    
    renderTrucks()
    updateStats()
  })
})

function renderTrucks() {
  truckGrid.innerHTML = trucks.map((truck) => createTruckCard(truck)).join("")
}

function updateStats() {
  const good = trucks.filter(t => t.status === 'good').length
  const warning = trucks.filter(t => t.status === 'warning').length
  const danger = trucks.filter(t => t.status === 'danger').length

  console.log('Updating truck stats:', { good, warning, danger, total: trucks.length })
  console.log('Truck statuses:', trucks.map(t => ({ id: t.id, status: t.status })))

  goodCount.textContent = `${good} Dobrý`
  warningCount.textContent = `${warning} Pozor`
  dangerCount.textContent = `${danger} Kritické`
}

function getStatusText(status) {
  switch(status) {
    case 'good': return 'Dobrý';
    case 'warning': return 'Pozor';
    case 'danger': return 'Kritické';
    case 'unknown': return 'Neznáme';
    default: return 'Neznáme';
  }
}

function createTruckCard(truck) {
  const percentage = Math.round((truck.tiresAssigned / truck.totalTires) * 100)

  return `
        <div class="vehicle-card" onclick="window.location.href='truck-detail.html?id=${truck.id}'">
            <div class="vehicle-card-content">
                <div class="vehicle-info">
                    <div class="vehicle-icon ${truck.status || 'good'}">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                            <path d="M15 18H9"/>
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                            <circle cx="17" cy="18" r="2"/>
                            <circle cx="7" cy="18" r="2"/>
                        </svg>
                    </div>
                    <div class="vehicle-details">
                        <h3>${truck.licensePlate}</h3>
                        <div class="vehicle-meta">
                            <span>${truck.tiresAssigned}/${truck.totalTires} pneumatík</span>
                        </div>
                    </div>
                </div>
                <div class="vehicle-status">
                    <div class="status-icon ${truck.status || 'unknown'}">
                        ${
                          truck.status === 'good'
                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1-1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
                            : truck.status === 'warning'
                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="8" x2="12" y2="13"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>'
                            : truck.status === 'danger'
                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>'
                            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>'
                        }
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-info">
                    <span>Stav pneumatík</span>
                    <span>${getStatusText(truck.status)}</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${truck.status || 'unknown'}" style="width: 100%"></div>
                </div>
            </div>
        </div>
    `
}
