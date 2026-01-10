"use client";

import dynamic from "next/dynamic";

const LightRays = dynamic(() => import("./LightRays"), {
    ssr: false,
});

export default function LightRaysBG() {
    return (
        <div className="fixed inset-0 z-0 pointer-events-none">
            <LightRays
                raysOrigin="top-center-offset"
                raysColor="#5dfeca"
                raysSpeed={0.5}
                lightSpread={0.9}
                rayLength={1.4}
                followMouse
                mouseInfluence={0.1}
                noiseAmount={0.0}
                distortion={0.01}
            />
        </div>
    );
}
