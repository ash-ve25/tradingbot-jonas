import { createHmac } from 'crypto';
export const buildSignature = function (content, secret) {
  return createHmac('sha256', secret).update(content).digest('hex');
};
