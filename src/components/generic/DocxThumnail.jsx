import React, { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";

const DocxThumbnail = ({ docxHtmlContent }) => {
  const [thumbnail, setThumbnail] = useState(null);
  const docxContainerRef = useRef(null);

  useEffect(() => {
    const convertDocxToThumbnail = async () => {
      if (docxContainerRef.current) {
        docxContainerRef.current.innerHTML = docxHtmlContent;
      }

      // Convert the HTML content to canvas
      const canvas = await html2canvas(docxContainerRef.current);
      const imgDataUrl = canvas.toDataURL("image/png");

      // Set the image data URL as the thumbnail
      setThumbnail(imgDataUrl);
    };

    convertDocxToThumbnail();
  }, [docxHtmlContent]);

  return (
    <div>
      <div ref={docxContainerRef} style={{ display: "none" }}></div>
      {thumbnail && (
        <img
          src={thumbnail}
          alt="DOCX Thumbnail"
          style={{ width: "150px", height: "auto" }}
        />
      )}
    </div>
  );
};

export default DocxThumbnail;
