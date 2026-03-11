import { useState, useRef } from "react";
import { Link2, Loader2, Calendar, ExternalLink, Upload, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CalendarSyncSetupProps {
  onConnect: (source: string, icsUrlOrFile?: string | File) => void;
  isConnecting?: boolean;
}

export function CalendarSyncSetup({ onConnect, isConnecting = false }: CalendarSyncSetupProps) {
  const [icsUrl, setIcsUrl] = useState("");
  const [icsFile, setIcsFile] = useState<File | null>(null);
  const [icsError, setIcsError] = useState<string | null>(null);
  const [inputMode, setInputMode] = useState<"url" | "file">("url");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.name.endsWith('.ics') && !file.name.endsWith('.ical')) {
        setIcsError("Vælg venligst en .ics eller .ical fil");
        return;
      }
      setIcsFile(file);
      setIcsUrl("");
      setIcsError(null);
    }
  };

  const handleRemoveFile = () => {
    setIcsFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const validateIcsUrl = (url: string): boolean => {
    if (!url.trim()) {
      setIcsError("Indtast venligst et ICS link");
      return false;
    }
    try {
      new URL(url);
    } catch {
      setIcsError("Ugyldigt URL format");
      return false;
    }
    setIcsError(null);
    return true;
  };

  const handleConnect = () => {
    if (inputMode === "file" && icsFile) {
      onConnect("ics-file", icsFile);
    } else if (inputMode === "url" && icsUrl) {
      if (!validateIcsUrl(icsUrl)) return;
      onConnect("ics", icsUrl);
    } else {
      setIcsError(inputMode === "file" ? "Vælg venligst en fil" : "Indtast venligst et link");
    }
  };

  const canConnect =
    (inputMode === "file" && icsFile) ||
    (inputMode === "url" && icsUrl.trim());

  return (
    <div className="flex flex-col items-center justify-center px-6 pt-12 pb-10 text-center">
      {/* Icon */}
      <div className="w-20 h-20 rounded-3xl bg-primary/10 flex items-center justify-center mb-6">
        <Calendar className="w-10 h-10 text-primary" />
      </div>

      <h2 className="text-2xl font-bold text-foreground mb-2">
        Synkroniser din vagtplan
      </h2>
      <p className="text-muted-foreground text-sm mb-8 max-w-xs leading-relaxed">
        Forbind din arbejdskalender via et ICS-link eller fil, så vi kan sammenligne vagter med dine lønsedler.
      </p>

      {/* Toggle between URL and File */}
      <div className="w-full max-w-xs mb-5">
        <div className="flex bg-muted rounded-xl p-1">
          <button
            type="button"
            className={cn(
              "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              inputMode === "url"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setInputMode("url")}
          >
            <Link2 className="w-4 h-4" />
            Indsæt link
          </button>
          <button
            type="button"
            className={cn(
              "flex-1 py-2.5 px-4 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2",
              inputMode === "file"
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
            onClick={() => setInputMode("file")}
          >
            <Upload className="w-4 h-4" />
            Upload fil
          </button>
        </div>
      </div>

      {/* URL Input */}
      {inputMode === "url" && (
        <div className="w-full max-w-xs space-y-4 text-left animate-fade-in">
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              ICS Kalender Link
            </label>
            <div className="relative">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <input
                type="url"
                value={icsUrl}
                onChange={(e) => {
                  setIcsUrl(e.target.value);
                  setIcsFile(null);
                  setIcsError(null);
                }}
                placeholder="https://example.com/calendar.ics"
                className={cn(
                  "w-full h-14 pl-12 pr-4 rounded-2xl border-2 bg-background text-foreground placeholder:text-muted-foreground focus:outline-none transition-colors",
                  icsError
                    ? "border-destructive focus:border-destructive"
                    : "border-border focus:border-primary"
                )}
              />
            </div>
          </div>

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Hvor finder jeg mit ICS link?
            </p>
            <ul className="text-xs text-muted-foreground space-y-1.5">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Planday:</strong> Indstillinger → Kalender eksport → Kopier link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Quinyx:</strong> Min profil → Kalender sync → ICS URL</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Tamigo:</strong> Kalender → Del → Abonner link</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span><strong>Google Kalender:</strong> Indstillinger → Importér og eksportér → Hemmelig adresse i iCal-format</span>
              </li>
            </ul>
            <a
              href="#"
              className="inline-flex items-center gap-1 text-xs text-primary font-medium hover:underline mt-2"
            >
              Se fuld guide
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      )}

      {/* File Upload */}
      {inputMode === "file" && (
        <div className="w-full max-w-xs space-y-4 text-left animate-fade-in">
          <input
            ref={fileInputRef}
            type="file"
            accept=".ics,.ical"
            onChange={handleFileSelect}
            className="hidden"
          />

          {icsFile ? (
            <div className="flex items-center gap-3 p-4 bg-primary/5 border border-primary/20 rounded-2xl">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-foreground truncate">{icsFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  {(icsFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemoveFile}
                className="text-muted-foreground hover:text-destructive"
              >
                Fjern
              </Button>
            </div>
          ) : (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                "border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all",
                "hover:border-primary/50 hover:bg-primary/5",
                icsError ? "border-destructive" : "border-border"
              )}
            >
              <div className="w-14 h-14 rounded-full bg-muted flex items-center justify-center mb-3">
                <Upload className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="font-medium text-foreground mb-1">
                Klik for at vælge fil
              </p>
              <p className="text-sm text-muted-foreground">
                .ics eller .ical filer understøttes
              </p>
            </div>
          )}

          <div className="bg-muted/50 rounded-xl p-4 space-y-2">
            <p className="text-sm font-medium text-foreground">
              Sådan eksporterer du din vagtplan:
            </p>
            <ol className="text-xs text-muted-foreground space-y-1.5 list-decimal list-inside">
              <li>Åbn dit vagtplansystem (Planday, Quinyx, Tamigo, etc.)</li>
              <li>Find "Kalender eksport" eller "ICS eksport" under indstillinger</li>
              <li>Download .ics filen</li>
              <li>Upload filen her</li>
            </ol>
          </div>
        </div>
      )}

      {/* Error */}
      {icsError && (
        <p className="text-sm text-destructive mt-3">{icsError}</p>
      )}

      {/* Info text */}
      <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-6 max-w-xs">
        <span className="inline-flex w-4 h-4 rounded-full bg-muted items-center justify-center text-[10px] shrink-0">
          i
        </span>
        Din vagtplan bliver sikkert synkroniseret og bruges kun til verificeringsformål.
      </p>

      {/* Connect Button */}
      <Button
        onClick={handleConnect}
        disabled={!canConnect || isConnecting}
        size="lg"
        className="w-full max-w-xs h-14 text-base font-bold rounded-2xl mt-5"
      >
        {isConnecting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
            {inputMode === "file" ? "Læser fil..." : "Henter kalender..."}
          </>
        ) : inputMode === "file" ? (
          "Upload kalender"
        ) : (
          "Tilføj kalender"
        )}
      </Button>
    </div>
  );
}
