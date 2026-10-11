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

// ---------- Add to cart ----------
document.querySelectorAll('.add-to-cart').forEach(function (control) {
  control.addEventListener('click', function () {
    var message = document.getElementById('cart-message');
    if (message) {
      message.textContent = control.textContent.replace('Add ', '').replace(' to cart', '') + ' added to your cart.';
    }
  });
});

// ---------- Forms ----------
document.querySelectorAll('form').forEach(function (form) {
  form.addEventListener('submit', function (event) {
    event.preventDefault();

    var firstInvalid = null;

    form.querySelectorAll('[required]').forEach(function (field) {
      var error = document.getElementById(field.id + '-error');
      var isEmpty = field.value.trim() === '';

      // Show or hide the error message
      error.hidden = !isEmpty;

      // BROKEN: fields marked data-broken never get aria-invalid
      if (!field.hasAttribute('data-broken')) {
        if (isEmpty) {
          field.setAttribute('aria-invalid', 'true');
        } else {
          field.removeAttribute('aria-invalid');
        }
      }

      if (isEmpty && !firstInvalid) {
        firstInvalid = field;
      }
    });

    // Move focus to the first field with an error
    if (firstInvalid) {
      firstInvalid.focus();
    }
  });
});
