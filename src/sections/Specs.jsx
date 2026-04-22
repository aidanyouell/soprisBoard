import './Specs.css'

const SPECS = [
  { label: 'Core',              value: 'Material / wood type here' },
  { label: 'Base',              value: 'Sintered / extruded — material name' },
  { label: 'Sidewall',          value: 'Material here' },
  { label: 'Topsheet',          value: 'Material here' },
  { label: 'Binding Interface', value: 'Standard / proprietary' },
  { label: 'Tail Connection',   value: 'Describe attachment mechanism' },
  { label: 'Lengths Available', value: '150 / 155 / 160 cm' },
  { label: 'Width (waist)',     value: '25.0 cm' },
  { label: 'Stance Setback',    value: '0 mm' },
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
            src="/images/layers-placeholder.png"
            alt="Exploded view of board layers"
          />
          <p className="specs__graphic-caption">
            Board layer diagram — replace with your graphic
          </p>
        </div>
      </div>
    </section>
  )
}