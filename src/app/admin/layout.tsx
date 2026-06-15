export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-brand-100">
      {children}
    </div>
  );
}
