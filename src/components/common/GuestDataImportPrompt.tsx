import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Button } from './Button';
import { CloudUpload, Sparkles } from 'lucide-react';

export const GuestDataImportPrompt: React.FC = () => {
  const { hasGuestDataToImport, importGuestData, dismissGuestImport, user } = useAuth();
  const [importing, setImporting] = useState(false);
  const [importedNotice, setImportedNotice] = useState<string | null>(null);

  if (!hasGuestDataToImport || !user) return null;

  const handleImport = async () => {
    setImporting(true);
    const { success, count } = await importGuestData();
    setImporting(false);

    if (success) {
      setImportedNotice(`Successfully imported ${count} guest deliveries to Supabase!`);
      setTimeout(() => {
        setImportedNotice(null);
      }, 4000);
    }
  };

  return (
    <div className="bg-[#FBEBC6] dark:bg-[#252014] border-b border-[#E0A11B]/40 px-4 py-3 text-[#1F2A27] dark:text-[#FAF6EF] shadow-warm-sm relative z-30">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F2B84B] text-[#1F2A27] flex items-center justify-center shrink-0 shadow-warm-sm">
            <CloudUpload className="w-4 h-4 stroke-[2]" />
          </div>
          <div>
            <div className="font-display font-bold text-xs uppercase tracking-wider text-[#1F2A27] dark:text-[#FAF6EF]">
              Guest Manifest Found
            </div>
            <div className="font-body text-xs text-[#55625D] dark:text-[#95A39D]">
              {importedNotice ||
                'Import your local offline stops and wishlist items into your cloud account now?'}
            </div>
          </div>
        </div>

        {!importedNotice && (
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              variant="primary"
              size="sm"
              disabled={importing}
              onClick={handleImport}
              icon={<Sparkles className="w-3.5 h-3.5 text-[#1F2A27]" />}
            >
              {importing ? 'Importing...' : 'Import to Cloud'}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={importing}
              onClick={dismissGuestImport}
            >
              Dismiss
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
