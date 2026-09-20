import { useEffect, useState } from 'react'
import EmptyState from '../components/EmptyState'
import PageIntro from '../components/PageIntro'
import { createReport, getReports } from '../services/api'

const initialForm = {
  reporterName: '',
  email: '',
  title: '',
  description: '',
  reportType: '',
  location: '',
  latitude: '',
  longitude: '',
  photo: '',
}

const reportTypes = ['Deforestation', 'Fire', 'Illegal activity', 'Wildlife', 'Pollution', 'Other']

function fieldClasses() {
  return 'mt-1.5 w-full rounded-lg border border-[#cbd8c9] bg-white px-3 py-2.5 text-sm text-[#244238] outline-none placeholder:text-[#91a59a] focus:border-[#6c9561] focus:ring-2 focus:ring-[#dcebd0]'
}

function Reports() {
  const [reports, setReports] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState(null)
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    let active = true

    getReports()
      .then((data) => {
        if (active) {
          setReports(data)
          setLoading(false)
        }
      })
      .catch((requestError) => {
        if (active) {
          setError(requestError)
          setLoading(false)
        }
      })

    return () => {
      active = false
    }
  }, [])

  function handleChange(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    setSubmitError(null)
    setSuccessMessage('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSubmitting(true)
    setSubmitError(null)
    setSuccessMessage('')

    try {
      const createdReport = await createReport({
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
      })
      setReports((current) => [createdReport, ...(current || [])])
      setForm(initialForm)
      setSuccessMessage('Your community report was submitted successfully.')
    } catch (requestError) {
      setSubmitError(requestError.details ? Object.values(requestError.details).join(' ') : requestError.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8">
      <PageIntro eyebrow="Community signal" title="Community reports" description="Share a field observation with the restoration team and review reports already submitted by the community." />

      <section className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-6 shadow-sm shadow-[#294f3608] sm:p-8">
        <div className="max-w-2xl">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789176]">Submit an observation</p>
          <h2 className="mt-2 text-xl font-semibold text-[#244238]">What are you seeing?</h2>
          <p className="mt-2 text-sm leading-6 text-[#60786d]">Add a precise location and enough detail for the observation to be reviewed. Photos are currently stored as a URL or local path.</p>
        </div>

        <form onSubmit={handleSubmit} className="mt-7 space-y-5">
          <div className="grid gap-5 md:grid-cols-2">
            <label className="block text-sm font-medium text-[#49675b]">Reporter name<input required name="reporterName" value={form.reporterName} onChange={handleChange} className={fieldClasses()} placeholder="Your name" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Email<input required type="email" name="email" value={form.email} onChange={handleChange} className={fieldClasses()} placeholder="you@example.com" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Title<input required name="title" value={form.title} onChange={handleChange} className={fieldClasses()} placeholder="Short report title" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Report type<select required name="reportType" value={form.reportType} onChange={handleChange} className={fieldClasses()}><option value="">Select a report type</option>{reportTypes.map((type) => <option key={type}>{type}</option>)}</select></label>
          </div>

          <label className="block text-sm font-medium text-[#49675b]">Description<textarea required name="description" value={form.description} onChange={handleChange} rows="4" className={`${fieldClasses()} resize-y`} placeholder="Describe what you observed..." /></label>

          <div className="grid gap-5 md:grid-cols-3">
            <label className="block text-sm font-medium text-[#49675b] md:col-span-1">Location<input name="location" value={form.location} onChange={handleChange} className={fieldClasses()} placeholder="Nearest place or landmark" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Latitude<input required type="number" min="-90" max="90" step="any" name="latitude" value={form.latitude} onChange={handleChange} className={fieldClasses()} placeholder="e.g. 22.5726" /></label>
            <label className="block text-sm font-medium text-[#49675b]">Longitude<input required type="number" min="-180" max="180" step="any" name="longitude" value={form.longitude} onChange={handleChange} className={fieldClasses()} placeholder="e.g. 88.3639" /></label>
          </div>

          <label className="block text-sm font-medium text-[#49675b]">Photo URL / path<input type="text" name="photo" value={form.photo} onChange={handleChange} className={fieldClasses()} placeholder="https://example.com/photo.jpg or /uploads/photo.jpg" /></label>

          {submitError && <div className="rounded-lg bg-[#fbe4dc] px-4 py-3 text-sm text-[#9a4d3e]" role="alert">{submitError}</div>}
          {successMessage && <div className="rounded-lg bg-[#e5efd8] px-4 py-3 text-sm text-[#507749]" role="status">{successMessage}</div>}
          <div className="flex justify-end">
            <button disabled={submitting} type="submit" className="rounded-lg bg-[#255847] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#1d4839] disabled:cursor-wait disabled:opacity-60">{submitting ? 'Submitting...' : 'Submit report'}</button>
          </div>
        </form>
      </section>

      <section className="space-y-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#789176]">Community stream</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-[#244238]">Existing reports</h2>
        </div>
        {loading && <EmptyState title="Loading community reports" description="Retrieving submitted observations from the TeraPlus API." />}
        {error && <EmptyState title="Community reports are unavailable" description={error.message} />}
        {!loading && !error && !reports?.length && <EmptyState title="No reports found" description="Your report will appear here after it is submitted." />}
        {!!reports?.length && (
          <div className="space-y-3">
            {reports.map((report) => (
              <article key={report._id} className="rounded-2xl border border-[#dce5da] bg-[#fbfcfa] p-5 shadow-sm shadow-[#294f3608]">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
                  <div>
                    <h3 className="font-semibold text-[#244238]">{report.title}</h3>
                    <p className="mt-1 text-sm text-[#71867b]">{report.reportType} · {report.location || 'Location pending'}</p>
                  </div>
                  <span className="w-fit rounded-full bg-[#edf2e9] px-2.5 py-1 text-xs font-semibold text-[#5e776b]">{report.status}</span>
                </div>
                <p className="mt-4 text-sm leading-6 text-[#60786d]">{report.description}</p>
                <p className="mt-3 text-xs text-[#91a59a]">Coordinates: {report.latitude}, {report.longitude}</p>
                {report.photo && <a href={report.photo} target="_blank" rel="noreferrer" className="mt-3 inline-block text-sm font-semibold text-[#47723d] hover:text-[#244238]">Open attached photo →</a>}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default Reports