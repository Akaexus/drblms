`drbmls` korzysta z specjalnie uporządkowanej struktury katalogów do zarządzania grupami komputerów.
```shell
macbank
├── biuro
│   ├── athlony
│   ├── hp-x2000
│   └── testowe_komputery
├── kantor
│   ├── Apple-Mac-Pro-MD101
│   └── Apple-Mac-Pro-MD878PL
├── sala-021
│   └── hp-z840
├── sala-029
│   ├── dell-precision-5720
│   ├── dell-precision-t7910
│   ├── fujitsu-celsius-m740
│   ├── fujitsu-celsius-r940
│   ├── hp-workstation-z640
│   ├── hp-workstation-z840
│   ├── lenovo-thinkstation-p710
│   └── lenovo-thinkstation-p910
└── sala-09a
    └── hp-workstation-z440

5 directories, 15 files
```
Wewnątrz katalogu `macbank/` (**domyślnie zlokalizowany w `/etc/drblms/macbank`, istnieje możliwość zmiany w {@tutorial etc-drblms-config.json}**) mogą znajdować się **jedynie katalogi** reprezentujące grupy urządzeń, pliki nie będą brane pod uwagę. Nazwy katalogów mogą zawierać następujące znaki:

| Znaki dozwolone | # | Znak **nie**dozwolone |
| --------------- |:---:| ----:|
| a-z | # | {} |
| A-Z | # | \| |
| 0-9 | # | & |
| żółćęśąźń | # | ~ |
| ŻÓŁĆĘŚĄŹŃ | # | ! |
| - | # | [] |
| _ | # | () |
| . | # | ^ |
| , | # | " |
|| # | ; |
|| # | spacja |

Wewnątrz katalogów reprezentujących grupy urządzeń znajdują się pliki z adresami MAC. Sposób ich nazywania jest identyczny jak przy katalogach grup.

---
#### Pliki z adresami MAC
Pliki z adresami MAC powinny być zakodowane z użyciem UTF-8. Każdy adres MAC znajduje się w osobnej linijce i jest zapisany w postaci 6 bajtów oddzielonych dwukropkami (`:`).
```
F0:8C:56:64:08:0F
C9:FF:91:C4:2A:A2
1B:6D:C9:6C:51:78
5B:89:74:CF:80:A2
85:98:F0:F3:01:F5
08:FC:D2:9E:12:25
DA:81:05:15:FC:A6
FA:62:DD:60:A9:F8
81:4B:08:5B:CA:34
35:B7:C3:40:AA:41
EB:B9:6F:7E:6D:5D
67:F1:4B:73:01:8C
```
---
### Zbieranie adresów MAC
Adresy MAC nowych urządzeń mogą zostać dodane poprzez ręczne tworzenie nowych grup i manualne dodawanie adresów MAC. Warto wykorzystać narzędzie [`drbl-collect-mac`](https://github.com/stevenshiau/drbl/blob/master/sbin/drbl-collect-mac) do nasłuchiwania sieci i zbierania adresów MAC.
