-- Update region_id in city table based on governorate's region_id
UPDATE city c
SET region_id = g.region_id
FROM governorates g
WHERE c.governorate_id = g.id
AND c.region_id IS NULL;

-- Ensure all cities in regions are linked to the correct region
UPDATE city
SET region_id = 
  CASE 
    WHEN governorate_id IN ('tunis', 'ariana', 'ben_arous', 'manouba', 'zaghouan', 'bizerte', 'beja', 'jendouba', 'kef', 'siliana') THEN 1 -- North
    WHEN governorate_id IN ('kairouan', 'kasserine', 'sidi_bouzid') THEN 2 -- Center
    WHEN governorate_id IN ('gabes', 'medenine', 'tataouine', 'gafsa', 'tozeur', 'kebili') THEN 3 -- South
    WHEN governorate_id IN ('nabeul', 'sousse', 'monastir', 'mahdia', 'sfax') THEN 4 -- East
    ELSE region_id
  END
WHERE region_id IS NULL OR region_id = 0;
