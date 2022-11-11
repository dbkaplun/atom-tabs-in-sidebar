'use babel';

import { CompositeDisposable } from 'atom';
import { requirePackages } from 'atom-utils';

export default {
  tabBars: [],
  treeView: null,
  subscriptions: null,
  activeClass: 'vertical',

  activate(state) {
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-tabs-in-sidebar:toggle': () => { this.toggle(); }
    }));

    requirePackages('tabs', 'tree-view').then(([Tabs, TreeView]) => {
      this.Tabs = Tabs;
      this.TreeView = TreeView;
      this.treeView = TreeView.treeView;
      this.tabBars = Tabs.tabBarViews;
      this.tabBars.forEach(tabBar => {
        tabBar._atomTabsInSidebar_originalParent = tabBar.element.parentNode;
        this.moveTabBarToSidebar(tabBar);
      });
    });
  },

  deactivate() {
    for (let tabBar of this.tabBars)
      if (this.isTabBarActive(tabBar))
        this.moveTabBarBack(tabBar)

    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  toggle() {
    this.tabBars.forEach(tabBar => {
      return this.isTabBarActive(tabBar)
        ? this.moveTabBarBack(tabBar)
        : this.moveTabBarToSidebar(tabBar);
    });
  },

  isTabBarActive(tabBar) {
    return tabBar.element.classList.contains(this.activeClass);
  },

  moveTabBarToSidebar(tabBar) {
    if (!this.treeView) return;
    if (this.isTabBarActive(tabBar)) return;
    tabBar.element.classList.add(this.activeClass);
    this.treeView.element.childNodes[0].prepend(tabBar.element);
  },

  moveTabBarBack(tabBar) {
    let originalParent = tabBar._atomTabsInSidebar_originalParent;
    if (!originalParent) return;
    if (!this.isTabBarActive(tabBar)) return;
    tabBar.element.classList.remove(this.activeClass);
    this.treeView.element.childNodes[0].removeChild(tabBar.element);
    originalParent.prepend(tabBar.element);
  }
};
