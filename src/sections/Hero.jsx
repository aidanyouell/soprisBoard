import { useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import soprisbgboard from '../assets/soprisbgboard.png'
import './Hero.css'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const contentRef = useRef(null)
  const hintRef = useRef(null)

  useLayoutEffect(() => {
    const content = contentRef.current
    const hint = hintRef.current

    // Fade out hero content as you scroll down
    gsap.to(content, {
      scrollTrigger: {
        trigger: content,
        start: 'top top',
        end: 'bottom center',
        scrub: 0.5,
        markers: false,
      },
      opacity: 0,
      y: -20,
      ease: 'power2.inOut',
    })

    // Fade out scroll hint
    gsap.to(hint, {
      scrollTrigger: {
        trigger: hint,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      },
      opacity: 0,
      ease: 'power2.inOut',
    })

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    }
  }, [])

  return (
    <section id="hero" className="section-panel hero">
      <div className="hero__bg-grid" aria-hidden="true" />

      <div ref={contentRef} className="hero__content panel-content">
        {/* Board image sits behind SOPRIS text */}
        <div className="hero__brand-wrap">
          <img
            className="hero__board-bg"
            src={soprisbgboard}
            alt=""
            aria-hidden="true"
            draggable={false}
          />
          <h1 className="hero__brand">SOPRIS</h1>
        </div>

        <div className="hero__stack">
          <span>RIDE.</span>
          <span>DETACH.</span>
          <span>CONQUER.</span>
        </div>
      </div>

      <div ref={hintRef} className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-label">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}