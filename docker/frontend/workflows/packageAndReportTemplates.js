/* eslint-env browser */

export const dataProductsPageTemplate = `
            <div v-if="activeView === 'products'">
              <v-row>
                <v-col cols="12">
                  <v-card class="card data-products-future-card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Data Products Future-State</span>
                        <h3>Parked Until Product Definition Is Explicit</h3>
                        <p class="card-help">Data Products is not a primary workflow yet. Report metadata, metric logic, lineage impact, ownership, and confidence should be handled in the workflow that already owns each job.</p>
                      </div>
                      <v-chip color="warning" variant="flat" size="small">Future-state</v-chip>
                    </div>
                    <div class="data-products-route-grid">
                      <button type="button" class="data-products-route-card" @click="onViewChange('browse')">
                        <strong>Find reports and assets</strong>
                        <span>Use Search / Catalog for report metadata, source location, ownership, confidence, and business-first detail.</span>
                      </button>
                      <button type="button" class="data-products-route-card" @click="onViewChange('discovery')">
                        <strong>Understand impact</strong>
                        <span>Use Search selected-asset lineage for report, table, column, and metric impact answers before graph evidence.</span>
                      </button>
                      <button type="button" class="data-products-route-card" @click="onViewChange('metrics')">
                        <strong>Compare metrics</strong>
                        <span>Use Metrics for business concepts, report or department variants, in-review suggestions, and business logic summaries.</span>
                      </button>
                    </div>
                    <div class="lineage-help-panel" style="margin-top:12px;">
                      <div class="lineage-help-title">Definition Needed Before This Returns</div>
                      <div class="lineage-help-copy">The product model still needs an explicit owner, consumer promise, asset bundle contract, certification rules, access posture, lifecycle states, and success metrics. Until then, this page stays as a draft/reference area.</div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12">
                  <div class="section-header" style="margin-bottom:8px;">
                    <span class="section-title">Draft Product References</span>
                    <span class="text-small">Reference-only until the Data Products workflow is defined.</span>
                  </div>
                </v-col>
                <v-col
                  v-for="product in productsCatalog.products"
                  :key="product.product_id || product.slug"
                  cols="12"
                  md="4"
                >
                  <v-card class="card" variant="outlined" @click="productsCatalog.selected = product" style="cursor:pointer;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">{{ product.name }}</span>
                      <div class="btn-row">
                        <v-chip size="small" color="info" variant="tonal">{{ product.trust_level || 'unrated' }}</v-chip>
                        <v-chip size="small" color="success" variant="flat" v-if="product.certified">Certified</v-chip>
                      </div>
                    </div>
                    <div class="asset-meta" style="margin-bottom:8px;">
                      <v-chip size="x-small" class="schema-badge" variant="tonal">{{ product.domain }}</v-chip>
                      <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ product.owner }}</v-chip>
                    </div>
                    <div class="asset-description">{{ (product.description || '').slice(0, 180) }}...</div>
                    <div class="btn-row mt-8">
                      <v-chip size="small" variant="outlined">{{ (product.assets || []).length }} assets</v-chip>
                      <v-chip size="small" variant="outlined">v{{ product.version }}</v-chip>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12" v-if="!productsCatalog.products.length">
                  <v-card class="card" variant="outlined">
                    <div class="empty-state" style="padding:20px;">
                      <div class="empty-state-icon">&#128230;</div>
                      <h4>No draft product references loaded</h4>
                      <p>Use Search and Metrics for the active report metadata and impact workflows.</p>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>
`;

export const governanceInsightsPageTemplate = `
            <div v-if="activeView === 'reports'">
              <v-row>
              <v-col cols="12">
              <v-card class="card" style="padding:12px 16px;" variant="outlined">
                <div class="section-header" style="margin-bottom:10px;">
                  <span class="section-title">&#x25A7; Executive Reporting Suite</span>
                  <v-chip size="small" color="info" variant="tonal">{{ resolvedPersona.charAt(0).toUpperCase() + resolvedPersona.slice(1) }} View</v-chip>
                </div>
                <v-row>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.objects }}</div><div class="label">Governed Objects</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.dependencies }}</div><div class="label">Total Dependencies</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.qualityScore || '-' }}</div><div class="label">Quality Score</div></v-card></v-col>
                  <v-col cols="12" sm="6" md="3"><v-card class="card kpi" variant="outlined"><div class="value">{{ executiveReportMetrics.blastObjects }}</div><div class="label">High-Risk Objects</div></v-card></v-col>
                </v-row>
              </v-card>
              </v-col>

              <v-col cols="12">
              <v-card class="card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Data Marketplace Access Workflow</span>
                  <div class="btn-row">
                    <v-select
                      v-model="marketplace.scope"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width:170px;"
                      :items="[
                        { title: 'My Requests', value: 'mine' },
                        { title: 'My Approvals', value: 'approvals' },
                        ...(isMarketplaceAdmin ? [{ title: 'All Requests', value: 'all' }] : []),
                      ]"
                      @update:model-value="loadMarketplaceRequests"
                    ></v-select>
                    <v-btn size="small" variant="outlined" @click="loadMarketplaceRequests()">Refresh</v-btn>
                  </div>
                </div>

                <div class="form-row" style="margin-bottom:10px;">
                  <div class="col-3"><v-label>Asset ID</v-label><v-text-field v-model="marketplace.form.assetId" placeholder="sales.orders" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-2"><v-label>Requested Role</v-label><v-select v-model="marketplace.form.requestedRole" density="compact" variant="outlined" hide-details :items="['Viewer','Analyst','PowerUser']"></v-select></div>
                  <div class="col-3"><v-label>Approver User ID</v-label><v-text-field v-model="marketplace.form.approverId" placeholder="user-approver" density="compact" variant="outlined" hide-details></v-text-field></div>
                  <div class="col-4"><v-label>Approver Email</v-label><v-text-field v-model="marketplace.form.approverEmail" placeholder="approver@company.com" density="compact" variant="outlined" hide-details></v-text-field></div>
                </div>
                <v-label>Business Justification</v-label>
                <v-textarea v-model="marketplace.form.justification" rows="3" variant="outlined" density="compact" hide-details placeholder="Describe why access is required and business impact if delayed."></v-textarea>
                <div class="btn-row" style="margin-top:10px;">
                  <v-btn color="primary" @click="submitMarketplaceAccessRequest" :loading="marketplace.loading" :disabled="marketplace.loading">Submit Request</v-btn>
                  <v-btn variant="tonal" @click="syncMarketplaceFormWithSelection">Use Selected Object</v-btn>
                </div>

                <div class="table-wrap mt-8">
                  <v-table density="compact">
                    <thead>
                      <tr>
                        <th>Request</th>
                        <th>Asset</th>
                        <th>Status</th>
                        <th>Requester</th>
                        <th>Approver</th>
                        <th>SLA Due</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="requestItem in marketplace.requests" :key="requestItem.requestId">
                        <td class="text-mono text-small">{{ requestItem.requestId }}</td>
                        <td>{{ requestItem.assetId }}</td>
                        <td>
                        <v-chip size="x-small" variant="tonal" :color="requestItem.sla?.overdue ? 'amber' : 'success'">{{ requestItem.status }}</v-chip>
                        </td>
                        <td>{{ requestItem.requester?.email || requestItem.requester?.userId || '-' }}</td>
                        <td>{{ requestItem.approver?.email || requestItem.approver?.userId || '-' }}</td>
                        <td>{{ formatTimestamp(requestItem.sla?.dueAt) }}</td>
                        <td class="btn-row">
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            variant="outlined"
                            @click="reviewMarketplaceRequest(requestItem, 'start_review')"
                          >Start</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            variant="outlined"
                            @click="reviewMarketplaceRequest(requestItem, 'request_more_info')"
                          >More Info</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            color="success"
                            variant="tonal"
                            @click="reviewMarketplaceRequest(requestItem, 'approve')"
                          >Approve</v-btn>
                          <v-btn
                            v-if="canReviewMarketplaceRequest(requestItem) && ['submitted','in-review','request-more-info'].includes(requestItem.status)"
                            size="small"
                            color="error"
                            variant="tonal"
                            @click="reviewMarketplaceRequest(requestItem, 'reject')"
                          >Reject</v-btn>
                          <v-btn
                            v-if="isMarketplaceAdmin && requestItem.status === 'approved'"
                            size="small"
                            color="primary"
                            @click="fulfillMarketplaceRequest(requestItem)"
                          >Fulfill</v-btn>
                        </td>
                      </tr>
                      <tr v-if="!marketplace.requests.length">
                        <td colspan="7" class="empty">No access requests found for this scope.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-8" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Blast Radius Analysis</span>
                  <div class="btn-row">
                    <v-text-field v-model="selectedObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details style="width:200px;"></v-text-field>
                    <v-btn size="small" color="primary" @click="loadDiscovery">Recalculate</v-btn>
                    <v-btn size="small" variant="outlined" @click="refreshBlastRadiusReport">Refresh</v-btn>
                  </div>
                </div>
                <div class="stat-row" v-if="reports.blastRadius">
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.impactedObjects }}</div><div class="stat-label">Impacted</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.directDownstream }}</div><div class="stat-label">Downstream</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.directUpstream }}</div><div class="stat-label">Upstream</div></div>
                  <div class="stat-item"><div class="stat-value">{{ reports.blastRadius.maxDepth }}</div><div class="stat-label">Max Depth</div></div>
                </div>
                <div style="height:280px;margin-top:10px;"><canvas id="blast-radius-chart"></canvas></div>
              </v-card>

              <v-card class="card span-4" variant="outlined">
                <h3>Tier &times; Type Distribution</h3>
                <div class="table-wrap" v-if="reports.blastHeatmap && reports.blastHeatmap.length">
                  <v-table density="compact">
                    <thead><tr><th>Tier</th><th>Type</th><th>#</th></tr></thead>
                    <tbody>
                      <tr v-for="cell in reports.blastHeatmap" :key="'rep-heat-' + cell.tier + '-' + cell.type">
                        <td><v-chip size="x-small" :class="cell.tier==='T1'?'admin':cell.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ cell.tier }}</v-chip></td>
                        <td>{{ cell.type }}</td>
                        <td><strong>{{ cell.count }}</strong></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty-state" style="padding:24px;">
                  <div class="empty-state-icon">&#128200;</div>
                  <h4>No heat data</h4>
                  <p>Run blast radius analysis first.</p>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">&#127942; Critical Dependency Leaderboard</span>
                  <span class="text-muted text-small">Top 10 objects by reach score - highest risk targets</span>
                </div>
                <div class="ranked-list" v-if="criticalDependencyLeaderboard.length">
                  <div
                    v-for="(row, idx) in criticalDependencyLeaderboard"
                    :key="'leader-' + row.id"
                    class="ranked-item"
                    style="grid-template-columns:28px 1fr 80px 60px 60px 70px;cursor:pointer;"
                    @click="selectedObjectId = row.id"
                  >
                    <span class="ranked-num" :style="idx < 3 ? 'color:#f59e0b;font-weight:900;' : ''">#{{ idx + 1 }}</span>
                    <span class="ranked-name">{{ row.id }}</span>
                    <span class="ranked-type">
                      <v-chip size="x-small" :class="row.tier==='T1'?'admin':row.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ row.tier }}</v-chip>
                    </span>
                    <span class="text-small text-muted" style="text-align:center;">&#8679; {{ row.inDegree }}</span>
                    <span class="text-small text-muted" style="text-align:center;">&#8681; {{ row.outDegree }}</span>
                    <span class="ranked-score">{{ row.reachScore }}</span>
                  </div>
                </div>
                <div v-else class="empty-state">
                  <div class="empty-state-icon">&#127942;</div>
                  <h4>Leaderboard empty</h4>
                  <p>Load lineage data and run blast radius to populate.</p>
                </div>
              </v-card>

              <v-card class="card span-12" variant="outlined">
                <div class="section-header">
                  <span class="section-title">All Dependency Reach</span>
                  <span class="text-muted text-small">{{ (reports.blastRows || []).length }} objects analyzed</span>
                </div>
                <div class="table-wrap">
                  <v-table density="compact">
                    <thead><tr>
                      <th>Object</th><th>Type</th><th>Tier</th>
                      <th>Downstream</th><th>Upstream</th><th>Reach Score</th>
                    </tr></thead>
                    <tbody>
                      <tr
                        v-for="row in (reports.blastRows || []).slice(0, 30)"
                        :key="'blast-row-' + row.id"
                        class="clickable"
                        @click="selectedObjectId = row.id"
                      >
                        <td><strong>{{ row.id }}</strong></td>
                        <td><v-chip size="x-small" class="type-chip" variant="outlined">{{ row.type }}</v-chip></td>
                        <td><v-chip size="x-small" :class="row.tier==='T1'?'admin':row.tier==='T2'?'poweruser':'analyst'" variant="flat">{{ row.tier }}</v-chip></td>
                        <td>{{ row.downstreamDepth === null ? '-' : row.downstreamDepth }}</td>
                        <td>{{ row.upstreamDepth === null ? '-' : row.upstreamDepth }}</td>
                        <td><strong style="color:var(--primary);">{{ row.reachScore }}</strong></td>
                      </tr>
                      <tr v-if="!reports.blastRows || reports.blastRows.length === 0">
                        <td colspan="6" class="empty">No blast radius data yet - render a graph first.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
              </v-card>

              <v-card class="card span-7" variant="outlined">
                <h3>Export Center</h3>
                <div class="export-cards">
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/catalog.csv', 'catalog.csv')">
                    <div class="export-icon">&#128202;</div>
                    <div class="export-label">Catalog CSV</div>
                    <div class="export-desc">All objects, flat export</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/catalog.xlsx', 'catalog.xlsx')">
                    <div class="export-icon">&#128209;</div>
                    <div class="export-label">Excel Workbook</div>
                    <div class="export-desc">Formatted spreadsheet</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/dependency/' + encodeURIComponent(selectedObjectId) + '.pdf', 'dependency.pdf')">
                    <div class="export-icon">&#128196;</div>
                    <div class="export-label">Dependency PDF</div>
                    <div class="export-desc">Impact report for {{ selectedObjectId }}</div>
                  </div>
                  <div class="export-card" @click="downloadProtected('/api/v1/reporting/export/visualization/' + encodeURIComponent(selectedObjectId) + '?format=svg', 'visualization.svg')">
                    <div class="export-icon">&#127912;</div>
                    <div class="export-label">Graph SVG</div>
                    <div class="export-desc">Lineage visualization</div>
                  </div>
                </div>

                <div class="section-header mt-8">
                  <span class="section-title">Share Link</span>
                </div>
                <div class="form-row" style="grid-template-columns:1fr auto auto;">
                  <v-text-field v-model="reports.shareObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details></v-text-field>
                  <v-select v-model="reports.shareFormat" density="compact" variant="outlined" hide-details style="width:80px;" :items="['svg','png']"></v-select>
                  <v-btn size="small" variant="outlined" @click="createShareLink">Generate</v-btn>
                </div>
                <div class="code-block mt-8" v-if="reports.sharedLink" style="word-break:break-all;">{{ reports.sharedLink }}</div>
              </v-card>

              <v-card class="card span-5" variant="outlined">
                <h3>One-Click Report Packs</h3>
                <div class="pack-cards" style="grid-template-columns:1fr;">
                  <div class="pack-card">
                    <div class="pack-card-header">&#127970; Executive Pack</div>
                    <div class="pack-files">Excel catalog + Dependency PDF + Visualization SVG</div>
                    <v-btn block color="primary" :loading="reports.runningPack" :disabled="reports.runningPack" @click="runReportPack('executive')">
                      {{ reports.runningPack ? 'Downloading...' : 'Download Executive Pack' }}
                    </v-btn>
                  </div>
                  <div class="pack-card" style="margin-top:8px;">
                    <div class="pack-card-header">&#128101; Steward Pack</div>
                    <div class="pack-files">CSV catalog + Dependency PDF</div>
                    <v-btn block variant="tonal" :disabled="reports.runningPack" @click="runReportPack('steward')">
                      Download Steward Pack
                    </v-btn>
                  </div>
                  <div class="pack-card" style="margin-top:8px;">
                    <div class="pack-card-header">&#128200; Analyst Pack</div>
                    <div class="pack-files">CSV catalog + Graph SVG</div>
                    <v-btn block variant="outlined" :disabled="reports.runningPack" @click="runReportPack('analyst')">
                      Download Analyst Pack
                    </v-btn>
                  </div>
                </div>

                <div class="pack-status mt-8" v-if="reports.lastPackRun">
                  &#10003; Last run: <strong>{{ reports.lastPackRun.packType }}</strong> pack &nbsp;&middot;&nbsp;
                  {{ reports.lastPackRun.fileCount }} files &nbsp;&middot;&nbsp;
                  {{ new Date(reports.lastPackRun.downloadedAt).toLocaleTimeString() }}
                </div>

                <div class="divider"></div>
                <h4>Scheduled Reports</h4>
                <div class="form-row" style="grid-template-columns:1fr auto;">
                  <v-text-field v-model="reports.recipient" placeholder="Recipient email" density="compact" variant="outlined" hide-details></v-text-field>
                  <v-btn size="small" variant="outlined" @click="createSchedule">Schedule</v-btn>
                </div>
                <div class="table-wrap mt-8" v-if="reports.schedules.length">
                  <v-table density="compact">
                    <thead><tr><th>ID</th><th>Status</th><th></th></tr></thead>
                    <tbody>
                      <tr v-for="item in reports.schedules" :key="item.scheduleId">
                        <td class="text-mono">{{ item.scheduleId }}</td>
                        <td><v-chip size="x-small" variant="tonal" :color="item.active ? 'success' : 'secondary'">{{ item.active ? 'Active' : 'Paused' }}</v-chip></td>
                        <td><v-btn size="small" variant="outlined" @click="runSchedule(item.scheduleId)">Run</v-btn></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty">No schedules configured.</div>
              </v-card>
            </div>


`;
