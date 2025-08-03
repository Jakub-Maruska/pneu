import { defineConfig } from 'vite';

export default defineConfig({
  base: '/pneu/', // Názov vášho repozitára na GitHub
  build: {
    rollupOptions: {
      input: {
        main: 'index.html',
        storage: 'pneu/storage.html',
        trailerDetail: 'pneu/trailer-detail.html',
        trailer: 'pneu/trailer.html',
        truckDetail: 'pneu/truck-detail.html',
        truck: 'pneu/truck.html',
      }
    }
  }
});
