import React, { useState } from 'react'
import './ReviewDocument.css'
import { useParams } from 'react-router-dom'

function ReviewDocument() {
  const { company, model, docId } = useParams()

  // Dummy segment data
  const initialSegments = [
    {
      id: 1,
      original: 'The quick brown fox jumps over the lazy dog.',
      aiTranslation: 'El rápido zorro marrón salta sobre el perro perezoso.',
      review: '',
      status: 'pending',
      comment: ''
    },
    {
      id: 2,
      original: 'Please ensure all invoices are submitted by Friday.',
      aiTranslation: 'Por favor, asegúrese de que todas las facturas se presenten antes del viernes.',
      review: '',
      status: 'pending',
      comment: ''
    }
  ]

  const [segments, setSegments] = useState(initialSegments)
  const [filter, setFilter] = useState('all')

  const updateSegment = (id, updates) => {
    setSegments(segments.map(seg => seg.id === id ? { ...seg, ...updates } : seg))
  }

  const filteredSegments = segments.filter(seg => {
    if (filter === 'all') return true
    return seg.status === filter
  })

  return (
    <div className="review-container">
      <h1>Reviewing: {docId}</h1>
      <p><strong>Company:</strong> {company} | <strong>Model:</strong> {model}</p>

      <div className="filter-bar">
        {['all', 'pending', 'approved', 'rejected', 'needs_review'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active-filter' : ''}
            onClick={() => setFilter(f)}
          >
            {f.replace('_', ' ').toUpperCase()}
          </button>
        ))}
      </div>

      <div className="segments">
        {filteredSegments.map(seg => (
          <div key={seg.id} className="segment-box">
            <div className="segment-columns">
              <div>
                <h4>Original</h4>
                <p>{seg.original}</p>
              </div>
              <div>
                <h4>AI Translation</h4>
                <p>{seg.aiTranslation}</p>
              </div>
              <div>
                <h4>Your Review</h4>
                <textarea
                  value={seg.review}
                  onChange={e => updateSegment(seg.id, { review: e.target.value })}
                />
              </div>
            </div>

            <div className="segment-actions">
              <button onClick={() => updateSegment(seg.id, { status: 'approved' })}>✅ Approve</button>
              <button onClick={() => updateSegment(seg.id, { status: 'rejected' })}>❌ Reject</button>
              <button onClick={() => updateSegment(seg.id, { status: 'needs_review' })}>⚠️ Needs Review</button>

              <input
                type="text"
                placeholder="Comment"
                value={seg.comment}
                onChange={e => updateSegment(seg.id, { comment: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="finalize-review">
        <button className="export-btn">📤 Finalize Review</button>
      </div>
    </div>
  )
}

export default ReviewDocument
