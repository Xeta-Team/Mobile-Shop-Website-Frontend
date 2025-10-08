import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import HoverTranslateCard from "../Cards/HoverTranslateCard";

const HomeCarousel = ({ slides, title }) => {
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: 'start',
    dragFree: false,
    containScroll: 'trimSnaps',
    loop: false,        
    slidesToScroll: 1,  
  })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi])
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)


  useEffect(() => {
    if (!emblaApi) return

    const onSelect = () => {
      setSelectedIndex(emblaApi.selectedScrollSnap())
      setCanScrollPrev(emblaApi.canScrollPrev())
      setCanScrollNext(emblaApi.canScrollNext())
    }

    emblaApi.on("select", onSelect)
    onSelect()
  }, [emblaApi])

  return (
    <div className="relative mx-1">
      <div className="flex gap-2 justify-between mx-1 md:mx-8">
          {title ? <h1 className="text-5xl font-sans font-bold">{title}</h1> : 
          (<div className="bg-black rounded-full">
            <h1 className="mx-2 my-2 text-[12px] md:mx-4 md:my-4 md:text-[15px] font-semibold font-inter-sans text-white">Per-Owned Iphones</h1>
          </div>
          )}
        <div className="hidden md:flex gap-3">
          <button
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={`bg-black px-5 text-lg py-3 rounded-full shadow text-white ${
              !canScrollPrev
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:cursor-pointer'
            }`}
          >
            &lt;
          </button>

          <button
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={`bg-black px-5 text-lg py-3 rounded-full shadow text-white ${
              !canScrollNext
                ? 'opacity-50 cursor-not-allowed'
                : 'hover:cursor-pointer'
            }`}
          >
            &gt;
          </button>
        </div>
      </div>

      <div className="overflow-hidden w-full mt-5" ref={emblaRef}>
        <div className="flex m-auto w-full h-full gap-4 md:gap-0">
          {slides.map((card, index) => (
            <div key={index} className="flex-[0_0_70%] md:flex-[0_0_20%] md:ml-[25px]">
              <HoverTranslateCard card={card} index={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default HomeCarousel
