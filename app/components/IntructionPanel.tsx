'use client';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface InstructionsProps {
    onStart: () => void;
}

export function Instructions({ onStart }: InstructionsProps) {
    return (
        <Card className="max-w-2xl w-full mx-auto p-6 ">
            <h2 className="text-2xl font-bold  mb-6">Instructions</h2>
            <li className="flex gap-4  mb-4">
                <span className="">1.</span>
                <span>Ensure stable internet and choose a clean, quiet location.</span>
            </li>
            <li className="flex gap-4  mb-4">
                <span className="">2.</span>
                <span>Permission for access of camera, microphone, entire screen sharing is required.</span>
            </li>
            <li className="flex gap-4  mb-4">
                <span className="">3.</span>
                <span>Be in professional attire and avoid distractions.</span>
            </li>
            <li className="flex gap-4  mb-4">
                <span className="">4.</span>
                <span>Give a detailed response, providing as much information as you can.</span>
            </li>
            <li className="flex gap-4  mb-4">
                <span className="">5.</span>
                <span>Answer the question with examples and projects you’ve worked on.</span>
            </li>
            <Card
                className="bg-[#1e2227] rounded-lg p-6 mb-6 cursor-pointer hover:bg-[#252931] transition-colors"

            >
                <div className="flex items-center gap-2 text-purple-400">
                    <span>Click here</span>
                    <ExternalLink className="h-4 w-4" />
                </div>
                <p className="text-gray-300 mt-1">
                    to try a mock interview with Avya, our AI interviewer, and build your confidence before the main interview!
                </p>
            </Card>
            <Button
                className="w-full h-12 bg-purple-600 hover:bg-purple-700 transition-colors"
                onClick={onStart}
            >
                Start Now
            </Button>



        </Card>
    );
}