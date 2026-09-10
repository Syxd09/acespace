// Automated Security Hardening Verification Script
const BASE_URL = 'http://localhost:3000';

async function runSecurityAudit() {
  console.log('================================================================');
  console.log('ACE SPACES POST-HARDENING SECURITY AUDIT');
  console.log('Testing rate-limiters, tamper protection, and security headers...');
  console.log('================================================================\n');

  let passedAll = true;

  // 1. Test HTTP Security Headers
  console.log('--- 1. TESTING HTTP SECURITY HEADERS ---');
  try {
    const res = await fetch(`${BASE_URL}/`);
    const xFrame = res.headers.get('x-frame-options');
    const xContentType = res.headers.get('x-content-type-options');
    const referrerPolicy = res.headers.get('referrer-policy');

    console.log(`X-Frame-Options:            ${xFrame} ${xFrame === 'SAMEORIGIN' ? '✓ OK' : '✗ MISSING'}`);
    console.log(`X-Content-Type-Options:     ${xContentType} ${xContentType === 'nosniff' ? '✓ OK' : '✗ MISSING'}`);
    console.log(`Referrer-Policy:            ${referrerPolicy} ${referrerPolicy?.includes('strict-origin') ? '✓ OK' : '✗ MISSING'}`);

    if (xFrame !== 'SAMEORIGIN' || xContentType !== 'nosniff') {
      passedAll = false;
    }
  } catch (e) {
    console.log(`Headers check failed: ${e.message}`);
    passedAll = false;
  }

  // 2. Test Unauthenticated Order Tampering Prevention
  console.log('\n--- 2. TESTING ORDER TAMPERING PREVENTION ---');
  try {
    // Attempt to tamper with submitted order ord_specimen_demo
    const tamperPayload = {
      id: 'ord_specimen_demo',
      status: 'delivered',
      customer: {
        name: 'Malicious Attacker',
      },
      items: [
        { materialSlug: 'noma-white-chalk', name: 'Noma', collection: 'Solids', finish: 'Matte', colour: 'White', swatch: 'one' }
      ]
    };

    const res = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(tamperPayload),
    });

    const data = await res.json();
    const blocked = res.status === 403;
    console.log(`Order Tamper Attempt Status: -> ${res.status} ${blocked ? '✓ BLOCKED (403 Forbidden)' : '✗ FAILED'}`);
    console.log(`Server Response:             "${data.error || 'Success'}"`);

    if (!blocked) passedAll = false;
  } catch (e) {
    console.log(`Order tamper check error: ${e.message}`);
    passedAll = false;
  }

  // 3. Test Rate Limiting on Admin Auth
  console.log('\n--- 3. TESTING RATE LIMITER ON ADMIN AUTH ---');
  try {
    let rateLimited = false;
    for (let i = 1; i <= 7; i++) {
      const res = await fetch(`${BASE_URL}/api/admin/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passkey: 'wrong_passkey_test' }),
      });

      if (res.status === 429) {
        rateLimited = true;
        const data = await res.json();
        console.log(`Attempt ${i}: -> 429 Too Many Requests ✓ RATE LIMIT ENGAGED! ("${data.error}")`);
        break;
      } else {
        console.log(`Attempt ${i}: -> ${res.status} Unauthorized`);
      }
    }

    if (!rateLimited) {
      console.log('✗ Rate limit did not trigger as expected.');
      passedAll = false;
    }
  } catch (e) {
    console.log(`Rate limit check error: ${e.message}`);
    passedAll = false;
  }

  console.log('\n================================================================');
  console.log(`OVERALL AUDIT RESULT: ${passedAll ? 'ALL SECURITY CHECKS PASSED ✓' : 'SOME CHECKS FAILED ✗'}`);
  console.log('================================================================');
}

runSecurityAudit();
