document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".materia").forEach((materia) => {
  materia.addEventListener("mouseenter", () => {
    const codigo = materia.dataset.codigo;
    const prerrequisitos = (materia.dataset.prerequisitos || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    // 🔵 Resaltar prerrequisitos (hacia atrás)
    prerrequisitos.forEach((codigoPrereq) => {
      const materiaPrereq = document.querySelector(`.materia[data-codigo="${codigoPrereq}"]`);
      if (materiaPrereq) {
        materiaPrereq.classList.add("prerrequisito-activo");
      }
    });

    // 🟢 Resaltar dependientes (hacia adelante)
    document.querySelectorAll(".materia").forEach((otraMateria) => {
      const prereqDeOtra = (otraMateria.dataset.prerequisitos || "")
        .split(",")
        .map(p => p.trim());

      if (prereqDeOtra.includes(codigo)) {
        otraMateria.classList.add("dependiente-activa");
      }
    });
  });

  materia.addEventListener("mouseleave", () => {
    document.querySelectorAll(".materia").forEach((m) => {
      m.classList.remove("prerrequisito-activo", "dependiente-activa");
    });
  });
});
const tooltip = document.getElementById("tooltip-materia");

document.querySelectorAll(".materia").forEach((materia) => {
  materia.addEventListener("mousemove", (e) => {
    const prerrequisitos = (materia.dataset.prerequisitos || "")
      .split(",")
      .map(p => p.trim())
      .filter(p => p !== "");

    let contenido = "";
    if (prerrequisitos.length === 0) {
      contenido = "✅ Sin prerrequisitos";
    } else {
      const nombres = prerrequisitos.map((codigo) => {
        const materiaReq = document.querySelector(`.materia[data-codigo="${codigo}"]`);
        return materiaReq ? `• ${materiaReq.querySelector("h3").textContent}` : `• ${codigo}`;
      });

      contenido = `🔍 Requiere:\n${nombres.join("\n")}`;
    }

    tooltip.style.display = "block";
    tooltip.style.left = `${e.pageX + 10}px`;
    tooltip.style.top = `${e.pageY + 10}px`;
    tooltip.textContent = contenido;
  });

  materia.addEventListener("mouseleave", () => {
    tooltip.style.display = "none";
  });
});

const svg = document.getElementById("svg-lineas");

function conectarLineasDesdeMateria(materia) {
  svg.innerHTML = ""; // Limpiar líneas previas

  const prerequisitos = (materia.dataset.prerequisitos || "")
    .split(",")
    .map(p => p.trim())
    .filter(p => p !== "");

  const rect1 = materia.getBoundingClientRect();
  const x1 = rect1.left + rect1.width / 2 + window.scrollX;
  const y1 = rect1.top + rect1.height / 2 + window.scrollY;

  prerequisitos.forEach((codigo) => {
    const materiaReq = document.querySelector(`.materia[data-codigo="${codigo}"]`);
    if (materiaReq) {
      const rect2 = materiaReq.getBoundingClientRect();
      const x2 = rect2.left + rect2.width / 2 + window.scrollX;
      const y2 = rect2.top + rect2.height / 2 + window.scrollY;

      const linea = document.createElementNS("http://www.w3.org/2000/svg", "line");
      linea.setAttribute("x1", x1);
      linea.setAttribute("y1", y1);
      linea.setAttribute("x2", x2);
      linea.setAttribute("y2", y2);

      svg.appendChild(linea);
    }
  });
}

function limpiarLineas() {
  svg.innerHTML = "";
}


  const materias = document.querySelectorAll(".materia");

  // Leer estado guardado en localStorage
  const materiasCursadas = JSON.parse(localStorage.getItem("materiasCursadas")) || [];

  // Aplicar clase si ya estaba marcada
  materias.forEach((materia) => {
    const codigo = materia.dataset.codigo;

    if (materiasCursadas.includes(codigo)) {
      materia.classList.add("cursada");
    }

    // Agregar evento click
    materia.addEventListener("click", () => {
  materia.addEventListener("mouseenter", () => {
  conectarLineasDesdeMateria(materia); // 👈 dibuja líneas
});

materia.addEventListener("mouseleave", () => {
  limpiarLineas(); // 👈 borra las líneas al salir
});
        const codigo = materia.dataset.codigo;
  const prerrequisitos = materia.dataset.prerequisitos?.split(",").filter(p => p !== "");

  const materiasCursadas = Array.from(document.querySelectorAll(".materia.cursada")).map(
    (m) => m.dataset.codigo
  );

  // Validar sólo si se intenta marcar (no al desmarcar)
  const vaAMarcar = !materia.classList.contains("cursada");

  const cumple = prerrequisitos.length === 0 || prerrequisitos.every((pr) =>
    materiasCursadas.includes(pr)
  );

  if (vaAMarcar && !cumple) {
    const nombresPrerrequisitos = prerrequisitos.map((codigo) => {
      const materiaRequerida = document.querySelector(`.materia[data-codigo="${codigo}"]`);
      return materiaRequerida ? materiaRequerida.querySelector("h3").textContent : codigo;
    });

    alert(
      `❌ No puedes cursar esta materia aún.\nDebes aprobar primero:\n- ${nombresPrerrequisitos.join("\n- ")}`
    );
    return; // ⛔ IMPORTANTE: evita que siga ejecutando
  }

  // ✅ Solo llega aquí si cumple o está desmarcando
  materia.classList.toggle("cursada");

  const nuevasCursadas = Array.from(document.querySelectorAll(".materia.cursada")).map(
    (m) => m.dataset.codigo
  );

  localStorage.setItem("materiasCursadas", JSON.stringify(nuevasCursadas));
  actualizarProgreso();
  aplicarBloqueoVisual(); 
});
});
  actualizarProgreso();
  aplicarBloqueoVisual();

  document.querySelectorAll(".materia").forEach((materia) => {
  const prerrequisitos = (materia.dataset.prerequisitos || "")
    .split(",")
    .map(p => p.trim())
    .filter(p => p !== "");

  if (prerrequisitos.length === 0) {
    materia.title = "✅ Sin prerrequisitos";
  } else {
    const nombres = prerrequisitos.map((codigo) => {
      const materiaReq = document.querySelector(`.materia[data-codigo="${codigo}"]`);
      return materiaReq ? `– ${materiaReq.querySelector("h3").textContent}` : `– ${codigo}`;
    });

    materia.title = `🔍 Requiere:\n${nombres.join("\n")}`;
  }
});

});

document.getElementById("limpiar-progreso").addEventListener("click", () => {
  const confirmar = confirm("¿Estás seguro de que deseas borrar tu progreso?");
  if (confirmar) {
    localStorage.removeItem("materiasCursadas");

    // Quitar clase visual de todas las materias
    document.querySelectorAll(".materia").forEach((materia) => {
      materia.classList.remove("cursada");
    });
    actualizarProgreso();
    aplicarBloqueoVisual();
  }
});

function actualizarProgreso() {
  const todas = document.querySelectorAll(".materia");
  const cursadas = document.querySelectorAll(".materia.cursada");

  let totalMaterias = todas.length;
  let totalCursadas = cursadas.length;

  let creditosCursados = Array.from(cursadas).reduce((acc, mat) => {
    return acc + parseInt(mat.dataset.creditos || "0");
  }, 0);

  let porcentaje = (totalCursadas / totalMaterias) * 100;

  document.getElementById("progreso-interno").style.width = porcentaje + "%";
  document.getElementById("info-progreso").textContent = 
    `Materias cursadas: ${totalCursadas} / ${totalMaterias} | Créditos: ${creditosCursados}`;
}
function aplicarBloqueoVisual() {
  const materias = document.querySelectorAll(".materia");

  const cursadas = Array.from(document.querySelectorAll(".materia.cursada")).map(
    (m) => m.dataset.codigo
  );

  materias.forEach((materia) => {
    const prerrequisitos = materia.dataset.prerequisitos?.split(",").filter(p => p !== "");

    const cumple = prerrequisitos.length === 0 || prerrequisitos.every((pr) =>
      cursadas.includes(pr)
    );

    if (!materia.classList.contains("cursada") && !cumple) {
      materia.classList.add("bloqueada");
    } else {
      materia.classList.remove("bloqueada");
    }
  });
}