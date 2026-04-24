create table if not exists items (
  id            text primary key,
  kind          text not null check (kind in ('recipe', 'cocktail')),
  name          text not null,
  vibe          text,
  ingredients   jsonb not null,
  moods         text[] not null default ARRAY[]::text[],
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  deleted_at    timestamptz
);

create table if not exists votes (
  user_id    text not null,
  item_id    text not null references items(id) on delete cascade,
  value      smallint not null check (value in (-1, 1)),
  created_at timestamptz not null default now(),
  primary key (user_id, item_id)
);
