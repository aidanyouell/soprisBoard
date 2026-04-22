import './Logo.css'

export default function Logo() {
  return (
    <section className="logo-section">
      <div className="logo-section__inner">
        <img
          className="logo-section__img"
          src="/images/logo-placeholder.png"
          alt="Brand logo"
        />
      </div>
    </section>
  )
}