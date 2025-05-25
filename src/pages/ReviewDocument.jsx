import React, { useState, useEffect } from 'react';
import './ReviewDocument.css';
import { useParams } from 'react-router-dom';

function ReviewDocument() {
  const { company, model, docId } = useParams();
  const [segments, setSegments] = useState([]);
  const [docName, setDocName] = useState('');
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:5000/api/company/${company}/model/${model}/document/${docId}/segments`)
      .then(res => res.json())
      .then(data => {
        setSegments(data.segments);
        setDocName(data.document_name);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching segments:', err);
        setLoading(false);
      });
  }, [docId]);

  const updateSegment = (unit_id, updates) => {
    setSegments(prevSegments =>
      prevSegments.map(seg =>
        seg.id === unit_id ? { ...seg, ...updates } : seg
      )
    );
  };

  const saveChanges = () => {
    fetch(`http://localhost:5000/api/documents/${docId}/segments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ segments }),
    })
    .then(res => res.json())
    .then(data => alert('Changes saved successfully!'))
    .catch(err => alert('Error saving changes'));
  };

  const downloadReview = () => {
    window.open(`http://localhost:5000/api/documents/${docId}/download`, '_blank');
  };

  const filteredSegments = segments.filter(seg => {
    if (filter === 'all') return true;
    return seg.status === filter;
  });

  if (loading) return <p>Loading segments...</p>;

  return (
    <div className="review-container">
      <h1>Reviewing: {docName}</h1>
      <p><strong>Company:</strong> {company} | <strong>Model:</strong> {model}</p>

      <div className="filter-bar">
        {['all', 'NotStarted', 'ManuallyConfirmed', 'Edited'].map(f => (
          <button
            key={f}
            className={filter === f ? 'active-filter' : ''}
            onClick={() => setFilter(f)}
          >
            {f.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="segments">
        {filteredSegments.map(seg => (
          <div key={seg.id} className="segment-box">
            <div className="segment-columns">
              <div>
                <h4>Original</h4>
                <p>{seg.original_text}</p>
              </div>
              <div>
                <h4>AI Translation</h4>
                <p>{seg.translated_text}</p>
              </div>
              <div>
                <h4>Your Review</h4>
                <textarea
                  value={seg.review || seg.translated_text}
                  onChange={e => updateSegment(seg.id, { review: e.target.value })}
                />
              </div>
            </div>

            <div className="segment-actions">
              <input
                type="text"
                placeholder="Comment"
                value={seg.comment || ''}
                onChange={e => updateSegment(seg.id, { comment: e.target.value })}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="finalize-review">
        <button className="export-btn" onClick={saveChanges}>💾 Save Changes</button>
        <button className="export-btn" onClick={downloadReview}>📥 Download Reviewed File</button>
      </div>
    </div>
  );
}

export default ReviewDocument;