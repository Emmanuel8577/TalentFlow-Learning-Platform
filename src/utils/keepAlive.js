const axios = require('axios');

const keepAlive = (url) => {
  setInterval(async () => {
    try {
      const response = await axios.get(url);
      console.log(`Pinged ${url}: Status ${response.status} - Keeping instance awake! ⚡`);
    } catch (error) {
      console.error(`Keep-alive failed for ${url}:`, error.message);
    }
  }, 14 * 60 * 1000); 
};

// Ensure this is exactly like this:
module.exports = keepAlive;