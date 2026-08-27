import React, { useEffect, useRef, useState } from "react";
import "./KnowledgePage.css";
import { financeAIapi,api } from "../../api/AxiosConfig";
import SideNavBar from "../SideNavBar/SideNavBar";

const KnowledgePage = () => {
  const [documents, setDocuments] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [loading, setLoading] = useState(true);
  const [navBarisToggle, setNavBarisToggle] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    loadDocuments();
  }, []);

  const setNavBarTogggle = () => {
    setNavBarisToggle(!navBarisToggle);
  }

  const loadDocuments = async () => {
    try {
      setLoading(true);

      const response = await api.get("/financeAIFile/getFiles");

      console.log("Fetching fiels",response.data.data);

      setDocuments(response.data.data || []);
    } catch (error) {
      console.error("Failed to load documents:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    if (file.type !== "application/pdf") {
      alert("Only PDF files are allowed.");
      event.target.value = "";
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile || uploading) {
      return;
    }

    const formData = new FormData();

    formData.append("file", selectedFile);

    try {
      setUploading(true);

      const response = await api.post(
        "/financeAIFile",
        formData
      );
      setSelectedFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
      if(response.data.success){
        loadDocuments();
      }
    } catch (error) {
      console.error("Failed to upload document:", error);
      alert("Failed to upload document.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (objectKey) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this document?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response=await api.delete("/financeAIFile", {
        params: {
          objectKey: objectKey
        }
      });

      if(response.data.success){
        loadDocuments();
      }

    } catch (error) {
      console.error("Failed to delete document:", error);
      alert("Failed to delete document.");
    }
  };

  const displayValue = (value) => {
    if (
      value === null ||
      value === undefined ||
      value === ""
    ) {
      return "Not available";
    }

    return value;
  };

  const handleDownload = async (doc) => {
    try {
      const response = await api.get("/financeAIFile", {
        params: {
          objectKey: doc.objectKey
        },
        responseType: "blob"
      });
  
      const blob = new Blob([response.data]);
  
      const url = window.URL.createObjectURL(blob);
  
      const link = document.createElement("a");
  
      link.href = url;
      link.download = doc.fileName || "document.pdf";
  
      document.body.appendChild(link);
  
      link.click();
  
      link.remove();
  
      window.URL.revokeObjectURL(url);
  
    } catch (error) {
      console.error("Failed to download document:", error);
      alert("Failed to download document.");
    }
  };


  return (
    <div className="KnowledgePageContainer">
    <div className="navBar">
        <SideNavBar
          isToggle={setNavBarTogggle}
        />
      </div>

      <div className="KnowledgeMasterContainer">

        {/* Header */}

        <div className="KnowledgeHeader card">

          <div>
            <h1>Knowledge</h1>

            <p>
              Upload your financial documents to make them
              available to Finance AI.
            </p>
          </div>

          <button
            className="KnowledgeUploadButton"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload PDF
          </button>

          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            hidden
          />

        </div>


        {/* Selected file */}

        {selectedFile && (
          <div className="KnowledgeSelectedFile card">

            <div>
              <span className="KnowledgeSelectedLabel">
                Selected file
              </span>

              <strong>
                {selectedFile.name}
              </strong>
            </div>

            <div className="KnowledgeSelectedActions">

              <button
                className="KnowledgeCancelButton"
                onClick={() => {
                  setSelectedFile(null);

                  if (fileInputRef.current) {
                    fileInputRef.current.value = "";
                  }
                }}
              >
                Cancel
              </button>

              <button
                className="KnowledgeConfirmButton"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>

            </div>

          </div>
        )}


        {/* Documents */}

        <div className="KnowledgeDocuments card">

          <div className="KnowledgeDocumentsHeader">
            <div className="KnowledgeDocumentsSubHeader">
              <h2>Your Documents</h2>
            </div>

            <span className="KnowledgeDocumentCount">
              {documents.length}
            </span>
          </div>


          {loading ? (

            <div className="KnowledgeEmptyState">
              Loading documents...
            </div>

          ) : documents.length === 0 ? (

            <div className="KnowledgeEmptyState">
              <div className="KnowledgeEmptyIcon">
                PDF
              </div>

              <h3>No documents yet</h3>

              <p>
                Upload a PDF document to get started.
              </p>
            </div>

          ) : (

            <div className="KnowledgeDocumentList">

              {documents.map((doc) => (

                <div
                  className="KnowledgeDocumentItem"
                  key={doc.objectKey}
                >

                  <div className="KnowledgeDocumentIcon">
                    PDF
                  </div>


                  <div className="KnowledgeDocumentMain">

                    <div className="KnowledgeDocumentTitle">
                      
                      {displayValue(doc.fileName)}
                    </div>

                    <div className="KnowledgeDocumentSummary">
                    <b>Summary-: </b>
                      {displayValue(doc.docSummary)}
                    </div>

                    <div className="KnowledgeDocumentMeta">
                      <b>Status-: </b>
                      <span
                        className={`KnowledgeStatus KnowledgeStatus-${String(
                          doc.documentState || "PROCESSING"
                        ).toLowerCase()}`}
                      >
                        {displayValue(doc.documentState)}
                      </span>

                      <span>
                        <b>Document Type: </b>{displayValue(doc.docType)}
                      </span>

                    </div>

                  </div>


                  <button
                    className="KnowledgeDeleteButton"
                    onClick={() => handleDelete(doc.objectKey)}
                  >
                    Delete
                  </button>

                  <button
                    className="KnowledgeDownloadButton"
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </button>

                </div>

              ))}

            </div>

          )}

        </div>

      </div>

    </div>
  );
};

export default KnowledgePage;