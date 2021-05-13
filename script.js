function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ id: sku, title: name, thumbnail: image }, callback) {
  const section = createCustomElement('section', 'item', null);
  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(
    createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'),
  ).addEventListener('click', () => {
    callback(sku);
  });

  const productItems = document.querySelector('.items');
  productItems.appendChild(section);
  return section;
}

function cartItemClickListener(event) {
  event.target.remove();
}

function getHtmlElement(element) {
  return document.querySelector(element);
}

function saveItems() {
  localStorage.setItem('items', getHtmlElement('ol').innerHTML);
}

function renderItems() {
  if (localStorage.items) {
    getHtmlElement('ol').innerHTML = localStorage.getItem('items');
  }
}

function createCartItemElement({ id: sku, title: name, price: salePrice }, callback) {
  const li = createCustomElement('li', 'cart__item',
    `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`);
  li.addEventListener('click', cartItemClickListener);
  getHtmlElement('ol').appendChild(li);
  callback();
  return li;
}

async function requisitionIdIProduct(sku) {
  const responseId = await fetch(`https://api.mercadolibre.com/items/${sku}`);
  const responseIdJson = await responseId.json();
  createCartItemElement(responseIdJson, saveItems);
}

async function requisitionProduct(product) {
  const response = await fetch(
    `https://api.mercadolibre.com/sites/MLB/search?q=${product}`,
  );
  const responseJson = await response.json();
  const { results } = responseJson;
  document.querySelector('.loading').remove();
  results.forEach((value) => {
    createProductItemElement(value, requisitionIdIProduct);
  });
}

function removeAllItems() {
  const buttonRemoveAllItems = document.querySelector('.empty-cart');
  buttonRemoveAllItems.addEventListener('click', () => {
    getHtmlElement('ol').innerHTML = '';
  });
}

window.onload = function onload() {
  requisitionProduct('computador');
  renderItems();
  removeAllItems();
};
