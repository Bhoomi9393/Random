"use client"

import Hero from "./hero/page";
import AboutMe from "./about/me";
import LikePage from "./about/like/likePage";
import Warning from "./alerts/warning";
import Scanning from "./alerts/scanning";
import Fooled from "./alerts/fooled";
import Sidebar from "./components/sidebar";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";

function KnowContent() {
    const searchParams = useSearchParams();
    const [step, setstep] = useState(0);
    const [hasCheckedVisit, setHasCheckedVisit] = useState(false);
    const cameFromBored = searchParams.get("from") === "bored";

    useEffect(() => {
        if (typeof window === "undefined") return;

        setstep(cameFromBored ? 1 : 4);
        setHasCheckedVisit(true);
    }, [cameFromBored]);

    if (!hasCheckedVisit) {
        return null;
    }

    return(
        <main className="bg-black">
            {step === 1 && <Warning setStep = {setstep}/>}
            {step === 2 && <Scanning setStep = {setstep}/>}
            {step === 3 && <Fooled setStep = {setstep}/>}
            {step === 4 && (
                <div className="flex min-h-screen bg-black text-white">
                    <Sidebar />
                    <div className="flex-1">
                        <Hero/>
                        <AboutMe/>
                        <LikePage/>
                    </div>
                </div>
            )}
        </main>
    );
}

export default function Know(){
    return (
        <Suspense fallback={null}>
            <KnowContent />
        </Suspense>
    );
}