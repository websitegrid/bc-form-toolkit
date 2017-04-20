'use babel';

import { CompositeDisposable } from 'atom';
import $ from 'jquery';

export default {

  subscriptions: null,

  activate() {
    this.subscriptions = new CompositeDisposable();

    // Register command that toggles this view
    this.subscriptions.add(atom.commands.add('atom-workspace', {
      'bc-form-toolkit:fullCleanup': () => this.fullCleanup()
    }));
  },

  deactivate() {
    this.subscriptions.dispose();
  },

  fullCleanup() {
    let editor;
    if (editor = atom.workspace.getActiveTextEditor()) {
      let bcForm = $('<div/>').addClass('bc-form').append(editor.getText());

      this.removeTableStructure(bcForm);
      this.removeTitleField(bcForm);
      this.removeBreaks(bcForm);
      this.formatBootstrap(bcForm);
      this.labelRequired(bcForm);
      this.modernizeTypeAttributes(bcForm);
      this.addPlaceholderAttributes(bcForm);
      //this.modernizeCaptchas(bcForm);

      editor.setText(bcForm.unwrap().prop('outerHTML'));
    }
  },

  removeTableStructure(bcForm) {
    $(bcForm).find('table.webform').contents().unwrap();
    $(bcForm).find('thead').contents().unwrap();
    $(bcForm).find('tbody').contents().unwrap();
    $(bcForm).find('tfoot').contents().unwrap();
    $(bcForm).find('tr').contents().unwrap();

    $(bcForm).find('td').each(function(){
      $(this).wrap('<fieldset/>');
      $(this).children().filter(':first').unwrap();
    });

    return bcForm;
  },

  removeTitleField(bcForm) {
    $(bcForm).find('label[for="Title"]').parent().remove();

    return bcForm;
  },

  removeBreaks(bcForm) {
    $(bcForm).find('br').remove();

    return bcForm;
  },

  formatBootstrap(bcForm) {

    //convert default BC classes to bootstrap classes
    $(bcForm).find('fieldset').addClass('form-group');
    $(bcForm).find('.cat_textbox').addClass('form-control').removeClass('cat_textbox');
    $(bcForm).find('.cat_dropdown').addClass('form-control').removeClass('cat_dropdown');
    $(bcForm).find('.cat_dropdown_smaller').addClass('form-control').removeClass('cat_dropdown_smaller');
    $(bcForm).find('.cat_listbox').addClass('form-control').removeClass('cat_listbox');
    $(bcForm).find('.cat_button').addClass('btn btn-default').removeClass('cat_button');

    return bcForm;
  },

  labelRequired(bcForm) {
    //remove top "required" text
    $(bcForm).find('form').contents().filter(function() { return this.nodeType === 3; }).remove();

    //reformat "required" labels
    $(bcForm).find('span.req').parents('fieldset').addClass('required');
    $(bcForm).find('fieldset.required label').append('<small>Required</small>');
    $(bcForm).find('span.req').remove();

    return bcForm;
  },

  modernizeTypeAttributes(bcForm) {
    //email address fields
    $(bcForm).find('input[name="EmailAddress"]').attr('type','email');

    //phone number fields
    $(bcForm).find('input[name="PhoneNumber"]').attr('type','tel');
    $(bcForm).find('input[name="HomePhone"]').attr('type','tel');
    $(bcForm).find('input[name="WorkPhone"]').attr('type','tel');
    $(bcForm).find('input[name="CellPhone"]').attr('type','tel');
    $(bcForm).find('input[name="HomeFax"]').attr('type','tel');
    $(bcForm).find('input[name="WorkFax"]').attr('type','tel');

    //number fields
    $(bcForm).find('input[name="HomeZip"]').attr('type','number');
    $(bcForm).find('input[name="WorkZip"]').attr('type','number');
    $(bcForm).find('input[name="BillingZip"]').attr('type','number');
    $(bcForm).find('input[name="ShippingZip"]').attr('type','number');
    $(bcForm).find('input[name="CardNumber"]').attr('type','number');
    $(bcForm).find('input[name="CardCCV"]').attr('type','number');
    $(bcForm).find('input[name="Amount"]').attr('type','number');

    return bcForm;
  },

  addPlaceholderAttributes(bcForm) {
    //email address fields
    $(bcForm).find('input[type="email"]').attr('placeholder','janedoe@gmail.com');

    //phone number fields
    $(bcForm).find('input[type="tel"]').attr('placeholder','(234) 555-6789');

    return bcForm;
  },

  modernizeCaptchas(bcForm) {
    //remove top "required" note
    bcForm = bcForm.replace('{module_captcha}', '{module_recaptcha version="2" size="compact"}');
    bcForm = bcForm.replace('{module_captchav2}', '{module_recaptcha version="2" size="compact"}');
    bcForm = bcForm.replace('{module_recaptcha}', '{module_recaptcha version="2" size="compact"}');
    bcForm = bcForm.replace('{module_recaptcha version="2"}', '{module_recaptcha version="2" size="compact"}');

    return bcForm;
  }

};
