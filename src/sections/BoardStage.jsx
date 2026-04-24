import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import splitLeft  from '../assets/split left.png'
import splitRight from '../assets/split right.png'
import './BoardStage.css'

gsap.registerPlugin(ScrollTrigger)

export default function BoardStage() {
  const sectionRef = useRef(null)
  const leftRef    = useRef(null)
  const rightRef   = useRef(null)
  const labelRef   = useRef(null)
  const glowRef    = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    const left    = leftRef.current
    const right   = rightRef.current
    const label   = labelRef.current
    const glow    = glowRef.current

    // Pin for 1200px of scroll travel
    const pin = ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: '+=1500', // Increased from 1200 for a slower, smoother effect
      pin: true,
      pinSpacing: false,
      anticipatePin: 1,
    })

    const tl = gsap.timeline({ paused: true })

    // Fade in the entire assembly when section comes into view
    gsap.fromTo(section,
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 80%',
          once: true,
        },
      }
    )

    // Phase 1 (0–0.3): board sits, label fades in
    tl.fromTo(label,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' },
      0
    )

    // Phase 2 (0.3–0.75): pieces separate
    // Left: body + tang slides left (tang pulls out of slot)
    tl.to(left, {
      x: '-35vw', // Increase this value (e.g., 40vw to 50vw)
      ease: 'power1.inOut',
      duration: 1,
    }, 0.3)

    tl.to(right, {
      x: '35vw', // Match the increase here
      y: '1.5vh', 
      ease: 'power1.inOut',
      duration: 1,
    }, 0.3)

    // Phase 3 (0.72–1.0): dissolve — blur, scale, fade
    tl.to([left, right], {
      opacity: 0,
      scale:   0.88,
      filter:  'blur(20px)',
      duration: 0.28,
      ease:    'power2.in',
      stagger:  0.04,
    }, 0.72)

    // Fade glow and label out with the pieces — no lingering
    tl.to(glow,
      { opacity: 0, duration: 0.28, ease: 'power2.in' },
      0.72
    )
    tl.to(label,
      { opacity: 0, y: -8, duration: 0.2, ease: 'power2.in' },
      0.76
    )

    // Scrub the timeline against scroll
    const scrub = ScrollTrigger.create({
      trigger:   section,
      start:     'top top',
      end:       '+=1200',
      scrub:     1.4,
      animation: tl,
    })

    return () => {
      pin.kill()
      scrub.kill()
      tl.kill()
    }
  }, [])

  return (
    <section
      id="board-stage"
      ref={sectionRef}
      className="section-panel board-stage"
    >
      <div ref={glowRef} className="board-stage__bg-glow" aria-hidden="true" />

      <div className="board-stage__assembly">
        <img
          ref={leftRef}
          className="board-stage__left"
          src={splitLeft}
          alt="Snowboard body"
          draggable={false}
        />
        <img
          ref={rightRef}
          className="board-stage__right"
          src={splitRight}
          alt="Detachable snowboard tail"
          draggable={false}
        />
      </div>

      <div ref={labelRef} className="board-stage__label">
        <span className="section-subheading"></span>
        <p className="board-stage__desc"></p>
      </div>
    </section>
  )
}