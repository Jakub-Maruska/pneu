// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "../index.html"
}

// Get trailer ID from URL
const urlParams = new URLSearchParams(window.location.search)
const trailerId = urlParams.get("id")

// Mock data
const trailers = {
  1: { licensePlate: "ZC375YC" },
  2: { licensePlate: "TR892KL" },
  3: { licensePlate: "HJ456NM" },
}

// Load tires from localStorage
const tires = JSON.parse(localStorage.getItem("tires") || "[]")

// Tire slots for this trailer
const trailerSlots = JSON.parse(
  localStorage.getItem(`trailer_${trailerId}_slots`) ||
    JSON.stringify([
      { id: "left-front", position: "Left Front", tire: null },
      { id: "left-middle", position: "Left Middle", tire: null },
      { id: "left-rear", position: "Left Rear", tire: null },
      { id: "right-front", position: "Right Front", tire: null },
      { id: "right-middle", position: "Right Middle", tire: null },
      { id: "right-rear", position: "Right Rear", tire: null },
    ]),
)

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
document.addEventListener("DOMContentLoaded", () => {
  if (trailers[trailerId]) {
    trailerPlate.textContent = trailers[trailerId].licensePlate
    renderSlots()
    updateStatus()
  } else {
    window.location.href = "trailer.html"
  }
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
                        <p class="tire-id">${slot.tire.id}</p>
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
  const slot = trailerSlots.find((s) => s.id === slotId)
  assignModalTitle.textContent = `Assign Tire to ${slot.position}`

  const availableTires = tires.filter((t) => t.status === "available")
  tireSelection.innerHTML = availableTires
    .map(
      (tire) => `
        <div class="tire-option" onclick="assignTire('${slotId}', '${tire.id}')">
            <div class="tire-option-header">${tire.brand} ${tire.type}</div>
            <div class="tire-option-details">${tire.size} - ${tire.id}</div>
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
  const slotIndex = trailerSlots.findIndex((s) => s.id === slotId)

  if (tire && slotIndex !== -1) {
    // Update tire status
    tire.status = "assigned"

    // Assign tire to slot
    trailerSlots[slotIndex].tire = tire

    // Save data
    localStorage.setItem("tires", JSON.stringify(tires))
    localStorage.setItem(`trailer_${trailerId}_slots`, JSON.stringify(trailerSlots))

    // Re-render
    renderSlots()
    updateStatus()
    closeAssignModalHandler()
  }
}

function removeTire(slotId) {
  const slotIndex = trailerSlots.findIndex((s) => s.id === slotId)

  if (slotIndex !== -1 && trailerSlots[slotIndex].tire) {
    // Update tire status back to available
    const tire = tires.find((t) => t.id === trailerSlots[slotIndex].tire.id)
    if (tire) {
      tire.status = "available"
    }

    // Remove tire from slot
    trailerSlots[slotIndex].tire = null

    // Save data
    localStorage.setItem("tires", JSON.stringify(tires))
    localStorage.setItem(`trailer_${trailerId}_slots`, JSON.stringify(trailerSlots))

    // Re-render
    renderSlots()
    updateStatus()
  }
}

function updateStatus() {
  const assignedCount = trailerSlots.filter((slot) => slot.tire).length
  const totalSlots = trailerSlots.length
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
