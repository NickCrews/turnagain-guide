import * as React from "react";
import { Check, ChevronDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./button";
import { Checkbox } from "./checkbox";

interface Item {
  value: string;
  label: string;
  bgColor: string;
  textColor: string;
}

export interface MultiComboProps<I extends Item> {
  itemOptions: I[];
  selectedItems: I[];
  onSelected: (values: I[]) => void;
  descriptionCallback?: (values: I[]) => React.ReactNode;
  labelCallback: (values: I[]) => React.ReactNode;
}


export function MultiCombo<I extends Item>(
  { itemOptions: items, selectedItems, onSelected, descriptionCallback, labelCallback }: MultiComboProps<I>,
) {
  const [openCombobox, setOpenCombobox] = React.useState(false);

  const setItemSelected = (oldItems: I[], item: I, selected: boolean) => {
    const newSelectedItems = selected
      ? [...oldItems, item]
      : oldItems.filter((i) => i.value != item.value);
    onSelected(newSelectedItems);
  };

  const description = descriptionCallback ? descriptionCallback(selectedItems) : <></>

  return (
    <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
      <PopoverTrigger asChild>
        <Button
          variant='outline'
          role="combobox"
          aria-expanded={openCombobox}
          className={cn(
            "justify-between text-foreground border h-9 p-2 transition-colors",
            selectedItems.length > 0
              ? "ring-2 ring-primary"
              : ""
          )}
        >
          <div className="flex gap-1 items-center flex-1 min-w-0 overflow-hidden">
            {selectedItems.length > 0 ? (
              <div className="flex gap-1 items-center min-w-0 overflow-hidden">
                {selectedItems.slice(0, 3).map(ItemToBadge)}
                {selectedItems.length > 3 && (
                  <span className="text-xs text-muted-foreground whitespace-nowrap shrink-0">
                    +{selectedItems.length - 3}
                  </span>
                )}
              </div>
            ) : (
              labelCallback(selectedItems)
            )}
          </div>
          <ChevronDown className="w-4 h-4 opacity-50 shrink-0" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-1">
        <Command loop>
          {description}
          <CommandList>
            {items.map((item) => {
              const isSelected = selectedItems.some((i) => i.value == item.value);
              return (
                <CommandItem
                  key={item.value}
                  value={item.value}
                  onSelect={() => setItemSelected(selectedItems, item, !isSelected)}
                >
                  <Checkbox checked={isSelected} />
                  {ItemToBadge(item)}
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

const ItemToBadge = ({ label, value, bgColor, textColor }: Item) => {
  return <Badge
    key={value}
    variant="outline"
    style={{
      borderColor: `${bgColor}20`,
      backgroundColor: bgColor,
      color: textColor,
    }}
    className="whitespace-nowrap border-2"
  >
    {label}
  </Badge>
}