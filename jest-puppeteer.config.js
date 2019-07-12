module.exports = {
  launch: { headless: true, timeout: 0 },
  server: {
    command: `npm start`,
    port: 3001,
    launchTimeout: 100000,
    debug: true
  }
};
