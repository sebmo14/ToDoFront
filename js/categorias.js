const API_URL = "https://proyectotodoapp-back.onrender.com/api";

async function loadCategorias() {
  const grid = document.getElementById("cat-grid");
  const empty = document.getElementById("empty");
  const spinner = document.getElementById("spinner");
  spinner.style.display = "flex";

  try {
    const res = await fetch(`${API_URL}/categorias`);
    const cats = await res.json();
    spinner.style.display = "none";

    if (cats.length === 0) {
      empty.style.display = "block";
      grid.style.display = "none";
      return;
    }

    empty.style.display = "none";
    grid.style.display = "grid";
    grid.innerHTML = cats
      .map(
        (c) => `
      <div class="cat-card">
        <div class="cat-color" style="background:${c.color}"></div>
        <span class="cat-name">${escapeHtml(c.nombre)}</span>
        <button class="btn btn-danger btn-sm" onclick="deleteCategoria(${c.id})">🗑️</button>
      </div>
    `
      )
      .join("");
  } catch (err) {
    spinner.innerHTML = "<p style='color:var(--danger)'>Error al cargar categorías</p>";
  }
}

document.getElementById("btn-add-cat").addEventListener("click", async () => {
  const nombre = document.getElementById("cat-nombre").value.trim();
  const color = document.getElementById("cat-color").value;
  if (!nombre) return alert("Escribe un nombre");

  try {
    await fetch(`${API_URL}/categorias`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, color }),
    });
    document.getElementById("cat-nombre").value = "";
    loadCategorias();
  } catch (err) {
    alert("Error al crear categoría");
  }
});

async function deleteCategoria(id) {
  if (!confirm("¿Eliminar esta categoría?")) return;
  await fetch(`${API_URL}/categorias/${id}`, { method: "DELETE" });
  loadCategorias();
}

function escapeHtml(text) {
  const d = document.createElement("div");
  d.textContent = text || "";
  return d.innerHTML;
}

loadCategorias();
