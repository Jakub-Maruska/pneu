// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html"
}

// Mock data
let tires = [
  { id: "R2V83292", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available" },
  { id: "B4K92847", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "assigned" },
  { id: "G7H38291", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "available" },
  { id: "K9L47382", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "available" },
  { id: "M3N84729", brand: "Pirelli", type: "TH01", size: "385/55 R22.5", status: "available" },
  { id: "P7Q92847", brand: "Yokohama", type: "104ZR", size: "295/80 R22.5", status: "assigned" },
]

// Load data from localStorage if available
const savedTires = localStorage.getItem("tires")
if (savedTires) {
  tires = JSON.parse(savedTires)
}

let editingTire = null

// DOM elements
const availableTiresContainer = document.getElementById("availableTires")
const assignedTiresContainer = document.getElementById("assignedTires")
const assignedSection = document.getElementById("assignedSection")
const availableCount = document.getElementById("availableCount")
const assignedCount = document.getElementById("assignedCount")
const addTireBtn = document.getElementById("addTireBtn")
const tireModal = document.getElementById("tireModal")
const closeModal = document.getElementById("closeModal")
const tireForm = document.getElementById("tireForm")
const modalTitle = document.getElementById("modalTitle")
const submitText = document.getElementById("submitText")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderTires()
  updateStats()
})

// Event listeners
addTireBtn.addEventListener("click", () => openModal())
closeModal.addEventListener("click", () => closeModalHandler())
tireForm.addEventListener("submit", handleSubmit)

// Modal handlers
function openModal(tire = null) {
  editingTire = tire
  if (tire) {
    modalTitle.textContent = "Edit Tire"
    submitText.textContent = "Update Tire"
    document.getElementById("tireBrand").value = tire.brand
    document.getElementById("tireType").value = tire.type
    document.getElementById("tireSize").value = tire.size
  } else {
    modalTitle.textContent = "Add New Tire"
    submitText.textContent = "Add Tire"
    tireForm.reset()
  }
  tireModal.classList.add("active")
}

function closeModalHandler() {
  tireModal.classList.remove("active")
  editingTire = null
  tireForm.reset()
}

function handleSubmit(e) {
  e.preventDefault()

  const brand = document.getElementById("tireBrand").value
  const type = document.getElementById("tireType").value
  const size = document.getElementById("tireSize").value

  if (editingTire) {
    // Update existing tire
    const index = tires.findIndex((t) => t.id === editingTire.id)
    if (index !== -1) {
      tires[index] = { ...tires[index], brand, type, size }
    }
  } else {
    // Add new tire
    const newTire = {
      id: Math.random().toString(36).substr(2, 9).toUpperCase(),
      brand,
      type,
      size,
      status: "available",
    }
    tires.push(newTire)
  }

  saveTires()
  renderTires()
  updateStats()
  closeModalHandler()
}

function deleteTire(id) {
  if (confirm("Are you sure you want to delete this tire?")) {
    tires = tires.filter((t) => t.id !== id)
    saveTires()
    renderTires()
    updateStats()
  }
}

function renderTires() {
  const availableTires = tires.filter((t) => t.status === "available")
  const assignedTires = tires.filter((t) => t.status === "assigned")

  // Render available tires
  availableTiresContainer.innerHTML = availableTires.map((tire) => createTireCard(tire)).join("")

  // Render assigned tires
  if (assignedTires.length > 0) {
    assignedTiresContainer.innerHTML = assignedTires.map((tire) => createTireCard(tire)).join("")
    assignedSection.style.display = "block"
  } else {
    assignedSection.style.display = "none"
  }
}

function createTireCard(tire) {
  return `
        <div class="tire-card">
            <div class="tire-card-header">
                <div class="tire-info">
                    <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.5rem;">
                        <h3>${tire.brand} ${tire.type}</h3>
                        <span class="status-badge-small ${tire.status === "available" ? "status-available" : "status-assigned"}">
                            ${tire.status}
                        </span>
                    </div>
                    <p>${tire.size}</p>
                    <span class="tire-id">ID: ${tire.id}</span>
                </div>
                <div class="tire-actions">
                    <button class="action-btn edit-btn" onclick="openModal(${JSON.stringify(tire).replace(/"/g, "&quot;")})">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                        </svg>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteTire('${tire.id}')">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3,6 5,6 21,6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            <line x1="10" y1="11" x2="10" y2="17"/>
                            <line x1="14" y1="11" x2="14" y2="17"/>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `
}

function updateStats() {
  const available = tires.filter((t) => t.status === "available").length
  const assigned = tires.filter((t) => t.status === "assigned").length

  availableCount.textContent = `${available} Available`
  assignedCount.textContent = `${assigned} Assigned`
}

function saveTires() {
  localStorage.setItem("tires", JSON.stringify(tires))
}

// Close modal when clicking outside
tireModal.addEventListener("click", (e) => {
  if (e.target === tireModal) {
    closeModalHandler()
  }
})
