// src/pages/admin/AdminUserDashboard.jsx
import { useUsersStore } from '../../store/userStore';
import { useState } from 'react';

export default function AdminUserDashboard() {
  const { users, isLoading, error, fetchUsers } = useUsersStore();
  const [hasFetched, setHasFetched] = useState(false);

  if (!hasFetched && !isLoading && users.length === 0) {
    fetchUsers();
    setHasFetched(true);
  }

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error fetching users: {error}</p>;

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">All Users</h2>
      <ul className="space-y-2">
        {users[0].slice(0, 5).map((user) => (
          <li key={user.id} className="p-2 bg-gray-100 rounded">
            <strong>{user.username}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
