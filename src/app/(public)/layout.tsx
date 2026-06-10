import { PublicHeader } from "@/components/layout/public-header";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PublicHeader />
      {children}
      <footer className="border-t py-8">
        <div className="container text-sm text-muted-foreground">© {new Date().getFullYear()} Sudheer Kumar</div>
      </footer>
    </>
  );
}
