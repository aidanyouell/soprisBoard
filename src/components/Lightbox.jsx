import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import './Lightbox.css'

// Minimum / maximum zoom levels
const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

export default function Lightbox({ src, alt, onClose }) {
  const overlayRef = useRef(null)
  const cardRef    = useRef(null)
  const imgRef     = useRef(null)

  const [zoom, setZoom]     = useState(1)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const isDragging = useRef(false)
  const dragStart  = useRef({ x: 0, y: 0 })
  const dragOrigin = useRef({ x: 0, y: 0 })

  // ── Open animation ─────────────────────────────────
  useEffect(() => {
    // Lock page scroll while open
    document.body.style.overflow = 'hidden'

    const tl = gsap.timeline()
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.35, ease: 'power2.out' }
    ).fromTo(
      cardRef.current,
      { opacity: 0, scale: 0.82, y: 40 },
      { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.4)' },
      '-=0.15'
    )

    return () => {
      document.body.style.overflow = ''
    }
  }, [])

  // ── Close animation, then call parent's onClose ───
  const handleClose = () => {
    const tl = gsap.timeline({ onComplete: onClose })
    tl.to(cardRef.current, {
      opacity: 0, scale: 0.88, y: 30,
      duration: 0.3, ease: 'power2.in',
    }).to(overlayRef.current, {
      opacity: 0, duration: 0.25, ease: 'power2.in',
    }, '-=0.1')
  }

  // Close on overlay backdrop click
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) handleClose()
  }

  // ── Keyboard: Escape to close ─────────────────────
  useEffect(() => {
    const onKey = (e) => { if (e.key === 'Escape') handleClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  // ── Zoom controls ─────────────────────────────────
  const zoomIn  = () => setZoom((z) => Math.min(z + ZOOM_STEP, MAX_ZOOM))
  const zoomOut = () => {
    setZoom((z) => {
      const next = Math.max(z - ZOOM_STEP, MIN_ZOOM)
      if (next === MIN_ZOOM) setOffset({ x: 0, y: 0 })
      return next
    })
  }
  const resetZoom = () => { setZoom(1); setOffset({ x: 0, y: 0 }) }

  // Scroll wheel zoom
  const handleWheel = (e) => {
    e.preventDefault()
    if (e.deltaY < 0) zoomIn()
    else zoomOut()
  }

  // ── Drag-to-pan when zoomed ───────────────────────
  const onMouseDown = (e) => {
    if (zoom <= 1) return
    isDragging.current = true
    dragStart.current  = { x: e.clientX, y: e.clientY }
    dragOrigin.current = { ...offset }
    e.currentTarget.style.cursor = 'grabbing'
  }

  const onMouseMove = (e) => {
    if (!isDragging.current) return
    const dx = e.clientX - dragStart.current.x
    const dy = e.clientY - dragStart.current.y
    setOffset({ x: dragOrigin.current.x + dx, y: dragOrigin.current.y + dy })
  }

  const onMouseUp = (e) => {
    isDragging.current = false
    e.currentTarget.style.cursor = zoom > 1 ? 'grab' : 'default'
  }

  return (
    <div
      ref={overlayRef}
      className="lightbox"
      onClick={handleOverlayClick}
    >
      <div ref={cardRef} className="lightbox__card">

        {/* Image area */}
        <div
          className="lightbox__img-wrap"
          onWheel={handleWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          style={{ cursor: zoom > 1 ? 'grab' : 'default' }}
        >
          <img
            ref={imgRef}
            className="lightbox__img"
            src={src}
            alt={alt}
            draggable={false}
            style={{
              transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
              transition: isDragging.current ? 'none' : 'transform 0.2s ease',
            }}
          />
        </div>

        {/* Controls bar */}
        <div className="lightbox__controls">
          <div className="lightbox__zoom-group">
            <button
              className="lightbox__btn"
              onClick={zoomOut}
              disabled={zoom <= MIN_ZOOM}
              aria-label="Zoom out"
            >−</button>

            <button
              className="lightbox__zoom-label"
              onClick={resetZoom}
              aria-label="Reset zoom"
            >
              {Math.round(zoom * 100)}%
            </button>

            <button
              className="lightbox__btn"
              onClick={zoomIn}
              disabled={zoom >= MAX_ZOOM}
              aria-label="Zoom in"
            >+</button>
          </div>

          <button
            className="lightbox__btn lightbox__close"
            onClick={handleClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>
      </div>
    </div>
  )
}