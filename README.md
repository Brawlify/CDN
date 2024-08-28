# Brawlify CDN (cdn.brawlify.com)
This is a public CDN with many [Brawl Stars](https://supercell.com/en/games/brawlstars/) assets extracted directly from the game or taken from the [Official Fan Kit](https://fankit.supercell.com/).

Any file in this repository is available on [cdn.brawlify.com](https://cdn.brawlify.com/) via [Cloudflare](https://www.cloudflare.com/network/) using [Pages](https://pages.cloudflare.com/) cached all around the world.

We encourage you to use this if you need some files without downloading and uploading it to your project by linking directly to it. There is no limit on traffic and we don't block IPs. You can of course also download these files and use directly, or programmatically fetch from it. Whatever works best for you.

# Usage
This CDN is meant to be programmatically linked to with IDs of items taken from [in-game files](https://api.brawlify.com/game), for example [player_thumbnails](https://api.brawlify.com/game/csv_logic/player_thumbnails). If you are looking for random assets to use, you will likely have more luck checking the [official Fankit](https://fankit.supercell.com/) for assets.

It is best to use this CDN with [the official Brawl Stars API](https://developer.brawlstars.com/) and our own [BrawlAPI](https://brawlapi.com/) which both include necessary IDs in responses to link to content on this CDN.

*You are welcome to use this CDN without any credit whatsoever to [brawlify.com](https://brawlify.com) in any way.*

*You are required to follow [Supercell’s Terms of Service](https://supercell.com/en/terms-of-service/) and [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).*

## Availability
`/maps/regular/15000000.png` -> [cdn.brawlify.com/maps/regular/15000000.png](https://cdn.brawlify.com/maps/regular/15000000.png)

`/brawlers/borders/16000000.png` -> [cdn.brawlify.com/brawlers/borders/16000000.png](https://cdn.brawlify.com/brawlers/borders/16000000.png)

`/brawlers/borderless/16000000.png` -> [cdn.brawlify.com/brawlers/borderless/16000000.png](https://cdn.brawlify.com/brawlers/borderless/16000000.png)

# Collaboration and Standards
This repository is open to collaboration from anyone. Fixes, additions and updates to assets can be suggested anytime, but please compress your assets using [Tinypng](https://tinypng.com/) (or other similar compression software you choose) and follow rules for wording and standards for files you suggest, such as size, quality and appropriate IDs.

Suggesting new standards for file sizes should be only done if there's a wide need for common usage of the specific asset and no similar standard already exists.

Each folder in this CDN follows some specific rules for file sizes and additional modifications. This is outlined in `README.md` files and specific folder standards.

## Compression
Each asset in this repository has been compressed, in most cases using [Tinypng](https://tinypng.com/) to decrease the size of the file and to save bandwidth when it's served. Since this CDN is served via web and mostly on applications that also serve it via web, it's important to compress these assets.

Due to [Cloudflare's Image Optimization](https://developers.cloudflare.com/images/polish/) *([Lossy](https://developers.cloudflare.com/images/polish/compression/#lossy) and [WebP](https://developers.cloudflare.com/images/polish/compression/#webp) both)* enabled on this CDN, you might get an even further optimized image served, which can also be in a different file format than the original in this repository. This is done automatically, depending on the device this content is served to and the path of the file served never changes.

# Notice
This content is not affiliated with, endorsed, sponsored, or specifically approved by Supercell and Supercell is not responsible for it.
For more information see [Supercell’s Fan Content Policy](https://supercell.com/en/fan-content-policy/).