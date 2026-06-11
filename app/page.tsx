'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';


type Registro = {
  id: string;
  anio: string;
  predio: string;
  compromiso: string;
  eecc: string;
  especie: string;
  estado: string;
  censos: number;
  vivos: number;
  muertos: number;
  avance: number;
};

const DATA: Registro[] = [
  {
    id: 'BIO-2026-001',
    anio: '2026',
    predio: 'Monte Aranda',
    compromiso: 'CCPL-1',
    eecc: 'ABP',
    especie: 'Porlieria chilensis',
    estado: 'Operativo',
    censos: 12,
    vivos: 940,
    muertos: 38,
    avance: 82,
  },
  {
    id: 'BIO-2026-002',
    anio: '2026',
    predio: 'Monte Aranda',
    compromiso: 'CCPL-1',
    eecc: 'ABP',
    especie: 'Carica chilensis',
    estado: 'Seguimiento',
    censos: 8,
    vivos: 323,
    muertos: 21,
    avance: 74,
  },
  {
    id: 'BIO-2028-001',
    anio: '2028',
    predio: 'Monte Aranda',
    compromiso: 'Enriquecimiento',
    eecc: 'TKR',
    especie: 'Porlieria chilensis',
    estado: 'Planificado',
    censos: 4,
    vivos: 949,
    muertos: 0,
    avance: 35,
  },
];

export default function Home() {
  const [loading, setLoading] = useState(true);

  const [anio, setAnio] = useState('Todos');
  const [predio, setPredio] = useState('Todos');
  const [compromiso, setCompromiso] = useState('Todos');
  const [eecc, setEecc] = useState('Todos');

  setTimeout(() => setLoading(false), 600);

  const filtrados = useMemo(() => {
    return DATA.filter((r) => {
      return (
        (anio === 'Todos' || r.anio === anio) &&
        (predio === 'Todos' || r.predio === predio) &&
        (compromiso === 'Todos' || r.compromiso === compromiso) &&
        (eecc === 'Todos' || r.eecc === eecc)
      );
    });
  }, [anio, predio, compromiso, eecc]);

  const totalCensos = filtrados.reduce((a, b) => a + b.censos, 0);
  const totalVivos = filtrados.reduce((a, b) => a + b.vivos, 0);
  const totalMuertos = filtrados.reduce((a, b) => a + b.muertos, 0);
  const avance =
    filtrados.length > 0
      ? Math.round(filtrados.reduce((a, b) => a + b.avance, 0) / filtrados.length)
      : 0;

  const unique = (key: keyof Registro) => [
    'Todos',
    ...Array.from(new Set(DATA.map((r) => String(r[key])))),
  ];

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[#071b12] text-white">
        <div className="text-center">
          <div className="mx-auto mb-5 h-20 w-20 rounded-3xl bg-white/10 flex items-center justify-center shadow-xl">
            <Image
              src="/biovital-logo.png"
              alt="BIOVITAL"
              width={54}
              height={54}
              priority
            />
          </div>
          <h1 className="text-2xl font-bold tracking-wide">BIOVITAL</h1>
          <p className="mt-2 text-sm text-emerald-100">Cargando sistema operacional...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f3f7f1] text-[#102015]">
      <section className="mx-auto max-w-7xl px-4 py-4 md:py-6">
        <header className="mb-4 flex items-center justify-between rounded-3xl bg-[#082015] px-4 py-3 text-white shadow-md">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-white/10 flex items-center justify-center">
              <Image
                src="/biovital-logo.png"
                alt="BIOVITAL"
                width={34}
                height={34}
                priority
              />
            </div>
            <div>
              <h1 className="text-lg md:text-2xl font-bold leading-none">BIOVITAL V2</h1>
              <p className="text-xs md:text-sm text-emerald-100">
                Monitoreo de biodiversidad y compromisos ambientales
              </p>
            </div>
          </div>

          <a
            href="#"
            className="rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-emerald-600"
          >
            Registrar Censo
          </a>
        </header>

        <section className="mb-4 grid grid-cols-2 gap-2 md:grid-cols-4">
          <Select label="Año" value={anio} options={unique('anio')} onChange={setAnio} />
          <Select label="Predio" value={predio} options={unique('predio')} onChange={setPredio} />
          <Select
            label="Compromiso"
            value={compromiso}
            options={unique('compromiso')}
            onChange={setCompromiso}
          />
          <Select label="EECC" value={eecc} options={unique('eecc')} onChange={setEecc} />
        </section>

        <section className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
          <Kpi title="Censos" value={totalCensos} />
          <Kpi title="Vivos" value={totalVivos} />
          <Kpi title="Bajas" value={totalMuertos} />
          <Kpi title="Avance" value={`${avance}%`} />
        </section>

        <section className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl bg-white p-4 shadow-sm">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold">Vista operacional</h2>
              <span className="text-xs text-gray-500">{filtrados.length} registros</span>
            </div>

            <div className="space-y-3">
              {filtrados.map((r) => (
                <article
                  key={r.id}
                  className="rounded-2xl border border-gray-100 bg-[#f8fbf6] p-3"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs text-gray-500">{r.id}</p>
                      <h3 className="font-semibold">{r.especie}</h3>
                      <p className="text-sm text-gray-600">
                        {r.predio} · {r.compromiso} · {r.eecc}
                      </p>
                    </div>
                    <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                      {r.estado}
                    </span>
                  </div>

                  <div className="mt-3 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-emerald-500"
                      style={{ width: `${r.avance}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-600">
                    <span>Vivos: {r.vivos}</span>
                    <span>Bajas: {r.muertos}</span>
                    <span>Avance: {r.avance}%</span>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="rounded-3xl bg-[#102015] p-4 text-white shadow-sm">
            <h2 className="mb-3 font-bold">Vista ejecutiva</h2>

            <div className="space-y-3">
              <Resumen label="Registros activos" value={filtrados.length} />
              <Resumen label="Plantas vivas" value={totalVivos} />
              <Resumen label="Bajas registradas" value={totalMuertos} />
              <Resumen label="Avance promedio" value={`${avance}%`} />
            </div>

            <div className="mt-5 rounded-2xl bg-white/10 p-4">
              <p className="text-sm text-emerald-100">Estado general</p>
              <p className="mt-1 text-3xl font-bold">
                {avance >= 75 ? 'Controlado' : avance >= 50 ? 'En seguimiento' : 'Crítico'}
              </p>
              <p className="mt-2 text-sm text-emerald-100">
                Información consolidada por año, predio, compromiso y empresa ejecutora.
              </p>
            </div>
          </div>
        </section>
      </section>
    </main>
  );
}

function Select({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
}) {
  return (
    <label className="rounded-2xl bg-white p-3 text-sm shadow-sm">
      <span className="mb-1 block text-xs font-semibold text-gray-500">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent font-semibold outline-none"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </label>
  );
}

function Kpi({ title, value }: { title: string; value: string | number }) {
  return (
    <div className="rounded-3xl bg-white p-4 shadow-sm">
      <p className="text-xs font-semibold text-gray-500">{title}</p>
      <p className="mt-1 text-2xl font-bold text-[#102015]">{value}</p>
    </div>
  );
}

function Resumen({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-white/10 px-4 py-3">
      <span className="text-sm text-emerald-100">{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
