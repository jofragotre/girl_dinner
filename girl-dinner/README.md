# girl dinner™

## How to update recipes & cocktails

All content lives in two JSON files in the `data/` folder:

- `data/recipes.json` — food dishes
- `data/cocktails.json` — cocktails

### Editing on GitHub

1. Go to the repo on GitHub: [github.com/jofragotre/girl_dinner](https://github.com/jofragotre/girl_dinner)
2. Navigate into `girl-dinner/data/`
3. Click the file you want to edit (`recipes.json` or `cocktails.json`)
4. Click the pencil icon (Edit this file) in the top right
5. Make your changes, then click **Commit changes** → commit directly to `main`
6. Vercel will auto-deploy within ~30 seconds

### Recipe format

```json
{
  "id": "unique-number-as-string",
  "name": "Name of the dish",
  "ingredients": ["ingredient one", "ingredient two"],
  "vibe": "a short witty description",
  "moods": ["soft", "feral", "fancy", "hungover"]
}
```

### Cocktail format

```json
{
  "id": "unique-number-as-string",
  "name": "Name of the cocktail",
  "ingredients": ["ingredient one", "ingredient two"],
  "vibe": "a short witty description",
  "moods": ["soft", "feral", "fancy", "hungover"]
}
```

### Valid moods

| Mood | When to use |
|------|-------------|
| `soft` | cozy, calm, gentle energy |
| `feral` | chaotic, unhinged, no thoughts |
| `fancy` | bougie, treating yourself |
| `hungover` | survival mode |

`moods` is optional — leave it out and the item appears for all moods.

### Rules

- `id` must be unique within its file (just increment from the last one)
- `ingredients` is an array of strings — keep them lowercase and casual
- `vibe` is one short line, the more unhinged the better
