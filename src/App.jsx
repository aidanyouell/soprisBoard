import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Navbar     from './components/Navbar'
import Lightbox   from './components/Lightbox'
import Hero       from './sections/Hero'
import BoardStage from './sections/BoardStage'
import Logo       from './sections/Logo'
import Features   from './sections/Features'
import Specs      from './sections/Specs'
import Gallery    from './sections/Gallery'

import './index.css'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

// Expose a setter so any section can open the lightbox
export let openLightbox = () => {}

export default function App() {
  const wrapperRef  = useRef(null)
  const progressRef = useRef(null)
  const lenisRef    = useRef(null)

  const [lightboxImg, setLightboxImg] = useState(null)
  openLightbox = (src, alt) => setLightboxImg({ src, alt })

  useLayoutEffect(() => {
    // ── 1. Lenis smooth scroll ─────────────────────────────
    const lenis = new Lenis({
      duration:  1.4,          // how long a scroll "coast" lasts
      easing:    (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis = lenis  // expose for navbar click handler

    // Wire Lenis into GSAP's ticker so ScrollTrigger stays in sync
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // ── 2. GSAP scroll animations ──────────────────────────
    const ctx = gsap.context(() => {
      const panels = gsap.utils.toArray('.section-panel')

      // Global progress bar
      ScrollTrigger.create({
        start: 'top top',
        end:   'bottom bottom',
        onUpdate: (self) => {
          if (progressRef.current)
            progressRef.current.style.width = `${self.progress * 100}%`
        },
      })

      panels.forEach((panel, i) => {
        const isLast = i === panels.length - 1

        // ── PIN each panel (except last) ──
        if (!isLast) {
          ScrollTrigger.create({
            trigger:     panel,
            start:       'top top',
            end:         '+=600',
            pin:         true,
            pinSpacing:  true,
            anticipatePin: 1,
            // markers: true,   // ← uncomment to debug pin positions
          })

          // ── OUTRO: scale + fade out while pinned ──
          gsap.to(panel, {
            opacity:  0,
            scale:    0.94,
            y:        -50,
            ease:     'none',
            scrollTrigger: {
              trigger: panel,
              start:   'top top',
              end:     '+=600',
              scrub:   1,
            },
          })
        }

        // ── INTRO: slide up + fade in ──
        gsap.fromTo(
          panel,
          { opacity: 0, y: 80 },
          {
            opacity:  1,
            y:        0,
            duration: 1,
            ease:     'power3.out',
            scrollTrigger: {
              trigger:       panel,
              start:         'top 90%',
              toggleActions: 'play none none reverse',
            },
          }
        )

        // ── Active class for accent hairline ──
        ScrollTrigger.create({
          trigger:     panel,
          start:       'top 55%',
          end:         'bottom 45%',
          onEnter:     () => panel.classList.add('is-active'),
          onLeave:     () => panel.classList.remove('is-active'),
          onEnterBack: () => panel.classList.add('is-active'),
          onLeaveBack: () => panel.classList.remove('is-active'),
        })

        // ── Stagger children into view ──
        const children = panel.querySelectorAll('.panel-content > *')
        if (children.length) {
          gsap.fromTo(
            children,
            { opacity: 0, y: 36 },
            {
              opacity:  1,
              y:        0,
              duration: 0.7,
              stagger:  0.13,
              ease:     'power2.out',
              scrollTrigger: {
                trigger:       panel,
                start:         'top 80%',
                toggleActions: 'play none none reverse',
              },
            }
          )
        }
      })

      // ── Refresh AFTER fonts + images settle ──────────────
      // This is the key fix: fonts / images shift layout after
      // first paint and throw off ScrollTrigger's measurements.
      window.addEventListener('load', () => ScrollTrigger.refresh())
      // Belt-and-suspenders: also refresh after a short delay
      setTimeout(() => ScrollTrigger.refresh(), 500)

    }, wrapperRef)

    return () => {
      ctx.revert()
      lenis.destroy()
      gsap.ticker.remove((time) => lenis.raf(time * 1000))
    }
  }, [])

  return (
    <>
      <div id="scroll-progress" ref={progressRef} />
      <Navbar />

      <div ref={wrapperRef}>
        <Hero />
        <BoardStage />
        <Logo />
        <Features />
        <Specs />
        <Gallery />
      </div>

      {lightboxImg && (
        <Lightbox
          src={lightboxImg.src}
          alt={lightboxImg.alt}
          onClose={() => setLightboxImg(null)}
        />
      )}
    </>
  )
}