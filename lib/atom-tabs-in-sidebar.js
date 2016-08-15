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
        tabBar._atomTabsInSidebar_originalParent = tabBar.parentNode;
        this.moveTabBarToSidebar(tabBar);
      });
    });
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  serialize() {
    return {};
  },

  toggle() {
    console.log('AtomTabsInSidebar was toggled!');
    this.tabBars.forEach(tabBar => {
      return this.isTabBarActive(tabBar)
        ? this.moveTabBarBack(tabBar)
        : this.moveTabBarToSidebar(tabBar);
    });
  },

  isTabBarActive(tabBar) {
    return tabBar.classList.contains(this.activeClass);
  },

  moveTabBarToSidebar(tabBar) {
    if (!this.treeView) return;
    if (this.isTabBarActive(tabBar)) return;
    tabBar.classList.add(this.activeClass);
    this.treeView.scroller.prepend(tabBar);
  },

  moveTabBarBack(tabBar) {
    let originalParent = tabBar._atomTabsInSidebar_originalParent;
    if (!originalParent) return;
    if (!this.isTabBarActive(tabBar)) return;
    tabBar.classList.remove(this.activeClass);
    originalParent.insertBefore(tabBar, originalParent.firstChild);
  }
};
