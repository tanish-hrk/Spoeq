const logger = require('./logger');
let redisClient;
let memoryStore = new Map();
let useMemory = false;

async function initCache() {
  const url = process.env.REDIS_URL;
  if (!url) { useMemory = true; logger.warn('REDIS_URL missing - using in-memory cache'); return; }
  const { createClient } = require('redis');
  redisClient = createClient({ url });
  redisClient.on('error', err => { logger.error('Redis error', err); });
  try { await redisClient.connect(); logger.info('Redis connected'); } catch (e) { useMemory = true; logger.error('Redis connect failed, fallback to memory', e); }
}

function keyBuilder(prefix, parts){ return prefix + ':' + parts.join('|'); }

async function get(key){
  if(useMemory) return memoryStore.get(key) || null;
  return await redisClient.get(key);
}
async function set(key, value, ttlSec){
  if(useMemory){ memoryStore.set(key, value); if(ttlSec){ setTimeout(()=> memoryStore.delete(key), ttlSec*1000); } return; }
  if(ttlSec) await redisClient.set(key, value, { EX: ttlSec }); else await redisClient.set(key, value);
}
async function del(pattern){
  if(useMemory){
    for (const k of [...memoryStore.keys()]) if(k.startsWith(pattern)) memoryStore.delete(k);
    return;
  }
  const iter = redisClient.scanIterator({ MATCH: pattern + '*' });
  for await (const k of iter){ await redisClient.del(k); }
}

module.exports = { initCache, get, set, del, keyBuilder };
