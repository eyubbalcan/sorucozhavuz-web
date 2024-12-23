import "./Camera.scss";
import React, { useState, useEffect, useMemo, useRef } from "react";
import * as CONSTANTS from "../constants";
import { ImageCropModal } from ".";
import Webcam from "react-webcam";

interface CameraProps {
  photo: string | null;
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  onSave: (url: string, file: File) => void;
}

const Camera: React.FC<CameraProps> = ({ photo, setPhoto, onSave }) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDeviceId, setSelectedDeviceId] = useState<string | null>(null);
  const [isPhotoMode, setIsPhotoMode] = useState(false);
  const [webcamKey, setWebcamKey] = useState(0);
  const webcamRef = useRef<Webcam>(null);

  useEffect(() => {
    getDevices();
  }, []);

  const getDevices = async () => {
    if (!navigator.mediaDevices?.enumerateDevices) {
      alert("Tarayıcınız kamera erişimini desteklemiyor.");
      return;
    }

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(
        (device) => device.kind === "videoinput"
      );
      setDevices(videoDevices);

      if (videoDevices.length > 0) {
        setSelectedDeviceId(videoDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Cihazlar listelenemedi:", error);
    }
  };

  const captureImage = () => {
    if (!webcamRef.current) return;
    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      setPhoto(imageSrc);
      setIsPhotoMode(true);
    }
  };

  const switchCamera = () => {
    if (devices.length > 1 && selectedDeviceId) {
      const currentIndex = devices.findIndex(
        (device) => device.deviceId === selectedDeviceId
      );
      const nextIndex = (currentIndex + 1) % devices.length;
      setSelectedDeviceId(devices[nextIndex].deviceId);
      setWebcamKey((prev) => prev + 1);
    }
  };

  const resetToCameraMode = () => {
    setIsPhotoMode(false);
  };

  const showApp = useMemo(() => {
    if (devices.length === 0) {
      return (
        <div>
          <p>
            Kamera izni verilmedi. Kamera erişimine izin vermeniz gerekiyor.
          </p>
          <button onClick={getDevices} className="btn btn-primary">
            İzin Ver
          </button>
        </div>
      );
    }

    return (
      <>
        {!isPhotoMode ? (
          <Webcam
            key={webcamKey}
            ref={webcamRef}
            audio={false}
            screenshotFormat="image/png"
            videoConstraints={{
              deviceId: selectedDeviceId
                ? { exact: selectedDeviceId }
                : undefined,
            }}
            className="video"
            muted
            playsInline
            autoPlay
          />
        ) : (
          photo && (
            <ImageCropModal
              imageUrl={photo}
              onClose={resetToCameraMode}
              onSave={onSave}
            />
          )
        )}
        <button
          onClick={() => {
            captureImage();
          }}
          className="action-btn"
        >
          {isPhotoMode ? (
            <CONSTANTS.Feather.FiRefreshCw />
          ) : (
            <CONSTANTS.Feather.FiCamera />
          )}
        </button>
        <button onClick={switchCamera} className="switch-btn">
          <CONSTANTS.Feather.FiRefreshCw />
        </button>
      </>
    );
  }, [devices, selectedDeviceId, isPhotoMode, photo]);

  return (
    <div className="text-center">
      <div className="camera-container p-2">{showApp}</div>
      {!isPhotoMode && devices.length > 1 && (
        <p>{`Kamera : ${
          devices.findIndex((device) => device.deviceId === selectedDeviceId) +
          1
        }/${devices.length}`}</p>
      )}
    </div>
  );
};

export default Camera;
