const nodeCrypto = require('node:crypto');
const { webcrypto } = nodeCrypto;

if (typeof globalThis.crypto === 'undefined') {
  Object.defineProperty(globalThis, 'crypto', {
    value: webcrypto,
    configurable: true,
    writable: false,
  });
}

if (typeof nodeCrypto.getRandomValues !== 'function' && webcrypto) {
  nodeCrypto.getRandomValues = (...args) => webcrypto.getRandomValues(...args);
}

try {
  const legacyCrypto = require('crypto');
  if (typeof legacyCrypto.getRandomValues !== 'function' && webcrypto) {
    legacyCrypto.getRandomValues = (...args) => webcrypto.getRandomValues(...args);
  }
} catch (error) {
  // no-op; legacy crypto module not available in this environment
}
