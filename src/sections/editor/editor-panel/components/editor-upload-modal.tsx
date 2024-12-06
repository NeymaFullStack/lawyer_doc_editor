import { useCallback, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Icon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Editor } from "@tiptap/core";

type DialogProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  editor: Editor | null;
};

export const EditorUploadModal = ({ open, setOpen, editor }: DialogProps) => {
  const [images, setImages] = useState<{ src: string; name: string }[]>([]);

  const handleFileChange = async (files: FileList | File[]) => {
    const fileArray: File[] = Array.from(files);
    const newImages = await Promise.all(
      fileArray.map((file) => {
        return new Promise<{ src: string; name: string }>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            if (typeof reader.result === "string") {
              resolve({ src: reader.result, name: file.name });
            }
          };
          reader.readAsDataURL(file);
        });
      })
    );
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      handleFileChange(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // Prevent default behavior to allow drop
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const addImage = useCallback(() => {
    images.forEach((image) =>
      editor?.chain().focus().setImage({ src: image.src }).run()
    );
    setOpen(false);
  }, [editor, images]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="!rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-lg text-logan-black">
            Upload Images
          </DialogTitle>
          <DialogDescription className="hidden">
            Upload images from your device or paste a URL.
          </DialogDescription>
        </DialogHeader>

        <div
          className="flex h-44 flex-col justify-center items-center rounded-lg border border-dashed border-logan-black-foreground bg-logan-primary-100"
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex gap-4">
            <Label className="text-logan-black-foreground text-center text-sm flex items-center">
              <b> Drag & Drop files here </b>&nbsp;or
            </Label>
            <label htmlFor="file-upload">
              <input
                id="file-upload"
                type="file"
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleFileChange(e.target.files)
                }
                multiple
                className="hidden"
              />
              <span className="bg-primary-gradient text-white opacity-90 hover:opacity-100 gap-3 px-3 py-2 flex items-center rounded-lg cursor-pointer text-sm">
                <Icon
                  iconName="uploadplus"
                  fill="#fff"
                  iconClassName="size-4"
                />
                Browse Files
              </span>
            </label>
          </div>
        </div>

        {images.length > 0 && (
          <div className="flex flex-col gap-2">
            {images.map((image, index) => (
              <div
                key={index}
                className="flex items-center justify-between space-x-4 px-2 py-2 rounded-[5px] bg-logan-primary-200"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={image.src}
                    alt="Preview"
                    className="h-7 w-11 rounded-lg object-cover"
                  />
                  <span className="text-sm text-logan-black-foreground truncate max-w-60">
                    {image.name}
                  </span>
                </div>
                <Icon
                  onClick={() => handleRemoveImage(index)}
                  iconName="trash"
                  fill="#383D44"
                />
              </div>
            ))}
          </div>
        )}

        <DialogFooter>
          <Button
            onClick={addImage}
            disabled={!images.length}
            className={`${
              !images.length
                ? "bg-logan-primary-200 text-logan-black-foreground"
                : "bg-primary-gradient text-white opacity-90 hover:opacity-100"
            } px-4 py-2 rounded-lg transition-colors duration-200`}
          >
            Insert
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
