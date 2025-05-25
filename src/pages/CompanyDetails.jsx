import React, { useEffect, useState } from 'react'
import './CompanyDetails.css'
import { useParams, useNavigate } from 'react-router-dom'

function CompanyDetails() {
  const { name } = useParams()
  const navigate = useNavigate()
  const [models, setModels] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [newModelName, setNewModelName] = useState('')
  const [baseModel, setBaseModel] = useState('')

  useEffect(() => {
    fetch(`https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/companydetails/${name}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setModels(data.models)
        else console.error(data.message)
      })
      .catch(err => console.error('Fetch error:', err))
  }, [name])

  const handleModelClick = (modelName) => {
    navigate(`/company/${name}/model/${modelName}`)
  }

  const handleNewModelSubmit = (e) => {
    e.preventDefault()
    // https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/companydetails${name}

    fetch(`https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/companydetails/${name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name_model: newModelName,
        base_model: baseModel
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setShowModal(false)
          setModels(prev => [...prev, { name_model: newModelName, base_model: baseModel }])
          setNewModelName('')
          setBaseModel('')
        } else {
          alert(data.message)
        }
      })
      .catch(err => console.error('Submit error:', err))
  }

  return (
    <div className="company-details-container">
      <div className="company-header">
        <h1>{name} — Models</h1>
        <button className="new-model-btn" onClick={() => setShowModal(true)}>
          + New Model
        </button>
      </div>

      <div className="model-grid">
        {models.map((model, idx) => (
          <div
            key={idx}
            className="model-card"
            onClick={() => handleModelClick(model.name_model)}
          >
            <h3>{model.name_model}</h3>
            <p>📂 {model.base_model}</p>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>Create New Model</h2>
            <form onSubmit={handleNewModelSubmit}>
              <input
                type="text"
                placeholder="Model Name"
                value={newModelName}
                onChange={(e) => setNewModelName(e.target.value)}
                required
              />
              <label htmlFor="baseModel">Base Model:</label>
              <select
                id="baseModel"
                value={baseModel}
                onChange={(e) => setBaseModel(e.target.value)}
                required
                >
                <option value="">-- Select Base Model --</option>
                <option value="T5">T5</option>
                <option value="MarianMT">MarianMT</option>
               </select>
              <div className="modal-buttons">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default CompanyDetails
