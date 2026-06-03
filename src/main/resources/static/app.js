// ============================================
// Configuración
// ============================================
const EMPRESAS_API_URL = 'http://localhost:9090/api/v1/empresas';
const EMPLEADOS_API_URL = 'http://localhost:9090/api/v1/empleados';

// ============================================
// Referencias DOM
// ============================================
const form = document.getElementById('empresaForm');
const submitBtn = document.getElementById('submitBtn');
const clearBtn = document.getElementById('clearBtn');
const refreshBtn = document.getElementById('refreshBtn');
const tableContainer = document.getElementById('tableContainer');
const empleadoForm = document.getElementById('empleadoForm');
const submitEmpleadoBtn = document.getElementById('submitEmpleadoBtn');
const clearEmpleadoBtn = document.getElementById('clearEmpleadoBtn');
const refreshEmpleadosBtn = document.getElementById('refreshEmpleadosBtn');
const empleadosContainer = document.getElementById('empleadosContainer');
const empresaIdSelect = document.getElementById('empresaId');
const empleadoNombreInput = document.getElementById('empleadoNombre');
const cargoInput = document.getElementById('cargo');
const correoInput = document.getElementById('correo');
const statusIndicator = document.getElementById('statusIndicator');
const statusText = document.getElementById('statusText');

// ============================================
// Utilidades de UI
// ============================================
function setStatus(state, text) {
  statusIndicator.className = `status-indicator ${state}`;
  statusText.textContent = text;
}

function renderEmpresas(empresas) {
  if (!empresas || empresas.length === 0) {
    tableContainer.innerHTML = `
      <div class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <rect x="2" y="7" width="20" height="14" rx="2"/>
          <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
        </svg>
        <p>No hay empresas registradas todavía.</p>
        <p style="font-size: 0.8125rem; margin-top: 0.25rem;">Usa el formulario para registrar la primera.</p>
      </div>
    `;
    return;
  }

  const rows = empresas.map(e => `
    <tr>
      <td class="cell-id">#${e.id}</td>
      <td>
        <div class="cell-name">
          <div class="name-icon">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="2" y="7" width="20" height="14" rx="2"/>
              <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
            </svg>
          </div>
          <span class="name-text">${escapeHtml(e.nombre)}</span>
        </div>
      </td>
      <td>${escapeHtml(e.nit)}</td>
      <td>${escapeHtml(e.ciudad)}</td>
      <td>${escapeHtml(e.sector)}</td>
      <td>
        <button class="btn btn-danger" onclick="eliminarEmpresa(${e.id})" title="Eliminar">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </td>
    </tr>
  `).join('');

  tableContainer.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>NIT</th>
            <th>CIUDAD</th>
            <th>SECTOR</th>
            <th>ACCIONES</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// ============================================
// API Calls
// ============================================
async function listarEmpresas() {
  try {
    tableContainer.innerHTML = '<div class="loading-state">Cargando empresas...</div>';
    const res = await fetch(EMPRESAS_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    setStatus('connected', 'Backend conectado');
    const empresas = json.data || [];
    renderEmpresas(empresas);
    renderEmpresaSelect(empresas);
  } catch (err) {
    console.error('Error al cargar empresas:', err);
    tableContainer.innerHTML = '<div class="empty-state">No hay datos para mostrar.</div>';
  }
}

async function crearEmpresa(empresa) {
  submitBtn.disabled = true;
  submitBtn.innerHTML = 'Guardando...';
  try {
    const res = await fetch(EMPRESAS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empresa)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    form.reset();
    await listarEmpresas();
    await listarEmpleados();
  } catch (err) {
    console.error('Error al crear empresa:', err);
  } finally {
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/>
        <line x1="5" y1="12" x2="19" y2="12"/>
      </svg>
      Registrar empresa
    `;
  }
}

async function eliminarEmpresa(id) {
  if (!confirm(`¿Eliminar la empresa #${id}? Esta acción no se puede deshacer.`)) return;
  try {
    const res = await fetch(`${EMPRESAS_API_URL}/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await listarEmpresas();
    await listarEmpleados();
  } catch (err) {
    console.error('Error al eliminar empresa:', err);
  }
}

function renderEmpresaSelect(empresas) {
  const currentValue = empresaIdSelect.value;
  empresaIdSelect.innerHTML = '<option value="">Seleccione una empresa</option>';
  empresas.forEach((empresa) => {
    const option = document.createElement('option');
    option.value = empresa.id;
    option.textContent = `${empresa.nombre} (#${empresa.id})`;
    empresaIdSelect.appendChild(option);
  });
  if (currentValue) {
    empresaIdSelect.value = currentValue;
  }
}

function renderEmpleados(empleados) {
  if (!empleados || empleados.length === 0) {
    empleadosContainer.innerHTML = '<div class="empty-state">No hay empleados registrados todavía.</div>';
    return;
  }

  const rows = empleados.map((empleado) => `
    <tr>
      <td class="cell-id">#${empleado.id}</td>
      <td>${escapeHtml(empleado.nombre)}</td>
      <td>${escapeHtml(empleado.cargo)}</td>
      <td>${escapeHtml(empleado.correo)}</td>
      <td class="cell-id">#${empleado.empresaId ?? ''}</td>
    </tr>
  `).join('');

  empleadosContainer.innerHTML = `
    <div class="table-container">
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NOMBRE</th>
            <th>CARGO</th>
            <th>CORREO</th>
            <th>EMPRESA ID</th>
          </tr>
        </thead>
        <tbody>${rows}</tbody>
      </table>
    </div>
  `;
}

async function listarEmpleados() {
  try {
    empleadosContainer.innerHTML = '<div class="loading-state">Cargando empleados...</div>';
    const res = await fetch(EMPLEADOS_API_URL);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const json = await res.json();
    renderEmpleados(json.data || []);
  } catch (err) {
    console.error('Error al cargar empleados:', err);
    empleadosContainer.innerHTML = '<div class="empty-state">No hay datos para mostrar.</div>';
  }
}

async function crearEmpleado(empleado) {
  submitEmpleadoBtn.disabled = true;
  submitEmpleadoBtn.innerHTML = 'Guardando...';
  try {
    const res = await fetch(EMPLEADOS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empleado)
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.message || `HTTP ${res.status}`);
    }
    empleadoForm.reset();
    await listarEmpleados();
  } catch (err) {
    console.error('Error al crear empleado:', err);
  } finally {
    submitEmpleadoBtn.disabled = false;
    submitEmpleadoBtn.textContent = 'Crear empleado';
  }
}

// ============================================
// Event Listeners
// ============================================
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const empresa = {
    nombre: document.getElementById('nombre').value.trim(),
    nit: document.getElementById('nit').value.trim(),
    ciudad: document.getElementById('ciudad').value.trim(),
    sector: document.getElementById('sector').value.trim()
  };
  if (!empresa.nombre || !empresa.nit || !empresa.ciudad || !empresa.sector) {
    return;
  }
  crearEmpresa(empresa);
});

empleadoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const empleado = {
    empresaId: Number(empresaIdSelect.value),
    nombre: empleadoNombreInput.value.trim(),
    cargo: cargoInput.value.trim(),
    correo: correoInput.value.trim()
  };

  if (!empleado.empresaId || !empleado.nombre || !empleado.cargo || !empleado.correo) {
    return;
  }

  crearEmpleado(empleado);
});

clearBtn.addEventListener('click', () => form.reset());
clearEmpleadoBtn.addEventListener('click', () => empleadoForm.reset());
refreshBtn.addEventListener('click', listarEmpresas);
refreshEmpleadosBtn.addEventListener('click', listarEmpleados);

// ============================================
// Init
// ============================================
listarEmpresas();
listarEmpleados();
