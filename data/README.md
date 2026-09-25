# Datos del formulario de contacto

El formulario de `contacto.html` valida 6 campos (nombre, empresa, correo, teléfono, tamaño de empresa y mensaje) y guarda cada envío como un registro en el `localStorage` del navegador (clave `securenet_contactos`), ya que el sitio se aloja en un hosting estático gratuito sin backend.

Desde el propio panel de "Solicitudes recibidas" en la página de contacto se puede:
- Ver todos los envíos guardados en una tabla.
- Exportarlos como archivo de datos real (`contactos_securenet.json`) con el botón **Exportar datos (.json)**.

Un ejemplo del archivo exportado se incluye aquí como referencia: `contactos_ejemplo.json`.
