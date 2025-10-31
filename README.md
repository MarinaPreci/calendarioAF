# Carreras App (Calendario 2026) - Demo

Proyecto React + Vite pensado para móvil. Vista anual 2026, tipos predefinidos y gestión de inscripciones.
Datos persistentes en Supabase (configura URL y ANON KEY en `.env`).

## Quick start

1. Clona o descomprime el proyecto.
2. Copia `.env.example` a `.env` y escribe tus credenciales de Supabase.
3. Instala dependencias:
   ```
   npm install
   ```
4. Ejecuta en modo desarrollo:
   ```
   npm run dev
   ```
5. Abre en el móvil o emulador (normalmente http://localhost:5173).

## Tablas SQL (ejecutar en Supabase SQL Editor)

```sql
create table if not exists races (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  date date not null,
  type text not null,
  location text,
  description text,
  created_at timestamptz default now()
);

create table if not exists participants (
  id uuid default gen_random_uuid() primary key,
  race_id uuid references races(id) on delete cascade,
  display_name text not null,
  joined_at timestamptz default now()
);
```

Para pruebas rápidas puedes desactivar RLS en esas tablas (no recomendado en producción).
