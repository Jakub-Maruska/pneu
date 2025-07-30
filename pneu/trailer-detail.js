// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Get trailer ID from URL
const urlParams = new URLSearchParams(window.location.search)
const trailerId = urlParams.get("id")

// Global variables
let tires = []
let trailer = null
let trailerSlots = [
  { id: "left-front", position: "Ľavé predné", tire: null },
  { id: "left-middle", position: "Ľavé stredné", tire: null },
  { id: "left-rear", position: "Ľavé zadné", tire: null },
  { id: "right-front", position: "Pravé predné", tire: null },
  { id: "right-middle", position: "Pravé stredné", tire: null },
  { id: "right-rear", position: "Pravé zadné", tire: null },
]

// Load data from database
async function loadData() {
  try {
    // Load trailer data
    const trailers = await DatabaseService.getTrailers()
    trailer = trailers.find(t => t.id === trailerId)
    
    if (!trailer) {
      window.location.href = "trailer.html"
      return
    }
    
    // Update trailer plate display
    trailerPlate.textContent = trailer.licensePlate
    
    // Load tires
    tires = await DatabaseService.getTires()
    
    // Load trailer slots
    await loadTireSlots()
    
    renderSlots()
    updateStatus()
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

async function loadTireSlots() {
  try {
    const savedSlots = await DatabaseService.getTireSlots('trailer', trailerId)
    if (savedSlots.length > 0) {
      trailerSlots = savedSlots
    }
  } catch (error) {
    console.error('Error loading tire slots:', error)
  }
}

let currentSlot = null

// DOM elements
const trailerPlate = document.getElementById("trailerPlate")
const assignedStatus = document.getElementById("assignedStatus")
const completionBadge = document.getElementById("completionBadge")
const trailerTires = document.getElementById("trailerTires")
const assignModal = document.getElementById("assignModal")
const closeAssignModal = document.getElementById("closeAssignModal")
const assignModalTitle = document.getElementById("assignModalTitle")
const tireSelection = document.getElementById("tireSelection")

// Initialize
document.addEventListener("DOMContentLoaded", async () => {
  await loadData()
  
  // Set up real-time listeners
  DatabaseService.onTiresUpdate((updatedTires) => {
    tires = updatedTires
  })
  
  // Set up real-time listener for trailer updates
  DatabaseService.onTrailersUpdate((updatedTrailers) => {
    const updatedTrailer = updatedTrailers.find(t => t.id === trailerId)
    if (updatedTrailer) {
      trailer = updatedTrailer
      updateTrailerDisplay()
    }
  })
  
  // Set up real-time listener for tire slots updates
  DatabaseService.onTireSlotsUpdate('trailer', trailerId, (updatedSlots) => {
    if (updatedSlots.length > 0) {
      trailerSlots = updatedSlots
      renderSlots()
      updateStatus()
    }
  })
})

// Event listeners
closeAssignModal.addEventListener("click", () => closeAssignModalHandler())

function renderSlots() {
  trailerTires.innerHTML = trailerSlots.map((slot) => createSlotCard(slot)).join("")
}

function createSlotCard(slot) {
  return `
        <div class="tire-slot-card">
            <h3>${slot.position}</h3>
            <div class="tire-slot-content">
                ${
                  slot.tire
                    ? `
                    <div class="assigned-tire">
                        <p class="tire-brand">${slot.tire.brand} ${slot.tire.type}</p>
                        <p class="tire-size">${slot.tire.size}</p>
                        <p class="tire-id">ID: ${slot.tire.customId || slot.tire.id}</p>
                        <p class="tire-id">DOT: ${slot.tire.dot || '-'}</p>
                        <p class="tire-id">Najazdené km: ${formatKm(slot.tire.km ?? 0)}</p>
                    </div>
                `
                    : `
                    <div class="empty-slot">
                        <div class="empty-slot-text">Prázdny slot</div>
                    </div>
                `
                }
            </div>
            ${
              slot.tire
                ? `
                <button class="slot-btn remove-btn" onclick="removeTire('${slot.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    Odobrať
                </button>
            `
                : `
                <button class="slot-btn assign-btn" onclick="openAssignModal('${slot.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Priradiť
                </button>
            `
            }
        </div>
    `
}

function formatKm(km) {
  return km.toLocaleString('sk-SK')
}

function openAssignModal(slotId) {
  currentSlot = slotId
  const slot = trailerSlots.find((s) => s.id === slotId)
  assignModalTitle.textContent = `Priradiť pneumatiku k ${slot.position}`

  const availableTires = tires.filter((t) => t.status === "available")
  tireSelection.innerHTML = availableTires
    .map(
      (tire) => `
        <div class="tire-option" onclick="assignTire('${slotId}', '${tire.id}')">
            <div class="tire-option-header">${tire.brand} ${tire.type}</div>
            <div class="tire-option-details">${tire.size} - ID: ${tire.customId || tire.id}</div>
            <div class="tire-option-details">DOT: ${tire.dot || '-'}, Najazdené km: ${formatKm(tire.km ?? 0)}</div>
        </div>
    `,
    )
    .join("")

  if (availableTires.length === 0) {
    tireSelection.innerHTML =
      '<p style="text-align: center; color: #6b7280; padding: 2rem;">Žiadne dostupné pneumatiky v sklade</p>'
  }

  assignModal.classList.add("active")
}

function closeAssignModalHandler() {
  assignModal.classList.remove("active")
  currentSlot = null
}

async function assignTire(slotId, tireId) {
  const tire = tires.find((t) => t.id === tireId)
  const slotIndex = trailerSlots.findIndex((s) => s.id === slotId)

  if (tire && slotIndex !== -1) {
    try {
      // Update tire status
      await DatabaseService.updateTire(tire.id, { status: "assigned" })

      // Assign tire to slot
      trailerSlots[slotIndex].tire = tire

      // Save slots to database
      await DatabaseService.updateTireSlots('trailer', trailerId, trailerSlots)

      // Reload tire slots to get updated data
      await loadTireSlots()

      // Re-render
      renderSlots()
      updateStatus()
      closeAssignModalHandler()
    } catch (error) {
      console.error('Error assigning tire:', error)
      alert('Chyba pri priraďovaní pneumatiky. Skúste to znova.')
    }
  }
}

async function removeTire(slotId) {
  const slotIndex = trailerSlots.findIndex((s) => s.id === slotId)

  if (slotIndex !== -1 && trailerSlots[slotIndex].tire) {
    try {
      // Update tire status back to available
      const tire = tires.find((t) => t.id === trailerSlots[slotIndex].tire.id)
      if (tire) {
        await DatabaseService.updateTire(tire.id, { status: "available" })
      }

      // Remove tire from slot
      trailerSlots[slotIndex].tire = null

      // Save slots to database
      await DatabaseService.updateTireSlots('trailer', trailerId, trailerSlots)

      // Reload tire slots to get updated data
      await loadTireSlots()

      // Re-render
      renderSlots()
      updateStatus()
    } catch (error) {
      console.error('Error removing tire:', error)
      alert('Chyba pri odoberaní pneumatiky. Skúste to znova.')
    }
  }
}

function updateTrailerDisplay() {
  if (trailer) {
    trailerPlate.textContent = trailer.licensePlate
    updateStatus()
  }
}

function updateStatus() {
  const assignedCount = trailerSlots.filter((slot) => slot.tire).length
  const totalSlots = trailerSlots.length
  const isComplete = assignedCount === totalSlots

  assignedStatus.textContent = `${assignedCount}/${totalSlots} Priradené`
  completionBadge.textContent = isComplete ? "Úplné" : "Neúplné"
  completionBadge.className = `status-badge ${isComplete ? "complete" : "incomplete"}`
}

// Close modal when clicking outside
assignModal.addEventListener("click", (e) => {
  if (e.target === assignModal) {
    closeAssignModalHandler()
  }
})
