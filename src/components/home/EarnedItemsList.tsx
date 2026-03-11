import { useState, useEffect } from "react";
import { Sun, Plus, Receipt, Landmark, Umbrella, Timer, List } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export interface EarnedItem {
  id: string;
  icon: React.ReactNode;
  label: string;
  value: string;
}

interface WidgetOption {
  id: string;
  icon: React.ReactNode;
  label: string;
  description: string;
  defaultValue: string;
}

const availableWidgets: WidgetOption[] = [
  { 
    id: "skat", 
    icon: <Receipt className="h-5 w-5" />, 
    label: "Skat", 
    description: "Beregnet skat i år",
    defaultValue: "- 42.300 kr"
  },
  { 
    id: "atp", 
    icon: <Landmark className="h-5 w-5" />, 
    label: "ATP", 
    description: "Optjent ATP bidrag",
    defaultValue: "+ 2.840 kr"
  },
  { 
    id: "feriepenge", 
    icon: <Umbrella className="h-5 w-5" />, 
    label: "Feriepenge", 
    description: "Feriepenge til gode",
    defaultValue: "+ 8.450 kr"
  },
  { 
    id: "overarbejde", 
    icon: <Timer className="h-5 w-5" />, 
    label: "Overarbejde", 
    description: "Timer denne måned",
    defaultValue: "+ 4.5 timer"
  },
];

interface EarnedItemsListProps {
  items?: EarnedItem[] | null;
  isLoading?: boolean;
  onUploadClick?: () => void;
}

export function EarnedItemsList({ 
  items: initialItems, 
  isLoading = false,
  onUploadClick
}: EarnedItemsListProps) {
  const [items, setItems] = useState<EarnedItem[]>(initialItems || []);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  // Update items when initialItems changes
  useEffect(() => {
    if (initialItems) {
      setItems(initialItems);
    }
  }, [initialItems]);

  // Filter out widgets that are already added
  const availableToAdd = availableWidgets.filter(
    widget => !items.some(item => item.id === widget.id)
  );

  const handleAddWidget = (widget: WidgetOption) => {
    const newItem: EarnedItem = {
      id: widget.id,
      icon: widget.icon,
      label: widget.label,
      value: widget.defaultValue,
    };
    setItems([...items, newItem]);
    setIsSheetOpen(false);
  };

  // Loading state
  if (isLoading) {
    return (
      <section className="space-y-3">
        <Skeleton className="h-6 w-48" />
        <div className="space-y-2">
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
          <Skeleton className="h-16 rounded-2xl" />
        </div>
      </section>
    );
  }

  // Empty state - no payslip data yet
  if (!items || items.length === 0) {
    return (
      <section className="space-y-3">
        <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
          <List className="w-4 h-4" />
          Lønoversigt
        </h2>
        
        <Card className="border-2 border-dashed border-border/50 bg-muted/10">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-4">
              <Sun className="h-7 w-7 text-muted-foreground" />
            </div>
            <p className="font-medium text-foreground mb-1">
              Ingen optjente goder at vise
            </p>
            <p className="text-sm text-muted-foreground mb-4">
              Analyse af din lønseddel viser dine feriedage, pension og mere
            </p>
            {onUploadClick && (
              <Button variant="outline" size="sm" className="rounded-xl" onClick={onUploadClick}>
                Tjek lønseddel
              </Button>
            )}
          </CardContent>
        </Card>
      </section>
    );
  }

  return (
    <section className="space-y-3">
      <h2 className="text-sm font-bold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
        <List className="w-4 h-4" />
        Lønoversigt
      </h2>

      <div className="space-y-2">
        {items.map((item) => (
          <Card key={item.id} className="border-border/50">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-muted-foreground">{item.icon}</span>
                <span className="font-medium text-foreground">{item.label}</span>
              </div>
              <span className="text-muted-foreground">{item.value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add widget button with Sheet */}
      {availableToAdd.length > 0 && (
        <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
          <SheetTrigger asChild>
            <Card className="border-2 border-dashed border-border/50 bg-transparent cursor-pointer hover:border-primary/30 hover:bg-primary/5 transition-all">
              <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                <p className="text-sm text-muted-foreground mb-2">
                  Tilføj flere ting til dit personlige dashboard
                </p>
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center hover:border-primary/50 transition-colors">
                  <Plus className="h-5 w-5 text-muted-foreground/50" />
                </div>
              </CardContent>
            </Card>
          </SheetTrigger>
          
          <SheetContent side="bottom" className="rounded-t-3xl">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl font-bold text-foreground">
                Tilføj widget
              </SheetTitle>
            </SheetHeader>
            
            <div className="space-y-3 pb-6">
              {availableToAdd.map((widget) => (
                <button
                  key={widget.id}
                  onClick={() => handleAddWidget(widget)}
                  className="w-full flex items-center gap-4 p-4 bg-muted/50 hover:bg-muted rounded-2xl transition-colors text-left"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                    {widget.icon}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-foreground">{widget.label}</p>
                    <p className="text-sm text-muted-foreground">{widget.description}</p>
                  </div>
                  <Plus className="h-5 w-5 text-primary" />
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>
      )}
    </section>
  );
}
