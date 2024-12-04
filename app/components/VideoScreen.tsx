'use client'
import { useVideoStream } from "../hooks/useVideoStream";
import { Card } from "@/components/ui/card";
import { Camera, XCircle } from 'lucide-react';
interface VideoScreenProps {
    hasPermission: boolean;
}

export function VideoScreen({ hasPermission }: VideoScreenProps) {
    const { videoRef, error } = useVideoStream({
        hasPermission
    })

    return (
        <Card className="aspect-video bg-muted flex items-center justify-center overflow-hidden relative sm:h-[20em] sm:w-[30em] md:h-[20em] md:w-[30em] lg:w-[40em] lg:h-[25em] mx-8">
            {hasPermission ? (
                <>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className="w-full h-full object-cover"
                    />
                    {error && (
                        <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                            <div className="text-center space-y-2">
                                <XCircle className="h-10 w-10 text-destructive mx-auto" />
                                <p className="text-sm text-muted-foreground">Camera access error</p>
                            </div>
                        </div>
                    )}
                </>
            ) : (
                <Camera className="h-20 w-20 " />
            )}
        </Card>
    )

}