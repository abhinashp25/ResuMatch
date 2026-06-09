import AppNav from './AppNav';

export default function AppLayout({ children }) {
  return (
    <div className="app-theme-light">
      <div className="blob-light blob-light-1"></div>
      <div className="blob-light blob-light-2"></div>
      <div className="blob-light blob-light-3"></div>
      
      <AppNav />
      
      <main className="app-page-wrapper">
        {children}
      </main>
    </div>
  );
}
