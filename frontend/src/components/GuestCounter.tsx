

export function GuestCounter({ entered, left }: { entered: number; left: number }) {
    return (
        <section className=" flex items-center justify-center">
            <div className="flex w-full max-w-2xl items-center">
                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 md:gap-2 md:py-8">
                    <div className="relative w-full overflow-hidden text-center">
                        <span className="block text-4xl md:text-6xl lg:text-8xl">
                            {entered}
                        </span>
                    </div>

                    <span className="text-sm md:text-base lg:text-lg">
                        Guests Entered
                    </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 md:gap-2 md:py-8">
                    <div className="relative w-full overflow-hidden text-center">
                        <span className="block text-4xl md:text-6xl lg:text-8xl">
                            {left}
                        </span>
                    </div>

                    <span className="text-sm md:text-base lg:text-lg">
                        Guests Left
                    </span>
                </div>

                <div className="flex flex-1 flex-col items-center justify-center gap-3 px-4 py-6 md:gap-2 md:py-8">
                    <div className="relative w-full overflow-hidden text-center">
                        <span className="block text-4xl md:text-6xl lg:text-8xl">
                            {entered - left}
                        </span>
                    </div>

                    <span className="text-sm md:text-base lg:text-lg">
                        Guests Currently Inside
                    </span>
                </div>
            </div>
        </section>
    )
}