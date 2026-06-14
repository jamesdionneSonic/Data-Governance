/* eslint-env browser */

export const businessGlossaryPageTemplate = `
            <div v-if="activeView === 'glossary'">
              <div class="glossary-workspace">
                <aside class="glossary-rail">
                  <div class="glossary-rail-block">
                    <div class="glossary-rail-title">Business-Defined Glossary</div>
                    <div class="form-row">
                      <v-text-field
                        v-model="glossary.query"
                        placeholder="Search terms, owners, synonyms..."
                        density="compact"
                        variant="outlined"
                        hide-details
                        @keyup.enter="loadGlossary"
                      ></v-text-field>
                    </div>
                    <v-btn size="small" color="primary" block @click="loadGlossary">Search</v-btn>
                    <div class="glossary-admin-actions">
                      <v-btn size="small" variant="tonal" color="primary" @click="startGlossaryCreate">New Term</v-btn>
                      <v-btn size="small" variant="tonal" :disabled="!glossary.selected" @click="startGlossaryEdit">Edit</v-btn>
                    </div>
                    <div class="glossary-domain-list" v-if="glossary.domains.length">
                      <div class="glossary-muted-label">Domains</div>
                      <div class="glossary-domain" v-for="domain in glossary.domains" :key="'glossary-domain-' + domain">
                        <span>{{ domain }}</span>
                      </div>
                    </div>
                    <div class="glossary-term-list">
                      <button
                        v-for="term in glossary.terms"
                        :key="term.slug"
                        class="glossary-term-button"
                        :class="{ active: term.slug === glossary.selected?.slug }"
                        @click="openGlossaryTerm(term.slug)"
                      >
                        <span class="glossary-term-name">{{ term.term }}</span>
                        <span class="glossary-term-meta">{{ term.domain }}<template v-if="term.asset_count"> Â· {{ term.asset_count }} links</template></span>
                      </button>
                    </div>
                  </div>

                </aside>

                <main class="glossary-main">
                  <section class="glossary-record compact" v-if="glossary.editing">
                    <div class="glossary-section-heading" style="margin-top:0;">
                      <div>
                        <h3>{{ glossary.editMode === 'edit' ? 'Edit Glossary Term' : 'Create Glossary Term' }}</h3>
                        <p>Maintain the governed business definition, owner, steward, and synonyms before linking technical evidence.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" variant="tonal" @click="cancelGlossaryEdit">Cancel</v-btn>
                        <v-btn size="small" color="primary" @click="saveGlossaryTerm">Save Term</v-btn>
                      </div>
                    </div>
                    <div class="glossary-editor-grid">
                      <v-text-field v-model="glossary.editor.term" label="Term" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.domain" label="Domain" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-select v-model="glossary.editor.status" :items="['draft','approved','deprecated']" label="Status" density="compact" variant="outlined" hide-details></v-select>
                      <v-text-field v-model="glossary.editor.parent" label="Parent slug" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.owner" label="Technical owner" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.business_owner" label="Business owner" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.steward" label="Steward" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.synonyms" label="Synonyms" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.related_terms" label="Related terms" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-text-field v-model="glossary.editor.tags" label="Tags" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-textarea class="glossary-editor-definition" v-model="glossary.editor.definition" label="Definition" rows="4" density="compact" variant="outlined" hide-details></v-textarea>
                    </div>
                    <div class="btn-row mt-12" v-if="glossary.editMode === 'edit'">
                      <v-btn size="small" color="error" variant="tonal" @click="deleteGlossaryTerm">Delete Term</v-btn>
                    </div>
                  </section>

                  <section class="glossary-record">
                    <div v-if="glossary.selected">
                      <div class="glossary-record-header">
                        <div>
                          <div class="glossary-kicker">{{ glossary.selected.domain }}</div>
                          <h2>{{ glossary.selected.term }}</h2>
                          <p v-if="glossary.selected.definition">{{ glossary.selected.definition }}</p>
                          <p v-else>This term is waiting for a business-authored definition.</p>
                        </div>
                        <div class="glossary-status-stack">
                          <span class="glossary-status approved">{{ glossary.selected.status }}</span>
                          <span class="glossary-status">v{{ glossary.selected.version || 1 }}</span>
                        </div>
                      </div>

                      <div class="glossary-owner-strip">
                        <div><span>Technical Owner</span><strong>{{ glossary.selected.owner || 'unassigned' }}</strong></div>
                        <div><span>Business Owner</span><strong>{{ glossary.selected.business_owner || '-' }}</strong></div>
                        <div><span>Steward</span><strong>{{ glossary.selected.steward || '-' }}</strong></div>
                        <div><span>Effective From</span><strong>{{ glossary.selected.effective_from || '-' }}</strong></div>
                      </div>

                      <div class="glossary-content-grid">
                        <article class="glossary-definition">
                          <div v-html="renderDocHtml(glossary.selected.body || '')"></div>
                        </article>
                        <aside class="glossary-facts">
                          <div class="glossary-fact">
                            <span>Parent Term</span>
                            <strong>{{ glossary.selected.parent || '-' }}</strong>
                          </div>
                          <div class="glossary-fact">
                            <span>Synonyms</span>
                            <div class="glossary-chip-row">
                              <span v-for="synonym in glossary.selected.synonyms || []" :key="'synonym-' + synonym" class="glossary-soft-chip">{{ synonym }}</span>
                              <strong v-if="!(glossary.selected.synonyms || []).length">-</strong>
                            </div>
                          </div>
                          <div class="glossary-fact">
                            <span>Related Terms</span>
                            <div class="glossary-chip-row">
                              <span v-for="related in glossary.selected.related_terms || []" :key="'related-' + related" class="glossary-soft-chip">{{ related }}</span>
                              <strong v-if="!(glossary.selected.related_terms || []).length">-</strong>
                            </div>
                          </div>
                        </aside>
                      </div>

                      <details class="glossary-support-lane">
                        <summary>
                          <span>Linked Technical Evidence</span>
                          <small>{{ (glossary.selected.assets || []).length }} linked asset{{ (glossary.selected.assets || []).length === 1 ? '' : 's' }}</small>
                        </summary>
                        <div class="glossary-support-body">
                          <div class="glossary-section-heading">
                            <div>
                              <h3>Linked Technical Evidence</h3>
                              <p>Physical objects support the term, but they do not replace the business definition.</p>
                            </div>
                          </div>
                          <div class="glossary-table-wrap">
                            <table class="glossary-table">
                              <thead>
                                <tr>
                                  <th>Asset</th>
                                  <th>Type</th>
                                  <th>Relationship</th>
                                  <th>Confidence</th>
                                  <th>Notes</th>
                                </tr>
                              </thead>
                              <tbody>
                                <tr v-for="asset in glossary.selected.assets || []" :key="'glossary-asset-' + asset.asset_id">
                                  <td><code>{{ asset.asset_id }}</code></td>
                                  <td>{{ asset.type || 'asset' }}</td>
                                  <td>{{ asset.relationship || 'related' }}</td>
                                  <td>{{ asset.confidence || '-' }}</td>
                                  <td>{{ asset.notes || '-' }}</td>
                                </tr>
                                <tr v-if="!(glossary.selected.assets || []).length">
                                  <td colspan="5" class="glossary-empty-row">No physical assets linked yet.</td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </details>

                      <details class="glossary-support-lane">
                        <summary>
                          <span>Add Or Change Asset Mapping</span>
                          <small>Find and link supporting catalog objects</small>
                        </summary>
                        <div class="glossary-support-body">
                          <div class="glossary-mapping-panel">
                            <div>
                              <h3>Add Mapping</h3>
                              <p>Attach a catalog object, table, column, package, or dashboard to this term.</p>
                            </div>
                            <div class="glossary-asset-search">
                              <v-text-field v-model="glossary.assetSearchQuery" label="Find asset" density="compact" variant="outlined" hide-details @keyup.enter="searchGlossaryMappingAssets"></v-text-field>
                              <v-btn color="primary" variant="tonal" :loading="glossary.assetSearchLoading" @click="searchGlossaryMappingAssets">Find</v-btn>
                            </div>
                            <div class="glossary-asset-results" v-if="glossary.assetSearchResults.length">
                              <button
                                v-for="asset in glossary.assetSearchResults"
                                :key="'glossary-map-result-' + (asset.id || asset.name)"
                                class="glossary-asset-result"
                                @click="chooseGlossaryMappingAsset(asset)"
                              >
                                <strong>{{ asset.id || asset.name }}</strong>
                                <span>{{ asset.type || 'asset' }} - {{ asset.database || 'unknown' }}</span>
                              </button>
                            </div>
                            <div class="glossary-mapping-form">
                              <v-text-field v-model="glossary.newMapping.asset_id" label="Asset id" density="compact" variant="outlined" hide-details></v-text-field>
                              <v-select v-model="glossary.newMapping.relationship" :items="['defines','contains','reports','derived_from','related']" label="Relationship" density="compact" variant="outlined" hide-details></v-select>
                              <v-text-field v-model.number="glossary.newMapping.confidence" label="Confidence" type="number" min="0" max="1" step="0.05" density="compact" variant="outlined" hide-details></v-text-field>
                              <v-btn color="primary" @click="linkGlossaryAsset">Link Asset</v-btn>
                            </div>
                          </div>
                        </div>
                      </details>
                    </div>
                    <div v-else class="empty">Select a glossary term.</div>
                  </section>

                  <details class="glossary-support-lane">
                    <summary>
                      <span>Semantic Resolver</span>
                      <small>Use when you need to discover candidate assets from a term</small>
                    </summary>
                    <div class="glossary-support-body">
                      <div class="glossary-section-heading">
                        <div>
                          <h3>Semantic Resolver</h3>
                          <p>Resolver results are candidate evidence. Review them before linking them to the business term.</p>
                        </div>
                      </div>
                      <div class="glossary-resolver-inline">
                        <v-text-field
                          v-model="glossary.semanticQuery"
                          placeholder="Try a business term..."
                          density="compact"
                          variant="outlined"
                          hide-details
                          @keyup.enter="resolveGlossarySemanticQuery"
                        ></v-text-field>
                        <v-btn size="small" color="primary" @click="resolveGlossarySemanticQuery">Resolve</v-btn>
                      </div>
                      <div class="glossary-resolver-metrics" v-if="glossary.semanticResolution">
                        <div>
                          <span>Terms</span>
                          <strong>{{ glossary.semanticResolution.terms?.length || 0 }}</strong>
                        </div>
                        <div>
                          <span>Assets</span>
                          <strong>{{ glossary.semanticResolution.assets?.length || 0 }}</strong>
                        </div>
                      </div>
                      <div class="glossary-table-wrap" v-if="glossary.semanticResolution?.assets?.length">
                        <table class="glossary-table">
                          <thead>
                            <tr>
                              <th>Asset</th>
                              <th>Type</th>
                              <th>Reason</th>
                              <th>Score</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="asset in glossary.semanticResolution.assets" :key="'semantic-' + asset.asset_id">
                              <td><code>{{ asset.asset_id }}</code></td>
                              <td>{{ asset.type }}</td>
                              <td>{{ asset.reason }}</td>
                              <td>{{ asset.score }}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </details>
                </main>
              </div>
            </div>

`;

export const advancedGovernancePageTemplate = `
            <div v-if="activeView === 'governance'" class="governance-page">
              <v-row>
                <v-col cols="12">
                  <v-card class="card review-work-warning-card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Advanced Trust Controls</span>
                        <p class="card-help">This drilldown preserves classification, masking, quality, and policy controls for stewards/admins. Primary trust review now starts in Governance Ops through confidence warnings and review queues.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" color="primary" @click="onViewChange('governanceOps')">Back to Review Work</v-btn>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.health_score || 0 }}</div>
                    <div class="label">Governance Health</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.ownership_coverage_pct || 0 }}%</div>
                    <div class="label">Ownership Coverage</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.classification_coverage_pct || 0 }}%</div>
                    <div class="label">Classification Coverage</div>
                  </v-card>
                </v-col>
                <v-col cols="12" sm="6" md="3">
                  <v-card class="card kpi" variant="outlined">
                    <div class="value">{{ governance.health?.metrics?.certified_pct || 0 }}%</div>
                    <div class="label">Certified Assets</div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Policy Effectiveness</span>
                      <v-chip size="small" variant="tonal" color="primary">
                        {{ governance.classification.policyEffectiveness?.coverage_score || 0 }} score
                      </v-chip>
                    </div>
                    <div class="policy-dashboard-grid">
                      <div class="policy-dashboard-score">
                        <span>Classification Coverage</span>
                        <strong>{{ governance.classification.policyEffectiveness?.classification_coverage?.percent || 0 }}%</strong>
                        <small>{{ governance.classification.policyEffectiveness?.classification_coverage?.assets || 0 }} / {{ governance.classification.policyEffectiveness?.total_assets || 0 }} assets</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Policy Coverage</span>
                        <strong>{{ governance.classification.policyEffectiveness?.policy_coverage?.percent || 0 }}%</strong>
                        <small>{{ governance.classification.policyEffectiveness?.policy_coverage?.assets || 0 }} governed assets</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Masked Assets</span>
                        <strong>{{ governance.classification.policyEffectiveness?.controls?.mask || 0 }}</strong>
                        <small>Dynamic masking recommended</small>
                      </div>
                      <div class="policy-dashboard-score">
                        <span>Restricted Assets</span>
                        <strong>{{ governance.classification.policyEffectiveness?.controls?.restrict_access || 0 }}</strong>
                        <small>Access controls recommended</small>
                      </div>
                    </div>
                    <div class="policy-effectiveness-body">
                      <div>
                        <div class="panel-kicker">Template Coverage</div>
                        <div class="policy-template-list">
                          <div
                            v-for="template in governance.classification.policyEffectiveness?.template_coverage || []"
                            :key="'policy-template-' + template.template_id"
                            class="policy-template-row"
                          >
                            <span>{{ template.template_id }}</span>
                            <strong>{{ template.assets }}</strong>
                          </div>
                          <div v-if="!(governance.classification.policyEffectiveness?.template_coverage || []).length" class="policy-empty-row">
                            No templates matched yet.
                          </div>
                        </div>
                      </div>
                      <div>
                        <div class="panel-kicker">Gaps To Fix</div>
                        <div class="policy-gap-list">
                          <div
                            v-for="gap in (governance.classification.policyEffectiveness?.gaps || []).slice(0, 6)"
                            :key="'policy-gap-' + gap.asset_id"
                            class="policy-gap-row"
                          >
                            <strong>{{ gap.asset_id }}</strong>
                            <span>{{ gap.issue }}</span>
                          </div>
                          <div v-if="!(governance.classification.policyEffectiveness?.gaps || []).length" class="policy-empty-row">
                            No current policy coverage gaps.
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Data Quality Rules</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="tonal" @click="startQualityRuleCreate">New Rule</v-btn>
                        <v-btn size="small" color="primary" :loading="governance.qualityRules.loading" @click="runQualityValidation">Run Validation</v-btn>
                        <v-btn size="small" variant="outlined" :loading="governance.qualityRules.loading" @click="buildQualityScorecard">Build Scorecard</v-btn>
                      </div>
                    </div>
                    <div class="quality-rules-grid">
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Rules</div>
                        <div class="quality-rule-list">
                          <button
                            v-for="rule in governance.qualityRules.rules"
                            :key="'quality-rule-' + rule.id"
                            type="button"
                            class="quality-rule-row"
                            :class="{ selected: governance.qualityRules.selectedRuleId === rule.id }"
                            @click="editQualityRule(rule)"
                          >
                            <strong>{{ rule.name }}</strong>
                            <span>{{ rule.asset_id }} · {{ rule.column_name || 'asset' }} · {{ qualityRuleTypeLabel(rule.type) }}</span>
                            <v-chip size="x-small" :class="rule.severity === 'fail' ? 'admin' : rule.severity === 'critical' ? 'poweruser' : 'analyst'" variant="flat">{{ rule.severity }}</v-chip>
                          </button>
                          <div v-if="!governance.qualityRules.rules.length" class="policy-empty-row">No quality rules defined yet.</div>
                        </div>
                      </div>
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Rule Editor</div>
                        <div class="quality-editor">
                          <v-text-field v-model="governance.qualityRules.editor.name" density="compact" variant="outlined" label="Rule name" hide-details></v-text-field>
                          <div class="quality-editor-row">
                            <v-text-field v-model="governance.qualityRules.editor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.asset_id" density="compact" variant="outlined" label="Asset ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.column_name" density="compact" variant="outlined" label="Column" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row">
                            <v-select v-model="governance.qualityRules.editor.type" density="compact" variant="outlined" label="Type" :items="['null_percent','cardinality_bounds','range','pattern','uniqueness']" hide-details></v-select>
                            <v-select v-model="governance.qualityRules.editor.severity" density="compact" variant="outlined" label="Severity" :items="['warning','critical','fail']" hide-details></v-select>
                            <v-switch v-model="governance.qualityRules.editor.enabled" density="compact" label="Enabled" hide-details color="primary"></v-switch>
                          </div>
                          <div class="quality-editor-row four">
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min" density="compact" variant="outlined" label="Min" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_max" density="compact" variant="outlined" label="Max" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min_percent" density="compact" variant="outlined" label="Min %" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.threshold_min_match_percent" density="compact" variant="outlined" label="Min match %" type="number" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row two">
                            <v-text-field v-model="governance.qualityRules.editor.schedule" density="compact" variant="outlined" label="Schedule" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.editor.alert_routes" density="compact" variant="outlined" label="Alert routes" hide-details></v-text-field>
                          </div>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" :loading="governance.qualityRules.loading" @click="saveQualityRule">Save Rule</v-btn>
                            <v-btn size="small" variant="tonal" color="error" :disabled="!governance.qualityRules.selectedRuleId" @click="deleteQualityRule()">Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="quality-rule-panel">
                        <div class="panel-kicker">Validation Runner</div>
                        <div class="quality-editor">
                          <v-text-field v-model="governance.qualityRules.runProfile.asset_id" density="compact" variant="outlined" label="Profile asset ID" hide-details></v-text-field>
                          <v-text-field v-model="governance.qualityRules.runProfile.column_name" density="compact" variant="outlined" label="Profile column" hide-details></v-text-field>
                          <div class="quality-editor-row two">
                            <v-text-field v-model="governance.qualityRules.runProfile.row_count" density="compact" variant="outlined" label="Rows" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.null_count" density="compact" variant="outlined" label="Nulls" type="number" hide-details></v-text-field>
                          </div>
                          <div class="quality-editor-row three">
                            <v-text-field v-model="governance.qualityRules.runProfile.distinct_count" density="compact" variant="outlined" label="Distinct" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.min" density="compact" variant="outlined" label="Min" type="number" hide-details></v-text-field>
                            <v-text-field v-model="governance.qualityRules.runProfile.max" density="compact" variant="outlined" label="Max" type="number" hide-details></v-text-field>
                          </div>
                          <v-text-field v-model="governance.qualityRules.runProfile.pattern_match_percent" density="compact" variant="outlined" label="Pattern match %" type="number" hide-details></v-text-field>
                        </div>
                        <div class="btn-row mt-8">
                          <v-btn size="small" variant="tonal" color="primary" @click="loadQualityTrend()">Load Trend</v-btn>
                          <v-btn size="small" variant="outlined" @click="exportQualityScorecard('json')">Export JSON</v-btn>
                          <v-btn size="small" variant="outlined" @click="exportQualityScorecard('csv')">Export CSV</v-btn>
                        </div>
                        <div class="quality-execution-summary" v-if="governance.qualityRules.executions.length">
                          <strong>{{ governance.qualityRules.executions[0].status }}</strong>
                          <span>{{ governance.qualityRules.executions[0].passed }} passed · {{ governance.qualityRules.executions[0].failed }} failed</span>
                        </div>
                        <div class="quality-scorecard-strip" v-if="governance.qualityRules.scorecard">
                          <div>
                            <span>Quality Score</span>
                            <strong>{{ governance.qualityRules.scorecard.overall_score }}</strong>
                          </div>
                          <div>
                            <span>Analytics Fitness</span>
                            <strong>{{ governance.qualityRules.scorecard.fitness?.analytics }}</strong>
                          </div>
                          <div>
                            <span>Export</span>
                            <strong>{{ governance.qualityRules.scorecardExport?.content_type || 'not generated' }}</strong>
                          </div>
                        </div>
                        <div class="quality-trend-panel" v-if="governance.qualityRules.trend">
                          <div class="quality-trend-header">
                            <strong>{{ governance.qualityRules.trend.asset_id }}</strong>
                            <span>{{ qualityTrendBars.length }} trend point(s)</span>
                          </div>
                          <div class="quality-sparkline" v-if="qualityTrendBars.length">
                            <div
                              v-for="(point, index) in qualityTrendBars"
                              :key="'quality-trend-' + index + '-' + point.label"
                              class="quality-spark-bar"
                              :title="point.metric + ' ' + point.value + ' on ' + point.label"
                            >
                              <span :style="{ height: Math.max(6, Math.min(100, point.value)) + '%' }"></span>
                              <small>{{ point.label }}</small>
                            </div>
                          </div>
                          <div v-else class="policy-empty-row">No trend history yet. Build a scorecard or run validation to create the first point.</div>
                        </div>
                        <div class="quality-incident-list">
                          <div v-for="incident in governance.qualityRules.incidents.slice(0, 5)" :key="'quality-incident-' + incident.id" class="quality-incident-row">
                            <strong>{{ incident.severity }}</strong>
                            <span>{{ incident.asset_id }} · {{ incident.column_name }}</span>
                          </div>
                          <div v-if="!governance.qualityRules.incidents.length" class="policy-empty-row">No quality incidents.</div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Classification Taxonomy</span>
                      <v-btn size="small" color="primary" :loading="governance.classification.loading" @click="runClassificationRules">Run Rules</v-btn>
                    </div>
                    <div class="classification-admin-grid">
                      <div class="classification-panel">
                        <div class="panel-kicker">Categories</div>
                        <div class="classification-panel-actions">
                          <v-btn size="x-small" variant="tonal" @click="startClassificationCategoryCreate">New</v-btn>
                        </div>
                        <div class="classification-chip-cloud">
                          <v-chip
                            v-for="category in governance.classification.taxonomy?.categories || []"
                            :key="'classification-category-' + category.id"
                            size="small"
                            variant="tonal"
                            :color="category.parent ? 'indigo' : 'primary'"
                            @click="editClassificationCategory(category)"
                          >
                            {{ category.label }}<span v-if="category.parent">&nbsp;/ {{ category.parent }}</span>
                          </v-chip>
                        </div>
                        <div class="classification-editor">
                          <v-text-field v-model="governance.classification.categoryEditor.label" density="compact" variant="outlined" label="Category label" hide-details></v-text-field>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.categoryEditor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.parent" density="compact" variant="outlined" label="Parent ID" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.level" density="compact" variant="outlined" label="Level" type="number" hide-details></v-text-field>
                          </div>
                          <v-textarea v-model="governance.classification.categoryEditor.description" density="compact" variant="outlined" label="Description" rows="2" hide-details></v-textarea>
                          <v-text-field v-model="governance.classification.categoryEditor.regulatory_frameworks" density="compact" variant="outlined" label="Regulatory frameworks" hide-details></v-text-field>
                          <v-textarea v-model="governance.classification.categoryEditor.name_patterns" density="compact" variant="outlined" label="Name patterns" rows="3" hide-details></v-textarea>
                          <div class="classification-editor-row two">
                            <v-text-field v-model="governance.classification.categoryEditor.sensitivity_triggers" density="compact" variant="outlined" label="Sensitivity triggers" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.categoryEditor.tag_triggers" density="compact" variant="outlined" label="Tag triggers" hide-details></v-text-field>
                          </div>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" @click="saveClassificationCategory">Save Category</v-btn>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="error"
                              :disabled="!(governance.classification.taxonomy?.categories || []).find((category) => category.id === governance.classification.selectedCategoryId && !category.built_in)"
                              @click="deleteClassificationCategory((governance.classification.taxonomy?.categories || []).find((category) => category.id === governance.classification.selectedCategoryId))"
                            >Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="classification-panel">
                        <div class="panel-kicker">Rules</div>
                        <div class="classification-panel-actions">
                          <v-btn size="x-small" variant="tonal" @click="startClassificationRuleCreate">New</v-btn>
                        </div>
                        <div class="classification-rule-list">
                          <div
                            v-for="rule in (governance.classification.taxonomy?.rules || [])"
                            :key="'classification-rule-' + rule.id"
                            class="classification-rule"
                            @click="editClassificationRule(rule)"
                          >
                            <strong>{{ rule.classification }}</strong>
                            <span>{{ rule.label }}</span>
                            <v-chip size="x-small" variant="flat">{{ Math.round((rule.confidence || 0) * 100) }}%</v-chip>
                          </div>
                        </div>
                        <div class="classification-editor">
                          <v-text-field v-model="governance.classification.ruleEditor.label" density="compact" variant="outlined" label="Rule name" hide-details></v-text-field>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.ruleEditor.id" density="compact" variant="outlined" label="ID" hide-details></v-text-field>
                            <v-select v-model="governance.classification.ruleEditor.target" density="compact" variant="outlined" label="Target" :items="['asset', 'column']" hide-details></v-select>
                            <v-select v-model="governance.classification.ruleEditor.classification" density="compact" variant="outlined" label="Classification" :items="(governance.classification.taxonomy?.categories || []).map((category) => category.label)" hide-details></v-select>
                          </div>
                          <v-textarea v-model="governance.classification.ruleEditor.pattern" density="compact" variant="outlined" label="Regex pattern" rows="2" hide-details></v-textarea>
                          <div class="classification-editor-row">
                            <v-text-field v-model="governance.classification.ruleEditor.confidence" density="compact" variant="outlined" label="Confidence" type="number" step="0.01" min="0" max="1" hide-details></v-text-field>
                            <v-text-field v-model="governance.classification.ruleEditor.min_column_hits" density="compact" variant="outlined" label="Min column hits" type="number" hide-details></v-text-field>
                            <v-switch v-model="governance.classification.ruleEditor.enabled" density="compact" label="Enabled" hide-details color="primary"></v-switch>
                          </div>
                          <v-textarea v-model="governance.classification.ruleEditor.description" density="compact" variant="outlined" label="Description" rows="2" hide-details></v-textarea>
                          <div class="btn-row">
                            <v-btn size="small" color="primary" @click="saveClassificationRule">Save Rule</v-btn>
                            <v-btn
                              size="small"
                              variant="tonal"
                              color="error"
                              :disabled="!governance.classification.selectedRuleId"
                              @click="deleteClassificationRule((governance.classification.taxonomy?.rules || []).find((rule) => rule.id === governance.classification.selectedRuleId))"
                            >Delete</v-btn>
                          </div>
                        </div>
                      </div>
                      <div class="classification-panel">
                        <div class="panel-kicker">Coverage</div>
                        <div class="classification-count-grid">
                          <div
                            v-for="(count, label) in governance.classification.summary?.classification_counts || {}"
                            :key="'classification-count-' + label"
                            class="classification-count"
                          >
                            <span>{{ label }}</span>
                            <strong>{{ count }}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Governance Leaderboard</span>
                    </div>
                    <div class="asset-results">
                      <div v-for="item in governance.summaries.slice(0, 20)" :key="'gov-' + item.asset_id" class="asset-card">
                        <div class="asset-body">
                          <div class="asset-name">
                            <strong>{{ item.asset_id }}</strong>
                            <v-chip size="x-small" color="info" variant="tonal">{{ item.trust_level }}</v-chip>
                            <v-chip size="x-small" color="success" variant="flat" v-if="item.certified">Certified</v-chip>
                          </div>
                          <div class="asset-meta">
                            <v-chip size="x-small" class="schema-badge" variant="tonal">{{ item.database }}</v-chip>
                            <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ item.owner || 'unassigned' }}</v-chip>
                            <v-chip size="x-small" class="type-chip" variant="outlined">{{ item.type }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Score {{ item.trust_score }}</v-chip>
                            <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(item))">Quality {{ qualityScoreForItem(item) ?? 'n/a' }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(item) }}</v-chip>
                          </div>
                        </div>
                        <div class="asset-actions">
                          <v-btn size="small" variant="outlined" @click="selectedObjectId = item.asset_id; onViewChange('browse'); $nextTick(loadObjectContext)">Open</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card>
                </v-col>
              </v-row>
            </div>


`;

export const governanceOpsPageTemplate = `
            <div v-if="activeView === 'governanceOps'" class="governance-page">
              <v-row>
                <v-col cols="12">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Governance Work Queue</span>
                        <p class="card-help">Start with steward-owned work: failed profiles, failed lineage, suspicious evidence, open tasks, and incidents. Operational detail stays available below when a steward needs it.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" :loading="governanceOps.loading" @click="loadGovernanceOps">Refresh</v-btn>
                        <v-btn size="small" color="primary" :loading="governanceOps.loading" @click="generateGovernanceTasks">Generate Tasks</v-btn>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.totalAssets || 0 }}</div>
                          <div class="label">Governed Assets</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.averageTrustScore || 0 }}</div>
                          <div class="label">Avg Trust</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.openTasks || 0 }}</div>
                          <div class="label">Open Tasks</div>
                        </v-card>
                      </v-col>
                      <v-col cols="12" sm="6" md="3">
                        <v-card class="card kpi" variant="outlined">
                          <div class="value">{{ governanceOps.overview?.kpis?.openIncidents || 0 }}</div>
                          <div class="label">Open Incidents</div>
                        </v-card>
                      </v-col>
                    </v-row>
                    <details class="governance-support-lane compact" v-if="governanceOps.storeStatus">
                      <summary>
                        <span>Operational Store Status</span>
                        <small>Persistence, event queue, comments, and trust-action counts</small>
                      </summary>
                      <div class="governance-support-body">
                        <div class="policy-dashboard-grid">
                          <div class="policy-dashboard-score">
                            <span>Durable Store</span>
                            <strong>{{ governanceOps.storeStatus.persistenceEnabled ? 'Enabled' : 'Disabled' }}</strong>
                            <small>{{ governanceOps.storeStatus.exists ? 'State file present' : 'No state file yet' }}</small>
                          </div>
                          <div class="policy-dashboard-score">
                            <span>Event Queue</span>
                            <strong>{{ governanceOps.storeStatus.counts?.eventDeliveries || 0 }}</strong>
                            <small>Email, Slack, Teams delivery records</small>
                          </div>
                          <div class="policy-dashboard-score">
                            <span>Comment Threads</span>
                            <strong>{{ governanceOps.storeStatus.counts?.commentThreads || 0 }}</strong>
                            <small>Asset collaboration threads</small>
                          </div>
                          <div class="policy-dashboard-score">
                            <span>Trust Actions</span>
                            <strong>{{ governanceOps.storeStatus.counts?.trustActionThreads || 0 }}</strong>
                            <small>Certification and endorsement histories</small>
                          </div>
                        </div>
                      </div>
                    </details>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <v-card class="card review-work-warning-card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Steward Review Work Queues</span>
                        <p class="card-help">Start with failed profiles, failed lineage, and suspicious lineage. Each item explains the issue and links to the owning workflow instead of duplicating operational controls here.</p>
                      </div>
                      <v-chip size="small" variant="tonal" color="warning">Review Work</v-chip>
                    </div>
                    <div class="review-work-queue-grid">
                      <div
                        v-for="queue in reviewWorkQueues()"
                        :key="'review-work-queue-' + queue.key"
                        class="review-work-queue-card"
                      >
                        <div>
                          <span>{{ queue.label }}</span>
                          <strong>{{ queue.items.length }}</strong>
                        </div>
                        <p>{{ queue.description }}</p>
                        <div class="review-work-item-list">
                          <button
                            v-for="item in queue.items.slice(0, 4)"
                            :key="'review-work-item-' + queue.key + '-' + item.id"
                            type="button"
                            class="review-work-item"
                            @click="openReviewWorkItem(item)"
                          >
                            <strong>{{ item.title }}</strong>
                            <span>{{ item.assetId || 'No asset selected' }}</span>
                            <span>Severity: {{ item.severity }} · Owner: {{ item.owner }} · Due: {{ item.due }}</span>
                            <span>Status: {{ item.status }} · {{ item.nextAction }}</span>
                          </button>
                          <div v-if="!queue.items.length" class="review-work-empty">{{ queue.emptyText }}</div>
                        </div>
                        <div class="btn-row">
                          <v-btn size="small" variant="outlined" @click="onViewChange(queue.primaryView)">Open Owning Workflow</v-btn>
                        </div>
                      </div>
                    </div>
                    <div class="connector-guardrail mt-8">
                      <v-icon size="small">mdi-shield-alert-outline</v-icon>
                      <span>Review Work triages and deep-links. Profiling, Search selected-asset lineage, and Lineage Acquisition remain the only places to operate those workflows.</span>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Ownership And Stewardship Detail</span>
                      <small>Coverage, portfolio alerts, and bulk assignment planning</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Ownership & Stewardship Control</span>
                        <p class="card-help">Resolve business owner, steward, domain manager, and custodian accountability, including inherited roles and escalation paths.</p>
                      </div>
                      <div class="btn-row">
                        <v-text-field v-model="governanceOps.portfolioSubject" density="compact" variant="outlined" hide-details placeholder="owner, steward, or all"></v-text-field>
                        <v-btn size="small" variant="outlined" :loading="governanceOps.loading" @click="loadStewardPortfolio">Load Portfolio</v-btn>
                      </div>
                    </div>
                    <div class="policy-dashboard-grid" style="margin-bottom:12px;">
                      <div
                        v-for="role in governanceOps.ownershipModel"
                        :key="'ownership-role-' + role.role"
                        class="policy-dashboard-score"
                      >
                        <span>{{ role.label }}</span>
                        <strong>{{ governanceOps.ownershipSummary?.coverage?.[role.role]?.pct || 0 }}%</strong>
                        <small>{{ governanceOps.ownershipSummary?.coverage?.[role.role]?.count || 0 }} assigned · {{ governanceOps.ownershipSummary?.coverage?.[role.role]?.inherited || 0 }} inherited</small>
                      </div>
                    </div>
                    <v-row>
                      <v-col cols="12" md="7">
                        <div class="table-wrap">
                          <table class="data-table">
                            <thead>
                              <tr>
                                <th>Asset</th>
                                <th>Roles</th>
                                <th>Risk</th>
                                <th>Tasks</th>
                              </tr>
                            </thead>
                            <tbody>
                              <tr v-for="asset in governanceOps.stewardPortfolio?.assets || []" :key="'portfolio-' + asset.assetId">
                                <td class="text-mono text-small">{{ asset.assetId }}</td>
                                <td>
                                  <v-chip v-for="role in asset.roles" :key="asset.assetId + role" size="x-small" variant="tonal">{{ role }}</v-chip>
                                </td>
                                <td>
                                  <v-chip size="x-small" :color="asset.qualityStatus === 'healthy' ? 'success' : 'warning'" variant="tonal">{{ asset.qualityStatus }}</v-chip>
                                </td>
                                <td>{{ asset.openTaskCount }} open · {{ asset.overdueTaskCount }} overdue</td>
                              </tr>
                              <tr v-if="!(governanceOps.stewardPortfolio?.assets || []).length">
                                <td colspan="4" class="empty">No owned or stewarded assets found for this subject.</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </v-col>
                      <v-col cols="12" md="5">
                        <div class="policy-gap-list">
                          <div
                            v-for="alert in governanceOps.stewardPortfolio?.alerts || []"
                            :key="'portfolio-alert-' + alert.assetId"
                            class="policy-gap-row"
                          >
                            <strong>{{ alert.severity }}</strong>
                            <span>{{ alert.assetId }} · {{ alert.message }}</span>
                          </div>
                          <div v-if="!(governanceOps.stewardPortfolio?.alerts || []).length" class="policy-empty-row">No ownership alerts for this portfolio.</div>
                        </div>
                      </v-col>
                    </v-row>
                    <div class="form-row mt-8">
                      <div class="col-3"><v-text-field v-model="governanceOps.bulkAssetIds" density="compact" variant="outlined" hide-details placeholder="asset ids, comma separated"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkOwner" density="compact" variant="outlined" hide-details placeholder="business owner"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkSteward" density="compact" variant="outlined" hide-details placeholder="steward"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkDomainManager" density="compact" variant="outlined" hide-details placeholder="domain manager"></v-text-field></div>
                      <div class="col-2"><v-text-field v-model="governanceOps.bulkCustodian" density="compact" variant="outlined" hide-details placeholder="custodian"></v-text-field></div>
                      <div class="col-1"><v-btn size="small" color="primary" :loading="governanceOps.loading" @click="planBulkOwnershipAssignment">Plan</v-btn></div>
                    </div>
                    <div v-if="governanceOps.bulkAssignmentPlan" class="scheduler-runtime-bar mt-8">
                      <span>{{ governanceOps.bulkAssignmentPlan.count }} asset(s)</span>
                      <span>{{ governanceOps.bulkAssignmentPlan.note }}</span>
                      <span v-if="governanceOps.bulkAssignmentPlan.task">Task {{ governanceOps.bulkAssignmentPlan.task.taskId }}</span>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12" md="7">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Task Queue Detail</span>
                      <small>Filter, add, start, and close stewardship tasks</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Stewardship Work Queue</span>
                      <div class="btn-row">
                        <v-select v-model="governanceOps.selectedTaskStatus" density="compact" variant="outlined" hide-details clearable :items="['open','in_progress','blocked','done','canceled']" placeholder="status"></v-select>
                        <v-text-field v-model="governanceOps.taskAssetId" density="compact" variant="outlined" hide-details placeholder="asset id"></v-text-field>
                        <v-text-field v-model="governanceOps.taskTitle" density="compact" variant="outlined" hide-details placeholder="task title"></v-text-field>
                        <v-btn size="small" color="primary" @click="createGovernanceOpsTask">Add</v-btn>
                      </div>
                    </div>
                    <div class="table-wrap">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Asset</th>
                            <th>Task</th>
                            <th>Priority</th>
                            <th>Status</th>
                            <th>Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr
                            v-for="task in governanceOps.tasks.filter((item) => !governanceOps.selectedTaskStatus || item.status === governanceOps.selectedTaskStatus).slice(0, 12)"
                            :key="'govops-task-' + task.taskId"
                          >
                            <td class="text-mono text-small">{{ task.assetId || '-' }}</td>
                            <td>{{ task.title }}</td>
                            <td><v-chip size="x-small" variant="tonal">{{ task.priority }}</v-chip></td>
                            <td>{{ task.status }}</td>
                            <td>
                              <v-btn v-if="task.status === 'open'" size="x-small" variant="outlined" @click="transitionGovernanceOpsTask(task, 'in_progress')">Start</v-btn>
                              <v-btn v-if="task.status !== 'done'" size="x-small" variant="outlined" @click="transitionGovernanceOpsTask(task, 'done')">Done</v-btn>
                            </td>
                          </tr>
                          <tr v-if="!governanceOps.tasks.length">
                            <td colspan="5" class="empty">No stewardship tasks yet. Generate tasks from metadata gaps to seed the queue.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12" md="5">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Incident Detail</span>
                      <small>Create, investigate, and resolve governance incidents</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Incidents</span>
                    </div>
                    <div class="form-row">
                      <div class="col-2"><v-select v-model="governanceOps.selectedIncidentStatus" density="compact" variant="outlined" hide-details clearable :items="['open','investigating','mitigated','resolved','closed']" placeholder="status"></v-select></div>
                      <div class="col-5"><v-text-field v-model="governanceOps.incidentAssetId" density="compact" variant="outlined" hide-details placeholder="asset id"></v-text-field></div>
                      <div class="col-4"><v-text-field v-model="governanceOps.incidentTitle" density="compact" variant="outlined" hide-details placeholder="incident title"></v-text-field></div>
                      <div class="col-1"><v-btn size="small" color="primary" @click="createGovernanceIncident">Create</v-btn></div>
                    </div>
                    <div class="quality-incident-list">
                      <div
                        v-for="incident in governanceOps.incidents.filter((item) => !governanceOps.selectedIncidentStatus || item.status === governanceOps.selectedIncidentStatus).slice(0, 6)"
                        :key="'govops-incident-' + incident.incidentId"
                        class="quality-incident-row"
                      >
                        <strong>{{ incident.severity }}</strong>
                        <span>{{ incident.assetId || 'unassigned' }} · {{ incident.title }} · {{ incident.status }}</span>
                        <v-btn v-if="incident.status === 'open'" size="x-small" variant="outlined" @click="transitionGovernanceIncident(incident, 'investigating')">Investigate</v-btn>
                        <v-btn v-if="incident.status !== 'resolved' && incident.status !== 'closed'" size="x-small" variant="outlined" @click="transitionGovernanceIncident(incident, 'resolved')">Resolve</v-btn>
                      </div>
                      <div v-if="!governanceOps.incidents.length" class="policy-empty-row">No governance incidents are open.</div>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12" md="4">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Publication Readiness Detail</span>
                      <small>Review and record publishing checks</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Publication Readiness</span>
                      <v-chip size="small" :color="governanceOps.publication?.ready ? 'success' : 'warning'" variant="tonal">
                        {{ governanceOps.publication?.ready ? 'Ready' : 'Needs Checks' }}
                      </v-chip>
                    </div>
                    <div class="policy-template-list">
                      <div v-for="check in governanceOps.publication?.checks || []" :key="'pub-check-' + check.name" class="policy-template-row">
                        <span>{{ check.name }}</span>
                        <div class="btn-row">
                          <strong>{{ check.status }}</strong>
                          <v-btn size="x-small" variant="outlined" @click="recordPublicationCheck(check.name, 'pass')">Pass</v-btn>
                          <v-btn size="x-small" variant="outlined" color="warning" @click="recordPublicationCheck(check.name, 'fail')">Fail</v-btn>
                        </div>
                      </div>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12" md="4">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Adoption Leaders Detail</span>
                      <small>Usage and downstream adoption context</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Adoption Leaders</span>
                    </div>
                    <div class="policy-gap-list">
                      <div v-for="asset in governanceOps.overview?.adoptionLeaders || []" :key="'adoption-' + asset.assetId" class="policy-gap-row">
                        <strong>{{ asset.assetId }}</strong>
                        <span>Score {{ asset.adoptionScore }} · usage {{ asset.usageCount }} · downstream {{ asset.downstreamCount }}</span>
                      </div>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12" md="4">
                  <details class="governance-support-lane">
                    <summary>
                      <span>AI Context Lookup</span>
                      <small>Ask a governance context question</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">AI Context Lookup</span>
                    </div>
                    <div class="btn-row">
                      <v-text-field v-model="governanceOps.contextQuery" density="compact" variant="outlined" hide-details placeholder="Ask a governance context question"></v-text-field>
                      <v-btn size="small" color="primary" @click="askGovernanceOpsContext">Ask</v-btn>
                    </div>
                    <div v-if="governanceOps.contextAnswer" class="mt-8">
                      <p class="card-help">{{ governanceOps.contextAnswer.answer }}</p>
                      <div class="policy-gap-list">
                        <div v-for="match in governanceOps.contextAnswer.matches || []" :key="'context-match-' + match.assetId" class="policy-gap-row">
                          <strong>{{ match.assetId }}</strong>
                          <span>{{ match.type }} · {{ match.owner }} · trust {{ match.trust?.score }}</span>
                        </div>
                      </div>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>

                <v-col cols="12">
                  <details class="governance-support-lane">
                    <summary>
                      <span>Event Delivery Detail</span>
                      <small>{{ governanceOps.eventDeliveries.length }} recent delivery record{{ governanceOps.eventDeliveries.length === 1 ? '' : 's' }}</small>
                    </summary>
                    <div class="governance-support-body">
                  <v-card class="card" variant="outlined">
                    <div class="section-header" style="margin-bottom:12px;">
                      <span class="section-title">Governance Event Delivery Queue</span>
                      <v-chip size="small" variant="tonal">{{ governanceOps.eventDeliveries.length }} recent</v-chip>
                    </div>
                    <div class="table-wrap">
                      <table class="data-table">
                        <thead>
                          <tr>
                            <th>Event</th>
                            <th>Actor</th>
                            <th>Status</th>
                            <th>Channels</th>
                            <th>Created</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="event in governanceOps.eventDeliveries.slice(0, 12)" :key="'govops-event-' + event.deliveryId">
                            <td>{{ event.eventType }}</td>
                            <td>{{ event.actor?.email || event.actor?.userId || 'system' }}</td>
                            <td>{{ event.status }}</td>
                            <td>{{ (event.channels || []).join(', ') }}</td>
                            <td>{{ event.createdAt }}</td>
                          </tr>
                          <tr v-if="!governanceOps.eventDeliveries.length">
                            <td colspan="5" class="empty">No governance events have been queued yet.</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </v-card>
                    </div>
                  </details>
                </v-col>
              </v-row>
            </div>


`;

export const metricIntelligencePageTemplate = `
            <div v-if="activeView === 'metrics'">
              <v-row>
                <v-col cols="12">
                  <v-card class="card metric-page-intro" variant="outlined" style="padding:16px;">
                    <div class="section-header" style="margin-bottom:12px;">
                      <div>
                        <span class="section-title">Metric Meaning</span>
                        <p class="workflow-subtitle">Find a business metric, compare known variants, then open supporting evidence only when you need to inspect how it is sourced or profiled.</p>
                      </div>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" @click="onViewChange('glossary')">Business Glossary</v-btn>
                        <v-btn size="small" color="primary" :loading="metrics.loading" @click="loadMetricRegistry">Refresh</v-btn>
                      </div>
                    </div>
                    <div class="form-row" style="grid-template-columns:1fr auto; margin-bottom:12px;">
                      <v-text-field
                        v-model="metrics.query"
                        placeholder="Search metric, table, business name, or definition"
                        density="compact"
                        variant="outlined"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        @keyup.enter="loadMetricRegistry"
                      ></v-text-field>
                      <v-btn variant="outlined" @click="loadMetricRegistry">Search</v-btn>
                    </div>
                    <div class="metric-summary-strip">
                      <div><span>Concepts</span><strong>{{ metricConceptGroups().length }}</strong></div>
                      <div><span>Variants</span><strong>{{ metrics.registry?.summary?.total_metrics || 0 }}</strong></div>
                      <div><span>Needs Review</span><strong>{{ metrics.registry?.summary?.metric_candidates || 0 }}</strong></div>
                      <div><span>Source Tables</span><strong>{{ metrics.registry?.summary?.tables_with_metrics || 0 }}</strong></div>
                    </div>
                    <workflow-confidence-note
                      label="Business meaning first"
                      tooltip="Source columns, profile runs, runtime packs, SQL, reports, and procedures are supporting evidence after a metric has been selected."
                    ></workflow-confidence-note>
                  </v-card>
                </v-col>
              </v-row>

              <v-row>
                <v-col cols="12" md="7">
                  <v-card class="card metric-concept-card" variant="outlined" style="padding:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Business Metric Concepts</span>
                      <span class="text-small">{{ metrics.registry?.pagination?.total || 0 }} result{{ (metrics.registry?.pagination?.total || 0) === 1 ? '' : 's' }}</span>
                    </div>
                    <div class="metric-concept-list">
                      <article
                        v-for="group in metricConceptGroups()"
                        :key="'metric-concept-' + group.key"
                        class="metric-concept"
                      >
                        <div class="metric-concept-header">
                          <div>
                            <div class="glossary-kicker">Metric concept</div>
                            <h3>{{ group.label }}</h3>
                            <p>{{ metricBusinessLogicSummary(group) }}</p>
                          </div>
                          <div class="metric-concept-stats">
                            <v-chip size="x-small" variant="tonal">{{ group.variants.length }} variant{{ group.variants.length === 1 ? '' : 's' }}</v-chip>
                            <v-chip v-if="group.suggestedCount" size="x-small" color="info" variant="flat">{{ group.suggestedCount }} in review</v-chip>
                          </div>
                        </div>
                        <div class="metric-variant-list">
                          <button
                            v-for="(metric, metricIndex) in group.variants"
                            :key="'metric-variant-' + metricRowKey(metric, metricIndex)"
                            type="button"
                            class="metric-variant"
                            @click="selectMetricVariant(metric, { loadTable: true })"
                          >
                            <span>
                              <strong>{{ metricVariantScope(metric) }}</strong>
                              <small>{{ metric.column_name || 'metric column' }} - {{ metricTechnicalSourceLabel(metric) }}</small>
                            </span>
                            <span class="metric-variant-actions">
                              <v-chip size="x-small" variant="flat" :color="metricStateColor(metric)">{{ metricStateLabel(metric) }}</v-chip>
                              <small>{{ metric.confidence_label || 'confidence pending' }} - {{ metric.confidence ?? '-' }}</small>
                            </span>
                          </button>
                        </div>
                      </article>
                      <div v-if="!metricConceptGroups().length" class="empty-state" style="padding:20px;">
                        <div class="empty-state-icon">&#128202;</div>
                        <h4>No metric concepts found</h4>
                        <p>Search a business name, metric column, table, or definition to load grouped variants.</p>
                      </div>
                    </div>
                  </v-card>
                </v-col>

                <v-col cols="12" md="5">
                  <v-card class="card metric-selected-meaning" variant="outlined" style="padding:12px; margin-bottom:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">Selected Metric Meaning</span>
                      <div class="btn-row">
                        <v-btn size="small" variant="outlined" @click="explainSelectedMetric">Explain</v-btn>
                        <v-btn size="small" color="primary" @click="assessSelectedMetricImpact">Impact</v-btn>
                      </div>
                    </div>
                    <div class="metric-selected-context">
                      <div>
                        <span>Business variant</span>
                        <strong>{{ metrics.selectedColumn || 'Choose a variant' }}</strong>
                      </div>
                      <div>
                        <span>Source asset</span>
                        <strong>{{ metrics.objectId || 'No source selected yet' }}</strong>
                      </div>
                    </div>
                    <v-text-field v-model="metrics.selectedColumn" placeholder="Metric column" density="compact" variant="outlined" hide-details style="margin-bottom:10px;"></v-text-field>
                    <p v-if="metrics.logicAnswer" class="lineage-answer-text">{{ metrics.logicAnswer.answer }}</p>
                    <p v-else class="lineage-answer-text">Select a variant, then explain it to load the current plain-English business logic.</p>
                    <div v-if="metrics.logicAnswer?.caveats?.length" class="lineage-caveat-list">
                      <div v-for="caveat in metrics.logicAnswer.caveats" :key="'metric-caveat-' + caveat" class="lineage-caveat-item">{{ caveat }}</div>
                    </div>
                    <div v-if="metrics.impactAnswer" class="mini-stack" style="margin-top:10px;">
                      <div class="mini-metric"><span>Risk</span><strong>{{ metrics.impactAnswer.risk?.severity }}</strong></div>
                      <div class="mini-metric"><span>Impacted Evidence</span><strong>{{ metrics.impactAnswer.risk?.impacted_count }}</strong></div>
                      <div class="mini-metric"><span>Unresolved Risks</span><strong>{{ metrics.impactAnswer.risk?.unresolved_risk_count }}</strong></div>
                    </div>
                    <div v-if="metrics.impactAnswer?.risk?.categories?.length" class="lineage-help-panel" style="margin-top:10px;">
                      <div class="lineage-help-title">Impact Categories</div>
                      <div class="lineage-help-examples">
                        <div v-for="category in metrics.impactAnswer.risk.categories" :key="'metric-impact-category-' + category.type" class="lineage-help-example">
                          <strong>{{ category.type }}</strong>
                          <span>{{ category.severity }} - {{ category.reason }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="btn-row mt-12">
                      <v-btn size="small" variant="outlined" :disabled="!metrics.objectId" @click="openMetricInCatalog({ object_id: metrics.objectId, column_name: metrics.selectedColumn })">Open Catalog</v-btn>
                      <v-btn size="small" variant="outlined" :disabled="!metrics.objectId" @click="openMetricInLineage({ object_id: metrics.objectId, column_name: metrics.selectedColumn })">Open Lineage Impact</v-btn>
                    </div>
                  </v-card>

                  <v-card class="card" variant="outlined" style="padding:12px; margin-top:12px;">
                    <div class="section-header" style="margin-bottom:8px;">
                      <span class="section-title">In-Review Engine Suggestions</span>
                      <v-chip size="x-small" color="info" variant="flat">{{ metricConceptGroups().reduce((total, group) => total + group.suggestedCount, 0) }} suggested</v-chip>
                    </div>
                    <div class="metric-review-list">
                      <button
                        v-for="metric in (metrics.registry?.metrics || []).filter(metricNeedsReview).slice(0, 6)"
                        :key="'metric-review-' + metricRowKey(metric)"
                        type="button"
                        class="metric-review-item"
                        @click="selectMetricVariant(metric, { loadTable: true })"
                      >
                        <strong>{{ metricConceptLabel(metric) }}</strong>
                        <span>{{ metricVariantScope(metric) }} - {{ metricTechnicalSourceLabel(metric) }}</span>
                      </button>
                      <div v-if="!(metrics.registry?.metrics || []).filter(metricNeedsReview).length" class="review-work-empty">
                        No engine-suggested metrics are waiting in this result set.
                      </div>
                    </div>
                  </v-card>

                  <details class="metric-support-lane" style="margin-top:12px;">
                    <summary>
                      <span>Source Column Evidence</span>
                      <small>Supporting table and column detail</small>
                    </summary>
                    <div class="metric-support-body">
                      <div class="section-header" style="margin-bottom:8px;">
                        <span class="section-title">Source Columns</span>
                        <v-btn size="small" variant="outlined" @click="loadMetricTableAnswer">Load</v-btn>
                      </div>
                      <div class="form-row" style="grid-template-columns:1fr; margin-bottom:10px;">
                        <v-text-field v-model="metrics.objectId" placeholder="table object id, e.g. Sonic_DW.dbo.FactSales" density="compact" variant="outlined" hide-details></v-text-field>
                      </div>
                      <p class="lineage-answer-text" v-if="metrics.tableAnswer">{{ metrics.tableAnswer.answer }}</p>
                      <p class="lineage-answer-text" v-else>Source columns are supporting evidence after a metric variant is selected.</p>
                      <div class="table-wrap" v-if="metrics.tableAnswer?.rows?.length" style="max-height:230px; overflow:auto;">
                        <v-table density="compact">
                          <thead><tr><th>Column</th><th>Why</th></tr></thead>
                          <tbody>
                            <tr
                              v-for="row in metrics.tableAnswer.rows"
                              :key="'metric-table-row-' + row.column"
                              style="cursor:pointer;"
                              @click="metrics.selectedColumn = row.column"
                            >
                              <td><strong>{{ row.column }}</strong><div class="text-small">{{ row.data_type }} - {{ row.state }}</div></td>
                              <td class="text-small">{{ row.why || '-' }}</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                    </div>
                  </details>

                  <details class="metric-support-lane" style="margin-top:12px;">
                    <summary>
                      <span>Profile And Runtime Evidence</span>
                      <small>Advanced checks for stewards and analysts</small>
                    </summary>
                    <div class="metric-support-body">
                      <div class="section-header" style="margin-bottom:8px;">
                        <span class="section-title">Profile Evidence</span>
                        <div class="btn-row">
                          <v-btn size="small" variant="outlined" @click="loadSelectedMetricProfile">Load Profile</v-btn>
                          <v-btn size="small" variant="outlined" @click="loadMetricRuntimePack">Runtime Pack</v-btn>
                        </div>
                      </div>
                      <div class="lineage-caveat-item" style="margin-bottom:10px;">
                        Aggregate profile runs retain no raw values. Live runs require approved read-only connector credentials; dry runs only generate the plan.
                      </div>
                      <p v-if="metrics.profileAnswer" class="lineage-answer-text">{{ metrics.profileAnswer.answer }}</p>
                      <div v-if="metrics.profileAnswer" class="mini-stack" style="margin-top:10px;">
                        <div class="mini-metric"><span>Rows</span><strong>{{ metrics.profileAnswer.profile?.summary?.row_count || 0 }}</strong></div>
                        <div class="mini-metric"><span>Null %</span><strong>{{ metrics.profileAnswer.profile?.latest?.null_percent ?? '-' }}</strong></div>
                        <div class="mini-metric"><span>Distinct</span><strong>{{ metrics.profileAnswer.profile?.latest?.distinct_count ?? '-' }}</strong></div>
                        <div class="mini-metric"><span>Raw Values</span><strong>{{ metrics.profileAnswer.profile?.raw_values_retained ? 'retained' : 'not retained' }}</strong></div>
                      </div>
                      <div v-if="metrics.profileAnswer?.caveats?.length" class="lineage-caveat-list">
                        <div v-for="caveat in metrics.profileAnswer.caveats" :key="'metric-profile-caveat-' + caveat" class="lineage-caveat-item">{{ caveat }}</div>
                      </div>
                      <div v-if="metrics.runtimePack" class="lineage-help-panel" style="margin-top:10px;">
                        <div class="lineage-help-title">Runtime Pack</div>
                        <div class="lineage-help-copy">{{ metrics.runtimePack.summary?.total_metrics || 0 }} compact metric answer cards are available for chat/runtime use.</div>
                      </div>
                    </div>
                  </details>

                  <details class="metric-support-lane" style="margin-top:12px;">
                    <summary>
                      <span>Advanced Profile Run</span>
                      <small>Plan or run a table profile when evidence is missing</small>
                    </summary>
                    <div class="metric-support-body">
                      <div class="section-header" style="margin-bottom:8px;">
                        <span class="section-title">Technical Profile Run</span>
                        <div class="btn-row">
                          <v-btn size="small" variant="outlined" :loading="metrics.profiling.loading" @click="planMetricTableProfile">Plan</v-btn>
                          <v-btn size="small" color="primary" :loading="metrics.profiling.loading" @click="runMetricTableProfile">Run</v-btn>
                        </div>
                      </div>
                      <div class="form-row" style="grid-template-columns:1fr 1fr 1fr; margin-bottom:10px;">
                        <v-select v-model="metrics.profiling.dialect" density="compact" variant="outlined" label="Dialect" :items="['sql_server','postgresql','snowflake','bigquery','databricks','redshift']" hide-details></v-select>
                        <v-select v-model="metrics.profiling.mode" density="compact" variant="outlined" label="Profile mode" :items="['metadata_only','sample','full_scan']" hide-details></v-select>
                        <v-select v-model="metrics.profiling.executionMode" density="compact" variant="outlined" label="Execution" :items="['dry_run','simulate','live']" hide-details></v-select>
                      </div>
                      <div class="form-row" style="grid-template-columns:repeat(4, 1fr); margin-bottom:10px;">
                        <v-text-field v-model="metrics.profiling.maxColumns" density="compact" variant="outlined" label="Columns" type="number" hide-details></v-text-field>
                        <v-text-field v-model="metrics.profiling.samplePercent" density="compact" variant="outlined" label="Sample %" type="number" hide-details></v-text-field>
                        <v-text-field v-model="metrics.profiling.lockTimeoutMs" density="compact" variant="outlined" label="Lock ms" type="number" hide-details></v-text-field>
                        <v-text-field v-model="metrics.profiling.queryTimeoutMs" density="compact" variant="outlined" label="Query ms" type="number" hide-details></v-text-field>
                      </div>
                      <p v-if="metrics.profiling.answer" class="lineage-answer-text">{{ metrics.profiling.answer.answer }}</p>
                      <div v-if="metrics.profiling.plan || metrics.profiling.run" class="mini-stack" style="margin-top:10px;">
                        <div class="mini-metric"><span>Plan Status</span><strong>{{ metrics.profiling.plan?.status || '-' }}</strong></div>
                        <div class="mini-metric"><span>Planned Assets</span><strong>{{ metrics.profiling.plan?.summary?.planned_assets || 0 }}</strong></div>
                        <div class="mini-metric"><span>Profiled Assets</span><strong>{{ metrics.profiling.run?.summary?.assets_profiled || 0 }}</strong></div>
                        <div class="mini-metric"><span>Raw Values</span><strong>{{ metrics.profiling.run?.summary?.raw_values_retained ? 'retained' : 'not retained' }}</strong></div>
                      </div>
                      <div v-if="metrics.profiling.run?.errors?.length" class="lineage-caveat-list" style="margin-top:10px;">
                        <div v-for="error in metrics.profiling.run.errors" :key="'profile-error-' + error.asset_id + error.message" class="lineage-caveat-item">
                          {{ error.asset_id }}: {{ error.message }}
                        </div>
                      </div>
                      <div v-if="metrics.profiling.confluence" class="lineage-help-panel" style="margin-top:10px;">
                        <div class="lineage-help-title">Confluence Summary</div>
                        <div class="lineage-help-copy">{{ confluenceSummaryPreview(metrics.profiling.confluence.content) }}</div>
                      </div>
                      <pre v-if="metrics.profiling.plan?.actions?.[0]?.query?.sql" class="profile-sql-preview">{{ metrics.profiling.plan.actions[0].query.sql }}</pre>
                    </div>
                  </details>
                </v-col>
              </v-row>
            </div>


`;
