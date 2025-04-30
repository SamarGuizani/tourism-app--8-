-- Update cities with their corresponding governorate_id
UPDATE city
SET governorate_id = 
  CASE 
    WHEN name = 'Tunis' OR name LIKE '%Tunis%' THEN 'tunis'
    WHEN name = 'Sousse' OR name LIKE '%Sousse%' THEN 'sousse'
    WHEN name = 'Monastir' OR name LIKE '%Monastir%' THEN 'monastir'
    WHEN name = 'Mahdia' OR name LIKE '%Mahdia%' THEN 'mahdia'
    WHEN name = 'Sfax' OR name LIKE '%Sfax%' THEN 'sfax'
    WHEN name = 'Nabeul' OR name LIKE '%Nabeul%' THEN 'nabeul'
    WHEN name = 'Hammamet' OR name LIKE '%Hammamet%' THEN 'nabeul'
    WHEN name = 'Bizerte' OR name LIKE '%Bizerte%' THEN 'bizerte'
    WHEN name = 'Tabarka' OR name LIKE '%Tabarka%' THEN 'jendouba'
    WHEN name = 'Ain Draham' OR name LIKE '%Ain Draham%' THEN 'jendouba'
    WHEN name = 'Djerba' OR name LIKE '%Djerba%' OR name = 'Aghir' THEN 'medenine'
    WHEN name = 'Tozeur' OR name LIKE '%Tozeur%' THEN 'tozeur'
    WHEN name = 'Kairouan' OR name LIKE '%Kairouan%' THEN 'kairouan'
    WHEN name = 'Chebba' OR name LIKE '%Chebba%' THEN 'mahdia'
    WHEN name = 'Béja' OR name LIKE '%Béja%' OR name = 'Beja' THEN 'beja'
    WHEN name = 'Gabès' OR name LIKE '%Gabès%' OR name = 'Gabes' THEN 'gabes'
    WHEN name = 'Gafsa' OR name LIKE '%Gafsa%' THEN 'gafsa'
    WHEN name = 'Kébili' OR name LIKE '%Kébili%' OR name = 'Kebili' THEN 'kebili'
    WHEN name = 'Le Kef' OR name LIKE '%Kef%' THEN 'kef'
    WHEN name = 'Médenine' OR name LIKE '%Médenine%' OR name = 'Medenine' THEN 'medenine'
    WHEN name = 'Sidi Bouzid' OR name LIKE '%Sidi Bouzid%' THEN 'sidi_bouzid'
    WHEN name = 'Siliana' OR name LIKE '%Siliana%' THEN 'siliana'
    WHEN name = 'Tataouine' OR name LIKE '%Tataouine%' THEN 'tataouine'
    WHEN name = 'Zaghouan' OR name LIKE '%Zaghouan%' THEN 'zaghouan'
    WHEN name = 'Ariana' OR name LIKE '%Ariana%' THEN 'ariana'
    WHEN name = 'Ben Arous' OR name LIKE '%Ben Arous%' THEN 'ben_arous'
    WHEN name = 'Manouba' OR name LIKE '%Manouba%' THEN 'manouba'
    WHEN name = 'Kasserine' OR name LIKE '%Kasserine%' THEN 'kasserine'
    ELSE governorate_id
  END;
