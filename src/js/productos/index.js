const formulario = document.querySelector('form')
const tablaProductos = document.getElementById('tablaProductos');
const btnBuscar = document.getElementById('btnBuscar');
const btnModificar = document.getElementById('btnModificar');
const btnGuardar = document.getElementById('btnGuardar');
const btnCancelar = document.getElementById('btnCancelar');
const divTabla = document.getElementById('divTabla');
const modalEjemplo = document.getElementById('modalEjemplo')
let modalEjemploBS = null;


btnModificar.disabled = true
btnModificar.parentElement.style.display = 'none'
btnCancelar.disabled = true
btnCancelar.parentElement.style.display = 'none'

console.log(btnGuardar.dataset)

const guardar = async (evento) => {
    evento.preventDefault();
    if(!validarFormulario(formulario, ['producto_id'])){
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

    const body = new FormData(formulario)
    body.append('tipo', 1)
    body.delete('producto_id')
    const url = '/crud_ajax/controladores/productos/index.php';
    const config = {
        method : 'POST',
        // body: otroNombre
        body
    }

    try {
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        const {codigo, mensaje,detalle} = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar();
                break;
        
            case 0:
                console.log(detalle)
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
          }).then((result) => {
            if (result.isConfirmed) {
            }
          });

    } catch (error) {
        console.log(error);
    }
}

const buscar = async () => {

    let producto_nombre = formulario.producto_nombre.value;
    let producto_precio = formulario.producto_precio.value;
    const url = `/crud_ajax/controladores/productos/index.php?producto_nombre=${producto_nombre}&producto_precio=${producto_precio}`;
    const config = {
        method : 'GET'
    }

    try {
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        tablaProductos.tBodies[0].innerHTML = ''
        const fragment = document.createDocumentFragment();
        console.log(data);
        if(data.length > 0){
            let contador = 1;
            data.forEach( producto => {
                // CREAMOS ELEMENTOS
                const tr = document.createElement('tr');
                const td1 = document.createElement('td')
                const td2 = document.createElement('td')
                const td3 = document.createElement('td')
                const td4 = document.createElement('td')
                const td5 = document.createElement('td')
                const buttonModificar = document.createElement('button')
                const buttonEliminar = document.createElement('button')

                // CARACTERISTICAS A LOS ELEMENTOS
                buttonModificar.classList.add('btn', 'btn-warning')
                buttonEliminar.classList.add('btn', 'btn-danger')
                buttonModificar.textContent = 'Modificar'
                buttonEliminar.textContent = 'Eliminar'

                buttonModificar.addEventListener('click', () => colocarDatos(producto))
                buttonEliminar.addEventListener('click', () => eliminar(producto.PRODUCTO_ID))

                td1.innerText = contador;
                td2.innerText = producto.PRODUCTO_NOMBRE
                td3.innerText = producto.PRODUCTO_PRECIO
                
                
                // ESTRUCTURANDO DOM
                td4.appendChild(buttonModificar)
                td5.appendChild(buttonEliminar)
                tr.appendChild(td1)
                tr.appendChild(td2)
                tr.appendChild(td3)
                tr.appendChild(td4)
                tr.appendChild(td5)

                fragment.appendChild(tr);

                contador++;
            })
        }else{
            const tr = document.createElement('tr');
            const td = document.createElement('td')
            td.innerText = 'No existen registros'
            td.colSpan = 5
            tr.appendChild(td)
            fragment.appendChild(tr);
        }

        tablaProductos.tBodies[0].appendChild(fragment)
    } catch (error) {
        console.log(error);
    }
}

const colocarDatos = (datos) => {
    formulario.producto_nombre.value = datos.PRODUCTO_NOMBRE
    formulario.producto_precio.value = datos.PRODUCTO_PRECIO
    formulario.producto_id.value = datos.PRODUCTO_ID

    btnGuardar.disabled = true
    btnGuardar.parentElement.style.display = 'none'
    btnBuscar.disabled = true
    btnBuscar.parentElement.style.display = 'none'
    btnModificar.disabled = false
    btnModificar.parentElement.style.display = ''
    btnCancelar.disabled = false
    btnCancelar.parentElement.style.display = ''
    divTabla.style.display = 'none'

    // modalEjemploBS.show();
}

const cancelarAccion = () => {
    btnGuardar.disabled = false
    btnGuardar.parentElement.style.display = ''
    btnBuscar.disabled = false
    btnBuscar.parentElement.style.display = ''
    btnModificar.disabled = true
    btnModificar.parentElement.style.display = 'none'
    btnCancelar.disabled = true
    btnCancelar.parentElement.style.display = 'none'
    divTabla.style.display = ''
}

const modificar = async () => {
    if(!validarFormulario(formulario)){
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

    const body = new FormData(formulario)
    body.append('tipo', 2)
    const url = '/crud_ajax/controladores/productos/index.php';
    const config = {
        method : 'POST',
        body
    }

    try {
        // fetch(url, config).then( (respuesta) => respuesta.json() ).then(d => data = d)
        const respuesta = await fetch(url, config)
        const data = await respuesta.json();
        
        const {codigo, mensaje,detalle} = data;

        switch (codigo) {
            case 1:
                formulario.reset();
                buscar();
                cancelarAccion();
                break;
        
            case 0:
                console.log(detalle)
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

const eliminar = async (id) => {
        if (await Swal.fire({
            title: '¿Desea eliminar este producto?',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
        }).then((result) => result.isConfirmed)) {
        const body = new FormData()
        body.append('tipo', 3)
        body.append('producto_id', id)
        const url = '/crud_ajax/controladores/productos/index.php';
        const config = {
            method : 'POST',
            body
        }
        try {
            const respuesta = await fetch(url, config)
            const data = await respuesta.json();
            
            const {codigo, mensaje,detalle} = data;
    
            switch (codigo) {
                case 1:
                    buscar();
                    break;
            
                case 0:
                    console.log(detalle)
                    break;
            
                default:
                    break;
            }
    
            Swal.fire({
                title: 'Eliminación exitosa',
                text: 'El producto ha sido eliminado correctamente.',
                icon: 'success',
                showCancelButton: false,
                confirmButtonColor: '#3085d6',
                confirmButtonText: 'OK',
              })
    
        } catch (error) {
            console.log(error);
        }
    }
}


buscar();

document.addEventListener('DOMContentLoaded', () => {
    modalEjemploBS = new bootstrap.Modal(modalEjemplo)
})
formulario.addEventListener('submit', guardar )
btnBuscar.addEventListener('click', buscar)
btnCancelar.addEventListener('click', cancelarAccion)
btnModificar.addEventListener('click', modificar)
modalEjemplo.addEventListener('show.bs.modal', (e)=>{
    console.log(e);
    console.log('se mostró el modal')
})