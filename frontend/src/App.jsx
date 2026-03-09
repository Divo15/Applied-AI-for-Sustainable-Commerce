import {
  BrowserRouter as Router,
  Routes,
  Route,
  NavLink,
} from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CategoryGenerator from "./pages/CategoryGenerator";
import ProposalGenerator from "./pages/ProposalGenerator";
import AILogs from "./pages/AILogs";

/* ------------------------------------------------------------------ */
/*  Navbar                                                            */
/* ------------------------------------------------------------------ */
function Navbar() {
  const linkClass = ({ isActive }) =>
    `px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-primary-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-primary-50 hover:text-primary-700"
    }`;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🌿</span>
            <span className="font-bold text-xl text-primary-700">
              Rayeva AI
            </span>
          </div>
          <div className="flex items-center gap-2">
            <NavLink to="/" className={linkClass} end>
              Dashboard
            </NavLink>
            <NavLink to="/category" className={linkClass}>
              Module 1
            </NavLink>
            <NavLink to="/proposal" className={linkClass}>
              Module 2
            </NavLink>
            <NavLink to="/logs" className={linkClass}>
              AI Logs
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
}

/* ------------------------------------------------------------------ */
/*  App                                                               */
/* ------------------------------------------------------------------ */
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/category" element={<CategoryGenerator />} />
            <Route path="/proposal" element={<ProposalGenerator />} />
            <Route path="/logs" element={<AILogs />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}
