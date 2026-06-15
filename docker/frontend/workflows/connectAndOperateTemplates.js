/* eslint-env browser */

export const connectionsPageTemplate = `
            <div v-if="activeView === 'integrations'" class="grid integrations-secondary-grid">
              <v-card v-if="integrations.connectorWorkflowTab === 'integrations'" class="card span-12 help-strip" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Integrations Guide</span>
                  <v-btn size="small" variant="outlined" @click="onViewChange('docs'); openDocByKey('help-center')">Open Help Center</v-btn>
                </div>
                <div class="help-strip-grid">
                  <div class="help-pill"><strong>Notifications</strong><span>Send governance events to email, Slack, or Teams.</span></div>
                  <div class="help-pill"><strong>Webhooks</strong><span>Push event payloads into external systems and test delivery.</span></div>
                  <div class="help-pill"><strong>External Links</strong><span>Attach Jira/Confluence/Runbook links to any catalog object.</span></div>
                  <div class="help-pill"><strong>CI/CD Checks</strong><span>Run impact, compliance, and docs checks before deploy.</span></div>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Connections</span>
                  <div class="btn-row">
                    <v-btn size="small" color="primary" prepend-icon="mdi-plus" @click="resetConnectorEditor">New Connection</v-btn>
                    <v-btn size="small" variant="outlined" :loading="integrations.connectorLoading" @click="loadManagedConnectors">Refresh</v-btn>
                  </div>
                </div>
                <p class="card-help">Manage reusable source access. Testing proves both login/connectivity and metadata discovery before downstream workflows use a connection.</p>
                <div class="table-wrap compact-table connections-inventory-table" v-if="integrations.managedConnectors.length">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Type</th>
                        <th>Intelligent Name</th>
                        <th>Status</th>
                        <th>Login Check</th>
                        <th>Discovery Check</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <template
                        v-for="connector in integrations.managedConnectors"
                        :key="'connection-inventory-' + connector.id"
                      >
                      <tr
                        :class="{ selected: integrations.selectedConnectorId === connector.id }"
                      >
                        <td>{{ connectorDefinitionLabel(connector.type) }}</td>
                        <td>
                          <strong>{{ connectorIntelligentName(connector) }}</strong>
                          <span class="muted-cell">{{ connector.id }}</span>
                        </td>
                        <td>
                          <workflow-status-chip
                            :status="connectorInventoryStatus(connector)"
                            :color="connectorInventoryStatusColor(connectorInventoryStatus(connector))"
                          ></workflow-status-chip>
                        </td>
                        <td>
                          <workflow-status-chip
                            :status="connectorLoginCheck(connector)"
                            :color="connectorInventoryStatusColor(connectorLoginCheck(connector))"
                          ></workflow-status-chip>
                        </td>
                        <td>
                          <workflow-status-chip
                            :status="connectorDiscoveryCheck(connector)"
                            :color="connectorInventoryStatusColor(connectorDiscoveryCheck(connector))"
                          ></workflow-status-chip>
                        </td>
                        <td>
                          <div class="btn-row">
                            <v-btn size="small" variant="outlined" @click="openManagedConnection(connector)">Open</v-btn>
                            <workflow-action-button
                              action="test"
                              :label="connectorRowTestState(connector.id).loading ? 'Testing...' : 'Test'"
                              :loading="connectorRowTestState(connector.id).loading"
                              :disabled="connectorRowTestState(connector.id).loading"
                              @click="testManagedConnector(connector)"
                            ></workflow-action-button>
                            <v-btn size="small" variant="outlined" @click="editManagedConnector(connector)">Edit</v-btn>
                            <v-btn size="small" variant="tonal" color="error" disabled @click="disableManagedConnection(connector)">Disable</v-btn>
                          </div>
                        </td>
                      </tr>
                      <tr v-if="connectorRowTestState(connector.id).status || connectorRowTestState(connector.id).test || connectorRowTestState(connector.id).error" class="connector-test-diagnostic-row">
                        <td colspan="6">
                          <div class="connector-test-diagnostics" :class="{ failed: connectorRowTestState(connector.id).status === 'failed' }">
                            <div class="section-header">
                              <span class="section-title">Test diagnostics for {{ connector.id }}</span>
                              <workflow-status-chip
                                :status="connectorRowTestState(connector.id).loading ? 'testing' : (connectorRowTestState(connector.id).status || 'completed')"
                                :color="connectorInventoryStatusColor(connectorInventoryStatus(connector))"
                              ></workflow-status-chip>
                            </div>
                            <div class="mini-stack">
                              <div class="mini-metric" v-for="item in connectorTestDiagnosticPairs(connector.id)" :key="'connector-row-diagnostic-' + connector.id + '-' + item[0]">
                                <span>{{ item[0] }}</span>
                                <strong>{{ item[1] }}</strong>
                              </div>
                            </div>
                            <workflow-blocker-list
                              v-if="connectorTestActionablePairs(connector.id).length"
                              class="mt-8"
                              title="Actionable failure"
                              tone="error"
                              :blockers="connectorTestActionablePairs(connector.id).map((item) => item[0] + ': ' + item[1])"
                            ></workflow-blocker-list>
                          </div>
                        </td>
                      </tr>
                      </template>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="connector-empty-path">
                  <strong>No reusable connections yet.</strong>
                  <span>Create a draft, test login and discovery, then save it for profiling, lineage acquisition, and catalog workflows.</span>
                </div>
                <div v-if="integrations.connectorWorkflowTab === 'integrations'" class="connector-guardrail mt-8">
                  <v-icon size="small">mdi-information-outline</v-icon>
                  <span>This is a temporary notifications drilldown. The default Connections surface owns reusable source access only.</span>
                  <v-btn size="small" variant="outlined" @click="integrations.connectorWorkflowTab = 'connection'">Back to Connections</v-btn>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'connection'" class="connector-workspace-grid">
                  <details class="connections-support-lane connector-builder-lane" :open="integrations.connectorEditor.draftMode">
                    <summary>
                      <span>Connection Builder</span>
                      <small>Create or edit connection configuration</small>
                    </summary>
                    <div class="connections-support-body">
                  <div class="managed-connector-panel connector-builder-panel">
                    <div class="panel-kicker">Connection Wizard</div>
                    <h3>Create or edit a source connection</h3>
                    <p class="card-help">Common sources use a guided setup. Advanced JSON is still available when you need it.</p>
                    <div class="connector-step-chip-row">
                      <v-chip
                        v-for="(step, index) in connectorWizardStepDefinitions"
                        :key="'connector-step-' + step.key"
                        size="small"
                        variant="tonal"
                        :color="index === integrations.connectorEditor.wizardStep ? 'primary' : (index < integrations.connectorEditor.wizardStep ? 'success' : 'default')"
                        :prepend-icon="index === integrations.connectorEditor.wizardStep ? 'mdi-circle-slice-8' : (index < integrations.connectorEditor.wizardStep ? 'mdi-check-circle' : 'mdi-circle-outline')"
                        @click="goToConnectorWizardStep(index)"
                        style="cursor:pointer;"
                      >
                        {{ step.label }}
                      </v-chip>
                    </div>

                    <div class="connector-guardrail" v-if="integrations.connectorEditor.draftMode">
                      <v-icon size="small">mdi-pencil-box-outline</v-icon>
                      <span>New unsaved connector draft. Nothing has been saved yet{{ integrations.connectorEditor.lastResetAt ? ' as of ' + formatTimestamp(integrations.connectorEditor.lastResetAt) : '' }}.</span>
                    </div>

                    <div v-if="currentConnectorWizardStep?.key === 'type'" class="mt-8">
                      <div class="form-row">
                        <div class="col-6">
                          <v-label>Connector Type</v-label>
                          <v-select
                            v-model="integrations.connectorEditor.type"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="integrations.connectorDefinitions.map((item) => ({ title: connectorDefinitionLabel(item.type), value: item.type }))"
                            @update:model-value="onConnectorTypeChanged"
                          ></v-select>
                        </div>
                        <div class="col-6">
                          <div class="connector-next-summary">
                            <div><span>Category</span><strong>{{ selectedConnectorDefinition?.category || '-' }}</strong></div>
                            <div><span>Cloud</span><strong>{{ selectedConnectorDefinition?.cloud || '-' }}</strong></div>
                            <div><span>Discovery</span><strong>{{ selectedConnectorWizard.supports_discovery ? 'Supported' : 'Not included' }}</strong></div>
                            <div><span>Testing</span><strong>{{ selectedConnectorWizard.supports_test ? 'Supported' : 'Save only' }}</strong></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'auth'" class="mt-8">
                      <div class="form-row">
                        <div class="col-6">
                          <v-label>Authentication Method</v-label>
                          <v-select
                            v-model="integrations.connectorEditor.credentialMode"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="connectorCredentialModeOptions()"
                            item-title="title"
                            item-value="value"
                            @update:model-value="syncConnectorCredentialMode"
                          ></v-select>
                          <div class="field-hint">{{ selectedConnectorAuthModeMeta?.help || connectorCredentialModeHint() }}</div>
                        </div>
                        <div class="col-6">
                          <div class="connector-next-summary">
                            <div><span>Selected Mode</span><strong>{{ selectedConnectorAuthModeMeta?.title || integrations.connectorEditor.credentialMode }}</strong></div>
                            <div><span>Secret storage</span><strong>{{ connectorSecretReferenceRequired() ? 'Reference or one-time secret' : 'Not required' }}</strong></div>
                          </div>
                        </div>
                      </div>
                      <div class="form-row mt-8">
                        <div
                          v-for="field in connectorCredentialFields"
                          :key="'connector-credential-' + field.key"
                          :class="field.input === 'textarea' ? 'col-12' : 'col-6'"
                        >
                          <v-label>{{ field.label }}</v-label>
                          <v-textarea
                            v-if="field.input === 'textarea'"
                            :model-value="connectorFieldValue(field.key, '')"
                            rows="3"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-textarea>
                          <v-text-field
                            v-else
                            :model-value="connectorFieldValue(field.key, '')"
                            :type="connectorFieldInputType(field)"
                            density="compact"
                            variant="outlined"
                            hide-details="auto"
                            :error="Boolean(connectorCredentialFieldError(field))"
                            :error-messages="connectorCredentialFieldError(field)"
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-text-field>
                          <div v-if="field.required && !connectorCredentialFieldError(field)" class="field-hint">Required</div>
                        </div>
                        <div class="col-12" v-if="connectorSecretReferenceRequired()">
                          <v-label>One-time Secret Value (optional)</v-label>
                          <v-text-field
                            v-model="integrations.connectorEditor.rawSecret"
                            density="compact"
                            variant="outlined"
                            hide-details
                            type="password"
                            placeholder="Use for a one-time test or first save. It is not shown again after save."
                          ></v-text-field>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'connection'" class="mt-8">
                      <div class="connector-guardrail" v-if="integrations.connectorEditor.type === 'sql_server' || integrations.connectorEditor.type === 'ssis'">
                        <v-icon size="small">mdi-database-sync-outline</v-icon>
                        <span>Authentication comes first here so the wizard can refresh available databases from the server instead of making you guess them.</span>
                      </div>
                      <div class="form-row">
                        <div
                          v-for="field in visibleConnectorBasicFields"
                          :key="'connector-basic-' + field.key"
                          :class="field.input === 'textarea' ? 'col-12' : 'col-6'"
                        >
                          <v-label>{{ field.label }}</v-label>
                          <div v-if="(integrations.connectorEditor.type === 'sql_server' || integrations.connectorEditor.type === 'ssis') && field.key === 'database'">
                            <div class="btn-row" style="align-items:flex-end; gap:8px;">
                              <v-combobox
                                :model-value="connectorFieldValue(field.key, '')"
                                density="compact"
                                variant="outlined"
                                hide-details="auto"
                                :items="connectorDatabaseOptions"
                                item-title="title"
                                item-value="value"
                                :loading="integrations.connectorEditor.discoveringDatabases"
                                :error="Boolean(connectorWizardFieldError(field))"
                                :error-messages="connectorWizardFieldError(field)"
                                :placeholder="field.placeholder || ''"
                                style="flex:1;"
                                @update:model-value="setConnectorFieldValue(field.key, typeof $event === 'string' ? $event : ($event?.value || ''))"
                              ></v-combobox>
                              <v-btn
                                variant="outlined"
                                :loading="integrations.connectorEditor.discoveringDatabases"
                                :disabled="!canDiscoverWizardDatabases()"
                                @click="refreshWizardDatabases()"
                              >Refresh Databases</v-btn>
                            </div>
                            <div class="field-hint">{{ connectorDatabaseHint() }}</div>
                          </div>
                          <v-select
                            v-else-if="field.input === 'select'"
                            :model-value="connectorFieldValue(field.key, '')"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="connectorFieldItems(field)"
                            item-title="title"
                            item-value="value"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-select>
                          <v-switch
                            v-else-if="field.input === 'toggle'"
                            :model-value="connectorFieldValue(field.key, false)"
                            color="primary"
                            density="compact"
                            hide-details
                            :label="field.label"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-switch>
                          <v-textarea
                            v-else-if="field.input === 'textarea'"
                            :model-value="connectorFieldValue(field.key, '')"
                            rows="3"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-textarea>
                          <v-text-field
                            v-else
                            :model-value="connectorFieldValue(field.key, '')"
                            :type="connectorFieldInputType(field)"
                            density="compact"
                            variant="outlined"
                            hide-details="auto"
                            :error="Boolean(connectorWizardFieldError(field))"
                            :error-messages="connectorWizardFieldError(field)"
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-text-field>
                          <div v-if="field.required && !connectorWizardFieldError(field)" class="field-hint">Required</div>
                        </div>
                      </div>
                      <div class="connector-guardrail" v-if="integrations.connectorEditor.type === 'sql_server' || integrations.connectorEditor.type === 'ssis'">
                        <v-icon size="small">mdi-auto-fix</v-icon>
                        <span>Server, instance, and database fields generate the connector config automatically. No hand-written JSON needed for the common case.</span>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'test'" class="mt-8">
                      <div class="form-row">
                        <div class="col-4"><v-label>Connection ID</v-label><v-text-field v-model="integrations.connectorEditor.id" density="compact" variant="outlined" hide-details="auto" placeholder="vendordata-sql" :error="Boolean(connectorEditorFieldError('id'))" :error-messages="connectorEditorFieldError('id')"></v-text-field></div>
                        <div class="col-4"><v-label>Display Label</v-label><v-text-field v-model="integrations.connectorEditor.label" density="compact" variant="outlined" hide-details="auto" placeholder="VendorData SQL Server" :error="Boolean(connectorEditorFieldError('label'))" :error-messages="connectorEditorFieldError('label')"></v-text-field></div>
                        <div class="col-4"><v-label>Description</v-label><v-text-field v-model="integrations.connectorEditor.description" density="compact" variant="outlined" hide-details placeholder="Optional"></v-text-field></div>
                      </div>
                      <div class="field-hint">These fields name the saved connector that testing, schedules, and permissions will use.</div>
                      <div class="connector-next-summary">
                        <div><span>Type</span><strong>{{ connectorDefinitionLabel(integrations.connectorEditor.type) }}</strong></div>
                        <div><span>Connection</span><strong>{{ integrations.connectorEditor.label || integrations.connectorEditor.id || 'Unsaved draft' }}</strong></div>
                        <div><span>Last test</span><strong>{{ integrations.connectorEditor.lastValidationAt ? formatTimestamp(integrations.connectorEditor.lastValidationAt) : 'Not run yet' }}</strong></div>
                        <div><span>Status</span><strong>{{ integrations.connectorEditor.testSummary?.status || 'Pending' }}</strong></div>
                      </div>
                      <div class="field-hint mt-4" v-if="integrations.connectorLoading">
                        Testing {{ integrations.connectorEditor.label || integrations.connectorEditor.id || 'connector' }}. The result card below will refresh when the live check finishes.
                      </div>
                      <div class="connector-next-summary mt-4" v-if="integrations.connectorEditor.testSummary">
                        <div><span>Config</span><strong>{{ connectorTestHealth().config }}</strong></div>
                        <div><span>Live Connection</span><strong>{{ connectorTestHealth().connection }}</strong></div>
                        <div><span>Discovery</span><strong>{{ connectorTestHealth().discovery }}</strong></div>
                        <div><span>Mode</span><strong>{{ integrations.connectorEditor.testSummary.summary?.credential_mode || integrations.connectorEditor.credentialMode || 'n/a' }}</strong></div>
                      </div>
                      <div class="mini-stack mt-4" v-if="connectorSavedConfigPairs().length">
                        <div class="mini-metric" v-for="item in connectorSavedConfigPairs()" :key="'connector-saved-config-' + item[0]">
                          <span>{{ item[0] }}</span>
                          <strong>{{ item[1] }}</strong>
                        </div>
                      </div>
                      <div class="connector-action-strip mt-8">
                        <workflow-action-button
                          action="test"
                          :label="integrations.connectorLoading ? 'Testing...' : 'Save Then Test Saved Connector'"
                          :loading="integrations.connectorLoading"
                          @click="testManagedConnectorDraft"
                        ></workflow-action-button>
                        <workflow-action-button
                          action="test"
                          variant="outlined"
                          :label="'Retest ' + (selectedManagedConnector?.label || 'Saved Connector')"
                          :disabled="!selectedManagedConnector || integrations.connectorLoading"
                          :loading="integrations.connectorLoading"
                          @click="retestSelectedManagedConnector"
                        ></workflow-action-button>
                      </div>
                      <div v-if="integrations.connectorEditor.testSummary" class="mt-8">
                        <div class="field-hint">
                          Planned objects: {{ integrations.connectorEditor.testSummary.summary?.planned_objects ?? 0 }} ·
                          Discovered objects: {{ integrations.connectorEditor.testSummary.summary?.discovered_objects ?? 0 }} ·
                          Dry run only: {{ integrations.connectorEditor.testSummary.summary?.dry_run_only ? 'Yes' : 'No' }}
                        </div>
                        <div class="mini-stack mt-4" v-if="connectorTestDetailPairs().length">
                          <div class="mini-metric" v-for="item in connectorTestDetailPairs()" :key="'connector-test-detail-' + item[0]">
                            <span>{{ item[0] }}</span>
                            <strong>{{ item[1] }}</strong>
                          </div>
                        </div>
                        <workflow-blocker-list
                          class="mt-8"
                          title="Connection test reported issues."
                          :blockers="connectorTestErrors()"
                          tone="error"
                        ></workflow-blocker-list>
                        <div class="mini-stack mt-4" v-if="connectorTestErrorMeta().length">
                          <div class="mini-metric" v-for="item in connectorTestErrorMeta()" :key="'connector-test-error-meta-' + item[0]">
                            <span>{{ item[0] }}</span>
                            <strong>{{ item[1] }}</strong>
                          </div>
                        </div>
                        <div class="field-hint mt-4" v-if="integrations.connectorEditor.testSummary?.status === 'failed'">
                          This panel now reports only the saved connector runtime result. A failed result means the actual extractor path could not reach the saved server/database with the saved auth mode.
                        </div>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'discovery'" class="mt-8">
                      <div class="connector-next-summary">
                        <div><span>Snapshot captured</span><strong>{{ integrations.connectorEditor.discoverySummary ? 'Yes' : 'Run test first' }}</strong></div>
                        <div><span>Objects discovered</span><strong>{{ integrations.connectorEditor.discoverySummary?.summary?.object_count ?? integrations.connectorEditor.testSummary?.summary?.discovered_objects ?? 0 }}</strong></div>
                        <div><span>Metadata targets</span><strong>{{ integrations.connectorEditor.metadataTargets.length }}</strong></div>
                      </div>
                      <div class="connector-guardrail">
                        <v-icon size="small">mdi-radar</v-icon>
                        <span>{{ connectorDiscoveryHeadline() }}</span>
                      </div>
                      <div class="form-row mt-8" v-if="connectorDiscoveryCollections.length">
                        <div class="col-12">
                          <div class="panel-kicker">Discovered Collections</div>
                          <div class="mini-stack">
                            <div class="mini-metric" v-for="item in connectorDiscoveryCollections" :key="'discovery-' + item.key">
                              <span>{{ item.key }}</span>
                              <strong>{{ item.count }}</strong>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="form-row mt-8">
                        <div class="col-12">
                          <v-label>Metadata To Harvest</v-label>
                          <v-select
                            v-model="integrations.connectorEditor.metadataTargets"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="(selectedConnectorDefinition?.metadata || []).map((item) => ({ title: item, value: item }))"
                            multiple
                            chips
                          ></v-select>
                          <div class="field-hint">Choose what this connector should harvest after the connection is saved.</div>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'advanced'" class="mt-8">
                      <div class="form-row">
                        <div
                          v-for="field in visibleConnectorAdvancedFields"
                          :key="'connector-advanced-' + field.key"
                          :class="field.input === 'textarea' ? 'col-12' : 'col-6'"
                        >
                          <v-label>{{ field.label }}</v-label>
                          <v-select
                            v-if="field.input === 'select'"
                            :model-value="connectorFieldValue(field.key, '')"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="connectorFieldItems(field)"
                            item-title="title"
                            item-value="value"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-select>
                          <v-switch
                            v-else-if="field.input === 'toggle'"
                            :model-value="connectorFieldValue(field.key, false)"
                            color="primary"
                            density="compact"
                            hide-details
                            :label="field.label"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-switch>
                          <v-textarea
                            v-else-if="field.input === 'textarea'"
                            :model-value="connectorFieldValue(field.key, '')"
                            rows="3"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-textarea>
                          <v-text-field
                            v-else
                            :model-value="connectorFieldValue(field.key, '')"
                            :type="connectorFieldInputType(field)"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :placeholder="field.placeholder || ''"
                            @update:model-value="setConnectorFieldValue(field.key, $event)"
                          ></v-text-field>
                        </div>
                      </div>
                      <div class="form-row mt-8">
                        <div class="col-12">
                          <v-switch
                            v-model="integrations.connectorEditor.showAdvancedJson"
                            color="primary"
                            density="compact"
                            hide-details
                            label="Show raw config JSON"
                          ></v-switch>
                          <div class="field-hint">Use this only for uncommon options or existing connector configs the wizard does not expose yet.</div>
                        </div>
                        <div class="col-12" v-if="integrations.connectorEditor.showAdvancedJson">
                          <v-label>Advanced Config JSON</v-label>
                          <v-textarea
                            v-model="integrations.connectorEditor.configJson"
                            rows="7"
                            density="compact"
                            variant="outlined"
                            hide-details="auto"
                            :error="integrations.connectorEditor.showAdvancedJson && !connectorAdvancedConfigPreview"
                            :error-messages="integrations.connectorEditor.showAdvancedJson && !connectorAdvancedConfigPreview ? 'Advanced config JSON must be valid JSON.' : ''"
                            @update:model-value="integrations.connectorEditor.rawJsonEdited = true"
                          ></v-textarea>
                        </div>
                        <div class="col-12" v-if="connectorAdvancedExtraKeys.length">
                          <div class="panel-kicker">Advanced-only keys</div>
                          <div class="field-hint">These keys are not modeled by the wizard, but they will still be preserved on save.</div>
                          <div class="btn-row mt-8">
                            <v-chip v-for="key in connectorAdvancedExtraKeys" :key="'advanced-extra-' + key" size="small" variant="tonal">{{ key }}</v-chip>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div v-else-if="currentConnectorWizardStep?.key === 'save'" class="mt-8">
                      <div class="connector-next-summary">
                        <div><span>Connection</span><strong>{{ integrations.connectorEditor.label || integrations.connectorEditor.id || '-' }}</strong></div>
                        <div><span>Type</span><strong>{{ connectorDefinitionLabel(integrations.connectorEditor.type) }}</strong></div>
                        <div><span>Credential mode</span><strong>{{ selectedConnectorAuthModeMeta?.title || integrations.connectorEditor.credentialMode }}</strong></div>
                        <div><span>Metadata targets</span><strong>{{ integrations.connectorEditor.metadataTargets.length || 0 }}</strong></div>
                      </div>
                      <div class="form-row mt-8">
                        <div class="col-12">
                          <v-label>Generated Config Preview</v-label>
                          <v-textarea :model-value="connectorGeneratedConfigPreview" rows="6" density="compact" variant="outlined" hide-details readonly></v-textarea>
                        </div>
                      </div>
                      <workflow-blocker-list
                        class="mt-8"
                        title="Before saving"
                        :blockers="connectorValidationChecklist()"
                      ></workflow-blocker-list>
                    </div>

                    <div class="connector-action-strip mt-8">
                      <v-btn variant="tonal" @click="resetConnectorEditor">New Connection</v-btn>
                      <v-btn variant="outlined" :disabled="integrations.connectorEditor.wizardStep === 0" @click="backConnectorWizard">Back</v-btn>
                      <v-btn
                        v-if="currentConnectorWizardStep?.key !== 'save'"
                        color="primary"
                        size="large"
                        prepend-icon="mdi-arrow-right"
                        min-width="220"
                        style="font-weight: 700; letter-spacing: 0; color: white;"
                        :disabled="!connectorWizardCanAdvance()"
                        @click="advanceConnectorWizard"
                      >{{ connectorWizardNextLabel }}</v-btn>
                      <workflow-action-button
                        v-else
                        action="saveDraft"
                        label="Save Connection"
                        :loading="integrations.connectorLoading"
                        @click="saveManagedConnector"
                      ></workflow-action-button>
                    </div>
                  </div>
                    </div>
                  </details>

                  <div class="managed-connector-panel connector-detail-primary">
                    <div class="panel-kicker">Connection Detail</div>
                    <div v-if="selectedManagedConnector">
                      <h3>{{ connectorIntelligentName(selectedManagedConnector) }}</h3>
                      <p class="card-help">{{ selectedManagedConnector.description || 'Reusable source access for catalog, profiling, and lineage workflows.' }}</p>
                      <div class="connector-next-summary">
                        <div><span>Type</span><strong>{{ connectorDefinitionLabel(selectedManagedConnector.type) }}</strong></div>
                        <div><span>Status</span><strong>{{ connectorInventoryStatus(selectedManagedConnector) }}</strong></div>
                        <div><span>Login check</span><strong>{{ connectorLoginCheck(selectedManagedConnector) }}</strong></div>
                        <div><span>Discovery check</span><strong>{{ connectorDiscoveryCheck(selectedManagedConnector) }}</strong></div>
                      </div>
                      <div class="connector-next-summary mt-8">
                        <div><span>Credential mode</span><strong>{{ selectedManagedConnector.credential?.mode || 'Not set' }}</strong></div>
                        <div><span>Credential status</span><strong>{{ selectedManagedConnector.credential?.status || 'Unknown' }}</strong></div>
                        <div><span>Metadata targets</span><strong>{{ (selectedManagedConnector.metadata_targets || []).length || 'Default' }}</strong></div>
                        <div><span>Related schedules</span><strong>{{ selectedConnectorSchedules.length }}</strong></div>
                      </div>
                      <div class="btn-row mt-8">
                        <v-btn size="small" variant="outlined" @click="loadManagedConnectorSnapshot(selectedManagedConnector.id)">Refresh Discovery Detail</v-btn>
                        <v-btn size="small" variant="outlined" @click="integrations.connectorWorkflowTab = 'access'">Manage Access</v-btn>
                        <v-btn size="small" variant="tonal" @click="openRelatedProfilingQueueFromConnection">Open Related Profiling Queue</v-btn>
                      </div>
                      <div class="connector-guardrail mt-8">
                        <v-icon size="small">mdi-transit-connection-variant</v-icon>
                        <span>Profile runs, publishing, and schedule controls belong to Profiling. Connections only shows whether this source is used by profile queues.</span>
                      </div>
                    </div>
                    <div v-else class="connector-empty-path">
                      <strong>Select a connection to open details.</strong>
                      <span>The detail view shows summary, latest test evidence, discovery results, access, advanced config, and related schedules as drilldowns.</span>
                    </div>
                    <details class="connections-support-lane compact mt-8">
                      <summary>
                        <span>Schedule Relationships</span>
                        <small>{{ selectedConnectorSchedules.length }} profile queue{{ selectedConnectorSchedules.length === 1 ? '' : 's' }} use this connection</small>
                      </summary>
                      <div class="connections-support-body">
                        <div class="mini-stack mb-8">
                          <div class="mini-metric"><span>Used by schedules</span><strong>{{ selectedConnectorSchedules.length }}</strong></div>
                          <div class="mini-metric"><span>Active queue</span><strong>{{ selectedConnectorActiveSchedule?.name || selectedConnectorActiveSchedule?.id || 'None' }}</strong></div>
                        </div>
                        <div class="connector-action-strip">
                          <v-btn size="small" variant="outlined" @click="openRelatedProfilingQueueFromConnection">Open Related Profiling Queue</v-btn>
                          <v-btn size="small" variant="outlined" @click="onViewChange('scheduler')">Open Profiling Queue Health</v-btn>
                          <v-btn size="small" variant="outlined" @click="integrations.connectorWorkflowTab = 'integrations'">Notifications Drilldown</v-btn>
                        </div>
                      </div>
                    </details>
                  </div>
                </div>

                <div v-if="integrations.connectorWorkflowTab === 'access'" class="managed-connector-panel">
                  <div class="panel-kicker">Grant Access</div>
                  <p class="card-help">After a connector is saved, grant users, groups, or roles permission to view/run it without seeing secrets.</p>
                  <div class="form-row">
                    <div class="col-3"><v-label>Connector</v-label><v-select v-model="integrations.connectorGrant.connectorId" density="compact" variant="outlined" hide-details :items="integrations.managedConnectors.map((item) => item.id)"></v-select></div>
                    <div class="col-2"><v-label>Scope</v-label><v-select v-model="integrations.connectorGrant.scope" density="compact" variant="outlined" hide-details :items="['users','roles','groups']"></v-select></div>
                    <div class="col-3"><v-label>Subject</v-label><v-text-field v-model="integrations.connectorGrant.subject" density="compact" variant="outlined" hide-details></v-text-field></div>
                    <div class="col-3"><v-label>Actions</v-label><v-text-field v-model="integrations.connectorGrant.actions" density="compact" variant="outlined" hide-details></v-text-field></div>
                    <div class="col-1" style="display:flex;align-items:end;"><v-btn size="small" color="primary" @click="grantManagedConnectorPermission">Grant</v-btn></div>
                  </div>
                </div>

              </v-card>

            </div>


`;

export const profilingSchedulerPageTemplate = `
            <div v-if="activeView === 'scheduler'" class="workflow-page scheduler-page">
              <v-card class="card span-12 profile-scheduler-card" variant="outlined">
                <div class="profile-queue-answer profile-clean-hero">
                  <div>
                    <span class="panel-kicker">Profiling</span>
                    <h2>{{ profileQueueHeroAnswer }}</h2>
                    <p class="card-help mb-0">Monitor profile schedules and open a queue only when something needs attention.</p>
                  </div>
                  <div class="profile-clean-actions">
                    <workflow-status-chip
                      :status="profileQueueHealthSummary.needsAttention ? 'Needs attention' : (profileQueueHealthSummary.running ? 'Running normally' : 'Waiting')"
                      :color="profileQueueHealthSummary.needsAttention ? 'error' : (profileQueueHealthSummary.running ? 'info' : 'success')"
                    ></workflow-status-chip>
                    <v-btn
                      color="primary"
                      size="small"
                      @click="openProfileScheduleEditor(true)"
                    >New Schedule</v-btn>
                    <v-btn
                      icon="mdi-refresh"
                      size="small"
                      variant="text"
                      aria-label="Refresh profile queues"
                      :loading="integrations.profileScheduleLoading"
                      @click="loadProfileSchedules"
                    ></v-btn>
                  </div>
                </div>

                <div class="profile-scheduler-stats">
                  <div class="scheduler-stat"><span>Total</span><strong>{{ profileScheduleStats.total }}</strong></div>
                  <div class="scheduler-stat"><span>Running</span><strong>{{ profileQueueHealthSummary.running }}</strong></div>
                  <div class="scheduler-stat"><span>Finished</span><strong>{{ profileQueueHealthSummary.completed }}</strong></div>
                  <div class="scheduler-stat"><span>Needs Attention</span><strong>{{ profileQueueHealthSummary.needsAttention }}</strong></div>
                  <div class="scheduler-stat"><span>Next Run</span><strong>{{ formatTimestamp(profileQueueHealthSummary.nextRunAt) }}</strong></div>
                </div>

                <div
                  v-if="integrations.profilePageIssues.length"
                  class="profile-page-issues"
                  role="status"
                  aria-live="polite"
                >
                  <div class="section-header">
                    <div>
                      <span class="section-title">Profiling Needs Attention</span>
                      <p class="card-help mb-0">Some profiling data did not load. The last known queue information stays visible while you retry.</p>
                    </div>
                    <v-btn
                      size="small"
                      variant="outlined"
                      :loading="integrations.profileScheduleLoading || integrations.profileQueueLoading"
                      @click="loadProfileSchedules"
                    >Retry</v-btn>
                  </div>
                  <workflow-blocker-list
                    title="Current loading issue"
                    tone="error"
                    :blockers="integrations.profilePageIssues.map((issue) => issue.message + (issue.details ? ' ' + issue.details : ''))"
                  ></workflow-blocker-list>
                </div>

                <div v-if="integrations.schedulerOpsTab === 'runNow'" class="connector-workspace-grid mt-8">
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">One-Time Profile</div>
                    <h3>Run a profile now</h3>
                    <p class="card-help">Use this Profiling surface to run an immediate aggregate, BI, or metadata profile against a saved connection. Connections owns source access; Profiling owns execution.</p>
                    <div class="form-row">
                      <div class="col-4"><v-label>Saved Connection</v-label><v-select v-model="integrations.profileRunEditor.connectorId" density="compact" variant="outlined" hide-details :items="profileScheduleConnectorOptions" @update:model-value="integrations.selectedConnectorId = integrations.profileRunEditor.connectorId"></v-select></div>
                      <div class="col-3"><v-label>Profile Type</v-label><v-select v-model="integrations.profileRunEditor.profileType" density="compact" variant="outlined" hide-details :items="profileScheduleTypeOptions"></v-select></div>
                      <div class="col-3"><v-label>Run Mode</v-label><v-select v-model="integrations.profileRunEditor.executionMode" density="compact" variant="outlined" hide-details :items="[{ title: 'Dry run / plan only', value: 'dry_run' }, { title: 'Live aggregate profile', value: 'live' }]"></v-select></div>
                      <div class="col-2" style="display:flex;align-items:end;">
                        <workflow-action-button
                          action="runNow"
                          block
                          :loading="integrations.connectorLoading"
                          :disabled="!integrations.profileRunEditor.connectorId"
                          @click="runOneTimeProfile"
                        ></workflow-action-button>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-8"><v-label>Tables / Object IDs</v-label><v-textarea v-model="integrations.profileRunEditor.assetIds" rows="4" density="compact" variant="outlined" hide-details placeholder="Optional for metadata/BI. For aggregate database profiling, enter one table object id per line, such as GPA.dbo.SomeTable."></v-textarea></div>
                      <div class="col-4"><v-label>Streams</v-label><v-text-field v-model="integrations.profileRunEditor.streams" density="compact" variant="outlined" hide-details placeholder="reports, dashboards, lineage"></v-text-field><div class="field-hint">Use streams for BI, catalog, pipeline, or metadata profiles. Leave blank for aggregate SQL profiling.</div></div>
                    </div>
                    <div class="form-row mt-8" v-if="integrations.profileRunEditor.profileType === 'aggregate'">
                      <div class="col-3"><v-label>Coverage Mode</v-label><v-select v-model="integrations.profileRunEditor.coverageMode" density="compact" variant="outlined" hide-details :items="profileCoverageModeOptions()"></v-select></div>
                      <div class="col-3"><v-label>Live Queue Order</v-label><v-select v-model="integrations.profileRunEditor.livePriority" density="compact" variant="outlined" hide-details :items="profileLivePriorityOptions()"></v-select></div>
                      <div class="col-2"><v-label>Live Batch Size</v-label><v-text-field v-model.number="integrations.profileRunEditor.maxLiveTables" type="number" min="1" max="25" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell"><v-switch v-model="integrations.profileRunEditor.includeViews" color="primary" density="compact" hide-details label="Include views"></v-switch></div>
                      <div class="col-2">
                        <div class="field-hint" style="padding-top: 28px;">Use 1 for a careful daytime queue, then raise off-hours.</div>
                      </div>
                    </div>
                    <div class="connector-action-strip mt-8">
                      <v-btn variant="tonal" :disabled="!integrations.profileRunEditor.connectorId" @click="prepareScheduleForSelectedConnector">Schedule this profile</v-btn>
                      <v-btn variant="outlined" :disabled="!integrations.profileRunEditor.connectorId" @click="loadManagedConnectorRuns(integrations.profileRunEditor.connectorId); integrations.schedulerOpsTab = 'runs'">Refresh History</v-btn>
                    </div>
                  </div>
                  <div class="managed-connector-panel">
                    <div class="panel-kicker">Run Plan</div>
                    <div class="connector-next-summary">
                      <div><span>Connection</span><strong>{{ selectedManagedConnector?.label || 'Choose a saved connection' }}</strong></div>
                      <div><span>Profile</span><strong>{{ integrations.profileRunEditor.profileType }}</strong></div>
                      <div><span>Mode</span><strong>{{ integrations.profileRunEditor.executionMode === 'live' ? 'Live aggregate query' : 'Dry run / plan' }}</strong></div>
                      <div v-if="integrations.profileRunEditor.profileType === 'aggregate'"><span>Queue Order</span><strong>{{ profileLivePriorityLabel(integrations.profileRunEditor.livePriority) }}</strong></div>
                      <div v-if="integrations.profileRunEditor.profileType === 'aggregate'"><span>Live Batch</span><strong>{{ integrations.profileRunEditor.maxLiveTables }}</strong></div>
                      <div><span>Raw data retained</span><strong>No</strong></div>
                    </div>
                    <div class="connector-guardrail">
                      <v-icon size="small">mdi-shield-lock-outline</v-icon>
                      <span>Profiles store counts, nulls, min/max, distinct counts, and classification signals. Raw values are not stored.</span>
                    </div>
                  </div>
                </div>

                <div class="managed-connector-results profile-default-schedules">
                  <div class="section-header">
                    <div>
                      <span class="section-title">Live Profile Queues</span>
                      <p class="card-help mb-0">Plain-English queue rows, sorted by action needed, with counts marked unknown when the current APIs do not report them.</p>
                    </div>
                  </div>
                  <div class="profile-schedule-list profile-queue-health-list" v-if="profileQueueHealthRows.length">
                        <div
                          v-for="row in profileQueueHealthRows"
                          :key="'profile-queue-health-' + row.id"
                          class="profile-schedule-row profile-queue-health-row"
                          :class="{ selected: focusedProfileSchedule?.id === row.id }"
                        >
                          <div class="profile-schedule-main">
                            <div class="profile-schedule-title">
                              <strong>{{ row.name }}</strong>
                              <workflow-status-chip
                                :status="row.statusLabel"
                                :color="row.statusColor"
                              ></workflow-status-chip>
                              <v-chip size="x-small" variant="tonal">{{ row.typeLabel }}</v-chip>
                            </div>
                            <div class="profile-schedule-meta">
                              <span>{{ row.source }}</span>
                              <span>completed {{ row.completedLabel }}</span>
                              <span>failed {{ row.failedLabel }}</span>
                              <span>remaining {{ row.pendingLabel }}</span>
                              <span>next {{ formatTimestamp(row.nextRunAt) }}</span>
                            </div>
                            <div class="profile-schedule-health">
                              <span>{{ row.coverageModeLabel }}</span>
                              <span>{{ row.livePriorityLabel }}</span>
                              <span>Batch {{ row.maxLiveTables }}</span>
                              <span>timeouts {{ row.timeoutPenaltyLabel }}</span>
                            </div>
                            <workflow-blocker-list
                              class="mt-8"
                              v-if="row.blockers.length"
                              title="Blocked or needs attention"
                              :blockers="row.blockers"
                            ></workflow-blocker-list>
                            <div class="field-hint mt-4">{{ row.explanation }} {{ row.nextAction }}</div>
                          </div>
                          <div class="profile-schedule-actions">
                            <v-btn size="small" variant="outlined" @click="focusProfileSchedule(row.schedule); integrations.schedulerOpsTab = 'queues'">Open Queue</v-btn>
                          </div>
                        </div>
                  </div>
                  <div v-else class="empty-state scheduler-empty">
                    <div class="empty-state-icon"><v-icon>mdi-calendar-clock</v-icon></div>
                    <h4>No profile schedules yet</h4>
                    <p>Create a one-database schedule from an approved connection.</p>
                  </div>
                </div>

                <details v-if="profileOperatorToolsOpen" class="profile-support-lane profile-operator-lane" :open="profileOperatorToolsOpen">
                  <summary
                    aria-controls="profile-operator-tools-body"
                    :aria-expanded="profileOperatorToolsOpen ? 'true' : 'false'"
                    @click.prevent="openProfileOperatorTools"
                  >
                    <span>Advanced / Operator Tools</span>
                    <small>Open operational tools after reviewing queue health</small>
                  </summary>
                  <div
                    v-if="profileOperatorToolsOpen"
                    id="profile-operator-tools-body"
                    class="profile-support-body"
                  >
                    <div class="btn-row mb-8">
                      <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="startProfileSchedulerWorker">Start Worker</v-btn>
                      <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="stopProfileSchedulerWorker">Stop Worker</v-btn>
                      <v-btn size="small" variant="outlined" :loading="integrations.profileScheduleLoading" @click="tickProfileSchedules">Run Due</v-btn>
                    </div>
                    <div class="scheduler-runtime-bar">
                      <span>Persistence {{ integrations.profileSchedulerStatus?.persistence_enabled ? 'on' : 'off' }}</span>
                      <span>Interval {{ Math.round((integrations.profileSchedulerStatus?.interval_ms || 0) / 1000) || '-' }}s</span>
                      <span>History {{ integrations.profileSchedulerStatus?.history_count ?? 0 }}</span>
                      <span>Last tick {{ formatTimestamp(integrations.profileSchedulerStatus?.last_tick_at) }}</span>
                      <span v-if="integrations.profileSchedulerStatus?.artifact_dir">Artifacts {{ integrations.profileSchedulerStatus.artifact_dir }}</span>
                      <span v-if="integrations.profileSchedulerStatus?.last_error" class="scheduler-runtime-error">Error {{ integrations.profileSchedulerStatus.last_error.message }}</span>
                    </div>
                    <div class="connector-workflow-tabs">
                      <v-btn-toggle v-model="integrations.schedulerOpsTab" mandatory density="compact" variant="outlined">
                        <v-btn value="overview" prepend-icon="mdi-view-dashboard-outline">Overview</v-btn>
                        <v-btn value="runNow" prepend-icon="mdi-play-circle">Run Now</v-btn>
                        <v-btn value="queues" prepend-icon="mdi-format-list-bulleted-square">Queue Detail</v-btn>
                        <v-btn value="runs" prepend-icon="mdi-history">Run History</v-btn>
                        <v-btn value="publishing" prepend-icon="mdi-upload">Publish Readiness</v-btn>
                        <v-btn value="settings" prepend-icon="mdi-cog-outline">Schedule Settings</v-btn>
                      </v-btn-toggle>
                    </div>
                  </div>
                </details>

                <div class="managed-connector-results profile-queue-detail" v-if="focusedProfileSchedule && integrations.schedulerOpsTab === 'queues'">
                  <div class="section-header">
                    <div>
                      <span class="section-title">Selected Queue Detail</span>
                      <p class="card-help mb-0">A focused health readout for {{ profileQueueHealthRow(focusedProfileSchedule).name }} before opening queue internals.</p>
                    </div>
                    <div class="btn-row">
                      <workflow-status-chip
                        :status="profileQueueHealthRow(focusedProfileSchedule).statusLabel"
                        :color="profileQueueHealthRow(focusedProfileSchedule).statusColor"
                      ></workflow-status-chip>
                      <v-chip size="x-small" variant="tonal">{{ profileQueueHealthRow(focusedProfileSchedule).source }}</v-chip>
                      <v-btn size="small" variant="outlined" :loading="integrations.profileQueueLoading" @click="focusProfileSchedule(focusedProfileSchedule)">Refresh Queue</v-btn>
                    </div>
                  </div>

                  <div class="profile-queue-detail-hero">
                    <div>
                      <span class="panel-kicker">Health Summary</span>
                      <h3>{{ profileQueueHealthRow(focusedProfileSchedule).explanation }}</h3>
                      <p class="card-help mb-0">{{ profileQueueHealthRow(focusedProfileSchedule).nextAction }}</p>
                    </div>
                    <div class="btn-row">
                      <workflow-action-button
                        action="runNow"
                        label="Run Now"
                        :disabled="focusedProfileSchedule.status !== 'ACTIVE'"
                        @click="runProfileSchedule(focusedProfileSchedule.id)"
                      ></workflow-action-button>
                      <v-btn
                        v-if="focusedProfileSchedule.status === 'ACTIVE'"
                        size="small"
                        variant="tonal"
                        @click="updateProfileScheduleStatus(focusedProfileSchedule, 'PAUSED')"
                      >Pause</v-btn>
                      <v-btn
                        v-else
                        size="small"
                        variant="tonal"
                        @click="updateProfileScheduleStatus(focusedProfileSchedule, 'ACTIVE')"
                      >Activate</v-btn>
                    </div>
                  </div>

                  <div class="mini-stack">
                    <div class="mini-metric"><span>Completed Live Profiles</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).completedLabel }}</strong></div>
                    <div class="mini-metric"><span>Failed Live Profiles</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).failedLabel }}</strong></div>
                    <div class="mini-metric"><span>Remaining Live Queue</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).pendingLabel }}</strong></div>
                    <div class="mini-metric"><span>Selected This Run</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).selectedLabel }}</strong></div>
                    <div class="mini-metric"><span>Fresh Skips</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).freshSkippedLabel }}</strong></div>
                    <div class="mini-metric"><span>Timeout Retries</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).timeoutPenaltyLabel }}</strong></div>
                    <div class="mini-metric"><span>Last Result</span><strong>{{ profileQueueHealthRow(focusedProfileSchedule).lastResult }}</strong></div>
                    <div class="mini-metric"><span>Next Run</span><strong>{{ formatTimestamp(profileQueueHealthRow(focusedProfileSchedule).nextRunAt) }}</strong></div>
                  </div>

                  <workflow-blocker-list
                    v-if="profileQueueHealthRow(focusedProfileSchedule).blockers.length"
                    class="mt-8"
                    title="Current blocker"
                    tone="error"
                    :blockers="profileQueueHealthRow(focusedProfileSchedule).blockers"
                  ></workflow-blocker-list>
                  <workflow-blocker-list
                    v-else-if="connectorRunBlockedByMissingColumns(focusedProfileRecentRun)"
                    class="mt-8"
                    title="Live profiling blocked by missing column metadata"
                    tone="error"
                    :blockers="connectorRunAffectedObjects(focusedProfileRecentRun).length ? connectorRunAffectedObjects(focusedProfileRecentRun) : ['Refresh source column metadata for the selected live-profile assets, then rerun the profile schedule.']"
                  ></workflow-blocker-list>

                  <details class="profile-queue-internals-lane">
                    <summary>
                      <span>Queue Internals</span>
                      <small>Next objects, deferred objects, freshness skips, and timeout retries for operator troubleshooting</small>
                    </summary>
                    <div class="profile-support-body">
                      <div class="profile-schedule-list">
                        <div
                          v-for="schedule in operatorScheduleCandidates"
                          :key="'scheduler-queue-focus-' + schedule.id"
                          class="profile-schedule-row"
                          :class="{ selected: focusedProfileSchedule?.id === schedule.id }"
                        >
                          <div class="profile-schedule-main">
                            <div class="profile-schedule-title">
                              <strong>{{ schedule.name }}</strong>
                              <workflow-status-chip
                                :status="profileQueueHealthRow(schedule).statusLabel"
                                :color="profileQueueHealthRow(schedule).statusColor"
                              ></workflow-status-chip>
                            </div>
                            <div class="profile-schedule-meta">
                              <span>{{ schedule.connector_id }}</span>
                              <span>{{ profileLivePriorityLabel(scheduleQueueSummary(schedule).livePriority) }}</span>
                              <span>Batch {{ scheduleQueueSummary(schedule).maxLiveTables }}</span>
                            </div>
                          </div>
                          <div class="btn-row">
                            <v-btn size="small" variant="outlined" @click="focusProfileSchedule(schedule)">Open Queue</v-btn>
                            <v-btn size="small" variant="outlined" @click="editProfileSchedule(schedule)">Edit</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="table-wrap compact-table" v-if="focusedQueueNextAssets.length">
                        <table>
                          <thead>
                            <tr>
                              <th>Object</th>
                              <th>Type</th>
                              <th>Downstream</th>
                              <th>Rows</th>
                              <th>Columns</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in focusedQueueNextAssets" :key="'scheduler-queue-next-' + asset.asset_id">
                              <td>{{ asset.asset_id }}</td>
                              <td>{{ queueObjectTypeLabel(asset.object_type) }}</td>
                              <td>{{ asset.downstream_count ?? '-' }}</td>
                              <td>{{ formatEstimatedRows(asset.estimated_rows) }}</td>
                              <td>{{ asset.column_count ?? '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="table-wrap compact-table" v-if="focusedQueueDeferredAssets.length">
                        <table>
                          <thead>
                            <tr>
                              <th>Queued Later</th>
                              <th>Rank</th>
                              <th>Type</th>
                              <th>Downstream</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in focusedQueueDeferredAssets" :key="'scheduler-queue-later-' + asset.asset_id">
                              <td>{{ asset.asset_id }}</td>
                              <td>{{ asset.queue_rank }}</td>
                              <td>{{ queueObjectTypeLabel(asset.object_type) }}</td>
                              <td>{{ asset.downstream_count ?? '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="table-wrap compact-table" v-if="focusedQueueFreshSkippedAssets.length">
                        <table>
                          <thead>
                            <tr>
                              <th>Skipped As Fresh</th>
                              <th>Type</th>
                              <th>Reason</th>
                              <th>Rows</th>
                              <th>Columns</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in focusedQueueFreshSkippedAssets" :key="'scheduler-queue-fresh-' + asset.asset_id">
                              <td>{{ asset.asset_id }}</td>
                              <td>{{ queueObjectTypeLabel(asset.object_type) }}</td>
                              <td>{{ asset.skip_reason === 'fresh_within_window' ? 'Profile is newer than freshness window' : asset.skip_reason }}</td>
                              <td>{{ formatEstimatedRows(asset.estimated_rows) }}</td>
                              <td>{{ asset.column_count ?? '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                      <div class="table-wrap compact-table" v-if="focusedQueueTimeoutAssets.length">
                        <table>
                          <thead>
                            <tr>
                              <th>Timed Out Recently</th>
                              <th>Penalty</th>
                              <th>Type</th>
                              <th>Rows</th>
                              <th>Downstream</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in focusedQueueTimeoutAssets" :key="'scheduler-queue-timeout-' + asset.asset_id">
                              <td>{{ asset.asset_id }}</td>
                              <td>{{ asset.timeout_penalty_count }}</td>
                              <td>{{ queueObjectTypeLabel(asset.object_type) }}</td>
                              <td>{{ formatEstimatedRows(asset.estimated_rows) }}</td>
                              <td>{{ asset.downstream_count ?? '-' }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                </div>

                <v-dialog
                  v-model="integrations.profileScheduleEditorOpen"
                  class="profile-schedule-dialog"
                  max-width="1280"
                  scrollable
                >
                  <v-card class="profile-schedule-dialog-card">
                    <div class="profile-schedule-dialog-header">
                      <div>
                        <span class="panel-kicker">Profiling</span>
                        <h3>{{ integrations.profileScheduleEditor.id ? 'Edit Queue Schedule' : 'New Queue Schedule' }}</h3>
                        <p class="card-help mb-0">Create one live profiling queue for one approved database connection.</p>
                      </div>
                      <v-btn
                        icon="mdi-close"
                        variant="text"
                        aria-label="Close schedule editor"
                        @click="closeProfileScheduleEditor"
                      ></v-btn>
                    </div>
                    <v-card-text>
                      <div
                        class="profile-scheduler-layout"
                        :class="{ 'profile-scheduler-layout-single': !integrations.profileSchedules.length }"
                      >
                  <div class="managed-connector-panel scheduler-editor-panel">
                    <div class="panel-kicker">{{ integrations.profileScheduleEditor.id ? 'Edit Queue Settings' : 'New Queue Schedule' }}</div>
                    <div class="connector-next-summary mb-8">
                      <div><span>Scope rule</span><strong>One database per schedule</strong></div>
                      <div><span>Selected database</span><strong>{{ selectedProfileScheduleEditorConnector?.config?.database || 'Choose a database connection' }}</strong></div>
                      <div><span>Login check</span><strong>{{ selectedProfileScheduleEditorConnector ? connectorLoginCheck(selectedProfileScheduleEditorConnector) : 'Pending' }}</strong></div>
                      <div><span>Discovery check</span><strong>{{ selectedProfileScheduleEditorConnector ? connectorDiscoveryCheck(selectedProfileScheduleEditorConnector) : 'Pending' }}</strong></div>
                    </div>
                    <div class="form-row">
                      <div class="col-4"><v-label>Connector</v-label><v-select v-model="integrations.profileScheduleEditor.connectorId" density="compact" variant="outlined" hide-details :items="profileScheduleConnectorOptions"></v-select></div>
                      <div class="col-4"><v-label>Name</v-label><v-text-field v-model="integrations.profileScheduleEditor.name" density="compact" variant="outlined" hide-details placeholder="VendorData live queue"></v-text-field></div>
                      <div class="col-2"><v-label>Profile</v-label><v-select v-model="integrations.profileScheduleEditor.profileType" density="compact" variant="outlined" hide-details :items="profileScheduleTypeOptions"></v-select></div>
                      <div class="col-2"><v-label>Status</v-label><v-select v-model="integrations.profileScheduleEditor.status" density="compact" variant="outlined" hide-details :items="['ACTIVE','PAUSED']"></v-select></div>
                    </div>
                    <div class="profile-date-time-grid mt-8">
                      <div>
                        <v-label>Start Date</v-label>
                        <v-text-field v-model="integrations.profileScheduleEditor.date" type="date" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-calendar"></v-text-field>
                      </div>
                      <div>
                        <v-label>Start Time</v-label>
                        <v-text-field v-model="integrations.profileScheduleEditor.time" type="time" density="compact" variant="outlined" hide-details prepend-inner-icon="mdi-clock-outline"></v-text-field>
                      </div>
                      <div>
                        <v-label>Cadence</v-label>
                        <v-select v-model="integrations.profileScheduleEditor.cadence" density="compact" variant="outlined" hide-details :items="profileScheduleCadenceOptions" @update:model-value="syncProfileScheduleInterval"></v-select>
                      </div>
                      <div>
                        <v-label>Minutes</v-label>
                        <v-text-field v-model.number="integrations.profileScheduleEditor.intervalMinutes" type="number" min="5" density="compact" variant="outlined" hide-details :disabled="integrations.profileScheduleEditor.cadence !== 'custom'"></v-text-field>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-4"><v-label>Timezone Label</v-label><v-text-field v-model="integrations.profileScheduleEditor.timezone" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2"><v-label>Max Failures</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxFailures" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-4"><v-label>Streams</v-label><v-text-field v-model="integrations.profileScheduleEditor.streams" density="compact" variant="outlined" hide-details placeholder="reports, dashboards, lineage"></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell">
                        <v-chip size="small" color="success" variant="tonal">Live only</v-chip>
                      </div>
                    </div>
                    <div class="form-row mt-8 profile-schedule-options-row" v-if="integrations.profileScheduleEditor.profileType === 'aggregate' || integrations.profileScheduleEditor.profileType === 'auto'">
                      <div class="col-4"><v-label>Coverage Mode</v-label><v-select v-model="integrations.profileScheduleEditor.coverageMode" density="compact" variant="outlined" hide-details :items="profileCoverageModeOptions()"></v-select></div>
                      <div class="col-4"><v-label>Live Queue Order</v-label><v-select v-model="integrations.profileScheduleEditor.livePriority" density="compact" variant="outlined" hide-details :items="profileLivePriorityOptions()"></v-select></div>
                      <div class="col-2"><v-label>Live Batch Size</v-label><v-text-field v-model.number="integrations.profileScheduleEditor.maxLiveTables" type="number" min="1" max="25" density="compact" variant="outlined" hide-details></v-text-field></div>
                      <div class="col-2 scheduler-switch-cell">
                        <v-switch v-model="integrations.profileScheduleEditor.includeViews" color="primary" density="compact" hide-details label="Include views"></v-switch>
                      </div>
                      <div class="col-12">
                        <div class="field-hint">Most-used-first with a moderate batch keeps the queue moving without hiding heavy tables.</div>
                      </div>
                    </div>
                    <div class="form-row mt-8 profile-schedule-options-row" v-if="integrations.profileScheduleEditor.profileType === 'aggregate' || integrations.profileScheduleEditor.profileType === 'auto'">
                      <div class="col-3 scheduler-switch-cell">
                        <v-switch v-model="integrations.profileScheduleEditor.autoPublish" color="primary" density="compact" hide-details label="Auto-publish"></v-switch>
                      </div>
                      <div class="col-5"><v-label>Publish Targets</v-label><v-select v-model="integrations.profileScheduleEditor.publishTargets" density="compact" variant="outlined" hide-details :items="profilePublishTargetOptions" multiple chips :disabled="!integrations.profileScheduleEditor.autoPublish"></v-select></div>
                      <div class="col-4 profile-schedule-inline-hint">
                        <div class="field-hint">Auto-publish can push successful live queue batches into DevOps without a manual publish step.</div>
                      </div>
                    </div>
                    <div class="form-row mt-8">
                      <div class="col-12">
                        <v-label>Schema / Table Scope</v-label>
                        <v-textarea v-model="integrations.profileScheduleEditor.assetIds" rows="3" density="compact" variant="outlined" hide-details placeholder="Leave blank for all discovered schemas in the selected database, or pin one schema/table/object id per line."></v-textarea>
                        <div class="field-hint">Schema selection uses the existing schedule scope field during this migration pass; backend execution semantics are unchanged.</div>
                      </div>
                    </div>
                    <workflow-blocker-list
                      class="mt-8"
                      title="Schedule blockers"
                      :blockers="profileScheduleEditorBlockers()"
                    ></workflow-blocker-list>
                    <div class="scheduler-guardrail mt-8">
                      <v-icon size="small">mdi-shield-lock-outline</v-icon>
                      <span>Saved schedules strip inline metadata payloads, mocks, tokens, secrets, and credential references before persistence.</span>
                    </div>
                    <div class="btn-row mt-8">
                      <v-btn color="primary" :loading="integrations.profileScheduleLoading" @click="saveProfileSchedule">{{ integrations.profileScheduleEditor.id ? 'Update Schedule' : 'Create Schedule' }}</v-btn>
                      <v-btn variant="outlined" @click="closeProfileScheduleEditor">Cancel</v-btn>
                      <v-btn variant="tonal" @click="resetProfileScheduleEditor">Clear</v-btn>
                    </div>
                  </div>

                  <div class="managed-connector-panel scheduler-list-panel" v-if="integrations.profileSchedules.length">
                    <div class="panel-kicker">Saved Queues</div>
                    <div class="profile-schedule-list">
                      <div v-for="schedule in integrations.profileSchedules" :key="'profile-schedule-' + schedule.id" class="profile-schedule-row">
                        <div class="profile-schedule-main">
                          <div class="profile-schedule-title">
                            <strong>{{ schedule.name }}</strong>
                            <v-chip size="x-small" variant="tonal" :color="scheduleStatusColor(schedule.status)">{{ schedule.status }}</v-chip>
                            <v-chip size="x-small" variant="tonal">{{ schedule.profile_type }}</v-chip>
                          </div>
                          <div class="profile-schedule-meta">
                            <span>{{ schedule.connector_id }}</span>
                            <span>{{ schedule.cadence }} / {{ schedule.interval_minutes }} min</span>
                            <span>next {{ formatTimestamp(schedule.next_run_at) }}</span>
                          </div>
                          <div class="profile-schedule-health">
                            <span>Runs {{ schedule.run_count || 0 }}</span>
                            <span>Failures {{ schedule.failure_count || 0 }}/{{ schedule.max_failures || 3 }}</span>
                            <span>Last {{ schedule.last_status || 'never' }}</span>
                          </div>
                          <div class="profile-schedule-health">
                            <span>{{ profileCoverageModeLabel(scheduleQueueSummary(schedule).coverageMode) }}</span>
                            <span>{{ profileLivePriorityLabel(scheduleQueueSummary(schedule).livePriority) }}</span>
                            <span>Batch {{ scheduleQueueSummary(schedule).maxLiveTables }}</span>
                          </div>
                          <div class="profile-schedule-health">
                            <span>{{ schedule.options?.auto_publish ? 'Auto-publish on' : 'Auto-publish off' }}</span>
                            <span v-if="schedule.options?.auto_publish">{{ (schedule.options?.auto_publish_targets || ['devops']).join(', ') }}</span>
                          </div>
                          <div v-if="schedule.last_error" class="profile-schedule-error">
                            {{ schedule.last_error.message || schedule.last_error }}
                          </div>
                        </div>
                        <div class="profile-schedule-actions">
                          <v-btn size="small" variant="outlined" @click="focusProfileSchedule(schedule)">Open Queue</v-btn>
                          <v-btn size="small" variant="outlined" @click="editProfileSchedule(schedule)">Edit</v-btn>
                          <v-btn size="small" variant="outlined" @click="loadProfileScheduleRuns(schedule.id)">Runs</v-btn>
                          <v-btn size="small" color="primary" variant="tonal" :disabled="schedule.status !== 'ACTIVE'" @click="runProfileSchedule(schedule.id)">Run</v-btn>
                          <v-btn v-if="schedule.status === 'ACTIVE'" size="small" variant="tonal" @click="updateProfileScheduleStatus(schedule, 'PAUSED')">Pause</v-btn>
                          <v-btn v-else size="small" variant="tonal" @click="updateProfileScheduleStatus(schedule, 'ACTIVE')">Activate</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteProfileSchedule(schedule.id)">Delete</v-btn>
                        </div>
                      </div>
                      <div v-if="!integrations.profileSchedules.length" class="empty-state scheduler-empty">
                        <div class="empty-state-icon"><v-icon>mdi-calendar-clock</v-icon></div>
                        <h4>No profile schedules yet</h4>
                        <p>Create a schedule from an approved connector to automate metadata, BI, or aggregate profile runs.</p>
                      </div>
                    </div>
                  </div>
                      </div>
                    </v-card-text>
                  </v-card>
                </v-dialog>

                <div v-if="integrations.profileScheduleResult && integrations.schedulerOpsTab === 'overview'" class="managed-connector-results">
                  <div class="section-header">
                    <span class="section-title">Last Scheduler Result</span>
                  </div>
                  <div class="mini-stack">
                    <div class="mini-metric"><span>Status</span><strong>{{ integrations.profileScheduleResult.run?.status || integrations.profileScheduleResult.status || 'saved' }}</strong></div>
                    <div class="mini-metric"><span>Due Count</span><strong>{{ integrations.profileScheduleResult.due_count ?? '-' }}</strong></div>
                    <div class="mini-metric"><span>Run Count</span><strong>{{ integrations.profileScheduleResult.schedule?.run_count ?? integrations.profileScheduleResult.run_count ?? '-' }}</strong></div>
                    <div class="mini-metric"><span>Next Run</span><strong>{{ formatTimestamp(integrations.profileScheduleResult.schedule?.next_run_at || integrations.profileScheduleResult.next_run_at) }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Live Done</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.completed_live_assets }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Live Failed</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.failed_live_assets }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run?.summary?.coverage_queue_status"><span>Queue Left</span><strong>{{ integrations.profileScheduleResult.run.summary.coverage_queue_status.pending_live_queue }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run"><span>Metadata Enrichment</span><strong>{{ connectorRunMetadataEnrichmentStatus(integrations.profileScheduleResult.run) }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run"><span>Actions Planned</span><strong>{{ integrations.profileScheduleResult.run.summary?.actions_planned ?? '-' }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run"><span>Columns Profiled</span><strong>{{ integrations.profileScheduleResult.run.summary?.columns_profiled ?? '-' }}</strong></div>
                    <div class="mini-metric" v-if="integrations.profileScheduleResult.run"><span>Coverage Assets Live</span><strong>{{ integrations.profileScheduleResult.run.summary?.coverage_assets_live ?? '-' }}</strong></div>
                  </div>
                  <workflow-blocker-list
                    v-if="connectorRunBlockedByMissingColumns(integrations.profileScheduleResult.run)"
                    class="mt-8"
                    title="Live profiling blocked by missing column metadata"
                    tone="error"
                    :blockers="connectorRunAffectedObjects(integrations.profileScheduleResult.run).length ? connectorRunAffectedObjects(integrations.profileScheduleResult.run) : ['Refresh source column metadata for the selected live-profile assets, then rerun the profile schedule.']"
                  ></workflow-blocker-list>
                  <div v-if="integrations.profileScheduleResult.artifact" class="scheduler-artifact-paths">
                    <span>JSON {{ integrations.profileScheduleResult.artifact.json_path || '-' }}</span>
                    <span>Markdown {{ integrations.profileScheduleResult.artifact.markdown_path || '-' }}</span>
                  </div>
                </div>

                <div v-if="integrations.schedulerOpsTab === 'runs'" class="managed-connector-results scheduler-history-panel">
                  <div class="section-header">
                    <div>
                      <span class="section-title">Run History</span>
                      <p class="card-help mb-0">Review queue executions and one-time profile runs for {{ schedulerFocusedConnectorId }} without bouncing back to connection setup.</p>
                    </div>
                    <v-chip size="x-small" variant="tonal">{{ integrations.profileScheduleRunScheduleId || schedulerFocusedConnectorId }}</v-chip>
                  </div>
                  <div class="table-wrap compact-table" v-if="integrations.profileScheduleRuns.length">
                    <table>
                      <thead>
                        <tr>
                          <th>Status</th>
                          <th>Completed</th>
                          <th>Run</th>
                          <th>Actions</th>
                          <th>Columns</th>
                          <th>Enrichment</th>
                          <th>Artifact</th>
                          <th>Error</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in integrations.profileScheduleRuns" :key="run.id">
                          <td><v-chip size="x-small" variant="tonal" :color="connectorRunStatusColor(run)">{{ connectorRunDisplayStatus(run) }}</v-chip></td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                          <td>{{ run.run_id || run.id }}</td>
                          <td>{{ run.summary?.actions_planned ?? '-' }}</td>
                          <td>{{ run.summary?.columns_profiled ?? '-' }}</td>
                          <td>{{ connectorRunMetadataEnrichmentStatus(run) }}</td>
                          <td>{{ run.artifact?.markdown_path || run.artifact?.json_path || '-' }}</td>
                          <td>{{ run.error?.message || '-' }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-else class="empty">No queue runs loaded for the focused schedule yet.</div>
                  <div class="table-wrap compact-table mt-8" v-if="integrations.connectorRuns.length">
                    <table>
                      <thead>
                        <tr>
                          <th>Run</th>
                          <th>Kind</th>
                          <th>Status</th>
                          <th>Actions</th>
                          <th>Columns</th>
                          <th>Enrichment</th>
                          <th>Publish</th>
                          <th>Completed</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in integrations.connectorRuns" :key="'scheduler-connector-run-' + run.id">
                          <td>{{ run.id }}</td>
                          <td>{{ connectorRunKind(run) }}</td>
                          <td><v-chip size="x-small" variant="tonal" :color="connectorRunStatusColor(run)">{{ connectorRunDisplayStatus(run) }}</v-chip></td>
                          <td>{{ run.summary?.actions_planned ?? '-' }}</td>
                          <td>{{ run.summary?.columns_profiled ?? '-' }}</td>
                          <td>{{ connectorRunMetadataEnrichmentStatus(run) }}</td>
                          <td>{{ connectorRunPublishStatus(run) }}</td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                          <td><v-btn size="small" variant="outlined" @click="selectConnectorRun(run)">Details</v-btn></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="managed-connector-results mt-8" v-if="integrations.selectedConnectorRun">
                    <div class="section-header">
                      <span class="section-title">Selected Run Detail</span>
                      <div class="btn-row">
                        <v-chip size="x-small" variant="tonal">{{ connectorRunKind(integrations.selectedConnectorRun) }}</v-chip>
                        <v-chip size="x-small" variant="tonal" :color="connectorRunPublishColor(integrations.selectedConnectorRun)">{{ connectorRunPublishStatus(integrations.selectedConnectorRun) }}</v-chip>
                      </div>
                    </div>
                    <div class="connector-next-summary">
                      <div><span>Run</span><strong>{{ integrations.selectedConnectorRun.id }}</strong></div>
                      <div><span>Status</span><strong>{{ connectorRunDisplayStatus(integrations.selectedConnectorRun) }}</strong></div>
                      <div><span>Completed</span><strong>{{ formatTimestamp(integrations.selectedConnectorRun.completed_at) }}</strong></div>
                      <div><span>Assets / objects</span><strong>{{ connectorRunFoundCount(integrations.selectedConnectorRun) }}</strong></div>
                      <div><span>Metadata enrichment</span><strong>{{ connectorRunMetadataEnrichmentStatus(integrations.selectedConnectorRun) }}</strong></div>
                      <div v-for="item in connectorRunCounterPairs(integrations.selectedConnectorRun)" :key="'selected-run-counter-' + item[0]"><span>{{ item[0] }}</span><strong>{{ item[1] }}</strong></div>
                      <div><span>Profile publish</span><strong>{{ connectorRunPublishStatus(integrations.selectedConnectorRun) }}</strong></div>
                      <div v-if="connectorRunQueueStatus(integrations.selectedConnectorRun)"><span>Queue remaining</span><strong>{{ connectorRunQueueStatus(integrations.selectedConnectorRun).pending_live_queue }}</strong></div>
                    </div>
                    <workflow-blocker-list
                      v-if="connectorRunBlockedByMissingColumns(integrations.selectedConnectorRun)"
                      class="mt-8"
                      title="Live profiling blocked by missing column metadata"
                      tone="error"
                      :blockers="connectorRunAffectedObjects(integrations.selectedConnectorRun).length ? connectorRunAffectedObjects(integrations.selectedConnectorRun) : ['Refresh source column metadata for the selected live-profile assets, then rerun the profile schedule.']"
                    ></workflow-blocker-list>
                    <div class="btn-row mt-8">
                      <v-btn v-if="connectorRunCanPublish(integrations.selectedConnectorRun)" size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading" @click="publishConnectorProfiles(integrations.selectedConnectorRun)">Publish</v-btn>
                      <v-btn v-if="canRerunFailedAssets(integrations.selectedConnectorRun)" size="small" variant="tonal" color="warning" :loading="integrations.connectorLoading" @click="rerunFailedProfileAssets(integrations.selectedConnectorRun)">Rerun Failed</v-btn>
                    </div>
                  </div>
                </div>

                <div v-if="integrations.schedulerOpsTab === 'publishing'" class="managed-connector-results scheduler-history-panel">
                  <div class="section-header">
                    <div>
                      <span class="section-title">Publishing Control</span>
                      <p class="card-help mb-0">Publish successful profile runs, spot failures, and confirm recent pushes without drilling into individual run details first.</p>
                    </div>
                    <v-btn size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading" @click="publishConnectorProfiles()">Publish Pending Profiles</v-btn>
                  </div>
                  <div class="mini-stack">
                    <div class="mini-metric"><span>Pending</span><strong>{{ connectorPendingPublishRuns.length }}</strong></div>
                    <div class="mini-metric"><span>Failed</span><strong>{{ connectorPublishFailures.length }}</strong></div>
                    <div class="mini-metric"><span>Published Recently</span><strong>{{ connectorRecentPublishedRuns.length }}</strong></div>
                    <div class="mini-metric"><span>Focused Source</span><strong>{{ schedulerFocusedConnectorId }}</strong></div>
                  </div>
                  <div class="table-wrap compact-table mt-8" v-if="connectorPendingPublishRuns.length">
                    <table>
                      <thead>
                        <tr>
                          <th>Run</th>
                          <th>Assets Ready</th>
                          <th>Status</th>
                          <th>Completed</th>
                          <th></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in connectorPendingPublishRuns" :key="'scheduler-publish-pending-' + run.id">
                          <td>{{ run.id }}</td>
                          <td>{{ connectorRunPublishState(run).successful_asset_count || 0 }}</td>
                          <td>{{ connectorRunPublishStatus(run) }}</td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                          <td><v-btn size="small" variant="tonal" color="primary" :loading="integrations.connectorPublishLoading && integrations.selectedConnectorRun?.id === run.id" @click="publishConnectorProfiles(run)">Publish</v-btn></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="table-wrap compact-table mt-8" v-if="connectorPublishFailures.length">
                    <table>
                      <thead>
                        <tr>
                          <th>Run</th>
                          <th>Failure</th>
                          <th>Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in connectorPublishFailures" :key="'scheduler-publish-failure-' + run.id">
                          <td>{{ run.id }}</td>
                          <td>{{ connectorRunPublishState(run).error?.message || connectorRunPublishStatus(run) }}</td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div class="table-wrap compact-table mt-8" v-if="connectorRecentPublishedRuns.length">
                    <table>
                      <thead>
                        <tr>
                          <th>Run</th>
                          <th>Status</th>
                          <th>Completed</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr v-for="run in connectorRecentPublishedRuns" :key="'scheduler-publish-success-' + run.id">
                          <td>{{ run.id }}</td>
                          <td>{{ connectorRunPublishStatus(run) }}</td>
                          <td>{{ formatTimestamp(run.completed_at) }}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div v-if="integrations.connectorPublicationResult" class="scheduler-artifact-paths mt-8">
                    <span>Status {{ integrations.connectorPublicationResult.status || '-' }}</span>
                    <span>Targets {{ (integrations.connectorPublicationResult.targets || []).join(', ') || '-' }}</span>
                    <span>Assets {{ integrations.connectorPublicationResult.successful_asset_count || 0 }}</span>
                  </div>
                </div>
              </v-card>

            </div>


`;

export const connectorWorkflowPageTemplate = `
            <div v-if="activeView === 'integrations' && integrations.connectorWorkflowTab === 'integrations'" class="grid">
              <v-card class="card span-6" variant="outlined">
                <h3>Notification Channels</h3>
                <p class="card-help">Choose a channel and event type, then save settings and send a test event.</p>
                <div class="form-row">
                  <div class="col-4"><v-label>Channel</v-label><v-select v-model="integrations.notifyChannel" density="compact" variant="outlined" hide-details :items="['email','slack','teams']"></v-select></div>
                  <div class="col-8"><v-label>Event Type</v-label><v-text-field v-model="integrations.notifyEventType" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="saveNotificationChannel">Enable &amp; Save</v-btn>
                  <v-btn variant="tonal" @click="sendNotificationTest">Send Test Event</v-btn>
                </div>
                <div class="mini-stack mt-8" v-if="integrations.settings">
                  <div class="mini-metric" v-for="(val, key) in (integrations.settings.notifications || {})" :key="key">
                    <span>{{ key }}</span>
                    <v-chip size="x-small" variant="tonal" :color="val && val.enabled ? 'success' : 'secondary'">{{ val && val.enabled ? 'Enabled' : 'Disabled' }}</v-chip>
                  </div>
                  <div class="mini-metric" v-if="!Object.keys(integrations.settings.notifications || {}).length">
                    <span>No channels configured</span>
                  </div>
                </div>
                <div v-else class="empty">No settings loaded.</div>
              </v-card>

              <v-card class="card span-6" variant="outlined">
                <h3>Webhook Registry</h3>
                <p class="card-help">Register callback endpoints for governance events. Use Test before enabling in production.</p>
                <div class="form-row">
                  <div class="col-4"><v-label>Name</v-label><v-text-field v-model="integrations.newWebhook.name" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>URL</v-label><v-text-field v-model="integrations.newWebhook.url" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Events (comma)</v-label><v-text-field v-model="integrations.newWebhook.events" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;"><v-btn color="primary" @click="createWebhook">Create Webhook</v-btn></div>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>Name</th><th>URL</th><th>Actions</th></tr></thead>
                    <tbody>
                      <tr v-for="hook in integrations.webhooks" :key="hook.webhookId">
                        <td>{{ hook.name }}</td><td>{{ hook.url }}</td>
                        <td class="btn-row">
                          <v-btn size="small" variant="tonal" @click="testWebhook(hook.webhookId)">Test</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteWebhook(hook.webhookId)">Delete</v-btn>
                        </td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-8" variant="outlined">
                <h3>External System Links</h3>
                <p class="card-help">Connect catalog objects to tickets, docs, dashboards, or runbooks for faster triage.</p>
                <div class="form-row">
                  <div class="col-3"><v-label>Object ID</v-label><v-text-field v-model="integrations.linkObjectId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Type</v-label><v-text-field v-model="integrations.linkType" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>URL</v-label><v-text-field v-model="integrations.linkUrl" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="addExternalLink">Add Link</v-btn>
                  <v-btn variant="tonal" @click="loadLinks">Refresh Links</v-btn>
                </div>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>Type</th><th>URL</th><th>Action</th></tr></thead>
                    <tbody>
                      <tr v-for="link in integrations.links" :key="link.linkId">
                        <td>{{ link.type }}</td>
                        <td>{{ link.url }}</td>
                        <td><v-btn size="small" color="error" variant="tonal" @click="removeLink(link.linkId)">Remove</v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-4" variant="outlined">
                <h3>CI/CD Governance Checks</h3>
                <p class="card-help">Run impact, compliance, and documentation checks for the selected object before release.</p>
                <v-btn color="warning" @click="runPipelineChecks">Run CI/CD Checks</v-btn>
              </v-card>
            </div>


`;

export const lineageAcquisitionPageTemplate = `
            <div v-if="activeView === 'import'" class="import-page">
              <v-row>
              <v-col cols="12">
              <v-card class="card lineage-acquisition-domain" variant="outlined">
                <div class="section-header">
                  <div>
                    <span class="section-title">Lineage Acquisition Domain</span>
                    <h3>{{ lineageAcquisitionDomain.label }}</h3>
                    <p class="workflow-subtitle">Refresh all configured lineage evidence needed to build holistic SONIC_DW lineage. Operators can override scope only when they know which source changed.</p>
                  </div>
                  <v-chip size="small" variant="tonal" color="primary">{{ lineageAcquisitionDomain.cadence }}</v-chip>
                </div>
                <div class="mini-stack">
                  <div class="mini-metric"><span>Domain</span><strong>{{ lineageAcquisitionSummary.domain }}</strong></div>
                  <div class="mini-metric"><span>Configured Sources</span><strong>{{ lineageAcquisitionSummary.sourceCount }}</strong></div>
                  <div class="mini-metric"><span>Refreshed Sources</span><strong>{{ lineageAcquisitionSummary.refreshed }}</strong></div>
                  <div class="mini-metric"><span>Indexed Evidence</span><strong>{{ lineageAcquisitionSummary.indexedObjects }}</strong></div>
                </div>
                <div class="table-wrap compact-table mt-8">
                  <v-table density="compact">
                    <thead><tr><th>Source</th><th>Type</th><th>Status</th><th>Current Evidence</th></tr></thead>
                    <tbody>
                      <tr v-for="source in lineageAcquisitionSourceRows" :key="'lineage-domain-source-' + source.key">
                        <td>{{ source.key }}</td>
                        <td>{{ source.type }}</td>
                        <td><workflow-status-chip :status="source.status" :color="source.statusColor"></workflow-status-chip></td>
                        <td>{{ source.metric }}</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div class="connector-guardrail mt-8">
                  <v-icon size="small">mdi-compass-outline</v-icon>
                  <span>Default action refreshes the full {{ lineageAcquisitionDomain.label }} domain. Use targeted source controls below only for investigation refreshes or troubleshooting.</span>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="runRecommendedWorkflowAction">Refresh Full Domain Evidence</v-btn>
                  <v-btn variant="tonal" @click="bootstrapData">Refresh Status</v-btn>
                  <v-btn variant="outlined" @click="importer.activeConnector = 'sql-server'; importer.showAdvancedTroubleshooting = true">Override Scope</v-btn>
                </div>
              </v-card>
              </v-col>
              </v-row>

              <v-row dense>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.validationResult" variant="outlined">
                <div class="value">{{ importer.validationResult.valid || 0 }}</div>
                <div class="label">Validated Objects</div>
              </v-card>
              <v-card class="card kpi" v-if="importer.validationResult" variant="outlined">
                <div class="value">{{ importer.validationResult.invalid || 0 }}</div>
                <div class="label">Validation Issues</div>
              </v-card>
              </v-col>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.lastLoadStats" variant="outlined">
                <div class="value">{{ importer.lastLoadStats.totalObjects || 0 }}</div>
                <div class="label">Indexed Objects</div>
              </v-card>
              </v-col>
              <v-col cols="12" xs="6" sm="4" md="3">
              <v-card class="card kpi" v-if="importer.status" variant="outlined">
                <div class="value">{{ importer.status.loadedObjectCount || 0 }}</div>
                <div class="label">Current Index Size</div>
              </v-card>
              </v-col>
              </v-row>

              

              <details
                class="lineage-acquisition-support-lane"
                :open="importer.showAdvancedTroubleshooting"
                @toggle="importer.showAdvancedTroubleshooting = $event.target.open"
              >
              <summary>
                <span>Advanced Source Troubleshooting</span>
                <small>Scope overrides, targeted extractors, validate/load, and raw evidence controls</small>
              </summary>
              <div class="lineage-acquisition-support-body">

              <v-row>
              <v-col cols="12">
              <v-card class="card ingestion-workspace" variant="outlined">
                <div class="ingestion-workspace-header">
                  <div>
                    <h3>Scope Override Controls</h3>
                    <p class="card-help">Use targeted source controls when a domain refresh needs a narrow rerun. Raw extraction details stay here so the default Lineage Acquisition page remains domain-led.</p>
                  </div>
                  <div class="connector-picker">
                    <span>Scope Override</span>
                    <v-select
                      v-model="importer.activeConnector"
                      class="ingestion-connector-select"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :items="ingestionConnectorOptions"
                      item-title="label"
                      item-value="key"
                    ></v-select>
                  </div>
                </div>
                <div class="connector-grid">
                  <button
                    v-for="connector in ingestionConnectorOptions"
                    :key="'connector-' + connector.key"
                    type="button"
                    class="connector-card"
                    :class="{ active: importer.activeConnector === connector.key, planned: connector.planned }"
                    @click="importer.activeConnector = connector.key"
                  >
                    <span class="connector-icon"><v-icon :icon="connector.icon" size="20"></v-icon></span>
                    <span class="connector-body">
                      <span class="connector-topline">
                        <strong>{{ connector.label }}</strong>
                        <v-chip size="x-small" variant="tonal" :color="connector.statusColor">{{ connector.status }}</v-chip>
                      </span>
                      <span class="connector-type">{{ connector.type }} · {{ connector.metric }}</span>
                      <span class="connector-description">{{ connector.description }}</span>
                    </span>
                  </button>
                </div>
              </v-card>

              <v-card v-if="importer.activeConnector === 'sql-server'" class="card connector-detail-card" variant="outlined">
                <h3>SQL Server Evidence Source</h3>
                <p class="card-help">Target one database source for a troubleshooting refresh. Full SONIC_DW acquisition should use the domain refresh above.</p>
                <div class="form-row" style="margin-bottom: 10px;">
                  <div class="col-2"><v-label>Auth Method</v-label><v-select v-model="importer.sqlServer.authentication" density="compact" variant="outlined" hide-details :items="[{ title: 'SQL Server Auth', value: 'sql-server' }, { title: 'Windows Auth', value: 'windows' }, { title: 'Azure AD', value: 'azure-ad' }]" item-title="title" item-value="value"></v-select></div>
                  <div class="col-3"><v-label>Server</v-label><v-text-field v-model="importer.sqlServer.server" placeholder="localhost or server.database.windows.net" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Port</v-label><v-text-field v-model.number="importer.sqlServer.port" type="number" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3">
                    <v-label>Database</v-label>
                    <div style="display:flex; gap:6px; align-items:flex-start;">
                      <v-combobox
                        v-model="importer.sqlServer.database"
                        :items="importer.sqlServer.availableDatabases"
                        :loading="importer.sqlServer.discoveringDatabases"
                        item-title="title"
                        item-value="value"
                        density="compact"
                        variant="outlined"
                        hide-details
                        style="flex:1;"
                        @focus="discoverSqlServerDatabases({ force: false })"
                        placeholder="Type or auto-discover..."
                      ></v-combobox>
                      <v-btn
                        icon="mdi-refresh"
                        size="small"
                        variant="tonal"
                        :loading="importer.sqlServer.discoveringDatabases"
                        :disabled="!hasSqlServerDatabaseDiscoveryInputs()"
                        @click="discoverSqlServerDatabases({ force: true })"
                        title="Refresh database list"
                      ></v-btn>
                    </div>
                    <div :style="{ fontSize: '0.85em', color: sqlServerDatabaseHintColor, marginTop: '2px' }">{{ sqlServerDatabaseHint }}</div>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'sql-server'">
                  <div class="col-6"><v-label>Username</v-label><v-text-field v-model="importer.sqlServer.username" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Password</v-label><v-text-field v-model="importer.sqlServer.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.sqlServer.authentication === 'windows'">
                  <div class="col-12">
                    <v-checkbox v-model="importer.sqlServer.useIntegratedAuth" density="compact" hide-details label="Use current Windows user (Integrated Auth)" color="primary" :class="{'checkbox-visible': true}"></v-checkbox>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 6px;" v-if="importer.sqlServer.authentication === 'windows' && !importer.sqlServer.useIntegratedAuth">
                  <div class="col-4"><v-label>Domain</v-label><v-text-field v-model="importer.sqlServer.domain" placeholder="CONTOSO" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Username</v-label><v-text-field v-model="importer.sqlServer.username" placeholder="svc_data_gov or CONTOSO\\svc_data_gov" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Password</v-label><v-text-field v-model="importer.sqlServer.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div v-if="importer.sqlServer.authentication === 'windows'" style="margin-bottom: 10px; font-size: 0.85em; color: #666;">
                  Integrated Auth uses your current Windows login. Turn it off only if you need manual NTLM credentials.
                </div>
                <div class="form-row" style="margin-bottom: 10px;" v-if="importer.sqlServer.authentication === 'azure-ad'">
                  <div class="col-6"><v-label>Client ID</v-label><v-text-field v-model="importer.sqlServer.clientId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Client Secret</v-label><v-text-field v-model="importer.sqlServer.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-12"><v-label>Tenant ID</v-label><v-text-field v-model="importer.sqlServer.tenantId" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <div class="form-row" style="margin-bottom: 15px;">
                  <div class="col-6" style="display:flex; gap:10px; align-items:center;">
                    <div style="display:flex;align-items:center;gap:18px;">
                      <v-checkbox
                        v-model="importer.sqlServer.encrypt"
                        density="compact"
                        label="Encrypt Connection"
                        color="primary"
                        :class="'checkbox-visible always-show-checkbox'"
                        hide-details="auto"
                        style="min-width: 44px;"
                      ></v-checkbox>
                      <v-checkbox
                        v-model="importer.sqlServer.trustServerCertificate"
                        density="compact"
                        label="Trust Server Cert"
                        color="primary"
                        :class="'checkbox-visible always-show-checkbox'"
                        hide-details="auto"
                        style="min-width: 44px;"
                      ></v-checkbox>
                    </div>
                  </div>
                  <div class="col-6" style="display:flex;align-items:end; gap:10px;">
                    <v-btn color="primary" @click="discoverSqlServerScope" :loading="importer.sqlServer.discovering" :disabled="importer.sqlServer.discovering || importer.sqlServer.connecting" style="flex:1;">{{ importer.sqlServer.discovering ? 'Discovering...' : 'Discover Source Scope' }}</v-btn>
                  </div>
                </div>
                <v-dialog v-model="importer.sqlServer.showScopeSelector" max-width="900" scrollable>
                  <v-card style="max-height: 85vh; overflow: auto;">
                    <v-card-text>
                    <h3 style="margin-top: 0;">Extract Database Scope</h3>
                    <p style="margin-bottom: 10px; font-size: 0.9em; color: #555;">Discovered {{ importer.sqlServer.availableSchemas.length }} schemas with {{ importer.sqlServer.discoveredObjectCount }} total objects. Choose scope to extract.</p>
                    
                    <div style="margin-bottom: 12px;">
                      <v-radio-group v-model="importer.sqlServer.selectionMode" inline hide-details>
                        <v-radio label="Full Schema Mode (extract entire schemas)" value="schema"></v-radio>
                        <v-radio label="Table-Level Mode (pick individual tables)" value="table"></v-radio>
                      </v-radio-group>
                    </div>

                    <div class="btn-row" style="margin-bottom: 10px;">
                      <v-btn size="small" variant="tonal" @click="toggleAllSqlServerSchemas(true)">Select all</v-btn>
                      <v-btn size="small" variant="tonal" @click="toggleAllSqlServerSchemas(false)">Clear all</v-btn>
                      <div style="display:flex; align-items:center; gap:8px; margin-left:auto;">
                        <v-label style="margin:0; font-size: 0.85em; color: #555;">Top</v-label>
                        <v-text-field v-model.number="importer.sqlServer.topSchemaCount" type="number" min="1" density="compact" variant="outlined" hide-details style="width:72px;"></v-text-field>
                        <v-btn size="small" variant="tonal" @click="selectTopSqlServerSchemas">Select Largest</v-btn>
                      </div>
                    </div>

                    <div v-if="importer.sqlServer.selectionMode === 'schema'" style="border: 1px solid #e5e7eb; border-radius: 6px; padding: 10px; max-height: 45vh; overflow-y: auto;">
                      <div v-for="schema in importer.sqlServer.availableSchemas" :key="schema.schemaName" style="display:flex; justify-content:space-between; align-items:center; padding: 8px 0; border-bottom: 1px solid #f3f4f6;">
                        <v-checkbox-btn :value="schema.schemaName" v-model="importer.sqlServer.selectedSchemas" density="compact" hide-details color="primary" :class="{'checkbox-visible': true}"></v-checkbox-btn>
                        <span style="font-weight: 500; margin-right:auto;">{{ schema.schemaName }}</span>
                        <span style="font-size: 0.8em; color: #999;">
                          {{ schema.totalObjectCount }} objects ({{ schema.tableCount }}T, {{ schema.viewCount }}V, {{ schema.procedureCount }}P)
                        </span>
                      </div>
                      <div v-if="importer.sqlServer.availableSchemas.length === 0" class="empty">No schemas found.</div>
                    </div>

                    <div v-if="importer.sqlServer.selectionMode === 'table'" style="border: 1px solid #e5e7eb; border-radius: 6px; max-height: 45vh; overflow-y: auto;">
                      <div v-for="schema in importer.sqlServer.availableSchemas" :key="'schema-' + schema.schemaName" style="border-bottom: 1px solid #e5e7eb;">
                        <div @click="toggleSqlServerSchemaExpand(schema.schemaName)" style="padding: 10px; background: #f9fafb; cursor: pointer; display: flex; align-items: center; gap: 8px; user-select: none;">
                          <span style="font-size: 1.2em; width: 20px;">{{ importer.sqlServer.expandedSchemas && importer.sqlServer.expandedSchemas[schema.schemaName] ? '?' : '?' }}</span>
                          <span style="font-weight: 500;">{{ schema.schemaName }}</span>
                          <span style="font-size: 0.8em; color: #999; margin-left: auto;">{{ schema.tableCount }} tables</span>
                        </div>
                        
                        <div v-if="importer.sqlServer.expandedSchemas && importer.sqlServer.expandedSchemas[schema.schemaName]" style="background: #fff; max-height: 30vh; overflow-y: auto;">
                          <div style="padding: 8px 0 8px 30px; border-bottom: 1px solid #f3f4f6;">
                            <v-checkbox
                              :model-value="isSchemaFullySelected(schema.schemaName)"
                              density="compact"
                              hide-details
                              color="primary"
                              :class="{'checkbox-visible': true}"
                              @update:model-value="toggleSchemaTableSelection(schema.schemaName, { target: { checked: $event } })"
                              :label="'Select all in ' + schema.schemaName"
                            ></v-checkbox>
                          </div>
                          <div v-for="table in (importer.sqlServer.schemaTableLists && importer.sqlServer.schemaTableLists[schema.schemaName]) || []" :key="schema.schemaName + '.' + table.name" style="padding: 6px 30px; border-bottom: 1px solid #f3f4f6;">
                            <div style="display:flex; align-items:center; gap:6px; font-size:0.9em;">
                              <v-checkbox-btn :value="schema.schemaName + '.' + table.name" v-model="importer.sqlServer.selectedTables" density="compact" hide-details color="primary" :class="{'checkbox-visible': true}"></v-checkbox-btn>
                              <span>{{ table.name }}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div v-if="importer.sqlServer.availableSchemas.length === 0" class="empty" style="padding: 20px;">No schemas found.</div>
                    </div>

                    <div class="btn-row" style="margin-top: 12px; justify-content: flex-end;">
                      <v-btn variant="tonal" @click="cancelSqlServerScopeSelection">Cancel</v-btn>
                      <v-btn color="primary" @click="connectSqlServer" :loading="importer.sqlServer.connecting" :disabled="importer.sqlServer.connecting">{{ importer.sqlServer.connecting ? 'Extracting...' : 'Extract Selected Scope' }}</v-btn>
                    </div>
                    </v-card-text>
                  </v-card>
                </v-dialog>
                <div v-if="importer.sqlServer.result" style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                  <div style="font-weight:bold; color:#2563eb;">? Extraction Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    <div v-if="importer.sqlServer.result.connectorExtraction" style="margin-bottom: 10px; padding: 8px; border: 1px solid #bfdbfe; border-radius: 6px; background: #eff6ff; color: #1e3a8a;">
                      <div style="font-weight: 700;">Connector Framework</div>
                      <div>
                        <strong>Adapter:</strong> {{ importer.sqlServer.result.connectorExtraction.adapter }}
                        · <strong>Status:</strong> {{ importer.sqlServer.result.connectorExtraction.status }}
                        · <strong>Events:</strong> {{ importer.sqlServer.result.connectorExtraction.summary?.event_count || 0 }}
                        · <strong>Streams:</strong> {{ importer.sqlServer.result.connectorExtraction.streamResults?.length || 0 }}
                      </div>
                      <div v-if="importer.sqlServer.result.connectorExtraction.errors?.length" style="margin-top: 4px; color: #991b1b;">
                        <strong>Framework Errors:</strong> {{ importer.sqlServer.result.connectorExtraction.errors.length }}
                      </div>
                    </div>
                    <div><strong>Objects Extracted:</strong> {{ importer.sqlServer.result.totalObjectsExtracted }} total</div>
                    <div style="margin-left: 16px; font-size: 0.85em; color: #444;">
                      <div v-if="importer.sqlServer.result.tablesExtracted > 0">• {{ importer.sqlServer.result.tablesExtracted }} tables</div>
                      <div v-if="importer.sqlServer.result.viewsExtracted > 0">• {{ importer.sqlServer.result.viewsExtracted }} views</div>
                      <div v-if="importer.sqlServer.result.proceduresExtracted > 0">• {{ importer.sqlServer.result.proceduresExtracted }} stored procedures</div>
                      <div v-if="importer.sqlServer.result.functionsExtracted > 0">• {{ importer.sqlServer.result.functionsExtracted }} functions</div>
                      <div v-if="importer.sqlServer.result.triggersExtracted > 0">• {{ importer.sqlServer.result.triggersExtracted }} triggers</div>
                    </div>
                    <div style="margin-top: 8px;"><strong>Relationships:</strong> {{ importer.sqlServer.result.relationshipsDetected }} detected</div>
                    <div><strong>High Confidence:</strong> {{ importer.sqlServer.result.confidentRelationships }} (=0.75)</div>
                    <div><strong>Selected Schemas:</strong> {{ (importer.sqlServer.result.selectedSchemas || []).join(', ') || 'n/a' }}</div>
                    <div style="margin-top: 8px; font-size: 0.85em; color: #555;">{{ importer.sqlServer.result.markdownFiles }} markdown files ready to import</div>

                    <div v-if="importer.sqlServer.result.researchReport" style="margin-top: 12px; padding: 8px; border: 1px solid #c7d2fe; border-radius: 6px; background: #eef2ff;">
                      <div style="font-weight: 600; color: #3730a3; margin-bottom: 6px;">Coverage Research</div>
                      <div><strong>Coverage:</strong> {{ importer.sqlServer.result.researchReport.coveragePercent }}%</div>
                      <div><strong>Core Objects:</strong> {{ importer.sqlServer.result.researchReport.extractedCoreObjects }} / {{ importer.sqlServer.result.researchReport.expectedCoreObjects }}</div>
                      <div><strong>Column Lineage Enabled:</strong> {{ importer.sqlServer.result.researchReport.columnLineageEnabled ? 'Yes' : 'No (use narrower scope)' }}</div>

                      <div v-if="importer.sqlServer.result.researchReport.missingOrUncaptured && importer.sqlServer.result.researchReport.missingOrUncaptured.length > 0" style="margin-top: 8px;">
                        <div style="font-weight: 600;">Gaps detected:</div>
                        <div v-for="(item, idx) in importer.sqlServer.result.researchReport.missingOrUncaptured" :key="'gap-' + idx">- {{ item }}</div>
                      </div>

                      <div v-if="importer.sqlServer.result.researchReport.recommendations && importer.sqlServer.result.researchReport.recommendations.length > 0" style="margin-top: 8px;">
                        <div style="font-weight: 600;">Recommended next steps:</div>
                        <div v-for="(item, idx) in importer.sqlServer.result.researchReport.recommendations" :key="'rec-' + idx">- {{ item }}</div>
                      </div>
                    </div>

                    <div v-if="importer.sqlServer.result.objectInventory" style="margin-top: 10px; font-size: 0.85em; color: #374151;">
                      <strong>Inventory:</strong>
                      tables {{ importer.sqlServer.result.objectInventory.table || 0 }},
                      views {{ importer.sqlServer.result.objectInventory.view || 0 }},
                      procedures {{ importer.sqlServer.result.objectInventory.storedProcedure || 0 }},
                      functions {{ ((importer.sqlServer.result.objectInventory.scalarFunction || 0) + (importer.sqlServer.result.objectInventory.inlineTableFunction || 0) + (importer.sqlServer.result.objectInventory.tableFunction || 0)) }},
                      triggers {{ importer.sqlServer.result.objectInventory.trigger || 0 }},
                      synonyms {{ importer.sqlServer.result.objectInventory.synonym || 0 }},
                      sequences {{ importer.sqlServer.result.objectInventory.sequence || 0 }},
                      table types {{ importer.sqlServer.result.objectInventory.tableType || 0 }}
                    </div>

                    <div v-if="importer.sqlServer.result.extractionWarnings && importer.sqlServer.result.extractionWarnings.length > 0" style="margin-top: 8px; font-size: 0.85em; color: #92400e; background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px;">
                      <div><strong>Limited permissions detected:</strong></div>
                      <div v-for="warning in importer.sqlServer.result.extractionWarnings" :key="warning.code">- {{ warning.message }}</div>
                    </div>
                  </div>
                </div>
              </v-card>

              <v-card v-if="importer.activeConnector === 'ssis'" class="card connector-detail-card" variant="outlined">
                <h3>SSIS Evidence Source</h3>
                <p class="card-help">Refresh targeted SSIS_UAT package evidence when the SONIC_DW domain refresh needs a narrow rerun or troubleshooting pass.</p>
                
                <div class="form-row" style="margin-bottom: 10px;">
                  <div class="col-2"><v-label>Auth Method</v-label><v-select v-model="importer.ssis.authentication" density="compact" variant="outlined" hide-details :items="[{ title: 'SQL Server Auth', value: 'sql-server' }, { title: 'Windows Auth', value: 'windows' }, { title: 'Azure AD', value: 'azure-ad' }]" item-title="title" item-value="value"></v-select></div>
                  <div class="col-4"><v-label>Server</v-label><v-text-field v-model="importer.ssis.server" placeholder="localhost" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Port</v-label><v-text-field v-model.number="importer.ssis.port" type="number" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Database</v-label><v-text-field v-model="importer.ssis.database" placeholder="master" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.ssis.authentication === 'sql-server'">
                  <div class="col-6"><v-label>Username</v-label><v-text-field v-model="importer.ssis.username" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6"><v-label>Password</v-label><v-text-field v-model="importer.ssis.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 8px;" v-if="importer.ssis.authentication === 'windows'">
                  <div class="col-12">
                    <v-checkbox v-model="importer.ssis.useIntegratedAuth" density="compact" hide-details label="Use current Windows user (Integrated Auth)" color="primary"></v-checkbox>
                  </div>
                </div>
                <div class="form-row" style="margin-bottom: 6px;" v-if="importer.ssis.authentication === 'windows' && !importer.ssis.useIntegratedAuth">
                  <div class="col-4"><v-label>Domain</v-label><v-text-field v-model="importer.ssis.domain" placeholder="CONTOSO" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Username</v-label><v-text-field v-model="importer.ssis.username" placeholder="svc_ssis" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Password</v-label><v-text-field v-model="importer.ssis.password" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 10px;" v-if="importer.ssis.authentication === 'azure-ad'">
                  <div class="col-4"><v-label>Client ID</v-label><v-text-field v-model="importer.ssis.clientId" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Client Secret</v-label><v-text-field v-model="importer.ssis.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Tenant ID</v-label><v-text-field v-model="importer.ssis.tenantId" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>

                <div class="form-row" style="margin-bottom: 15px;">
                  <div class="col-3"><v-label>History Days</v-label><v-text-field v-model.number="importer.ssis.historyDays" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Phase Days</v-label><v-text-field v-model.number="importer.ssis.phaseDays" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-6" style="display:flex; gap:10px; align-items:center;">
                    <v-checkbox v-model="importer.ssis.extractXml" density="compact" label="Parse XML Lineage" color="primary" hide-details></v-checkbox>
                    <v-checkbox v-model="importer.ssis.encrypt" density="compact" label="Encrypt" color="primary" hide-details></v-checkbox>
                    <v-checkbox v-model="importer.ssis.trustServerCertificate" density="compact" label="Trust Cert" color="primary" hide-details></v-checkbox>
                  </div>
                </div>

                <div class="btn-row" style="margin-bottom: 15px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverSsisCatalog" :loading="importer.ssis.discovering" :disabled="importer.ssis.discovering || importer.ssis.connecting">Discover Catalog</v-btn>
                  <v-btn color="primary" @click="runSsisExtraction" :loading="importer.ssis.connecting" :disabled="importer.ssis.discovering || importer.ssis.connecting">{{ importer.ssis.connecting ? 'Refreshing SSIS...' : 'Refresh SSIS Evidence' }}</v-btn>
                </div>

                <div v-if="importer.ssis.inventory && !importer.ssis.result" style="margin-top: 15px; padding: 10px; background: #fdfae5; border-left: 4px solid #d97706; border-radius: 4px;">
                  <div style="font-weight:bold; color:#d97706;">? Discovery Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    SSISDB Present: <strong>{{ importer.ssis.inventory.ssisdbPresent ? 'Yes' : 'No' }}</strong><br/>
                    Packages Found: <strong>{{ importer.ssis.inventory.packageCount }}</strong><br/>
                    Executables: <strong>{{ importer.ssis.inventory.executables?.length || 0 }}</strong>
                  </div>
                </div>

                <div v-if="importer.ssis.result" style="margin-top: 15px; padding: 10px; background: #f0f8ff; border-left: 4px solid #2563eb; border-radius: 4px;">
                  <div style="font-weight:bold; color:#2563eb;">? SSIS Extraction Complete</div>
                  <div style="margin-top: 8px; font-size: 0.9em; line-height: 1.6;">
                    <div v-if="importer.ssis.result.connectorExtraction" style="margin-bottom: 10px; padding: 8px; border: 1px solid #bfdbfe; border-radius: 6px; background: #eff6ff; color: #1e3a8a;">
                      <div style="font-weight: 700;">Connector Framework</div>
                      <div>
                        <strong>Adapter:</strong> {{ importer.ssis.result.connectorExtraction.adapter }}
                        · <strong>Status:</strong> {{ importer.ssis.result.connectorExtraction.status }}
                        · <strong>Events:</strong> {{ importer.ssis.result.connectorExtraction.summary?.event_count || 0 }}
                        · <strong>Streams:</strong> {{ importer.ssis.result.connectorExtraction.streamResults?.length || 0 }}
                      </div>
                      <div v-if="importer.ssis.result.connectorExtraction.errors?.length" style="margin-top: 4px; color: #991b1b;">
                        <strong>Framework Errors:</strong> {{ importer.ssis.result.connectorExtraction.errors.length }}
                      </div>
                    </div>
                    <div><strong>Packages:</strong> {{ importer.ssis.result.summary?.counts?.packages || 0 }}</div>
                    <div><strong>Lineage Edges:</strong> {{ importer.ssis.result.summary?.counts?.lineageEdges || 0 }}</div>
                    <div><strong>Agent Jobs:</strong> {{ importer.ssis.result.summary?.counts?.agentJobs || 0 }}</div>
                    <div><strong>XML Parsed:</strong> {{ importer.ssis.result.summary?.counts?.xmlPackagesParsed || 0 }}</div>
                    <div style="margin-top: 8px; font-size: 0.85em; color: #555;">{{ importer.ssis.result.markdownFilesWritten || 0 }} markdown files generated to {{ importer.ssis.result.markdownOutputPath }}</div>
                    
                    <div v-if="importer.ssis.result.summary?.warnings?.length > 0" style="margin-top: 8px; font-size: 0.85em; color: #92400e; background: #fffbeb; border-left: 3px solid #f59e0b; padding: 8px;">
                      <div><strong>Warnings ({{ importer.ssis.result.summary.warningCount }}):</strong></div>
                      <div v-for="(warn, idx) in importer.ssis.result.summary.warnings.slice(0, 5)" :key="'sw-'+idx">- {{ warn }}</div>
                      <div v-if="importer.ssis.result.summary.warnings.length > 5">...and {{ importer.ssis.result.summary.warnings.length - 5 }} more.</div>
                    </div>
                  </div>
                </div>
              </v-card>
              
              <v-card v-if="importer.activeConnector === 'markdown'" class="card connector-detail-card span-12" variant="outlined">
                <h3>Markdown Upload & Parse</h3>
                <p class="card-help">Use this for curated or externally generated markdown that should enter the same validate/load pipeline.</p>
                <v-file-input multiple accept=".md,text/markdown" density="compact" variant="outlined" show-size @change="handleFileUpload" hide-details></v-file-input>
                <div class="table-wrap" style="margin-top:10px;">
                  <v-table density="compact">
                    <thead><tr><th>File</th><th>Status</th><th>Object</th><th>Database</th><th>Error</th></tr></thead>
                    <tbody>
                      <tr v-for="item in importer.parsed" :key="item.fileName">
                        <td>{{ item.fileName }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.objectId || '-' }}</td>
                        <td>{{ item.database || '-' }}</td>
                        <td>{{ item.error || '-' }}</td>
                      </tr>
                      <tr v-if="importer.parsed.length === 0"><td colspan="5" class="empty">No uploaded files parsed yet.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'data-factory'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-factory" size="28"></v-icon>
                  <div>
                    <h3>Data Factory Evidence Source</h3>
                    <p class="card-help">Refresh targeted Azure Data Factory evidence for a scoped investigation; keep full-domain acquisition anchored on the configured SONIC_DW sources.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Subscription ID</v-label><v-tooltip location="top" max-width="360" text="The Azure subscription that owns the Data Factory. In Azure Portal, open the Data Factory resource, then copy Subscription ID from Overview or Essentials."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Subscription ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.subscriptionId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Resource Group</v-label><v-tooltip location="top" max-width="360" text="The Azure resource group containing the Data Factory. In Azure Portal, open the factory and copy Resource group from Overview or Essentials."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Resource Group help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.resourceGroupName" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Factory Name</v-label><v-tooltip location="top" max-width="360" text="The exact Azure Data Factory resource name. Find it in Azure Portal by searching Data factories, then open the factory and copy the Name value."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Factory Name help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.factoryName" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Tenant ID</v-label><v-tooltip location="top" max-width="380" text="The Microsoft Entra tenant for the service principal. In Azure Portal, go to Microsoft Entra ID > Overview and copy Tenant ID. You can skip this if using a pasted access token."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Tenant ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.tenantId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Client ID</v-label><v-tooltip location="top" max-width="380" text="The Application client ID for a Microsoft Entra app registration or managed service principal that has Reader access to the Data Factory. Find it under Microsoft Entra ID > App registrations > your app > Application client ID."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Client ID help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.clientId" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-4">
                    <div class="field-label-row"><v-label>Client Secret</v-label><v-tooltip location="top" max-width="380" text="A secret for the Entra app registration. Create one in Microsoft Entra ID > App registrations > your app > Certificates & secrets. Copy the secret Value immediately; Azure will not show it again."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Client Secret help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.clientSecret" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-12">
                    <div class="field-label-row"><v-label>Access Token</v-label><v-tooltip location="top" max-width="390" text="Optional Azure Management API bearer token. Use this instead of tenant/client credentials for short-lived testing. Generate with Azure CLI using az account get-access-token --resource https://management.azure.com/ and paste accessToken only."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Access Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.dataFactory.accessToken" type="password" density="compact" variant="outlined" placeholder="Optional bearer token instead of service principal fields" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverDataFactory" :loading="importer.dataFactory.discovering" :disabled="importer.dataFactory.discovering || importer.dataFactory.connecting">Discover Factory</v-btn>
                  <v-btn color="primary" @click="runDataFactoryExtraction" :loading="importer.dataFactory.connecting" :disabled="importer.dataFactory.discovering || importer.dataFactory.connecting">{{ importer.dataFactory.connecting ? 'Refreshing ADF...' : 'Refresh ADF Evidence' }}</v-btn>
                </div>
                <div v-if="importer.dataFactory.inventory || importer.dataFactory.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>Pipelines</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).pipelines?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Datasets</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).datasets?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Linked Services</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).linkedServices?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Triggers</span><strong>{{ (importer.dataFactory.result || importer.dataFactory.inventory).triggers?.length || 0 }}</strong></div>
                  <div class="mini-metric" v-if="importer.dataFactory.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.dataFactory.result.markdownOutputPath }}</span></div>
                  <div class="mini-metric" v-if="importer.dataFactory.result"><span>Files Written</span><strong>{{ importer.dataFactory.result.markdownFilesWritten || 0 }}</strong></div>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'airflow'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-source-branch" size="28"></v-icon>
                  <div>
                    <h3>Airflow Evidence Source</h3>
                    <p class="card-help">Refresh targeted Airflow orchestration evidence for troubleshooting a known DAG or schedule source.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-6">
                    <div class="field-label-row"><v-label>Base URL</v-label><v-tooltip location="top" max-width="380" text="The URL for your Airflow webserver, not a DAG page. Open Airflow in the browser and copy the root host, for example https://airflow.company.com. The connector appends /api/v1 automatically."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Base URL help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.baseUrl" density="compact" variant="outlined" placeholder="https://airflow.example.com" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>API Version</v-label><v-tooltip location="top" max-width="360" text="The Airflow stable REST API version. Use v1 for Airflow 2.x in most deployments. Ask your Airflow admin or check the API docs page at /api/v1/ui if exposed."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow API Version help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.apiVersion" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Limit</v-label><v-tooltip location="top" max-width="340" text="Maximum number of DAGs and connections to request from Airflow. Start with 100 for discovery; increase it if your Airflow environment has more DAGs."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Limit help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model.number="importer.airflow.limit" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 10px;">
                  <div class="col-6">
                    <div class="field-label-row"><v-label>Bearer Token</v-label><v-tooltip location="top" max-width="390" text="Optional token for Airflow deployments using bearer auth. Get this from your Airflow or identity-provider admin. If your Airflow uses basic auth instead, leave token blank and use username/password."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Bearer Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.token" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Username</v-label><v-tooltip location="top" max-width="360" text="Optional Airflow username for basic authentication. Use a service account or user that can read DAGs and, if available, connections through the REST API."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Username help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.username" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Password</v-label><v-tooltip location="top" max-width="360" text="Optional password for Airflow basic authentication. Pair it with the username. For production, prefer a read-only service account managed by your Airflow admin."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Airflow Password help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.airflow.password" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverAirflow" :loading="importer.airflow.discovering" :disabled="importer.airflow.discovering || importer.airflow.connecting">Discover DAGs</v-btn>
                  <v-btn color="primary" @click="runAirflowExtraction" :loading="importer.airflow.connecting" :disabled="importer.airflow.discovering || importer.airflow.connecting">{{ importer.airflow.connecting ? 'Refreshing Airflow...' : 'Refresh Airflow Evidence' }}</v-btn>
                </div>
                <div v-if="importer.airflow.inventory || importer.airflow.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>DAGs</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).dags?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Connections</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).connections?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>API Version</span><strong>{{ (importer.airflow.result || importer.airflow.inventory).apiVersion }}</strong></div>
                  <div class="mini-metric" v-if="importer.airflow.result"><span>Files Written</span><strong>{{ importer.airflow.result.markdownFilesWritten || 0 }}</strong></div>
                  <div class="mini-metric span-12" v-if="(importer.airflow.result || importer.airflow.inventory).connectionWarning"><span>Warning</span><span>{{ (importer.airflow.result || importer.airflow.inventory).connectionWarning }}</span></div>
                  <div class="mini-metric" v-if="importer.airflow.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.airflow.result.markdownOutputPath }}</span></div>
                </div>
              </v-card>

              <v-card
                v-if="importer.activeConnector === 'databricks'"
                class="card connector-detail-card cloud-connector-panel span-12"
                variant="outlined"
              >
                <div class="cloud-connector-header">
                  <v-icon icon="mdi-cube-outline" size="28"></v-icon>
                  <div>
                    <h3>Databricks Evidence Source</h3>
                    <p class="card-help">Refresh targeted Databricks job and catalog evidence for a scoped lineage acquisition investigation.</p>
                  </div>
                </div>
                <div class="form-row" style="margin-top: 14px;">
                  <div class="col-7">
                    <div class="field-label-row"><v-label>Workspace URL</v-label><v-tooltip location="top" max-width="380" text="The Databricks workspace root URL. Open Databricks in your browser and copy the host, for example https://adb-0000000000000000.0.azuredatabricks.net. Do not include /jobs or /sql paths."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Workspace URL help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.databricks.workspaceUrl" density="compact" variant="outlined" placeholder="https://adb-0000000000000000.0.azuredatabricks.net" hide-details></v-text-field>
                  </div>
                  <div class="col-3">
                    <div class="field-label-row"><v-label>Token</v-label><v-tooltip location="top" max-width="390" text="A Databricks personal access token or service principal OAuth token with permission to list jobs, clusters, and Unity Catalog metadata. For a PAT, open Databricks > User Settings > Developer > Access tokens."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Token help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model="importer.databricks.token" type="password" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                  <div class="col-2">
                    <div class="field-label-row"><v-label>Limit</v-label><v-tooltip location="top" max-width="340" text="Maximum number of Databricks jobs to request. Start with 100 for discovery; increase it if the workspace has more jobs to evaluate."><template #activator="{ props }"><v-btn v-bind="props" icon="mdi-help-circle-outline" variant="text" density="compact" size="x-small" class="field-help-btn" aria-label="Databricks Limit help"></v-btn></template></v-tooltip></div>
                    <v-text-field v-model.number="importer.databricks.limit" type="number" min="1" density="compact" variant="outlined" hide-details></v-text-field>
                  </div>
                </div>
                <div class="btn-row" style="margin-top: 14px; justify-content: flex-end;">
                  <v-btn variant="tonal" @click="discoverDatabricks" :loading="importer.databricks.discovering" :disabled="importer.databricks.discovering || importer.databricks.connecting">Discover Workspace</v-btn>
                  <v-btn color="primary" @click="runDatabricksExtraction" :loading="importer.databricks.connecting" :disabled="importer.databricks.discovering || importer.databricks.connecting">{{ importer.databricks.connecting ? 'Refreshing Databricks...' : 'Refresh Databricks Evidence' }}</v-btn>
                </div>
                <div v-if="importer.databricks.inventory || importer.databricks.result" class="cloud-connector-body">
                  <div class="mini-metric"><span>Jobs</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).jobs?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Clusters</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).clusters?.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Catalogs</span><strong>{{ (importer.databricks.result || importer.databricks.inventory).catalogs?.length || 0 }}</strong></div>
                  <div class="mini-metric" v-if="importer.databricks.result"><span>Files Written</span><strong>{{ importer.databricks.result.markdownFilesWritten || 0 }}</strong></div>
                  <div class="mini-metric span-12" v-if="(importer.databricks.result || importer.databricks.inventory).clusterWarning"><span>Cluster Warning</span><span>{{ (importer.databricks.result || importer.databricks.inventory).clusterWarning }}</span></div>
                  <div class="mini-metric span-12" v-if="(importer.databricks.result || importer.databricks.inventory).catalogWarning"><span>Catalog Warning</span><span>{{ (importer.databricks.result || importer.databricks.inventory).catalogWarning }}</span></div>
                  <div class="mini-metric" v-if="importer.databricks.result?.markdownOutputPath"><span>Markdown Path</span><span class="text-mono text-small">{{ importer.databricks.result.markdownOutputPath }}</span></div>
                </div>
              </v-card>
              </v-col>

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Validate Markdown</h3>
                <p class="card-help">Check generated or uploaded markdown before loading it into the searchable catalog.</p>
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.validatePath" density="compact" variant="outlined" hide-details></v-text-field>
                <div class="btn-row" style="margin-top:10px;"><v-btn color="primary" @click="runValidation">Run Validate</v-btn></div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Load & Export</h3>
                <p class="card-help">Publish validated markdown into the search index or export generated artifacts.</p>
                <v-label>Path to markdown tree</v-label>
                <v-text-field v-model="importer.loadPath" density="compact" variant="outlined" hide-details></v-text-field>
                <div style="margin-top: 8px; font-size: 0.85em; color: #4b5563;">
                  <strong>Elasticsearch:</strong>
                  <span :style="{ color: isElasticsearchHealthy ? '#065f46' : '#991b1b', fontWeight: '600' }">{{ elasticsearchStatusLabel }}</span>
                  <span v-if="importer.status?.elasticsearchUrl"> ({{ importer.status.elasticsearchUrl }})</span>
                </div>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="runLoad" :disabled="!canLoadToIndex">Load to Index</v-btn>
                  <v-btn variant="tonal" @click="loadImportStatus">Refresh Status</v-btn>
                  <v-btn variant="tonal" @click="downloadGeneratedMarkdownZip">Download ZIP</v-btn>
                </div>
                <div class="mini-stack mt-8" v-if="importer.status">
                  <div class="mini-metric"><span>Status</span><v-chip size="x-small" variant="tonal" :color="importer.status.status === 'ok' ? 'success' : 'amber'">{{ importer.status.status || 'unknown' }}</v-chip></div>
                  <div class="mini-metric"><span>Indexed Objects</span><strong>{{ importer.status.loadedObjectCount || 0 }}</strong></div>
                  <div class="mini-metric"><span>Elasticsearch</span><v-chip size="x-small" variant="tonal" :color="isElasticsearchHealthy ? 'success' : 'error'">{{ elasticsearchStatusLabel }}</v-chip></div>
                  <div class="mini-metric" v-if="importer.status.lastGeneratedPath"><span>Last Generated</span><span class="text-mono text-small">{{ importer.status.lastGeneratedPath }}</span></div>
                </div>
                <div v-else class="empty">No status yet - click Refresh Status.</div>
              </v-card>
              </v-col>
              </v-row>
              </div>
              </details>
            </div>


`;

export const platformAdminPageTemplate = `
            <div v-if="activeView === 'admin'">
              <v-row>
              <v-col cols="12">
              <v-card class="card admin-overview-card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Platform Operations Overview</span>
                  <v-btn size="small" variant="outlined" @click="loadAdminDashboard">Refresh Overview</v-btn>
                </div>
                <p class="card-help">Review users, audit activity, health, and settings first. Raw diagnostics stay collapsed unless an admin needs to investigate an issue.</p>
                <div class="mini-stack">
                  <div class="mini-metric"><span>Total Users</span><strong>{{ admin.dashboardUsers?.total || admin.dashboardUsers?.users?.length || admin.users.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Active Users</span><strong>{{ admin.dashboardUsers?.active || admin.users.filter((user) => user.active).length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Audit Events</span><strong>{{ admin.audit.length || 0 }}</strong></div>
                  <div class="mini-metric"><span>Captured API Errors</span><strong>{{ apiErrors.length || 0 }}</strong></div>
                </div>
              </v-card>
              </v-col>
              </v-row>

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>User Administration</h3>
                <div class="form-row" style="margin-bottom:10px;">
                  <div class="col-4"><v-label>Email</v-label><v-text-field v-model="admin.newUser.email" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Name</v-label><v-text-field v-model="admin.newUser.name" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-3"><v-label>Role</v-label><v-select v-model="admin.newUser.role" density="compact" variant="outlined" hide-details :items="['Admin','PowerUser','Analyst','Viewer']"></v-select></div>
                  <div class="col-2" style="display:flex;align-items:end;"><v-btn color="primary" @click="createUser">Create</v-btn></div>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Active</th><th>Actions</th></tr></thead>
                    <tbody>
                      <tr v-for="user in admin.users" :key="user.userId">
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                          <v-select
                            v-model="user.role"
                            density="compact"
                            variant="outlined"
                            hide-details
                            :items="['Admin','PowerUser','Analyst','Viewer']"
                            @update:model-value="updateUserRole(user)"
                          ></v-select>
                        </td>
                        <td>{{ user.active ? 'yes' : 'no' }}</td>
                        <td class="btn-row">
                          <v-btn size="small" variant="tonal" v-if="user.active" @click="deactivateUser(user.userId)">Deactivate</v-btn>
                          <v-btn size="small" color="success" variant="tonal" v-else @click="reactivateUser(user.userId)">Reactivate</v-btn>
                          <v-btn size="small" color="error" variant="tonal" @click="deleteUser(user.userId)">Delete</v-btn>
                        </td>
                      </tr>
                      <tr v-if="admin.users.length === 0"><td colspan="5" class="empty">No admin users loaded.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>User Snapshot</h3>
                <div class="health-grid" v-if="admin.dashboardUsers">
                  <div class="health-card">
                    <span class="health-icon">&#128100;</span>
                    <div>
                      <div class="health-name">Total Users</div>
                      <div class="health-desc">{{ admin.dashboardUsers.total || admin.dashboardUsers.users?.length || '-' }}</div>
                    </div>
                  </div>
                  <div class="health-card">
                    <span class="health-icon">&#9989;</span>
                    <div>
                      <div class="health-name">Active</div>
                      <div class="health-desc">{{ admin.dashboardUsers.active || '-' }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">No user snapshot available.</div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Platform Health</h3>
                <div class="health-grid" v-if="admin.dashboardHealth">
                  <div class="health-card" v-for="(val, svc) in admin.dashboardHealth" :key="svc">
                    <span v-if="typeof val === 'boolean' || val === 'ok' || val === 'healthy'" class="health-icon">&#9989;</span>
                    <span v-else class="health-icon">&#10060;</span>
                    <div>
                      <div class="health-name">{{ svc }}</div>
                      <div class="health-desc">{{ typeof val === 'object' ? (val.status || 'configured') : val }}</div>
                    </div>
                  </div>
                </div>
                <div v-else class="empty">Health data unavailable.</div>
              </v-card>
              </v-col>

              <v-col cols="12" md="6">
              <v-card class="card" variant="outlined">
                <h3>Platform Settings</h3>
                <div class="mini-stack" v-if="admin.dashboardSettings">
                  <div class="mini-metric" v-for="(val, key) in admin.dashboardSettings" :key="key" style="font-size:11px;">
                    <span>{{ key }}</span>
                    <strong>{{ formatSettingValue(val) }}</strong>
                  </div>
                </div>
                <div v-else class="empty">No settings loaded.</div>
              </v-card>
              </v-col>
              </v-row>

              

              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <h3>Audit Trail</h3>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Time</th><th>User</th><th>Action</th><th>Details</th></tr></thead>
                    <tbody>
                      <tr v-for="event in admin.audit" :key="event.eventId || event.id">
                        <td>{{ formatTimestamp(event.timestamp) }}</td>
                        <td>{{ event.userName || event.userId }}</td>
                        <td>{{ event.action }}</td>
                        <td>{{ formatAuditDetails(event.details) }}</td>
                      </tr>
                      <tr v-if="admin.audit.length === 0"><td colspan="4" class="empty">No audit events available.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>
              </v-row>

              

              <details class="admin-support-lane">
              <summary>
                <span>Advanced Diagnostics</span>
                <small>Raw API error log and clear action for admin troubleshooting</small>
              </summary>
              <div class="admin-support-body">
              <v-row>
              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <h3>API Error Log</h3>
                <div class="btn-row" style="margin-bottom:10px;">
                  <v-btn size="small" variant="tonal" @click="clearApiErrors">Clear Error Log</v-btn>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr><th>Time</th><th>Status</th><th>Method</th><th>Endpoint</th><th>Message</th><th>Request ID</th></tr></thead>
                    <tbody>
                      <tr v-for="item in apiErrors" :key="item.id">
                        <td>{{ item.timestamp }}</td>
                        <td>{{ item.status }}</td>
                        <td>{{ item.method }}</td>
                        <td class="mono">{{ item.endpoint }}</td>
                        <td>{{ item.message }}</td>
                        <td class="mono">{{ item.requestId }}</td>
                      </tr>
                      <tr v-if="apiErrors.length === 0"><td colspan="6" class="empty">No API errors captured in this session.</td></tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>
              </v-col>
              </v-row>
              </div>
              </details>
            </div>


`;
