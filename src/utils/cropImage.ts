import { Crop } from "react-image-crop";

const cropImage = async (
  imageRef: HTMLImageElement | null,
  crop: Crop,
  rotation: number
): Promise<File | null> => {
  if (!imageRef || !crop.width || !crop.height) return null;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  canvas.width = crop.width;
  canvas.height = crop.height;

  const scaleX = imageRef.naturalWidth / imageRef.width;
  const scaleY = imageRef.naturalHeight / imageRef.height;

  ctx.save();
  ctx.translate(canvas.width / 2, canvas.height / 2);
  ctx.rotate((rotation * Math.PI) / 180);
  ctx.translate(-canvas.width / 2, -canvas.height / 2);
  ctx.drawImage(
    imageRef,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height
  );
  ctx.restore();

  return await new Promise((resolve) => {
    canvas.toBlob((blob) => {
      if (blob) {
        resolve(new File([blob], "cropped-image.png", { type: "image/png" }));
      } else {
        resolve(null);
      }
    });
  });
};

export default cropImage;