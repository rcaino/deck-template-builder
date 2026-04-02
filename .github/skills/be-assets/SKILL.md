---
name: be-assets
description: Asset management and image optimization. Use when: processing images with Sharp, managing WebP conversion, optimizing asset pipelines, or serving assets. Domain: image processing and optimization.
---

# Backend Asset Management Skill

## AssetManager Service

Location: `src/main/services/AssetManager.ts`

- Converts images to WebP via Sharp
- Maintains relative paths for database storage
- No absolute paths in responses

## Sharp Configuration

- **Output format**: WebP (quality 90, effort 6)
- **Return type**: Relative path to project root
- Handles single and batch operations

## File Structure in Project (will change in each project)

Should be able to create this structure for each app user's project

```
{projectRoot}/
├── deck_config.ctm
├── assets/
│   └── images/
│       ├── {spriteOption}/[...files]
│       └── {imageOption}/[...files]
└── db/db.json (if the project has selected local db)
```

## Asset Protocol: `asset://`

Register in Main process to serve WebP files locally.
Renderer accesses via: `<img src="asset://category/filename.webp" />`

## Relative Path Strategy (Critical)

- Database stores: `assets/images/hero_class/warrior.webp`
- NOT: `/C:/Users/.../projects/MyDeck/assets/images/hero_class/warrior.webp`
- Enables project portability (users can move folders)

## Operations

- `optimizeImage()` - Convert single image to WebP, return relative path
- `processMultiple()` - Batch convert with error handling
- `getAssetsByCategory()` - List available assets

## Error Handling Strategy

- Log failures but continue (null fallback)
- Don't crash on bad image files
- Provide placeholder path on conversion failure
