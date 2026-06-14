/* eslint-env browser */

export const helpCenterPageTemplate = `
            <div v-if="activeView === 'docs'">
              <v-row>
              <v-col cols="12" md="3" lg="2">
              <v-card class="card" variant="outlined">
                <div class="section-header">
                  <span class="section-title">Documentation Library</span>
                  <v-btn size="small" variant="outlined" @click="loadDocsLibrary">Refresh</v-btn>
                </div>
                <div class="mini-stack" v-if="docsLibrary.length">
                  <v-btn
                    v-for="doc in docsLibrary"
                    :key="'doc-nav-' + doc.key"
                    class="doc-nav-btn"
                    :variant="selectedDocKey === doc.key ? 'flat' : 'tonal'"
                    :color="selectedDocKey === doc.key ? 'primary' : undefined"
                    style="justify-content:flex-start;"
                    @click="openDocByKey(doc.key)"
                  >
                    <v-icon start class="mr-2">mdi-help-circle</v-icon>
                    <span>{{ doc.title }}</span>
                  </v-btn>
                </div>
                <div v-else-if="docsLoading" class="empty">Loading documentation...</div>
                <div v-else class="empty">No documentation entries available.</div>
              </v-card>
              </v-col>

              <v-col cols="12" md="9" lg="10">
              <v-card class="card" variant="outlined">
                <div class="section-header" style="margin-bottom:12px;">
                  <span class="section-title">{{ selectedDocTitle }}</span>
                </div>
                <div v-if="selectedDoc" class="doc-content" v-html="renderDocHtml(selectedDoc.content)"></div>
                <div v-else class="empty">Select a guide from the left rail.</div>
              </v-card>
              </v-col>
              </v-row>
            </div>
`;
