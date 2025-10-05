// Test API pagination đơn giản
// Chạy: node test-api.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/users';

async function testAPI() {
  try {
    console.log('🧪 Testing API Pagination...\n');
    
    // Test 1: Lấy page đầu tiên
    console.log('📄 Test 1: Lấy page đầu tiên');
    const response1 = await fetch(`${BASE_URL}/list-users?page=1&limit=5`);
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response structure:', Object.keys(data1));
    if (data1.users) {
      console.log('Users count:', data1.users.length);
      console.log('Pagination info:', data1.pagination);
    }
    console.log('---\n');
    
    // Test 2: Lấy page 2
    console.log('📄 Test 2: Lấy page 2');
    const response2 = await fetch(`${BASE_URL}/list-users?page=2&limit=3`);
    const data2 = await response2.json();
    console.log('Status:', response2.status);
    if (data2.users) {
      console.log('Users count:', data2.users.length);
      console.log('Pagination info:', data2.pagination);
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

// Chạy test
testAPI();

