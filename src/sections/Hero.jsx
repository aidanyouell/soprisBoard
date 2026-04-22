import './Hero.css'
import splitwhite from '../assets/splitwhite.jpg'

export default function Hero() {
  return (
    <section id="hero" className="section-panel hero">
      <div className="hero__bg-grid" aria-hidden="true" />
 
      <div className="hero__content panel-content">
        <span className="accent-chip">Capstone Project 2025</span>
 
        {/* SOPRIS is the dominant element */}
        <h1 className="hero__brand">SOPRIS</h1>
 
        {/* Stacked descriptor words — smaller, below the brand name */}
        <div className="hero__stack">
          <span>RIDE.</span>
          <span>DETACH.</span>
          <span>CONQUER.</span>
        </div>
 
        <p className="section-body hero__tagline">
          A snowboard engineered for every condition — with a tail
          that comes off when you need it to.
        </p>
      </div>
 
      {/* Scroll hint */}
      <div className="hero__scroll-hint" aria-hidden="true">
        <span className="hero__scroll-label">Scroll</span>
        <div className="hero__scroll-line" />
      </div>
    </section>
  )
}