-- Afegir variants multilingüe de la descripció dels projectes
ALTER TABLE projects
  ADD COLUMN IF NOT EXISTS description_ca text,
  ADD COLUMN IF NOT EXISTS description_en text;
