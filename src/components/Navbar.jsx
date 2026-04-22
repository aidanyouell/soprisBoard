import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import LogoReset from './LogoReset'
import './Navbar.css'

const NAV_LINKS = [
  { label: 'Board',    href: '#hero',     sections: ['hero', 'board-stage'] },
  { label: 'Features', href: '#features', sections: ['features'] },
  { label: 'Specs',    href: '#specs',    sections: ['specs'] },
  { label: 'Gallery',  href: '#gallery',  sections: ['gallery'] },
]

export default function Navbar() {
  const navRef   = useRef(null)
  const lastY    = useRef(0)
  const ticking  = useRef(false)

  const [active,      setActive]      = useState('hero')
  const [hidden,      setHidden]      = useState(false)
  const [filled,      setFilled]      = useState(false)
  const [showReset,   setShowReset]   = useState(false)

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -72, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  // Hide on scroll down, show on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const goingDown = y > lastY.current
        setHidden(y > 80 && goingDown)
        setFilled(y > 40)
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section via IntersectionObserver
  useEffect(() => {
    const sectionIds = ['hero', 'board-stage', 'features', 'specs', 'gallery']
    const observers  = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            const match = NAV_LINKS.find((l) => l.sections.includes(id))
            if (match) setActive(match.sections[0])
          }
        },
        { threshold: 0.4 }
      )
      obs.observe(el)
      observers.push(obs)
    })
    return () => observers.forEach((o) => o.disconnect())
  }, [])

  // ── Instant jump: stop Lenis, snap position, restart Lenis ──
  const jumpTo = (e, href) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return

    const lenis = window.__lenis
    if (lenis) lenis.stop()

    // Instant native scroll
    const top = el.getBoundingClientRect().top + window.scrollY
    window.scrollTo({ top, behavior: 'instant' })

    // Re-enable Lenis + refresh ScrollTrigger after snap
    requestAnimationFrame(() => {
      if (lenis) lenis.start()
      // Small delay so GSAP remeasures after the snap
      setTimeout(() => {
        const { ScrollTrigger } = window.__gsap_st || {}
        if (ScrollTrigger) ScrollTrigger.refresh()
      }, 50)
    })
  }

  // ── Logo click: play reset animation then snap to top ──
  const handleLogoClick = (e) => {
    e.preventDefault()
    setShowReset(true)
  }

  const handleResetComplete = () => {
    setShowReset(false)
    const lenis = window.__lenis
    if (lenis) lenis.stop()
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => {
      if (lenis) lenis.start()
    })
  }

  return (
    <>
      <nav
        ref={navRef}
        className={[
          'navbar',
          filled ? 'navbar--filled' : '',
          hidden ? 'navbar--hidden' : '',
        ].join(' ')}
      >
        <a href="#hero" className="navbar__logo" onClick={handleLogoClick}>
          <span className="navbar__logo-text">SOPRIS</span>
        </a>

        <ul className="navbar__links">
          {NAV_LINKS.map(({ label, href, sections }) => {
            const isActive = sections.includes(active)
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`navbar__link${isActive ? ' navbar__link--active' : ''}`}
                  onClick={(e) => jumpTo(e, href)}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>

      {showReset && <LogoReset onComplete={handleResetComplete} />}
    </>
  )
}