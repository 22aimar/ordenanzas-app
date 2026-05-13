// No necesitamos import con la versión Compat, usamos el objeto global `firebase`

// Configuración de Firebase enviada por el usuario
const firebaseConfig = {
  apiKey: "AIzaSyCyY4Iqyb2QDkxXraKpVxjwlcQYcxYx0e8",
  authDomain: "proyectos-de-ordenanzas-hcd.firebaseapp.com",
  projectId: "proyectos-de-ordenanzas-hcd",
  storageBucket: "proyectos-de-ordenanzas-hcd.firebasestorage.app",
  messagingSenderId: "866089806124",
  appId: "1:866089806124:web:e5ee1b6a5384480ca3e489",
  measurementId: "G-H5PKY3F0BS"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Variables Globales
let currentProjects = [];
let currentUser = null;
let statusChartInstance = null;
let quill = null;

// Inicializar Quill
function initQuill() {
    if (quill) return;
    const toolbarOptions = [
        ['bold', 'italic', 'underline'],
        [{ 'list': 'ordered'}, { 'list': 'bullet' }],
        ['clean']
    ];
    quill = new Quill('#editor-container', {
        modules: { toolbar: toolbarOptions },
        theme: 'snow',
        placeholder: 'Escribe aquí el proyecto integral...'
    });
}

// Helper para limpiar HTML para la tabla
function stripHtml(html) {
   const tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

// Helper para verificar Admin
function isAdmin(user) {
    if (!user) return false;
    const admins = ['luchog391@gmail.com', 'admin@hcd.gob.ar'];
    return admins.includes(user.email);
}

// Elementos DOM
const loginContainer = document.getElementById('login-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('loginForm');
const loginEmail = document.getElementById('loginEmail');
const loginPassword = document.getElementById('loginPassword');
const loginError = document.getElementById('loginError');
const currentUserEmail = document.getElementById('currentUserEmail');
const btnLogout = document.getElementById('btnLogout');

const tbody = document.getElementById('projectsTableBody');
const searchInput = document.getElementById('searchInput');
const filterStatus = document.getElementById('filterStatus');
const filterPriority = document.getElementById('filterPriority');

const elTotal = document.getElementById('totalProjects');
const elApproved = document.getElementById('approvedProjects');
const elDelayed = document.getElementById('delayedProjects');

const projectForm = document.getElementById('projectForm');
const projectModal = document.getElementById('projectModal');
const modalTitle = document.getElementById('modalTitle');

// --- AUTENTICACIÓN ---

// Escuchar cambios en la sesión
auth.onAuthStateChanged((user) => {
    if (user) {
        currentUser = user;
        loginContainer.style.display = 'none';
        appContainer.style.display = 'flex';
        currentUserEmail.textContent = user.email;
        
        // Mostrar botón de Importación Masiva solo para admin
        const btnImportExcel = document.getElementById('btnImportExcel');
        if(btnImportExcel) {
            btnImportExcel.style.display = isAdmin(user) ? 'inline-flex' : 'none';
        }

        loadProjectsFromFirestore();
    } else {
        currentUser = null;
        loginContainer.style.display = 'flex';
        appContainer.style.display = 'none';
        currentProjects = [];
        renderTable(currentProjects);
    }
});

// Enviar formulario de Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = loginEmail.value;
    const password = loginPassword.value;
    loginError.style.display = 'none';

    auth.signInWithEmailAndPassword(email, password)
        .catch((error) => {
            console.error("Error de login", error);
            loginError.style.display = 'block';
            loginError.textContent = "Credenciales incorrectas o usuario no registrado.";
        });
});

// Botón de cerrar sesión
btnLogout.addEventListener('click', () => {
    auth.signOut();
});

// --- LOGICA DE FIRESTORE ---

// Cargar proyectos en tiempo real
function loadProjectsFromFirestore() {
    db.collection("projects").onSnapshot((snapshot) => {
        const projects = [];
        snapshot.forEach((doc) => {
            const data = doc.data();
            projects.push({
                docId: doc.id,
                id: data.id || "",
                title: data.title || "",
                resumen: data.resumen || "",
                referente: data.referente || "",
                area: data.area || "",
                comision: data.comision || "",
                prioridad: data.prioridad || "Media",
                autor: data.autor || "",
                estado: data.estado || "Ingresado",
                fechaIngreso: data.fechaIngreso && data.fechaIngreso.toDate ? data.fechaIngreso.toDate() : new Date(),
                ownerEmail: data.ownerEmail || ""
            });
        });
        currentProjects = projects;
        filterProjects();
    }, (error) => {
        console.error("Error cargando proyectos: ", error);
        if (error.code === 'permission-denied') {
            alert("No tienes permiso para ver los proyectos. Verifica las reglas de Firestore.");
        }
    });
}

// Funciones para el HTML
function openNewProjectModal() {
    initQuill();
    modalTitle.textContent = "Cargar Nuevo Proyecto";
    projectForm.reset();
    if (quill) quill.setContents([]);
    document.getElementById('projectId').value = "";
    
    const dropZonePrompt = document.querySelector("#fileDropZone .drop-zone__prompt");
    if (dropZonePrompt) dropZonePrompt.innerHTML = "Arrastra y suelta el archivo aquí o haz clic para subir";
    
    projectModal.style.display = 'flex';
}
window.openNewProjectModal = openNewProjectModal;

function closeModal() {
    projectModal.style.display = 'none';
}
window.closeModal = closeModal;

function editProject(docId) {
    initQuill();
    const p = currentProjects.find(proj => proj.docId === docId);
    if (!p) return;
    
    // VERIFICACIÓN: Solo el dueño o el admin pueden editar
    if (p.ownerEmail !== currentUser.email && !isAdmin(currentUser)) {
        alert("Acceso denegado: Solo puedes editar los proyectos que tú hayas creado.");
        return;
    }

    modalTitle.textContent = "Editar Proyecto";
    document.getElementById('projectId').value = p.docId;
    document.getElementById('projId').value = p.id;
    document.getElementById('projTitle').value = p.title;
    document.getElementById('projReferente').value = p.referente;
    document.getElementById('projComision').value = p.comision;
    document.getElementById('projArea').value = p.area;
    document.getElementById('projEstado').value = p.estado;
    document.getElementById('projPrioridad').value = p.prioridad;

    if (quill) {
        quill.root.innerHTML = p.resumen || "";
    }

    const dropZonePrompt = document.querySelector("#fileDropZone .drop-zone__prompt");
    if (dropZonePrompt) dropZonePrompt.innerHTML = "Arrastra y suelta el archivo aquí o haz clic para subir";

    projectModal.style.display = 'flex';
}
window.editProject = editProject;

// Guardar o Actualizar un Proyecto
projectForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const docId = document.getElementById('projectId').value;
    const projectData = {
        id: document.getElementById('projId').value,
        title: document.getElementById('projTitle').value,
        resumen: quill ? quill.root.innerHTML : "",
        referente: document.getElementById('projReferente').value,
        comision: document.getElementById('projComision').value,
        area: document.getElementById('projArea').value,
        estado: document.getElementById('projEstado').value,
        prioridad: document.getElementById('projPrioridad').value,
    };

    try {
        if (docId) {
            // Actualizar existente
            await db.collection("projects").doc(docId).update(projectData);
        } else {
            // Crear Nuevo
            projectData.ownerEmail = currentUser.email;
            projectData.autor = currentUser.email.split('@')[0]; 
            projectData.fechaIngreso = firebase.firestore.FieldValue.serverTimestamp();
            await db.collection("projects").add(projectData);
        }
        closeModal();
    } catch (error) {
        console.error("Error guardando proyecto: ", error);
        alert("Hubo un error al guardar. Puede ser un problema de permisos.");
    }
});

// Importador Excel exclusivo para Admin
async function handleExcelUpload(e) {
    if (!isAdmin(currentUser)) {
        alert("Solo el Administrador puede hacer subidas masivas por Excel.");
        e.target.value = "";
        return;
    }
    
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async function(evt) {
        try {
            const data = new Uint8Array(evt.target.result);
            const workbook = XLSX.read(data, {type: 'array'});
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, {header: 1});
            
            let count = 0;
            for (let i = 4; i < json.length; i++) {
                const row = json[i];
                if (!row || row.length === 0 || !row[0]) continue;
                
                const pData = {
                    id: `EXP-2024-${String(i-3).padStart(3, '0')}`,
                    title: row[0] || 'Sin título',
                    referente: row[1] || 'Sin referente',
                    resumen: row[2] || '-',
                    area: row[3] || 'Sin área',
                    comision: row[4] || 'Sin comisión',
                    prioridad: row[5] ? row[5].trim() : 'Media',
                    autor: row[6] || 'Importación Masiva',
                    estado: 'Ingresado',
                    fechaIngreso: firebase.firestore.FieldValue.serverTimestamp(),
                    ownerEmail: currentUser.email
                };
                await db.collection("projects").add(pData);
                count++;
            }
            alert(`¡Éxito! Se importaron ${count} proyectos a la base de datos.`);
            e.target.value = "";
        } catch (error) {
            console.error(error);
            alert('Hubo un error procesando el Excel.');
        }
    };
    reader.readAsArrayBuffer(file);
}
window.handleExcelUpload = handleExcelUpload;

document.addEventListener('DOMContentLoaded', () => {
    const excelUpload = document.getElementById('excelUpload');
    if (excelUpload) {
        excelUpload.addEventListener('change', window.handleExcelUpload);
    }
    initTheme();

    // Dropzone setup
    const dropZoneElement = document.querySelector("#fileDropZone");
    const inputElement = document.querySelector("#projFile");

    if (dropZoneElement && inputElement) {
        dropZoneElement.addEventListener("click", (e) => {
            inputElement.click();
        });

        inputElement.addEventListener("change", (e) => {
            if (inputElement.files.length) {
                updateDropzoneFileList(dropZoneElement, inputElement.files[0]);
            }
        });

        dropZoneElement.addEventListener("dragover", (e) => {
            e.preventDefault();
            dropZoneElement.classList.add("drop-zone--over");
        });

        ["dragleave", "dragend"].forEach((type) => {
            dropZoneElement.addEventListener(type, (e) => {
                dropZoneElement.classList.remove("drop-zone--over");
            });
        });

        dropZoneElement.addEventListener("drop", (e) => {
            e.preventDefault();
            if (e.dataTransfer.files.length) {
                inputElement.files = e.dataTransfer.files;
                updateDropzoneFileList(dropZoneElement, e.dataTransfer.files[0]);
            }
            dropZoneElement.classList.remove("drop-zone--over");
        });
    }
});

function updateDropzoneFileList(dropZoneElement, file) {
    let promptElement = dropZoneElement.querySelector(".drop-zone__prompt");
    if (promptElement) {
        promptElement.innerHTML = `<strong>Archivo seleccionado:</strong> ${file.name}`;
    }
}

// --- FUNCIONES DE INTERFAZ Y RENDERIZADO ---

const MAX_DAYS_GREEN = 15;
const MAX_DAYS_YELLOW = 30;

function calculateDays(date) {
    if (!date) return 0;
    const diffTime = Math.abs(new Date() - date);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
}

function getSemaphoreClass(days, status) {
    if (status === 'Aprobado') return 'sema-green';
    if (days > MAX_DAYS_YELLOW) return 'sema-red';
    if (days > MAX_DAYS_GREEN) return 'sema-yellow';
    return 'sema-green';
}

function getPriorityBadge(priority) {
    const p = priority.toLowerCase();
    return `<span class="badge badge-${p}">${priority}</span>`;
}

function getStatusBadge(status) {
    const mapping = {
        'Ingresado': 'status-ingresado',
        'En Comisión': 'status-comision',
        'Despacho': 'status-despacho',
        'Para Votación': 'status-votacion',
        'Aprobado': 'status-aprobado'
    };
    return `<span class="badge ${mapping[status] || 'status-ingresado'}">${status}</span>`;
}

function renderTable(projects) {
    tbody.innerHTML = '';
    
    let activeCount = 0;
    let approvedCount = 0;
    let delayedCount = 0;

    projects.forEach(p => {
        const days = calculateDays(p.fechaIngreso);
        const semaClass = getSemaphoreClass(days, p.estado);
        
        if (p.estado !== 'Aprobado') activeCount++;
        if (p.estado === 'Aprobado') approvedCount++;
        if (p.estado !== 'Aprobado' && days > MAX_DAYS_YELLOW) delayedCount++;

        const tr = document.createElement('tr');
        
        const canEdit = (currentUser && (currentUser.email === p.ownerEmail || isAdmin(currentUser)));
        const editBtnHtml = canEdit ? `<button class="btn-icon" title="Editar" onclick="window.editProject('${p.docId}')"><i class="ri-edit-line"></i></button>` : '';

        tr.innerHTML = `
            <td style="text-align:center;">
                <div class="semaphore ${semaClass}" title="${days} días transcurridos"></div>
            </td>
            <td>
                <div class="project-title">${p.title} <span class="project-ref" style="font-size:0.8rem; color:#666;">(${p.id})</span></div>
                <div class="project-summary">${stripHtml(p.resumen).substring(0, 100)}${p.resumen.length > 100 ? '...' : ''}</div>
            </td>
            <td>
                <div class="project-referent">
                    <i class="ri-user-star-line"></i> ${p.referente}
                </div>
            </td>
            <td>${getPriorityBadge(p.prioridad)}</td>
            <td>${getStatusBadge(p.estado)}</td>
            <td>
                <div><b>${p.comision}</b></div>
                <div style="font-size:0.8rem; color:var(--text-muted)">${p.area}</div>
            </td>
            <td>
                <span class="days-counter ${semaClass === 'sema-red' ? 'danger' : (semaClass === 'sema-yellow' ? 'warning' : 'safe')}">
                    ${days} días
                </span>
            </td>
            <td>${p.autor}</td>
            <td>
                ${editBtnHtml}
            </td>
        `;
        tbody.appendChild(tr);
    });

    if (elTotal) elTotal.textContent = activeCount;
    if (elApproved) elApproved.textContent = approvedCount;
    if (elDelayed) elDelayed.textContent = delayedCount;
    
    renderRanking(projects);
}

function renderRanking(projects) {
    const rankingList = document.getElementById('rankingList');
    if(!rankingList) return;
    rankingList.innerHTML = '';

    const authorCounts = {};
    projects.forEach(p => {
        const autor = p.autor || 'Desconocido';
        authorCounts[autor] = (authorCounts[autor] || 0) + 1;
    });

    const sortedAuthors = Object.keys(authorCounts).map(autor => ({
        autor: autor,
        count: authorCounts[autor]
    })).sort((a, b) => b.count - a.count);

    const maxCount = sortedAuthors.length > 0 ? sortedAuthors[0].count : 1;

    sortedAuthors.forEach((item, index) => {
        const position = index + 1;
        let rankClass = '';
        if (position === 1) rankClass = 'gold';
        if (position === 2) rankClass = 'silver';
        if (position === 3) rankClass = 'bronze';

        const percentage = (item.count / maxCount) * 100;

        const div = document.createElement('div');
        div.className = 'ranking-item';
        div.innerHTML = `
            <div class="rank-position ${rankClass}">${position}</div>
            <div class="rank-details">
                <div class="rank-name">${item.autor}</div>
                <div class="rank-bar-container">
                    <div class="rank-bar" style="width: ${percentage}%"></div>
                </div>
                <div class="rank-count">${item.count} proyecto(s) presentados</div>
            </div>
        `;
        rankingList.appendChild(div);
    });
}

function filterProjects() {
    const term = searchInput.value.toLowerCase();
    const status = filterStatus.value;
    const priority = filterPriority.value;

    const filtered = currentProjects.filter(p => {
        const matchSearch = p.title.toLowerCase().includes(term) || 
                            p.autor.toLowerCase().includes(term) || 
                            p.id.toLowerCase().includes(term);
        const matchStatus = status === 'all' || p.estado === status;
        const matchPriority = priority === 'all' || p.prioridad === priority;

        return matchSearch && matchStatus && matchPriority;
    });

    renderTable(filtered);
}

// --- MODO OSCURO ---
function initTheme() {
    const themeBtn = document.getElementById('theme-toggle');
    if (!themeBtn) return;

    // Cargar preferencia
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '<i class="ri-sun-line"></i> <span>Modo Claro</span>';
    }

    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        themeBtn.innerHTML = isDark 
            ? '<i class="ri-sun-line"></i> <span>Modo Claro</span>' 
            : '<i class="ri-moon-line"></i> <span>Modo Oscuro</span>';
    });
}

// --- NUEVAS FUNCIONALIDADES (GRAFICOS Y PDF) ---

function updateStatusChart(projects) {
    const ctx = document.getElementById('statusChart');
    if (!ctx) return;

    const counts = {
        'Ingresado': 0,
        'En Comisión': 0,
        'Despacho': 0,
        'Para Votación': 0,
        'Aprobado': 0
    };

    projects.forEach(p => {
        if (counts[p.estado] !== undefined) counts[p.estado]++;
    });

    const data = {
        labels: Object.keys(counts),
        datasets: [{
            data: Object.values(counts),
            backgroundColor: [
                '#3b82f6', // Ingresado (Blue)
                '#f59e0b', // En Comisión (Orange)
                '#6b21a8', // Despacho (Purple)
                '#c2410c', // Para Votación (Deep Orange)
                '#10b981'  // Aprobado (Green)
            ],
            hoverOffset: 10,
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    if (statusChartInstance) {
        statusChartInstance.data = data;
        statusChartInstance.update();
    } else {
        statusChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: data,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            usePointStyle: true,
                            padding: 20,
                            font: { family: 'Inter', size: 12 }
                        }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) label += ': ';
                                if (context.parsed !== null) label += context.parsed;
                                return label;
                            }
                        }
                    }
                },
                cutout: '70%'
            }
        });
    }
}

async function exportToPDF() {
    let option = prompt("Opciones de exportación PDF:\n1. Pantalla completa (Panel, Estadísticas, Filtros)\n2. Solo la Tabla de Proyectos\n3. Solo los Reportes Gráficos\n\nIngresa el número de la opción:", "2");
    
    let element = document.body;
    let filenameStr = `Reporte_HCD_${new Date().toLocaleDateString()}.pdf`;

    if (option === "1") {
        element = document.querySelector('.main-content');
    } else if (option === "2") {
        element = document.querySelector('#tableSection');
        filenameStr = `Tabla_Proyectos_${new Date().toLocaleDateString()}.pdf`;
    } else if (option === "3") {
        element = document.querySelector('.analytics-grid');
        filenameStr = `Graficos_Reporte_${new Date().toLocaleDateString()}.pdf`;
    } else {
        return; // canceló o ingresó algo inválido
    }

    const opt = {
        margin: [10, 10, 10, 10],
        filename: filenameStr,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };

    const btnExport = document.getElementById('btnExportPDF');
    const originalText = btnExport.innerHTML;
    btnExport.innerHTML = '<i class="ri-loader-4-line ri-spin"></i> Generando...';
    btnExport.disabled = true;

    try {
        await html2pdf().set(opt).from(element).save();
    } catch (error) {
        console.error("Error al exportar PDF:", error);
        alert("Hubo un error al generar el PDF.");
    } finally {
        btnExport.innerHTML = originalText;
        btnExport.disabled = false;
    }
}
window.exportToPDF = exportToPDF;

// Modificamos renderTable para que también actualice el gráfico
const originalRenderTable = renderTable;
renderTable = function(projects) {
    originalRenderTable(projects);
    updateStatusChart(projects);
};

if(searchInput) searchInput.addEventListener('input', filterProjects);
if(filterStatus) filterStatus.addEventListener('change', filterProjects);
if(filterPriority) filterPriority.addEventListener('change', filterProjects);

// --- LÓGICA DE NAVEGACIÓN (SIDEBAR) ---
const navItems = {
    dashboard: document.getElementById('navDashboard'),
    proyectos: document.getElementById('navProyectos'),
    comisiones: document.getElementById('navComisiones'),
    reportes: document.getElementById('navReportes')
};

const sections = {
    stats: document.getElementById('statsSection'),
    analytics: document.getElementById('analyticsSection'),
    filters: document.getElementById('filtersSection'),
    table: document.getElementById('tableSection')
};

function setActiveNav(activeId) {
    Object.values(navItems).forEach(item => {
        if(item) item.classList.remove('active');
    });
    if(navItems[activeId]) {
        navItems[activeId].classList.add('active');
    }
}

function showSections(sectionsToShow) {
    Object.values(sections).forEach(sec => {
        if(sec) sec.classList.add('section-hidden');
    });
    sectionsToShow.forEach(sec => {
        if(sec) sec.classList.remove('section-hidden');
    });
}

if(navItems.dashboard) {
    navItems.dashboard.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav('dashboard');
        // Mostrar todo
        showSections([sections.stats, sections.analytics, sections.filters, sections.table]);
        // Reset filtro de estado
        if(filterStatus) {
            filterStatus.value = 'all';
            filterProjects();
        }
    });
}

if(navItems.proyectos) {
    navItems.proyectos.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav('proyectos');
        // Mostrar solo filtros y tabla
        showSections([sections.filters, sections.table]);
        if(filterStatus) {
            filterStatus.value = 'all';
            filterProjects();
        }
    });
}

if(navItems.comisiones) {
    navItems.comisiones.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav('comisiones');
        // Mostrar solo filtros y tabla, y pre-filtrar por "En Comisión"
        showSections([sections.filters, sections.table]);
        if(filterStatus) {
            filterStatus.value = 'En Comisión';
            filterProjects();
        }
    });
}

if(navItems.reportes) {
    navItems.reportes.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveNav('reportes');
        // Mostrar solo estadísticas y gráficos
        showSections([sections.stats, sections.analytics]);
    });
}

