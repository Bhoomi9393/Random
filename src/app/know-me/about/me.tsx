"use client";

import { useEffect, useRef } from "react";
import SplitType from "split-type";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export default function AboutMe() {
    const aboutRef = useRef<HTMLParagraphElement>(null);

    useEffect(() => {
        if (!aboutRef.current) return;
        const split = new SplitType(aboutRef.current, { types: "words" });

        gsap.registerPlugin(ScrollTrigger);

        gsap.from(split.words, {
            opacity: 0,
            y: 20,
            stagger: 0.02,
            filter: "blur(6px)",
            duration: 2,
            ease: "power2.out",
            scrollTrigger: {
                trigger: aboutRef.current,
                start: "top 70%"
            },
        });
        return() => split.revert();
    }, []);

    return (
        <div className="px-16">
            <h3 className="mt-14 text-5xl font-bold outlined-text">
                About me
            </h3>
            <p ref={aboutRef} className="mt-6 text-xl leading-relaxed text-yellow-100">
                Meet me: part amateur philosopher, part overqualified daydreamer, and part human encyclopedia 
                for things that don't fit in    small talk — mainly because small talk is what happens when brains go on standby. 
                I'm the person in the back of the room who isn't nodding. Not because I disagree. Just because I haven't finished checking. 
                While everyone else has happily accepted the conclusion and is thinking about lunch, 
                I'm still looking for the missing step between "trust me" and "therefore". 
                I don't consume culture so much as interrogate it, preferably with footnotes. 
                My inner world is overstaffed, undermanaged, and most of the time in emergency meeting mode. 
                Trends come and go; I'm usually too busy wondering why anything matters to notice. 
                Being in the moment sounds nice, but my brain's already three scenes ahead in the movie it's directing.
                <br/><br/>
                I don't enjoy certainty nearly as much as I enjoy understanding.
                I want extraordinary things, but I'm also old enough to know that wanting them isn't enough.
                So I live in an uncomfortable place between ambition and doubt.
            </p>
        </div>
    );
}