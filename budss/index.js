const popupLinks = document.querySelectorAll('.popup-link');
const body = document.querySelector('body');

let unlocked = true;

if (popupLinks.length > 0) {
  popupLinks.forEach((linkElement) => {
    linkElement.addEventListener('click', (event) => {
      const popupId = linkElement.getAttribute('href').replace('#', '');
      const currentPopup = document.getElementById(popupId);
      openPopup(currentPopup);
      event.preventDefault();
    });
  });
}

const popupCloseButtons = document.querySelectorAll('.close-popup');
popupCloseButtons.forEach((button) => {
  button.addEventListener('click', (event) => {
    closePopup(event.target.closest('.popup'));
    event.preventDefault();
  });
});

function openPopup(currentPopup) {
  if (currentPopup && unlocked) {
    const activePopup = document.querySelector('popup.open');
    if (activePopup) {
      closePopup(activePopup, false);
    } else {
      lockBody();
    }
    currentPopup.classList.add('open');
    currentPopup.addEventListener('click', (event) => {
      if (!event.target.closest('.popup__content')) {
        closePopup(event.target.closest('.popup'));
      }
    });
  }
}

function closePopup(activePopup, doUnlock = true) {
  if (unlocked) {
    activePopup.classList.remove('open');
    if (doUnlock) {
      unlockBody();
    }
  }
}

function lockBody() {
  body.classList.add('lock');
}

function unlockBody() {
  body.classList.remove('lock');
}

//name validation
const nameInputField = document.querySelector(['.form__input-field#name']);
const emailInputField = document.querySelector(['.form__input-field#email']);
const phoneNumberInputField = document.querySelector([
  '.form__input-field#phone-number',
]);

nameInputField.addEventListener('input', (event) => checkName(event.target));
nameInputField.addEventListener('focusout', (event) => checkName(event.target));
emailInputField.addEventListener('input', (event) => checkEmail(event.target));
emailInputField.addEventListener('focusout', (event) =>
  checkEmail(event.target)
);
phoneNumberInputField.addEventListener('focus', (event) => {
  watchPhoneNumberInput(event.target);
});

let phoneNumberInputValue = '';

phoneNumberInputField.addEventListener('input', (event) => {
  phoneNumberInputValue = event.target.value;
  phoneNumberInputValue = phoneNumberInputValue.replace(/[^+\d]/g, '');

  checkPhoneNumberInput(event.target, phoneNumberInputValue);

  let maskedPhoneNumber = '';
  for (let i = 0; i < phoneNumberInputValue.length; i++) {
    if (i === 2 || i === 5 || i === 8 || i === 10) {
      maskedPhoneNumber += ' ';
    }
    maskedPhoneNumber += phoneNumberInputValue[i];
  }
  phoneNumberInputValue = maskedPhoneNumber;
  event.target.value = phoneNumberInputValue;
});

function checkName(inputElement) {
  if (isEmpty(inputElement)) {
    showError(inputElement);
    return false;
  } else {
    hideError(inputElement);
    return true;
  }
}

function checkEmail(inputElement) {
  if (isEmpty(inputElement)) {
    showError(inputElement);
    return false;
  } else if (inputElement.validity.typeMismatch) {
    showError(inputElement, 'Invalid email');
    return false;
  } else {
    hideError(inputElement);
    return true;
  }
}

function checkPhoneNumberInput(target, phoneNumber) {
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength <= 2) {
    showError(target);
    return false;
  } else if (phoneNumberLength < 12 || phoneNumberLength > 12) {
    showError(target, 'Invalid phone number.');
    return false;
  } else {
    hideError(target);
    return true;
  }
}

function watchPhoneNumberInput(inputElement) {
  console.log('watching');
  if (isEmpty(inputElement)) {
    inputElement.value = '+7';
    showError(inputElement);
  }
}

function isEmpty(input) {
  if (input.validity.valueMissing) {
    return true;
  }
  return false;
}

function showError(inputElement, message = 'This field is required.') {
  const errorMessage = inputElement
    .closest('label')
    .querySelector('.form__input-alert');
  errorMessage.innerText = message;
  errorMessage.classList.remove('form__input-alert_hidden');
  inputElement.classList.add('form__input-field_invalid');
}

function hideError(inputElement) {
  console.log(inputElement);
  const errorMessage = inputElement
    .closest('label')
    .querySelector('.form__input-alert');
  errorMessage.classList.add('form__input-alert_hidden');
  inputElement.classList.remove('form__input-field_invalid');
}

///FORM HANDLER

const form = document.querySelector('.form__form-area');

const submitButton = document.querySelector('.form__button');

submitButton.addEventListener('click', () => isFormValid(serializeFrom(form)));

const formCloseButton = document.querySelector('.form__close');
formCloseButton.addEventListener('click', () => {
  form.reset();
  const formAlert = document.querySelector('.form__alert');
  formAlert.classList.remove('form__alert_visible');

  const { elements } = form;
  const data = Array.from(elements)
    .filter((element) => !!element.name && !!element.required)
    .forEach((e) => hideError(e));
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
});

function isFormValid() {
  const formAlert = document.querySelector('.form__alert');
  if (
    !checkName(nameInputField) ||
    !checkEmail(emailInputField) ||
    !checkPhoneNumberInput(phoneNumberInputField, phoneNumberInputValue)
  ) {
    checkName(nameInputField);
    checkEmail(emailInputField);
    checkPhoneNumberInput(phoneNumberInputField, phoneNumberInputValue);
    formAlert.classList.add('form__alert_visible');
  } else {
    formAlert.classList.remove('form__alert_visible');
  }
}

function serializeFrom(formElement) {
  const { elements } = formElement;
  const data = Array.from(elements)
    .filter((element) => !!element.name)
    .map((element) => {
      const { name, value, required } = element;
      return { name, value, required };
    });
  return data;
}

const cookie = document.querySelector('.cookie__body');
setTimeout(() => {
  cookie.classList.remove('cookie__body_hidden');
}, 2000);

const lines = document.querySelectorAll('.preview__line');
const linesWrap = document.querySelector('.preview__running-lines');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let lastTime;
  let animationSpeed = 0.5;
  let reverse = !!(i % 2);
  let request = requestAnimationFrame((time) =>
    animate(time, line, animationSpeed, lastTime, reverse)
  );
}

function animate(time, line, animationSpeed, lastTime, reverse = false) {
  if (lastTime != null) {
    const delta = time - lastTime;
    line.style.left = reverse
      ? line.offsetLeft + delta * animationSpeed + 'px'
      : line.offsetLeft - delta * animationSpeed + 'px';
  } else {
    start = Date.now();
    if (reverse) {
      line.style.left = linesWrap.clientWidth * -0.503 + 'px';
    }
  }
  lastTime = time;

  console.log(line.offsetLeft < linesWrap.clientWidth * 0.503);
  if (reverse) {
    if (line.offsetLeft > 0)
      line.style.left = linesWrap.clientWidth * -0.503 + 'px';
  } else {
    if (line.offsetLeft < linesWrap.clientWidth * -0.503) {
      console.log('whyyy');
      line.style.left = 0 + 'px';
    }
  }
  requestAnimationFrame((time) =>
    animate(time, line, animationSpeed, lastTime, reverse)
  );
}
