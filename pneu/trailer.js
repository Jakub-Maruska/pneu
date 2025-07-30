// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Global trailers array
let trailers = []

// DOM elements
let trailerGrid, goodCount, warningCount, dangerCount

// Load trailers from database
async function loadTrailers() {
  try {
    trailers = await DatabaseService.getTrailers()
    
    // Pre každý príves načítam sloty a vypočítam aktuálny počet pneumatík a status
    for (let trailer of trailers) {
      try {
        const slots = await DatabaseService.getTireSlots('trailer', trailer.id)
        const assignedCount = slots.filter(slot => slot.tire).length
        const totalSlots = slots.length
        
        // Aktualizujem trailer objekt s aktuálnymi hodnotami
        trailer.tiresAssigned = assignedCount
        trailer.totalTires = totalSlots
        
        // Vypočítam status podľa kilometrov pneumatík
        trailer.status = calculateVehicleStatus(slots)
      } catch (error) {
        console.error(`Error loading slots for trailer ${trailer.id}:`, error)
        trailer.tiresAssigned = 0
        trailer.totalTires = 6 // Predvolený počet slotov
        trailer.status = 'good' // Predvolený status
      }
    }
    
    renderTrailers()
    updateStats()
  } catch (error) {
    console.error('Error loading trailers:', error)
    // Fallback to empty array
    trailers = []
  }
}

// Calculate vehicle status based on tire kilometers
function calculateVehicleStatus(vehicleSlots) {
  const assignedTires = vehicleSlots.filter(slot => slot.tire && slot.tire.km !== undefined);
  
  if (assignedTires.length === 0) {
    return 'good'; // No tires assigned, consider as good
  }
  
  const maxKm = Math.max(...assignedTires.map(tire => tire.tire.km || 0));
  
  if (maxKm < 150000) {
    return 'good';
  } else if (maxKm < 200000) {
    return 'warning';
  } else {
    return 'danger';
  }
}

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  // Initialize DOM elements
  trailerGrid = document.getElementById("trailerGrid")
  goodCount = document.getElementById("goodCount")
  warningCount = document.getElementById("warningCount")
  dangerCount = document.getElementById("dangerCount")
  
  await loadTrailers()
  
  // Set up real-time listener for trailer updates
  DatabaseService.onTrailersUpdate(async (updatedTrailers) => {
    trailers = updatedTrailers
    
    // Pre každý príves načítam sloty a vypočítam aktuálny počet pneumatík a status
    for (let trailer of trailers) {
      try {
        const slots = await DatabaseService.getTireSlots('trailer', trailer.id)
        const assignedCount = slots.filter(slot => slot.tire).length
        const totalSlots = slots.length
        
        // Aktualizujem trailer objekt s aktuálnymi hodnotami
        trailer.tiresAssigned = assignedCount
        trailer.totalTires = totalSlots
        
        // Vypočítam status podľa kilometrov pneumatík
        trailer.status = calculateVehicleStatus(slots)
      } catch (error) {
        console.error(`Error loading slots for trailer ${trailer.id}:`, error)
        trailer.tiresAssigned = 0
        trailer.totalTires = 6 // Predvolený počet slotov
        trailer.status = 'good' // Predvolený status
      }
    }
    
    renderTrailers()
    updateStats()
  })
})

function renderTrailers() {
  trailerGrid.innerHTML = trailers.map((trailer) => createTrailerCard(trailer)).join("")
}

function updateStats() {
  const good = trailers.filter(t => t.status === 'good').length
  const warning = trailers.filter(t => t.status === 'warning').length
  const danger = trailers.filter(t => t.status === 'danger').length

  console.log('Updating trailer stats:', { good, warning, danger, total: trailers.length })
  console.log('Trailer statuses:', trailers.map(t => ({ id: t.id, status: t.status })))

  goodCount.textContent = `${good} V poriadku`
  warningCount.textContent = `${warning} Pozor`
  dangerCount.textContent = `${danger} Kritické`
}

function getStatusText(status) {
  switch(status) {
    case 'good': return 'V poriadku';
    case 'warning': return 'Pozor';
    case 'danger': return 'Kritické';
    default: return 'V poriadku';
  }
}

function createTrailerCard(trailer) {
  const percentage = Math.round((trailer.tiresAssigned / trailer.totalTires) * 100)
  const isComplete = trailer.tiresAssigned === trailer.totalTires

  return `
        <div class="vehicle-card" onclick="window.location.href='trailer-detail.html?id=${trailer.id}'">
            <div class="vehicle-card-content">
                <div class="vehicle-info">
                    <div class="vehicle-icon ${trailer.status || 'good'}">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M14 18V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v11a1 1 0 0 0 1 1h2"/>
                            <path d="M15 18H9"/>
                            <path d="M19 18h2a1 1 0 0 0 1-1v-3.65a1 1 0 0 0-.22-.624l-3.48-4.35A1 1 0 0 0 17.52 8H14"/>
                            <circle cx="17" cy="18" r="2"/>
                            <circle cx="7" cy="18" r="2"/>
                        </svg>
                    </div>
                    <div class="vehicle-details">
                        <h3>${trailer.licensePlate}</h3>
                        <div class="vehicle-meta">
                            <span>${trailer.tiresAssigned}/${trailer.totalTires} pneumatík</span>
                        </div>
                    </div>
                </div>
                <div class="vehicle-status">
                    <div class="status-icon ${isComplete ? "complete" : "incomplete"}">
                        ${
                          isComplete
                            ? '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>'
                            : '<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v6m0 6v6m11-7h-6m-6 0H1"/></svg>'
                        }
                    </div>
                </div>
            </div>
            <div class="progress-bar">
                <div class="progress-info">
                    <span>Stav pneumatík</span>
                    <span>${percentage}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${isComplete ? "complete" : "incomplete"}" style="width: ${percentage}%"></div>
                </div>
            </div>
        </div>
    `
}
