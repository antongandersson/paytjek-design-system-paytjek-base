import { Info, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

/**
 * Demo Credentials Banner
 * 
 * Shows demo login credentials with copy-to-clipboard functionality.
 * Useful for presentations and customer demos.
 */
export default function DemoCredentialsBanner() {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPassword, setCopiedPassword] = useState(false);

  const demoEmail = "kim@demo.dk";
  const demoPassword = "demo1234";

  const copyToClipboard = (text: string, type: "email" | "password") => {
    navigator.clipboard.writeText(text);
    
    if (type === "email") {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPassword(true);
      setTimeout(() => setCopiedPassword(false), 2000);
    }
  };

  return (
    <div className="w-full bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-2xl p-4 mb-4">
      <div className="flex items-start gap-3">
        <div className="h-8 w-8 rounded-lg bg-blue-100 dark:bg-blue-900 flex items-center justify-center flex-shrink-0">
          <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-blue-900 dark:text-blue-100 text-sm mb-2">
            Demo Login
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 font-mono flex-1">
                {demoEmail}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => copyToClipboard(demoEmail, "email")}
                title="Kopier email"
              >
                {copiedEmail ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
            <div className="flex items-center gap-2">
              <code className="text-xs bg-white dark:bg-gray-900 px-2 py-1 rounded border border-blue-200 dark:border-blue-800 font-mono flex-1">
                {demoPassword}
              </code>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 w-7 p-0"
                onClick={() => copyToClipboard(demoPassword, "password")}
                title="Kopier password"
              >
                {copiedPassword ? (
                  <span className="text-xs">✓</span>
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
