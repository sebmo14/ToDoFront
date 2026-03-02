const API_URL = "/api";
let allTareas = [];

async function loadFilterCategorias() {
    try {
        const res = await fetch(`${API_URL}/categorias`);
        const categorias = await res.json();
        const select = document.getElementById("filter-categoria");
        categorias.forEach((c) => {
            select.innerHTML += `<option value="${c.id}">${c.nombre}</option>`;
        });
        select.addEventListener("change", renderTareas);
    } catch (err) {
        console.error("Error al cargar categorías para el filtro");
    }
}

async function loadTareas() {
    const spinner = document.getElementById("spinner");
    const list = document.getElementById("task-list");
    const empty = document.getElementById("empty");

    try {
        const res = await fetch(`${API_URL}/tareas`);
        allTareas = await res.json();
        spinner.style.display = "none";

        renderTareas();
    } catch (err) {
        spinner.innerHTML = "<p style='color:var(--danger)'>Error al cargar tareas</p>";
    }
}

function renderTareas() {
    const list = document.getElementById("task-list");
    const empty = document.getElementById("empty");
    const filterId = document.getElementById("filter-categoria").value;

    const filteredTareas = filterId
        ? allTareas.filter(t => t.categoriaId === parseInt(filterId))
        : allTareas;

    if (filteredTareas.length === 0) {
        empty.style.display = "block";
        return;
    }

    empty.style.display = "none";
    list.style.display = "flex";
    list.innerHTML = filteredTareas
        .map(
            (t) => `
      <div class="task-card ${t.completada ? "completada" : ""}" onclick="location.href='detalle.html?id=${t.id}'">
        <div class="check" onclick="event.stopPropagation(); toggleComplete(${t.id}, ${!t.completada})"></div>
        <div class="task-info">
          <h3>${escapeHtml(t.titulo)}</h3>
          <div class="task-meta">
            <span class="badge badge-${t.prioridad}">${t.prioridad}</span>
            <span style="color: ${t.categoriaRel?.color || '#000'}; font-weight: bold;">
              📁 ${escapeHtml(t.categoriaRel?.nombre || 'Sin Categoría')}
            </span>
          </div>
        </div>
        <div class="task-actions">
          <a href="editar.html?id=${t.id}" class="btn btn-secondary btn-sm" onclick="event.stopPropagation()">✏️</a>
          <button class="btn btn-danger btn-sm" onclick="event.stopPropagation(); deleteTarea(${t.id})">🗑️</button>
        </div>
      </div>
    `
        )
        .join("");
}

document.addEventListener("DOMContentLoaded", () => {
    loadFilterCategorias();
    loadTareas();
});

async function toggleComplete(id, completada) {
    await fetch(`${API_URL}/tareas/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completada }),
    });
    loadTareas();
}

async function deleteTarea(id) {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await fetch(`${API_URL}/tareas/${id}`, { method: "DELETE" });
    loadTareas();
}

function escapeHtml(text) {
    const d = document.createElement("div");
    d.textContent = text || "";
    return d.innerHTML;
}
