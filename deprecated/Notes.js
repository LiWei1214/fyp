import React, {useState} from 'react';
import Tesseract from 'tesseract.js';

const OCRUploader = ({onTextExtracted}) => {
  const [image, setImage] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageUpload = event => {
    const file = event.target.files[0];
    if (file) {
      setImage(URL.createObjectURL(file));
      extractText(file);
    }
  };

  const extractText = async file => {
    setLoading(true);
    try {
      const {data} = await Tesseract.recognize(file, 'eng', {
        logger: m => console.log(m),
      });
      setText(data.text);
      onTextExtracted(data.text);
    } catch (error) {
      console.error('OCR Error:', error);
    }
    setLoading(false);
  };

  return (
    <div>
      <input type="file" accept="image/*" onChange={handleImageUpload} />
      {loading && <p>Processing...</p>}
      {image && <img src={image} alt="Uploaded preview" width="200px" />}
      <textarea value={text} onChange={e => setText(e.target.value)} />
    </div>
  );
};

export default OCRUploader;
