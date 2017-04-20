'use babel';

import BcFormToolkit from '../lib/bc-form-toolkit';

// Use the command `window:run-package-specs` (cmd-alt-ctrl-p) to run specs.
//
// To run a specific `it` or `describe` block add an `f` to the front (e.g. `fit`
// or `fdescribe`). Remove the `f` to unfocus the block.

describe('BcFormToolkit', () => {
  let workspaceElement, activationPromise;

  beforeEach(() => {
    workspaceElement = atom.views.getView(atom.workspace);
    activationPromise = atom.packages.activatePackage('bc-form-toolkit');
  });

  describe('when the bc-form-toolkit:fullcleanup event is triggered', () => {
  });
});
