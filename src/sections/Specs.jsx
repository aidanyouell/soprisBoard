import './Specs.css'
import model from '../assets/isometricleft.png'

const SPECS = [
  { label: 'Core',              value: 'Poplar wood' },
  { label: 'Base',              value: 'Black Polyethylene' },
  { label: 'Sidewall',          value: 'Polyurethane' },
  { label: 'Topsheet',          value: 'Brushed Nylon/Polyamide' },
  { label: 'Binding Interface', value: 'Standard' },
  { label: 'Tail Connection',   value: '1.5mm Carbon fiber sheet + Karakoram Ultra Splitboard Clips' },
  { label: 'Lengths Available', value: '147 cm (57.874 in)' },
]

export default function Specs() {
  return (
    <section id="specs" className="section-panel specs">
      <div className="specs__header panel-content">
        <span className="section-subheading">Under the hood</span>
        <h2 className="section-heading">
          BUILT<br />DIFFERENT
        </h2>
      </div>

      <div className="specs__layout">
        {/* Left: spec table */}
        <div className="specs__table-wrap">
          <table className="specs__table">
            <tbody>
              {SPECS.map((spec) => (
                <tr key={spec.label} className="specs__row">
                  <th className="specs__label">{spec.label}</th>
                  <td className="specs__value">{spec.value}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: layer / exploded-view graphic */}
        <div className="specs__graphic-wrap">
          <img
            className="specs__graphic"
            src= {model}
            alt="Exploded view of board layers"
          />
          <p className="specs__graphic-caption">
          </p>
        </div>
      </div>
    </section>
  )
}