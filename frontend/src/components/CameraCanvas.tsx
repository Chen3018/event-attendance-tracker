import { useEffect, useRef, useState } from "react";

import { Camera } from "lucide-react";

export function CameraCanvas({ onCapture }: { onCapture: (blob: Blob) => void }) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);

    useEffect(() => {
        async function startCamera() {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });

            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        }

        startCamera();

        return () => {
            if (stream) {
                stream.getTracks().forEach((track) => track.stop());
            }
        };
    }, []);

    function capturePhoto() {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) return;

        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        const context = canvas.getContext("2d");
        if (!context) return;

        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        canvas.toBlob((blob) => {
            if (blob) {
                onCapture(blob);
            }
        }, "image/jpeg");
    }

    return (
        <div className="flex flex-col items-center gap-4">
            <video ref={videoRef} autoPlay playsInline/>
            <button onClick={capturePhoto} className="p-2 cursor-pointer rounded-full bg-white w-20 flex items-center justify-center active:bg-gray-200">
                <Camera color="black" />
            </button>
            <canvas ref={canvasRef} className="hidden" />
        </div>
    );
}