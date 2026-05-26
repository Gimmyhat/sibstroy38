#!/usr/bin/env bash
# Пакетная обработка изображений сайта СибСтрой38.
# Запускается вручную (один раз): bash process-images.sh
# Источник — img-src/ (бэкап оригиналов), результат — deploy/img/ (WebP).
set -e

export PATH="/c/Program Files/ImageMagick-7.1.2-Q16-HDRI:$PATH"

SRC=/c/Projects/Sibstroy38/img-src
DST=/c/Projects/Sibstroy38/deploy/img

# Чистим старые файлы кроме .webp (на случай повторных запусков)
rm -f "$DST"/renders/*.png "$DST"/renders/*.jpg
rm -f "$DST"/plans/*.png "$DST"/plans/*.jpg
rm -f "$DST"/constructs/*.png "$DST"/constructs/*.jpg
rm -f "$DST"/process/*.jpg "$DST"/process/*.png

echo "=== Renders (фасады) ==="
for f in "$SRC"/renders/*.{png,jpg}; do
  [ -f "$f" ] || continue
  name=$(basename "$f"); name="${name%.*}"
  magick "$f" \
    -resize '1920x1920>' \
    -auto-level \
    -modulate 100,118,100 \
    -unsharp 0x0.7+0.7+0.02 \
    -quality 84 \
    -define webp:method=6 \
    "$DST/renders/${name}.webp"
  echo "  renders/${name}.webp"
done

echo "=== Plans (3D-планировки) ==="
for f in "$SRC"/plans/*.{png,jpg}; do
  [ -f "$f" ] || continue
  name=$(basename "$f"); name="${name%.*}"
  magick "$f" \
    -trim +repage \
    -resize '1600x1600>' \
    -auto-level \
    -modulate 100,112,100 \
    -unsharp 0x0.5+0.6+0.02 \
    -quality 88 \
    -define webp:method=6 \
    "$DST/plans/${name}.webp"
  echo "  plans/${name}.webp"
done

echo "=== Constructs PNG (с подписями материалов — деликатно) ==="
for f in "$SRC"/constructs/*.png; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .png)
  magick "$f" \
    -trim +repage \
    -resize '1600x1600>' \
    -auto-level \
    -modulate 100,115,100 \
    -unsharp 0x0.4+0.5+0.02 \
    -quality 90 \
    -define webp:method=6 \
    "$DST/constructs/${name}.webp"
  echo "  constructs/${name}.webp"
done

echo "=== Constructs JPG (3D без подписей — больше контраст) ==="
for f in "$SRC"/constructs/*.jpg; do
  [ -f "$f" ] || continue
  name=$(basename "$f" .jpg)
  magick "$f" \
    -trim +repage \
    -resize '1600x1600>' \
    -auto-level \
    -modulate 100,122,100 \
    -unsharp 0x0.6+0.7+0.02 \
    -quality 84 \
    -define webp:method=6 \
    "$DST/constructs/${name}.webp"
  echo "  constructs/${name}.webp"
done

echo "=== Process (чертежи АР — только конвертация, без обработки) ==="
for f in "$SRC"/process/*.{jpg,png}; do
  [ -f "$f" ] || continue
  name=$(basename "$f"); name="${name%.*}"
  magick "$f" \
    -resize '1600x1600>' \
    -quality 82 \
    -define webp:method=6 \
    "$DST/process/${name}.webp"
done
echo "  process/*.webp (20 файлов)"

echo ""
echo "=== Итого ==="
echo "Оригиналы (img-src):"
du -sh "$SRC"
echo "Обработанные (deploy/img):"
du -sh "$DST"
echo ""
echo "По группам:"
du -sh "$DST"/*/
