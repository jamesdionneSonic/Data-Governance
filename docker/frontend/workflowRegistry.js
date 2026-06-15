/* eslint-env browser */

import { connectAndOperateMeta, connectAndOperateSection } from './workflows/connectAndOperate.js';
import { findAndUnderstandMeta, findAndUnderstandSection } from './workflows/findAndUnderstand.js';
import { governAndImproveMeta, governAndImproveSection } from './workflows/governAndImprove.js';
import { packageAndReportMeta, packageAndReportSection } from './workflows/packageAndReport.js';
import { supportMeta, supportSection } from './workflows/support.js';

export const navSections = [
  findAndUnderstandSection,
  governAndImproveSection,
  connectAndOperateSection,
  supportSection,
];

export const internalSections = [packageAndReportSection];

export const navItems = [...navSections, ...internalSections].flatMap((section) => section.items);

export const pageWorkflowMeta = {
  ...findAndUnderstandMeta,
  ...governAndImproveMeta,
  ...packageAndReportMeta,
  ...connectAndOperateMeta,
  ...supportMeta,
};

export const workflowModuleNames = [
  'findAndUnderstand',
  'governAndImprove',
  'connectAndOperate',
  'support',
];
