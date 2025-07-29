// Data Migration Script for Tire Manager Pro
// Run this script once to populate your Firebase database with sample data

// Make sure to include Firebase SDK and config before running this script
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"></script>
// <script src="firebase-config.js"></script>

const sampleData = {
  tires: [
    { customId: "R2V83292", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 0 },
    { customId: "R2V83252", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 0 },
    { customId: "R2V8XXXXX", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 0 },
    { customId: "B4K92847", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "assigned", dot: "2021", km: 0 },
    { customId: "G7H38291", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "available", dot: "2023", km: 0 },
    { customId: "K9L47382", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "available", dot: "2022", km: 0 },
    { customId: "M3N84729", brand: "Pirelli", type: "TH01", size: "385/55 R22.5", status: "available", dot: "2022", km: 0 },
    { customId: "P7Q92847", brand: "Yokohama", type: "104ZR", size: "295/80 R22.5", status: "assigned", dot: "2020", km: 0 },
  ],
  
  trucks: [
    { id: "1", licensePlate: "ZC153BL", status: "active", tiresAssigned: 6, totalTires: 6 },
    { id: "2", licensePlate: "AB789CD", status: "maintenance", tiresAssigned: 4, totalTires: 6 },
    { id: "3", licensePlate: "XY456EF", status: "active", tiresAssigned: 6, totalTires: 6 },
    { id: "4", licensePlate: "MN123GH", status: "inactive", tiresAssigned: 2, totalTires: 6 },
  ],
  
  trailers: [
    { id: "1", licensePlate: "ZC375YC", status: "active", tiresAssigned: 6, totalTires: 6 },
    { id: "2", licensePlate: "TR892KL", status: "maintenance", tiresAssigned: 3, totalTires: 6 },
    { id: "3", licensePlate: "HJ456NM", status: "active", tiresAssigned: 6, totalTires: 6 },
  ]
};

async function migrateData() {
  try {
    console.log('Začínam migráciu dát...');
    
    // Migrate tires
    console.log('Migrujem pneumatiky...');
    for (const tire of sampleData.tires) {
      await DatabaseService.addTire(tire);
      console.log(`Pridaná pneumatika: ${tire.customId}`);
    }
    
    // Migrate trucks
    console.log('Migrujem nákladné autá...');
    for (const truck of sampleData.trucks) {
      await DatabaseService.addTruck(truck);
      console.log(`Pridané nákladné auto: ${truck.licensePlate}`);
    }
    
    // Migrate trailers
    console.log('Migrujem prívesy...');
    for (const trailer of sampleData.trailers) {
      await DatabaseService.addTrailer(trailer);
      console.log(`Pridaný príves: ${trailer.licensePlate}`);
    }
    
    console.log('Migrácia dát bola úspešne dokončená!');
    
  } catch (error) {
    console.error('Chyba počas migrácie:', error);
  }
}

// Function to clear all data (use with caution!)
async function clearAllData() {
  if (confirm('Ste si istí, že chcete vymazať VŠETKY dáta? Toto sa nedá vrátiť späť!')) {
    try {
      console.log('Vymazávam všetky dáta...');
      
      // Get all documents and delete them
      const tires = await DatabaseService.getTires();
      const trucks = await DatabaseService.getTrucks();
      const trailers = await DatabaseService.getTrailers();
      
      for (const tire of tires) {
        await DatabaseService.deleteTire(tire.id);
      }
      
      for (const truck of trucks) {
        await DatabaseService.deleteTruck(truck.id);
      }
      
      for (const trailer of trailers) {
        await DatabaseService.deleteTrailer(trailer.id);
      }
      
      console.log('Všetky dáta boli úspešne vymazané!');
      
    } catch (error) {
      console.error('Chyba pri mazaní dát:', error);
    }
  }
}

// Export functions for use in browser console
window.migrateData = migrateData;
window.clearAllData = clearAllData;

console.log('Migračný skript načítaný. Použite migrateData() na naplnenie ukážkovými dátami, alebo clearAllData() na vymazanie všetkých dát.'); 