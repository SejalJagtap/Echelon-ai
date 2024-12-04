'use client';

import { useState, useEffect } from 'react';
import { Camera, Mic, Speaker, MonitorUp, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert'
import { useToast } from '@/hooks/use-toast';

interface PermissionStatus {
    camera: boolean;
    microphone: boolean;
    speaker: boolean;
    screenShare: boolean;
}

export function PermissionPanel() {
    const [permissions, setPermissions] = useState<PermissionStatus>({
        camera: false,
        microphone: false,
        speaker: false,
        screenShare: false,
    });
    const [currentPermission, setCurrentPermission] = useState<keyof PermissionStatus | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [streams, setStreams] = useState<{ [key: string]: MediaStream | null }>({});
    const { toast } = useToast();

    const cleanupStreams = () => {
        Object.values(streams).forEach(stream => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
        });
    };

    const requestPermission = async (type: keyof PermissionStatus, manual: boolean = false) => {
        setCurrentPermission(type);
        setError(null);

        try {
            let stream: MediaStream | null = null;

            switch (type) {
                case 'camera':
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: {
                            width: { ideal: 1280 },
                            height: { ideal: 720 }
                        }
                    });
                    setStreams(prev => ({ ...prev, camera: stream }));
                    break;

                case 'microphone':
                    stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true
                        }
                    });
                    setStreams(prev => ({ ...prev, microphone: stream }));
                    break;

                case 'speaker':
                    const audioContext = new AudioContext();
                    const oscillator = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    oscillator.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    gainNode.gain.value = 0.1;
                    oscillator.frequency.value = 440;

                    oscillator.start();
                    await new Promise(resolve => setTimeout(resolve, 200));
                    oscillator.stop();
                    await audioContext.close();
                    break;

                case 'screenShare':
                    stream = await navigator.mediaDevices.getDisplayMedia({
                        video: true,
                        audio: true
                    });
                    setStreams(prev => ({ ...prev, screenShare: stream }));
                    break;
            }

            setPermissions(prev => ({ ...prev, [type]: true }));
            toast({
                title: "Permission Granted",
                description: `${type.charAt(0).toUpperCase() + type.slice(1)} access granted successfully.`,
            });


            if (manual && stream) {
                stream.getTracks().forEach(track => track.stop());
                setStreams(prev => ({ ...prev, [type]: null }));
            }
        } catch (err) {
            console.error(`Error requesting ${type} permission:`, err);
            setError(`${type} permission denied. Please grant access and try again.`);
            toast({
                variant: "destructive",
                title: "Permission Denied",
                description: `Unable to access ${type}. Please check your settings.`,
            });
        }
    };

    useEffect(() => {
        const checkNextPermission = async () => {
            const types: (keyof PermissionStatus)[] = ['camera', 'microphone', 'speaker', 'screenShare'];
            const nextType = types.find(type => !permissions[type]);

            if (nextType && !error && !currentPermission) {
                await requestPermission(nextType, false);
            }
        };

        checkNextPermission();

        return () => {
            cleanupStreams();
        };
    }, [permissions, currentPermission, error]);

    const allPermissionsGranted = Object.values(permissions).every(Boolean);

    const handleManualPermissionRequest = async (type: keyof PermissionStatus) => {
        setCurrentPermission(null);
        await requestPermission(type, true);
    };

    return (
        <div className="max-w-md w-full mx-auto space-y-6 p-6">
            <div className="text-center space-y-2">
                <h2 className="text-2xl font-bold ">Ready to join?</h2>
                <p className="text-gray-400">Please make sure your device is properly configured.</p>
            </div>

            {error && (
                <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between h-14 text-left",
                        permissions.camera && "border-green-500"
                    )}
                    onClick={() => handleManualPermissionRequest('camera')}
                >
                    <div className="flex items-center gap-3">
                        <Camera className="h-5 w-5" />
                        <span>Check Camera</span>
                    </div>
                    {permissions.camera && (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between h-14 text-left",
                        permissions.microphone && "border-green-500"
                    )}
                    onClick={() => handleManualPermissionRequest('microphone')}
                >
                    <div className="flex items-center gap-3">
                        <Mic className="h-5 w-5" />
                        <span>Check Microphone</span>
                    </div>
                    {permissions.microphone && (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between h-14 text-left",
                        permissions.speaker && "border-green-500"
                    )}
                    onClick={() => handleManualPermissionRequest('speaker')}
                >
                    <div className="flex items-center gap-3">
                        <Speaker className="h-5 w-5" />
                        <span>Check Speaker</span>
                    </div>
                    {permissions.speaker && (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    )}
                </Button>

                <Button
                    variant="outline"
                    className={cn(
                        "w-full justify-between h-14 text-left",
                        permissions.screenShare && "border-green-500"
                    )}
                    onClick={() => handleManualPermissionRequest('screenShare')}
                >
                    <div className="flex items-center gap-3">
                        <MonitorUp className="h-5 w-5" />
                        <span>Enable Screen Share</span>
                    </div>
                    {permissions.screenShare && (
                        <div className="h-4 w-4 rounded-full bg-green-500" />
                    )}
                </Button>
            </div>

            <Button
                className="w-full h-12 mt-6 bg-purple-600 hover:bg-purple-700"
                disabled={!allPermissionsGranted}
            >
                Start Interview
            </Button>
        </div>
    );
}