import { NODE_ENV, REDIS, REDIS_HOST, REDIS_PASSWORD, REDIS_PORT, REDIS_USERNAME } from '../config';
import { createClient } from 'redis';

const client  = NODE_ENV =='local'? createClient({
  url: 'redis://' + REDIS,
}) : createClient({
  url:`redis://${REDIS_USERNAME}:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`
})
client.connect();

client.on('error', err => {
  console.log('Redis Client Error', err);
});
client.on('ready', data => {
  console.log('Redis Connected');
});

process.on('SIGINT', () => {
  client.quit();
});

export default client;
