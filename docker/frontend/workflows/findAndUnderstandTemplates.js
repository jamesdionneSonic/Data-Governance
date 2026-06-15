/* eslint-env browser */

export const homeFindDataPageTemplate = `
            <div v-if="activeView === 'overview'" class="home-find-data-page">
              <section class="home-focus-panel">
                <div class="home-focus-copy">
                  <div class="home-hero-kicker">Home / Find Data</div>
                  <h2>What data are you looking for?</h2>
                  <p>Search tables, columns, procedures, reports, metrics, glossary terms, and owners.</p>
                  <div class="search-bar-wrap home-primary-search">
                    <v-text-field
                      v-model="browseQuery"
                      placeholder="Search a table, metric, owner, report, business term, or question..."
                      density="comfortable"
                      variant="outlined"
                      hide-details
                      @keyup.enter="performHomeSearch"
                    ></v-text-field>
                    <v-btn color="primary" :loading="browseSearchLoading" @click="performHomeSearch">Search</v-btn>
                  </div>
                </div>
              </section>

              <section v-if="browseSearchSubmitted || browseSearchLoading || browseLoadError" class="home-search-results-panel">
                <div class="home-results-header">
                  <div>
                    <span class="section-title">Results</span>
                    <h3>{{ catalogResultSummary }}</h3>
                  </div>
                  <v-btn v-if="browseSearchSubmitted" size="small" variant="outlined" @click="clearHomeSearch">Clear</v-btn>
                </div>

                <div v-if="browseSearchWarning" class="home-search-warning">{{ browseSearchWarning }}</div>
                <div v-if="browseLoadError" class="home-search-warning is-error">Search failed: {{ browseLoadError }}</div>

                <div v-if="browseSearchLoading" class="home-search-loading">
                  <v-progress-circular indeterminate color="primary" size="22"></v-progress-circular>
                  <span>Searching catalog...</span>
                </div>

                <div v-else-if="filteredCatalogResults.length" class="home-result-list">
                  <button
                    v-for="item in filteredCatalogResults"
                    :key="'home-result-' + (item.id || item.name)"
                    type="button"
                    class="home-result-row"
                    @click="openAssetDetail(item.id || item.name)"
                  >
                    <span class="home-result-rank">{{ item.resultRank }}</span>
                    <span class="home-result-main">
                      <strong>{{ item.name || item.id }}</strong>
                      <small>{{ catalogSourceLocation(item) }}</small>
                      <em>{{ catalogMatchReason(item) }} · {{ catalogConfidenceReason(item) }}</em>
                    </span>
                    <span class="home-result-meta">
                      <span>{{ catalogAssetTypeLabel(item) }}</span>
                      <strong>{{ catalogConfidenceLabel(item) }} {{ catalogConfidenceScore(item) ?? '' }}</strong>
                    </span>
                  </button>
                </div>

                <div v-else class="home-results-empty">
                  <strong>No results found</strong>
                  <span>Try a broader table, column, report, owner, or business term.</span>
                </div>
              </section>
            </div>
`;

export const assetDetailPageTemplate = `
            <div v-if="activeView === 'assetDetail'" class="asset-detail-page">
              <div v-if="selectedObjectDetail" class="asset-detail-shell">
                <div class="asset-detail-topline">
                  <v-btn size="small" variant="text" prepend-icon="mdi-arrow-left" @click="onViewChange('overview')">Back to results</v-btn>
                  <v-btn size="small" color="primary" append-icon="mdi-graphql" @click="openSelectedObjectLineage(selectedObjectDetail.id || selectedObjectId)">Explore lineage</v-btn>
                </div>

                <section class="asset-detail-hero">
                  <div class="asset-type-icon" :class="'type-' + (selectedObjectDetail.type === 'storedProcedure' ? 'proc' : selectedObjectDetail.type === 'function' ? 'fn' : selectedObjectDetail.type || 'other')">
                    {{ selectedObjectDetail.type === 'table' ? 'T' : selectedObjectDetail.type === 'view' ? 'V' : selectedObjectDetail.type === 'storedProcedure' ? 'P' : selectedObjectDetail.type === 'function' ? 'F' : '?' }}
                  </div>
                  <div>
                    <div class="home-hero-kicker">Asset Detail</div>
                    <h2>{{ selectedObjectDetail.name || selectedObjectDetail.id || selectedObjectId }}</h2>
                    <p>{{ catalogSourceLocation(selectedObjectDetail) }}</p>
                    <div class="asset-meta mt-4">
                      <v-chip size="x-small" class="type-chip" variant="outlined">{{ catalogAssetTypeLabel(selectedObjectDetail) }}</v-chip>
                      <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(catalogConfidenceScore(selectedObjectDetail))">{{ catalogConfidenceLabel(selectedObjectDetail) }} {{ catalogConfidenceScore(selectedObjectDetail) ?? '' }}</v-chip>
                      <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ selectedObjectDetail.owner || 'unassigned' }}</v-chip>
                      <v-chip v-if="selectedObjectGovernance?.trust?.trust_level" size="x-small" class="analyst" variant="flat">{{ selectedObjectGovernance.trust.trust_level }}</v-chip>
                      <v-chip v-if="selectedObjectGovernance?.trust?.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                    </div>
                  </div>
                </section>

                <section class="asset-detail-summary">
                  <div>
                    <span class="section-title">Business Summary</span>
                    <p
                      v-for="(summaryLine, summaryIndex) in catalogBusinessSummaryLines(selectedObjectDetail)"
                      :key="'asset-detail-summary-' + summaryIndex"
                    >{{ summaryLine }}</p>
                  </div>
                  <div class="catalog-confidence-note">
                    <strong>{{ catalogConfidenceLabel(selectedObjectDetail) }}</strong>
                    <span>{{ catalogConfidenceReason(selectedObjectDetail) }}</span>
                  </div>
                </section>

                <section class="catalog-lineage-entry">
                  <div>
                    <span class="section-title">Lineage &amp; Impact</span>
                    <p>Open lineage when you need upstream sources, downstream consumers, transformation logic, or graph evidence.</p>
                  </div>
                  <div class="catalog-lineage-entry-stats">
                    <div><span>Upstream</span><strong>{{ assetLineageCount('upstream') }}</strong></div>
                    <div><span>Downstream</span><strong>{{ assetLineageCount('downstream') }}</strong></div>
                    <v-btn color="primary" size="small" append-icon="mdi-graphql" @click="openSelectedObjectLineage(selectedObjectDetail.id || selectedObjectId)">Explore lineage</v-btn>
                  </div>
                </section>

                <section v-if="assetLineageCount('upstream') || assetLineageCount('downstream')" class="asset-lineage-preview">
                  <div>
                    <span class="section-title">Top Upstream Inputs</span>
                    <div class="lineage-preview-list" v-if="assetLineageCount('upstream')">
                      <button
                        v-for="item in assetLineagePreview('upstream')"
                        :key="'asset-upstream-' + item.id"
                        type="button"
                        @click="openAssetDetail(item.id)"
                      >
                        <strong>{{ item.name || objectNameFromId(item.id) }}</strong>
                        <span>{{ catalogAssetTypeLabel(item) }} · {{ catalogSourceLocation(item) }}</span>
                      </button>
                    </div>
                    <p v-else>No upstream lineage evidence is currently linked.</p>
                  </div>
                  <div>
                    <span class="section-title">Top Downstream Uses</span>
                    <div class="lineage-preview-list" v-if="assetLineageCount('downstream')">
                      <button
                        v-for="item in assetLineagePreview('downstream')"
                        :key="'asset-downstream-' + item.id"
                        type="button"
                        @click="openAssetDetail(item.id)"
                      >
                        <strong>{{ item.name || objectNameFromId(item.id) }}</strong>
                        <span>{{ catalogAssetTypeLabel(item) }} · {{ catalogSourceLocation(item) }}</span>
                      </button>
                    </div>
                    <p v-else>No downstream lineage evidence is currently linked.</p>
                  </div>
                </section>

                <section v-if="assetDetailColumns().length" class="asset-detail-columns">
                  <div class="section-header">
                    <span class="section-title">Columns</span>
                    <v-chip size="x-small" variant="tonal">{{ assetDetailColumns().length }} columns</v-chip>
                  </div>
                  <v-table density="compact" class="dictionary-table">
                    <thead>
                      <tr>
                        <th>Column</th>
                        <th>Type</th>
                        <th>Semantic</th>
                        <th>Sensitivity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="column in assetDetailColumns()" :key="'asset-detail-column-' + column.column_id">
                        <td>{{ columnDisplayName(column) }}</td>
                        <td>{{ columnDataTypeLabel(column) }}</td>
                        <td>{{ columnSemanticLabel(column) }}</td>
                        <td>{{ column.sensitivity || '-' }}</td>
                      </tr>
                      <tr v-if="!assetDetailColumns().length">
                        <td colspan="4">No column metadata available for this asset.</td>
                      </tr>
                    </tbody>
                  </v-table>
                </section>
              </div>

              <div v-else class="asset-detail-empty">
                <v-progress-circular v-if="browseSearchLoading" indeterminate color="primary" size="22"></v-progress-circular>
                <strong>{{ selectedObjectId ? 'Loading asset detail...' : 'Choose an asset from Home search results.' }}</strong>
                <v-btn size="small" variant="outlined" @click="onViewChange('overview')">Back to Home</v-btn>
              </div>
            </div>
`;
export const catalogSearchPageTemplate = `
            <div v-if="activeView === 'browse'">
              <div class="search-hero catalog-search-panel" style="margin-bottom:14px;">
                <div class="catalog-search-mode-row">
                  <v-btn-toggle v-model="browseMode" density="comfortable" mandatory variant="outlined">
                    <v-btn value="search" prepend-icon="mdi-magnify" @click="setBrowseMode('search')">Search</v-btn>
                    <v-btn value="browse" prepend-icon="mdi-database-search" @click="setBrowseMode('browse')">Browse by Database</v-btn>
                  </v-btn-toggle>
                  <v-btn size="small" variant="outlined" :loading="browseLoading || bootstrapInProgress" @click="bootstrapData">Refresh Catalog</v-btn>
                </div>

                <div v-if="browseMode === 'search'">
                  <h2>Search</h2>
                  <p>Start with what you know: a table, column, owner, term, tag, or business concept.</p>
                  <p class="catalog-search-contract">Results show source location, type, match reason, and confidence before you open a business-first asset detail.</p>
                  <div class="search-bar-wrap catalog-search-bar">
                  <v-text-field
                    v-model="browseQuery"
                    :placeholder="catalogSearchPlaceholder"
                    variant="outlined"
                    density="comfortable"
                    hide-details
                    @keyup.enter="runSearch"
                  ></v-text-field>
                  <v-btn color="primary" :loading="browseSearchLoading" @click="runSearch">Search</v-btn>
                  </div>
                  <div v-if="visibleCatalogRecentSearches.length" class="catalog-recent-searches" aria-label="Recent searches">
                    <span>Recent searches</span>
                    <button
                      v-for="recentQuery in visibleCatalogRecentSearches"
                      :key="'catalog-recent-' + recentQuery"
                      type="button"
                      @click="applyCatalogRecentSearch(recentQuery)"
                    >{{ recentQuery }}</button>
                    <button type="button" class="catalog-recent-clear" @click="clearCatalogRecentSearches">Clear</button>
                  </div>
                </div>

                <div v-else>
                  <h2>Browse by database</h2>
                  <p>Choose a cataloged database to inspect its schemas and objects. Empty databases are hidden from this list.</p>
                  <div class="search-bar-wrap catalog-search-bar">
                    <v-select
                      :model-value="selectedBrowseDatabase"
                      :items="catalogDatabaseOptions"
                      item-title="title"
                      item-value="value"
                      placeholder="Choose a database..."
                      variant="outlined"
                      density="comfortable"
                      hide-details
                      @update:model-value="selectBrowseDatabase"
                    ></v-select>
                    <v-btn color="primary" :disabled="!selectedBrowseDatabase" @click="selectBrowseDatabase(selectedBrowseDatabase)">Open</v-btn>
                  </div>
                </div>

                <div class="catalog-helper-grid">
                  <button
                    v-for="helper in catalogHelperActions"
                    :key="'catalog-helper-' + helper.key"
                    type="button"
                    class="catalog-helper-card"
                    @click="applyCatalogHelper(helper.key)"
                  >
                    <v-icon size="18">{{ helper.icon }}</v-icon>
                    <span>
                      <strong>{{ helper.label }}</strong>
                      <small>{{ helper.description }}</small>
                    </span>
                  </button>
                </div>

                <div class="search-hint">
                  {{ catalogResultSummary }} · {{ browseCatalogStatusText }}
                </div>
                <div v-if="browseSearchWarning" class="search-hint" style="color:#fbbf24;">{{ browseSearchWarning }}</div>
                <div v-if="browseLoadError" class="search-hint" style="color:#f87171;">Catalog load issue: {{ browseLoadError }}</div>
                <div
                  v-if="hasStaleDemoCatalogState"
                  class="search-hint"
                  style="color:#fbbf24;font-weight:700;"
                >
                  Demo rows were still in this browser session. Click Load Catalog or refresh to reload the markdown catalog.
                </div>
              </div>

              <v-row>
                <v-col v-if="catalogSearchHasStarted && browseMode === 'search'" cols="12" md="3" lg="2">
                <div class="facet-rail">
                  <div class="facet-rail-title">Filters</div>

                  <div class="facet-group" v-if="browseTypeTabs.length">
                    <div class="facet-group-title">Asset Type</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="tab in browseTypeTabs"
                        :key="tab.type"
                        size="small"
                        :color="selectedFacetFilters.types.includes(tab.type) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.types.includes(tab.type) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('types', tab.type)"
                      >
                        {{ tab.label }} ({{ tab.count }})
                      </v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="browseFacetOptions.quality.some((qualityName) => (browseFacetCounts.quality[qualityName] || 0) > 0)">
                    <div class="facet-group-title">Quality</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="qualityName in browseFacetOptions.quality"
                        v-show="(browseFacetCounts.quality[qualityName] || 0) > 0"
                        :key="qualityName"
                        size="small"
                        :color="selectedFacetFilters.quality.includes(qualityName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.quality.includes(qualityName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('quality', qualityName)"
                      >{{ qualityName.charAt(0).toUpperCase() + qualityName.slice(1) }} ({{ browseFacetCounts.quality[qualityName] || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group" v-if="browseFacetOptions.databases.length">
                    <div class="facet-group-title">Database</div>
                    <div class="btn-row" style="gap:6px;flex-wrap:wrap;">
                      <v-chip
                        v-for="dbName in browseFacetOptions.databases"
                        v-show="(browseFacetCounts.databases[dbName] || 0) > 0"
                        :key="dbName"
                        size="small"
                        :color="selectedFacetFilters.databases.includes(dbName) ? 'primary' : undefined"
                        :variant="selectedFacetFilters.databases.includes(dbName) ? 'flat' : 'outlined'"
                        style="cursor:pointer;"
                        @click="toggleBrowseFacet('databases', dbName)"
                      >{{ dbName }} ({{ browseFacetCounts.databases[dbName] || 0 }})</v-chip>
                    </div>
                  </div>

                  <div class="facet-group">
                    <div class="facet-group-title">Sort Results</div>
                    <v-select
                      v-model="browseSort"
                      density="compact"
                      variant="outlined"
                      hide-details
                      :items="[
                        { title: 'Relevance', value: 'relevance' },
                        { title: 'Quality', value: 'quality' },
                        { title: 'Impact', value: 'impact' },
                        { title: 'Alphabetical', value: 'alphabetical' },
                      ]"
                    ></v-select>
                  </div>

                  <div style="margin-top:14px;">
                    <v-btn block size="small" variant="outlined" @click="clearBrowseFacets">Clear Search &amp; Filters</v-btn>
                  </div>

                  <div style="margin-top:14px;" v-if="selectedFacetFilters.types.length || selectedFacetFilters.quality.length || selectedFacetFilters.databases.length">
                    <div class="section-title" style="font-size:11px;margin-bottom:6px;">Active Filters</div>
                    <div class="mini-stack">
                      <div class="mini-metric" v-for="typeName in selectedFacetFilters.types" :key="'active-type-' + typeName">
                        <span>Type</span>
                        <strong>{{ typeName }}</strong>
                      </div>
                      <div class="mini-metric" v-for="qualityName in selectedFacetFilters.quality" :key="'active-quality-' + qualityName">
                        <span>Quality</span>
                        <strong>{{ qualityName }}</strong>
                      </div>
                      <div class="mini-metric" v-for="databaseName in selectedFacetFilters.databases" :key="'active-db-' + databaseName">
                        <span>DB</span>
                        <strong>{{ databaseName }}</strong>
                      </div>
                    </div>
                  </div>

                  <div style="margin-top:14px;">
                    <div class="section-title" style="font-size:11px;margin-bottom:6px;">Object Detail</div>
                    <div class="form-row" style="grid-template-columns:1fr auto;">
                      <v-text-field v-model="selectedObjectId" placeholder="Object ID" density="compact" variant="outlined" hide-details></v-text-field>
                      <v-btn size="small" color="primary" @click="loadObjectContext">Go</v-btn>
                    </div>
                  </div>
                </div>
                </v-col>

                <v-col cols="12" :md="catalogSearchHasStarted && browseMode === 'search' ? 9 : 12" :lg="catalogSearchHasStarted && browseMode === 'search' ? 10 : 12">
                <div>
                  <div class="section-header" style="margin-bottom:10px;">
                    <span class="section-title">
                      {{ catalogResultSummary }}
                    </span>
                    <div class="btn-row">
                      <v-btn v-if="browseSearchSubmitted" size="small" variant="outlined" append-icon="mdi-refresh" :loading="browseSearchLoading" @click="runSearch">Refresh Results</v-btn>
                      <v-btn v-if="catalogSearchHasStarted" size="small" variant="outlined" @click="clearBrowseFacets">Clear</v-btn>
                    </div>
                  </div>

                  <div v-if="browseMode === 'browse' && selectedBrowseDatabase && browseTreeRoots().length" class="schema-explorer catalog-schema-explorer" style="margin-bottom:14px;">
                    <div class="section-header" style="margin-bottom:10px;">
                      <span class="section-title">Schema Explorer</span>
                      <span class="text-small">{{ browseTreeRoots().length }} namespaces</span>
                    </div>
                    <v-expansion-panels variant="accordion" density="compact">
                      <v-expansion-panel v-for="group in browseTreeRoots()" :key="group.key">
                        <v-expansion-panel-title>
                          <div class="d-flex align-center" style="gap:10px;">
                            <v-icon start class="mr-2">mdi-folder-outline</v-icon>
                            <strong>{{ group.key }}</strong>
                            <v-chip size="x-small" variant="tonal">{{ group.children.length }}</v-chip>
                          </div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                          <div class="mini-stack">
                            <div
                              v-for="item in group.children.slice(0, 6)"
                              :key="'tree-' + item.id"
                              class="mini-metric"
                              style="cursor:pointer;"
                              @click="selectedObjectId = item.id; loadObjectContext(); openSelectedObjectLineage(item.id)"
                            >
                              <span>{{ item.name || item.id }}</span>
                              <strong>{{ item.type || 'object' }}</strong>
                            </div>
                          </div>
                        </v-expansion-panel-text>
                      </v-expansion-panel>
                    </v-expansion-panels>
                  </div>

                  <div class="asset-results" v-if="catalogSearchHasStarted && filteredCatalogResults.length > 0">
                    <div
                      v-for="item in filteredCatalogResults"
                      :key="item.id || item.name"
                      class="asset-card"
                      :class="{ selected: selectedObjectId === (item.id || item.name) }"
                      @click="selectedObjectId = item.id || item.name; loadObjectContext()"
                    >
                      <div class="asset-type-icon" :class="'type-' + (item.type === 'storedProcedure' ? 'proc' : item.type === 'function' ? 'fn' : item.type || 'other')">
                        {{ item.type === 'table' ? 'T' : item.type === 'view' ? 'V' : item.type === 'storedProcedure' ? 'P' : item.type === 'function' ? 'F' : item.type === 'trigger' ? 'TR' : '?' }}
                      </div>
                      <div class="asset-body">
                        <div class="asset-name">
                          <strong>{{ item.name || item.id }}</strong>
                          <v-chip size="x-small" class="type-chip" variant="outlined">{{ catalogAssetTypeLabel(item) }}</v-chip>
                          <v-chip size="x-small" :class="item.resultRank <= 3 ? 'poweruser' : 'viewer'" variant="flat">Match #{{ item.resultRank }}</v-chip>
                          <v-chip size="x-small" variant="tonal" color="amber" v-if="item.sensitivity === 'restricted'">Restricted</v-chip>
                          <v-chip size="x-small" variant="tonal" color="error" v-if="item.sensitivity === 'confidential'">Confidential</v-chip>
                        </div>
                        <div class="catalog-source-location">
                          <v-icon size="14">mdi-map-marker-outline</v-icon>
                          <span>{{ catalogSourceLocation(item) }}</span>
                        </div>
                        <div class="catalog-match-reason">
                          <strong>{{ catalogMatchReason(item) }}</strong>
                          <span>{{ catalogConfidenceReason(item) }}</span>
                        </div>
                        <div class="asset-description">{{ catalogBusinessSummary(item) }}</div>
                        <div class="asset-meta">
                          <v-chip size="x-small" variant="tonal" class="schema-badge">{{ item.database || item.schema || 'unknown source' }}</v-chip>
                          <v-chip size="x-small" variant="outlined" class="owner-chip">&#128100; {{ item.owner || 'unassigned' }}</v-chip>
                          <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(catalogConfidenceScore(item))">{{ catalogConfidenceLabel(item) }} {{ catalogConfidenceScore(item) ?? '' }}</v-chip>
                          <v-chip v-if="item.sensitivity" size="x-small" :class="'sens-' + item.sensitivity" variant="flat">{{ item.sensitivity }}</v-chip>
                          <v-chip v-if="item.trust_level" size="x-small" class="analyst" variant="flat">Trust: {{ item.trust_level }}</v-chip>
                          <v-chip v-if="item.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                          <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(item) }}</v-chip>
                          <v-chip
                            v-for="cls in (item.classifications || []).slice(0, 3)"
                            :key="(item.id || item.name) + '-cls-' + cls"
                            class="viewer"
                            size="x-small"
                            variant="flat"
                          >{{ cls }}</v-chip>
                        </div>
                      </div>
                      <div class="asset-actions">
                        <v-btn size="small" variant="outlined" append-icon="mdi-open-in-new" @click.stop="openSelectedObjectLineage(item.id || item.name)">Explore lineage</v-btn>
                      </div>
                    </div>
                  </div>

                  <div v-else class="card">
                    <div class="empty-state">
                      <div class="empty-state-icon">&#128269;</div>
                      <h4 v-if="!catalogSearchHasStarted">Start with search or browse</h4>
                      <h4 v-else-if="browseMode === 'browse' && !selectedBrowseDatabase">Choose a database</h4>
                      <h4 v-else>No catalog objects found</h4>
                      <p v-if="browseLoadError">The catalog API did not load: {{ browseLoadError }}</p>
                      <p v-else-if="hasStaleDemoCatalogState">This browser was holding demo results. Reload the catalog to replace them with markdown data.</p>
                      <p v-else-if="!catalogSearchHasStarted">Search for an asset, use a helper, or switch to Browse by Database to inspect cataloged databases.</p>
                      <p v-else-if="browseMode === 'browse' && !selectedBrowseDatabase">Only databases with cataloged objects appear in the dropdown above.</p>
                      <p v-else-if="browseSearchSubmitted">No markdown catalog objects matched this search. Try a broader term or clear filters.</p>
                      <p v-else>No objects matched the selected database and filters.</p>
                      <v-btn v-if="catalogSearchHasStarted" color="primary" @click="clearBrowseFacets">Clear Search &amp; Filters</v-btn>
                      <v-btn style="margin-left:8px;" variant="outlined" :loading="browseLoading || bootstrapInProgress" @click="bootstrapData">Refresh Catalog</v-btn>
                    </div>
                  </div>

                  <div class="detail-panel mt-12" v-if="selectedObjectDetail">
                    <div class="detail-header">
                      <div class="detail-header-row">
                        <div class="asset-type-icon" :class="'type-' + (selectedObjectDetail.type === 'storedProcedure' ? 'proc' : selectedObjectDetail.type === 'function' ? 'fn' : selectedObjectDetail.type || 'other')">
                          {{ selectedObjectDetail.type === 'table' ? 'T' : selectedObjectDetail.type === 'view' ? 'V' : selectedObjectDetail.type === 'storedProcedure' ? 'P' : 'F' }}
                        </div>
                        <div>
                          <div class="detail-name">{{ selectedObjectDetail.id || selectedObjectId }}</div>
                          <div class="detail-path">{{ catalogSourceLocation(selectedObjectDetail) }}</div>
                          <div class="asset-meta mt-4">
                            <v-chip size="x-small" class="type-chip" variant="outlined">{{ catalogAssetTypeLabel(selectedObjectDetail) }}</v-chip>
                            <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(catalogConfidenceScore(selectedObjectDetail))">{{ catalogConfidenceLabel(selectedObjectDetail) }} {{ catalogConfidenceScore(selectedObjectDetail) ?? '' }}</v-chip>
                            <v-chip size="x-small" class="owner-chip" variant="outlined">&#128100; {{ selectedObjectDetail.owner || 'unassigned' }}</v-chip>
                            <v-chip
                              v-if="selectedObjectDetail.lineage_status"
                              size="x-small"
                              :class="selectedObjectDetail.external_source ? 'poweruser' : 'analyst'"
                              variant="flat"
                            >{{ lineageStatusLabel(selectedObjectDetail.lineage_status) }}</v-chip>
                            <v-chip
                              v-if="selectedObjectDetail.external_source"
                              size="x-small"
                              class="viewer"
                              variant="flat"
                            >External Source</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.trust_level" size="x-small" class="analyst" variant="flat">{{ selectedObjectGovernance.trust.trust_level }}</v-chip>
                            <v-chip v-if="selectedObjectGovernance?.trust?.certified" size="x-small" class="poweruser" variant="flat">Certified</v-chip>
                            <v-chip size="x-small" variant="tonal" :color="qualityScoreColor(qualityScoreForItem(selectedObjectDetail))">Quality {{ qualityScoreForItem(selectedObjectDetail) ?? 'n/a' }}</v-chip>
                            <v-chip size="x-small" variant="outlined">Trend {{ qualityTrendLabel(selectedObjectDetail) }}</v-chip>
                          </div>
                          <div v-if="selectedObjectDetail.external_source" style="margin-top:8px;font-size:12px;color:var(--text-muted);">
                            This table is source-owned in the current corpus, so created_by is intentionally empty until a local writer is discovered.
                          </div>
                        </div>
                      </div>
                    </div>
                    <div class="detail-body">
                      <div class="tab-row">
                        <v-btn size="small" variant="flat" color="primary">Overview</v-btn>
                        <v-btn size="small" variant="outlined" append-icon="mdi-open-in-new" @click="openSelectedObjectLineage(selectedObjectDetail.id || selectedObjectId)">Explore lineage</v-btn>
                      </div>
                      <section class="catalog-business-summary-card">
                        <div>
                          <span class="section-title">Business Summary</span>
                          <p
                            v-for="(summaryLine, summaryIndex) in catalogBusinessSummaryLines(selectedObjectDetail)"
                            :key="'catalog-detail-summary-' + summaryIndex"
                          >{{ summaryLine }}</p>
                        </div>
                        <div class="catalog-confidence-note">
                          <strong>{{ catalogConfidenceLabel(selectedObjectDetail) }}</strong>
                          <span>{{ catalogConfidenceReason(selectedObjectDetail) }}</span>
                        </div>
                      </section>
                      <section class="catalog-lineage-entry">
                        <div>
                          <span class="section-title">Lineage &amp; Impact</span>
                          <p>Open the selected asset's lineage view when you need upstream sources, downstream consumers, transformation logic, or graph evidence.</p>
                        </div>
                        <div class="catalog-lineage-entry-stats">
                          <div><span>Upstream</span><strong>{{ assetLineageCount('upstream') }}</strong></div>
                          <div><span>Downstream</span><strong>{{ assetLineageCount('downstream') }}</strong></div>
                          <v-btn color="primary" size="small" append-icon="mdi-graphql" @click="openSelectedObjectLineage(selectedObjectDetail.id || selectedObjectId)">Explore lineage</v-btn>
                        </div>
                      </section>
                      <div class="asset-semantic-strip" v-if="selectedObjectGovernance?.glossary_links?.length">
                        <div>
                          <span>Business Terms</span>
                          <strong>{{ selectedObjectGovernance.glossary_links.length }} mapped</strong>
                        </div>
                        <button
                          v-for="term in selectedObjectGovernance.glossary_links"
                          :key="'asset-semantic-' + term.slug"
                          @click="onViewChange('glossary'); $nextTick(() => openGlossaryTerm(term.slug))"
                        >{{ term.term }}</button>
                      </div>
                      <div class="stat-row">
                        <div class="stat-item"><div class="stat-value">{{ assetLineageCount('upstream') || '-' }}</div><div class="stat-label">Upstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ assetLineageCount('downstream') || '-' }}</div><div class="stat-label">Downstream</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectDetail.sensitivity || '-' }}</div><div class="stat-label">Sensitivity</div></div>
                        <div class="stat-item"><div class="stat-value">{{ selectedObjectGovernance?.trust?.score || '-' }}</div><div class="stat-label">Trust Score</div></div>
                        <div class="stat-item"><div class="stat-value">{{ qualityScoreForItem(selectedObjectDetail) ?? '-' }}</div><div class="stat-label">Quality Score</div></div>
                        <div class="stat-item"><div class="stat-value">{{ qualityTrendLabel(selectedObjectDetail) }}</div><div class="stat-label">Quality Trend</div></div>
                      </div>
                      <div class="schema-column-browser mt-12" v-if="selectedObjectDictionary">
                        <div class="section-header" style="margin-bottom:10px;">
                          <span class="section-title">Columns &amp; Technical Metadata</span>
                          <div class="btn-row">
                            <v-chip size="x-small" variant="tonal">{{ assetDetailColumns().length }} columns</v-chip>
                            <v-btn
                              size="small"
                              variant="outlined"
                              append-icon="mdi-download"
                              @click="downloadObjectDictionary"
                            >Export</v-btn>
                          </div>
                        </div>
                        <v-table density="compact" class="dictionary-table">
                          <thead>
                            <tr>
                              <th>Column</th>
                              <th>Type</th>
                              <th>Semantic</th>
                              <th>Sensitivity</th>
                              <th>Description</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr v-for="column in assetDetailColumns().slice(0, 40)" :key="'dict-column-' + column.column_id">
                              <td><code>{{ columnDisplayName(column) }}</code></td>
                              <td>{{ columnDataTypeLabel(column) }}</td>
                              <td>
                                <v-chip size="x-small" variant="tonal" :color="column.is_metric ? 'primary' : 'blue-grey-lighten-4'">
                                  {{ columnSemanticLabel(column) }}
                                </v-chip>
                              </td>
                              <td>{{ column.sensitivity || '-' }}</td>
                              <td>{{ column.description || '-' }}</td>
                            </tr>
                            <tr v-if="!(selectedObjectDictionary.columns || []).length">
                              <td colspan="5" class="text-center">No column metadata captured yet.</td>
                            </tr>
                          </tbody>
                        </v-table>
                      </div>
                      <div class="grid mt-12" style="grid-template-columns:1fr 1fr;gap:12px;">
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Metadata Enrichment</h4>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.owner" placeholder="Owner" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.steward" placeholder="Steward" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.domain_manager" placeholder="Domain Manager" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.custodian" placeholder="Custodian" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.business_domain" placeholder="Business Domain" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.business_processes" placeholder="Business Processes (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.use_cases" placeholder="Use Cases (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row">
                            <v-select
                              v-model="editableObjectMetadata.sensitivity"
                              density="compact"
                              variant="outlined"
                              hide-details
                              :items="['public','internal','confidential','restricted']"
                            ></v-select>
                          </div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.tags" placeholder="Tags (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.documentation_links" placeholder="Documentation Links (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-text-field v-model="editableObjectMetadata.related_dashboards" placeholder="Related Dashboards (comma-separated)" density="compact" variant="outlined" hide-details></v-text-field></div>
                          <div class="form-row"><v-textarea v-model="editableObjectMetadata.business_justification" rows="3" variant="outlined" density="compact" hide-details placeholder="Business justification"></v-textarea></div>
                          <div class="form-row"><v-textarea v-model="editableObjectMetadata.description" rows="5" variant="outlined" density="compact" hide-details placeholder="Description"></v-textarea></div>
                          <div class="btn-row"><v-btn color="primary" @click="saveSelectedObjectMetadata">Save Markdown Metadata</v-btn></div>
                        </v-card>
                        <v-card class="card" style="box-shadow:none;" variant="outlined">
                          <h4>Governance Context</h4>
                          <div class="mini-stack">
                            <div class="mini-metric"><span>Owner</span><strong>{{ selectedObjectGovernance?.asset?.owner || '-' }}</strong></div>
                            <div class="mini-metric"><span>Steward</span><strong>{{ selectedObjectGovernance?.asset?.steward || '-' }}</strong></div>
                            <div class="mini-metric"><span>Domain Manager</span><strong>{{ selectedObjectGovernance?.asset?.domain_manager || '-' }}</strong></div>
                            <div class="mini-metric"><span>Custodian</span><strong>{{ selectedObjectGovernance?.asset?.custodian || '-' }}</strong></div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectGovernance?.classifications?.length">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Classifications</div>
                            <div class="btn-row">
                              <v-chip v-for="cls in selectedObjectGovernance.classifications" :key="'detail-cls-' + cls" class="viewer" size="x-small" variant="flat">{{ cls }}</v-chip>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectPiiPolicy">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">PII Masking Policy</div>
                            <div class="policy-summary-strip">
                              <span :class="selectedObjectPiiPolicy.summary?.requires_masking ? 'policy-risk' : 'policy-ok'">
                                {{ selectedObjectPiiPolicy.summary?.requires_masking ? 'Mask required' : 'No PII detected' }}
                              </span>
                              <strong>{{ selectedObjectPiiPolicy.summary?.pii_columns || 0 }} / {{ selectedObjectPiiPolicy.summary?.total_columns || 0 }} columns</strong>
                            </div>
                            <div class="policy-action-list" v-if="selectedObjectPiiPolicy.masking_actions?.length">
                              <div v-for="action in selectedObjectPiiPolicy.masking_actions" :key="'mask-action-' + action.column_name" class="policy-action-row">
                                <code>{{ action.column_name }}</code>
                                <span>{{ action.strategy }}</span>
                                <strong>{{ Math.round((action.confidence || 0) * 100) }}%</strong>
                              </div>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectColumnSemantics?.can_answer_metric_question">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Metric Columns</div>
                            <div class="policy-action-list">
                              <div
                                v-for="column in selectedObjectColumnSemantics.metric_columns || []"
                                :key="'metric-column-' + column.column_name"
                                class="policy-action-row"
                              >
                                <code>{{ column.column_name }}</code>
                                <span>{{ column.semantic_type }}</span>
                                <strong>{{ Math.round((column.confidence || 0) * 100) }}%</strong>
                              </div>
                              <div v-if="!(selectedObjectColumnSemantics.metric_columns || []).length" class="policy-empty-row">
                                No metric columns detected from current metadata.
                              </div>
                            </div>
                          </div>
                          <div class="mt-8" v-if="selectedObjectGovernance?.glossary_links?.length">
                            <div class="section-title" style="font-size:11px;margin-bottom:6px;">Related Glossary Terms</div>
                            <div class="btn-row">
                              <v-btn
                                v-for="term in selectedObjectGovernance.glossary_links"
                                :key="term.slug"
                                size="small"
                                variant="outlined"
                                @click="onViewChange('glossary'); $nextTick(() => openGlossaryTerm(term.slug))"
                              >{{ term.term }}</v-btn>
                            </div>
                          </div>
                        </v-card>
                      </div>
                      <div class="btn-row mt-8">
                        <v-btn size="small" variant="outlined" @click="openSelectedObjectLineage(selectedObjectDetail.id || selectedObjectId)">Explore lineage</v-btn>
                        <v-btn size="small" variant="outlined" @click="buildBlastRadiusReport(); onViewChange('reports');">Blast Radius</v-btn>
                        <v-btn size="small" color="primary" @click="syncMarketplaceFormWithSelection(); onViewChange('reports');">Request Access</v-btn>
                      </div>
                    </div>
                  </div>
                </div>
                </div>
                </v-col>
              </v-row>
            </div>

`;

export const lineageExplorerPageTemplate = `
            <div v-if="activeView === 'discovery'" class="selected-lineage-page">
              <section v-if="selectedObjectId" class="selected-lineage-brief">
                <div class="selected-lineage-topline">
                  <v-btn size="small" variant="text" prepend-icon="mdi-arrow-left" @click="onViewChange('assetDetail')">Back to asset detail</v-btn>
                  <div class="selected-lineage-actions">
                    <v-select
                      v-model="lineageAnswerIntent"
                      density="compact"
                      variant="outlined"
                      hide-details
                      style="width:170px;"
                      :items="lineageAnswerIntentOptions"
                      @update:model-value="loadLineageAnswer"
                    ></v-select>
                    <v-btn size="small" variant="outlined" :loading="lineageAnswerLoading" @click="loadLineageAnswer">Refresh answer</v-btn>
                    <a href="#lineage-graph-drilldowns" class="lineage-drilldown-link">Graph &amp; Evidence</a>
                  </div>
                </div>

                <div class="selected-lineage-hero">
                  <div>
                    <span class="section-title">Selected Asset Lineage</span>
                    <h2>{{ selectedAssetLineageTitle }}</h2>
                    <p>{{ catalogSourceLocation(selectedObjectDetail || {}) }}</p>
                  </div>
                  <v-tooltip :text="lineageExplorerConfidenceTooltip">
                    <template #activator="{ props }">
                      <v-chip v-bind="props" size="small" variant="tonal">{{ lineageExplorerConfidenceLabel }}</v-chip>
                    </template>
                  </v-tooltip>
                </div>

                <div class="selected-lineage-answer">
                  <div v-if="lineageAnswerLoading" class="selected-lineage-loading">
                    <v-progress-circular indeterminate color="primary" size="22"></v-progress-circular>
                    <span>Building the lineage answer...</span>
                  </div>
                  <template v-else>
                    <p>{{ selectedAssetLineagePlainEnglish }}</p>
                    <div v-if="lineageAnswer?.caveats?.length" class="lineage-caveat-list">
                      <div v-for="caveat in lineageAnswer.caveats" :key="'selected-lineage-caveat-' + caveat" class="lineage-caveat-item">
                        {{ caveat }}
                      </div>
                    </div>
                  </template>
                </div>

                <div class="selected-lineage-kpis">
                  <div><span>Feeds This</span><strong>{{ assetLineageCount('upstream') }}</strong></div>
                  <div><span>Uses This</span><strong>{{ assetLineageCount('downstream') }}</strong></div>
                  <div><span>Loads This</span><strong>{{ lineageExplorerImpactSummary.loadPath }}</strong></div>
                </div>

                <div class="selected-lineage-groups">
                  <section v-for="group in selectedAssetLineageGroups()" :key="'selected-lineage-group-' + group.title" class="selected-lineage-group">
                    <div class="selected-lineage-group-head">
                      <strong>{{ group.title }}</strong>
                      <span>{{ group.rows.length }} object{{ group.rows.length === 1 ? '' : 's' }}</span>
                    </div>
                    <div class="selected-lineage-group-list">
                      <button
                        v-for="row in group.rows.slice(0, 6)"
                        :key="'selected-lineage-row-' + group.title + '-' + row.id"
                        type="button"
                        @click="openAssetDetail(row.id)"
                      >
                        <strong>{{ row.label || row.name || objectNameFromId(row.id) }}</strong>
                        <span>{{ row.type || 'object' }} · {{ row.location || catalogSourceLocation(row) }}</span>
                      </button>
                    </div>
                    <p v-if="group.rows.length > 6">{{ group.rows.length - 6 }} more available in Graph &amp; Evidence.</p>
                  </section>
                </div>

                <div class="selected-lineage-secondary-actions">
                  <v-btn
                    size="small"
                    variant="outlined"
                    :loading="reports.blastRadiusLoading"
                    @click="runBlastRadiusAnalysis()"
                  >Check Impact</v-btn>
                  <v-btn size="small" variant="outlined" @click="toggleLineageEvidence">
                    {{ showLineageEvidence ? 'Hide Graph & Evidence' : 'Show Graph & Evidence' }}
                  </v-btn>
                  <v-btn size="small" color="primary" @click="openGraphFocus">Open Lineage Map</v-btn>
                </div>
                <div
                  v-if="reports.blastRadiusStatus"
                  class="lineage-action-status"
                  :class="{ active: reports.blastRadiusLoading }"
                >
                  {{ reports.blastRadiusStatus }}
                </div>
              </section>

              <section v-else class="selected-lineage-empty">
                <span class="section-title">Selected Asset Lineage</span>
                <h2>Choose an asset first</h2>
                <p>Start from Home search, select an asset, then open lineage from the Asset Detail page.</p>
                <v-btn color="primary" @click="onViewChange('overview')">Back to Home Search</v-btn>
              </section>

              <v-dialog v-model="graphFocusDialog.show" fullscreen scrollable>
                <v-card style="background:#f8fafc; min-height:100vh;">
                  <v-toolbar density="compact" color="white" flat>
                    <v-toolbar-title>Lineage Focus Mode - {{ selectedObjectId }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-chip v-if="graphHasSSISNodes" size="small" color="purple" variant="flat" style="margin-right:8px;">SSIS included</v-chip>
                    <v-chip v-else-if="graphShowHiddenHint" size="small" color="amber" variant="flat" style="margin-right:8px;">SSIS may be deeper</v-chip>
                    <v-btn size="small" variant="outlined" class="mr-2" @click="focusGraphToFit">Fit to view</v-btn>
                    <v-btn size="small" variant="outlined" class="mr-2" @click="resetGraphView">Reset</v-btn>
                    <v-btn icon="mdi-close" variant="text" @click="closeGraphFocus"></v-btn>
                  </v-toolbar>
                  <v-card-text style="padding:16px;">
                    <div class="form-row" style="grid-template-columns:1fr auto auto auto auto; margin-bottom:12px; align-items:center;">
                      <v-text-field
                        v-model="lineageObjectSearch.query"
                        placeholder="Search object"
                        density="compact"
                        variant="outlined"
                        hide-details
                        prepend-inner-icon="mdi-magnify"
                        @update:model-value="searchLineageObjects"
                        @keyup.enter="renderSelectedLineage"
                      ></v-text-field>
                      <v-text-field
                        v-model="graphSearchText"
                        placeholder="Search graph"
                        density="compact"
                        variant="outlined"
                        hide-details
                        @input="highlightGraphMatches"
                      ></v-text-field>
                      <v-select
                        v-model="discoveryFormat"
                        density="compact"
                        variant="outlined"
                        hide-details
                        style="width:130px;"
                        :items="[
                          { title: 'Flowchart', value: 'centered' },
                          { title: 'Cytoscape', value: 'cytoscape' },
                          { title: 'Mermaid', value: 'mermaid' },
                        ]"
                      ></v-select>
                      <v-text-field type="number" min="1" max="5" v-model.number="discoveryDepth" density="compact" variant="outlined" hide-details style="width:70px;"></v-text-field>
                      <v-btn color="primary" @click="renderSelectedLineage">Render Graph</v-btn>
                    </div>
                    <div v-if="graphSearchText" style="margin-bottom:10px; font-size:12px; color:#64748b;">
                      {{ graphSearchMatchCount }} match{{ graphSearchMatchCount === 1 ? '' : 'es' }} found.
                    </div>
                    <div v-if="discoveryFormat === 'centered'" class="lineage-flow-guide">
                      <span>SSIS packages / source tables</span>
                      <strong>-></strong>
                      <span>transform procedures</span>
                      <strong>-></strong>
                      <span>focus object</span>
                      <strong>-></strong>
                      <span>consumers</span>
                    </div>
                    <div v-if="discoveryFormat === 'cytoscape' || discoveryFormat === 'centered'" style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:hidden; background:#fff;">
                      <div id="cy-graph-focus" style="width:100%; height:100%;"></div>
                    </div>
                    <div v-else-if="discoveryFormat === 'mermaid'" style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:auto; background:#fff; padding:16px;" id="mermaid-graph-focus"></div>
                    <div v-else style="height:78vh; min-height:700px; border:1px solid #dbeafe; border-radius:12px; overflow:auto; background:#fff; padding:16px;">
                      <pre class="mono" style="margin:0;">{{ JSON.stringify(discoveryGraph?.data, null, 2) }}</pre>
                    </div>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-dialog v-model="edgeAuditDialog" max-width="1200">
                <v-card>
                  <v-toolbar density="compact" color="white" flat>
                    <v-toolbar-title>Edge Audit - {{ selectedObjectId }}</v-toolbar-title>
                    <v-spacer></v-spacer>
                    <v-btn icon="mdi-close" variant="text" @click="edgeAuditDialog = false"></v-btn>
                  </v-toolbar>
                  <v-card-text>
                    <div v-if="edgeAudit" style="margin-bottom:12px; display:flex; gap:12px; flex-wrap:wrap;">
                      <v-chip size="small" variant="flat">Total {{ edgeAudit.totalEdges }}</v-chip>
                      <v-chip size="small" color="green" variant="flat">Direct {{ edgeAudit.directEdges }}</v-chip>
                      <v-chip size="small" color="amber" variant="flat">Bridge {{ edgeAudit.bridgeEdges }}</v-chip>
                      <v-chip size="small" color="blue" variant="flat">Derived {{ edgeAudit.derivedEdges }}</v-chip>
                      <v-chip size="small" color="grey" variant="flat">Related {{ edgeAudit.relatedEdges }}</v-chip>
                    </div>
                    <div v-if="edgeAudit && edgeAudit.edges && edgeAudit.edges.length" class="table-wrap" style="max-height:70vh; overflow:auto;">
                      <v-table density="compact">
                        <thead>
                          <tr>
                            <th>Classification</th>
                            <th>Type</th>
                            <th>Source</th>
                            <th>Target</th>
                            <th>Source DB</th>
                            <th>Target DB</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr v-for="edge in edgeAudit.edges" :key="edge.source + '->' + edge.target + ':' + edge.type">
                            <td><v-chip size="x-small" :color="edge.classification === 'direct' ? 'green' : edge.classification === 'bridge' ? 'amber' : edge.classification === 'derived' ? 'blue' : 'grey'" variant="flat">{{ edge.classification }}</v-chip></td>
                            <td>{{ edge.type }}</td>
                            <td>{{ edge.sourceLabel }}</td>
                            <td>{{ edge.targetLabel }}</td>
                            <td>{{ edge.sourceDatabase || '-' }}</td>
                            <td>{{ edge.targetDatabase || '-' }}</td>
                          </tr>
                        </tbody>
                      </v-table>
                    </div>
                    <div v-else class="empty-state" style="padding:20px;">
                      <div class="empty-state-icon">&#128202;</div>
                      <h4>No audit data yet</h4>
                      <p>Click Edge Audit after loading a graph.</p>
                    </div>
                  </v-card-text>
                </v-card>
              </v-dialog>

              <v-row v-if="selectedObjectId && showLineageEvidence">
              <v-col cols="12" md="8" lg="8">
              <v-card id="lineage-graph-drilldowns" class="card lineage-drilldown-card" style="padding:12px;" variant="outlined">
                <div class="section-header" style="margin-bottom:8px;">
                  <div>
                    <span class="section-title">Graph &amp; Evidence</span>
                    <h3>Lineage map - {{ selectedAssetLineageTitle }}</h3>
                  </div>
                  <div class="btn-row">
                    <v-btn size="small" variant="outlined" @click="renderSelectedLineage">Refresh map</v-btn>
                    <v-btn
                      size="small"
                      variant="outlined"
                      :loading="reports.blastRadiusLoading"
                      @click="runBlastRadiusAnalysis()"
                    >Check impact</v-btn>
                    <v-btn size="small" variant="outlined" @click="loadEdgeAudit">Review evidence</v-btn>
                    <v-btn size="small" variant="outlined" @click="openGraphFocus">Open map fullscreen</v-btn>
                  </div>
                </div>
                <div class="form-row" style="grid-template-columns:180px 90px 1fr; margin-bottom:10px; align-items:center;">
                  <v-select
                    v-model="discoveryFormat"
                    density="compact"
                    variant="outlined"
                    hide-details
                    :items="[
                      { title: 'Flowchart', value: 'centered' },
                      { title: 'Cytoscape', value: 'cytoscape' },
                      { title: 'Mermaid', value: 'mermaid' },
                    ]"
                  ></v-select>
                  <v-text-field type="number" min="1" max="5" v-model.number="discoveryDepth" density="compact" variant="outlined" hide-details title="Depth"></v-text-field>
                  <div class="graph-legend">
                    <span class="legend-item"><span class="legend-dot" style="background:#2563eb;border-radius:2px;"></span>Table</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#7c3aed;border-radius:2px;"></span>View</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#ea580c;border-radius:2px;"></span>Procedure</span>
                    <span class="legend-item"><span class="legend-dot" style="background:#5b21b6;border-radius:6px;"></span>SSIS Package</span>
                    <span class="legend-item" style="margin-left:auto;font-size:10px;color:var(--text-faint);">Graph detail stays secondary to the plain-English answer.</span>
                  </div>
                </div>
                <div style="display:flex; justify-content:flex-end; gap:8px; margin:8px 0 10px;">
                  <v-btn size="small" variant="outlined" @click="focusGraphToFit">Fit</v-btn>
                  <v-btn size="small" variant="outlined" @click="openDiscoveryInNewTab">Open tab</v-btn>
                  <v-btn size="small" variant="outlined" @click="showOnlySsisPackages" v-if="graphHasSSISNodes">SSIS only</v-btn>
                  <v-btn size="small" variant="outlined" @click="showAllGraphNodes" v-if="graphHasSSISNodes && graphShowOnlySSIS">Show all</v-btn>
                </div>
                <div v-if="graphHasSSISNodes" style="margin-bottom:8px; font-size:12px; color:#475569;">
                  SSIS package nodes are available in this graph. Use <strong>SSIS only</strong> to isolate them, double-click a package to drill into it, or <strong>Open fullscreen</strong> for a larger workspace.
                </div>
                <div v-if="graphShowHiddenHint" style="margin-top:8px; padding:10px 12px; border:1px solid #fde68a; border-radius:8px; background:#fffbeb; color:#92400e; font-size:12px;">
                  SSIS packages are often beyond the current depth. Try <strong>Open Fullscreen</strong>, increase depth, or use <strong>Fit</strong> after rendering.
                </div>
                <div v-if="discoveryFormat === 'centered'" class="lineage-flow-guide">
                  <span>SSIS packages / source tables</span>
                  <strong>-></strong>
                  <span>transform procedures</span>
                  <strong>-></strong>
                  <span>focus object</span>
                  <strong>-></strong>
                  <span>consumers</span>
                </div>
                <div class="graph-box" v-if="discoveryFormat === 'cytoscape' || discoveryFormat === 'centered'"><div id="cy-graph"></div></div>
                <div class="graph-box" v-else-if="discoveryFormat === 'mermaid'" id="mermaid-graph"></div>
                <div class="graph-box" v-else style="padding:12px;"><pre class="mono" style="overflow:auto;margin:0;">{{ JSON.stringify(discoveryGraph?.data, null, 2) }}</pre></div>
              </v-card>

              <v-card class="card lineage-compact-matrix" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Dependency Matrix &amp; Tier Distribution</span>
                  <div class="btn-row">
                    <v-text-field v-model="matrixDatabase" placeholder="Database" density="compact" variant="outlined" hide-details style="width:140px;"></v-text-field>
                    <v-btn size="small" variant="outlined" @click="loadDiscovery">Reload</v-btn>
                  </div>
                </div>
                <div class="table-wrap lineage-compact-matrix-table" v-if="reports.blastHeatmap && reports.blastHeatmap.length">
                  <v-table density="compact">
                    <thead><tr><th>Tier</th><th>Object Type</th><th>Count</th></tr></thead>
                    <tbody>
                      <tr v-for="cell in reports.blastHeatmap" :key="'heat-' + cell.tier + '-' + cell.type">
                        <td><v-chip size="x-small" :class="cell.tier === 'T1' ? 'admin' : cell.tier === 'T2' ? 'poweruser' : 'analyst'" variant="flat">{{ cell.tier }}</v-chip></td>
                        <td>{{ cell.type }}</td>
                        <td><strong>{{ cell.count }}</strong></td>
                      </tr>
                    </tbody>
                  </v-table>
                </div>
                <div v-else class="empty-state lineage-compact-empty">
                  <div class="empty-state-icon">&#128202;</div>
                  <h4>No heat map data yet</h4>
                  <p>Run a blast radius analysis to see tier and type distribution.</p>
                </div>
              </v-card>
              </v-col>

              <v-col cols="12" md="4" lg="4">
              <v-card ref="impactSummaryCard" class="card" style="padding:12px;" variant="outlined">
                <h3>Blast Radius Detail</h3>
                <div
                  v-if="reports.blastRadiusStatus"
                  class="lineage-action-status"
                  :class="{ active: reports.blastRadiusLoading }"
                >
                  {{ reports.blastRadiusStatus }}
                </div>
                <div class="mini-stack" style="margin-bottom:10px;">
                  <div class="mini-metric"><span>Focus Object</span><strong style="font-family:monospace;font-size:11px;">{{ selectedObjectId }}</strong></div>
                  <div class="mini-metric"><span>Top Reach Score</span><strong>{{ reports.blastRows?.[0]?.reachScore || 0 }}</strong></div>
                  <div class="mini-metric"><span>Highest Tier</span><strong>{{ reports.blastRows?.[0]?.tier || '-' }}</strong></div>
                </div>

                <div class="ranked-list">
                  <div
                    v-for="(item, idx) in (reports.blastRows || []).slice(0, 10)"
                    :key="'disc-impact-' + item.id"
                    class="ranked-item"
                    style="cursor:pointer;"
                    @click="selectedObjectId = item.id; loadDiscovery()"
                  >
                    <span class="ranked-num">#{{ idx + 1 }}</span>
                    <span class="ranked-name">{{ item.id }}</span>
                    <span class="ranked-type">{{ item.tier }}</span>
                    <span class="ranked-score">{{ item.reachScore }}</span>
                  </div>
                  <div v-if="!reports.blastRows || reports.blastRows.length === 0" class="empty-state" style="padding:20px;">
                    <div class="empty-state-icon">&#x26A1;</div>
                    <h4>No impact data</h4>
                    <p>Render a graph first, then click Blast Radius.</p>
                  </div>
                </div>
              </v-card>
              </v-col>
              </v-row>

            </div>


`;
