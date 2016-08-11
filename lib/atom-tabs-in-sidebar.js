'use babel';

import AtomTabsInSidebarView from './atom-tabs-in-sidebar-view';
import { CompositeDisposable } from 'atom';

export default {

  atomTabsInSidebarView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.atomTabsInSidebarView = new AtomTabsInSidebarView(state.atomTabsInSidebarViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.atomTabsInSidebarView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'atom-tabs-in-sidebar:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.atomTabsInSidebarView.destroy();
  },

  serialize() {
    return {
      atomTabsInSidebarViewState: this.atomTabsInSidebarView.serialize()
    };
  },

  toggle() {
    console.log('AtomTabsInSidebar was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
