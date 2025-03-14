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
    <div className="max-w-[200px]">
      <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
        <PopoverTrigger asChild>
          <Button
            variant='outline'
            role="combobox"
            aria-expanded={openCombobox}
            className="justify-between text-foreground border"
          >
            <span className="flex truncate">
              {labelCallback(selectedItems)}
              <ChevronDown className="ml-4 w-4 opacity-50" />
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent>
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
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        isSelected ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {ItemToBadge(item)}
                  </CommandItem>
                );
              })}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
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
    className="whitespace-nowrap"
  >
    {label}
</Badge>
}