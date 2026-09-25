// SecureNet — script.js
// Guillén & Cedeño — Ingeniería Web, UTP

document.addEventListener("DOMContentLoaded", () => {
  /* ---------- Menú móvil ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("open");
      const expanded = nav.classList.contains("open");
      toggle.setAttribute("aria-expanded", expanded);
    });
  }

  /* ---------- Formulario de contacto ---------- */
  const form = document.getElementById("contactForm");
  if (!form) return;

  const status = document.getElementById("formStatus");
  const DB_KEY = "securenet_contactos"; // "archivo de datos" del cliente (localStorage)

  const rules = {
    nombre: {
      test: (v) => v.trim().length >= 3,
      msg: "Ingresa un nombre de al menos 3 caracteres.",
    },
    empresa: {
      test: (v) => v.trim().length >= 2,
      msg: "Ingresa el nombre de tu empresa.",
    },
    email: {
      test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      msg: "Ingresa un correo electrónico válido.",
    },
    telefono: {
      test: (v) => /^[0-9+\-\s]{7,15}$/.test(v.trim()),
      msg: "Ingresa un teléfono válido (7 a 15 dígitos).",
    },
    empleados: {
      test: (v) => v !== "",
      msg: "Selecciona el tamaño de tu empresa.",
    },
    mensaje: {
      test: (v) => v.trim().length >= 15,
      msg: "Cuéntanos un poco más (mínimo 15 caracteres).",
    },
  };

  function fieldWrap(input) {
    return input.closest(".field");
  }

  function showError(input, message) {
    const wrap = fieldWrap(input);
    wrap.classList.add("invalid");
    const err = wrap.querySelector(".error-msg");
    if (err) err.textContent = message;
  }

  function clearError(input) {
    const wrap = fieldWrap(input);
    wrap.classList.remove("invalid");
    const err = wrap.querySelector(".error-msg");
    if (err) err.textContent = "";
  }

  function validateField(input) {
    const rule = rules[input.name];
    if (!rule) return true;
    const valid = rule.test(input.value);
    if (!valid) {
      showError(input, rule.msg);
    } else {
      clearError(input);
    }
    return valid;
  }

  // Validación en vivo
  Object.keys(rules).forEach((name) => {
    const input = form.elements[name];
    if (!input) return;
    input.addEventListener("blur", () => validateField(input));
    input.addEventListener("input", () => {
      if (fieldWrap(input).classList.contains("invalid")) validateField(input);
    });
  });

  function saveSubmission(data) {
    const current = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
    current.push({ ...data, fecha: new Date().toISOString() });
    localStorage.setItem(DB_KEY, JSON.stringify(current));
    return current;
  }

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let allValid = true;
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      if (!input) return;
      if (!validateField(input)) allValid = false;
    });

    if (!allValid) {
      status.textContent = "Revisa los campos marcados en rojo antes de enviar.";
      status.className = "form-status show bad";
      return;
    }

    const data = {
      nombre: form.nombre.value.trim(),
      empresa: form.empresa.value.trim(),
      email: form.email.value.trim(),
      telefono: form.telefono.value.trim(),
      empleados: form.empleados.value,
      mensaje: form.mensaje.value.trim(),
    };

    saveSubmission(data);

    status.textContent = "¡Gracias, " + data.nombre.split(" ")[0] + "! Recibimos tu solicitud y te contactaremos en menos de 24 horas.";
    status.className = "form-status show ok";
    form.reset();
    Object.keys(rules).forEach((name) => {
      const input = form.elements[name];
      if (input) clearError(input);
    });
    renderSubmissions();
  });

  /* ---------- Vista previa de "base de datos" local + exportar JSON ---------- */
  const tableBody = document.querySelector("#subsTable tbody");
  const emptyMsg = document.getElementById("subsEmpty");

  function renderSubmissions() {
    if (!tableBody) return;
    const rows = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
    tableBody.innerHTML = "";
    if (rows.length === 0) {
      if (emptyMsg) emptyMsg.style.display = "block";
      return;
    }
    if (emptyMsg) emptyMsg.style.display = "none";
    rows.slice().reverse().forEach((r) => {
      const tr = document.createElement("tr");
      tr.innerHTML = `<td>${new Date(r.fecha).toLocaleString("es-PA")}</td>
        <td>${r.nombre}</td><td>${r.empresa}</td><td>${r.email}</td>
        <td>${r.telefono}</td><td>${r.empleados}</td>`;
      tableBody.appendChild(tr);
    });
  }
  renderSubmissions();

  const exportBtn = document.getElementById("exportData");
  if (exportBtn) {
    exportBtn.addEventListener("click", () => {
      const rows = JSON.parse(localStorage.getItem(DB_KEY) || "[]");
      const blob = new Blob([JSON.stringify(rows, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "contactos_securenet.json";
      a.click();
      URL.revokeObjectURL(url);
    });
  }
});
