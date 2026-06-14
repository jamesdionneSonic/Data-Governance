/* eslint-env browser */

function normalizedText(value, fallback = '') {
  return value === null || value === undefined || value === '' ? fallback : String(value);
}

export const WorkflowActionButton = {
  name: 'WorkflowActionButton',
  props: {
    action: {
      type: String,
      default: 'open',
    },
    label: {
      type: String,
      default: '',
    },
    loading: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
      default: 'small',
    },
    variant: {
      type: String,
      default: 'tonal',
    },
    block: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['click'],
  computed: {
    config() {
      const actions = {
        test: { label: 'Test', color: 'primary', icon: 'mdi-connection' },
        saveDraft: { label: 'Save Draft', color: 'secondary', icon: 'mdi-content-save-outline' },
        activate: { label: 'Activate', color: 'success', icon: 'mdi-play-circle-outline' },
        runNow: { label: 'Run Now', color: 'primary', icon: 'mdi-flash-outline' },
        retryPublish: { label: 'Retry Publish', color: 'warning', icon: 'mdi-upload-outline' },
        publish: { label: 'Publish', color: 'primary', icon: 'mdi-upload-outline' },
        open: { label: 'Open', color: 'primary', icon: 'mdi-open-in-new' },
      };
      return actions[this.action] || actions.open;
    },
    displayLabel() {
      return this.label || this.config.label;
    },
  },
  methods: {
    handleClick(event) {
      event?.stopPropagation?.();
      this.$emit('click', event);
    },
  },
  template: `
    <v-btn
      :size="size"
      :variant="variant"
      :color="config.color"
      :loading="loading"
      :disabled="disabled"
      :block="block"
      :prepend-icon="config.icon"
      @click="handleClick"
    >{{ displayLabel }}</v-btn>
  `,
};

export const WorkflowStatusChip = {
  name: 'WorkflowStatusChip',
  props: {
    status: {
      type: [String, Number, Boolean],
      default: '',
    },
    color: {
      type: String,
      default: '',
    },
    size: {
      type: String,
      default: 'x-small',
    },
    variant: {
      type: String,
      default: 'tonal',
    },
  },
  computed: {
    label() {
      return normalizedText(this.status, 'Unknown');
    },
    resolvedColor() {
      if (this.color) return this.color;
      const normalized = this.label.toLowerCase();
      if (['active', 'passed', 'success', 'succeeded', 'published', 'configured'].includes(normalized)) {
        return 'success';
      }
      if (['failed', 'error', 'publish_failed', 'disabled'].includes(normalized)) return 'error';
      if (['paused', 'draft', 'pending', 'warning', 'partial_failure', 'publish_ready'].includes(normalized)) {
        return 'warning';
      }
      if (['testing', 'running', 'publishing'].includes(normalized)) return 'info';
      return 'secondary';
    },
  },
  template: `
    <v-chip :size="size" :variant="variant" :color="resolvedColor">{{ label }}</v-chip>
  `,
};

export const WorkflowBlockerList = {
  name: 'WorkflowBlockerList',
  props: {
    title: {
      type: String,
      default: 'Before continuing',
    },
    blockers: {
      type: Array,
      default: () => [],
    },
    tone: {
      type: String,
      default: 'warning',
    },
  },
  computed: {
    visibleBlockers() {
      return this.blockers.map((item) => normalizedText(item)).filter(Boolean);
    },
  },
  template: `
    <div v-if="visibleBlockers.length" class="workflow-blocker-list" :class="'tone-' + tone">
      <strong>{{ title }}</strong>
      <span v-for="item in visibleBlockers" :key="item">{{ item }}</span>
    </div>
  `,
};

export const WorkflowConfidenceNote = {
  name: 'WorkflowConfidenceNote',
  components: {
    WorkflowStatusChip,
  },
  props: {
    confidence: {
      type: [Number, String],
      default: null,
    },
    label: {
      type: String,
      default: 'System confidence',
    },
    reasons: {
      type: Array,
      default: () => [],
    },
  },
  computed: {
    confidencePercent() {
      const value = Number(this.confidence);
      if (!Number.isFinite(value)) return null;
      return Math.round((value <= 1 ? value * 100 : value));
    },
    summary() {
      if (this.confidencePercent === null) return 'Confidence is based on available metadata and evidence.';
      if (this.confidencePercent >= 80) return 'The system has strong supporting evidence for this view.';
      if (this.confidencePercent >= 50) return 'The system has useful evidence, with some gaps to review.';
      return 'The system has limited evidence; use the detail drilldowns before acting.';
    },
    visibleReasons() {
      return this.reasons.map((item) => normalizedText(item)).filter(Boolean).slice(0, 4);
    },
  },
  template: `
    <div class="workflow-confidence-note">
      <div>
        <strong>{{ label }}</strong>
        <span>{{ summary }}</span>
      </div>
      <workflow-status-chip
        v-if="confidencePercent !== null"
        :status="confidencePercent + '%'"
        :color="confidencePercent >= 80 ? 'success' : confidencePercent >= 50 ? 'warning' : 'error'"
      ></workflow-status-chip>
      <ul v-if="visibleReasons.length">
        <li v-for="reason in visibleReasons" :key="reason">{{ reason }}</li>
      </ul>
    </div>
  `,
};

export const WorkflowDetailDrawer = {
  name: 'WorkflowDetailDrawer',
  props: {
    modelValue: {
      type: Boolean,
      default: false,
    },
    title: {
      type: String,
      default: 'Details',
    },
    subtitle: {
      type: String,
      default: '',
    },
    items: {
      type: Array,
      default: () => [],
    },
  },
  emits: ['update:modelValue'],
  template: `
    <v-navigation-drawer
      :model-value="modelValue"
      location="right"
      temporary
      width="420"
      @update:model-value="$emit('update:modelValue', $event)"
    >
      <div class="workflow-detail-drawer">
        <div class="section-header">
          <div>
            <span class="section-title">{{ title }}</span>
            <p v-if="subtitle" class="card-help mb-0">{{ subtitle }}</p>
          </div>
          <v-btn icon="mdi-close" variant="text" @click="$emit('update:modelValue', false)"></v-btn>
        </div>
        <div class="mini-stack">
          <div v-for="item in items" :key="item.label" class="mini-metric">
            <span>{{ item.label }}</span>
            <strong>{{ item.value || '-' }}</strong>
          </div>
        </div>
        <slot></slot>
      </div>
    </v-navigation-drawer>
  `,
};

export const workflowComponents = {
  WorkflowActionButton,
  WorkflowStatusChip,
  WorkflowBlockerList,
  WorkflowConfidenceNote,
  WorkflowDetailDrawer,
};
