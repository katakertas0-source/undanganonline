import { loadEnvConfig } from '@next/env';
loadEnvConfig(process.cwd());

import { GET } from '../app/api/templates/route';
import { POST as adminTemplatePOST } from '../app/api/admin/templates/route';
import { NextRequest } from 'next/server';

async function runTemplateTests() {
  console.log('====================================================');
  console.log('RUNNING AUTHORITATIVE TEMPLATE MANAGEMENT TESTS');
  console.log('====================================================\n');

  // Test 1: Fetch active templates
  console.log('--- TEST 1: Public fetches active templates ---');
  const req1 = new NextRequest('http://localhost:3000/api/templates');
  const res1 = await GET(req1);
  const data1 = await res1.json();
  console.log(`Fetched ${data1.count} active templates.`);
  if (!data1.success || data1.count === 0) {
    throw new Error('Test 1 failed: No templates returned');
  }
  console.log('✅ TEST 1 PASSED: Active templates returned for public\n');

  // Test 2: Admin soft-deletes / deactivates a template globally
  console.log('--- TEST 2: Admin deactivates template globally ---');
  const req2 = new NextRequest('http://localhost:3000/api/admin/templates', {
    method: 'POST',
    body: JSON.stringify({
      action: 'DELETE',
      idOrSlug: 'roma-summer',
    }),
  });
  const res2 = await adminTemplatePOST(req2);
  const data2 = await res2.json();
  console.log('Admin deactivation response:', data2);
  if (!data2.success) {
    throw new Error(`Test 2 failed: ${data2.error}`);
  }
  console.log('✅ TEST 2 PASSED: Template successfully deactivated in Supabase\n');

  // Test 3: Verify public cannot see the deactivated template
  console.log('--- TEST 3: Verify public cannot see deactivated template ---');
  const req3 = new NextRequest('http://localhost:3000/api/templates');
  const res3 = await GET(req3);
  const data3 = await res3.json();
  const foundDeactivated = data3.templates.find((t: any) => t.id === 'roma-summer');
  if (foundDeactivated) {
    throw new Error('Test 3 failed: Deactivated template is still visible to public!');
  }
  console.log('✅ TEST 3 PASSED: Template "roma-summer" is completely hidden from public\n');

  // Test 4: Restore template globally
  console.log('--- TEST 4: Admin restores template globally ---');
  const req4 = new NextRequest('http://localhost:3000/api/admin/templates', {
    method: 'POST',
    body: JSON.stringify({
      action: 'RESTORE',
      idOrSlug: 'roma-summer',
    }),
  });
  const res4 = await adminTemplatePOST(req4);
  const data4 = await res4.json();
  console.log('Admin restore response:', data4);
  if (!data4.success) {
    throw new Error(`Test 4 failed: ${data4.error}`);
  }
  console.log('✅ TEST 4 PASSED: Template restored in Supabase\n');

  // Test 5: Verify public can see the restored template again
  console.log('--- TEST 5: Verify public can see restored template ---');
  const req5 = new NextRequest('http://localhost:3000/api/templates');
  const res5 = await GET(req5);
  const data5 = await res5.json();
  const foundRestored = data5.templates.find((t: any) => t.id === 'roma-summer');
  if (!foundRestored) {
    throw new Error('Test 5 failed: Restored template is not visible to public!');
  }
  console.log('✅ TEST 5 PASSED: Template "roma-summer" is visible again to public\n');

  console.log('====================================================');
  console.log('ALL TEMPLATE MANAGEMENT TESTS PASSED (5 PASSED, 0 FAILED)');
  console.log('====================================================');
}

runTemplateTests().catch((err) => {
  console.error('Test suite failed:', err);
  process.exit(1);
});
