import { useEffect, useRef, useState } from "react";
import { FaCamera, FaRedo } from "react-icons/fa";

export default function FaceCapture({ onCapture, disabled }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    async function startCamera() {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        setStream(mediaStream);
        videoRef.current.srcObject = mediaStream;
      } catch {
        setError("Não foi possível acessar a câmera");
      }
    }

    startCamera();
    return () => stream?.getTracks().forEach((t) => t.stop());
  }, []);

  const takePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0);

    canvas.toBlob((blob) => {
      if (!blob) return setError("Erro ao capturar imagem");
      onCapture(blob);
    }, "image/jpeg");
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 bg-red-50 text-red-700 rounded">
          {error}
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg border w-full max-w-md"
      />

      <canvas ref={canvasRef} className="hidden" />

      <div className="flex gap-3">
        <button
          type="button"
          onClick={takePhoto}
          disabled={disabled}
          className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded"
        >
          <FaCamera /> Capturar
        </button>

        <button
          type="button"
          onClick={() => window.location.reload()}
          className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded"
        >
          <FaRedo /> Refazer
        </button>
      </div>
    </div>
  );
}
