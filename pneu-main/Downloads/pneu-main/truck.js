// Check authentication
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html"
}

// Mock truck data
const trucks = [
  { id: "1", licensePlate: "ZC153BL", status: "active", tiresAssigned: 6, totalTires: 6 },
  { id: "2", licensePlate: "AB789CD", status: "maintenance", tiresAssigned: 4, totalTires: 6 },
  { id: "3", licensePlate: "XY456EF", status: "active", tiresAssigned: 6, totalTires: 6 },
  { id: "4", licensePlate: "MN123GH", status: "inactive", tiresAssigned: 2, totalTires: 6 },
]

// DOM elements
const truckGrid = document.getElementById("truckGrid")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  renderTrucks()
})

function renderTrucks() {
  truckGrid.innerHTML = trucks.map((truck) => createTruckCard(truck)).join("")
}

function createTruckCard(truck) {
  const percentage = Math.round((truck.tiresAssigned / truck.totalTires) * 100)
  const isComplete = truck.tiresAssigned === truck.totalTires

  return `
        <div class="vehicle-card" onclick="window.location.href='truck-detail.html?id=${truck.id}'">
            <div class="vehicle-card-content">
                <div class="vehicle-info">
                    <div class="vehicle-icon ${truck.status}">
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
                            <span class="status-badge-small status-${truck.status}">${truck.status}</span>
                            <span>${truck.tiresAssigned}/${truck.totalTires} tires</span>
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
                    <span>Tire Status</span>
                    <span>${percentage}%</span>
                </div>
                <div class="progress-track">
                    <div class="progress-fill ${isComplete ? "complete" : "incomplete"}" style="width: ${percentage}%"></div>
                </div>
            </div>
        </div>
    `
}
