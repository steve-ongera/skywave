import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { jobsService } from '../../services/api';

const emptyForm = {
  title: '', department: '', location: '', job_type: 'full_time',
  description: '', salary_range: '', deadline: '', is_active: true,
  responsibilities: '', requirements: '', nice_to_have: '',
};

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editJob, setEditJob] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const load = () => {
    setLoading(true);
    jobsService.list().then(({ data }) => setJobs(data.results || data)).catch(() => {}).finally(() => setLoading(false));
  };
  useEffect(load, []);

  const openCreate = () => { setForm(emptyForm); setEditJob(null); setShowForm(true); setMsg(null); };
  const openEdit = (job) => {
    setForm({
      ...job,
      responsibilities: Array.isArray(job.responsibilities) ? job.responsibilities.join('\n') : '',
      requirements: Array.isArray(job.requirements) ? job.requirements.join('\n') : '',
      nice_to_have: Array.isArray(job.nice_to_have) ? job.nice_to_have.join('\n') : '',
    });
    setEditJob(job);
    setShowForm(true);
    setMsg(null);
  };

  const handleChange = (e) => {
    const val = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setForm({ ...form, [e.target.name]: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        responsibilities: form.responsibilities.split('\n').filter(Boolean),
        requirements: form.requirements.split('\n').filter(Boolean),
        nice_to_have: form.nice_to_have.split('\n').filter(Boolean),
      };
      if (!payload.deadline) delete payload.deadline;
      if (editJob) {
        await jobsService.update(editJob.id, payload);
        setMsg({ type: 'success', text: 'Job posting updated.' });
      } else {
        await jobsService.create(payload);
        setMsg({ type: 'success', text: 'Job posting created.' });
      }
      load();
      if (!editJob) { setShowForm(false); }
    } catch {
      setMsg({ type: 'error', text: 'Save failed. Please check fields and try again.' });
    }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this job posting?')) return;
    try { await jobsService.delete(id); load(); } catch {}
  };

  return (
    <>
      <Helmet><title>Job Postings – SkyWave Admin</title></Helmet>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h1 style={{ fontSize: '1.5rem' }}>Job Postings</h1>
        <button className="btn btn-primary btn-sm" onClick={openCreate}>
          <i className="bi bi-plus-lg" /> New Posting
        </button>
      </div>

      {showForm && (
        <div className="card" style={{ padding: '2rem', marginBottom: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.15rem' }}>{editJob ? 'Edit Posting' : 'Create Job Posting'}</h2>
            <button onClick={() => setShowForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--sw-text-muted)' }}>
              <i className="bi bi-x-lg" />
            </button>
          </div>

          {msg && <div className={`alert ${msg.type === 'success' ? 'alert-success' : 'alert-error'}`} style={{ marginBottom: '1rem' }}><i className={`bi ${msg.type === 'success' ? 'bi-check-circle' : 'bi-exclamation-triangle'}`} /><span>{msg.text}</span></div>}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <div className="form-group">
              <label className="form-label">Job Title *</label>
              <input name="title" className="form-control" required value={form.title} onChange={handleChange} placeholder="Senior Underwriter" />
            </div>
            <div className="form-group">
              <label className="form-label">Department *</label>
              <input name="department" className="form-control" required value={form.department} onChange={handleChange} placeholder="Aviation" />
            </div>
            <div className="form-group">
              <label className="form-label">Location *</label>
              <input name="location" className="form-control" required value={form.location} onChange={handleChange} placeholder="San Francisco, CA / Remote" />
            </div>
            <div className="form-group">
              <label className="form-label">Job Type</label>
              <select name="job_type" className="form-control" value={form.job_type} onChange={handleChange}>
                <option value="full_time">Full Time</option>
                <option value="part_time">Part Time</option>
                <option value="contract">Contract</option>
                <option value="internship">Internship</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Salary Range</label>
              <input name="salary_range" className="form-control" value={form.salary_range} onChange={handleChange} placeholder="$90,000 – $130,000" />
            </div>
            <div className="form-group">
              <label className="form-label">Application Deadline</label>
              <input name="deadline" type="date" className="form-control" value={form.deadline} onChange={handleChange} />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Description *</label>
              <textarea name="description" className="form-control" required rows={4} value={form.description} onChange={handleChange} placeholder="Role overview..." />
            </div>
            <div className="form-group" style={{ gridColumn: '1/-1' }}>
              <label className="form-label">Responsibilities (one per line)</label>
              <textarea name="responsibilities" className="form-control" rows={4} value={form.responsibilities} onChange={handleChange} placeholder="Manage policy renewals&#10;Conduct risk assessments..." />
            </div>
            <div className="form-group">
              <label className="form-label">Requirements (one per line)</label>
              <textarea name="requirements" className="form-control" rows={4} value={form.requirements} onChange={handleChange} placeholder="CII qualification&#10;5+ years experience..." />
            </div>
            <div className="form-group">
              <label className="form-label">Nice to Have (one per line)</label>
              <textarea name="nice_to_have" className="form-control" rows={4} value={form.nice_to_have} onChange={handleChange} placeholder="Aviation background&#10;Lloyd's market experience..." />
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input type="checkbox" id="is_active" name="is_active" checked={form.is_active} onChange={handleChange} style={{ width: 16, height: 16 }} />
              <label htmlFor="is_active" style={{ fontSize: '0.88rem', fontWeight: 500 }}>Active (visible on public site)</label>
            </div>
            <div style={{ gridColumn: '1/-1', display: 'flex', gap: '0.75rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                {saving ? <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Saving…</> : <><i className="bi bi-check-lg" /> {editJob ? 'Update Posting' : 'Create Posting'}</>}
              </button>
              <button type="button" className="btn btn-outline" onClick={() => setShowForm(false)}>Cancel</button>
            </div>
          </form>
        </div>
      )}

      {loading
        ? <div className="flex-center" style={{ padding: '3rem' }}><div className="spinner" /></div>
        : jobs.length === 0
          ? <div className="card text-center" style={{ padding: '3rem' }}><p className="text-muted">No job postings yet.</p></div>
          : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {jobs.map((job) => (
                <div key={job.id} className="card" style={{ padding: '1.25rem 1.5rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
                        <strong>{job.title}</strong>
                        {!job.is_active && <span className="badge badge-warning">Inactive</span>}
                        {job.deadline && !job.is_open && <span className="badge badge-danger">Closed</span>}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem 1.25rem', fontSize: '0.8rem', color: 'var(--sw-text-muted)' }}>
                        <span><i className="bi bi-building" /> {job.department}</span>
                        <span><i className="bi bi-geo-alt" /> {job.location}</span>
                        <span><i className="bi bi-briefcase" /> {job.job_type_display}</span>
                        {job.application_count != null && <span><i className="bi bi-people" /> {job.application_count} applicants</span>}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                      <button className="btn btn-outline btn-sm" onClick={() => openEdit(job)}>
                        <i className="bi bi-pencil" /> Edit
                      </button>
                      <button className="btn btn-sm" onClick={() => handleDelete(job.id)}
                        style={{ background: 'rgba(224,64,64,0.1)', color: 'var(--sw-danger)', border: '1px solid rgba(224,64,64,0.2)' }}>
                        <i className="bi bi-trash" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )
      }
    </>
  );
}