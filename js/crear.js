const API_URL = "/api";

async function loadCategorias() {
  try {
    const res = await fetch(`${API_URL}/categorias`);
    const categorias = await res.json();
    const select = document.getElementById("categoriaId");
    
    if (categorias.length === 0) {
      select.innerHTML = '<option value="">No hay categorías (crea una primero)</option>';
      select.disabled = true;
      return;
    }

    select.innerHTML = categorias
      .map((c) => `<option value="${c.id}">${c.nombre}</option>`)
      .join("");
  } catch (err) {
    document.getElementById("categoriaId").innerHTML = '<option value="">Error al cargar categorías</option>';
  }
}

document.addEventListener("DOMContentLoaded", loadCategorias);

document.getElementById("form-crear").addEventListener("submit", async (e) => {
  e.preventDefault();

  const body = {
    titulo: document.getElementById("titulo").value.trim(),
    descripcion: document.getElementById("descripcion").value.trim(),
    prioridad: document.getElementById("prioridad").value,
    categoriaId: parseInt(document.getElementById("categoriaId").value),
  };

  if (isNaN(body.categoriaId)) {
    alert("Dedes seleccionar una categoría válida.");
    return;
  }

  try {
    const res = await fetch(`${API_URL}/tareas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      location.href = "tareas.html";
    } else {
      alert("Error al crear la tarea");
    }
  } catch (err) {
    alert("Error de conexión");
  }
});
