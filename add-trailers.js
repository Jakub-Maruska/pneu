// Script to add new trailers to the Tire Manager Pro database

async function addNewTrailers() {
  const logElement = document.getElementById('log');
  
  function log(message, type = 'info') {
    console.log(message);
    const color = type === 'error' ? '#dc2626' : '#059669';
    logElement.innerHTML += `<div style="color: ${color};">${message}</div>`;
    logElement.scrollTop = logElement.scrollHeight;
  }

  const newTrailerPlates = [
    "ZC206YD", "ZC212YC", "ZC235YC", "ZC237YC", "ZC278YC", 
    "ZC291YD", "ZC298YC", "ZC336YD", "ZC388YC", "ZC390YC", 
    "ZC397YD", "ZC398YC", "ZC421YD", "ZC426YD", "ZC441YD", 
    "ZC451YD", "ZC460YC", "ZC595YB", "ZC598YD", "ZC603YD", 
    "ZC645YB"
  ];

  const trailerSlotsTemplate = [
    { id: "left-front", position: "Ľavé predné", tire: null },
    { id: "left-middle", position: "Ľavé stredné", tire: null },
    { id: "left-rear", position: "Ľavé zadné", tire: null },
    { id: "right-front", position: "Pravé predné", tire: null },
    { id: "right-middle", position: "Pravé stredné", tire: null },
    { id: "right-rear", position: "Pravé zadné", tire: null },
  ];

  try {
    log('Starting to add new trailers...');
    
    const existingTrailers = await DatabaseService.getTrailers();
    const existingPlates = existingTrailers.map(t => t.licensePlate);

    const trailersToAdd = newTrailerPlates.filter(plate => !existingPlates.includes(plate));

    if (trailersToAdd.length === 0) {
      log('No new trailers to add. All specified trailers already exist.');
      return;
    }

    log(`Found ${trailersToAdd.length} new trailers to add.`);

    for (const plate of trailersToAdd) {
      const newTrailer = { licensePlate: plate };
      await DatabaseService.addTrailer(newTrailer);
      const trailerId = plate.replace(/\s/g, '');
      await DatabaseService.updateTireSlots('trailer', trailerId, trailerSlotsTemplate);
      log(`Added new trailer: ${plate}`);
    }
    
    log('Successfully added all new trailers!');
    
  } catch (error) {
    console.error('Error while adding new trailers:', error);
    log(`Error: ${error.message}`, 'error');
  }
}

window.addNewTrailers = addNewTrailers;
