import React from "react";
import {
  Drawer,
  DrawerContent,
  DrawerOverlay,
  DrawerHeader,
  DrawerFooter,
  DrawerClose,
} from "../shadcn-components/ui/drawer";
import { Button } from "../shadcn-components/ui/button";

export interface LoganDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  setIsOpen: () => void;

  header?: React.ReactNode;
  body?: React.ReactNode;
  showFooter?: boolean;
}

const LoganDrawer: React.FC<LoganDrawerProps> = ({
  isOpen,
  onClose,
  header,
  body,
  showFooter = true,
  setIsOpen,
}) => {
  return (
    <Drawer
      dismissible={false}
      open={isOpen}
      onOpenChange={setIsOpen}
      direction="right"
    >
      <DrawerContent
        aria-placeholder=""
        className="drw-content ml-auto h-full w-[45vw] rounded-none border-none bg-collapse  focus-visible:!outline-0"
      >
        <DrawerHeader className=" shadow-out-b  border-b-[1px] border-b-secondary-blue p-4 px-6">
          {header}
        </DrawerHeader>
        <div className="p-8">{body}</div>

        {showFooter && (
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button onClick={onClose} variant="outline">
                Cancel
              </Button>
            </DrawerClose>
          </DrawerFooter>
        )}
      </DrawerContent>
    </Drawer>
  );
};

export default LoganDrawer;
