import './BoardStage.css'

// This section is the placeholder for the scroll-driven board split animation.
// When that feature is built, the two img layers below will be animated by GSAP:
//   .board-stage__body  → stays in place
//   .board-stage__tail  → slides/rotates away on scroll
//
// For now it just displays your board image centered on a full-viewport panel.

export default function BoardStage() {
  return (
    <section id="board-stage" className="section-panel board-stage">
      <div className="board-stage__bg-glow" aria-hidden="true" />

      <div className="board-stage__wrap">
        {/*
          Replace these srcs with your actual cut board images.
          board-body.png = everything above the tail cut line
          board-tail.png = the detachable tail portion
          If you only have one full image for now, just use one <img>
          and remove the other.
        */}
        <img
          className="board-stage__body"
          src="/images/board-body.png"
          alt="Snowboard body"
        />
        <img
          className="board-stage__tail"
          src="/images/board-tail.png"
          alt="Detachable snowboard tail"
        />
      </div>

      {/* Small label in corner */}
      <div className="board-stage__label">
        <span className="section-subheading">The Sopris</span>
        <p className="board-stage__desc">
          Tap the tail. Change your ride.
        </p>
      </div>
    </section>
  )
}