-- StandBy Web App - Seed Data for Recipes
-- This file populates the database with sample recipes for testing and initial data

-- =====================================================
-- SAMPLE RECIPES (German and beginner-friendly)
-- =====================================================

-- Recipe 1: Pasta Aglio e Olio (Classic Italian)
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Pasta Aglio e Olio',
  'Ein klassisches italienisches Pastagericht mit Knoblauch, Olivenöl und Chili. Einfach, schnell und unglaublich lecker!',
  'https://images.unsplash.com/photo-1621996346565-e3dbc646d9a9?w=800',
  10, 15, 2, 'easy',
  3.50,
  ARRAY['lunch', 'dinner'],
  ARRAY['vegetarian'],
  '[
    {"name": "Spaghetti", "amount": 200, "unit": "g"},
    {"name": "Knoblauch", "amount": 4, "unit": "Zehen"},
    {"name": "Olivenöl", "amount": 60, "unit": "ml"},
    {"name": "Chili", "amount": 1, "unit": "Stück"},
    {"name": "Petersilie", "amount": 10, "unit": "g"},
    {"name": "Salz", "amount": 1, "unit": "TL"},
    {"name": "Parmesan", "amount": 30, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Wasser in einem großen Topf zum Kochen bringen und salzen.',
    'Spaghetti nach Packungsanleitung al dente kochen.',
    'Währenddessen Knoblauch fein hacken und Chili in Ringe schneiden.',
    'Olivenöl in einer Pfanne erhitzen und Knoblauch darin glasig dünsten.',
    'Chili hinzufügen und kurz mitbraten.',
    'Gekochte Pasta abgießen (etwas Pastawasser aufbewahren).',
    'Pasta in die Pfanne geben und gut vermischen. Bei Bedarf Pastawasser hinzufügen.',
    'Mit gehackter Petersilie und geriebenem Parmesan servieren.'
  ],
  '{"calories": 520, "protein": 15, "carbs": 68, "fat": 22}'::jsonb,
  ARRAY['italienisch', 'pasta', 'schnell', 'feierabend']
);

-- Recipe 2: Overnight Oats (Healthy Breakfast)
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Overnight Oats mit Beeren',
  'Gesundes Frühstück zum Vorbereiten am Vorabend. Perfekt für stressige Morgen!',
  'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=800',
  5, 0, 1, 'easy',
  2.00,
  ARRAY['breakfast'],
  ARRAY['vegetarian', 'lactose-free'],
  '[
    {"name": "Haferflocken", "amount": 50, "unit": "g"},
    {"name": "Hafermilch", "amount": 150, "unit": "ml"},
    {"name": "Chiasamen", "amount": 1, "unit": "EL"},
    {"name": "Ahornsirup", "amount": 1, "unit": "EL"},
    {"name": "Heidelbeeren", "amount": 50, "unit": "g"},
    {"name": "Himbeeren", "amount": 50, "unit": "g"},
    {"name": "Mandeln", "amount": 20, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Haferflocken, Hafermilch, Chiasamen und Ahornsirup in einem Glas vermischen.',
    'Über Nacht (oder mindestens 4 Stunden) im Kühlschrank quellen lassen.',
    'Am nächsten Morgen mit frischen Beeren und gehackten Mandeln toppen.',
    'Optional: Mit etwas Zimt verfeinern.'
  ],
  '{"calories": 380, "protein": 12, "carbs": 52, "fat": 14}'::jsonb,
  ARRAY['gesund', 'frühstück', 'vorbereiten', 'vegan-option']
);

-- Recipe 3: One-Pot Tomaten-Risotto
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Cremiges Tomaten-Risotto',
  'Ein wunderbar cremiges Risotto mit Tomaten und Basilikum. Nur ein Topf nötig!',
  'https://images.unsplash.com/photo-1476124369976-7ca406f0aae4?w=800',
  10, 30, 3, 'medium',
  5.00,
  ARRAY['lunch', 'dinner'],
  ARRAY['vegetarian', 'gluten-free'],
  '[
    {"name": "Risotto-Reis", "amount": 300, "unit": "g"},
    {"name": "Gemüsebrühe", "amount": 1000, "unit": "ml"},
    {"name": "Tomatenmark", "amount": 2, "unit": "EL"},
    {"name": "Kirschtomaten", "amount": 200, "unit": "g"},
    {"name": "Zwiebel", "amount": 1, "unit": "Stück"},
    {"name": "Knoblauch", "amount": 2, "unit": "Zehen"},
    {"name": "Parmesan", "amount": 80, "unit": "g"},
    {"name": "Butter", "amount": 30, "unit": "g"},
    {"name": "Weißwein", "amount": 100, "unit": "ml"},
    {"name": "Basilikum", "amount": 10, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Zwiebel und Knoblauch fein würfeln. Kirschtomaten halbieren.',
    'Butter in einem großen Topf schmelzen, Zwiebel und Knoblauch darin glasig dünsten.',
    'Reis hinzufügen und unter Rühren 2 Minuten anrösten.',
    'Mit Weißwein ablöschen und einkochen lassen.',
    'Tomatenmark einrühren, dann nach und nach die heiße Brühe zugeben.',
    'Dabei ständig rühren und immer erst neue Brühe zugeben, wenn die vorherige aufgesogen ist (ca. 20-25 Min).',
    'Wenn der Reis fast gar ist, Kirschtomaten unterrühren.',
    'Zum Schluss geriebenen Parmesan einrühren und mit Salz und Pfeffer abschmecken.',
    'Mit frischem Basilikum garniert servieren.'
  ],
  '{"calories": 480, "protein": 16, "carbs": 72, "fat": 14}'::jsonb,
  ARRAY['italienisch', 'comfort-food', 'one-pot']
);

-- Recipe 4: Avocado-Toast Deluxe
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Avocado-Toast Deluxe',
  'Der Klassiker aufgepimpt mit pochiertem Ei und Feta. Perfekter Brunch!',
  'https://images.unsplash.com/photo-1541519227354-08fa5d50c44d?w=800',
  10, 5, 2, 'easy',
  4.50,
  ARRAY['breakfast', 'lunch'],
  ARRAY['vegetarian'],
  '[
    {"name": "Vollkornbrot", "amount": 4, "unit": "Scheiben"},
    {"name": "Avocado", "amount": 2, "unit": "Stück"},
    {"name": "Eier", "amount": 2, "unit": "Stück"},
    {"name": "Feta", "amount": 50, "unit": "g"},
    {"name": "Kirschtomaten", "amount": 100, "unit": "g"},
    {"name": "Zitrone", "amount": 0.5, "unit": "Stück"},
    {"name": "Olivenöl", "amount": 2, "unit": "EL"},
    {"name": "Chiliflocken", "amount": 1, "unit": "Prise"}
  ]'::jsonb,
  ARRAY[
    'Brot toasten.',
    'Avocado halbieren, entkernen und das Fruchtfleisch mit einer Gabel zerdrücken.',
    'Mit Zitronensaft, Salz und Pfeffer würzen.',
    'Eier pochieren: Wasser mit etwas Essig zum Kochen bringen, Wirbel erzeugen und Ei hineingleiten lassen. 3-4 Min garen.',
    'Avocado auf dem getoasteten Brot verteilen.',
    'Pochiertes Ei darauf setzen.',
    'Mit zerbröckeltem Feta, halbierten Kirschtomaten, Chiliflocken und Olivenöl toppen.'
  ],
  '{"calories": 420, "protein": 18, "carbs": 32, "fat": 26}'::jsonb,
  ARRAY['brunch', 'gesund', 'trendy', 'protein']
);

-- Recipe 5: Linsenbolognese (Vegan)
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Vegane Linsenbolognese',
  'Herzhafte, proteinreiche Alternative zur klassischen Bolognese. Auch Fleischesser werden begeistert sein!',
  'https://images.unsplash.com/photo-1598866594230-a7c12756260f?w=800',
  15, 35, 4, 'easy',
  5.50,
  ARRAY['lunch', 'dinner'],
  ARRAY['vegan', 'lactose-free'],
  '[
    {"name": "Rote Linsen", "amount": 200, "unit": "g"},
    {"name": "Spaghetti", "amount": 400, "unit": "g"},
    {"name": "Passierte Tomaten", "amount": 500, "unit": "ml"},
    {"name": "Karotten", "amount": 2, "unit": "Stück"},
    {"name": "Sellerie", "amount": 2, "unit": "Stangen"},
    {"name": "Zwiebel", "amount": 1, "unit": "Stück"},
    {"name": "Knoblauch", "amount": 3, "unit": "Zehen"},
    {"name": "Tomatenmark", "amount": 2, "unit": "EL"},
    {"name": "Gemüsebrühe", "amount": 400, "unit": "ml"},
    {"name": "Rotwein", "amount": 100, "unit": "ml"},
    {"name": "Oregano", "amount": 1, "unit": "TL"},
    {"name": "Basilikum", "amount": 10, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Zwiebel, Knoblauch, Karotten und Sellerie fein würfeln.',
    'Olivenöl in einem großen Topf erhitzen und das Gemüse darin anbraten.',
    'Tomatenmark hinzufügen und kurz mitrösten.',
    'Mit Rotwein ablöschen und einkochen lassen.',
    'Linsen, passierte Tomaten und Gemüsebrühe hinzufügen.',
    'Oregano unterrühren und alles ca. 25-30 Minuten köcheln lassen, bis die Linsen weich sind.',
    'Währenddessen Spaghetti nach Packungsanleitung kochen.',
    'Bolognese mit Salz, Pfeffer und etwas Zucker abschmecken.',
    'Über die Pasta geben und mit frischem Basilikum servieren.'
  ],
  '{"calories": 520, "protein": 22, "carbs": 88, "fat": 6}'::jsonb,
  ARRAY['vegan', 'protein', 'meal-prep', 'italienisch']
);

-- Recipe 6: Bananenpfannkuchen (3 Zutaten)
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Bananenpfannkuchen (3 Zutaten)',
  'Gesunde Pfannkuchen aus nur 3 Zutaten. Perfekt für Anfänger und schnelles Frühstück!',
  'https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=800',
  5, 10, 2, 'easy',
  1.50,
  ARRAY['breakfast', 'snack'],
  ARRAY['vegetarian'],
  '[
    {"name": "Bananen", "amount": 2, "unit": "Stück"},
    {"name": "Eier", "amount": 2, "unit": "Stück"},
    {"name": "Haferflocken", "amount": 50, "unit": "g"},
    {"name": "Ahornsirup", "amount": 2, "unit": "EL"},
    {"name": "Beeren", "amount": 100, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Bananen schälen und mit einer Gabel in einer Schüssel zerdrücken.',
    'Eier hinzufügen und gut vermischen.',
    'Haferflocken unterrühren zu einem Teig.',
    'Eine Pfanne mit etwas Öl erhitzen.',
    'Kleine Portionen des Teigs in die Pfanne geben und zu Pfannkuchen formen.',
    'Von jeder Seite ca. 2-3 Minuten goldbraun braten.',
    'Mit Ahornsirup und frischen Beeren servieren.'
  ],
  '{"calories": 320, "protein": 14, "carbs": 48, "fat": 8}'::jsonb,
  ARRAY['gesund', 'schnell', '3-zutaten', 'kinder-freundlich']
);

-- Recipe 7: Buddha Bowl
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Rainbow Buddha Bowl',
  'Bunte, nährstoffreiche Bowl mit Quinoa, geröstetem Gemüse und Tahini-Dressing.',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800',
  20, 25, 2, 'medium',
  6.00,
  ARRAY['lunch', 'dinner'],
  ARRAY['vegan', 'gluten-free'],
  '[
    {"name": "Quinoa", "amount": 150, "unit": "g"},
    {"name": "Süßkartoffel", "amount": 1, "unit": "Stück"},
    {"name": "Kichererbsen", "amount": 240, "unit": "g"},
    {"name": "Rotkohl", "amount": 100, "unit": "g"},
    {"name": "Avocado", "amount": 1, "unit": "Stück"},
    {"name": "Spinat", "amount": 100, "unit": "g"},
    {"name": "Tahini", "amount": 3, "unit": "EL"},
    {"name": "Zitrone", "amount": 1, "unit": "Stück"},
    {"name": "Knoblauch", "amount": 1, "unit": "Zehe"},
    {"name": "Sesamkörner", "amount": 1, "unit": "EL"}
  ]'::jsonb,
  ARRAY[
    'Ofen auf 200°C vorheizen.',
    'Quinoa nach Packungsanleitung kochen.',
    'Süßkartoffel würfeln und mit Kichererbsen, Olivenöl, Salz und Paprika vermischen.',
    'Auf einem Backblech verteilen und 20-25 Minuten rösten.',
    'Rotkohl fein hobeln und mit etwas Essig marinieren.',
    'Tahini-Dressing: Tahini mit Zitronensaft, gepresstem Knoblauch, Wasser und Salz vermischen.',
    'Bowl zusammenstellen: Quinoa als Basis, dann Gemüse, Kichererbsen und Avocado arrangieren.',
    'Mit Tahini-Dressing beträufeln und mit Sesam bestreuen.'
  ],
  '{"calories": 620, "protein": 22, "carbs": 78, "fat": 26}'::jsonb,
  ARRAY['bowl', 'gesund', 'meal-prep', 'bunt']
);

-- Recipe 8: Ramen-Suppe (einfache Version)
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Schnelle Ramen-Suppe',
  'Selbstgemachte Ramen in 30 Minuten. Viel besser als Instant-Ramen!',
  'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=800',
  15, 15, 2, 'medium',
  5.00,
  ARRAY['lunch', 'dinner'],
  ARRAY['none'],
  '[
    {"name": "Ramen-Nudeln", "amount": 200, "unit": "g"},
    {"name": "Gemüsebrühe", "amount": 1000, "unit": "ml"},
    {"name": "Sojasauce", "amount": 3, "unit": "EL"},
    {"name": "Miso-Paste", "amount": 2, "unit": "EL"},
    {"name": "Ingwer", "amount": 20, "unit": "g"},
    {"name": "Knoblauch", "amount": 2, "unit": "Zehen"},
    {"name": "Pak Choi", "amount": 200, "unit": "g"},
    {"name": "Shiitake-Pilze", "amount": 100, "unit": "g"},
    {"name": "Eier", "amount": 2, "unit": "Stück"},
    {"name": "Frühlingszwiebeln", "amount": 2, "unit": "Stück"},
    {"name": "Sesamöl", "amount": 1, "unit": "EL"}
  ]'::jsonb,
  ARRAY[
    'Eier weich kochen (6-7 Min), abschrecken und halbieren.',
    'Ingwer und Knoblauch fein hacken, in einem Topf mit Sesamöl anbraten.',
    'Gemüsebrühe, Sojasauce und Miso-Paste hinzufügen und aufkochen.',
    'Pilze in Scheiben schneiden und in die Brühe geben. 5 Min köcheln lassen.',
    'Pak Choi halbieren und in die Suppe geben.',
    'Nudeln in einem separaten Topf nach Packungsanleitung kochen.',
    'Nudeln in Schüsseln verteilen, heiße Brühe mit Gemüse darüber geben.',
    'Mit halbierten Eiern, geschnittenen Frühlingszwiebeln und etwas Sesamöl toppen.'
  ],
  '{"calories": 480, "protein": 20, "carbs": 62, "fat": 16}'::jsonb,
  ARRAY['asiatisch', 'comfort-food', 'suppe', 'winter']
);

-- Recipe 9: Gebackene Süßkartoffel mit Füllung
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Gebackene Süßkartoffel mit Kichererbsen',
  'Gesunde, sättigende Bowl im Süßkartoffel-Mantel. Vegan und super lecker!',
  'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800',
  10, 45, 2, 'easy',
  4.00,
  ARRAY['lunch', 'dinner'],
  ARRAY['vegan', 'gluten-free'],
  '[
    {"name": "Süßkartoffeln", "amount": 2, "unit": "große"},
    {"name": "Kichererbsen", "amount": 240, "unit": "g"},
    {"name": "Paprikapulver", "amount": 1, "unit": "TL"},
    {"name": "Kreuzkümmel", "amount": 1, "unit": "TL"},
    {"name": "Tahini", "amount": 3, "unit": "EL"},
    {"name": "Zitrone", "amount": 1, "unit": "Stück"},
    {"name": "Rucola", "amount": 50, "unit": "g"},
    {"name": "Hummus", "amount": 100, "unit": "g"}
  ]'::jsonb,
  ARRAY[
    'Ofen auf 200°C vorheizen.',
    'Süßkartoffeln waschen, mehrmals mit einer Gabel einstechen und in Alufolie wickeln.',
    '40-45 Minuten backen, bis sie weich sind.',
    'Kichererbsen abtropfen lassen, mit Paprikapulver, Kreuzkümmel, Olivenöl, Salz und Pfeffer würzen.',
    'Auf einem Backblech 15 Minuten bei 200°C rösten.',
    'Tahini-Dressing: Tahini mit Zitronensaft und etwas Wasser glatt rühren.',
    'Gebackene Süßkartoffeln der Länge nach aufschneiden.',
    'Mit Hummus, gerösteten Kichererbsen und Rucola füllen.',
    'Mit Tahini-Dressing beträufeln.'
  ],
  '{"calories": 520, "protein": 18, "carbs": 76, "fat": 18}'::jsonb,
  ARRAY['vegan', 'gesund', 'einfach', 'sättigend']
);

-- Recipe 10: Schoko-Bananen-Muffins
INSERT INTO public.recipes (
  title, description, image_url, prep_time, cook_time, servings, difficulty,
  estimated_cost, meal_types, dietary, ingredients, instructions, nutrition, tags
) VALUES (
  'Gesunde Schoko-Bananen-Muffins',
  'Saftige Muffins mit Vollkornmehl und Banane. Perfekt zum Meal-Prep!',
  'https://images.unsplash.com/photo-1607478900766-efe13248b125?w=800',
  15, 20, 12, 'easy',
  4.50,
  ARRAY['snack', 'breakfast', 'dessert'],
  ARRAY['vegetarian'],
  '[
    {"name": "Bananen", "amount": 3, "unit": "reife"},
    {"name": "Vollkornmehl", "amount": 200, "unit": "g"},
    {"name": "Kakaopulver", "amount": 30, "unit": "g"},
    {"name": "Backpulver", "amount": 2, "unit": "TL"},
    {"name": "Eier", "amount": 2, "unit": "Stück"},
    {"name": "Ahornsirup", "amount": 80, "unit": "ml"},
    {"name": "Kokosöl", "amount": 60, "unit": "ml"},
    {"name": "Milch", "amount": 100, "unit": "ml"},
    {"name": "Schokodrops", "amount": 100, "unit": "g"},
    {"name": "Vanilleextrakt", "amount": 1, "unit": "TL"}
  ]'::jsonb,
  ARRAY[
    'Ofen auf 180°C vorheizen und Muffinform mit Papierförmchen auslegen.',
    'Bananen mit einer Gabel in einer Schüssel zerdrücken.',
    'Eier, Ahornsirup, geschmolzenes Kokosöl, Milch und Vanille zu den Bananen geben und vermischen.',
    'In einer separaten Schüssel Mehl, Kakaopulver, Backpulver und eine Prise Salz mischen.',
    'Trockene Zutaten zu den feuchten geben und vorsichtig unterheben.',
    'Schokodrops unterheben (ein paar für die Deko aufheben).',
    'Teig in die Muffinförmchen füllen (zu 3/4 voll).',
    'Mit restlichen Schokodrops toppen.',
    '18-20 Minuten backen. Stäbchenprobe machen.',
    'Auskühlen lassen und genießen oder einfrieren für später!'
  ],
  '{"calories": 180, "protein": 4, "carbs": 26, "fat": 8}'::jsonb,
  ARRAY['backen', 'meal-prep', 'kinder-freundlich', 'snack']
);
