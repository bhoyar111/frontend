import FingerprintJS from '@fingerprintjs/fingerprintjs';

export const getFingerprint = async () => {
  const cached = localStorage.getItem('fingerprint_id');
  if (cached) return cached;

  const fp = await FingerprintJS.load();
  const result = await fp.get();
  const id = result.visitorId;

  localStorage.setItem('deviceId', id);
  return id;
};
