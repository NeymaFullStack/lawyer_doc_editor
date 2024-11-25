import { BlinkBlur, Commet } from "react-loading-indicators";
import { iconColors } from "../../../tailwind.config";
import { cn } from "@/lib/utils";

type LoadingScreenProps = {
  className?: string;
};

export default function LoadingScreen({ className = "" }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        "w-full h-full flex items-center justify-center p-auto",
        className
      )}
    >
      <Commet color={iconColors.from} size="medium" />
    </div>
  );
}
