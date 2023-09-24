# PluginAuth


1. SPRENDŽIAMO UŽDAVINIO APRAŠYMAS
Programinės įrangos licencijavimo sistemos pagalba siekiama kontroliuoti programinės
įrangos naudojimą, suteikiant kiekvienam naudotojui prieigos raktą – licenciją. Ši sistema leidžia
ne tik administruoti licencijas, bet ir suteikia galimybę naudotojui peržiūrėti turimas – įsigytas
programinės įrangos licencijas, jas tvarkyti. Šios sistemos pagalba norima užtikrinti, jog
programinė įranga būtų teisingai licencijuota, bei suteikti įrangos kurėjui galimybę stebėti
programinės įrangos naudojimą, bei apriboti nepageidaujamą naudojimą. Sistemos hierarchija:
Programinė įranga <- naudotojas <- prieigos raktai(licencijos

1.2.SISTEMOS PASKIRTIS
Programinės įrangos valdymas: Administratorius gali pridėti naują programinę įrangą,
atnaujinti ją, arba pašalinti iš sistemos.
Licencijavimas: naudotojai, kurie yra prisiregistravę bei prisijungę prie sistemos, gali įsigyti
licencijas tam tikrai pasirinktai programinei įrangai. Kiekviena licencija turi savo unikalų prieigos
raktą, bei trukmę.
Naudotojo kontrolė: naudotojai glai peržiūrėti įsigytas licencijas, atnaujinti jas, bei atsisakyti
automatinio atnaujinimo.
Administratoriaus kontrolė: Administratorius gali valdyti sistemos naudotojus, licencijas bei
programinę įrangą.

1.3. FUNKCINIAI REIKALAVIMAI

1. Registracija ir prisijungimas:
Naudotojai turi galimybę užsiregistruoti ir prisijungti naudodamiesi savo vartotojo
duomenimis.

2. Programinės įrangos valdymas:
Pridėti naują programinę įrangą į sistemą.
Atnaujinti programinės įrangos informaciją.
Pašalinti programinę įrangą iš sistemos.
Gauti nurodytos programinės įrangos informaciją.
Gauti sąrašą visos programinės įrangos.

3. Licencijavimo valdymas:
Sukurti naują licenciją tam tikrai programinei įrangai.
Atnaujinti licencijos informaciją.
Pašalinti licenciją.
Gauti nurodytos licencijos informaciją.
Gauti visų licencijų sąrašą.
Gauti konkretaus sistemos naudotojo licencijų sąrašą.

4. Naudotojo kontrolės valdymas:
Gauti visų naudotojų sąrašą.
Atnaujinti naudotojų informaciją.
Pašalinti naudotoją.
Gauti nurodyto naudotojo informaciją.
Gauti sąrašą visų licencijų, priklausančių tam tikram naudotojui.

5. Administratoriaus kontrolė:
Pridėti, atnaujinti ar pašalinti programinę įrangą.
Pridėti, atnaujinti ar pašalinti licencijas.
Pridėti, atnaujinti ar pašalinti naudotojus.

6. Autentifikacija ir autorizacija:
Autentifikacija naudojant JWT.
Autorizacija pagal naudotojo rolę (svečias, narys, administratorius).
