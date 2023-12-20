# PluginAuth

 
1.	SPRENDŽIAMO UŽDAVINIO APRAŠYMAS
Programinės įrangos licencijavimo sistemos pagalba siekiama kontroliuoti programinės įrangos naudojimą, suteikiant kiekvienam naudotojui prieigos raktą – licenciją. Ši sistema leidžia ne tik administruoti licencijas, bet ir suteikia galimybę naudotojui peržiūrėti turimas – įsigytas programinės įrangos licencijas, jas tvarkyti. Šios sistemos pagalba norima užtikrinti, jog programinė įranga būtų teisingai licencijuota, bei suteikti įrangos kurėjui galimybę stebėti programinės įrangos naudojimą, bei apriboti nepageidaujamą naudojimą. Sistemos hierarchija: Programinė įranga<- naudotojai <-  prieigos raktai
1.2.	SISTEMOS PASKIRTIS
Programinės įrangos valdymas: Administratorius gali pridėti naują programinę įrangą, atnaujinti ją, arba pašalinti iš sistemos.
Licencijavimas: naudotojai, kurie yra prisiregistravę bei prisijungę prie sistemos, gali įsigyti licencijas tam tikrai pasirinktai programinei įrangai. Kiekviena licencija turi savo unikalų prieigos raktą, bei trukmę.
Naudotojo kontrolė: naudotojai glai peržiūrėti įsigytas licencijas, atnaujinti jas, bei atsisakyti automatinio atnaujinimo.
Administratoriaus kontrolė: Administratorius gali valdyti sistemos naudotojus, licencijas bei programinę įrangą.
1.3.	 FUNKCINIAI REIKALAVIMAI
1.	Registracija ir prisijungimas: 
Naudotojai turi galimybę užsiregistruoti ir prisijungti naudodamiesi savo vartotojo duomenimis.

2.	Programinės įrangos valdymas:
Pridėti naują programinę įrangą į sistemą.
Atnaujinti programinės įrangos informaciją.
Pašalinti programinę įrangą iš sistemos.
Gauti nurodytos programinės įrangos informaciją.
Gauti sąrašą visos programinės įrangos.

3.	Licencijavimo valdymas:
Sukurti naują licenciją tam tikrai programinei įrangai.
Atnaujinti licencijos informaciją.
Pašalinti licenciją.
Gauti nurodytos licencijos informaciją.
Gauti visų licencijų sąrašą.
Gauti konkretaus sistemos naudotojo licencijų sąrašą.

4.	Naudotojo kontrolės valdymas:
Gauti visų naudotojų sąrašą.
Atnaujinti naudotojų informaciją.
Pašalinti naudotoją.
Gauti nurodyto naudotojo informaciją.
Gauti sąrašą visų licencijų, priklausančių tam tikram naudotojui.

5.	Administratoriaus kontrolė:
Pridėti, atnaujinti ar pašalinti programinę įrangą.
Pridėti, atnaujinti ar pašalinti licencijas.
Pridėti, atnaujinti ar pašalinti naudotojus.

6.	Autentifikacija ir autorizacija:
Autentifikacija naudojant JWT.
Autorizacija pagal naudotojo rolę (svečias, narys, administratorius).
2.	PASIRINKTOS TECHNOLOGIJOS
Sistemos serverinė dalis (API) bus realizuojma pasitelkiant Node.JS Express.Js karkasą.
Vartotojo sąsajai realizuoti bus naudojamas React biblioteka.
3.	DIEGIMO DIAGRAMA
 
4.	PROJEKTO REPOZITORIJA

https://github.com/emidru1/pluginauth

5.	API DOKUMENTACIJA
API metodas	GET
Paskirtis	Gauti visų naudotojų sąrašą
Kelias iki metodo	/api/users
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[{"id": 1, "email": "email@example.com", "role": "user"}, ...]
Atsakymo kodas	200 OK
Klaidų kodai	401 Unauthorized

API metodas	POST
Paskirtis	Sukurti naują vartotoją
Kelias iki metodo	/api/users
Užklausos struktūra	{"email": "email@example.com", "password": "password", "role": "user"}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "User created successfully"}
Atsakymo kodas	201 Created
Klaidų kodai	400 Bad Request

API metodas	PUT
Paskirtis	Atnaujinti vartotojo duomenis
Kelias iki metodo	/api/users
Užklausos struktūra	{"id": 1, "email": "newemail@example.com", "role": "updated role"}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "User updated successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found

API metodas	DELETE
Paskirtis	Ištrinti vartotoją
Kelias iki metodo	/api/users/:id
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "User deleted successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found

API metodas	GET
Paskirtis	Gauti visą programinės įrangos sąrašą
Kelias iki metodo	/api/softwares
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[{"id": 1, "name": "Software Name", "version": "1.0", "description": "Description", "price": 99.99}, ...]
Atsakymo kodas	200 OK
Klaidų kodai	401 Unauthorized

API metodas	POST
Paskirtis	Sukurti naują programinę įrangą
Kelias iki metodo	/api/softwares
Užklausos struktūra	{"name": "New Software", "version": "1.0", "description": "Description", "price": 99.99}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "Software created successfully"}
Atsakymo kodas	201 Created
Klaidų kodai	400 Bad Request

API metodas	PUT
Paskirtis	Atnaujinti programinės įrangos duomenis
Kelias iki metodo	/api/softwares/:id
Užklausos struktūra	{"name": "Updated Software", "version": "2.0", "description": "Updated Description", "price": 199.99}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "Software updated successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found

API metodas	DELETE
Paskirtis	Ištrinti programinę įrangą
Kelias iki metodo	/api/softwares/:id
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "Software deleted successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found

API metodas	GET
Paskirtis	Gauti visas licencijas
Kelias iki metodo	/api/licenses
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[{"id": 1, "softwareId": 1, "userId": 1, "key": "license-key", "expirationDate": "2023-01-01T00:00:00.000Z"}, ...]
Atsakymo kodas	200 OK
Klaidų kodai	401 Unauthorized

API metodas	POST
Paskirtis	Sukurti naują licenciją
Kelias iki metodo	/api/licenses
Užklausos struktūra	{"softwareId": 1, "userId": 1, "key": "new-license-key", "expirationDate": "2023-01-01T00:00:00.000Z"}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "License created successfully"}
Atsakymo kodas	201 Created
Klaidų kodai	400 Bad Request

API metodas	PUT
Paskirtis	Atnaujinti licencijos duomenis
Kelias iki metodo	/api/licenses/:id
Užklausos struktūra	{"softwareId": 1, "userId": 1, "key": "updated-license-key", "expirationDate": "2023-02-01T00:00:00.000Z"}
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "License updated successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found

API metodas	DELETE
Paskirtis	Ištrinti licenciją
Kelias iki metodo	/api/licenses/:id
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{"message": "License deleted successfully"}
Atsakymo kodas	200 OK
Klaidų kodai	400 Bad Request, 404 Not Found


API metodas	GET
Paskirtis	Gauti licencijas pagal vartotoją
Kelias iki metodo	/api/licenses/user/:userId
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[{"id": 1, "softwareId": 1, "userId": 1, "key": "license-key", "expirationDate": "2023-01-01T00:00:00.000Z"}, ...]
Atsakymo kodas	200 OK
Klaidų kodai	401 Unauthorized


API metodas	POST
Paskirtis	Prisijungimas
Kelias iki metodo	/login
Užklausos struktūra	{ "email": "email@example.com", "password": "password" }
Užklausos “Header” dalis	-
Atsakymas	{ "token": "generatedToken" }
Atsakymo kodas	200 OK
Klaidų kodai	401 Unauthorized


API metodas	POST
Paskirtis	Registracija
Kelias iki metodo	/signup
Užklausos struktūra	{ "email": "email@example.com", "password": "password" }
Užklausos “Header” dalis	-
Atsakymas	{ "token": "generatedToken" }
Atsakymo kodas	201 Created
Klaidų kodai	400 Bad Request, 500 Internal Server Error


API metodas	GET
Paskirtis	Gauti visų vartotojų sąrašą
Kelias iki metodo	/api/users
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[ { "id": "userId", "email": "email", ... } ]
Atsakymo kodas	200 OK
Klaidų kodai	404 Not Found, 500 Internal Server Error


API metodas	GET
Paskirtis	Gauti vartotojų, naudojančių tam tikrą programinę įrangą, sąrašą
Kelias iki metodo	/api/softwares/:softwareId/users
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	[ { "id": "userId", "email": "email", ... } ]
Atsakymo kodas	200 OK
Klaidų kodai	404 Not Found, 500 Internal Server Error



API metodas	GET
Paskirtis	Gauti tam tikro vartotojo duomenis
Kelias iki metodo	/api/users/:id
Užklausos struktūra	-
Užklausos “Header” dalis	Authorization: Bearer <token>
Atsakymas	{ "id": "userId", "email": "email", "softwares": [...], ... }
Atsakymo kodas	200 OK
Klaidų kodai	403 Forbidden, 404 Not Found, 500 Internal Server Error




