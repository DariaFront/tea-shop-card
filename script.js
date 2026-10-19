'use strict';

// Local demo only: no requests to Teaboom.ru, no real purchases or favorites.
const form = document.querySelector('#product-form');
const packageRadios = [...document.querySelectorAll('input[name="package"]')];
const cartMessage = document.querySelector('#cart-message');

function updateSelectedPackage() {
  const radio = packageRadios.find(item => item.checked);
  if (!radio) return;

  document.querySelector('#chosen-weight').textContent = `${radio.value} г`;
  document.querySelector('#chosen-sku').textContent = radio.dataset.sku;
  document.querySelector('#chosen-price').textContent = radio.dataset.price;

  const oldPrice = document.querySelector('#chosen-old-price');
  oldPrice.textContent = radio.dataset.oldPrice || '';
  oldPrice.hidden = !radio.dataset.oldPrice;

  packageRadios.forEach(item => {
    item.closest('.variant-item').dataset.selected = String(item.checked);
  });
  cartMessage.textContent = '';
}

form?.addEventListener('change', event => {
  if (event.target.matches('input[name="package"]')) updateSelectedPackage();
});
form?.addEventListener('submit', event => {
  event.preventDefault();
  const radio = packageRadios.find(item => item.checked);
  if (!radio) return;
  cartMessage.textContent = `Ананасовый улун, ${radio.value} г — демонстрация: товар не добавлен в настоящую корзину.`;
});

// Accessible tabs: keep content in HTML (single source of truth), no innerHTML templates.
const tabs = [...document.querySelectorAll('.tab-list [role="tab"]')];
function activateTab(tab, options = {}) {
  if (!tab) return;
  tabs.forEach(item => {
    const selected = item === tab;
    item.setAttribute('aria-selected', String(selected));
    item.tabIndex = selected ? 0 : -1;
    item.classList.toggle('active', selected);
    const panel = document.getElementById(item.getAttribute('aria-controls'));
    if (panel) panel.hidden = !selected;
  });
  if (options.focus) tab.focus();
}
tabs.forEach((tab, index) => {
  tab.addEventListener('click', () => activateTab(tab));
  tab.addEventListener('keydown', event => {
    const direction = event.key === 'ArrowRight' ? 1 : event.key === 'ArrowLeft' ? -1 : 0;
    if (!direction && event.key !== 'Home' && event.key !== 'End') return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1
      : (index + direction + tabs.length) % tabs.length;
    activateTab(tabs[nextIndex], { focus: true });
  });
});
activateTab(tabs.find(tab => tab.getAttribute('aria-selected') === 'true') || tabs[0]);

// This link targets a hidden panel. Show it before scrolling.
document.querySelector('.review-link')?.addEventListener('click', event => {
  event.preventDefault();
  activateTab(document.getElementById('tab-reviews'));
  document.getElementById('reviews-panel')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

// Product photo lightbox (native <dialog>, without external libraries).
const dialog = document.querySelector('#image-dialog');
function openImage() {
  if (dialog && typeof dialog.showModal === 'function' && !dialog.open) dialog.showModal();
}
document.querySelector('#photo-open')?.addEventListener('click', openImage);
document.querySelector('#photo-thumb')?.addEventListener('click', openImage);
document.querySelector('#photo-close')?.addEventListener('click', () => dialog?.close());
dialog?.addEventListener('click', event => {
  if (event.target === dialog) dialog.close();
});

// Local favorite indicator.
const favorite = document.querySelector('#favorite');
favorite?.addEventListener('click', () => {
  const enabled = favorite.getAttribute('aria-pressed') !== 'true';
  favorite.setAttribute('aria-pressed', String(enabled));
  favorite.setAttribute('aria-label', enabled ? 'Убрать из избранного' : 'Добавить в избранное');
});

const showMore = document.querySelector('#category-more');
showMore?.addEventListener('click', () => {
  const extraCategory = document.querySelector('#extra-category');
  if (!extraCategory) return;
  const shouldShow = extraCategory.hidden;
  extraCategory.hidden = !shouldShow;
  showMore.setAttribute('aria-expanded', String(shouldShow));
  showMore.textContent = shouldShow ? '−' : '···';
});

updateSelectedPackage();
