import ExtensionsManager, { ExtensionConfig } from './ExtensionsManager';

import KnowledgeGraphExtension from './knowledge-graph/config.json';
import initializeKnowledgeGraph from './knowledge-graph/init';

const extensions = new ExtensionsManager();

// Add extensions here
extensions.addExtension(
  KnowledgeGraphExtension as ExtensionConfig,
  initializeKnowledgeGraph
);

export default extensions;
