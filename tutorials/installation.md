## Wymagania przedinstalacyjne
### Podstawowe
#### Node.js
drblms został napisany w JavaScript z użyciem [Node.js](https://nodejs.org). Minimalna wersja, na której zadziała to [v4.0.0](https://nodejs.org/download/release/v4.0.0/) [[Source Code](https://github.com/nodejs/node/releases/tag/v4.0.0)] (z npm v2.14.2) ze względu na pełne wsparcie dla ECMAScript 6 (wcześniejsze wersje wymagały dodatkowych flag do działania). Rekomendowana wersja Node.js do działania drblms to [v6.10.2 LTS](https://nodejs.org/download/release/v6.10.2/) [[Source Code](https://github.com/nodejs/node/releases/tag/v6.10.2)] (z npm v3.10.10). Projekt zakończył również pozytywnie testy na Node.js z gałęzi 7.x (z npm 3.10.8 & 4.x).
* [Github](https://github.com/nodejs/node)
* [nodejs.org](https://nodejs.org/en/)

| Typ | Wersja Node.js | Wersja npm |
| --------------- |:---:| ----:|
| Minimalna | 4.0.0 | 2.14.2 |
| Rekomendowana | 6.10.2 | 3.10.10 |
| Najnowsza | 7.9.0 | 4.2.0 |

---

#### blessed
Projekt korzysta z pakietu [blessed](https://github.com/chjj/blessed) do rysowania interfejsu aplikacji. Minimalna obsługiwana wersja to [0.1.16](https://www.npmjs.com/package/blessed) [[Source Code](https://github.com/chjj/blessed/releases/tag/v0.1.16)] (wersja 0.1.15 również działa, jednak ma problemy z wyjściem z menu). Rekomendowana wersja to 0.1.81 [[Source Code](https://github.com/chjj/blessed/releases/tag/v0.1.81)].
* [Github](https://github.com/chjj/blessed)
* [npmJS](https://www.npmjs.com/package/blessed)

| Typ | Wersja blessed |
| --- |---:|
| Minimalna | 0.1.6 |
| Rekomendowana | 0.1.81 |

---

#### ini
DRBL korzysta z plików ini (drblpush.conf) do przechowywania konfiguracji. Pakiet drblms korzysta z modułu [ini](https://www.npmjs.com/package/blessed) do manipulacji tymi plikami. Minimalna obsługiwana wersja to [v1.0.0] [[Source Code](https://github.com/npm/ini/releases/tag/1.0.0)].
* [Github](https://github.com/npm/ini)
* [npmJS](https://www.npmjs.com/package/ini)

| Typ | Wersja blessed |
| --- |---:|
| Minimalna | 1.0.0 |

---

#### fs-extra
Moduł rozszerzający wbudowany moduł obsługi plików (fs) o dodatkowe funkcjonalności.
* [Github](https://github.com/jprichardson/node-fs-extra)
* [npmJS](https://www.npmjs.com/package/fs-extra)

| Typ | Wersja fs-extra |
| --- |---:|
| Minimalna | 3.0.0 |

---

### Tworzenie dokumentacji
#### JSDoc
Projekt jest dokumentowany przy użyciu [JSDoc](http://usejsdoc.org/). Dokumentowanie odbywa się poprzez dodawanie specjalnie sformatowanych komentarzy w kodzie.

| Typ | Wersja jsdoc |
| --- |---:|
| Minimalna | 3.4.3 |

Tworzenie dokumentacji można wykonwać przez uruchomienie skryptu npm:
```
npm run doc
```
lub bezpośrednie uruchomienie jsdoc:
```
./node_modules/.bin/jsdoc -c jsdoc.json .
```

---
## Instalacja Node.js
### Arch Linux
```shell
pacman -S nodejs npm
```

### Debian
#### NodeJS 6.x
```shell
curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### NodeJS 7.x
```shell
curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### RHEL/Fedora
#### NodeJS 6.x
```shell
curl --silent --location https://rpm.nodesource.com/setup_6.x | bash -
yum -y install nodejs
```

#### NodeJS 7.x
```shell
curl --silent --location https://rpm.nodesource.com/setup_7.x | bash -
yum -y install nodejs
```

#### Dla Fedora 18
```shell
sudo dnf install nodejs
```

### OS X
```shell
brew install node
```

---

## Instalacja drblms
Plik \*.tar.gz należy wypakować do dowolnej lokacji, a następnie wewnątrz wypakowanego katalogu wywołać npm:
```shell
tar -zxvf drblms.tar.gz
cd drblms
sudo npm install -g
```
Node Package Manager (npm) zadba o ściągnięcie wszystkich zależności w odpowiednich wersjach oraz instalacje drblms tak, jak robi systemowy menadżer pakietów. Po pomyślnej instalacji archiwum oraz wypakowany katalog można usunąć.

## Dezinstalacja drblms
```shell
sudo npm uninstall -g drblms
```
Node Package Manager (npm) zadba o usunięcie wszystkich zależności, symlinków oraz plików należących do drblms.
