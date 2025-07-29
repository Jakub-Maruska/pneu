// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAEV9VCbQOFA763ULbg2H9N7YPONHFo9ys",
  authDomain: "pneu-ee1d6.firebaseapp.com",
  projectId: "pneu-ee1d6",
  storageBucket: "pneu-ee1d6.firebasestorage.app",
  messagingSenderId: "703642287813",
  appId: "1:703642287813:web:e5a25fe039e09883cb7aac",
  measurementId: "G-5Z9VW7RB1F"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Database operations
const DatabaseService = {
  // Tires
  async getTires() {
    try {
      const snapshot = await db.collection('tires').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting tires:', error);
      return [];
    }
  },

  async addTire(tire) {
    try {
      const docRef = await db.collection('tires').add(tire);
      return { id: docRef.id, ...tire };
    } catch (error) {
      console.error('Error adding tire:', error);
      throw error;
    }
  },

  async updateTire(tireId, updates) {
    try {
      await db.collection('tires').doc(tireId).update(updates);
    } catch (error) {
      console.error('Error updating tire:', error);
      throw error;
    }
  },

  async deleteTire(tireId) {
    try {
      await db.collection('tires').doc(tireId).delete();
    } catch (error) {
      console.error('Error deleting tire:', error);
      throw error;
    }
  },

  // Trucks
  async getTrucks() {
    try {
      const snapshot = await db.collection('trucks').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting trucks:', error);
      return [];
    }
  },

  async addTruck(truck) {
    try {
      const docRef = await db.collection('trucks').add(truck);
      return { id: docRef.id, ...truck };
    } catch (error) {
      console.error('Error adding truck:', error);
      throw error;
    }
  },

  async updateTruck(truckId, updates) {
    try {
      await db.collection('trucks').doc(truckId).update(updates);
    } catch (error) {
      console.error('Error updating truck:', error);
      throw error;
    }
  },

  async deleteTruck(truckId) {
    try {
      await db.collection('trucks').doc(truckId).delete();
    } catch (error) {
      console.error('Error deleting truck:', error);
      throw error;
    }
  },

  // Trailers
  async getTrailers() {
    try {
      const snapshot = await db.collection('trailers').get();
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (error) {
      console.error('Error getting trailers:', error);
      return [];
    }
  },

  async addTrailer(trailer) {
    try {
      const docRef = await db.collection('trailers').add(trailer);
      return { id: docRef.id, ...trailer };
    } catch (error) {
      console.error('Error adding trailer:', error);
      throw error;
    }
  },

  async updateTrailer(trailerId, updates) {
    try {
      await db.collection('trailers').doc(trailerId).update(updates);
    } catch (error) {
      console.error('Error updating trailer:', error);
      throw error;
    }
  },

  async deleteTrailer(trailerId) {
    try {
      await db.collection('trailers').doc(trailerId).delete();
    } catch (error) {
      console.error('Error deleting trailer:', error);
      throw error;
    }
  },

  // Tire slots for vehicles
  async getTireSlots(vehicleType, vehicleId) {
    try {
      const snapshot = await db.collection(`${vehicleType}_slots`).doc(vehicleId).get();
      return snapshot.exists ? snapshot.data().slots : [];
    } catch (error) {
      console.error('Error getting tire slots:', error);
      return [];
    }
  },

  async updateTireSlots(vehicleType, vehicleId, slots) {
    try {
      await db.collection(`${vehicleType}_slots`).doc(vehicleId).set({ slots });
    } catch (error) {
      console.error('Error updating tire slots:', error);
      throw error;
    }
  },

  // Real-time listeners
  onTiresUpdate(callback) {
    return db.collection('tires').onSnapshot(snapshot => {
      const tires = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(tires);
    });
  },

  onTrucksUpdate(callback) {
    return db.collection('trucks').onSnapshot(snapshot => {
      const trucks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(trucks);
    });
  },

  onTrailersUpdate(callback) {
    return db.collection('trailers').onSnapshot(snapshot => {
      const trailers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      callback(trailers);
    });
  }
};

// Export for use in other files
window.DatabaseService = DatabaseService; 