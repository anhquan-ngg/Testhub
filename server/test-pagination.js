// File test để kiểm tra API pagination
// Chạy: node test-pagination.js

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000/api/users';

async function testPagination() {
    try {
        console.log('🧪 Testing Pagination API...\n');
        
        // Test 1: Lấy page đầu tiên với limit mặc định
        console.log('📄 Test 1: Lấy page đầu tiên (mặc định)');
        const response1 = await fetch(`${BASE_URL}/list-users`);
        const data1 = await response1.json();
        console.log('Status:', response1.status);
        console.log('Data:', JSON.stringify(data1, null, 2));
        console.log('---\n');
        
        // Test 2: Lấy page 1 với limit 5
        console.log('📄 Test 2: Lấy page 1 với limit 5');
        const response2 = await fetch(`${BASE_URL}/list-users?page=1&limit=5`);
        const data2 = await response2.json();
        console.log('Status:', response2.status);
        console.log('Data:', JSON.stringify(data2, null, 2));
        console.log('---\n');
        
        // Test 3: Lấy page 2 với limit 3
        console.log('📄 Test 3: Lấy page 2 với limit 3');
        const response3 = await fetch(`${BASE_URL}/list-users?page=2&limit=3`);
        const data3 = await response3.json();
        console.log('Status:', response3.status);
        console.log('Data:', JSON.stringify(data3, null, 2));
        console.log('---\n');
        
        // Test 4: Test validation - page < 1
        console.log('❌ Test 4: Test validation - page < 1');
        const response4 = await fetch(`${BASE_URL}/list-users?page=0&limit=5`);
        const data4 = await response4.json();
        console.log('Status:', response4.status);
        console.log('Data:', JSON.stringify(data4, null, 2));
        console.log('---\n');
        
        // Test 5: Test validation - limit > 100
        console.log('❌ Test 5: Test validation - limit > 100');
        const response5 = await fetch(`${BASE_URL}/list-users?page=1&limit=150`);
        const data5 = await response5.json();
        console.log('Status:', response5.status);
        console.log('Data:', JSON.stringify(data5, null, 2));
        
    } catch (error) {
        console.error('❌ Error testing pagination:', error);
    }
}

// Chạy test
testPagination();

