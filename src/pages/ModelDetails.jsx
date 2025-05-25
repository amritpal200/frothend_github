// import React, { useState, useEffect } from 'react';
// import { useParams, Link } from 'react-router-dom';
// import { FileUploader } from 'react-drag-drop-files';
// import './ModelDetails.css';

// // === TMX Upload Modal ===
// function TrainModelModal({ isOpen, onClose, onUpload }) {
//   const [file, setFile] = useState([]);
//   const fileTypes = ['TMX'];

//   const handleChange = (files) => {
//     setFile(Array.isArray(files) ? files : [files]);
//   };

//   const handleSubmit = () => {
//     if (file.length > 0) onUpload(file);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Upload TMX Files</h2>
//         <FileUploader
//           handleChange={handleChange}
//           name="files"
//           types={fileTypes}
//           multiple={true}
//         />
//         {file.length > 0 && (
//           <div>
//             <p>Files has been selected.</p>
//           </div>
//         )}
//         <div className="modal-buttons">
//           <button onClick={handleSubmit}>Train</button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // === MQXLiff Upload Modal ===
// function TranslateDocumentModal({ isOpen, onClose, onUpload }) {
//   const [file, setFile] = useState(null);
//   const fileTypes = ['mqxliff'];

//   const handleChange = (file) => {
//     setFile(file);
//   };

//   const handleSubmit = () => {
//     if (file) onUpload(file);
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal-overlay">
//       <div className="modal-content">
//         <h2>Upload .mqxliff Document</h2>
//         <FileUploader
//           handleChange={handleChange}
//           name="document"
//           types={fileTypes}
//           multiple={false}
//         />
//         {file && (
//           <div>
//             <p>Selected file:</p>
//             <ul>
//               <li>{file.name}</li>
//             </ul>
//           </div>
//         )}
//         <div className="modal-buttons">
//           <button onClick={handleSubmit}>Translate</button>
//           <button onClick={onClose}>Cancel</button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // === Main Component ===
// function ModelDetails() {
//   const { company, model } = useParams();
//   const [modelInfo, setModelInfo] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isTranslateModalOpen, setIsTranslateModalOpen] = useState(false);

//   // TMX Upload
//   const handleUpload = (receivedFiles) => {
//     console.log("Files received:", receivedFiles);
//     console.log("Type of receivedFiles:", typeof receivedFiles);
//     console.log("Is receivedFiles an array?", Array.isArray(receivedFiles));

//     let fileList = [];
//     if (Array.isArray(receivedFiles) && receivedFiles.length > 0 && receivedFiles[0] instanceof FileList) {
//       fileList = receivedFiles[0]; // Access the FileList inside the array
//       console.log("Extracted FileList:", fileList);
//     } else if (receivedFiles instanceof FileList) {
//       fileList = receivedFiles; // Handle case where it might directly be a FileList
//       console.log("Direct FileList:", fileList);
//     } else {
//       alert("No files selected or unexpected file structure.");
//       return;
//     }

//     const formData = new FormData();
//     for (let i = 0; i < fileList.length; i++) {
//       const file = fileList.item(i); // Use fileList.item(i) to access files
//       console.log("Appending file:", file.name, file);
//       formData.append('files', file);
//     }
//     formData.append('model_name', model);
//     formData.append('company_name', company);
//     formData.append('uploaded_by', localStorage.getItem('userId'));
//     formData.append('base_model', modelInfo.baseModel);

//     fetch('http://localhost:5000/api/train-model', {
//       method: 'POST',
//       body: formData,
//     }).then((response) => {
//       if (response.ok) {
//         setIsModalOpen(false); // <-- Esto se ejecuta cuando la *respuesta* llega
//         alert(`Training started for ${fileList.length} files.`);
//       } else {
//         response.json().then(data => alert(`Training failed: ${data.error || 'Unknown error'}`));
//       }
//     });
// };

//   // MQXLiff Upload
//   const handleDocumentUpload = (file) => {
//     const formData = new FormData();
//     formData.append('file', file);
//     formData.append('model_name', model);
//     formData.append('company_name', company);
//     formData.append('model_id', modelInfo.id);
//     formData.append('user_id', localStorage.getItem('userId'));
//     formData.append('base_model', modelInfo.baseModel);
//     console.log("modelInfo before upload:", modelInfo);

//     fetch('https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/modeldetail', {
//       method: 'POST',
//       body: formData,
//     })
//       .then(res => res.json())
//       .then(data => {
//         console.log(data);
//         setIsTranslateModalOpen(false);
//         // Reload page to fetch new list of documents
//         window.location.reload();
//       })
//       .catch(err => {
//         console.error('Error uploading document:', err);
//       });
//   };
//   // https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/companydetails/${name}
//   // https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/modeldetail/{company}/model/{model}
//   useEffect(() => {
//     fetch(`https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/modeldetail/${company}/model/${model}`)
//       .then((res) => res.json())
//       .then((data) => setModelInfo(data))
//       .catch((err) => console.error('Error fetching model info:', err));
//   }, [company, model]);

//   if (!modelInfo) return <p>Loading...</p>;

//   return (
//     <div className="model-details-container">
//       <h1>Model: {modelInfo.name}</h1>
//       <p><strong>Company:</strong> {company}</p>

//       <div className="model-info-box">
//         <p><strong>Base Model:</strong> {modelInfo.baseModel}</p>
//         <p><strong>Status:</strong>{' '}
//           <span className={`status-label ${modelInfo.status}`}> 
//             {modelInfo.status}
//           </span>
//         </p>
//         <p><strong>Created:</strong> {modelInfo.created}</p>
//       </div>

//       <div className="model-buttons">
//         <button className="train-btn" onClick={() => setIsModalOpen(true)}>Train Model (.tmx)</button>
//         <TrainModelModal
//           isOpen={isModalOpen}
//           onClose={() => setIsModalOpen(false)}
//           onUpload={handleUpload}
//         />
//         <button className="translate-btn" onClick={() => setIsTranslateModalOpen(true)}>Translate New Document</button>
//         <TranslateDocumentModal
//           isOpen={isTranslateModalOpen}
//           onClose={() => setIsTranslateModalOpen(false)}
//           onUpload={handleDocumentUpload}
//         />
//       </div>
//       <section className="translated-section">
//         <h2>Translated Documents</h2>
//         <ul>
//           {modelInfo.documents.map((doc, idx) => (
//             <li key={idx}>
//               <Link
//                 to={`/company/${company}/model/${model}/document/${doc.id}`}
//                 className="doc-link"
//               >
//                 📄 {doc.name}
//               </Link>
//             </li>
//           ))}
//         </ul>
//       </section>
//     </div>
//   );
// }

// export default ModelDetails;






import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileUploader } from 'react-drag-drop-files';
import './ModelDetails.css';

/* -----------------  TMX Upload Modal  ----------------- */
function TrainModelModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState([]);
  const fileTypes = ['TMX'];

  const handleChange = (files) => setFile(Array.isArray(files) ? files : [files]);
  const handleSubmit = () => file.length && onUpload(file);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Upload TMX Files</h2>
        <FileUploader handleChange={handleChange} name="files" types={fileTypes} multiple />
        {file.length > 0 && <p>Files selected.</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Train</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ---------------  MQXLiff Upload Modal  --------------- */
function TranslateDocumentModal({ isOpen, onClose, onUpload }) {
  const [file, setFile] = useState(null);
  const fileTypes = ['mqxliff'];

  const handleChange = (f) => setFile(f);
  const handleSubmit = () => file && onUpload(file);
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <h2>Upload .mqxliff Document</h2>
        <FileUploader handleChange={handleChange} name="document" types={fileTypes} />
        {file && <p>Selected: {file.name}</p>}
        <div className="modal-buttons">
          <button onClick={handleSubmit}>Translate</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* --------------------  Main Page  -------------------- */
export default function ModelDetails() {
  const { company, model } = useParams();
  const [modelInfo, setModelInfo] = useState(null);
  const [isTmxModalOpen, setTmxModalOpen] = useState(false);
  const [isDocModalOpen, setDocModalOpen] = useState(false);

  /* ---------- fetch model details once ---------- */
  useEffect(() => {
    fetch(
      `https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/modeldetail/${company}/model/${model}`
    )
      .then((r) => r.json())
      .then((data) => {
        const raw = data.model ?? data;                 // unwrap if `{ success, model }`
        setModelInfo({
          ...raw,
          documents: raw.documents ?? [],               // always an array
          status: (raw.status ?? 'UNKNOWN').toUpperCase()
        });
      })
      .catch((e) => console.error('Fetch model info:', e));
  }, [company, model]);

  /* ---------- TMX Upload ---------- */
  const handleUpload = (received) => {
    const list = Array.isArray(received) ? received[0] || [] : received;
    if (!list.length) return alert('No files selected');

    const fd = new FormData();
    Array.from(list).forEach((f) => fd.append('files', f));
    fd.append('model_name', model);
    fd.append('company_name', company);
    fd.append('uploaded_by', localStorage.getItem('userId') || '');
    fd.append('base_model', modelInfo?.baseModel || '');

    fetch('http://localhost:5000/api/train-model', { method: 'POST', body: fd })
      .then((r) => (r.ok ? r.json() : Promise.reject(r)))
      .then(() => {
        setTmxModalOpen(false);
        alert(`Training started for ${list.length} files.`);
      })
      .catch(() => alert('Training failed'));
  };

  /* ---------- MQXLIFF Upload ---------- */
  const handleDocumentUpload = (file) => {
    const fd = new FormData();
    fd.append('file', file);
    fd.append('model_name', model);
    fd.append('company_name', company);
    fd.append('model_id', modelInfo?.id ?? '');
    fd.append('user_id', localStorage.getItem('userId') || '');
    fd.append('base_model', modelInfo?.baseModel || '');

    fetch('https://gslusqinof.execute-api.us-east-1.amazonaws.com/1/backend/modeldetail', {
      method: 'POST',
      body: fd
    })
      .then((r) => r.json())
      .then(() => {
        setDocModalOpen(false);
        window.location.reload();
      })
      .catch((e) => console.error('Document upload error:', e));
  };

  /* ---------- loading state ---------- */
  if (!modelInfo) return <p>Loading…</p>;

  const { documents, baseModel, status, created, name: modelName } = modelInfo;

  return (
    <div className="model-details-container">
      <h1>Model: {modelName}</h1>
      <p><strong>Company:</strong> {company}</p>

      <div className="model-info-box">
        <p><strong>Base Model:</strong> {baseModel || '—'}</p>
        <p>
          <strong>Status:</strong>{' '}
          <span className={`status-label ${status.toLowerCase()}`}>{status}</span>
        </p>
        <p><strong>Created:</strong> {created || '—'}</p>
      </div>

      <div className="model-buttons">
        <button className="train-btn" onClick={() => setTmxModalOpen(true)}>
          Train Model (.tmx)
        </button>
        <TrainModelModal
          isOpen={isTmxModalOpen}
          onClose={() => setTmxModalOpen(false)}
          onUpload={handleUpload}
        />

        <button className="translate-btn" onClick={() => setDocModalOpen(true)}>
          Translate New Document
        </button>
        <TranslateDocumentModal
          isOpen={isDocModalOpen}
          onClose={() => setDocModalOpen(false)}
          onUpload={handleDocumentUpload}
        />
      </div>

      <section className="translated-section">
        <h2>Translated Documents</h2>
        <ul>
          {documents.map((doc) => (
            <li key={doc.id}>
              <Link
                to={`/company/${company}/model/${model}/document/${doc.id}`}
                className="doc-link"
              >
                📄 {doc.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
