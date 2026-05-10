/**
 * AuditLogViewer Component
 * Show all system events and access history with filtering
 *
 * Usage:
 * <AuditLogViewer />
 */

export default {
  name: 'AuditLogViewer',
  template: `
    <div class="audit-log-viewer">
      <div class="header">
        <h2>Audit Log</h2>
        <button @click="exportAuditLog" class="btn-primary">Export to CSV</button>
      </div>

      <!-- Statistics -->
      <div class="audit-stats">
        <div class="stat-card">
          <h3>Total Events</h3>
          <p class="stat-value">{{ audit.summary.totalEvents }}</p>
        </div>
        <div class="stat-card">
          <h3>Unique Users</h3>
          <p class="stat-value">{{ audit.summary.uniqueUsers }}</p>
        </div>
        <div class="stat-card">
          <h3>Event Types</h3>
          <p class="stat-value">{{ Object.keys(audit.summary.eventTypes || {}).length }}</p>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters">
        <div class="filter-group">
          <label>User</label>
          <input
            v-model="filters.user"
            type="text"
            placeholder="Filter by user..."
            @input="applyFilters"
          />
        </div>
        <div class="filter-group">
          <label>Action</label>
          <select v-model="filters.action" @change="applyFilters">
            <option value="">All Actions</option>
            <option value="login">Login</option>
            <option value="logout">Logout</option>
            <option value="user_created">User Created</option>
            <option value="user_deleted">User Deleted</option>
            <option value="permission_changed">Permission Changed</option>
            <option value="data_accessed">Data Accessed</option>
            <option value="metadata_updated">Metadata Updated</option>
          </select>
        </div>
        <div class="filter-group">
          <label>Date Range</label>
          <input
            v-model="filters.dateRange"
            type="date"
            @input="applyFilters"
          />
        </div>
      </div>

      <!-- Audit Events Table -->
      <div class="audit-table-container">
        <table class="audit-table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>User</th>
              <th>Action</th>
              <th>Details</th>
              <th>Outcome</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="event in audit.events" :key="event.eventId" :class="event.outcome">
              <td class="timestamp">{{ formatDateTime(event.timestamp) }}</td>
              <td class="user">{{ event.userName || event.userId }}</td>
              <td class="action">
                <span :class="'action-badge action-' + event.action.toLowerCase()">
                  {{ formatAction(event.action) }}
                </span>
              </td>
              <td class="details">
                <pre>{{ JSON.stringify(event.details, null, 2) }}</pre>
              </td>
              <td :class="'outcome-' + (event.outcome || 'success')">
                {{ event.outcome || 'success' }}
              </td>
            </tr>
            <tr v-if="audit.events.length === 0">
              <td colspan="5" class="no-data">No audit events found</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div class="pagination" v-if="audit.pagination && audit.pagination.totalPages > 1">
        <button
          @click="previousPage"
          :disabled="audit.pagination.page === 1"
          class="btn-small"
        >
          Previous
        </button>
        <span class="page-info">
          Page {{ audit.pagination.page }} of {{ audit.pagination.totalPages }}
        </span>
        <button
          @click="nextPage"
          :disabled="audit.pagination.page >= audit.pagination.totalPages"
          class="btn-small"
        >
          Next
        </button>
      </div>
    </div>
  `,
  data() {
    return {
      audit: {
        events: [],
        pagination: {
          page: 1, pageSize: 50, total: 0, totalPages: 0,
        },
        summary: { totalEvents: 0, uniqueUsers: 0, eventTypes: {} },
      },
      filters: {
        user: '',
        action: '',
        dateRange: '',
      },
    };
  },
  methods: {
    async loadAuditLog() {
      try {
        const params = new URLSearchParams();
        params.append('page', this.audit.pagination.page);
        params.append('pageSize', this.audit.pagination.pageSize);

        if (this.filters.user) params.append('user', this.filters.user);
        if (this.filters.action) params.append('action', this.filters.action);
        if (this.filters.dateRange) params.append('dateRange', this.filters.dateRange);

        const response = await fetch(`/api/v1/dashboard/audit?${params}`);
        this.audit = await response.json();
      } catch (err) {
        console.error('Failed to load audit log:', err);
      }
    },
    applyFilters() {
      this.audit.pagination.page = 1;
      this.loadAuditLog();
    },
    nextPage() {
      this.audit.pagination.page += 1;
      this.loadAuditLog();
    },
    previousPage() {
      this.audit.pagination.page = Math.max(1, this.audit.pagination.page - 1);
      this.loadAuditLog();
    },
    formatDateTime(timestamp) {
      return new Date(timestamp).toLocaleString();
    },
    formatAction(action) {
      return action
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
    },
    exportAuditLog() {
      const csv = this.convertAuditToCSV();
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `audit-log-${new Date().toISOString()}.csv`;
      link.click();
    },
    convertAuditToCSV() {
      const headers = ['Timestamp', 'User', 'Action', 'Details', 'Outcome'];
      const rows = this.audit.events.map((event) => [
        this.formatDateTime(event.timestamp),
        event.userName || event.userId,
        event.action,
        JSON.stringify(event.details),
        event.outcome || 'success',
      ]);
      return [headers, ...rows]
        .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
        .join('\n');
    },
  },
  mounted() {
    this.loadAuditLog();
  },
};
