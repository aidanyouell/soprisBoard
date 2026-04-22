import './Features.css'
import scene1IMG from '../assets/scene1.jpg'
import tailSnowIMG from '../assets/tailSnow.jpg'
import tailIMG from '../assets/blacktaildetach.jpg'

const FEATURES = [
  {
    id: 1,
    image: scene1IMG,
    title: 'Rugged By Design',
    blurb:
      'Portability should never come at the cost of performance. The board is designed to handle the stresses of repeated assembly and the rigor of the slopes.',
  },
  {
    id: 2,
    image: tailSnowIMG,
    title: 'Invisible Integration',
    blurb:
      'Our precision-machined tongue-and-groove interface ensures a seamless connection between the tail and main board. The result? A ride that feels as solid and responsive as a traditional one-piece board.',
  },
  {
    id: 3,
    image: tailIMG,
    title: 'Detachable Tail',
    blurb:
      'Modular tail design allows for rapid disassembly and utilizes industrial grade latches to transition from a compact travel package to a high-performance ride instantly.',
  },
]
 
export default function Features() {
  return (
    <section id="features" className="section-panel features">
      <div className="features__header panel-content">
        <span className="section-subheading">The board</span>
        <h2 className="section-heading features__heading">
          RIDE ANY<br />CONDITION
        </h2>
        <p className="section-body">
          A short intro sentence about the board's versatility goes here.
        </p>
      </div>
 
      <div className="features__grid">
        {FEATURES.map((f) => (
          <div key={f.id} className="feature-card">
            <div className="feature-card__img-wrap">
              <img className="feature-card__img" src={f.image} alt={f.title} />
              <span className="feature-card__label accent-chip">{f.label}</span>
            </div>
            <div className="feature-card__body">
              <h3 className="feature-card__title">{f.title}</h3>
              <p className="feature-card__blurb">{f.blurb}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}