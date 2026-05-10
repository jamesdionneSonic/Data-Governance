/**
 * PermissionMatrix Component
 * Visual matrix showing database access by user
 *
 * Usage:
 * <PermissionMatrix />
 */

export default {
  name: 'PermissionMatrix',
  template: `
    <div class="permission-matrix">
      <div class="header">
        <h2>Permission Matrix</h2>
        <button @click="exportPermissions" class="btn-primary">
          Export Permissions
        </button>
      </div>

      <div class="controls">
        <div class="role-legend">
          <span v-for="role in roles" :key="role" class="legend-item">
            <span :class="'role-badge role-' + role.toLowerCase()">{{ role }}</span>
          </span>
        </div>
      </div>

      <!-- Permission Matrix Table -->
      <div class="matrix-container">
        <table class="permission-matrix-table">
          <thead>
            <tr>
              <th class="row-header">User</th>
              <th v-for="permission in permissions" :key="permission" class="col-header">
                {{ permission }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="row in matrixRows" :key="row.userId">
              <td class="row-header">
                <div>
                  <strong>{{ row.name }}</strong>
                  <div class="email">{{ row.email }}</div>
                </div>
              </td>
              <td
                v-for="permission in permissions"
                :key="permission"
                class="matrix-cell"
              >
                <input
                  type="checkbox"
                  :checked="row.permissions[permission]"
                  @change="updatePermission(row.userId, permission, $event)"
                  class="permission-checkbox"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Bulk Actions -->
      <div class="bulk-actions">
        <button @click="grantAllPermissions" class="btn-secondary">
          Grant All to Selected
        </button>
        <button @click="revokeAllPermissions" class="btn-secondary">
          Revoke All from Selected
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      matrixRows: [],
      roles: ['Admin', 'PowerUser', 'Analyst', 'Viewer'],
      permissions: [
        'view',
        'search',
        'export',
        'manageUsers',
        'managePermissions',
        'modifyMetadata',
        'viewAudit',
      ],
      selectedUsers: [],
    };
  },
  methods: {
    async loadPermissionMatrix() {
      try {
        const response = await fetch('/api/v1/dashboard/permissions');
        const data = await response.json();
        this.matrixRows = data.permissionMatrix;
      } catch (err) {
        console.error('Failed to load permission matrix:', err);
      }
    },
    updatePermission(userId, permission, event) {
      const userRow = this.matrixRows.find((r) => r.userId === userId);
      if (userRow) {
        userRow.permissions[permission] = event.target.checked;
        // In real app, would call API to persist
        this.persistPermissions(userId);
      }
    },
    async persistPermissions(userId) {
      try {
        const userRow = this.matrixRows.find((r) => r.userId === userId);
        await fetch(`/api/v1/admin/users/${userId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ permissions: userRow.permissions }),
        });
      } catch (err) {
        console.error('Failed to persist permissions:', err);
      }
    },
    grantAllPermissions() {
      for (const user of this.matrixRows) {
        if (this.selectedUsers.includes(user.userId)) {
          for (const permission of this.permissions) {
            user.permissions[permission] = true;
          }
          this.persistPermissions(user.userId);
        }
      }
    },
    revokeAllPermissions() {
      for (const user of this.matrixRows) {
        if (this.selectedUsers.includes(user.userId)) {
          for (const permission of this.permissions) {
            user.permissions[permission] = false;
          }
          this.persistPermissions(user.userId);
        }
      }
    },
    exportPermissions() {
      const csv = this.convertMatrixToCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `permission-matrix-${new Date().toISOString()}.csv`;
      link.click();
    },
    convertMatrixToCSV() {
      const headers = ['User Email', ...this.permissions];
      const rows = this.matrixRows.map((row) => [
        row.email,
        ...this.permissions.map((p) => (row.permissions[p] ? 'Yes' : 'No')),
      ]);
      return [headers, ...rows].map((row) => row.join(',')).join('\n');
    },
  },
  mounted() {
    this.loadPermissionMatrix();
  },
};
