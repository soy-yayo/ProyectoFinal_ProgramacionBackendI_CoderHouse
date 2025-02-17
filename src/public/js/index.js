const productList = document.getElementById('productList');
const form = document.getElementById('form');
const socket = io();

Swal.fire({
  title: 'Bienvenido',
  text: 'Conectado al servidor de WebSockets',
  icon: 'success',
  confirmButtonText: 'Continuar'
});

socket.on('products', (data) => {
  productList.innerHTML = '';
  data.forEach(product => {
    let li = document.createElement('li');
    li.innerHTML += `
    <h2>${product.name}</h2>
      <p>Precio: $${product.price}</p>
      <img src="${product.thumbnail}" alt="${product.name}" class="w-38 h-40">
      <button class="border border-grey-600" onclick="deleteProduct(${product.id})">Eliminar</button>
    `;
    productList.appendChild(li);
  });
});


form.addEventListener('submit', (e) => {
  e.preventDefault();
  // Obtener datos del formulario
  const name = document.getElementById("name").value.trim();
  const price = parseFloat(document.getElementById("price").value);
  const thumbnail = document.getElementById("thumbnail").value.trim();
  
  // Validación de datos
  if (!name || isNaN(price) || price <= 0 || !thumbnail) {
    Swal.fire("Error", "Por favor, completa todos los campos correctamente.", "error");
    return;
  }
  
  // Crear objeto producto y enviarlo al servidor
  const id = Date.now();
  const product = { id, name, price, thumbnail};
  socket.emit("newProduct", product);
  
  // Mostrar alerta de éxito y limpiar formulario
  Swal.fire("Éxito", "Producto agregado correctamente.", "success");
  form.reset();
});

function deleteProduct(id) {
  socket.emit('deleteProduct', id);
}