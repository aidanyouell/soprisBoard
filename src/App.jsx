import { useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Navbar     from './components/Navbar'
import Lightbox   from './components/Lightbox'
import Hero       from './sections/Hero'
import BoardStage from './sections/BoardStage'
import Features   from './sections/Features'
import Specs      from './sections/Specs'
import Gallery    from './sections/Gallery'

import './index.css'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

export let openLightbox = () => {}

export default function App() {
  const wrapperRef  = useRef(null)
  const progressRef = useRef(null)
  const lenisRef    = useRef(null)

  const [lightboxImg, setLightboxImg] = useState(null)
  openLightbox = (src, alt) => setLightboxImg({ src, alt })

  useLayoutEffect(() => {
    // ── 1. Lenis ───────────────────────────────────────────
    const lenis = new Lenis({
      duration:    1.4,
      easing:      (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis
    window.__lenis   = lenis
    window.__gsap_st = { ScrollTrigger }

    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => lenis.raf(time * 1000))
    gsap.ticker.lagSmoothing(0)

    // ── 2. Scroll animations ────────────────────────────────
    const ctx = gsap.context(() => {

      // Progress bar — raw scroll position, unaffected by pins
      const updateProgress = () => {
        const scrollTop = window.scrollY
        const docHeight = document.documentElement.scrollHeight - window.innerHeight
        if (progressRef.current)
          progressRef.current.style.width = docHeight > 0
            ? `${(scrollTop / docHeight) * 100}%`
            : '0%'
      }
      window.addEventListener('scroll', updateProgress, { passive: true })

      // ── Collect panels, EXCLUDING board-stage (manages its own pin) ──
      const allPanels   = gsap.utils.toArray('.section-panel')
      const appPanels   = allPanels.filter(p => p.id !== 'board-stage')

      appPanels.forEach((panel, i) => {
        const isLast  = i === appPanels.length - 1
        const isFirst = panel.id === 'hero'
        const isSpecs = panel.id === 'specs'

        // ── PIN + OUTRO (everything except gallery) ─────────
        if (!isLast) {
          ScrollTrigger.create({
            trigger:       panel,
            start:         'top top',
            end:           '+=600',
            pin:           true,
            pinSpacing:    true,
            anticipatePin: 1,
          })

          // Fade + scale out while pinned
          gsap.to(panel, {
            opacity: 0,
            scale:   0.94,
            y:       -50,
            ease:    'none',
            scrollTrigger: {
              trigger: panel,
              start:   'top top',
              end:     '+=600',
              scrub:   1,
            },
          })
        }

        // ── INTRO animations ────────────────────────────────
        if (isFirst) {
          // Hero: guarantee it's visible, animate children in on load
          gsap.set(panel, { opacity: 1, y: 0, scale: 1 })
          const kids = panel.querySelectorAll('.panel-content > *')
          if (kids.length) {
            gsap.fromTo(kids,
              { opacity: 0, y: 20 },
              { opacity: 1, y: 0, duration: 0.7, stagger: 0.1, ease: 'power2.out', delay: 0.2 }
            )
          }
        } else {
          // All other panels: fade + slide up on scroll enter (never reverse)
          gsap.fromTo(panel,
            { opacity: 0, y: 50 },
            {
              opacity: 1, y: 0,
              duration: 0.85,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: panel,
                start: 'top 88%',
                toggleActions: 'play none none none',
              },
            }
          )

          // Child stagger (specs slides from left)
          const kids = panel.querySelectorAll('.panel-content > *')
          if (kids.length) {
            gsap.fromTo(kids,
              {
                opacity: 0,
                x: isSpecs ? -60 : 0,
                y: isSpecs ? 0   : 30,
              },
              {
                opacity: 1, x: 0, y: 0,
                duration: 0.7,
                stagger: 0.12,
                ease: 'power2.out',
                scrollTrigger: {
                  trigger: panel,
                  start: 'top 85%',
                  toggleActions: 'play none none none',
                },
              }
            )
          }
        }

        // Accent hairline active state
        ScrollTrigger.create({
          trigger:     panel,
          start:       'top 55%',
          end:         'bottom 45%',
          onEnter:     () => panel.classList.add('is-active'),
          onLeave:     () => panel.classList.remove('is-active'),
          onEnterBack: () => panel.classList.add('is-active'),
          onLeaveBack: () => panel.classList.remove('is-active'),
        })
      })

      // Refresh after fonts + images settle
      window.addEventListener('load', () => ScrollTrigger.refresh())
      setTimeout(() => ScrollTrigger.refresh(), 600)

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