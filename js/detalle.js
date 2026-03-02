const API_URL = "/api";
const id = new URLSearchParams(window.location.search).get("id");

async function loadDetalle() {
    const spinner = document.getElementById("spinner");
    const detail = document.getElementById("detail");

    try {
        const res = await fetch(`${API_URL}/tareas/${id}`);
        if (!res.ok) {
            spinner.innerHTML = "<p style='color:var(--danger)'>Tarea no encontrada</p>";
            return;
        }
        const t = await res.json();
        spinner.style.display = "none";
        detail.style.display = "block";

        document.getElementById("titulo").textContent = t.titulo;
        document.getElementById("descripcion").textContent = t.descripcion || "Sin descripción";
        document.getElementById("estado").textContent = t.completada ? "✅ Completada" : "⏳ Pendiente";
        document.getElementById("prioridad").innerHTML = `<span class="badge badge-${t.prioridad}">${t.prioridad}</span>`;
        document.getElementById("categoria").textContent = t.categoria || "General";
        document.getElementById("creada").textContent = new Date(t.createdAt).toLocaleString("es-CO");
        document.getElementById("btn-editar").href = `editar.html?id=${t.id}`;
    } catch (err) {
        spinner.innerHTML = "<p style='color:var(--danger)'>Error al cargar la tarea</p>";
    }
}

document.getElementById("btn-eliminar").addEventListener("click", async () => {
    if (!confirm("¿Eliminar esta tarea?")) return;
    await fetch(`${API_URL}/tareas/${id}`, { method: "DELETE" });
    location.href = "tareas.html";
});

loadDetalle();
