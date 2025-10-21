import { Link, NavLink, Outlet } from "react-router-dom";
import { BookOpen } from "lucide-react";
import { Toast } from "../components/Toast.js";
import { useToast } from "../components/ToastContext.js";

export function Layout() {
  const toast = useToast();
  const navCls = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
      isActive
        ? "bg-neutral-800 text-white shadow-md"
        : "text-neutral-900 hover:text-neutral-700"
    }`;

  return (
    <div className="min-h-screen bg-white font-sans text-neutral-900">
      <Toast
        message={toast.message}
        visible={toast.visible}
        type={toast.type}
      />

      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/80 backdrop-blur-sm">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 p-4">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-2xl md:text-3xl ml-1">
              Ellie
            </span>
          </Link>

          <nav className="hidden items-center gap-2 md:flex">
            <NavLink to="/" end className={navCls}>
              Dashboard
            </NavLink>
            <NavLink to="/books" className={navCls}>
              Libros
            </NavLink>
            <NavLink to="/members" className={navCls}>
              Socios
            </NavLink>
            <NavLink to="/loans" className={navCls}>
              Préstamos
            </NavLink>
          </nav>

          <div className="flex items-center gap-2">
            <a
              className="btn btn-ghost text-base font-bold px-6 py-2 rounded-full sm:inline-flex"
              href="#"
              target="_blank"
              style={{
                border: "none",
                boxShadow: "none",
                background: "transparent",
              }}
            >
              Docs
            </a>
            <Link
              to="/loans"
              className="btn btn-primary text-base px-6 py-2 font-bold ml-[-8px]"
            >
              Nuevo préstamo
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-6">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="mt-10 border-t border-neutral-200 py-10">
        <div className="mx-auto max-w-6xl flex flex-col items-center text-center px-6">
          {/* Logo y frase */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-8">
            <img
              src="/assets/logo.png"
              alt="Logo Ellie"
              className="h-40 w-40 object-contain"
            />
            <span className="text-lg font-medium text-neutral-600 italic max-w-md">
              “Un libro es un sueño que tienes en tus manos.”
            </span>
          </div>

          <hr className="w-full border-t border-neutral-300 my-6" />

          {/* Info inferior consistente */}
          <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-4 sm:gap-8 text-sm text-neutral-500">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-neutral-700">Contacto:</span>
              <span>info@ellielibrary.com</span>
            </div>
            <span>+54 11 1234-5678</span>
            <span className="text-neutral-400">
              © {new Date().getFullYear()} Ellie Library
            </span>
            <a href="#" className="hover:text-neutral-900">
              Privacidad
            </a>
            <a href="#" className="hover:text-neutral-900">
              Términos
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
