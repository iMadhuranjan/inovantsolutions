import Sidebar from "./components/Sidebar";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="flex min-h-screen">
        <div className="w-64 sticky top-0 h-screen">
          <Sidebar />
        </div>

         <div className="flex-1 overflow-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
