## Entities validation

---

### Category entity

- **name** minmax(4, 24)
- **description** minmax(4, 255)

### Post entity

- **name** minmax(4, 36)
- **description** minmax(4, 255)
- **markdown** minmax(24, 7200)

### User entity

- **name** minmax(4, 24)
- **description** minmax(4, 255)
- **password** minmax(6, 32)

