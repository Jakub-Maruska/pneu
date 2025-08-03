// Data Migration Script for Tire Manager Pro
// Run this script once to populate your Firebase database with sample data

// Make sure to include Firebase SDK and config before running this script
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"></script>
// <script src="https://www.gstatic.com/firebasejs/9.0.0/firebase-firestore-compat.js"></script>
// <script src="firebase-config.js"></script>

const sampleData = {
  tires: [
    // Zelené pneumatiky (pod 150k km)
    { customId: "R2V83292", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 50000 },
    { customId: "R2V83252", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 80000 },
    { customId: "R2V8XXXXX", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 120000 },
    { customId: "Q8R12345", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "available", dot: "2022", km: 75000 },
    { customId: "U1V23456", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "available", dot: "2023", km: 35000 },
    { customId: "W2X34567", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "available", dot: "2022", km: 140000 },
    
    // Oranžové pneumatiky (150k-200k km)
    { customId: "B4K92847", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "assigned", dot: "2021", km: 180000 },
    { customId: "S9T67890", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "available", dot: "2021", km: 110000 },
    { customId: "K9L47382", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "available", dot: "2022", km: 160000 },
    
    // Červené pneumatiky (nad 200k km)
    { customId: "M3N84729", brand: "Pirelli", type: "TH01", size: "385/55 R22.5", status: "available", dot: "2022", km: 220000 },
    { customId: "P7Q92847", brand: "Yokohama", type: "104ZR", size: "295/80 R22.5", status: "assigned", dot: "2020", km: 95000 },
    { customId: "G7H38291", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "available", dot: "2023", km: 25000 },
    
    // Pneumatiky na predaj (oranzova farba)
    { customId: "S4L12345", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "forSale", dot: "2021", km: 140000 },
    { customId: "T5M67890", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "forSale", dot: "2020", km: 170000 },
    { customId: "U6N11111", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "forSale", dot: "2021", km: 155000 },
    { customId: "V7O22222", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "forSale", dot: "2020", km: 185000 },
    { customId: "W8P33333", brand: "Pirelli", type: "TH01", size: "385/55 R22.5", status: "forSale", dot: "2021", km: 165000 },
    
    // Vyhodene pneumatiky (cervena farba)
    { customId: "X9Q44444", brand: "Michelin", type: "XDA2", size: "355/50 R22.5", status: "disposed", dot: "2019", km: 280000 },
    { customId: "Y0R55555", brand: "Bridgestone", type: "M729", size: "295/75 R22.5", status: "disposed", dot: "2018", km: 320000 },
    { customId: "Z1S66666", brand: "Continental", type: "HSC1", size: "315/70 R22.5", status: "disposed", dot: "2019", km: 290000 },
    { customId: "A2T77777", brand: "Goodyear", type: "G159", size: "385/65 R22.5", status: "disposed", dot: "2018", km: 310000 },
    { customId: "B3U88888", brand: "Pirelli", type: "TH01", size: "385/55 R22.5", status: "disposed", dot: "2019", km: 275000 },
  ],
  
  trucks: [
    { licensePlate: "AA 466 SN" },
    { licensePlate: "AA 732 GJ" },
    { licensePlate: "ZC 153 BL" },
    { licensePlate: "ZC 328 BL" },
    { licensePlate: "ZC 352 BP" },
    { licensePlate: "ZC 282 BL" },
    { licensePlate: "ZC 441 BV" },
    { licensePlate: "ZC 449 BV" },
    { licensePlate: "ZC 465 BS" },
    { licensePlate: "ZC 469 BS" },
    { licensePlate: "ZC 491 BS" },
    { licensePlate: "ZC 675 BT" },
    { licensePlate: "ZC 750 BO" },
    { licensePlate: "ZC 773 BS" },
    { licensePlate: "ZC 889 BS" },
    { licensePlate: "ZC 970 BP" },
    { licensePlate: "ZC 974 BP" }
  ],
  
  trailers: [
    { licensePlate: "ZC 375 YC" },
    { licensePlate: "TR 892 KL" },
    { licensePlate: "HJ 456 NM" },
  ],

  // Slot konfigurácie pre autá (6 slotov)
  truckSlots: [
    { id: "front-left", position: "Predné ľavé", category: "front", tire: null },
    { id: "front-right", position: "Predné pravé", category: "front", tire: null },
    { id: "rear-left-outer", position: "Zadné ľavé vonkajšie", category: "rear", tire: null },
    { id: "rear-left-inner", position: "Zadné ľavé vnútorné", category: "rear", tire: null },
    { id: "rear-right-outer", position: "Zadné pravé vonkajšie", category: "rear", tire: null },
    { id: "rear-right-inner", position: "Zadné pravé vnútorné", category: "rear", tire: null },
  ],

  // Slot konfigurácie pre prívesy (6 slotov)
  trailerSlots: [
    { id: "left-front", position: "Ľavé predné", tire: null },
    { id: "left-middle", position: "Ľavé stredné", tire: null },
    { id: "left-rear", position: "Ľavé zadné", tire: null },
    { id: "right-front", position: "Pravé predné", tire: null },
    { id: "right-middle", position: "Pravé stredné", tire: null },
    { id: "right-rear", position: "Pravé zadné", tire: null },
  ]
};

async function migrateData() {
  try {
    console.log('Začínam migráciu dát...');
    
    // Najprv vymazem všetky existujúce dáta
    console.log('Vymazávam existujúce dáta...');
    await clearAllData();
    
    // Migrate tires
    console.log('Migrujem pneumatiky...');
    const addedTires = [];
    for (const tire of sampleData.tires) {
      const addedTire = await DatabaseService.addTire(tire);
      addedTires.push(addedTire);
      console.log(`Pridaná pneumatika: ${tire.customId} (${tire.km} km)`);
    }
    
    // Migrate trucks
    console.log('Migrujem autá...');
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

    // Vytvorím sloty pre autá
    console.log('Vytváram sloty pre autá...');
    for (const truck of sampleData.trucks) {
      const truckId = truck.licensePlate.replace(/\s/g, '');
      await DatabaseService.updateTireSlots('truck', truckId, sampleData.truckSlots);
      console.log(`Vytvorené sloty pre auto: ${truck.licensePlate}`);
    }

    // Vytvorím sloty pre prívesy
    console.log('Vytváram sloty pre prívesy...');
    for (const trailer of sampleData.trailers) {
      const trailerId = trailer.licensePlate.replace(/\s/g, '');
      await DatabaseService.updateTireSlots('trailer', trailerId, sampleData.trailerSlots);
      console.log(`Vytvorené sloty pre príves: ${trailer.licensePlate}`);
    }

    // Priradím pneumatiky na ukážku s rôznymi statusmi
    console.log('Priraďujem pneumatiky na ukážku...');
    
    // Auto 1 (ZC153BL) - Zelené (všetky pod 150k km)
    const truck1Slots = [...sampleData.truckSlots];
    truck1Slots[0].tire = addedTires[0]; // 50k km
    truck1Slots[1].tire = addedTires[1]; // 80k km
    truck1Slots[2].tire = addedTires[2]; // 120k km
    truck1Slots[3].tire = addedTires[3]; // 75k km
    truck1Slots[4].tire = addedTires[4]; // 35k km
    truck1Slots[5].tire = addedTires[5]; // 140k km
    await DatabaseService.updateTireSlots('truck', 'ZC153BL', truck1Slots);
    
    // Auto 2 (AA732GJ) - Oranžové (aspoň jedna 150k-200k km)
    const truck2Slots = [...sampleData.truckSlots];
    truck2Slots[0].tire = addedTires[6]; // 180k km (oranžová)
    truck2Slots[1].tire = addedTires[7]; // 110k km
    truck2Slots[2].tire = addedTires[8]; // 160k km (oranžová)
    await DatabaseService.updateTireSlots('truck', 'AA732GJ', truck2Slots);
    
    // Auto 3 (ZC328BL) - Červené (aspoň jedna nad 200k km)
    const truck3Slots = [...sampleData.truckSlots];
    truck3Slots[0].tire = addedTires[9]; // 220k km (červená)
    truck3Slots[1].tire = addedTires[10]; // 95k km
    await DatabaseService.updateTireSlots('truck', 'ZC328BL', truck3Slots);
    
    // Príves 1 (ZC375YC) - Zelené (všetky pod 150k km)
    const trailer1Slots = [...sampleData.trailerSlots];
    trailer1Slots[0].tire = addedTires[0]; // 50k km
    trailer1Slots[1].tire = addedTires[1]; // 80k km
    trailer1Slots[2].tire = addedTires[2]; // 120k km
    trailer1Slots[3].tire = addedTires[3]; // 75k km
    trailer1Slots[4].tire = addedTires[4]; // 35k km
    await DatabaseService.updateTireSlots('trailer', 'ZC375YC', trailer1Slots);
    
    // Príves 2 (TR892KL) - Oranžové (aspoň jedna 150k-200k km)
    const trailer2Slots = [...sampleData.trailerSlots];
    trailer2Slots[0].tire = addedTires[6]; // 180k km (oranžová)
    trailer2Slots[1].tire = addedTires[7]; // 110k km
    await DatabaseService.updateTireSlots('trailer', 'TR892KL', trailer2Slots);
    
    // Príves 3 (HJ456NM) - Červené (aspoň jedna nad 200k km)
    const trailer3Slots = [...sampleData.trailerSlots];
    trailer3Slots[0].tire = addedTires[9]; // 220k km (červená)
    await DatabaseService.updateTireSlots('trailer', 'HJ456NM', trailer3Slots);
    
    console.log('Migrácia dát bola úspešne dokončená!');
    console.log('Ukážkové dáta:');
    console.log('- Auto ZC153BL: 6/6 pneumatík (ZELENÉ - všetky pod 150k km)');
    console.log('- Auto AA732GJ: 3/6 pneumatík (ORANŽOVÉ - aspoň jedna 150k-200k km)');
    console.log('- Auto ZC328BL: 2/6 pneumatík (ČERVENÉ - aspoň jedna nad 200k km)');
    console.log('- Príves ZC375YC: 5/6 pneumatík (ZELENÉ - všetky pod 150k km)');
    console.log('- Príves TR892KL: 2/6 pneumatík (ORANŽOVÉ - aspoň jedna 150k-200k km)');
    console.log('- Príves HJ456NM: 1/6 pneumatík (ČERVENÉ - aspoň jedna nad 200k km)');
    
  } catch (error) {
    console.error('Chyba počas migrácie:', error);
  }
}

// Function to clear all data (use with caution!)
async function clearAllData() {
  try {
    console.log('Vymazávam všetky dáta...');
    
    // Get all documents and delete them
    const tires = await DatabaseService.getTires();
    const trucks = await DatabaseService.getTrucks();
    const trailers = await DatabaseService.getTrailers();
    
    // Delete tires
    for (const tire of tires) {
      await DatabaseService.deleteTire(tire.id);
    }
    
    // Delete trucks
    for (const truck of trucks) {
      await DatabaseService.deleteTruck(truck.id);
    }
    
    // Delete trailers
    for (const trailer of trailers) {
      await DatabaseService.deleteTrailer(trailer.id);
    }

    // Delete all tire slots collections
    const db = firebase.firestore();
    
    // Delete truck slots
    const truckSlotsSnapshot = await db.collection('truck_slots').get();
    for (const doc of truckSlotsSnapshot.docs) {
      await doc.ref.delete();
    }
    
    // Delete trailer slots
    const trailerSlotsSnapshot = await db.collection('trailer_slots').get();
    for (const doc of trailerSlotsSnapshot.docs) {
      await doc.ref.delete();
    }
    
    console.log('Všetky dáta boli úspešne vymazané!');
    
  } catch (error) {
    console.error('Chyba pri mazaní dát:', error);
  }
}

// Export functions for use in browser console
window.migrateData = migrateData;
window.clearAllData = clearAllData;

console.log('Migračný skript načítaný. Použite migrateData() na naplnenie ukážkovými dátami, alebo clearAllData() na vymazanie všetkých dát.');
