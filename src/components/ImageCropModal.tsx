import React, { useEffect, useRef, useState } from "react";
import ReactCrop, { Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
// import { SketchPicker } from "react-color";
import * as Fa from "react-icons/fa";
import cropImage from "../utils/cropImage";
import _ from "lodash";

interface ImageCropModalProps {
  imageFile?: File | null;
  imageUrl?: string | null;
  onClose: () => void;
  onSave: (croppedImage: string, croppedFile: File) => void;
}

const ImageCropModal: React.FC<ImageCropModalProps> = ({
  imageFile,
  imageUrl,
  onClose,
  onSave,
}) => {
  const [crop, setCrop] = useState<Crop>({
    unit: "px",
    width: 100,
    height: 100,
    x: 0,
    y: 0,
  });
  const [imageRef, setImageRef] = useState<HTMLImageElement | null>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [zoom, setZoom] = useState<number>(1);
  const imageWrapperRef = useRef<HTMLDivElement | null>(null);

  const handleSave = async () => {
    const cropped = await cropImage(imageRef, crop, rotation);
    if (cropped === null) return;    
    const url = URL.createObjectURL(cropped);
    onSave(url, cropped);
    onClose();
  };

  const handleRotate = (direction: "left" | "right") => {
    const newRotation = direction === "left" ? rotation - 90 : rotation + 90;
    setRotation(newRotation);

    setCrop((prevCrop) => {
      const { width, height, x, y } = prevCrop;
      const isLandscape = width > height;

      if (newRotation % 180 !== 0) {
        return {
          ...prevCrop,
          width: height,
          height: width,
          x: isLandscape ? y : x,
          y: isLandscape ? x : y,
        };
      } else {
        return {
          ...prevCrop,
          width,
          height,
          x,
          y,
        };
      }
    });
  };

  const handleWheel = (event: WheelEvent) => {
    event.preventDefault();
    const delta = event.deltaY;
    setZoom((prevZoom) => {
      const newZoom = delta < 0 ? prevZoom + 0.1 : prevZoom - 0.1;
      return Math.min(Math.max(newZoom, 1), 3);
    });
  };

  useEffect(() => {
    const wrapper = imageWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("wheel", handleWheel, { passive: false });

      return () => {
        wrapper.removeEventListener("wheel", handleWheel);
      };
    }
  }, []);

  return (
    <div className="modal show d-block">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Resmi Kırp</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="topbar d-flex justify-content-between p-2">
            <div className="d-flex align-items-center">
              <button
                className="btn btn-secondary"
                onClick={() => handleRotate("left")}
              >
                <Fa.FaUndo />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => handleRotate("right")}
              >
                <Fa.FaRedo />
              </button>
            </div>
          </div>

          <div className="modal-body d-flex justify-content-center align-items-center">
            <div
              ref={imageWrapperRef}
              style={{
                overflow: "hidden",
                position: "relative",
                width: "100%",
                height: "100%",
              }}
            >
              <ReactCrop
                crop={crop}
                onChange={(newCrop) => setCrop(newCrop)}
                onComplete={(newCrop) => setCrop(newCrop)}
              >
                <img
                  src={
                    _.isNil(imageUrl)
                      ? _.isNil(imageFile)
                        ? ""
                        : URL.createObjectURL(imageFile)
                      : imageUrl
                  }
                  alt="Crop"
                  onLoad={(e) => {
                    setImageRef(e.currentTarget);
                    setCrop({
                      unit: "px",
                      width: e.currentTarget.width - 10,
                      height: e.currentTarget.height - 10,
                      x: 5,
                      y: 5,
                    });
                  }}
                  style={{
                    maxHeight: "70vh",
                    maxWidth: "100%",
                    overflowY: "auto",
                    transform: `rotate(${rotation}deg) scale(${zoom})`,
                    transition: "transform 0.3s",
                  }}
                />
              </ReactCrop>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Kapat
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Kaydet ve Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageCropModal;
