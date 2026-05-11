/**
 * Markdown Generator for SQL Server Metadata
 * Converts extracted metadata into governance-ready markdown files
 */

class MarkdownGenerator {
  constructor(metadata) {
    this.metadata = metadata;
  }

  /**
   * Generate markdown for a single table
   */
  generateTableMarkdown(table) {
    const extractionWarnings = this.metadata.extractionWarnings || [];

    const relationships = this.metadata.relationships
      .filter((r) => (r.fromTable === table.id || r.toTable === table.id) && r.confidence >= 0.5)
      .sort((a, b) => b.confidence - a.confidence);

    const dependsOn = relationships.filter((r) => r.toTable === table.id).map((r) => r.fromTable);

    const frontmatter = {
      name: table.name,
      database: this.metadata.database,
      type: table.type,
      schema: table.schema,
      owner: 'Data Team', // TODO: Extract from extended properties
      sensitivity: 'internal', // TODO: Infer from data classification
      tags: MarkdownGenerator.inferTags(table),
      depends_on: dependsOn,
      row_count: table.rowCount,
      size_kb: table.sizeKb,
      column_count: table.columns?.length || 0,
      index_count: table.indexes?.length || 0,
      check_constraint_count: table.checkConstraints?.length || 0,
      extraction_warnings: extractionWarnings.map((warning) => warning.code),
      extracted_at: this.metadata.extractedAt,
    };

    // Group relationships by confidence
    const highConfidence = relationships.filter((r) => r.confidence >= 0.8);
    const mediumConfidence = relationships.filter((r) => r.confidence >= 0.6 && r.confidence < 0.8);
    const lowConfidence = relationships.filter((r) => r.confidence < 0.6);

    let markdown = '---\n';
    const yamlLines = [];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yamlLines.push(`${key}: []`);
        } else {
          yamlLines.push(`${key}:`);
          value.forEach((v) => {
            yamlLines.push(`  - ${v}`);
          });
        }
      } else if (typeof value === 'string') {
        yamlLines.push(`${key}: ${value}`);
      } else if (typeof value === 'number') {
        yamlLines.push(`${key}: ${value}`);
      }
    }
    markdown += `${yamlLines.join('\n')}\n`;
    markdown += '---\n\n';

    // Table description
    markdown += '## Overview\n\n';
    markdown += table.description
      ? `${table.description}\n\n`
      : 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += `- **Type**: ${table.type}\n`;
    markdown += `- **Schema**: ${table.schema}\n`;
    markdown += `- **Row Count**: ${table.rowCount.toLocaleString()}\n`;
    markdown += `- **Size**: ${table.sizeKb.toLocaleString()} KB\n\n`;

    // Columns section
    if (table.columns && table.columns.length > 0) {
      markdown += '## Columns\n\n';
      markdown += '| Name | Type | Nullable | Identity | Default | Description |\n';
      markdown += '|------|------|----------|----------|---------|-------------|\n';
      table.columns.forEach((col) => {
        const nullable = col.isNullable ? '✓' : '';
        const identity = col.isIdentity ? '✓' : '';
        const defaultValue = col.defaultValue || '';
        const desc = col.description || '';
        markdown += `| \`${col.name}\` | ${col.dataType} | ${nullable} | ${identity} | ${defaultValue} | ${desc} |\n`;
      });
      markdown += '\n';
    }

    if (
      table.primaryKey ||
      (table.uniqueConstraints && table.uniqueConstraints.length > 0) ||
      (table.checkConstraints && table.checkConstraints.length > 0)
    ) {
      markdown += '## Constraints\n\n';
      if (table.primaryKey && table.primaryKey.columns?.length > 0) {
        markdown += `- **Primary Key**: ${table.primaryKey.name}\n`;
        markdown += `  - Columns: ${table.primaryKey.columns.map((c) => c.name).join(', ')}\n`;
      }

      if (table.uniqueConstraints && table.uniqueConstraints.length > 0) {
        table.uniqueConstraints.forEach((constraint) => {
          markdown += `- **Unique**: ${constraint.name}\n`;
          markdown += `  - Columns: ${constraint.columns.map((c) => c.name).join(', ')}\n`;
        });
      }

      if (table.checkConstraints && table.checkConstraints.length > 0) {
        table.checkConstraints.forEach((constraint) => {
          markdown += `- **Check**: ${constraint.name}\n`;
          markdown += `  - Definition: ${constraint.definition}\n`;
        });
      }

      markdown += '\n';
    }

    if (table.indexes && table.indexes.length > 0) {
      markdown += '## Indexes\n\n';
      table.indexes.forEach((index) => {
        markdown += `- **${index.name}** (${index.type})\n`;
        markdown += `  - Unique: ${index.isUnique ? 'Yes' : 'No'}\n`;
        markdown += `  - Primary Key: ${index.isPrimaryKey ? 'Yes' : 'No'}\n`;
        if (index.keyColumns && index.keyColumns.length > 0) {
          const keyCols = index.keyColumns.map((c) => `${c.name} ${c.sort}`).join(', ');
          markdown += `  - Key Columns: ${keyCols}\n`;
        }
        if (index.includedColumns && index.includedColumns.length > 0) {
          markdown += `  - Included Columns: ${index.includedColumns.join(', ')}\n`;
        }
        if (index.hasFilter && index.filterDefinition) {
          markdown += `  - Filter: ${index.filterDefinition}\n`;
        }
      });
      markdown += '\n';
    }
    if (extractionWarnings.length > 0) {
      markdown += '## Extraction Notes\n\n';
      extractionWarnings.forEach((warning) => {
        markdown += `- **${warning.code}**: ${warning.message}\n`;
      });
      markdown += '\n';
    }

    // Relationships
    if (relationships.length > 0) {
      markdown += '## Relationships\n\n';

      if (highConfidence.length > 0) {
        markdown += '### High Confidence (≥ 0.8)\n\n';
        for (const rel of highConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }

      if (mediumConfidence.length > 0) {
        markdown += '### Medium Confidence (0.6-0.8)\n\n';
        for (const rel of mediumConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }

      if (lowConfidence.length > 0) {
        markdown += '### Low Confidence (< 0.6) - Review Required\n\n';
        for (const rel of lowConfidence) {
          markdown += MarkdownGenerator.generateRelationshipMarkdown(rel);
        }
        markdown += '\n';
      }
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;
    markdown += '- **Data Classification**: To be assigned\n';
    markdown += '- **Stewardship**: To be assigned\n';
    markdown += '- **Compliance**: Review for GDPR/HIPAA applicability\n';
    if (extractionWarnings.length > 0) {
      markdown += '- **Extractor Warnings**: Present (see Extraction Notes)\n';
    }

    return markdown;
  }

  /**
   * Generate relationship markdown
   */
  static generateRelationshipMarkdown(rel) {
    let md = `- **${rel.type}**: ${rel.fromTable} → ${rel.toTable}\n`;
    md += `  - Confidence: ${(rel.confidence * 100).toFixed(0)}%\n`;
    md += `  - Evidence: ${rel.evidence}\n`;
    if (rel.fromColumn) {
      md += `  - Column: \`${rel.fromColumn}\` → \`${rel.toColumn}\`\n`;
    }
    return md;
  }

  /**
   * Infer tags from table characteristics
   */
  static inferTags(table) {
    const tags = [];

    const nameLower = table.name.toLowerCase();

    if (nameLower.startsWith('fact_')) tags.push('fact-table');
    if (nameLower.startsWith('dim_')) tags.push('dimension');
    if (nameLower.startsWith('stg_')) tags.push('staging');
    if (nameLower.startsWith('tmp_')) tags.push('temporary');
    if (table.type === 'view') tags.push('view');
    if (table.rowCount > 1000000) tags.push('large-table');
    if (table.schema === 'dbo') tags.push('core-schema');

    return tags.length > 0 ? tags : ['auto-extracted'];
  }

  /**
   * Generate markdown for a view
   */
  generateViewMarkdown(view) {
    const frontmatter = {
      name: view.name,
      database: this.metadata.database,
      type: 'view', // parser-accepted type
      schema: view.schema,
      owner: 'Data Team',
      sensitivity: 'internal',
      tags: ['view', 'auto-extracted'],
      dependency_count: view.dependencies?.length || 0,
      column_count: view.columns?.length || 0,
      extracted_at: this.metadata.extractedAt,
    };

    let markdown = '---\n';
    const yamlLines = [];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yamlLines.push(`${key}: []`);
        } else {
          yamlLines.push(`${key}:`);
          value.forEach((v) => {
            yamlLines.push(`  - ${v}`);
          });
        }
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    }
    markdown += `${yamlLines.join('\n')}\n`;
    markdown += '---\n\n';

    markdown += '## Overview\n\n';
    markdown += view.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: View\n';
    markdown += `- **Schema**: ${view.schema}\n\n`;

    // Dependencies section
    if (view.dependencies && view.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This view depends on:\n\n';
      view.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (view.columns && view.columns.length > 0) {
      markdown += '## Columns\n\n';
      markdown += '| Name | Type | Nullable | Description |\n';
      markdown += '|------|------|----------|-------------|\n';
      view.columns.forEach((col) => {
        markdown += `| \`${col.name}\` | ${col.dataType} | ${col.isNullable ? '✓' : ''} | ${col.description || ''} |\n`;
      });
      markdown += '\n';
    }
    if (view.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += view.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;
    markdown += '- **Data Classification**: To be assigned\n';
    markdown += '- **Stewardship**: To be assigned\n';

    return markdown;
  }

  /**
   * Generate markdown for a stored procedure
   */
  generateStoredProcedureMarkdown(proc) {
    const frontmatter = {
      name: proc.name,
      database: this.metadata.database,
      type: 'procedure', // parser-accepted type (not 'stored_procedure')
      schema: proc.schema,
      owner: 'Data Team',
      tags: ['procedure', 'auto-extracted'],
      dependency_count: proc.dependencies?.length || 0,
      parameter_count: proc.parameters?.length || 0,
      extracted_at: this.metadata.extractedAt,
    };

    let markdown = '---\n';
    const yamlLines = [];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yamlLines.push(`${key}: []`);
        } else {
          yamlLines.push(`${key}:`);
          value.forEach((v) => {
            yamlLines.push(`  - ${v}`);
          });
        }
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    }
    markdown += `${yamlLines.join('\n')}\n`;
    markdown += '---\n\n';

    markdown += '## Overview\n\n';
    markdown += proc.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: Stored Procedure\n';
    markdown += `- **Schema**: ${proc.schema}\n\n`;

    // Dependencies section
    if (proc.dependencies && proc.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This procedure depends on:\n\n';
      proc.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (proc.parameters && proc.parameters.length > 0) {
      markdown += '## Parameters\n\n';
      markdown += '| Name | Type | Output | Default |\n';
      markdown += '|------|------|--------|---------|\n';
      proc.parameters.forEach((param) => {
        markdown += `| \`${param.name}\` | ${param.dataType} | ${param.isOutput ? 'Yes' : 'No'} | ${param.hasDefaultValue ? 'Yes' : 'No'} |\n`;
      });
      markdown += '\n';
    }
    if (proc.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += proc.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate markdown for a function
   */
  generateFunctionMarkdown(func) {
    const frontmatter = {
      name: func.name,
      database: this.metadata.database,
      type: 'function', // parser-accepted type (not 'user_function' or 'table_function')
      schema: func.schema,
      owner: 'Data Team',
      tags: ['function', 'auto-extracted'],
      dependency_count: func.dependencies?.length || 0,
      parameter_count: func.parameters?.length || 0,
      extracted_at: this.metadata.extractedAt,
    };

    let markdown = '---\n';
    const yamlLines = [];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yamlLines.push(`${key}: []`);
        } else {
          yamlLines.push(`${key}:`);
          value.forEach((v) => {
            yamlLines.push(`  - ${v}`);
          });
        }
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    }
    markdown += `${yamlLines.join('\n')}\n`;
    markdown += '---\n\n';

    markdown += '## Overview\n\n';
    markdown += func.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += `- **Type**: ${func.type}\n`;
    markdown += `- **Schema**: ${func.schema}\n\n`;

    // Dependencies section
    if (func.dependencies && func.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This function depends on:\n\n';
      func.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (func.parameters && func.parameters.length > 0) {
      markdown += '## Parameters\n\n';
      markdown += '| Name | Type | Output | Default |\n';
      markdown += '|------|------|--------|---------|\n';
      func.parameters.forEach((param) => {
        markdown += `| \`${param.name}\` | ${param.dataType} | ${param.isOutput ? 'Yes' : 'No'} | ${param.hasDefaultValue ? 'Yes' : 'No'} |\n`;
      });
      markdown += '\n';
    }
    if (func.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += func.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate markdown for a trigger
   */
  generateTriggerMarkdown(trigger) {
    const frontmatter = {
      name: trigger.name,
      database: this.metadata.database,
      type: 'procedure', // Store triggers as 'procedure' type for now (parser doesn't have 'trigger' type)
      schema: trigger.schema,
      owner: 'Data Team',
      parent_object: trigger.parentObject,
      tags: ['trigger', 'auto-extracted'],
      dependency_count: trigger.dependencies?.length || 0,
      extracted_at: this.metadata.extractedAt,
    };

    let markdown = '---\n';
    const yamlLines = [];
    for (const [key, value] of Object.entries(frontmatter)) {
      if (Array.isArray(value)) {
        if (value.length === 0) {
          yamlLines.push(`${key}: []`);
        } else {
          yamlLines.push(`${key}:`);
          value.forEach((v) => {
            yamlLines.push(`  - ${v}`);
          });
        }
      } else {
        yamlLines.push(`${key}: ${value}`);
      }
    }
    markdown += `${yamlLines.join('\n')}\n`;
    markdown += '---\n\n';

    markdown += '## Overview\n\n';
    markdown += trigger.description || 'Metadata auto-extracted from SQL Server.\n\n';
    markdown += '- **Type**: Trigger\n';
    markdown += `- **Schema**: ${trigger.schema}\n`;
    markdown += `- **Parent Object**: ${trigger.parentObject}\n\n`;

    // Dependencies section
    if (trigger.dependencies && trigger.dependencies.length > 0) {
      markdown += '## Dependencies\n\n';
      markdown += 'This trigger depends on:\n\n';
      trigger.dependencies.forEach((dep) => {
        markdown += `- **${dep.referencedSchema}.${dep.referencedObject}** (${dep.referencedType})\n`;
      });
      markdown += '\n';
    }

    if (trigger.definition) {
      markdown += '## Definition\n\n';
      markdown += '```sql\n';
      markdown += trigger.definition;
      markdown += '\n```\n\n';
    }

    markdown += '## Governance\n\n';
    markdown += `- **Last Extracted**: ${this.metadata.extractedAt}\n`;

    return markdown;
  }

  /**
   * Generate all markdowns (tables + views + procs + functions + triggers)
   */
  generateAllMarkdowns() {
    const markdowns = [];

    // Generate markdown for each table
    if (this.metadata.tables) {
      this.metadata.tables.forEach((table) => {
        markdowns.push({
          fileName: `${table.schema}__${table.name}.md`,
          directory: `databases/${this.metadata.database}/tables`,
          content: this.generateTableMarkdown(table),
        });
      });
    }

    // Generate markdown for each view
    if (this.metadata.views) {
      this.metadata.views.forEach((view) => {
        markdowns.push({
          fileName: `${view.schema}__${view.name}.md`,
          directory: `databases/${this.metadata.database}/views`,
          content: this.generateViewMarkdown(view),
        });
      });
    }

    // Generate markdown for each stored procedure
    if (this.metadata.storedProcedures) {
      this.metadata.storedProcedures.forEach((proc) => {
        markdowns.push({
          fileName: `${proc.schema}__${proc.name}.md`,
          directory: `databases/${this.metadata.database}/stored_procedures`,
          content: this.generateStoredProcedureMarkdown(proc),
        });
      });
    }

    // Generate markdown for each function
    if (this.metadata.functions) {
      this.metadata.functions.forEach((func) => {
        markdowns.push({
          fileName: `${func.schema}__${func.name}.md`,
          directory: `databases/${this.metadata.database}/functions`,
          content: this.generateFunctionMarkdown(func),
        });
      });
    }

    // Generate markdown for each trigger
    if (this.metadata.triggers) {
      this.metadata.triggers.forEach((trigger) => {
        markdowns.push({
          fileName: `${trigger.schema}__${trigger.name}.md`,
          directory: `databases/${this.metadata.database}/triggers`,
          content: this.generateTriggerMarkdown(trigger),
        });
      });
    }

    return markdowns;
  }
}

export default MarkdownGenerator;
