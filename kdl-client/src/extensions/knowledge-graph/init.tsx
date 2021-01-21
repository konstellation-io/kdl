import ExtensionsManager, {
  Extension,
  ExtensionConfig,
} from '../ExtensionsManager';

import React from 'react';

const Page = () => <div>Page</div>;

function initialize(extension: Extension) {
  extension.registerPage('knowledge-graph-exploration', Page);
}

export default initialize;
