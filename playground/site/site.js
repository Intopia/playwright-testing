// Shared script for every page of the pretend website

// ---------- Disclosures ----------
document.querySelectorAll('button[aria-controls]').forEach(function (button) {
  var panel = document.getElementById(button.getAttribute('aria-controls'));

  button.addEventListener('click', function () {
    var isOpen = !panel.hidden;

    // Show or hide the content
    panel.hidden = isOpen;

    // BROKEN: any disclosure marked data-broken skips this step
    if (!button.hasAttribute('data-broken')) {
      button.setAttribute('aria-expanded', String(!isOpen));
    }
  });
});

// ---------- Dialogs ----------
// Open the matching dialog when a trigger button is activated
document.querySelectorAll('[data-opens]').forEach(function (trigger) {
  trigger.addEventListener('click', function () {
    document.getElementById(trigger.dataset.opens).showModal();
  });
});

// Close a dialog from any of its buttons
document.querySelectorAll('[data-close]').forEach(function (button) {
  button.addEventListener('click', function () {
    button.closest('dialog').close();
  });
});

// BROKEN: any dialog marked data-broken drops focus when it closes
document.querySelectorAll('dialog[data-broken]').forEach(function (dialog) {
  dialog.addEventListener('close', function () {
    document.activeElement.blur();
  });
});
