const dns = require('dns').promises;

// Common disposable/temporary email domains — blocked outright.
const DISPOSABLE_DOMAINS = new Set([
  'mailinator.com', 'tempmail.com', 'guerrillamail.com', '10minutemail.com',
  'yopmail.com', 'trashmail.com', 'throwawaymail.com', 'fakeinbox.com',
  'getnada.com', 'temp-mail.org', 'sharklasers.com', 'maildrop.cc'
]);

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  if (req.method === 'OPTIONS') { res.status(200).end(); return; }

  const email = (req.query.email || '').toString().trim().toLowerCase();
  const basicFormat = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!basicFormat.test(email)) {
    res.status(200).json({ valid: false, reason: 'format' });
    return;
  }

  const domain = email.split('@')[1];

  if (DISPOSABLE_DOMAINS.has(domain)) {
    res.status(200).json({ valid: false, reason: 'disposable' });
    return;
  }

  try {
    const mxRecords = await dns.resolveMx(domain);
    if (mxRecords && mxRecords.length > 0) {
      res.status(200).json({ valid: true });
    } else {
      res.status(200).json({ valid: false, reason: 'no-mx' });
    }
  } catch (err) {
    // NXDOMAIN, ENODATA, etc — domain cannot receive mail
    res.status(200).json({ valid: false, reason: 'no-mx' });
  }
};
