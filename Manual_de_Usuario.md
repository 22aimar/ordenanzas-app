# Manual de Usuario: Sistema de Planificación de Proyectos HCD

Este manual está diseñado para explicar de manera sencilla cómo usar el sistema de seguimiento de proyectos. Cualquier persona puede usarlo sin necesidad de instalar programas adicionales.

## 1. ¿Cómo abrir el sistema?
1. Ve a la carpeta `ordenanzas-app` en tu computadora.
2. Haz doble clic en el archivo llamado **`index.html`**.
3. El sistema se abrirá automáticamente en tu navegador web predeterminado (Chrome, Edge, Safari, etc.).

> [!TIP]
> Puedes crear un acceso directo de `index.html` en tu escritorio para abrirlo más rápido.

## 2. ¿Cómo funciona la pantalla principal?
Al abrir el sistema, verás tres áreas importantes:
- **Semáforos / Estadísticas (Arriba):** Te muestra el total de proyectos activos, cuántos se aprobaron y cuántos llevan demorados más de 30 días (en rojo).
- **Analíticas (Medio):** 
    - **Ranking de Concejales:** Una tabla que muestra quiénes son los autores con más proyectos presentados.
    - **Gráfico de Estados:** Un gráfico circular que muestra visualmente la distribución de los proyectos (ej: cuántos están en comisión, cuántos aprobados, etc.).
- **Tabla de Proyectos (Abajo):** La lista completa de todos los proyectos con su estado actual.

> [!NOTE]
> Por defecto, el sistema te mostrará unos "datos de prueba" para que veas cómo se ve. Para ver los datos reales, debes cargar tu archivo Excel.

## 3. ¿Cómo cargar tus datos reales (Excel)?
1. Asegúrate de tener tu archivo de Excel (ej: `Planificacion.xlsx`) con los proyectos actualizados.
2. En la pantalla principal del sistema (arriba a la derecha), haz clic en el botón **"Cargar Excel"**.
3. Se abrirá una ventana. Busca y selecciona tu archivo de Excel.
4. ¡Listo! El sistema leerá el archivo y actualizará todas las estadísticas, el ranking y la tabla al instante.

### ⚠️ Importante: Formato del Excel
Para que el sistema lea bien los datos, el archivo de Excel debe mantener una estructura estricta en sus columnas. La información de los proyectos debe empezar en la **Fila 5** (ya que las filas de arriba son títulos).

El orden de las columnas debe ser:
1. **Columna A:** Título o nombre del proyecto.
2. **Columna B:** Referente o contacto.
3. **Columna C:** Observaciones / Resumen del proyecto.
4. **Columna D:** Área o Secretaría asignada.
5. **Columna E:** Comisión a la que pertenece.
6. **Columna F:** Prioridad (`Alta`, `Media`, `Baja`).
7. **Columna G:** Autor/a (Concejal o Bloque).

> [!WARNING]
> No elimines columnas ni cambies su orden, ya que esto haría que los datos se mezclen en el sistema.

## 4. Búsqueda y Filtros
Si tienes muchos proyectos, puedes usar las herramientas que están justo arriba de la tabla:
- **Barra de búsqueda:** Escribe el título, el expediente o el nombre del autor para encontrar un proyecto rápido.
- **Filtro de Estado:** Puedes ver solamente los proyectos que están "Aprobados" o en "Despacho".
- **Filtro de Prioridad:** Sirve para ver únicamente los proyectos urgentes (Alta).

## 5. Gestión de Proyectos (ABM y Archivos Adjuntos)
Además de cargar datos desde un Excel, ahora puedes gestionar los proyectos directamente en el sistema:
- **Nuevo Proyecto (Alta):** Permite crear un proyecto desde cero sin necesidad de usar el Excel.
- **Editar (Modificación):** Haz clic en el botón de edición (ícono de lápiz) en cualquier proyecto de la tabla. Podrás actualizar su estado (por ejemplo, pasarlo a "Despacho"), autor, prioridad, etc.
- **Archivos Adjuntos:** Dentro del formulario de edición, tienes una nueva zona para "arrastrar y soltar" archivos (como documentos Word o PDFs). Esto permite anexar el expediente real al sistema para luego visualizarlo o descargarlo.
- **Eliminar (Baja):** Puedes borrar un proyecto definitivamente si hubo un error en la carga.

## 6. Exportar Reportes (PDF)
Si necesitas presentar un informe impreso o enviarlo por mail:
1. Haz clic en el botón **"Exportar PDF"** (arriba a la derecha).
2. El sistema te dará a elegir qué formato de reporte prefieres:
   - **Pantalla Completa:** Guarda un pantallazo general de todo el tablero.
   - **Solo Tabla:** Ideal si solo quieres imprimir el listado de expedientes.
   - **Solo Analíticas:** Perfecto para mostrar únicamente los gráficos y resúmenes a los directivos.
3. El archivo se generará automáticamente y se descargará en tu computadora.

## 7. Entendiendo las Versiones (Ej. Versión 1.1)
Los programas informáticos utilizan números de versión para llevar un registro de los avances.
- **Versión 1.0:** Fue nuestra versión base, la cual leía el Excel y mostraba gráficos.
- **Versión 1.1:** Al agregar características nuevas e importantes, que mejoran el uso diario pero no cambian la esencia del sistema (como poder Editar/Eliminar, subir archivos adjuntos y los nuevos formatos PDF), el número secundario sube (de 0 a 1).
- **Versión 2.0:** Este número mayor se utilizaría solamente si hiciéramos un rediseño total o un cambio completo de tecnología en un futuro.
- **Versión 1.1.1:** Un tercer número se usaría para pequeñas correcciones (por ejemplo, si arreglamos un color o un texto mal escrito).

## 8. ¿Se pueden hacer modificaciones en el futuro?
¡Sí! El sistema fue creado de manera modular. Si más adelante tu equipo o el Concejo sugieren agregar nuevas métricas, más filtros o cambiar colores, el diseño está preparado para incorporar nuevas funcionalidades de manera rápida y sin tener que empezar desde cero.
