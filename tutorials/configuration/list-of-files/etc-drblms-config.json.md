Plik JSON
```json
{
  "macFolder": "/etc/drblms/macbank",
  "drblpush": "/etc/drbl/drblpush.conf"
}

```
### macFolder
**Bezwzględna** ścieżka dostępu do drzewa katalogów zawierającego pliki z adresami MAC. Domyślnie ścieżka dostępu do katalogu to `/etc/drblms/macbank`.

### drblpush
**Bezwzględna** ścieżka dostępu do pliku drblpush będącego częścią konfiguracji DRBL. Domyślnie ścieżka dostępu do pliku to `/etc/drbl/drblpush.conf`. Plik pojawia się dopiero po poprawnym skonfigurowaniu `drblpush` (np. poprzez `drblpush -i`).
