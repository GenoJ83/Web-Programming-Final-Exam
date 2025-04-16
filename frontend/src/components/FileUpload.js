import React, { useState } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Typography,
  Alert
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';
import axios from 'axios';

const FileUpload = ({ 
  endpoint, 
  fieldName, 
  onUploadSuccess, 
  onUploadError,
  accept,
  maxSize = 5 // in MB
}) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    
    if (selectedFile) {
      // Check file size
      if (selectedFile.size > maxSize * 1024 * 1024) {
        setError(`File size must be less than ${maxSize}MB`);
        return;
      }
      
      setFile(selectedFile);
      setError(null);
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setPreview(reader.result);
        };
        reader.readAsDataURL(selectedFile);
      } else {
        setPreview(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append(fieldName, file);

    try {
      const response = await axios.post(endpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      onUploadSuccess?.(response.data);
      setFile(null);
      setPreview(null);
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Upload failed';
      setError(errorMessage);
      onUploadError?.(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <input
        accept={accept}
        style={{ display: 'none' }}
        id="file-upload"
        type="file"
        onChange={handleFileChange}
      />
      <label htmlFor="file-upload">
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={loading}
        >
          Select File
        </Button>
      </label>

      {file && (
        <Box mt={2}>
          <Typography variant="body2">
            Selected file: {file.name}
          </Typography>
          {preview && (
            <Box mt={1}>
              <img
                src={preview}
                alt="Preview"
                style={{ maxWidth: '200px', maxHeight: '200px' }}
              />
            </Box>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleUpload}
            disabled={loading}
            sx={{ mt: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : 'Upload'}
          </Button>
        </Box>
      )}

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
};

export default FileUpload; 