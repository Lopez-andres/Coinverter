// Tu API Key de CurrencyAPI.com
const API_KEY = 'cur_live_SEr5XmBT1mirt4K2R3GDGBTO1BhofQVp6tTSqmcM';

// Mostrar historial al cargar la página
window.addEventListener('load', mostrarHistorial);

// Detecta el click del botón convertir
document.getElementById("convertir").addEventListener("click", function() {
    
    // Obtenemos los valores de los inputs
    const cantidad = document.getElementById("moneda").value;
    const origen = document.getElementById("origen").value;
    const destino = document.getElementById("destino").value;
    const resultElement = document.getElementById("result");
    
    // Validaciones
    if(!cantidad || cantidad <= 0){
        resultElement.textContent = "Por favor ingrese una cantidad válida.";
        return;
    }

    if(origen === destino){
        resultElement.textContent = "Por favor seleccione monedas diferentes.";
        return;
    }

    // URL de CurrencyAPI.com
    const url = `https://api.currencyapi.com/v3/latest?apikey=${API_KEY}&base_currency=${origen}&currencies=${destino}`;

    // Mostrar mensaje de carga
    resultElement.innerHTML = `
    <div class="skeleton-wrapper">
        <div class="skeleton-line skeleton-line-short"></div>
        <div class="skeleton-line skeleton-line-long"></div>
    </div>`;

    // Consumir la API con fetch
    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la respuesta de la API');
            }
            return response.json();
        })
        .then(data => {
            // Obtenemos la tasa de cambio de la moneda destino
            const tasa = data.data[destino].value;
            
            // Calculamos la conversión
            const resultado = cantidad * tasa;
            
            // Mostrar resultado
            resultElement.textContent = `${cantidad} ${origen} = ${resultado.toFixed(2)} ${destino}`;
            
            // GUARDAR EN HISTORIAL
            guardarEnHistorial(cantidad, origen, resultado, destino);
        })
        .catch(error => {
            resultElement.textContent = "Error al obtener las tasas de cambio.";
            console.error("Error en la API: ", error);
        });
});

// Botón de intercambiar
document.getElementById("intercambiar").addEventListener("click", function() {
    const origen = document.getElementById("origen");
    const destino = document.getElementById("destino");
    
    // Intercambiar valores
    const temp = origen.value;
    origen.value = destino.value;
    destino.value = temp;
});

// ============================================
// FUNCIONES DEL HISTORIAL
// ============================================

function guardarEnHistorial(cantidad, origen, resultado, destino) {
    // Obtener historial actual (o array vacío si no existe)
    let historial = JSON.parse(localStorage.getItem('historial')) || [];
    
    // Crear objeto de conversión
    const conversion = {
        fecha: new Date().toLocaleString('es-CO', { 
            day: '2-digit', 
            month: '2-digit', 
            hour: '2-digit', 
            minute: '2-digit' 
        }),
        texto: `${cantidad} ${origen} = ${resultado.toFixed(2)} ${destino}`
    };
    
    // Agregar al inicio del array (más reciente primero)
    historial.unshift(conversion);
    
    // Mantener solo las últimas 5 conversiones
    if (historial.length > 5) {
        historial = historial.slice(0, 5);
    }
    
    // Guardar en localStorage
    localStorage.setItem('historial', JSON.stringify(historial));
    
    // Actualizar la vista
    mostrarHistorial();
}

function mostrarHistorial() {
    const historial = JSON.parse(localStorage.getItem('historial')) || [];
    const historialDiv = document.getElementById('historial');
    
    if (historial.length === 0) {
        historialDiv.innerHTML = '';
        return;
    }
    
    let html = '<div class="historial-container"><h3>📊 Conversiones Recientes:</h3><ul>';
    
    historial.forEach(item => {
        html += `<li><span class="hora">🕐 ${item.fecha}</span> ${item.texto}</li>`;
    });
    
    html += '</ul><button id="limpiarHistorial">Limpiar historial</button></div>';
    
    historialDiv.innerHTML = html;
    
    // Event listener para limpiar
    document.getElementById('limpiarHistorial').addEventListener('click', function() {
        localStorage.removeItem('historial');
        mostrarHistorial();
    });
}

// ============================================
// FUNCIÓN SKELETON LOADER
// ============================================

function mostrarSkeletonLoader(element) {
    element.className = "result result-loading";
    element.innerHTML = `
        <div class="skeleton-wrapper">
            <div class="skeleton-line skeleton-line-short"></div>
            <div class="skeleton-line skeleton-line-long"></div>
        </div>
    `;
}