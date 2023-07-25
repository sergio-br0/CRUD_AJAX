
// Obtenemos referencias a los elementos del formulario y otros elementos del DOM

const formulario = document.querySelector('form');
const tablaClientes = document.getElementById('tablaClientes');
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const divTabla = document.getElementById('divTabla');

// deshabilitamos y ocultamos los botones Modificar y Cancelar para mostrarlos posteriormete
btnModificar.disabled = true;
btnModificar.parentElement.style.display = 'none';
btnCancelar.disabled = true;
btnCancelar.parentElement.style.display = 'none';

// Función para validar y guardar los datos del formulario 
const guardar = async (evento) => {
  evento.preventDefault();
  if (!validarFormulario(formulario, ['cliente_id'])) {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Debe llenar todos los campos del formulario.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
  });
  return;
  }

  const body = new FormData(formulario);
  body.append('tipo', 1);
  body.delete('cliente_id');
  const url = '/crud_ajax/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };

  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();

    const { codigo, mensaje, detalle } = data;

    switch (codigo) {
      case 1:
        formulario.reset();
        buscar();
        break;

      case 0:
        console.log(detalle);
        break;

      default:
        break;
    }
    Swal.fire({
      title: 'Guardado exitoso',
      text: 'Los datos se han guardado correctamente.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    });

  } catch (error) {
    console.log(error);
  }
};



//se crea la funcion buscar 
const buscar = async () => {
    let cliente_nombre = formulario.cliente_nombre.value;
    let cliente_nit = formulario.cliente_nit.value;
    const url = `/crud_ajax/controladores/clientes/index.php?cliente_nombre=${cliente_nombre}&cliente_nit=${cliente_nit}`;
    const config = {
      method: 'GET',
    };
  
    try {
      const respuesta = await fetch(url, config);
      const data = await respuesta.json();
  
      tablaClientes.tBodies[0].innerHTML = '';
      const fragment = document.createDocumentFragment();
      console.log(data);
      if (data.length > 0) {
        let contador = 1;
        data.forEach((cliente) => {

          // se crean elementos 
          const tr = document.createElement('tr');
          const td1 = document.createElement('td');
          const td2 = document.createElement('td');
          const td3 = document.createElement('td');
          const td4 = document.createElement('td');
          const td5 = document.createElement('td');
          const buttonModificar = document.createElement('button');
          const buttonEliminar = document.createElement('button');
  
          // se agregan clases de boostrap a los botones.
          buttonModificar.classList.add('btn', 'btn-warning');
          buttonEliminar.classList.add('btn', 'btn-danger');
          buttonModificar.textContent = 'Modificar';
          buttonEliminar.textContent = 'Eliminar';
          
          buttonModificar.addEventListener('click', () => colocarDatos(cliente));
          buttonEliminar.addEventListener('click', () => eliminar(cliente.CLIENTE_ID));
  
          td1.innerText = contador;
          td2.innerText = cliente.CLIENTE_NOMBRE;
          td3.innerText = cliente.CLIENTE_NIT;
  
          // ESTRUCTURANDO DOM
          td4.appendChild(buttonModificar);
          td5.appendChild(buttonEliminar);
          tr.appendChild(td1);
          tr.appendChild(td2);
          tr.appendChild(td3);
          tr.appendChild(td4);
          tr.appendChild(td5);
  
          fragment.appendChild(tr);
  
          contador++;
        });
      } else {
        const tr = document.createElement('tr');
        const td = document.createElement('td');
        td.innerText = 'No existen registros';
        td.colSpan = 5;
        tr.appendChild(td);
        fragment.appendChild(tr);
      }
  
      tablaClientes.tBodies[0].appendChild(fragment);
    } catch (error) {
      console.log(error);
    }
  };
  // funcion para colocar los datos a la hora de modificar 
  const colocarDatos = (datos) => {
    formulario.cliente_nombre.value = datos.CLIENTE_NOMBRE;
    formulario.cliente_nit.value = datos.CLIENTE_NIT;
    formulario.cliente_id.value = datos.CLIENTE_ID;
  
    btnGuardar.disabled = true;
    btnGuardar.parentElement.style.display = 'none';
    btnBuscar.disabled = true;
    btnBuscar.parentElement.style.display = 'none';
    btnModificar.disabled = false;
    btnModificar.parentElement.style.display = '';
    btnCancelar.disabled = false;
    btnCancelar.parentElement.style.display = '';
    divTabla.style.display = 'none';
  };
  //crear funcion cancelar accion para no crear otro registro de cliente
  const cancelarAccion = () => {
    btnGuardar.disabled = false;
    btnGuardar.parentElement.style.display = '';
    btnBuscar.disabled = false;
    btnBuscar.parentElement.style.display = '';
    btnModificar.disabled = true;
    btnModificar.parentElement.style.display = 'none';
    btnCancelar.disabled = true;
    btnCancelar.parentElement.style.display = 'none';
    divTabla.style.display = '';
  };

  //se cre la funcion modificar
const modificar = async () => {
  const cliente_id = formulario.cliente_id.value;

  if (!validarFormulario(formulario, ['cliente_nombre'])) {
    Swal.fire({
      title: 'Campos incompletos',
      text: 'Debe llenar todos los campos del formulario.',
      icon: 'warning',
      showCancelButton: false,
      confirmButtonColor: '#d33',
      confirmButtonText: 'OK',
    });
    return;
  }

  const body = new FormData(formulario);
  body.append('tipo', 2);
  body.append('cliente_id', cliente_id)

  const url = '/crud_ajax/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };

  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();
    console.log(data);

    const { codigo, mensaje, detalle } = data;

    switch (codigo) {
      case 1:
        formulario.reset();
        cancelarAccion();
        buscar();

        Swal.fire('Actualizado', mensaje, 'success');
        break;

      case 0:
        Swal.fire('Error, verifique sus datos', mensaje, 'error');
        break;

      default:
        break;
    }
    Swal.fire({
      title: 'Modificación exitosa',
      text: 'Los datos se han modificado correctamente.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    })
  } catch (error) {
    console.log(error);
  }
}

//se creo la funcion eliminar 
const eliminar = async (id) => {
  if (await Swal.fire({
    title: '¿Desea eliminar este Cliente?',
    icon: 'question',
    showCancelButton: true,
    confirmButtonColor: '#d33',
    cancelButtonColor: '#3085d6',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar',
}).then((result) => result.isConfirmed)) {
  const body = new FormData();
  body.append('tipo', 3);
  body.append('cliente_id', id);
  const url = '/crud_ajax/controladores/clientes/index.php';
  const config = {
    method: 'POST',
    body,
  };
  try {
    const respuesta = await fetch(url, config);
    const data = await respuesta.json();

    const { codigo, mensaje, detalle } = data;

    switch (codigo) {
      case 1:
        buscar();
        break;

      case 0:
        console.log(detalle);
        break;

      default:
        break;
    }
    Swal.fire({
      title: 'Eliminación exitosa',
      text: 'El Cliente ha sido eliminado correctamente.',
      icon: 'success',
      showCancelButton: false,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'OK',
    })

  } catch (error) {
    console.log(error);
  }
}
};

  // se asiganan los eventos a los elementos (botones).
formulario.addEventListener('submit', guardar);
btnBuscar.addEventListener('click', buscar);
btnCancelar.addEventListener('click', cancelarAccion);
btnModificar.addEventListener('click', modificar)
