import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { inquiryService, servicesService } from '../services/api';

const CATEGORIES = [
  { value: 'fleet', label: 'Fleet Insurance', icon: 'bi-truck', desc: 'Commercial vehicle fleets' },
  { value: 'aircraft', label: 'Aircraft Insurance', icon: 'bi-airplane', desc: 'Private & commercial aviation' },
  { value: 'yacht', label: 'Yacht / Marine', icon: 'bi-water', desc: 'Sailing & motor yachts' },
];

export default function InquiryPage() {
  const [step, setStep] = useState(1);
  const [category, setCategory] = useState('');
  const [services, setServices] = useState([]);
  const [form, setForm] = useState({
    full_name: '', email: '', phone: '', company_name: '',
    service: '',
    // fleet
    fleet_size: '', vehicle_types: '',
    // aircraft
    aircraft_type: '', aircraft_registration: '', flight_hours_per_year: '',
    // yacht
    yacht_type: '', yacht_length_meters: '', cruising_area: '',
    // general
    coverage_amount: '', message: '',
  });
  const [submitStatus, setSubmitStatus] = useState(null);

  useEffect(() => {
    if (category) {
      servicesService.list({ category }).then(({ data }) => setServices(data.results || data)).catch(() => {});
    }
  }, [category]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus('sending');
    try {
      const payload = { ...form, service_category: category };
      // Clean empty strings
      Object.keys(payload).forEach((k) => { if (payload[k] === '') delete payload[k]; });
      await inquiryService.submit(payload);
      setSubmitStatus('success');
    } catch {
      setSubmitStatus('error');
    }
  };

  return (
    <>
      <Helmet>
        <title>Get an Insurance Quote – SkyWave Insurance</title>
        <meta name="description" content="Request a tailored insurance quote for your fleet, aircraft, or yacht. No account needed — just fill in the form and a specialist will respond within 24 hours." />
        <link rel="canonical" href="https://www.skywave-insurance.com/get-quote" />
      </Helmet>

      <div className="page-hero">
        <div className="container fade-in-up">
          <span className="section-label">No Account Needed</span>
          <h1 className="display-2 text-white">Get Your Tailored Quote</h1>
          <p style={{ color: 'rgba(255,255,255,0.7)', maxWidth: 520, marginTop: '1rem' }}>
            Tell us about your asset and coverage needs. One of our underwriters will respond with a personalised quotation within one business day.
          </p>
        </div>
      </div>

      <section className="section">
        <div className="container" style={{ maxWidth: 820 }}>

          {/* Progress */}
          <div className="sw-inquiry-steps">
            {['Asset Type', 'Your Details', 'Asset Info', 'Review'].map((s, i) => (
              <div key={s} className={`sw-inquiry-step${step > i + 1 ? ' done' : step === i + 1 ? ' active' : ''}`}>
                <div className="sw-inquiry-step__num">
                  {step > i + 1 ? <i className="bi bi-check" /> : i + 1}
                </div>
                <span>{s}</span>
              </div>
            ))}
          </div>

          <div className="card" style={{ padding: '2.5rem' }}>
            {submitStatus === 'success' ? (
              <div className="text-center" style={{ padding: '2rem 0' }}>
                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem', color: 'var(--sw-success)', display: 'block', marginBottom: '1.5rem' }} />
                <h2 className="heading-lg" style={{ marginBottom: '0.75rem' }}>Inquiry Submitted!</h2>
                <p style={{ color: 'var(--sw-text-muted)', maxWidth: 420, margin: '0 auto 2rem' }}>
                  Thank you. A specialist will review your inquiry and respond within one business day. No account is required to track your inquiry — we'll email you directly.
                </p>
                <button className="btn btn-primary" onClick={() => { setSubmitStatus(null); setStep(1); setCategory(''); setForm({ full_name:'',email:'',phone:'',company_name:'',service:'',fleet_size:'',vehicle_types:'',aircraft_type:'',aircraft_registration:'',flight_hours_per_year:'',yacht_type:'',yacht_length_meters:'',cruising_area:'',coverage_amount:'',message:'' }); }}>
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                {/* Step 1: Category */}
                {step === 1 && (
                  <div>
                    <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>What would you like to insure?</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.88rem' }}>Select the category that best describes your asset.</p>
                    <div className="grid-3" style={{ marginBottom: '2rem' }}>
                      {CATEGORIES.map((cat) => (
                        <button type="button" key={cat.value}
                          className={`sw-cat-select${category === cat.value ? ' selected' : ''}`}
                          onClick={() => setCategory(cat.value)}
                        >
                          <i className={`bi ${cat.icon}`} />
                          <strong>{cat.label}</strong>
                          <span>{cat.desc}</span>
                        </button>
                      ))}
                    </div>
                    {services.length > 0 && (
                      <div className="form-group" style={{ marginBottom: '2rem' }}>
                        <label className="form-label">Specific Product (optional)</label>
                        <select name="service" className="form-control" value={form.service} onChange={handleChange}>
                          <option value="">Choose a specific product…</option>
                          {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
                        </select>
                      </div>
                    )}
                    <button type="button" className="btn btn-primary" disabled={!category} onClick={() => setStep(2)}>
                      Next <i className="bi bi-arrow-right" />
                    </button>
                  </div>
                )}

                {/* Step 2: Contact */}
                {step === 2 && (
                  <div>
                    <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>Your Contact Details</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.88rem' }}>No account required. We only use this information to follow up on your inquiry.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '2rem' }}>
                      {[
                        { name: 'full_name', label: 'Full Name *', type: 'text', req: true, placeholder: 'John Smith' },
                        { name: 'email', label: 'Email Address *', type: 'email', req: true, placeholder: 'john@company.com' },
                        { name: 'phone', label: 'Phone Number', type: 'text', placeholder: '+1 (555) 000-0000' },
                        { name: 'company_name', label: 'Company / Organisation', type: 'text', placeholder: 'Acme Logistics Ltd' },
                      ].map((f) => (
                        <div key={f.name} className="form-group">
                          <label className="form-label" htmlFor={f.name}>{f.label}</label>
                          <input id={f.name} name={f.name} type={f.type} className="form-control" required={f.req} placeholder={f.placeholder} value={form[f.name]} onChange={handleChange} />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn btn-outline" onClick={() => setStep(1)}>
                        <i className="bi bi-arrow-left" /> Back
                      </button>
                      <button type="button" className="btn btn-primary"
                        disabled={!form.full_name || !form.email}
                        onClick={() => setStep(3)}>
                        Next <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 3: Asset specific */}
                {step === 3 && (
                  <div>
                    <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>Asset Details</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.88rem' }}>The more detail you provide, the more accurate and relevant our quotation will be.</p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem', marginBottom: '1.25rem' }}>
                      {category === 'fleet' && <>
                        <div className="form-group">
                          <label className="form-label">Fleet Size (number of vehicles)</label>
                          <input name="fleet_size" type="number" min="1" className="form-control" placeholder="e.g. 25" value={form.fleet_size} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Vehicle Types</label>
                          <input name="vehicle_types" className="form-control" placeholder="e.g. Vans, HGVs, Cars" value={form.vehicle_types} onChange={handleChange} />
                        </div>
                      </>}
                      {category === 'aircraft' && <>
                        <div className="form-group">
                          <label className="form-label">Aircraft Type / Model</label>
                          <input name="aircraft_type" className="form-control" placeholder="e.g. Cessna Citation CJ4" value={form.aircraft_type} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Registration Mark</label>
                          <input name="aircraft_registration" className="form-control" placeholder="e.g. N12345" value={form.aircraft_registration} onChange={handleChange} />
                        </div>
                        <div className="form-group" style={{ gridColumn: '1/-1' }}>
                          <label className="form-label">Estimated Flight Hours per Year</label>
                          <input name="flight_hours_per_year" type="number" min="0" className="form-control" placeholder="e.g. 400" value={form.flight_hours_per_year} onChange={handleChange} />
                        </div>
                      </>}
                      {category === 'yacht' && <>
                        <div className="form-group">
                          <label className="form-label">Vessel Type</label>
                          <input name="yacht_type" className="form-control" placeholder="e.g. Sailing Yacht, Motor Yacht" value={form.yacht_type} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">LOA (metres)</label>
                          <input name="yacht_length_meters" type="number" step="0.1" className="form-control" placeholder="e.g. 18.5" value={form.yacht_length_meters} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                          <label className="form-label">Primary Cruising Area</label>
                          <input name="cruising_area" className="form-control" placeholder="e.g. Mediterranean, Caribbean" value={form.cruising_area} onChange={handleChange} />
                        </div>
                      </>}
                      <div className="form-group">
                        <label className="form-label">Desired Coverage Amount (USD)</label>
                        <input name="coverage_amount" type="number" min="0" className="form-control" placeholder="e.g. 2000000" value={form.coverage_amount} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="form-group" style={{ marginBottom: '2rem' }}>
                      <label className="form-label">Additional Information</label>
                      <textarea name="message" className="form-control" rows={4}
                        placeholder="Any other details, special requirements, or questions for our underwriters…"
                        value={form.message} onChange={handleChange} />
                    </div>
                    <div className="flex gap-2">
                      <button type="button" className="btn btn-outline" onClick={() => setStep(2)}>
                        <i className="bi bi-arrow-left" /> Back
                      </button>
                      <button type="button" className="btn btn-primary" onClick={() => setStep(4)}>
                        Review <i className="bi bi-arrow-right" />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 4: Review */}
                {step === 4 && (
                  <div>
                    <h2 className="heading-md" style={{ marginBottom: '0.5rem' }}>Review & Submit</h2>
                    <p className="text-muted" style={{ marginBottom: '2rem', fontSize: '0.88rem' }}>Please check your details before submitting.</p>
                    <div className="sw-review-grid">
                      {[
                        { label: 'Asset Type', val: CATEGORIES.find(c=>c.value===category)?.label },
                        { label: 'Name', val: form.full_name },
                        { label: 'Email', val: form.email },
                        { label: 'Phone', val: form.phone || '—' },
                        { label: 'Company', val: form.company_name || '—' },
                        { label: 'Coverage Amount', val: form.coverage_amount ? `$${Number(form.coverage_amount).toLocaleString()}` : '—' },
                      ].map((r) => (
                        <div key={r.label} className="sw-review-row">
                          <span className="sw-review-row__label">{r.label}</span>
                          <span>{r.val}</span>
                        </div>
                      ))}
                    </div>
                    {submitStatus === 'error' && (
                      <div className="alert alert-error" style={{ margin: '1rem 0' }}>
                        <i className="bi bi-exclamation-triangle-fill" />
                        <span>Submission failed. Please try again.</span>
                      </div>
                    )}
                    <div className="flex gap-2" style={{ marginTop: '2rem' }}>
                      <button type="button" className="btn btn-outline" onClick={() => setStep(3)}>
                        <i className="bi bi-arrow-left" /> Edit
                      </button>
                      <button type="submit" className="btn btn-primary" disabled={submitStatus === 'sending'}>
                        {submitStatus === 'sending'
                          ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Submitting…</>
                          : <><i className="bi bi-send" /> Submit Inquiry</>
                        }
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        .sw-inquiry-steps {
          display: flex; align-items: center;
          margin-bottom: 2.5rem; gap: 0;
        }
        .sw-inquiry-step {
          display: flex; align-items: center; gap: 0.6rem;
          flex: 1; padding: 0;
        }
        .sw-inquiry-step + .sw-inquiry-step::before {
          content: '';
          flex: 1; height: 2px;
          background: var(--sw-border);
          margin: 0 0.5rem;
        }
        .sw-inquiry-step.done + .sw-inquiry-step::before,
        .sw-inquiry-step.active + .sw-inquiry-step::before { background: var(--sw-gold); }
        .sw-inquiry-step__num {
          width: 32px; height: 32px; border-radius: 50%;
          background: var(--sw-off-white); border: 2px solid var(--sw-border);
          display: flex; align-items: center; justify-content: center;
          font-size: 0.82rem; font-weight: 700; flex-shrink: 0;
          color: var(--sw-text-muted);
        }
        .sw-inquiry-step.active .sw-inquiry-step__num {
          background: var(--sw-gold); border-color: var(--sw-gold); color: var(--sw-navy);
        }
        .sw-inquiry-step.done .sw-inquiry-step__num {
          background: var(--sw-success); border-color: var(--sw-success); color: #fff;
        }
        .sw-inquiry-step span { font-size: 0.8rem; font-weight: 600; color: var(--sw-text-muted); white-space: nowrap; }
        .sw-inquiry-step.active span { color: var(--sw-navy); }

        .sw-cat-select {
          display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
          padding: 1.5rem 1rem;
          background: #fff; border: 2px solid var(--sw-border);
          border-radius: var(--radius-md);
          cursor: pointer; transition: var(--transition);
          text-align: center; width: 100%;
        }
        .sw-cat-select:hover { border-color: var(--sw-navy); }
        .sw-cat-select.selected { border-color: var(--sw-gold); background: var(--sw-gold-pale); }
        .sw-cat-select i { font-size: 2rem; color: var(--sw-navy); }
        .sw-cat-select.selected i { color: var(--sw-gold); }
        .sw-cat-select strong { font-size: 0.9rem; }
        .sw-cat-select span { font-size: 0.78rem; color: var(--sw-text-muted); }

        .sw-review-grid { background: var(--sw-off-white); border-radius: var(--radius-md); overflow: hidden; }
        .sw-review-row { display: flex; gap: 1rem; padding: 0.75rem 1.25rem; border-bottom: 1px solid var(--sw-border); font-size: 0.88rem; }
        .sw-review-row:last-child { border-bottom: none; }
        .sw-review-row__label { font-weight: 600; min-width: 140px; color: var(--sw-text-muted); }
      `}</style>
    </>
  );
}