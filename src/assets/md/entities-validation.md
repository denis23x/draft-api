## Entities validation

---

### Category entity

- **name** minmax(4, 24)

### Post entity

- **title** minmax(4, 36)
- **body** minmax(24, 7200)

### User entity

- **name** minmax(4, 24)
- **biography** minmax(4, 255)
- **password** minmax(6, 32)

