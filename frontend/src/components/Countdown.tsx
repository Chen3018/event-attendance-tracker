import { useAnimate } from "framer-motion";

import { useEffect, useRef, useState } from "react";

export function Countdown({ end_time }: { end_time: string }) {
    const SECOND = 1000;
    const MINUTE = SECOND * 60;
    const HOUR = MINUTE * 60;
    const DAY = HOUR * 24;

    function CountdownItem({ unit, label } : { unit: string; label: string }) {
        const { ref, time } = useTimer( unit );
        const display = unit === "Seconds" ? String(time).padStart(2, '0') : time;

        return (
            <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 md:gap-2 md:py-8">
                <div className="relative w-full overflow-hidden text-center">
                    <span ref={ref} className="block text-4xl md:text-6xl lg:text-8xl">
                        {display}
                    </span>
                </div>

                <span className="text-sm md:text-base lg:text-lg">
                    {label}
                </span>
            </div>
        )
    }

    function useTimer(unit: string) {
        const [ref, animate] = useAnimate();
        const intervalRef = useRef<number | null>(null);
        const timeRef = useRef(0);
        const [time, setTime] = useState(0);

        const handleCountdown = async () => {
            const end = new Date(end_time);
            const now = new Date();
            const diff = end.getTime() - now.getTime();

            let newTime = 0;
            switch (unit) {
                case "Day":
                    newTime = Math.max(0, Math.floor(diff / DAY));
                    break;
                case "Hour":
                    newTime = Math.max(0, Math.floor((diff % DAY) / HOUR));
                    break;
                case "Minute":
                    newTime = Math.max(0, Math.floor((diff % HOUR) / MINUTE));
                    break;
                default:
                    newTime = Math.max(0, Math.floor((diff % MINUTE) / SECOND));
                    break;
            }

            if (newTime !== timeRef.current) {
                await animate(
                    ref.current,
                    { y: ["0%", "-50%"], opacity: [1, 0] },
                    { duration: 0.25 }
                );

                timeRef.current = newTime;
                setTime(newTime);

                await animate(
                    ref.current,
                    { y: ["50%", "0%"], opacity: [0, 1] },
                    { duration: 0.25 }
                );
            }

        };

        useEffect(() => {
            handleCountdown();
            intervalRef.current = setInterval(handleCountdown, 1000);
            return () => { if (intervalRef.current !== null) clearInterval(intervalRef.current); };
        }, []);

        return { ref, time };
    }

    return (
        <section className=" flex items-center justify-center p-4">
            <div className="flex w-full max-w-2xl items-center">
                <CountdownItem unit="Day" label="Days" />
                <CountdownItem unit="Hour" label="Hours" />
                <CountdownItem unit="Minute" label="Minutes" />
                <CountdownItem unit="Seconds" label="Seconds" />
            </div>
        </section>
    )
}