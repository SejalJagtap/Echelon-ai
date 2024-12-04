'use client'

import { useState, useEffect, useRef, useCallback } from "react"

interface UseVideoStreamProps {
    hasPermission: boolean;
}

interface UseVideoStreamReturn {
    videoRef: React.RefObject<HTMLVideoElement>;
    error: boolean;
}


export function useVideoStream({ hasPermission }: UseVideoStreamProps): UseVideoStreamReturn {
    const videoRef = useRef<HTMLVideoElement>(null);
    const streamRef = useRef<MediaStream | null>(null)
    const [error, setError] = useState(false);
    const stopStream = useCallback(() => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach(track => track.stop());
            streamRef.current = null;
        }
    }, []);

    useEffect(() => {
        async function setupVideoStream() {
            try {
                if (hasPermission && videoRef.current) {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        video: true,
                        audio: false,
                    });

                    streamRef.current = stream;
                    videoRef.current.srcObject = stream;
                    setError(false);
                }
            } catch (err) {
                console.error('Error accessing camera:', err);
                setError(true);
            }
        }

        if (hasPermission) {
            setupVideoStream();
        } else {
            stopStream();
        }

        return stopStream;
    }, [hasPermission, stopStream]);

    return { videoRef, error };
}