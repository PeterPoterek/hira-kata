"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import kanaData from "@/data/kana.json";

type ScriptType = "hiragana" | "katakana";
type KanaRow = { kana: string; romaji: string }[];

interface SelectionProps {
  onComplete?: (selectedRows: Record<string, boolean>) => void;
}

const Selection = ({ onComplete }: SelectionProps) => {
  const [scriptType, setScriptType] = useState<ScriptType>("hiragana");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  const getRows = (type: ScriptType) => {
    const script = kanaData[0][type];
    return Object.entries(script)
      .filter(([key]) => key !== "combinations")
      .reduce(
        (acc, [key, value]) => {
          acc[key] = value;
          return acc;
        },
        {} as Record<string, KanaRow>,
      );
  };

  const rows = getRows(scriptType);

  const toggleRow = (rowKey: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [rowKey]: !prev[rowKey],
    }));
  };

  const toggleAll = (select: boolean) => {
    const newSelection = Object.keys(rows).reduce(
      (acc, key) => {
        acc[key] = select;
        return acc;
      },
      {} as Record<string, boolean>,
    );
    setSelectedRows(newSelection);
  };

  const selectedCount = Object.values(selectedRows).filter(Boolean).length;

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Kana Selection</h1>
        <p className="text-muted-foreground">
          Select which kana rows you want to practice
        </p>
      </div>

      <Tabs
        defaultValue="hiragana"
        className="w-full"
        onValueChange={value => setScriptType(value as ScriptType)}
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="hiragana">Hiragana</TabsTrigger>
          <TabsTrigger value="katakana">Katakana</TabsTrigger>
        </TabsList>

        <TabsContent value="hiragana" className="mt-4">
          <KanaRowSelection
            rows={rows}
            selectedRows={selectedRows}
            toggleRow={toggleRow}
          />
        </TabsContent>

        <TabsContent value="katakana" className="mt-4">
          <KanaRowSelection
            rows={rows}
            selectedRows={selectedRows}
            toggleRow={toggleRow}
          />
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => toggleAll(true)}>
            Select All
          </Button>
          <Button variant="outline" size="sm" onClick={() => toggleAll(false)}>
            Deselect All
          </Button>
        </div>
        <div className="text-sm text-muted-foreground">
          {selectedCount} rows selected
        </div>
      </div>

      <Button
        className="w-full"
        size="lg"
        disabled={selectedCount === 0}
        onClick={() => onComplete?.(selectedRows)}
      >
        Start Practice
      </Button>
    </div>
  );
};

interface KanaRowSelectionProps {
  rows: Record<string, KanaRow>;
  selectedRows: Record<string, boolean>;
  toggleRow: (rowKey: string) => void;
}

function KanaRowSelection({
  rows,
  selectedRows,
  toggleRow,
}: KanaRowSelectionProps) {
  return (
    <ScrollArea className="h-[400px] rounded-md border p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(rows).map(([rowKey, characters]) => (
          <Card
            key={rowKey}
            className={`cursor-pointer transition-colors ${
              selectedRows[rowKey] ? "border-primary" : ""
            }`}
            onClick={() => toggleRow(rowKey)}
          >
            <CardContent className="p-4 flex items-start gap-3">
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center mt-1 ${
                  selectedRows[rowKey]
                    ? "bg-primary text-primary-foreground"
                    : "border border-muted-foreground"
                }`}
              >
                {selectedRows[rowKey] && <Check className="w-3 h-3" />}
              </div>

              <div className="flex-1">
                <div className="font-medium capitalize mb-2">
                  {rowKey.replace("-row", "")}
                </div>
                <div className="flex flex-wrap gap-2">
                  {characters.map((char, index) => (
                    <div
                      key={index}
                      className="flex flex-col items-center justify-center w-8 h-12 bg-muted rounded-md"
                    >
                      <span className="text-lg">{char.kana}</span>
                      <span className="text-xs text-muted-foreground">
                        {char.romaji}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </ScrollArea>
  );
}

export default Selection;
