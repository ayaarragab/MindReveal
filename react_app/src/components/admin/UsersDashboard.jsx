import { useState } from 'react';
import { Search, Filter, MoreVertical, Edit, Trash2, UserPlus } from 'lucide-react';

export default function AdminUserDashboard() {
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Sample users data
  const users = [
    { id: 1, name: "Alex Johnson", email: "alex@example.com", role: "Admin", status: "Active", joined: "Apr 15, 2025", avatar: "/api/placeholder/40/40" },
    { id: 2, name: "Sarah Miller", email: "sarah@example.com", role: "Editor", status: "Active", joined: "Mar 24, 2025", avatar: "/api/placeholder/40/40" },
    { id: 3, name: "James Wilson", email: "james@example.com", role: "User", status: "Inactive", joined: "Feb 12, 2025", avatar: "/api/placeholder/40/40" },
    { id: 4, name: "Emma Davis", email: "emma@example.com", role: "User", status: "Active", joined: "Jan 30, 2025", avatar: "/api/placeholder/40/40" },
    { id: 5, name: "Michael Brown", email: "michael@example.com", role: "Editor", status: "Active", joined: "Jan 15, 2025", avatar: "/api/placeholder/40/40" },
    { id: 6, name: "Olivia Taylor", email: "olivia@example.com", role: "User", status: "Pending", joined: "Apr 10, 2025", avatar: "/api/placeholder/40/40" },
  ];

  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleSelectUser = (userId) => {
    if (selectedUsers.includes(userId)) {
      setSelectedUsers(selectedUsers.filter(id => id !== userId));
    } else {
      setSelectedUsers([...selectedUsers, userId]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map(user => user.id));
    }
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-gray-500">Manage registered users and their access levels</p>
        </div>

        {/* Action Bar */}
        <div className="bg-gray-900 rounded-lg shadow-lg p-4 mb-6 border border-gray-800">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            {/* Search */}
            <div className="relative w-full sm:max-w-xs">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-600" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 bg-black border border-gray-800 rounded-md text-sm placeholder-gray-600 text-white focus:outline-none focus:ring-indigo-900 focus:border-indigo-700"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button className="inline-flex items-center px-3 py-2 border border-gray-800 shadow-sm text-sm font-medium rounded-md text-gray-400 bg-black hover:bg-gray-900 focus:outline-none">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </button>
              <button className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-900 hover:bg-indigo-800 focus:outline-none">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </button>
            </div>
          </div>

          {/* Selected count */}
          {selectedUsers.length > 0 && (
            <div className="mt-4 pt-4 border-t border-gray-800">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-400">
                  {selectedUsers.length} user{selectedUsers.length > 1 ? 's' : ''} selected
                </span>
                <div className="flex gap-2">
                  <button className="text-sm text-red-600 hover:text-red-500">Delete Selected</button>
                  <button className="text-sm text-gray-400 hover:text-gray-300">Change Role</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Users Table */}
        <div className="bg-gray-900 rounded-lg shadow-lg overflow-hidden border border-gray-800">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-800">
              <thead className="bg-black">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-indigo-700 focus:ring-indigo-900 bg-black border-gray-700 rounded"
                        checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                        onChange={toggleSelectAll}
                      />
                    </div>
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-gray-900 divide-y divide-gray-800">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className={selectedUsers.includes(user.id) ? "bg-gray-800" : undefined}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-700 focus:ring-indigo-900 bg-black border-gray-700 rounded"
                          checked={selectedUsers.includes(user.id)}
                          onChange={() => toggleSelectUser(user.id)}
                        />
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full ring-2 ring-gray-800" src={user.avatar} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-white">{user.name}</div>
                          <div className="text-sm text-gray-500">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-400">{user.role}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.status === 'Active' 
                          ? 'bg-green-900 text-green-400' 
                          : user.status === 'Inactive' 
                          ? 'bg-gray-800 text-gray-400'
                          : 'bg-yellow-900 text-yellow-400'
                      }`}>
                        {user.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {user.joined}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end items-center space-x-3">
                        <button className="text-indigo-500 hover:text-indigo-400">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-500">
                          <Trash2 className="h-4 w-4" />
                        </button>
                        <button className="text-gray-500 hover:text-gray-400">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="bg-gray-900 px-4 py-3 flex items-center justify-between border-t border-gray-800 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button className="relative inline-flex items-center px-4 py-2 border border-gray-800 text-sm font-medium rounded-md text-gray-400 bg-black hover:bg-gray-900">
                Previous
              </button>
              <button className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-800 text-sm font-medium rounded-md text-gray-400 bg-black hover:bg-gray-900">
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium text-gray-400">1</span> to <span className="font-medium text-gray-400">{filteredUsers.length}</span> of{' '}
                  <span className="font-medium text-gray-400">{users.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-800 bg-black text-sm font-medium text-gray-500 hover:bg-gray-900">
                    <span className="sr-only">Previous</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-800 bg-black text-sm font-medium text-gray-400 hover:bg-gray-900">
                    1
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-800 bg-indigo-900 text-sm font-medium text-indigo-400 hover:bg-indigo-800">
                    2
                  </button>
                  <button className="relative inline-flex items-center px-4 py-2 border border-gray-800 bg-black text-sm font-medium text-gray-400 hover:bg-gray-900">
                    3
                  </button>
                  <button className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-800 bg-black text-sm font-medium text-gray-500 hover:bg-gray-900">
                    <span className="sr-only">Next</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}