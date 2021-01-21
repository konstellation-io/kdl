import DefaultIcon from '@material-ui/icons/Extension';
import { NavigationData } from 'Pages/Server/pages/Server/pages/Project/components/ProjectNavigation/ProjectNavigation';
import { OverridableComponent } from '@material-ui/core/OverridableComponent';
import ROUTE from 'Constants/routes';
import React from 'react';
import { SvgIconTypeMap } from '@material-ui/core';
import { join } from 'path';

type ExtensionConfigNavigation = {
  name?: string;
  title?: string;
  icon?: string;
  to: string;
};
type ExtensionConfigPanel = {
  id: string;
  level: 1 | 2;
};
type ExtensionConfigPage = {
  id: string;
  route: string;
};

export type ExtensionConfig = {
  id: string;
  name: string;
  icon?: string;
  navigation?: ExtensionConfigNavigation;
  panels?: ExtensionConfigPanel[];
  pages?: ExtensionConfigPage[];
};

function getIconComponent(iconSrc: string) {
  const IconComponent = ({ className }: { className?: string }) => (
    <img src={iconSrc} className={className} alt="Navigation Icon" />
  );

  return IconComponent as OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
}

class ExtensionsManager {
  extensions: Extension[];

  constructor() {
    this.extensions = [];
  }

  addExtension(
    extensionConfig: ExtensionConfig,
    init: (extension: Extension) => void
  ) {
    const extension = new Extension(extensionConfig);
    init(extension);

    this.extensions.push(extension);
  }

  getExtension(extensionId: string) {
    const extension = this.extensions.find((ext) => ext.id === extensionId);

    if (!extension) {
      throw Error(`Cannot find extension with id ${extensionId}`);
    }

    return extension;
  }

  getNavigationElements() {
    return this.extensions
      .filter((ext) => ext.navigation)
      .map((ext) => ext.navigation) as ExtensionNavigation[];
  }

  getPages() {
    return this.extensions
      .filter((ext) => ext.pages)
      .map((ext) => ext.pages)
      .flat();
  }
}

type ExtensionNavigation = {
  route: string;
  label: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
};
type ExtensionPanel = {};
type ExtensionPage = {
  id: string;
  route: string;
  // FIXME: any
  Component: any;
};

export class Extension {
  config: ExtensionConfig;
  id: string;
  name: string;
  Icon: OverridableComponent<SvgIconTypeMap<{}, 'svg'>>;
  navigation?: ExtensionNavigation;
  panels: ExtensionPanel[];
  pages: ExtensionPage[];

  constructor(config: ExtensionConfig) {
    this.config = config;
    this.id = config.id;
    this.name = config.name;
    this.Icon = this.buildIcon(config.icon);
    this.navigation = this.buildNavigation(config.navigation);
    this.pages = [];
    this.panels = [];
  }

  buildIcon(icon?: string) {
    if (!icon) return DefaultIcon;

    const iconPath = join(this.id, icon);
    return getIconComponent(require(`./${iconPath}`));
  }

  buildNavigation(
    navConfig?: ExtensionConfigNavigation
  ): ExtensionNavigation | undefined {
    if (!navConfig) return;

    const label = navConfig.name || this.name;
    const Icon = navConfig.icon ? this.buildIcon(navConfig.icon) : this.Icon;

    return {
      route: `${ROUTE.PROJECT}${navConfig.to}`,
      label,
      Icon,
    };
  }

  // FIXME: any
  registerPage(pageId: string, Component: any) {
    const pageConfig = this.config.pages?.find((page) => page.id === pageId);

    if (!pageConfig)
      throw Error(
        `Page with id ${pageId} is not configured inside config.json file`
      );

    this.pages.push({
      id: pageId,
      route: `${ROUTE.PROJECT}${pageConfig.route}`,
      Component,
    });
  }

  registerPanel(panelId: string, Component: JSX.Element) {
    const panelConfig = this.config.panels?.find(
      (panel) => panel.id === panelId
    );

    if (!panelConfig)
      throw Error(
        `Panel with id ${panelId} is not configured inside config.json file`
      );

    this.panels.push({
      id: panelId,
      level: panelConfig.level,
      Component,
    });
  }
}

export default ExtensionsManager;
