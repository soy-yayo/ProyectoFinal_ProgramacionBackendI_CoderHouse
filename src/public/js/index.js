import __dirname from "../utils.js";


const productList = document.getElementById('productList');
const form = document.getElementById('form');

const socket = io();

socket.on('products', (data) => {
  productList.innerHTML = '';
  data.forEach(product => {
    let li = document.createElement('li');
    li.innerHTML += `
        <h2>${product.name}</h2>
        <p>${product.price}</p>
        <img src="${product.thumbnail}" alt="${product.name}">
      <button onclick="deleteProduct('${product.id}')">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Obtener datos del formulario
  const name = document.getElementById("title").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const url = document.getElementById("url").value.trim();

  // Validación de datos
  if (!name || isNaN(price) || price <= 0 || !url) {
    Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
    return;
  }

  // Crear objeto producto y enviarlo al servidor
  const id = Date.now();
  const product = { id, title, price, url };
  socket.emit("newProduct", product);

  // Mostrar alerta de éxito y limpiar formulario
  Swal.fire("Éxito", "Producto agregado correctamente.", "success");
  form.reset();
});

function deleteProduct(id) {
  socket.emit('delete-product', id);
}