'use babel';

import {
	CompositeDisposable
}
from 'atom';
import $ from 'jquery';
import {
	html as beautify
}
from 'js-beautify';

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

	tidyMarkup(markup) {
		markup = beautify(markup, {
			'indent_size': atom.config.get('editor.tabLength')
		});

		return markup;
	},

	fullCleanup() {
		let editor;
		if (editor = atom.workspace.getActiveTextEditor()) {
			let editorContents = editor.getText();
			let editorSelected = editor.getSelectedText();
			let bcForm, bcFormOriginal;

			if (editorSelected.length > 0) { //if anything is selected, use that
				bcForm = editorSelected;
			}
			else {
				bcForm = editorContents;
			}

			bcFormOriginal = bcForm; //for a search and replace later;
			bcForm = $('<div/>').addClass('bc-form').append(bcForm); //have to make this to do jQuery operations on

			this.removeTableStructure(bcForm);
			this.removeTitleField(bcForm);
			this.removeBreaks(bcForm);
			this.modernizeInputs(bcForm);
			this.labelRequired(bcForm);
			this.addPlaceholderAttributes(bcForm);
			this.modernizeCaptchas(bcForm);
			this.hideSecurityModules(bcForm);
			this.formatBootstrap(bcForm);

			bcForm = $(bcForm).html();
			editorContents = editorContents.replace(bcFormOriginal,bcForm);
			editorContents = this.tidyMarkup(editorContents);

			editor.setText(editorContents);
		}
	},

	removeTableStructure(bcForm) {
		$(bcForm).find('table.webform').contents().unwrap();
		$(bcForm).find('thead').contents().unwrap();
		$(bcForm).find('tbody').contents().unwrap();
		$(bcForm).find('tfoot').contents().unwrap();
		$(bcForm).find('tr').contents().unwrap();

		$(bcForm).find('td').each(function() {
			$(this).wrapInner('<fieldset/>');

			$(this).find('fieldset').contents().filter(function() { return this.nodeType === 3 && $.trim(this.nodeValue) !== ''; }).wrap('<span/>'); //wraps loose text in a <span> for easier traversal

			$(this).find('fieldset').unwrap();
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
		//create form-groups using fieldsets
		$(bcForm).find('fieldset').each(function(){
			$(this).addClass('form-group');

			//adds .form-group-<name> to fieldset for easier browsing in the inspector
			var name = $(this).find('[name]:first').attr('name');
			if (name != undefined) {
				$(this).addClass('form-group-'+name);
			}
			if ($(this).is(':contains("captcha")')) {
				$(this).addClass('form-group-captcha');
			}
		});

		//convert stock BC classes over to bootstrap
		$(bcForm).find('.cat_textbox').addClass('form-control').removeClass('cat_textbox');
		$(bcForm).find('.cat_dropdown').addClass('form-control').removeClass('cat_dropdown');
		$(bcForm).find('.cat_dropdown_smaller').addClass('form-control').removeClass('cat_dropdown_smaller');
		$(bcForm).find('.cat_listbox').addClass('form-control').removeClass('cat_listbox');
		$(bcForm).find('.cat_button').addClass('btn btn-default').removeClass('cat_button');

		//wrap radio and checkbox inputs in required bootstrap div/class
		$(bcForm).find('input[type="radio"]').wrap('<div class="radio" />').wrap('<label />');
		$(bcForm).find('input[type="checkbox"]').wrap('<div class="checkbox" />').wrap('<label />');
		$(bcForm).find('div.radio + span, div.checkbox + span').each(function(){
			var label = $(this).text();
			$(this).prev().find('label').append(label);
			$(this).remove();
		});

		//figure out if there are more required or optional fields, and add labels to the minority
		if (($(bcForm).find('fieldset.required').length) > ($(bcForm).find('fieldset.optional').length)) {
			$(bcForm).find('fieldset.optional label').append('<small class="label label-default">Optional</small>');
		}
		else {
			$(bcForm).find('fieldset.required label').append('<small class="label label-default">Required</small>');
		}

		return bcForm;
	},

	labelRequired(bcForm) {
		//remove top "required" text
		$(bcForm).find('form').contents().filter(function() {
			return this.nodeType === 3;
		}).remove();

		//add "required" and "optional" classes
		$(bcForm).find('span.req').parents('fieldset').addClass('required');
		$(bcForm).find('fieldset:not(".required")').addClass('optional');

		//remove BC's default asterisk label
		$(bcForm).find('span.req').remove();

		return bcForm;
	},

	modernizeInputs(bcForm) {
		//email address fields
		$(bcForm).find('input[name="EmailAddress"]').attr('type', 'email');

		//phone number fields
		$(bcForm).find('input[name="PhoneNumber"]').attr('type', 'tel');
		$(bcForm).find('input[name="HomePhone"]').attr('type', 'tel');
		$(bcForm).find('input[name="WorkPhone"]').attr('type', 'tel');
		$(bcForm).find('input[name="CellPhone"]').attr('type', 'tel');
		$(bcForm).find('input[name="HomeFax"]').attr('type', 'tel');
		$(bcForm).find('input[name="WorkFax"]').attr('type', 'tel');

		//number fields
		$(bcForm).find('input[name="HomeZip"]').attr('type', 'number');
		$(bcForm).find('input[name="WorkZip"]').attr('type', 'number');
		$(bcForm).find('input[name="BillingZip"]').attr('type', 'number');
		$(bcForm).find('input[name="ShippingZip"]').attr('type', 'number');
		$(bcForm).find('input[name="CardNumber"]').attr('type', 'number');
		$(bcForm).find('input[name="CardCCV"]').attr('type', 'number');
		$(bcForm).find('input[name="Amount"]').attr('type', 'number');

		//to do: convert inputs to buttons
		//$(bcForm).find('input[name="submit"]').after('<button type="submit" />');
		//console.log($(bcForm).find('<button type="submit" />'));

		return bcForm;
	},

	addPlaceholderAttributes(bcForm) {
		//email address fields
		$(bcForm).find('input[type="email"]').attr('placeholder', 'janedoe@gmail.com');

		//phone number fields
		$(bcForm).find('input[type="tel"]').attr('placeholder', '(234) 555-6789');

		//payment fields
		$(bcForm).find('input[name="CardNumber"]').attr('placeholder', '•••• •••• •••• ••••');
		$(bcForm).find('input[name="CardCCV"]').attr('placeholder', '•••');

		return bcForm;
	},

	modernizeCaptchas(bcForm) {
		$(bcForm).find('fieldset:contains("module_recaptcha") span, fieldset:contains("module_captcha") span').contents().filter(function() { return this.nodeType == 3 }).each(function(){
			this.textContent = '{% if globals.visitor.deviceClass == "phone" -%} {module_recaptcha version="2" size="compact"} {% else -%} {module_recaptcha version="2"} {% endif -%}';
		});

		return bcForm;
	},

	hideSecurityModules(bcForm) {
		$(bcForm).find('fieldset:contains("module_ccsecurity")').addClass('hidden');

		return bcForm;
	}

};
