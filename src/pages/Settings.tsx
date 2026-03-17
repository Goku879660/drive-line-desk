export default function SettingsPage() {
  return (
    <div className="p-4 space-y-4">
      <div>
        <h1 className="text-lg font-semibold text-foreground">Settings</h1>
        <p className="text-xs text-muted-foreground">Garage configuration</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {['Garage Info', 'Branding & Logo', 'Invoice Settings', 'Tax & VAT', 'Opening Hours', 'Notification Preferences', 'Document Templates', 'Payment Terms'].map(section => (
          <div key={section} className="border rounded-md bg-card p-4 hover:shadow-sm transition-fast cursor-pointer">
            <h3 className="text-sm font-medium text-foreground">{section}</h3>
            <p className="text-xs text-muted-foreground mt-1">Configure {section.toLowerCase()}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
