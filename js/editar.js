const API_URL = "/api";
const id = new URLSearchParams(window.location.search).get("id");

async function loadTarea() {
    const spinner = document.getElementById("spinner");
    const wrapper = document.getElementById("form-wrapper");

    try {
        const res = await fetch(`${API_URL}/tareas/${id}`);
        if (!res.ok) {
            spinner.innerHTML = "<p style='color:var(--danger)'>Tarea no encontrada</p>";
            return;
        }
        const t = await res.json();
        spinner.style.display = "none";
        wrapper.style.display = "block";

        document.getElementById("titulo").value = t.titulo;
        document.getElementById("descripcion").value = t.descripcion || "";
        document.getElementById("prioridad").value = t.prioridad;
        document.getElementById("categoria").value = t.categoria || "";
        document.getElementById("completada").value = String(t.completada);
    } catch (err) {
        spinner.innerHTML = "<p style='color:var(--danger)'>Error al cargar la tarea</p>";
    }
}

document.getElementById("form-editar").addEventListener("submit", async (e) => {
    e.preventDefault();

    const body = {
        titulo: document.getElementById("titulo").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        prioridad: document.getElementById("prioridad").value,
        categoria: document.getElementById("categoria").value.trim() || "General",
        completada: document.getElementById("completada").value === "true",
    };

    try {
        const res = await fetch(`${API_URL}/tareas/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });

        if (res.ok) {
            location.href = "tareas.html";
        } else {
            alert("Error al actualizar la tarea");
        }
    } catch (err) {
        alert("Error de conexión");
    }
});

loadTarea();
