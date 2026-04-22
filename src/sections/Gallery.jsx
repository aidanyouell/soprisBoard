import './Gallery.css'
import { useState, useRef } from 'react'
import gsap from 'gsap'
import { openLightbox } from '../App'

import gallery1 from '../assets/gallery1.jpg'
import gallery2 from '../assets/gallery2.png'
import gallery3 from '../assets/gallery3.jpg'
import gallery4 from '../assets/gallery4.jpg'
import gallery5 from '../assets/gallery5.jpg'
 
const GALLERY_IMAGES = [
  { id: 1, src: gallery1, alt: 'Gallery photo 1' },
  { id: 2, src: gallery2, alt: 'Gallery photo 2' },
  { id: 3, src: gallery3, alt: 'Gallery photo 3' },
  { id: 4, src: gallery4, alt: 'Gallery photo 4' },
  { id: 5, src: gallery5, alt: 'Gallery photo 5' },
]
 
export default function Gallery() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [transitioning, setTransitioning] = useState(false)
  const mainWrapRef = useRef(null)
 
  // Smooth crossfade when changing slides
  const goTo = (nextIndex) => {
    if (transitioning || nextIndex === activeIndex) return
    setTransitioning(true)
 
    gsap.to(mainWrapRef.current, {
      opacity: 0,
      scale: 0.97,
      duration: 0.22,
      ease: 'power2.in',
      onComplete: () => {
        setActiveIndex(nextIndex)
        gsap.to(mainWrapRef.current, {
          opacity: 1,
          scale: 1,
          duration: 0.35,
          ease: 'power2.out',
          onComplete: () => setTransitioning(false),
        })
      },
    })
  }
 
  const goToPrev = () =>
    goTo(activeIndex === 0 ? GALLERY_IMAGES.length - 1 : activeIndex - 1)
 
  const goToNext = () =>
    goTo(activeIndex === GALLERY_IMAGES.length - 1 ? 0 : activeIndex + 1)
 
  const active = GALLERY_IMAGES[activeIndex]
 
  return (
    <section id="gallery" className="section-panel gallery">
      <div className="gallery__header panel-content">
        <span className="section-subheading">In the wild</span>
        <h2 className="section-heading">GALLERY</h2>
      </div>
 
      {/* Main carousel */}
      <div className="gallery__carousel">
        <button
          className="gallery__arrow gallery__arrow--prev"
          onClick={goToPrev}
          aria-label="Previous image"
        >←</button>
 
        <div ref={mainWrapRef} className="gallery__main-wrap">
          {/* Click anywhere on the image to open lightbox */}
          <img
            className="gallery__main-img"
            src={active.src}
            alt={active.alt}
            onClick={() => openLightbox(active.src, active.alt)}
          />
          <button
            className="gallery__expand-btn"
            onClick={() => openLightbox(active.src, active.alt)}
            aria-label="Expand image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="15 3 21 3 21 9"/>
              <polyline points="9 21 3 21 3 15"/>
              <line x1="21" y1="3" x2="14" y2="10"/>
              <line x1="3" y1="21" x2="10" y2="14"/>
            </svg>
          </button>
          <span className="gallery__counter">
            {String(activeIndex + 1).padStart(2, '0')} /&nbsp;
            {String(GALLERY_IMAGES.length).padStart(2, '0')}
          </span>
        </div>
 
        <button
          className="gallery__arrow gallery__arrow--next"
          onClick={goToNext}
          aria-label="Next image"
        >→</button>
      </div>
 
      {/* Thumbnail strip */}
      <div className="gallery__thumbnails">
        {GALLERY_IMAGES.map((img, idx) => (
          <button
            key={img.id}
            className={`gallery__thumb${idx === activeIndex ? ' gallery__thumb--active' : ''}`}
            onClick={() => goTo(idx)}
            aria-label={`View ${img.alt}`}
          >
            <img className="gallery__thumb-img" src={img.src} alt={img.alt} />
          </button>
        ))}
      </div>
    </section>
  )
}