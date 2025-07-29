// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Get truck ID from URL
const urlParams = new URLSearchParams(window.location.search)
const truckId = urlParams.get("id")

// Mock data
const trucks = {
  1: { licensePlate: "ZC153BL" },
  2: { licensePlate: "AB789CD" },
  3: { licensePlate: "XY456EF" },
  4: { licensePlate: "MN123GH" },
}

// Load tires from localStorage
const tires = JSON.parse(localStorage.getItem("tires") || "[]")

// Tire slots for this truck
const truckSlots = JSON.parse(
  localStorage.getItem(`truck_${truckId}_slots`) ||
    JSON.stringify([
      { id: "front-left", position: "Front Left", category: "front", tire: null },
      { id: "front-right", position: "Front Right", category: "front", tire: null },
      { id: "rear-left-outer", position: "Rear Left Outer", category: "rear", tire: null },
      { id: "rear-left-inner", position: "Rear Left Inner", category: "rear", tire: null },
      { id: "rear-right-outer", position: "Rear Right Outer", category: "rear", tire: null },
      { id: "rear-right-inner", position: "Rear Right Inner", category: "rear", tire: null },
    ]),
)

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
document.addEventListener("DOMContentLoaded", () => {
  if (trucks[truckId]) {
    truckPlate.textContent = trucks[truckId].licensePlate
    renderSlots()
    updateStatus()
  } else {
    window.location.href = "truck.html"
  }
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
                        <p class="tire-id">ID: ${slot.tire.id}</p>
                        <p class="tire-id">DOT: ${slot.tire.dot || '-'}</p>
                        <p class="tire-id">Najazdené km: ${slot.tire.km ?? 0}</p>
                    </div>
                `
                    : `
                    <div class="empty-slot">
                        <div class="empty-slot-text">Empty Slot</div>
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
                    Remove
                </button>
            `
                : `
                <button class="slot-btn assign-btn" onclick="openAssignModal('${slot.id}')">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Assign
                </button>
            `
            }
        </div>
    `
}

function openAssignModal(slotId) {
  currentSlot = slotId
  const slot = truckSlots.find((s) => s.id === slotId)
  assignModalTitle.textContent = `Assign Tire to ${slot.position}`

  const availableTires = tires.filter((t) => t.status === "available")
  tireSelection.innerHTML = availableTires
    .map(
      (tire) => `
        <div class="tire-option" onclick="assignTire('${slotId}', '${tire.id}')">
            <div class="tire-option-header">${tire.brand} ${tire.type}</div>
            <div class="tire-option-details">${tire.size} - ID: ${tire.id}</div>
            <div class="tire-option-details">DOT: ${tire.dot || '-'}, Najazdené km: ${tire.km ?? 0}</div>
        </div>
    `,
    )
    .join("")

  if (availableTires.length === 0) {
    tireSelection.innerHTML =
      '<p style="text-align: center; color: #6b7280; padding: 2rem;">No available tires in storage</p>'
  }

  assignModal.classList.add("active")
}

function closeAssignModalHandler() {
  assignModal.classList.remove("active")
  currentSlot = null
}

function assignTire(slotId, tireId) {
  const tire = tires.find((t) => t.id === tireId)
  const slotIndex = truckSlots.findIndex((s) => s.id === slotId)

  if (tire && slotIndex !== -1) {
    // Update tire status
    tire.status = "assigned"

    // Assign tire to slot
    truckSlots[slotIndex].tire = tire

    // Save data
    localStorage.setItem("tires", JSON.stringify(tires))
    localStorage.setItem(`truck_${truckId}_slots`, JSON.stringify(truckSlots))

    // Re-render
    renderSlots()
    updateStatus()
    closeAssignModalHandler()
  }
}

function removeTire(slotId) {
  const slotIndex = truckSlots.findIndex((s) => s.id === slotId)

  if (slotIndex !== -1 && truckSlots[slotIndex].tire) {
    // Update tire status back to available
    const tire = tires.find((t) => t.id === truckSlots[slotIndex].tire.id)
    if (tire) {
      tire.status = "available"
    }

    // Remove tire from slot
    truckSlots[slotIndex].tire = null

    // Save data
    localStorage.setItem("tires", JSON.stringify(tires))
    localStorage.setItem(`truck_${truckId}_slots`, JSON.stringify(truckSlots))

    // Re-render
    renderSlots()
    updateStatus()
  }
}

function updateStatus() {
  const assignedCount = truckSlots.filter((slot) => slot.tire).length
  const totalSlots = truckSlots.length
  const isComplete = assignedCount === totalSlots

  assignedStatus.textContent = `${assignedCount}/${totalSlots} Assigned`
  completionBadge.textContent = isComplete ? "Complete" : "Incomplete"
  completionBadge.className = `status-badge ${isComplete ? "complete" : "incomplete"}`
}

// Close modal when clicking outside
assignModal.addEventListener("click", (e) => {
  if (e.target === assignModal) {
    closeAssignModalHandler()
  }
})
