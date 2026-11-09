# Brawlify CDN (cdn.brawlify.com)
A public CDN with [Brawl Stars](https://supercell.com/en/games/brawlstars/) assets extracted from the game or taken from the [Official Fan Kit](https://fankit.supercell.com/).

Any file in this repository is available on [cdn.brawlify.com](https://cdn.brawlify.com/) via [Cloudflare](https://www.cloudflare.com/network/) using [Pages](https://pages.cloudflare.com/) cached around the world. There is no traffic limit and no IP blocking. You can link directly, download, or fetch programmatically.

# Usage
This CDN is meant to be linked to programmatically with IDs taken from [in-game files](https://api.brawlapi.com/game), for example [player_thumbnails](https://api.brawlapi.com/game/csv_logic/player_thumbnails). For random assets, check the [official Fankit](https://fankit.supercell.com/).

It works best with [the official Brawl Stars API](https://developer.brawlstars.com/) and [BrawlAPI](https://brawlapi.com/), which both return the IDs needed to link to this CDN.

## Documentation
Every folder, the ID each one is named by, pixel sizes and examples are documented at [brawlapi.com/cdn](https://brawlapi.com/cdn/). A list of every file on the CDN is published as JSON at [brawlapi.com/cdn/manifest.json](https://brawlapi.com/cdn/manifest.json).

## Availability
`/maps/regular/15000000.png` -> [cdn.brawlify.com/maps/regular/15000000.png](https://cdn.brawlify.com/maps/regular/15000000.png)

`/brawlers/borders/16000000.png` -> [cdn.brawlify.com/brawlers/borders/16000000.png](https://cdn.brawlify.com/brawlers/borders/16000000.png)

# Folders

| Folder | Description | Typical size |
|---|---|---|
| `brawlers/borderless` | Brawler icons without the standard border, square | 170x170 |
| `brawlers/borders` | Brawler icons with the standard profile border, square | 200x200 |
| `brawlers/emoji` | Default pin expression for each brawler | Up to 400px |
| `brawlers/model` | Full-body model showcase for the default skin | Varies, up to ~1100px |
| `brawlers/portraits` | Wider landscape portraits of brawlers | Varies, up to 800px |
| `boxes/emoji` | Pin-style icons of seasonal reward boxes | ~150-210px |
| `boxes/regular` | Detailed icons of seasonal reward boxes | ~210-310px |
| `club-badges/regular` | Club badge icons | ~295x330 |
| `gadgets/regular` | Gadget icons with the in-game border | ~245x256 |
| `gadgets/borderless` | ~~Deprecated~~ Gadget icons without the border, cropped to content | Up to 160px |
| `game-modes/regular` | Game mode icons | Up to 200px |
| `gears/regular` | Gear icons in their colored borders | ~375-750px |
| `maps/regular` | Generated map visualizations close to in-game appearance | 690x1050, 930x930, or 1860x1860 |
| `prestiges/brawlers` | Prestige badge overlays combined with each brawler | ~377-541px |
| `prestiges/tiered` | Prestige badge icons with tier numbers | ~377-541px |
| `prestiges/regular` | Base prestige badge icons without tiers | ~377-541px |
| `profile-icons/regular` | Player profile thumbnails with their in-game borders | 200x200 |
| `ranked/regular` | Ranked league icons by name | ~210-335px |
| `ranked/tiered` | Ranked league icons with tier numbers, by ID | ~210-335px |
| `records/regular` | Player record icons | ~140-180px |
| `star-powers/regular` | Star Power icons with the in-game border | ~245x256 |
| `star-powers/borderless` | ~~Deprecated~~ Star Power icons without the border, cropped to content | Up to 200px |

# Collaboration and Standards
This repository is open to collaboration. Fixes, additions and updates can be suggested anytime, but all contributed assets **must be compressed** and follow the size standards for the folder they belong to.

Suggesting new standards for file sizes should only be done if there’s a wide need for the asset and no similar standard already exists. Each folder’s `README.md` has more details on its specific standards.

## Compression
Every asset in this repository is compressed using lossy PNG palette reduction ([pngquant](https://pngquant.org/)) to minimize file size while preserving visual quality. All files are 8-bit palette PNGs. Any new assets must be compressed before being added.

[Cloudflare’s Image Optimization](https://developers.cloudflare.com/images/polish/) *([Lossy](https://developers.cloudflare.com/images/polish/compression/#lossy) and [WebP](https://developers.cloudflare.com/images/polish/compression/#webp))* is also enabled on this CDN, so browsers may receive an even further optimized image in a different format automatically.

# Notice
*You are welcome to use this CDN without any credit to [brawlify.com](https://brawlify.com).*

*You are required to follow [Supercell’s Terms of Service](https://supercell.com/en/terms-of-service/) and [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).*

This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it.