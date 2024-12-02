import { memo, useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

import { Button } from "@/components/ui/button";
import FileUploadArea from "@/components/file-upload/file-upload-area";
import { Icon } from "@/components/icons";
import { cn } from "@/lib/utils";
import Image from "next/image";

type FilePreviewProps = {
  image: File | string | null;
  setImage: (image: File | null) => void;
  className?: string;
};

type LogoUploadModalProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  handleUploadLogo: (image: File) => void;
};

export const LogoUploadModal = ({
  open,
  setOpen,
  handleUploadLogo,
}: LogoUploadModalProps) => {
  const [image, setImage] = useState<File | null>(null);

  const onClickSaveLogo = () => {
    if (!!image) {
      handleUploadLogo(image);
      setOpen(false);
      setImage(null);
    }
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-logan-black">
            Upload Logo
          </DialogTitle>
          <DialogDescription className="hidden">
            Upload images from your device or paste a URL.
          </DialogDescription>
        </DialogHeader>
        {image ? (
          <FilePreview image={image} setImage={setImage} />
        ) : (
          <FileUploadArea
            acceptedfileTypes={["image/*"]}
            onUpload={(Files: File[]) => {
              setImage(Files[0]);
            }}
          />
        )}
        <DialogFooter>
          <Button
            onClick={onClickSaveLogo}
            disabled={!image}
            className={`${
              !image
                ? "bg-logan-primary-200 text-logan-black-foreground"
                : "bg-primary-gradient text-white opacity-90 hover:opacity-100"
            } px-4 py-2 rounded-lg transition-colors duration-200`}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const FilePreview = memo(
  ({ image, setImage, className }: FilePreviewProps) => {
    const [imageUrl, setImageUrl] = useState<string>("");

    useEffect(() => {
      if (image instanceof File) {
        setImageUrl(URL.createObjectURL(image));
      } else if (typeof image === "string") {
        setImageUrl(image);
      }
    }, [image]);

    const handleRemoveImage = () => {
      setImage(null);
    };

    return (
      <div
        className={cn(
          "flex mb-4 h-[5.875rem] w-[20rem]  items-center gap-3 rounded-md bg-six p-3 bg-logan-primary-300 ",
          className
        )}
      >
        <div className="h-full border border-logan-primary-300">
          {imageUrl && (
            <Image
              src={imageUrl}
              alt="Company Logo"
              fill
              className="!static rounded object-cover w-full h-full"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          )}
        </div>
        <span className="w-[60%] overflow-hidden overflow-ellipsis whitespace-nowrap text-primary-gray">
          {image instanceof File ? image.name : ""}
        </span>
        <div
          className="ml-auto mr-2 cursor-pointer"
          onClick={handleRemoveImage}
        >
          <Icon onClick={handleRemoveImage} iconName="trash" fill="#383D44" />
        </div>
      </div>
    );
  }
);

FilePreview.displayName = "FilePreview";
