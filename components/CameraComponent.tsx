import React, { useState, useRef, useEffect } from 'react';
import CameraIcon from './icons/CameraIcon';

interface CameraComponentProps {
  onClose: () => void;
  onAnalyze: (base64Image: string) => Promise<void>;
}

const CameraComponent: React.FC<CameraComponentProps> = ({ onClose, onAnalyze }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error accessing camera:", err);
        setError("Could not access the camera. Please ensure you have granted permission.");
      }
    };

    startCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleCapture = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
        const dataUrl = canvas.toDataURL('image/jpeg');
        setCapturedImage(dataUrl);
        if (stream) {
          stream.getTracks().forEach(track => track.stop());
          setStream(null);
        }
      }
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        console.error("Error restarting camera:", err);
        setError("Could not restart the camera.");
      }
    };
    startCamera();
  };

  const handleAnalyzeClick = async () => {
    if (capturedImage) {
      setIsAnalyzing(true);
      // Remove the data URL prefix 'data:image/jpeg;base64,'
      const base64Data = capturedImage.split(',')[1];
      await onAnalyze(base64Data);
      // No need to set isAnalyzing to false here, as the component will be unmounted by the parent
    }
  };


  return (
    <div
      className="fixed inset-0 bg-black/80 flex justify-center items-center z-50 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg shadow-2xl w-full max-w-lg relative flex flex-col overflow-hidden"
      >
        <div className="p-4 flex justify-between items-center border-b border-slate-200 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Scan Your Meal</h2>
          {!isAnalyzing && (
            <button
              onClick={onClose}
              className="text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white text-2xl"
              aria-label="Close camera"
            >
              &times;
            </button>
          )}
        </div>
        <div className="aspect-video bg-black flex justify-center items-center">
            {error && <p className="text-white text-center p-4">{error}</p>}
            {!capturedImage && !error && (
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
            )}
            {capturedImage && (
              <img src={capturedImage} alt="Captured meal" className="w-full h-full object-cover" />
            )}
            {isAnalyzing && (
              <div className="absolute inset-0 bg-black/50 flex flex-col justify-center items-center text-white">
                <div className="h-8 w-8 border-4 border-t-emerald-500 border-r-emerald-500 border-b-emerald-500 border-l-white rounded-full animate-spin mb-4"></div>
                <p className="font-semibold">Analyzing your meal...</p>
                <p className="text-sm">This might take a moment.</p>
              </div>
            )}
        </div>
        <canvas ref={canvasRef} className="hidden" />

        <div className="p-4 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-200 dark:border-slate-700">
          {!capturedImage ? (
            <button
              onClick={handleCapture}
              disabled={!stream}
              className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-300 flex items-center justify-center gap-2 disabled:bg-emerald-400/50"
            >
              <CameraIcon className="h-6 w-6" />
              Capture Photo
            </button>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handleRetake}
                disabled={isAnalyzing}
                className="w-full bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-white px-4 py-3 rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors duration-300 disabled:opacity-50"
              >
                Retake
              </button>
              <button
                onClick={handleAnalyzeClick}
                disabled={isAnalyzing}
                className="w-full bg-emerald-500 text-white px-4 py-3 rounded-lg font-semibold hover:bg-emerald-600 transition-colors duration-300 disabled:opacity-50"
              >
                Analyze Food
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CameraComponent;