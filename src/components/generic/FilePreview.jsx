import React, { useEffect, useState } from "react";
import RemSizeImage from "./RemSizeImage";
import Image from "next/image";

function FilePreview({ file, deleteFile }) {
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    setImageUrl(URL.createObjectURL(file));
  }, [file]);
  return (
    <div className="mt-7 h-[9rem] w-full">
      <div className="flex w-full items-center gap-2 rounded-md bg-six p-3">
        <div
          className="relative border border-secondary-blue"
          style={{ width: "5.5rem", height: "4rem" }}
        >
          {imageUrl && (
            <Image
              src={imageUrl}
              alt={"Company Logo"}
              layout="fill"
              objectFit="cover"
              className="rounded" // Add a class if you want rounded corners
              quality={100} // Set the quality of the image
            />
          )}
        </div>
        <span className="w-[45%] overflow-hidden overflow-ellipsis whitespace-nowrap">
          {file.name}
        </span>
        <div className="ml-auto mr-2 cursor-pointer" onClick={deleteFile}>
          <RemSizeImage
            imagePath={"/assets/icons/delete-outline.svg"}
            remWidth={1.3}
            remHeight={1.3}
            alt={"drawer-close"}
          />
        </div>
      </div>
    </div>
  );
}

export default FilePreview;
