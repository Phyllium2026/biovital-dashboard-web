from pathlib import Path

src_path = Path("/mnt/data/Pasted text.txt")
code = src_path.read_text(encoding="utf-8")

# 1) Mostrar todos los contratos: eliminar límite slice(0, 6)
code = code.replace(
    "{compromisosGestion.slice(0, 6).map((r) => (",
    "{compromisosGestion.map((r) => ("
)

# 2) Ajustar bloque derecho para reducir aire inferior:
#    - contenido no se estira obligatoriamente
#    - bloque derecho toma altura natural
#    - tabla tiene scroll interno controlado cuando hay muchos contratos
code = code.replace(
""".bv-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 1.28fr 1fr;
  gap: 8px;
  align-items: stretch;
  overflow: hidden;
}""",
""".bv-content {
  min-height: 0;
  display: grid;
  grid-template-columns: 1.28fr 1fr;
  gap: 8px;
  align-items: start;
  overflow: hidden;
}"""
)

code = code.replace(
""".bv-exec {
  height: 100%;
  background: linear-gradient(145deg, #f8fff8, #edf7ed);
  display: grid;
  grid-template-rows: 24px 46px 52px minmax(0, 1fr);
  gap: 5px;
  align-self: stretch;
  overflow: hidden;
}""",
""".bv-exec {
  height: auto;
  max-height: 100%;
  background: linear-gradient(145deg, #f8fff8, #edf7ed);
  display: grid;
  grid-template-rows: 24px 46px 52px minmax(0, auto);
  gap: 5px;
  align-self: start;
  overflow: hidden;
}"""
)

code = code.replace(
""".bv-semaforo {
  height: 100%;
  min-height: 0;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 14px;
  padding: 5px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,.03);
  overflow: hidden;
}""",
""".bv-semaforo {
  height: auto;
  min-height: 0;
  background: white;
  border: 1px solid #e1eadf;
  border-radius: 14px;
  padding: 5px 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,.03);
  overflow: hidden;
}"""
)

code = code.replace(
""".bv-gestion-table {
  display: grid;
  gap: 3px;
  min-height: 0;
  overflow: hidden;
}""",
""".bv-gestion-table {
  display: grid;
  gap: 3px;
  min-height: 0;
  max-height: 318px;
  overflow-y: auto;
  overflow-x: hidden;
  padding-right: 3px;
}"""
)

# Mobile: keep natural height and avoid max-height constraint on table
code = code.replace(
"""  .bv-gestion-table {
    overflow-x: auto;
  }""",
"""  .bv-gestion-table {
    max-height: none;
    overflow-x: auto;
    overflow-y: visible;
  }"""
)

out = Path("/mnt/data/app-page-biovital-v8-ajuste-tabla-gestion.tsx")
out.write_text(code, encoding="utf-8")

print(f"Archivo generado: {out}")
print(f"Tamaño: {len(code):,} caracteres")
print("Cambios: muestra todos los contratos y ajusta altura del bloque derecho con scroll interno.")
