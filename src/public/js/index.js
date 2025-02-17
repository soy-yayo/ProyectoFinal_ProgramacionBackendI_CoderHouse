import __dirname from "../utils.js";

const productList = document.getElementById('productList');
const form = document.getElementById('form');

const socket = io();

socket.on('products', (data) => {
  productList.innerHTML = '';
  data.forEach(product => {
    productList.innerHTML += `
      <li>
        <h2>${product.name}</h2>
        <p>${product.price}</p>
        <img src="${product.thumbnail}" alt="${product.name}">
      </li>
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
  });
});

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formData = new FormData(form);
  const newProduct = {
    name: formData.get('name'),
    price: formData.get('price'),
    thumbnail: formData.get('thumbnail')
  };
  socket.emit('new-product', newProduct);
  form.reset();
});

function deleteProduct(id) {
  socket.emit('delete-product', id);
}