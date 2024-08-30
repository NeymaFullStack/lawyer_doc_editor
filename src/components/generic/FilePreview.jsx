import React, { useEffect, useState } from "react";
import RemSizeImage from "./RemSizeImage";
import Image from "next/image";
import { cn } from "@/utils/shadcn-utils";

let imgFormats = ["image/png", "image/jpg", "image/jpeg"];

function FilePreview({ file, deleteFile, className }) {
  const [imageUrl, setImageUrl] = useState("");
  const style = {
    height: imgFormats.includes(file.type) ? "4rem" : "5rem",
    width: imgFormats.includes(file.type) ? "5.5rem" : "4rem",
  };
  useEffect(() => {
    if (imgFormats.includes(file.type)) {
      setImageUrl(URL.createObjectURL(file));
    } else if (!imgFormats.includes(file.type)) {
      setImageUrl("/assets/icons/doc-preview.svg");
    }
  }, [file]);

  return (
    <div
      className={cn(
        "mt-4  flex min-h-[5.875rem] w-[20rem] min-w-[20rem] items-center gap-2 rounded-md bg-six p-3",
        className,
      )}
    >
      <div className="relative border border-secondary-blue" style={style}>
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
      <span className="w-[60%] overflow-hidden overflow-ellipsis whitespace-nowrap">
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
  );
}

export default FilePreview;
