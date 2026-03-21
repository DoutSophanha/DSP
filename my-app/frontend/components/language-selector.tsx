import { Label } from "./ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

type Props = {
  sourceLang: string;
  targetLang: string;
  onSourceChange: (value: string) => void;
  onTargetChange: (value: string) => void;
};

const options = [
  { value: "en", label: "English" },
  { value: "km", label: "Khmer" },
];

export function LanguageSelector({ sourceLang, targetLang, onSourceChange, onTargetChange }: Props) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
      <div className="space-y-2">
        <Label htmlFor="sourceLang">Source Language</Label>
        <Select value={sourceLang} onValueChange={onSourceChange}>
          <SelectTrigger id="sourceLang">
            <SelectValue placeholder="Select source language" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetLang">Target Language</Label>
        <Select value={targetLang} onValueChange={onTargetChange}>
          <SelectTrigger id="targetLang">
            <SelectValue placeholder="Select target language" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
