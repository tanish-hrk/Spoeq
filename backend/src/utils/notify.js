const logger = require('./logger');

async function emit(event, payload){
  // Placeholder for future email/SMS/push integration
  logger.info('Event', { event, payload });
}

module.exports = { emit };
