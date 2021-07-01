"use strict";
//VARIABLES DE LA TABLA Y DEL AVISO 
let containerTabla = document.querySelector('#imprimirtabla');
let aviso = document.querySelector(".aviso");

//VARIABLES DE LOS BOTONES 
let btnEnviar = document.querySelector('#btnEnviar');
let btnCrearx3 = document.getElementById ('btnCrearx3');
let btnFiltrar = document.getElementById ('btnFiltrar')

//URL API
const url = "https://60d3dc1261160900173c9ccf.mockapi.io/api/v1/pedidos/";

//AGREGO EVENTOS A LOS BOTONES
btnEnviar.addEventListener("click",enviarForm);
btnCrearx3.addEventListener("click",agregarx3);

async function enviarForm(e){  
    e.preventDefault()
    try {
        //VARIABLES QUE ME DAN EL VALOR 
        let cliente = document.querySelector("#clientes").value;
        let diaselect = document.querySelector("#diaselect").value;
        let menuselect = document.querySelector("#menuselect").value;
        let postreselect = document.querySelector("#postreselect").value;
        let panselect = document.querySelector("#panselect").value;
        let salselect = document.querySelector("#salselect").value;
        let pedidos = {
            'cliente': cliente,
            'diaselect': diaselect,
            'menuselect': menuselect,
            'postreselect': postreselect,
            'panselect': panselect,
            'salselect': salselect
        }

        aviso.innerHTML = "Guardando...";
        let answer = await fetch(url, {
            'method': 'POST',
            'headers': {'Content-type': 'application/json'},
            'body': JSON.stringify(pedidos),
        });
        let json = await answer.json();
        if (answer.status === 201){
            containerTabla.innerHTML = " ";
            aviso.innerHTML = "La tabla se cargo con exito!";
            console.table(pedidos);
        } else {
            aviso.innerHTML = "La Tabla esta vacia";
        }
    } catch (e) {
        aviso.innerHTML = "La Tabla esta vacia"; 
    };
    try {
        cargaTabla();
    } catch (e) {
    }
}

//CARGA DE LA TABLA
cargaTabla();
async function cargaTabla(){
    try {
        aviso.innerHTML = "Cargando tabla..";
        let answer = await fetch(url);
        let json = await answer.json();
        if (json.length > 0) {
            containerTabla.innerHTML = "";
            for (let i = 0; i < json.length; i++) {
                imprimirTabla(json[i]);
            }
            aviso.innerHTML = "Se cargo con exito!";
        } else {
            aviso.innerHTML = "La Tabla esta vacia";
        }
    } catch (error) {
    }
}

function imprimirTabla (pedido) {
   //TBODY="CONTAINERTABLA"
    let tRow = containerTabla.insertRow(0);
    tRow.id = pedido.id

     //CELDAS = INPUTS DEL FORMULARIO
     let tCell1 = tRow.insertCell(0),
     tCell2 = tRow.insertCell(1),
     tCell3 = tRow.insertCell(2),
     tCell4 = tRow.insertCell(3),
     tCell5 = tRow.insertCell(4),
     tCell6 = tRow.insertCell(5),
     tCell7 = tRow.insertCell(6),
     tCell8 = tRow.insertCell(7);

    //RELLENO CELDAS CON INPUTS 
    tCell1.innerHTML = pedido.cliente;
    tCell2.innerHTML = pedido.diaselect;
    tCell3.innerHTML = pedido.menuselect;
    tCell4.innerHTML = pedido.postreselect;
    tCell5.innerHTML = pedido.panselect;
    tCell6.innerHTML = pedido.salselect;

    //BOTON BORRAR FILA
    let botonBorrar = document.createElement('button');
    botonBorrar.innerText = 'Borrar';
        botonBorrar.dataset.id = pedido.id;
        botonBorrar.id = "btnBorrar";
        botonBorrar.addEventListener("click", async function () {
            try {
                aviso.innerHTML = "Borrando...";
                let idinicial = botonBorrar.dataset.id;
                let urlDelete = url + idinicial;
                let answer = await fetch(urlDelete, {
                    "method": "DELETE"
                });
                let json = await answer.json();
                aviso.innerHTML = "Se borro con exito";
                let filaBorrar = document.getElementById(idinicial);
                filaBorrar.parentElement.removeChild(filaBorrar);
                cargaTabla();
            } catch (e) {
                aviso.innerHTML = "Fallo el borrado";
            };

        });
    tCell7.appendChild(botonBorrar);

    //BOTON PARA EDITAR
    let btnEditar = document.createElement('button');
    btnEditar.innerText = 'Editar';
    btnEditar.dataset.id = pedido.id;
    btnEditar.id = "btnEditar";
    btnEditar.addEventListener("click",async function () {
        try {
            //VUELVO A CARGAR VARIABLES PARA EDITAR 
            aviso.innerHTML = "Editando...";
            let cliente = document.querySelector("#clientes").value;
            let diaselect = document.querySelector("#diaselect").value;
            let menuselect = document.querySelector("#menuselect").value;
            let postreselect = document.querySelector("#postreselect").value;
            let panselect = document.querySelector("#panselect").value;
            let salselect = document.querySelector("#salselect").value;
            let pedidos = {
                'cliente': cliente,
                'diaselect': diaselect,
                'menuselect': menuselect,
                'postreselect': postreselect,
                'panselect': panselect,
                'salselect': salselect
            }

            let idinicial = btnEditar.dataset.id;
            let urlEditar = url + idinicial;
            console.log(idinicial);
            let answer = await fetch(urlEditar, {
                "method": "PUT",
                'headers': {
                    'Content-Type': 'application/json'
                },
                "body": JSON.stringify(pedidos)
            });
            let json = await answer.json();
            aviso.innerHTML = "Se edito con exito";
            cargaTabla();
        } catch (e) {
            aviso.innerHTML = "Fallo el editado";
        };
    });
    tCell8.appendChild(btnEditar);
}

//BOTON AGREGAR POR 3 
async function agregarx3(e){ 
    e.preventDefault()
    for (let i = 0; i < 3; i++) {
        enviarForm(e);
    }
} 

//FUNCION PARA FILTRAR LOS MENU ELEGIDOS 
btnFiltrar.addEventListener('click', () =>{
    let filtroIngresado = document.getElementById('buscador').value;
    filtrarDato(filtroIngresado);
})

async function filtrarDato(input){
    try {
        aviso.innerHTML = "Cargando tabla..";
        let answer = await fetch(url);
        let json = await answer.json();
        if (json.length > 0) {
            containerTabla.innerHTML = "";
            for (let i = 0; i < json.length; i++) {
                if(input.toLowerCase() == json[i].menuselect.toLowerCase())
                    imprimirTabla(json[i]);
            }
            aviso.innerHTML = "Se cargo con exito!";
        } else {
            aviso.innerHTML = "La Tabla esta vacia";
        }
    }catch(error) {
    }
}