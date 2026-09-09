// Automated pre-launch deep audit test script
const BASE_URL = 'http://localhost:3000';

async function runAudit() {
  console.log('================================================================');
  console.log('ACE SPACES PRE-LAUNCH SYSTEM AUDIT');
  console.log('Testing all pages, API endpoints, auth guards, and security...');
  console.log('================================================================\n');

  const results = {
    pages: [],
    apiPublic: [],
    apiSecurity: [],
    apiFunctional: [],
  };

  // 1. Test All Core Pages
  const pagesToTest = [
    '/',
    '/materials',
    '/materials/noma-white-chalk',
    '/materials/alto-bianco-vein',
    '/materials/strata-sand-fine',
    '/collections/colours',
    '/applications',
    '/applications/residential',
    '/applications/hospitality',
    '/applications/commercial',
    '/fabrication',
    '/projects',
    '/projects/private-residence',
    '/about',
    '/journal',
    '/contact',
    '/admin',
  ];

  console.log('--- 1. AUDITING PAGE ROUTES ---');
  for (const path of pagesToTest) {
    try {
      const res = await fetch(`${BASE_URL}${path}`);
      const text = await res.text();
      const hasError = text.includes('Application error') || text.includes('500 Internal') || text.includes('x Unexpected token');
      const status = res.status;
      const passed = status === 200 && !hasError;
      results.pages.push({ path, status, passed });
      console.log(`[PAGE] ${path.padEnd(32)} -> Status: ${status} ${passed ? '✓ OK' : '✗ FAILED'}`);
    } catch (e) {
      results.pages.push({ path, status: 'ERROR', passed: false, error: e.message });
      console.log(`[PAGE] ${path.padEnd(32)} -> ERROR: ${e.message}`);
    }
  }

  // 2. Test Security & Auth Guards on API Endpoints
  console.log('\n--- 2. AUDITING API SECURITY & AUTH GUARDS ---');
  
  // Test: Unauthorized GET /api/orders must return 401
  try {
    const res = await fetch(`${BASE_URL}/api/orders`);
    const passed = res.status === 401;
    results.apiSecurity.push({ test: 'GET /api/orders without auth is blocked (401)', status: res.status, passed });
    console.log(`[SEC] GET /api/orders (no auth)         -> ${res.status} ${passed ? '✓ (BLOCKED 401)' : '✗ SECURITY RISK!'}`);
  } catch (e) {
    console.log(`[SEC] GET /api/orders error: ${e.message}`);
  }

  // Test: Unauthorized GET /api/inquiries must return 401
  try {
    const res = await fetch(`${BASE_URL}/api/inquiries`);
    const passed = res.status === 401;
    results.apiSecurity.push({ test: 'GET /api/inquiries without auth is blocked (401)', status: res.status, passed });
    console.log(`[SEC] GET /api/inquiries (no auth)      -> ${res.status} ${passed ? '✓ (BLOCKED 401)' : '✗ SECURITY RISK!'}`);
  } catch (e) {
    console.log(`[SEC] GET /api/inquiries error: ${e.message}`);
  }

  // Test: Unauthorized GET /api/dispatch must return 401
  try {
    const res = await fetch(`${BASE_URL}/api/dispatch`);
    const passed = res.status === 401;
    results.apiSecurity.push({ test: 'GET /api/dispatch without auth is blocked (401)', status: res.status, passed });
    console.log(`[SEC] GET /api/dispatch (no auth)       -> ${res.status} ${passed ? '✓ (BLOCKED 401)' : '✗ SECURITY RISK!'}`);
  } catch (e) {
    console.log(`[SEC] GET /api/dispatch error: ${e.message}`);
  }

  // Test: Unauthorized POST /api/admin/content must return 401
  try {
    const res = await fetch(`${BASE_URL}/api/admin/content`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'hacked' }),
    });
    const passed = res.status === 401;
    results.apiSecurity.push({ test: 'POST /api/admin/content without auth is blocked (401)', status: res.status, passed });
    console.log(`[SEC] POST /api/admin/content (no auth) -> ${res.status} ${passed ? '✓ (BLOCKED 401)' : '✗ SECURITY RISK!'}`);
  } catch (e) {
    console.log(`[SEC] POST /api/admin/content error: ${e.message}`);
  }

  // Test: Unauthorized POST /api/admin/upload must return 401
  try {
    const res = await fetch(`${BASE_URL}/api/admin/upload`, {
      method: 'POST',
      body: new FormData(),
    });
    const passed = res.status === 401;
    results.apiSecurity.push({ test: 'POST /api/admin/upload without auth is blocked (401)', status: res.status, passed });
    console.log(`[SEC] POST /api/admin/upload (no auth)  -> ${res.status} ${passed ? '✓ (BLOCKED 401)' : '✗ SECURITY RISK!'}`);
  } catch (e) {
    console.log(`[SEC] POST /api/admin/upload error: ${e.message}`);
  }

  // 3. Test Passkey Authentication Flow
  console.log('\n--- 3. AUDITING PASSKEY AUTHENTICATION FLOW ---');
  let authCookie = '';
  
  // Wrong passkey test
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: 'wrongpasskey123' }),
    });
    const passed = res.status === 401;
    console.log(`[AUTH] Wrong passkey rejection          -> ${res.status} ${passed ? '✓ Rejected (401)' : '✗ Failed'}`);
  } catch (e) {
    console.log(`[AUTH] Error: ${e.message}`);
  }

  // Correct passkey test
  try {
    const res = await fetch(`${BASE_URL}/api/admin/auth`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ passkey: 'acespaces2026' }),
    });
    const data = await res.json();
    const setCookie = res.headers.get('set-cookie');
    if (setCookie) {
      authCookie = setCookie.split(';')[0];
    }
    const passed = res.status === 200 && data.success === true && !!data.token;
    console.log(`[AUTH] Correct passkey login            -> ${res.status} ${passed ? '✓ SUCCESS (Session Token Issued)' : '✗ Failed'}`);
  } catch (e) {
    console.log(`[AUTH] Error: ${e.message}`);
  }

  // 4. Test Authenticated Admin Access with Token
  console.log('\n--- 4. AUDITING AUTHENTICATED ADMIN ACCESS ---');
  if (authCookie) {
    try {
      const res = await fetch(`${BASE_URL}/api/orders`, {
        headers: { Cookie: authCookie },
      });
      const data = await res.json();
      const passed = res.status === 200 && Array.isArray(data.orders);
      console.log(`[ADMIN] GET /api/orders (Authenticated)   -> ${res.status} ${passed ? `✓ SUCCESS (${data.orders.length} orders retrieved)` : '✗ Failed'}`);
    } catch (e) {
      console.log(`[ADMIN] Orders fetch error: ${e.message}`);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/inquiries`, {
        headers: { Cookie: authCookie },
      });
      const data = await res.json();
      const passed = res.status === 200 && Array.isArray(data.inquiries);
      console.log(`[ADMIN] GET /api/inquiries (Authenticated)-> ${res.status} ${passed ? `✓ SUCCESS (${data.inquiries.length} inquiries retrieved)` : '✗ Failed'}`);
    } catch (e) {
      console.log(`[ADMIN] Inquiries fetch error: ${e.message}`);
    }

    try {
      const res = await fetch(`${BASE_URL}/api/dispatch`, {
        headers: { Cookie: authCookie },
      });
      const data = await res.json();
      const passed = res.status === 200 && Array.isArray(data.subscribers);
      console.log(`[ADMIN] GET /api/dispatch (Authenticated) -> ${res.status} ${passed ? `✓ SUCCESS (${data.subscribers.length} subscribers retrieved)` : '✗ Failed'}`);
    } catch (e) {
      console.log(`[ADMIN] Dispatch fetch error: ${e.message}`);
    }
  }

  // 5. Test Public Submission Endpoints
  console.log('\n--- 5. AUDITING PUBLIC SUBMISSIONS ---');
  
  // Newsletter Dispatch Signup
  try {
    const testEmail = `architect.${Date.now()}@studio-test.com`;
    const res = await fetch(`${BASE_URL}/api/dispatch`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: testEmail, source: 'Audit Test' }),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.success === true;
    console.log(`[PUBLIC] POST /api/dispatch (Newsletter) -> ${res.status} ${passed ? '✓ SUCCESS (Subscriber Registered)' : '✗ Failed'}`);
  } catch (e) {
    console.log(`[PUBLIC] Dispatch error: ${e.message}`);
  }

  // Contact Form Inquiry Submission
  try {
    const res = await fetch(`${BASE_URL}/api/inquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Ar. Vikram Malhotra',
        email: 'vikram@malhotra-associates.in',
        phone: '+91 98450 12345',
        projectType: 'Commercial Monolith Reception',
        message: 'Looking for 12mm Alto Bianco Veined slabs for a 20-meter reception desk.',
      }),
    });
    const data = await res.json();
    const passed = res.status === 200 && data.success === true && !!data.inquiryNumber;
    console.log(`[PUBLIC] POST /api/inquiries (Contact)   -> ${res.status} ${passed ? `✓ SUCCESS (${data.inquiryNumber})` : '✗ Failed'}`);
  } catch (e) {
    console.log(`[PUBLIC] Inquiry error: ${e.message}`);
  }

  console.log('\n================================================================');
  console.log('AUDIT COMPLETE');
  console.log('================================================================');
}

runAudit();
