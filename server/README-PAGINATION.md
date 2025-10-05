# 📚 Hướng dẫn sử dụng API Pagination

## 🚀 Cách sử dụng

### 1. Route cơ bản
```
GET /api/users/list-users
```

### 2. Query Parameters
- **page**: Số trang (mặc định: 1)
- **limit**: Số item trên mỗi trang (mặc định: 10, tối đa: 100)

### 3. Ví dụ sử dụng

#### Lấy trang đầu tiên với limit mặc định:
```
GET /api/users/list-users
```

#### Lấy trang 1 với 5 users:
```
GET /api/users/list-users?page=1&limit=5
```

#### Lấy trang 2 với 3 users:
```
GET /api/users/list-users?page=2&limit=3
```

### 4. Response Format

```json
{
  "users": [
    {
      "id": 1,
      "full_name": "Nguyễn Văn A",
      "email": "nguyenvana@example.com",
      "role": "student",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "limit": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 5. Validation Rules
- **page**: Phải >= 1
- **limit**: Phải từ 1-100
- Nếu không cung cấp, sẽ sử dụng giá trị mặc định

### 6. Error Responses

#### Validation Error (400):
```json
{
  "message": "Page phải >= 1, limit phải từ 1-100"
}
```

#### Server Error (500):
```json
{
  "message": "Server bị lỗi"
}
```

## 🔧 Cách implement ở Frontend

### React Example:
```jsx
import { useState, useEffect } from 'react';

function UserList() {
  const [users, setUsers] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const fetchUsers = async (page, limit) => {
    try {
      const response = await fetch(
        `/api/users/list-users?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      setUsers(data.users);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage, limit);
  }, [currentPage, limit]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div>
      {/* User list */}
      {users.map(user => (
        <div key={user.id}>{user.full_name}</div>
      ))}
      
      {/* Pagination controls */}
      <div>
        <button 
          disabled={!pagination.hasPrevPage}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        
        <span>Page {pagination.currentPage} of {pagination.totalPages}</span>
        
        <button 
          disabled={!pagination.hasNextPage}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

## 🧪 Testing

Chạy file test để kiểm tra API:
```bash
cd server
node test-pagination.js
```

## 📝 Lưu ý quan trọng

1. **Route syntax**: Sử dụng `/list-users` thay vì `/list-users?page&limit`
2. **Query parameters**: Express tự động parse query string
3. **Validation**: Luôn validate input trước khi xử lý
4. **Response format**: Trả về cả data và thông tin pagination
5. **Error handling**: Xử lý lỗi một cách graceful

