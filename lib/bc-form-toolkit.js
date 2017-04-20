'use babel';

import {
  CompositeDisposable
}
from 'atom';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bc-form-toolkit:Full Cleanup': () => this.fullCleanup()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fullCleanup() {
    console.log('fullCleanup triggered!');
    this.removeUnnecessaryElements();
    this.formatBootstrap();
    this.labelRequired();
    //this.modernizeCaptchas();
    //this.modernizeTypeAttributes();
    //this.addPlaceholderAttributes();
  },

  removeUnnecessaryElements() {
    console.log('removeUnnecessaryElements triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //remove table structure
      bcForm = bcForm.replace('<table class="webform" cellspacing="0" cellpadding="2" border="0">', '').replace(
        '</table>', '');
      bcForm = bcForm.replace(/<tbody>/g, '').replace(/<\/tbody>/g, '');
      bcForm = bcForm.replace(/<tr>/g, '').replace(/<\/tr>/g, '');

      //remove title field
      bcForm = bcForm.replace(
        '<td><label for="Title">Title</label><br /><select name="Title" id="Title" class="cat_dropdown_smaller"><option value="1601030">DR</option><option value="1601029">MISS</option><option value="1601026" selected="selected">MR</option><option value="1601027">MRS</option><option value="1601028">MS</option></select></td>',
        '');

      //remove breaks
      bcForm = bcForm.replace(/<br>/g, '').replace(/<br\/>/g, '').replace(/<br \/>/g, '').replace(/<br\/ >/g, '');

      editor.setText(bcForm);
    }
  },

  formatBootstrap() {
    console.log('formatBootstrap triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //convert <td> to .form-group divs
      bcForm = bcForm.replace(/<td>/g, '<div class="form-group">').replace(/<\/td>/g, '</div>');

      //convert default BC classes to bootstrap classes
      bcForm = bcForm.replace(/class="cat_textbox"/g, 'class="form-control"');
      bcForm = bcForm.replace(/class="cat_dropdown"/g, 'class="form-control"');
      bcForm = bcForm.replace(/class="cat_dropdown_smaller"/g, 'class="form-control"');
      bcForm = bcForm.replace(/class="cat_listbox"/g, 'class="form-control"');
      bcForm = bcForm.replace(/class="cat_button"/g, 'class="btn btn-default"');

      editor.setText(bcForm);
    }
  },

  labelRequired() {
    console.log('labelRequired triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //remove top "required" note
      bcForm = bcForm.replace('<span class="req">*</span> Required', '');
      bcForm = bcForm.replace('<span class="req">*</span>  Required', '');

      //reformat required labels
      bcForm = bcForm.replace(/<span class="req">*<\/span><\/label>/g, '<small>Required</small></label>');

      editor.setText(bcForm);
    }
  },

  modernizeTypeAttributes() {
    console.log('modernizeTypeAttributes triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //email address fields
      bcForm = bcForm.replace('type="text" name="EmailAddress"', 'type="email" name="EmailAddress"');

      //phone number fields
      bcForm = bcForm.replace('type="text" name="PhoneNumber"', 'type="tel" name="PhoneNumber"');
      bcForm = bcForm.replace('type="text" name="HomePhone"', 'type="tel" name="HomePhone"');
      bcForm = bcForm.replace('type="text" name="WorkPhone"', 'type="tel" name="WorkPhone"');
      bcForm = bcForm.replace('type="text" name="HomeFax"', 'type="tel" name="HomeFax"');
      bcForm = bcForm.replace('type="text" name="WorkFax"', 'type="tel" name="WorkFax"');
      bcForm = bcForm.replace('type="text" name="CellPhone"', 'type="tel" name="CellPhone"');

      //number fields
      bcForm = bcForm.replace('type="text" name="HomeZip"', 'type="number" name="HomeZip"');
      bcForm = bcForm.replace('type="text" name="WorkZip"', 'type="number" name="WorkZip"');
      bcForm = bcForm.replace('type="text" name="BillingZip"', 'type="number" name="BillingZip"');
      bcForm = bcForm.replace('type="text" name="ShippingZip"', 'type="number" name="ShippingZip"');
      bcForm = bcForm.replace('type="text" name="CardNumber"', 'type="number" name="CardNumber"');
      bcForm = bcForm.replace('type="text" name="CardCCV"', 'type="number" name="CardCCV"');
      bcForm = bcForm.replace('type="text" name="Amount"', 'type="number" name="Amount"');

      editor.setText(bcForm);
    }
  },

  addPlaceholderAttributes() {
    console.log('addPlaceholderAttributes triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //email address fields
      bcForm = bcForm.replace('type="email"', 'type="email" placeholder="janedoe@gmail.com"');

      //phone number fields
      bcForm = bcForm.replace('type="tel"', 'type="tel" placeholder="(234) 555-6789"');

      editor.setText(bcForm);
    }
  },

  modernizeCaptchas() {
    console.log('modernizeCaptchas triggered!');
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = editor.getText();

      //remove top "required" note
      bcForm = bcForm.replace('{module_captcha}', '{module_recaptcha version="2" size="compact"}');
      bcForm = bcForm.replace('{module_captchav2}', '{module_recaptcha version="2" size="compact"}');
      bcForm = bcForm.replace('{module_recaptcha}', '{module_recaptcha version="2" size="compact"}');
      bcForm = bcForm.replace('{module_recaptcha version="2"}', '{module_recaptcha version="2" size="compact"}');

      editor.setText(bcForm);
    }
  }

};
