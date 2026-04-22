import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import './LogoReset.css'

const RING_COUNT = 5

export default function LogoReset({ onComplete }) {
  const overlayRef = useRef(null)
  const ringRefs   = useRef([])
  const wordRef    = useRef(null)

  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline({
      onComplete: () => {
        document.body.style.overflow = ''
        onComplete()
      },
    })

    // 1. Overlay snaps in instantly (no entrance delay)
    gsap.set(overlayRef.current, { opacity: 1 })

    // 2. Rings burst outward from center, staggered
    tl.fromTo(
      ringRefs.current,
      { scale: 0, opacity: 0.9 },
      {
        scale:    2.8,
        opacity:  0,
        duration: 0.9,
        stagger:  0.08,
        ease:     'power2.out',
      },
      0
    )

    // 3. SOPRIS word punches in at peak of ring burst
    tl.fromTo(
      wordRef.current,
      { opacity: 0, scale: 1.15 },
      { opacity: 1, scale: 1, duration: 0.25, ease: 'power3.out' },
      0.15
    )

    // 4. Hold briefly
    tl.to({}, { duration: 0.2 })

    // 5. Whole overlay flash-fades out
    tl.to(overlayRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
    })

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  return (
    <div ref={overlayRef} className="logo-reset" style={{ opacity: 0 }}>
      {/* Expanding rings */}
      {Array.from({ length: RING_COUNT }).map((_, i) => (
        <div
          key={i}
          ref={(el) => (ringRefs.current[i] = el)}
          className="logo-reset__ring"
          style={{ '--ring-index': i }}
        />
      ))}

      {/* Brand word */}
      <span ref={wordRef} className="logo-reset__word">SOPRIS</span>
    </div>
  )
}