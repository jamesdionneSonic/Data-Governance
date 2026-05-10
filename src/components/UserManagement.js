/**
 * UserManagement Component
 * Admin interface for managing users and roles
 *
 * Usage:
 * <UserManagement />
 */

export default {
  name: 'UserManagement',
  template: `
    <div class="user-management">
      <div class="header">
        <h2>User Management</h2>
        <button @click="showAddUserForm" class="btn-primary">Add User</button>
      </div>

      <!-- Statistics -->
      <div class="stats-grid">
        <div class="stat-card">
          <h3>Total Users</h3>
          <p class="stat-value">{{ userData.totalUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Active Users</h3>
          <p class="stat-value">{{ userData.activeUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Admin Users</h3>
          <p class="stat-value">{{ userData.usersByRole.Admin }}</p>
        </div>
      </div>

      <!-- Users Table -->
      <div class="users-table-container">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search users..."
          class="search-box"
        />
        
        <table class="users-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.userId">
              <td>{{ user.name }}</td>
              <td>{{ user.email }}</td>
              <td>
                <select
                  :value="user.role"
                  @change="updateUserRole(user.userId, $event)"
                  class="role-select"
                >
                  <option value="Admin">Admin</option>
                  <option value="PowerUser">PowerUser</option>
                  <option value="Analyst">Analyst</option>
                  <option value="Viewer">Viewer</option>
                </select>
              </td>
              <td>
                <span :class="{ active: user.active, inactive: !user.active }">
                  {{ user.active ? 'Active' : 'Inactive' }}
                </span>
              </td>
              <td>{{ formatDate(user.createdAt) }}</td>
              <td>
                <button
                  @click="toggleUserStatus(user.userId, user.active)"
                  class="btn-small"
                >
                  {{ user.active ? 'Deactivate' : 'Reactivate' }}
                </button>
                <button @click="deleteUser(user.userId)" class="btn-danger-small">
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add/Edit User Modal -->
      <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
        <div class="modal">
          <h3>{{ editingUser ? 'Edit User' : 'Add User' }}</h3>
          <form @submit.prevent="saveUser">
            <div class="form-group">
              <label>Name</label>
              <input v-model="formData.name" type="text" required />
            </div>
            <div class="form-group">
              <label>Email</label>
              <input v-model="formData.email" type="email" required />
            </div>
            <div class="form-group">
              <label>Role</label>
              <select v-model="formData.role">
                <option value="Admin">Admin</option>
                <option value="PowerUser">PowerUser</option>
                <option value="Analyst">Analyst</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
            <div class="form-actions">
              <button type="submit" class="btn-primary">Save</button>
              <button type="button" @click="closeModal" class="btn-secondary">
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
  data() {
    return {
      userData: {
        totalUsers: 0,
        activeUsers: 0,
        inactiveUsers: 0,
        usersByRole: {
          Admin: 0, PowerUser: 0, Analyst: 0, Viewer: 0,
        },
        users: [],
      },
      searchQuery: '',
      showModal: false,
      editingUser: null,
      formData: {
        name: '',
        email: '',
        role: 'Analyst',
      },
    };
  },
  computed: {
    filteredUsers() {
      return this.userData.users.filter(
        (u) => u.name.toLowerCase().includes(this.searchQuery.toLowerCase())
          || u.email.toLowerCase().includes(this.searchQuery.toLowerCase()),
      );
    },
  },
  methods: {
    async loadUserData() {
      try {
        const response = await fetch('/api/v1/dashboard/users');
        this.userData = await response.json();
      } catch (err) {
        console.error('Failed to load user data:', err);
      }
    },
    showAddUserForm() {
      this.editingUser = null;
      this.formData = { name: '', email: '', role: 'Analyst' };
      this.showModal = true;
    },
    closeModal() {
      this.showModal = false;
    },
    async saveUser() {
      try {
        // Call admin API to create user
        const response = await fetch('/api/v1/admin/users', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(this.formData),
        });
        if (response.ok) {
          this.closeModal();
          this.loadUserData();
        }
      } catch (err) {
        console.error('Failed to save user:', err);
      }
    },
    async updateUserRole(userId, event) {
      try {
        await fetch(`/api/v1/admin/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ role: event.target.value }),
        });
      } catch (err) {
        console.error('Failed to update role:', err);
      }
    },
    async toggleUserStatus(userId, currentActive) {
      try {
        const endpoint = currentActive ? 'deactivate' : 'reactivate';
        await fetch(`/api/v1/admin/users/${userId}/${endpoint}`, { method: 'POST' });
        this.loadUserData();
      } catch (err) {
        console.error('Failed to toggle user status:', err);
      }
    },
    async deleteUser(userId) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await fetch(`/api/v1/admin/users/${userId}`, { method: 'DELETE' });
          this.loadUserData();
        } catch (err) {
          console.error('Failed to delete user:', err);
        }
      }
    },
    formatDate(date) {
      return new Date(date).toLocaleDateString();
    },
  },
  mounted() {
    this.loadUserData();
  },
};
