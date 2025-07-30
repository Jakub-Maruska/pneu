// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Get truck ID from URL
const urlParams = new URLSearchParams(window.location.search)
const truckId = urlParams.get("id")

// Global variables
let tires = []
let truck = null
let truckSlots = [
  { id: "front-left", position: "Predné ľavé", category: "front", tire: null },
  { id: "front-right", position: "Predné pravé", category: "front", tire: null },
  { id: "rear-left-outer", position: "Zadné ľavé vonkajšie", category: "rear", tire: null },
  { id: "rear-left-inner", position: "Zadné ľavé vnútorné", category: "rear", tire: null },
  { id: "rear-right-outer", position: "Zadné pravé vonkajšie", category: "rear", tire: null },
  { id: "rear-right-inner", position: "Zadné pravé vnútorné", category: "rear", tire: null },
]

// Load data from database
async function loadData() {
  try {
    // Load truck data
    const trucks = await DatabaseService.getTrucks()
    truck = trucks.find(t => t.id === truckId)
    
    if (!truck) {
      window.location.href = "truck.html"
      return
    }
    
    // Update truck plate display
    truckPlate.textContent = truck.licensePlate
    
    // Load tires
    tires = await DatabaseService.getTires()
    
    // Load truck slots
    await loadTireSlots()
    
    renderSlots()
    updateStatus()
  } catch (error) {
    console.error('Error loading data:', error)
  }
}

async function loadTireSlots() {
  try {
    const savedSlots = await DatabaseService.getTireSlots('truck', truckId)
    if (savedSlots.length > 0) {
      truckSlots = savedSlots
    }
  } catch (error) {
    console.error('Error loading tire slots:', error)
  }
}

let currentSlot = null

// DOM elements
const truckPlate = document.getElementById("truckPlate")
const assignedStatus = document.getElementById("assignedStatus")
const completionBadge = document.getElementById("completionBadge")
const frontTires = document.getElementById("frontTires")
const rearTires = document.getElementById("rearTires")
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
  
  // Set up real-time listener for truck updates
  DatabaseService.onTrucksUpdate((updatedTrucks) => {
    const updatedTruck = updatedTrucks.find(t => t.id === truckId)
    if (updatedTruck) {
      truck = updatedTruck
      updateTruckDisplay()
    }
  })
  
  // Set up real-time listener for tire slots updates
  DatabaseService.onTireSlotsUpdate('truck', truckId, (updatedSlots) => {
    if (updatedSlots.length > 0) {
      truckSlots = updatedSlots
      renderSlots()
      updateStatus()
    }
  })
})

// Event listeners
closeAssignModal.addEventListener("click", () => closeAssignModalHandler())

function renderSlots() {
  const frontSlots = truckSlots.filter((slot) => slot.category === "front")
  const rearSlots = truckSlots.filter((slot) => slot.category === "rear")

  frontTires.innerHTML = frontSlots.map((slot) => createSlotCard(slot)).join("")
  rearTires.innerHTML = rearSlots.map((slot) => createSlotCard(slot)).join("")
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
  const slot = truckSlots.find((s) => s.id === slotId)
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
  const slotIndex = truckSlots.findIndex((s) => s.id === slotId)

  if (tire && slotIndex !== -1) {
    try {
      // Update tire status
      await DatabaseService.updateTire(tire.id, { status: "assigned" })

      // Assign tire to slot
      truckSlots[slotIndex].tire = tire

      // Save slots to database
      await DatabaseService.updateTireSlots('truck', truckId, truckSlots)

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
  const slotIndex = truckSlots.findIndex((s) => s.id === slotId)

  if (slotIndex !== -1 && truckSlots[slotIndex].tire) {
    try {
      // Update tire status back to available
      const tire = tires.find((t) => t.id === truckSlots[slotIndex].tire.id)
      if (tire) {
        await DatabaseService.updateTire(tire.id, { status: "available" })
      }

      // Remove tire from slot
      truckSlots[slotIndex].tire = null

      // Save slots to database
      await DatabaseService.updateTireSlots('truck', truckId, truckSlots)

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

function updateTruckDisplay() {
  if (truck) {
    truckPlate.textContent = truck.licensePlate
    updateStatus()
  }
}

function updateStatus() {
  const assignedCount = truckSlots.filter((slot) => slot.tire).length
  const totalSlots = truckSlots.length
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
