'use babel';

import { CompositeDisposable } from 'atom';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bc-form-toolkit:fullCleanup': () => this.fullCleanup()
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bc-form-toolkit:formatBootstrap': () => this.formatBootstrap()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fullCleanup() {
    console.log('fullCleanup triggered!');
    this.formatBootstrap();
  },

  formatBootstrap() {
    console.log('formatBootstrap triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //remove unnecessary elements
      bcForm = bcForm.replace('<tbody>','');
      bcForm = bcForm.replace('</tbody>','');

      editor.setText(bcForm);
    }
  },

  setRequired() {
    console.log('setRequired triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //remove top "required" note
      bcForm = bcForm.replace('<span class="req">*</span>  Required','');

      editor.setText(bcForm);
    }
  }

};
