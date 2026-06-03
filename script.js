const header = document.querySelector("[data-header]");
const tabs = [...document.querySelectorAll("[data-filter]")];
const products = [...document.querySelectorAll("[data-category]")];
const addButtons = [...document.querySelectorAll("[data-add]")];
const bagDrawer = document.querySelector("[data-bag-drawer]");
const bagItems = document.querySelector("[data-bag-items]");
const bagCount = document.querySelector("[data-bag-count]");
const scrim = document.querySelector("[data-scrim]");
const openBagButton = document.querySelector("[data-cart-open]");
const closeBagButton = document.querySelector("[data-cart-close]");
const waitlistForm = document.querySelector("[data-waitlist-form]");
const formStatus = document.querySelector("[data-form-status]");
const galleryMain = document.querySelector("[data-gallery-main]");
const galleryControls = [...document.querySelectorAll("[data-gallery-src]")];

const loadBag = () => {
  try {
    return JSON.parse(localStorage.getItem("atp-launch-bag") || "[]");
  } catch {
    return [];
  }
};

const selectedItems = loadBag();

const saveBag = () => {
  localStorage.setItem("atp-launch-bag", JSON.stringify(selectedItems));
};

const refreshIcons = () => {
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

const syncHeader = () => {
  if (!header || header.classList.contains("is-solid")) return;
  header.classList.toggle("is-scrolled", window.scrollY > 24);
};

const renderBag = () => {
  if (!bagCount || !bagItems) return;
  bagCount.textContent = selectedItems.length;

  if (!selectedItems.length) {
    bagItems.innerHTML = "<li>Your selected capsule pieces will appear here.</li>";
    return;
  }

  bagItems.innerHTML = selectedItems
    .map((item, index) => `<li>${item}<button type="button" data-remove-item="${index}">Remove</button></li>`)
    .join("");
};

const setDrawer = (isOpen) => {
  if (!bagDrawer || !scrim) return;
  document.body.classList.toggle("drawer-open", isOpen);
  bagDrawer.classList.toggle("is-open", isOpen);
  scrim.classList.toggle("is-open", isOpen);
  bagDrawer.setAttribute("aria-hidden", String(!isOpen));
};

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    const filter = tab.dataset.filter;

    tabs.forEach((item) => {
      const isActive = item === tab;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-selected", String(isActive));
    });

    products.forEach((product) => {
      const shouldShow = filter === "all" || product.dataset.category === filter;
      product.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

addButtons.forEach((button) => {
  button.addEventListener("click", () => {
    selectedItems.push(button.dataset.add);
    saveBag();
    renderBag();
    setDrawer(true);
  });
});

bagItems?.addEventListener("click", (event) => {
  const removeButton = event.target.closest("[data-remove-item]");
  if (!removeButton) return;

  selectedItems.splice(Number(removeButton.dataset.removeItem), 1);
  saveBag();
  renderBag();
});

galleryControls.forEach((control) => {
  control.addEventListener("click", () => {
    if (!galleryMain) return;
    galleryMain.src = control.dataset.gallerySrc;
    galleryControls.forEach((item) => item.classList.toggle("is-active", item === control));
  });
});

openBagButton?.addEventListener("click", () => setDrawer(true));
closeBagButton?.addEventListener("click", () => setDrawer(false));
scrim?.addEventListener("click", () => setDrawer(false));

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    setDrawer(false);
  }
});

waitlistForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(waitlistForm);
  const email = String(formData.get("email") || "").trim();

  if (formStatus) {
    formStatus.textContent = email
      ? "You're on the founding list. ATP will meet you at launch."
      : "";
  }

  if (email) {
    waitlistForm.reset();
  }
});

window.addEventListener("scroll", syncHeader, { passive: true });
window.addEventListener("load", refreshIcons);

syncHeader();
renderBag();
refreshIcons();
