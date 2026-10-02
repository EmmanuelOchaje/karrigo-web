/**
 * Shrinks a photo in the browser before it is uploaded. A phone camera
 * produces 4–8 MB; a licence or a plate of food is perfectly legible at
 * 1600px and a few hundred KB, and on Makurdi's mobile data that is the
 * difference between an upload that finishes and one that doesn't
 * (CLAUDE.md rule 6).
 *
 * If anything goes wrong — an odd format, an old browser — the original file
 * is returned and the server's size check has the final word.
 */
const MAX_EDGE = 1600;
const QUALITY = 0.82;

export async function shrinkImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
    const width = Math.round(bitmap.width * scale);
    const height = Math.round(bitmap.height * scale);

    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const context = canvas.getContext("2d");
    if (!context) return file;
    context.drawImage(bitmap, 0, 0, width, height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", QUALITY));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}
