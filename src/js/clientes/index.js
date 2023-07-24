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
    alert('Debe llenar todos los campos');
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

  } catch (error) {
    console.log(error);
  }
};
