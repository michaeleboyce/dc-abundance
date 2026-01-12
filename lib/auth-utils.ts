import crypto from 'crypto';

// Get secret - fail closed if not configured
function getSecret(): string {
  const secret = process.env.ADMIN_PASSWORD;
  if (!secret) {
    throw new Error('ADMIN_PASSWORD environment variable is required for admin authentication');
  }
  return secret;
}

// HMAC-based session token creation
export function createSessionToken(): string {
  const secret = getSecret();
  const timestamp = Date.now().toString();
  const randomBytes = crypto.randomBytes(16).toString('hex');
  const data = `admin:${timestamp}:${randomBytes}`;
  const hmac = crypto.createHmac('sha256', secret).update(data).digest('hex');
  return Buffer.from(`${data}:${hmac}`).toString('base64');
}

// Verify HMAC-based session token
export function verifySessionToken(token: string): boolean {
  try {
    const secret = getSecret();
    const decoded = Buffer.from(token, 'base64').toString('utf8');
    const parts = decoded.split(':');

    if (parts.length !== 4) return false;

    const [prefix, timestamp, randomBytes, providedHmac] = parts;

    if (prefix !== 'admin') return false;

    // Check if token is not too old (24 hours)
    const tokenAge = Date.now() - parseInt(timestamp, 10);
    if (tokenAge > 24 * 60 * 60 * 1000) return false;

    // Verify HMAC
    const data = `${prefix}:${timestamp}:${randomBytes}`;
    const expectedHmac = crypto.createHmac('sha256', secret).update(data).digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(providedHmac, 'hex'),
      Buffer.from(expectedHmac, 'hex')
    );
  } catch {
    // If secret is not configured or any other error, reject the token
    return false;
  }
}
