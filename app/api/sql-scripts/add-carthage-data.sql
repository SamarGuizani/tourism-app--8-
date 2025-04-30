-- Create attractions_carthage table if it doesn't exist
CREATE TABLE IF NOT EXISTS attractions_carthage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image VARCHAR(255),
  google_map_link TEXT
);

-- Create restaurants_carthage table if it doesn't exist
CREATE TABLE IF NOT EXISTS restaurants_carthage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  rating VARCHAR(10),
  price_range VARCHAR(50),
  cuisine VARCHAR(255) NOT NULL,
  comment TEXT,
  opening_hours VARCHAR(255),
  coordinates JSONB,
  google_map_link TEXT
);

-- Insert attractions data
INSERT INTO attractions_carthage (name, type, description, image)
VALUES
  ('Punic Port', 'Historical Site', 'The Punic Port was cleverly designed to deceive enemies, appearing as a mere merchant port while concealing a naval base. A narrow channel connected the southern merchant port to the northern naval port. Today, only the outlines of the ports remain, with underwater ruins and a small museum showcasing models of the original structures.', '/placeholder.svg?height=200&width=300&query=Punic+Port+Carthage'),
  ('Baths of Antoninus', 'Ruins', 'Constructed between 146 AD and 162 AD, the Baths of Antoninus were the largest Roman baths in Africa and among the grandest in the empire. Their unique design, with an open-air pool facing the Mediterranean, reflected their coastal location. Although only the ground floor survives, the ruins still convey the baths'' former magnificence and complexity.', '/placeholder.svg?height=200&width=300&query=Baths+of+Antoninus+Carthage'),
  ('Roman Villas', 'Ruins', 'The Roman Villas were luxurious homes of the Roman elite. The Villa of the Aviary, the only one remaining, features preserved columns and mosaics with a stunning view of the Mediterranean. The ancient street layout and mosaic fragments provide insight into Roman urban planning.', '/placeholder.svg?height=200&width=300&query=Roman+Villas+Carthage'),
  ('Roman Theatre of Carthage', 'Historical Site', 'Built in the second century, the Roman Theatre could accommodate 10,000 spectators. Reconstructed, it now hosts cultural events, including the International Festival of Carthage. Nearby, ruins of ancient cisterns can be seen.', '/placeholder.svg?height=200&width=300&query=Roman+Theatre+Carthage'),
  ('Byrsa Hill', 'Historical Site', 'Byrsa Hill, the original citadel, is steeped in legend. Queen Dido, according to myth, cleverly acquired the land by cutting an oxhide into strips to encircle the hill. Today, it houses Punic ruins and the St. Louis Cathedral.', '/placeholder.svg?height=200&width=300&query=Byrsa+Hill+Carthage'),
  ('Acropolium of Carthage (St. Louis Cathedral)', 'Historical Building', 'Dedicated to King Louis IX, the Acropolium was built in 1830 with Gothic and Byzantine elements. Now a cultural center, it displays mosaics, artifacts, and statues from Carthage''s history.', '/placeholder.svg?height=200&width=300&query=Acropolium+Carthage'),
  ('Roman Amphitheatre of Carthage', 'Ruins', 'One of the largest amphitheatres of its time, it could hold 30,000 spectators. Built on flat ground, it''s one of three such structures in Africa. The basement includes a chapel dedicated to two saints.', '/placeholder.svg?height=200&width=300&query=Roman+Amphitheatre+Carthage'),
  ('Al Abidine Mosque / Malik ibn Anas Mosque', 'Religious Site', 'Opened in 2003, this mosque, originally named after President Ben Ali, was renamed after the Tunisian Revolution to honor Malik ibn Anas, a prominent Muslim scholar. It can accommodate 1,000 worshipers and features a striking minaret.', '/placeholder.svg?height=200&width=300&query=Malik+ibn+Anas+Mosque+Carthage'),
  ('Basilica of Damous El Karita', 'Ruins', 'This Byzantine-era basilica was a significant Christian complex. Though largely in ruins, it offers a glimpse into early Christian architecture in North Africa. A Catholic cemetery lies adjacent to the site.', '/placeholder.svg?height=200&width=300&query=Basilica+Damous+El+Karita+Carthage')
ON CONFLICT (name) DO NOTHING;

-- Insert restaurants data
INSERT INTO restaurants_carthage (name, rating, price_range, cuisine, comment, opening_hours, coordinates)
VALUES
  ('Les Indécis', '4.8', '20–40 DT', 'Restaurant', 'Ma recommandation : - Houmous - Falafels - Burger au thon - thon mi-cuit', 'Ouvre bientôt ⋅ 18:00', '{"latitude": 36.852, "longitude": 10.322}'),
  ('Restaurant El Bey', '4.8', '1–10 DT', 'Plats familiaux', 'Salutations du Québec !', NULL, '{"latitude": 36.852, "longitude": 10.3225}'),
  ('SABATO COFFEE SHOP & RESTAURANT', '4.4', '20–30 DT', 'Restaurant', 'Très belle découverte !', NULL, '{"latitude": 36.852, "longitude": 10.323}'),
  ('D''lich', '4.7', '10–20 DT', 'Restaurant', 'Bonne continuation.', NULL, '{"latitude": 36.852, "longitude": 10.3235}'),
  ('Le Paradis Des Saveurs', '4.6', NULL, 'Restaurant', 'Nourriture authentique, simple mais recherchée et délicieuse.', NULL, '{"latitude": 36.8525, "longitude": 10.322}'),
  ('bleue!', '4.8', '10–20 DT', 'Restaurant', 'Plusieurs fois durant notre séjour dans le coin.', 'Fermé ⋅ Ouvre à 19:30', '{"latitude": 36.8525, "longitude": 10.3225}'),
  ('Ayutthaya', '4.0', '20–30 DT', 'Restaurant', 'A recommander !', NULL, '{"latitude": 36.8525, "longitude": 10.323}'),
  ('Restaurant Best Friend', '4.4', '30–40 DT', 'Restaurant', 'Une vraie découverte !', NULL, '{"latitude": 36.8525, "longitude": 10.3235}'),
  ('Restaurant Le Punique', '3.7', NULL, 'Restaurant', 'La plage est à 5 minutes à pied et le quartier est très sympa.', NULL, '{"latitude": 36.853, "longitude": 10.322}'),
  ('Chez Weld Moufida', '4.6', '10–30 DT', 'Restaurant', 'Très bonne nourriture typique mais service à améliorer', NULL, '{"latitude": 36.853, "longitude": 10.3225}'),
  ('Bambino', '4.3', '30–40 DT', 'Italienne', 'Très belle découverte.', 'Fermé ⋅ Ouvre à 19:00', '{"latitude": 36.853, "longitude": 10.323}'),
  ('Punic''Art', '3.6', '10–20 DT', 'Restaurant', 'Je vous recommande de venir tôt car peu de places de parking.', NULL, '{"latitude": 36.853, "longitude": 10.3235}')
ON CONFLICT (name) DO NOTHING;

-- Update Google Map links for attractions
SELECT update_google_map_links('attractions_carthage');

-- Update Google Map links for restaurants
SELECT update_google_map_links('restaurants_carthage');
