import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Navbar.css'

// Board link covers both hero + board-stage sections
const NAV_LINKS = [
  { label: 'Board',    href: '#hero',     sections: ['hero', 'board-stage'] },
  { label: 'Features', href: '#features', sections: ['features'] },
  { label: 'Specs',    href: '#specs',    sections: ['specs'] },
  { label: 'Gallery',  href: '#gallery',  sections: ['gallery'] },
]

export default function Navbar() {
  const navRef  = useRef(null)
  const [active,  setActive]  = useState('hero')
  const [hidden,  setHidden]  = useState(false)
  const [filled,  setFilled]  = useState(false)
  const lastY    = useRef(0)
  const ticking  = useRef(false)

  // Entrance animation
  useEffect(() => {
    gsap.fromTo(
      navRef.current,
      { y: -72, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: 'power3.out', delay: 0.4 }
    )
  }, [])

  // Hide on scroll down, reveal on scroll up
  useEffect(() => {
    const handleScroll = () => {
      if (ticking.current) return
      ticking.current = true
      requestAnimationFrame(() => {
        const y = window.scrollY
        const goingDown = y > lastY.current
        // Only hide after we've scrolled past the nav height
        if (y > 80) {
          setHidden(goingDown)
        } else {
          setHidden(false)
        }
        setFilled(y > 40)
        lastY.current = y
        ticking.current = false
      })
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Active section tracking via IntersectionObserver
  // More reliable than ScrollTrigger with pinned sections
  useEffect(() => {
    const sectionIds = ['hero', 'board-stage', 'features', 'specs', 'gallery']
    const observers = []

    sectionIds.forEach((id) => {
      const el = document.getElementById(id)
      if (!el) return

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            // Find which nav link owns this section id
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

  const handleClick = (e, href) => {
    e.preventDefault()
    const id = href.replace('#', '')
    const el = document.getElementById(id)
    if (!el) return
    const lenis = window.__lenis
    if (lenis) {
      lenis.scrollTo(el, { duration: 1.6 })
    } else {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <nav
      ref={navRef}
      className={[
        'navbar',
        filled ? 'navbar--filled' : '',
        hidden ? 'navbar--hidden' : '',
      ].join(' ')}
    >
      <a href="#hero" className="navbar__logo" onClick={(e) => handleClick(e, '#hero')}>
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
                onClick={(e) => handleClick(e, href)}
              >
                {label}
              </a>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}