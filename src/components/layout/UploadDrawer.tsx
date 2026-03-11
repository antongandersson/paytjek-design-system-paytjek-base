import { Camera, Image, FileText } from "lucide-react";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

interface UploadOption {
  icon: React.ElementType;
  label: string;
  id: string;
}

const uploadOptions: UploadOption[] = [
  { icon: Camera, label: "Tag et foto", id: "camera" },
  { icon: Image, label: "Galleri", id: "gallery" },
  { icon: FileText, label: "Fil", id: "file" },
];

interface UploadDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onOptionSelect?: (option: string) => void;
}

export function UploadDrawer({ open, onOpenChange, onOptionSelect }: UploadDrawerProps) {
  const handleOptionClick = (optionId: string) => {
    onOptionSelect?.(optionId);
    onOpenChange(false);
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md mx-auto">
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-xl font-bold text-foreground">
            Vælg, hvordan du vil uploade filen
          </DrawerTitle>
        </DrawerHeader>
        
        <div className="px-4 pb-2">
          <div className="divide-y divide-border">
            {uploadOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option.id)}
                  className="flex items-center justify-between w-full py-4 px-2 hover:bg-muted/50 transition-colors rounded-xl"
                >
                  <span className="text-base font-medium text-foreground">
                    {option.label}
                  </span>
                  <Icon className="h-6 w-6 text-muted-foreground" />
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="p-4 pt-2">
          <DrawerClose asChild>
            <Button 
              variant="secondary" 
              className="w-full h-12 rounded-xl font-semibold"
            >
              Luk
            </Button>
          </DrawerClose>
        </div>
        
        {/* iOS-style home indicator */}
        <div className="flex justify-center pb-2">
          <div className="w-32 h-1 bg-primary rounded-full" />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
