"use client";
import Image from "next/image";
import { useEffect, useState } from "react";

function RemSizeImage(props) {
  const [imageProps, setImageProps] = useState();
  useEffect(() => {
    if (window !== undefined) {
      const screenWidth = window.innerWidth;
      let calcWidth, calcHeight;
      if (screenWidth >= 2561) {
        calcWidth = props.remWidth * 38.4;
        calcHeight = props.remHeight * 38.4;
      } else if (screenWidth >= 1920) {
        calcWidth = props.remWidth * 21.3328;
        calcHeight = props.remHeight * 21.3328;
      } else {
        calcWidth = props.remWidth * 16;
        calcHeight = props.remHeight * 16;
      }
      setImageProps({
        ...props,
        remWidth: calcWidth,
        remHeight: calcHeight,
        imagePath: props.imagePath,
      });
    } else {
      setImageProps({
        ...props,
      });
    }
  }, [props]);
  return (
    <>
      {imageProps?.imagePath && (
        <Image
          className={imageProps?.className ? imageProps?.className : ""}
          src={imageProps?.imagePath}
          height={imageProps?.remHeight}
          width={imageProps?.remWidth}
          alt={imageProps?.alt}
          onClick={imageProps?.onClick}
        />
      )}
    </>
  );
}

export default RemSizeImage;
