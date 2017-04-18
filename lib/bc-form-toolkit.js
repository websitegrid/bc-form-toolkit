'use babel';

import BcFormToolkitView from './bc-form-toolkit-view';
import { CompositeDisposable } from 'atom';

export default {

  bcFormToolkitView: null,
  modalPanel: null,
  subscriptions: null,

  activate(state) {
    this.bcFormToolkitView = new BcFormToolkitView(state.bcFormToolkitViewState);
    this.modalPanel = atom.workspace.addModalPanel({
      item: this.bcFormToolkitView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bc-form-toolkit:toggle': () => this.toggle()
    }));
  },

  deactivate() {
    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.bcFormToolkitView.destroy();
  },

  serialize() {
    return {
      bcFormToolkitViewState: this.bcFormToolkitView.serialize()
    };
  },

  toggle() {
    console.log('BcFormToolkit was toggled!');
    return (
      this.modalPanel.isVisible() ?
      this.modalPanel.hide() :
      this.modalPanel.show()
    );
  }

};
