const ACCEPTED_TYPES = ["image/png", "image/jpeg", "image/webp", "image/gif"];
/** Source files above this are rejected before any decoding. */
const MAX_SOURCE_BYTES = 8 * 1024 * 1024;
const AVATAR_SIZE = 256;
/**
 * The picture is stored in the user record as a data URL and comes back with every
 * session lookup, so keep it small. 256px JPEGs are normally 15-35 KB.
 */
const MAX_AVATAR_CHARS = 90_000;
const QUALITIES = [0.85, 0.7, 0.55, 0.4];

export class AvatarError extends Error {}

/**
 * Center-crops an image to a square and re-encodes it as a small JPEG data URL, so users
 * can pick any photo without it bloating their account or needing file storage.
 */
export async function imageFileToAvatar(file: File): Promise<string> {
    if (!ACCEPTED_TYPES.includes(file.type)) {
        throw new AvatarError("Choose a PNG, JPEG, WebP or GIF image.");
    }
    if (file.size > MAX_SOURCE_BYTES) {
        throw new AvatarError("That image is too large. Choose one under 8 MB.");
    }

    let bitmap: ImageBitmap;
    try {
        bitmap = await createImageBitmap(file);
    } catch {
        throw new AvatarError("That file could not be read as an image.");
    }

    const side = Math.min(bitmap.width, bitmap.height);
    const canvas = document.createElement("canvas");
    canvas.width = AVATAR_SIZE;
    canvas.height = AVATAR_SIZE;
    const context = canvas.getContext("2d");
    if (!context) {
        bitmap.close();
        throw new AvatarError("Your browser could not process that image.");
    }

    // JPEG has no alpha, so transparent PNGs would turn black without a backdrop.
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, AVATAR_SIZE, AVATAR_SIZE);
    context.drawImage(
        bitmap,
        (bitmap.width - side) / 2,
        (bitmap.height - side) / 2,
        side,
        side,
        0,
        0,
        AVATAR_SIZE,
        AVATAR_SIZE,
    );
    bitmap.close();

    for (const quality of QUALITIES) {
        const dataUrl = canvas.toDataURL("image/jpeg", quality);
        if (dataUrl.length <= MAX_AVATAR_CHARS) {
            return dataUrl;
        }
    }

    throw new AvatarError("That image is too detailed to use. Try another one.");
}
