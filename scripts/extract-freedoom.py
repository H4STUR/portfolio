"""
Extract a minimum-viable asset set from Freedoom WAD files for the portfolio
raycaster Doom game. Reads the WAD format directly (no SLADE needed).

Outputs to src/assets/games/doom/:
  sprites/enemies/{zombieman,imp,pinky}/*.png
  sprites/weapons/{pistol,shotgun}/*.png
  sprites/projectiles/*.png  (imp fireball, bullet impact, blood)
  sprites/pickups/*.png       (health, stimpak, medikit, ammo, shells, etc.)
  sounds/*.wav                (DMX -> 8-bit PCM WAV)
  textures/*.png              (64x64 flats, usable as wall/floor textures)
  COPYING.txt, CREDITS.txt, CREDITS-MUSIC.txt

Usage: python scripts/extract-freedoom.py
"""

import struct
import shutil
import wave
from pathlib import Path
from PIL import Image

WAD_PATH = Path(r"C:\Users\Nate Higgers\Downloads\freedoom-0.13.0\freedoom-0.13.0\freedoom1.wad")
SRC_DIR = WAD_PATH.parent
OUT_DIR = Path("src/assets/games/doom")


def read_wad(path):
    with open(path, "rb") as f:
        data = f.read()
    magic = data[0:4]
    if magic not in (b"IWAD", b"PWAD"):
        raise ValueError(f"Not a WAD: magic={magic!r}")
    n_lumps = struct.unpack_from("<I", data, 4)[0]
    dir_offset = struct.unpack_from("<I", data, 8)[0]
    lumps = []
    for i in range(n_lumps):
        e = dir_offset + i * 16
        off = struct.unpack_from("<I", data, e)[0]
        size = struct.unpack_from("<I", data, e + 4)[0]
        name = data[e + 8:e + 16].rstrip(b"\x00").decode("ascii", "replace")
        lumps.append((name, off, size))
    return lumps, data


def read_palette(data, lumps):
    for name, off, _ in lumps:
        if name == "PLAYPAL":
            return [(data[off + i * 3], data[off + i * 3 + 1], data[off + i * 3 + 2]) for i in range(256)]
    raise ValueError("PLAYPAL not found")


def decode_picture(raw, palette):
    """Doom picture format -> RGBA Image."""
    if len(raw) < 8:
        return None
    width, height, _xoff, _yoff = struct.unpack_from("<hhhh", raw, 0)
    if not (0 < width <= 1024 and 0 < height <= 1024):
        return None
    try:
        column_offsets = struct.unpack_from(f"<{width}I", raw, 8)
    except struct.error:
        return None
    img = Image.new("RGBA", (width, height), (0, 0, 0, 0))
    px = img.load()
    for x in range(width):
        i = column_offsets[x]
        if i >= len(raw):
            continue
        while i < len(raw):
            top = raw[i]
            if top == 0xFF:
                break
            i += 1
            if i >= len(raw):
                break
            length = raw[i]
            i += 2  # length + unused pad
            for j in range(length):
                if i + j >= len(raw):
                    break
                y = top + j
                if 0 <= y < height:
                    r, g, b = palette[raw[i + j]]
                    px[x, y] = (r, g, b, 255)
            i += length + 1  # data + unused pad
    return img


def decode_sound(raw):
    """DMX sound lump -> (sample_rate, pcm_bytes)."""
    if len(raw) < 24:
        return None
    sound_type, sample_rate, sample_count = struct.unpack_from("<HHI", raw, 0)
    if sound_type != 3:
        return None
    pcm_start, pcm_end = 24, 24 + sample_count
    if pcm_end > len(raw):
        pcm_end = len(raw)
    # Strip 16-byte padding bracketing the actual samples
    if sample_count > 32:
        return (sample_rate, raw[pcm_start + 16:pcm_end - 16])
    return (sample_rate, raw[pcm_start:pcm_end])


def save_wav(path, sample_rate, pcm_bytes):
    with wave.open(str(path), "wb") as w:
        w.setnchannels(1)
        w.setsampwidth(1)
        w.setframerate(sample_rate)
        w.writeframes(pcm_bytes)


def decode_flat(raw, palette):
    if len(raw) != 4096:
        return None
    img = Image.new("RGB", (64, 64))
    px = img.load()
    for y in range(64):
        for x in range(64):
            px[x, y] = palette[raw[y * 64 + x]]
    return img


def split_double_name(name):
    """
    Doom sprite double-names: 'POSSA2A8' = "frame A rotation 2, also frame A
    rotation 8 (mirrored)". Returns [(out_name, mirror_flag), ...].
    """
    if len(name) == 8 and name[0:4].isalpha():
        return [(name[0:6], False), (name[0:4] + name[6:8], True)]
    return [(name, False)]


def is_sprite_lump(name, prefix):
    if not name.startswith(prefix):
        return False
    tail = name[len(prefix):]
    if len(tail) == 2 and tail[0].isalpha() and tail[1].isdigit():
        return True
    if len(tail) == 4 and tail[0].isalpha() and tail[1].isdigit() and tail[2].isalpha() and tail[3].isdigit():
        return True
    return False


ENEMY_PREFIXES = {"POSS": "zombieman", "TROO": "imp", "SARG": "pinky"}
WEAPON_PREFIXES = {"PISG": "pistol", "PISF": "pistol", "SHTG": "shotgun", "SHTF": "shotgun"}
PROJECTILE_PREFIXES = ["BAL1", "PUFF", "BLUD"]
PICKUP_PREFIXES = ["BON1", "STIM", "MEDI", "AMMO", "SHEL", "CLIP", "ROCK", "CELL", "ARM1", "ARM2"]

SOUNDS = [
    "DSPISTOL", "DSSHOTGN", "DSDSHTGN",
    "DSPOSIT1", "DSPOSIT2", "DSPOSIT3", "DSPODTH1", "DSPODTH2", "DSPODTH3", "DSPOPAIN",
    "DSBGSIT1", "DSBGSIT2", "DSBGDTH1", "DSBGDTH2", "DSBGPAIN",
    "DSCLAW", "DSFIRSHT", "DSFIRXPL",
    "DSSGTSIT", "DSSGTDTH", "DSSGTATK", "DSDMPAIN",
    "DSPLPAIN", "DSOOF", "DSPLDETH",
    "DSITEMUP", "DSDOROPN", "DSDORCLS", "DSDORMOV",
    "DSPSTART", "DSPSTOP",
]

FLATS = [
    "FLAT1", "FLAT2", "FLAT5_1", "FLAT5_4", "FLAT5_7",
    "FLOOR0_1", "FLOOR0_3", "FLOOR4_1", "FLOOR4_8",
    "CEIL3_1", "CEIL4_1", "CEIL5_1",
    "GRASS1", "GRASS2", "MFLR8_1",
    "STEP1", "STEP2",
    "NUKAGE1", "NUKAGE2", "NUKAGE3",
    "BLOOD1", "BLOOD2", "BLOOD3",
]


def save_sprite_lump(lumps, data, palette, prefix, target_dir, stats):
    target_dir.mkdir(parents=True, exist_ok=True)
    for name, off, size in lumps:
        if not is_sprite_lump(name, prefix):
            continue
        img = decode_picture(data[off:off + size], palette)
        if img is None:
            stats["errors"].append(f"decode failed: {name}")
            continue
        for out_name, mirror in split_double_name(name):
            final = img.transpose(Image.FLIP_LEFT_RIGHT) if mirror else img
            final.save(target_dir / f"{out_name}.png")
            stats["sprites"] += 1


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)

    print(f"Copying license/credits from {SRC_DIR}...")
    for fn in ["COPYING.txt", "CREDITS.txt", "CREDITS-MUSIC.txt"]:
        src = SRC_DIR / fn
        if src.exists():
            shutil.copy(src, OUT_DIR / fn)
            print(f"  copied {fn}")

    print(f"\nReading {WAD_PATH.name}...")
    lumps, data = read_wad(WAD_PATH)
    palette = read_palette(data, lumps)
    by_name = {name: (off, size) for name, off, size in lumps}
    print(f"  {len(lumps)} lumps, palette OK")

    stats = {"sprites": 0, "sounds": 0, "flats": 0, "errors": []}

    print("\nExtracting enemies...")
    for prefix, folder in ENEMY_PREFIXES.items():
        save_sprite_lump(lumps, data, palette, prefix,
                         OUT_DIR / "sprites" / "enemies" / folder, stats)

    print("Extracting weapons...")
    for prefix, folder in WEAPON_PREFIXES.items():
        save_sprite_lump(lumps, data, palette, prefix,
                         OUT_DIR / "sprites" / "weapons" / folder, stats)

    print("Extracting projectiles...")
    for prefix in PROJECTILE_PREFIXES:
        save_sprite_lump(lumps, data, palette, prefix,
                         OUT_DIR / "sprites" / "projectiles", stats)

    print("Extracting pickups...")
    for prefix in PICKUP_PREFIXES:
        save_sprite_lump(lumps, data, palette, prefix,
                         OUT_DIR / "sprites" / "pickups", stats)

    print("Extracting sounds...")
    sounds_dir = OUT_DIR / "sounds"
    sounds_dir.mkdir(parents=True, exist_ok=True)
    for sound_name in SOUNDS:
        if sound_name not in by_name:
            stats["errors"].append(f"sound not found: {sound_name}")
            continue
        off, size = by_name[sound_name]
        result = decode_sound(data[off:off + size])
        if result is None:
            stats["errors"].append(f"sound decode failed: {sound_name}")
            continue
        sample_rate, pcm = result
        out_name = sound_name[2:].lower() if sound_name.startswith("DS") else sound_name.lower()
        save_wav(sounds_dir / f"{out_name}.wav", sample_rate, pcm)
        stats["sounds"] += 1

    print("Extracting flats (textures)...")
    tex_dir = OUT_DIR / "textures"
    tex_dir.mkdir(parents=True, exist_ok=True)
    for flat_name in FLATS:
        if flat_name not in by_name:
            stats["errors"].append(f"flat not found: {flat_name}")
            continue
        off, size = by_name[flat_name]
        img = decode_flat(data[off:off + size], palette)
        if img is None:
            stats["errors"].append(f"flat decode failed: {flat_name}")
            continue
        img.save(tex_dir / f"{flat_name.lower()}.png")
        stats["flats"] += 1

    print(f"\nDone:")
    print(f"  sprites: {stats['sprites']}")
    print(f"  sounds:  {stats['sounds']}")
    print(f"  flats:   {stats['flats']}")
    if stats["errors"]:
        print(f"\nIssues ({len(stats['errors'])}):")
        for e in stats["errors"][:20]:
            print(f"  - {e}")
        if len(stats["errors"]) > 20:
            print(f"  ... +{len(stats['errors']) - 20} more")


if __name__ == "__main__":
    main()
