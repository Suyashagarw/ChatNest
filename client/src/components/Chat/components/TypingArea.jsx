import React, { useRef } from 'react';
import { fileUpload } from '../../../api';

const TypingArea = ({ message, setMessage, onSubmit }) => {
  // Ref for the hidden file input
  const fileInputRef = useRef(null);
  const formRef = useRef(null);  // Add a ref for the form

  // Function to trigger file input click
  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  // Function to handle file selection and upload
  const onClickFileuploader = async (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      try {
        const fileURL = await fileUpload(file);
        console.log(fileURL.data.response);
        setMessage(fileURL.data.response);
  
        // Call the onSubmit function manually
        onSubmit({ message: fileURL.data.response }); // Adjust this depending on how onSubmit is structured
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  };

  return (
    <div className="p-3 chat-input-section">
      <form className="row" onSubmit={onSubmit} ref={formRef}>
        <div className="col">
          <div className="position-relative upload-icon">
            {/* Modified button to trigger file input click */}
            <button
              className="btn btn-primary upload-icon"
              type="button"
              onClick={handleUploadClick}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cloud-arrow-up" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M7.646 5.146a.5.5 0 0 1 .708 0l2 2a.5.5 0 0 1-.708.708L8.5 6.707V10.5a.5.5 0 0 1-1 0V6.707L6.354 7.854a.5.5 0 1 1-.708-.708z" />
                <path d="M4.406 3.342A5.53 5.53 0 0 1 8 2c2.69 0 4.923 2 5.166 4.579C14.758 6.804 16 8.137 16 9.773 16 11.569 14.502 13 12.687 13H3.781C1.708 13 0 11.366 0 9.318c0-1.763 1.266-3.223 2.942-3.593.143-.863.698-1.723 1.464-2.383zm.653.757c-.757.653-1.153 1.44-1.153 2.056v.448l-.445.049C2.064 6.805 1 7.952 1 9.318 1 10.785 2.23 12 3.781 12h8.906C13.98 12 15 10.988 15 9.773c0-1.216-1.02-2.228-2.313-2.228h-.5v-.5C12.188 4.825 10.328 3 8 3a4.53 4.53 0 0 0-2.941 1.1z" />
              </svg>
            </button>
            <input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              type="text"
              placeholder="Enter Message..."
              className="form-control chat-input"
            />
            {/* Hidden file input */}
            <input
              type="file"
              ref={fileInputRef}
              style={{ display: 'none' }}
              onChange={onClickFileuploader} // file change handler
              accept="image/png, image/jpeg, application/pdf, text/plain" // Restrict file types
            />
            <div className="col-auto">
              <button
                type="submit"
                className="btn btn-primary btn-rounded chat-send w-md"
              >
                <span className="d-none d-sm-inline-block mr-2">Send</span>
                <svg width={13} height={13} viewBox="0 0 24 24" tabIndex={-1}>
                  <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" fill="white" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default TypingArea;
