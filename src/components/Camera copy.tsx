import "./Camera.scss";
import React, { useState, useRef, useEffect, useMemo } from "react";
import * as CONSTANTS from "../constants";
import _ from "lodash";
import { ImageCropModal } from ".";

interface CameraProps {
  photo: string | null;
  setPhoto: React.Dispatch<React.SetStateAction<string | null>>;
  onSave: (url: string, file: File) => void;
}

const Camera: React.FC<CameraProps> = ({
  photo,
  setPhoto,
  onSave,
}) => {
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedDevice, setSelectedDevice] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPhotoMode, setIsPhotoMode] = useState(false);

  useEffect(() => {
    getDevices();
    return () => {
      stopCamera(videoRef);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const getDevices = async () => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
      alert("Tarayıcınız kamera erişimini desteklemiyor.");
    }

    try {
      const allDevices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = allDevices.filter(
        (device) => device.kind === "videoinput"
      );

      const workingDevices: MediaDeviceInfo[] = [];
      for (const device of videoDevices) {
        const isWorking = await testCamera(device.deviceId);
        if (isWorking) {
          workingDevices.push(device);
        }
      }

      setDevices(workingDevices);
      if (workingDevices.length > 0) {
        startCamera(workingDevices[0].deviceId);
      }
    } catch (error) {
      console.error("Cihazlar listelenemedi:", error);
    }
  };

  const testCamera = async (deviceId: string): Promise<boolean> => {
    try {
      const testStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId },
      });
      testStream.getTracks().forEach((track) => track.stop());
      return true;
    } catch {
      return false;
    }
  };

  const startCamera = async (deviceId: string) => {
    try {
      stopCamera(videoRef);
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { deviceId },
        audio: false,
      });
      if (videoRef.current) {
        videoRef.current.srcObject = newStream;
      }
      setSelectedDevice(deviceId);
    } catch {
      alert("Kamera başlatılamadı");
    }
  };

  const stopCamera = async (
    videoRef: React.RefObject<HTMLVideoElement | null>
  ) => {
    if (videoRef.current && videoRef.current.srcObject instanceof MediaStream) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    const devices = await navigator.mediaDevices.enumerateDevices();

    devices.forEach(async (device) => {
      if (device.kind === "videoinput") {
        console.log(device);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { deviceId: device.deviceId },
        });
        const tracks = stream.getTracks();
        tracks.forEach((track) => {
          if (track.readyState === "live") {
            console.log(device.label, track.readyState);
            track.stop();
            console.log(device.label, track.readyState);
          }
        });
      }
    });
  };

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const video = videoRef.current;

      const context = canvas.getContext("2d");
      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageUrl = canvas.toDataURL("image/png");
        setPhoto(imageUrl);
        setIsPhotoMode(true);
      }
    }
    stopCamera(videoRef);
  };

  const switchCamera = () => {
    if (devices.length > 0 && selectedDevice) {
      const currentIndex = devices.findIndex(
        (device) => device.deviceId === selectedDevice
      );
      const nextIndex = (currentIndex + 1) % devices.length;
      startCamera(devices[nextIndex].deviceId);
    }
  };

  const resetToCameraMode = () => {
    setIsPhotoMode(false);
    startCamera(selectedDevice!);
  };

  const showApp = useMemo(() => {
    if (_.isEmpty(devices)) {
      return (
        <div>
          <p>
            Kamera izni verilmedi. Kamera erişimine izin vermeniz gerekiyor.
          </p>
          <button onClick={() => getDevices()} className="btn btn-primary">
            İzin Ver
          </button>
        </div>
      );
    }

    return (
      <>
        {!isPhotoMode ? (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="video"
          ></video>
        ) : (
          photo && (
            <ImageCropModal
              imageUrl={photo}
              onClose={() => resetToCameraMode()}
              onSave={onSave}
            />
          )
        )}
        <button
          onClick={isPhotoMode ? resetToCameraMode : captureImage}
          className="action-btn"
        >
          {isPhotoMode ? (
            <CONSTANTS.Feather.FiRefreshCw />
          ) : (
            <CONSTANTS.Feather.FiCamera />
          )}
        </button>
        <button
          onClick={isPhotoMode ? () => {} : switchCamera}
          className="switch-btn"
        >
          {isPhotoMode ? (
            <CONSTANTS.Feather.FiCrop />
          ) : (
            <CONSTANTS.Feather.FiRefreshCw />
          )}
        </button>
        <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
      </>
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [devices, selectedDevice, isPhotoMode]);

  return (
    <div className="text-center">
      <div className="camera-container p-2">{showApp}</div>
      {!_.isEmpty(devices) && !_.isEmpty(selectedDevice) && (
        <p>{`Kamera : ${
          devices.findIndex((x) => x.deviceId === selectedDevice) + 1
        }/${devices.length}`}</p>
      )}
    </div>
  );
};

export default Camera;
