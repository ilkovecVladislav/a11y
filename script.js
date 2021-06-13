const setError = function (alert, input, errorText, setFocus = true) {
  alert.innerHTML = "";
  const span = document.createElement("span");
  span.innerHTML = errorText;
  alert.appendChild(span);
  alert.style.visibility = "visible";
  input.setAttribute("aria-invalid", true);
  if (setFocus) {
    input.focus();
  }
};

const removeError = function (alert, input) {
  alert.innerHTML = "";
  input.removeAttribute("aria-invalid");
  alert.style.visibility = "hidden";
};

// search form
const searchAlert = document.getElementById("search-error");
const searchForm = document.querySelector(".search-form");
const searchInput = document.querySelector(".search-input");

const submitSearch = function (event) {
  event.preventDefault();

  if (searchInput.value === "") {
    setError(searchAlert, searchInput, "Необходимо ввести фразу для поиска");
  } else {
    removeError(searchAlert, searchInput);
  }
};

searchForm.addEventListener("submit", submitSearch);

// login form
const usernameAlert = document.getElementById("username-error");
const passwordAlert = document.getElementById("password-error");
const loginForm = document.querySelector(".login-form");
const usernameInput = document.querySelector(".username-input");
const passwordInput = document.querySelector(".password-input");
const successPopup = document.querySelector(".success-login");
let loginModal;
let focusedElementBeforeModal;
let isAuthorized = false;

const submitLogin = function (event) {
  event.preventDefault();
  let loginHasError = false;
  let passwordHasError = false;

  if (usernameInput.value.length < 6) {
    setError(usernameAlert, usernameInput, "Слишком короткий логин");
    loginHasError = true;
  } else if (usernameInput.value.length > 24) {
    setError(usernameAlert, usernameInput, "Слишком длинный логин");
    loginHasError = true;
  } else {
    removeError(usernameAlert, usernameInput);
  }
  if (passwordInput.value.length < 6) {
    setError(
      passwordAlert,
      passwordInput,
      "Слишком короткий пароль",
      !loginHasError
    );
  } else if (passwordInput.value.length > 12) {
    setError(
      passwordAlert,
      passwordInput,
      "Слишком длинный пароль",
      !loginHasError
    );
  } else {
    removeError(passwordAlert, passwordInput);
  }

  if (!loginHasError && !passwordHasError) {
    successPopup.style.display = "flex";
    loginModal.style.display = "none";
    const username = usernameInput.value;
    usernameInput.value = "";
    passwordInput.value = "";
    const span = document.createElement("span");
    span.innerHTML = username;
    focusedElementBeforeModal.focus();
    focusedElementBeforeModal.innerHTML = "";
    focusedElementBeforeModal.appendChild(span);

    setTimeout(() => {
      successPopup.style.display = "none";
    }, 3000);
  }
};

loginForm.addEventListener("submit", submitLogin);

// login modal

let registerButton;
let isModalOpened = false;

const KEY = {
  ESCAPE: 27,
  TAB: 9,
};

if (document.querySelector(".modal") && document.querySelector(".open-modal")) {
  loginModal = document.querySelector(".modal");
  registerButton = document.querySelector(".open-modal");
  registerButton.addEventListener("click", openModal);
}

function openModal() {
  isModalOpened = true;
  focusedElementBeforeModal = document.activeElement;

  loginModal.style.display = "flex";

  loginModal.addEventListener("keydown", processEscapeTabKeys);

  if (isAuthorized) {
    loginForm.innerHTML = "";
    const h2 = document.createElement("h2");
    h2.innerHTML = "Вы уже авторизовались";
    loginForm.appendChild(h2);
  }

  const modalElements = "input:not([disabled]), button:not([disabled])";
  const focusableElements = loginModal.querySelectorAll(modalElements);

  const firstElementOfModal = focusableElements[0];
  const lastElementOfModal = focusableElements[focusableElements.length - 1];

  firstElementOfModal.focus();

  const closeModalButton = loginModal.querySelector(".close-modal");

  closeModalButton.addEventListener("click", () => {
    loginModal.style.display = "none";
    focusedElementBeforeModal.focus();
    usernameInput.value = "";
    passwordInput.value = "";
    removeError(usernameAlert, usernameInput);
    removeError(passwordAlert, passwordInput);
  });

  function processEscapeTabKeys(event) {
    if (event.keyCode === KEY.TAB) {
      if (document.activeElement === lastElementOfModal) {
        event.preventDefault();
        firstElementOfModal.focus();
      }
    }
    if (event.keyCode === KEY.ESCAPE) {
      loginModal.style.display = "none";
      focusedElementBeforeModal.focus();
      usernameInput.value = "";
      passwordInput.value = "";
      removeError(usernameAlert, usernameInput);
      removeError(passwordAlert, passwordInput);
    }
  }
}

// Museum tabs
class TabController {
  constructor(container) {
    this.container = document.querySelector(container);
    this.tablist = this.container.querySelector("[role=tablist]");
    this.tabs = this.container.querySelectorAll("[role=tab]");
    this.tabpanels = this.container.querySelectorAll("[role=tabpanel]");
    this.activeTab = this.container.querySelector(
      "[role=tab][aria-selected=true]"
    );

    this.addEventListeners();
  }

  // Private function to set event listeners
  addEventListeners() {
    for (let tab of this.tabs) {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        this.setActiveTab(tab.getAttribute("aria-controls"));
      });
      tab.addEventListener("keyup", (e) => {
        if (e.keyCode == 13 || e.keyCode == 32) {
          // return or space
          e.preventDefault();
          this.setActiveTab(tab.getAttribute("aria-controls"));
        }
      });
    }
    this.tablist.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        case 35: // end key
          e.preventDefault();
          this.setActiveTab(
            this.tabs[this.tabs.length - 1].getAttribute("aria-controls")
          );
          break;
        case 36: // home key
          e.preventDefault();
          this.setActiveTab(this.tabs[0].getAttribute("aria-controls"));
          break;
        case 37: // left arrow
          e.preventDefault();
          let previous = [...this.tabs].indexOf(this.activeTab) - 1;
          previous = previous >= 0 ? previous : this.tabs.length - 1;
          this.setActiveTab(this.tabs[previous].getAttribute("aria-controls"));
          break;
        case 39: // right arrow
          e.preventDefault();
          let next = [...this.tabs].indexOf(this.activeTab) + 1;
          next = next < this.tabs.length ? next : 0;
          this.setActiveTab(this.tabs[next].getAttribute("aria-controls"));
          break;
      }
    });
  }

  // Public function to set the tab by id
  // This can be called by the developer too.
  setActiveTab(id) {
    for (let tab of this.tabs) {
      if (tab.getAttribute("aria-controls") === id) {
        tab.setAttribute("aria-selected", "true");
        tab.focus();
        this.activeTab = tab;
      } else {
        tab.setAttribute("aria-selected", "false");
      }
    }
    for (let tabpanel of this.tabpanels) {
      if (tabpanel.getAttribute("id") == id) {
        tabpanel.setAttribute("aria-expanded", "true");
      } else {
        tabpanel.setAttribute("aria-expanded", "false");
      }
    }
  }
}

const museumTabController = new TabController("#museum-tabs");

class ExhibitionTabsController {
  constructor(container) {
    this.container = document.querySelector(container);
    this.tablist = this.container.querySelector("[role=tablist]");
    this.tabs = this.container.querySelectorAll("[role=tab]");
    this.cards = this.container.querySelectorAll(".exhibitions-card");
    this.activeTab = this.container.querySelector(
      "[role=tab][aria-selected=true]"
    );
    this.activeTabFilterAttribute = this.activeTab.getAttribute("data-filter");

    this.addEventListeners();
  }

  addEventListeners() {
    for (let tab of this.tabs) {
      tab.addEventListener("click", (e) => {
        e.preventDefault();
        this.setActiveTab(tab.getAttribute("aria-controls"));
      });
      tab.addEventListener("keyup", (e) => {
        if (e.keyCode == 13 || e.keyCode == 32) {
          // return or space
          e.preventDefault();
          this.setActiveTab(tab.getAttribute("aria-controls"));
        }
      });
    }
    this.tablist.addEventListener("keyup", (e) => {
      switch (e.keyCode) {
        case 35: // end key
          e.preventDefault();
          this.setActiveTab(
            this.tabs[this.tabs.length - 1].getAttribute("aria-controls")
          );
          break;
        case 36: // home key
          e.preventDefault();
          this.setActiveTab(this.tabs[0].getAttribute("aria-controls"));
          break;
        case 37: // left arrow
          e.preventDefault();
          let previous = [...this.tabs].indexOf(this.activeTab) - 1;
          previous = previous >= 0 ? previous : this.tabs.length - 1;
          this.setActiveTab(this.tabs[previous].getAttribute("aria-controls"));
          break;
        case 39: // right arrow
          e.preventDefault();
          let next = [...this.tabs].indexOf(this.activeTab) + 1;
          next = next < this.tabs.length ? next : 0;
          this.setActiveTab(this.tabs[next].getAttribute("aria-controls"));
          break;
      }
    });
  }

  setActiveTab(id) {
    for (let tab of this.tabs) {
      if (tab.getAttribute("aria-controls") === id) {
        tab.setAttribute("aria-selected", "true");
        tab.focus();
        this.activeTab = tab;
        this.activeTabFilterAttribute = tab.getAttribute("data-filter");
      } else {
        tab.setAttribute("aria-selected", "false");
      }
    }
    for (let card of this.cards) {
      if (this.activeTabFilterAttribute === "all") {
        card.style.display = "block";
      } else if (
        card.getAttribute("data-filter") === this.activeTabFilterAttribute
      ) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    }
  }
}

const exhibitionsTabController = new ExhibitionTabsController(
  "#exhibitions-filters"
);

// subscription form

const subscribeForm = document.querySelector(".subscription-form");
const emailInput = document.querySelector(".email-input");
const checkboxInput = document.querySelector(".agreement-checkbox");
const successSubscribeAlert = document.querySelector(".subscription-alert");

const submitSubscribe = function (event) {
  event.preventDefault();

  successSubscribeAlert.style.display = "flex";
  emailInput.value = "";
  checkboxInput.click();
  setTimeout(() => {
    successSubscribeAlert.style.display = "none";
  }, 3000);
};

subscribeForm.addEventListener("submit", submitSubscribe);
