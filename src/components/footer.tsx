import { useLocation, useNavigate } from "react-router-dom";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <footer className="border-t border-[#D38EEC] bg-[#E7C3F6] dark:bg-[#9D43AD] mt-12">
      <div className="max-w-7xl mx-auto px-6 md:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          <div>
            <h3 className="font-semibold mb-2">Purple Bytes: Task Manager</h3>
            <p className="text-sm text-muted-foreground">
                &copy; {currentYear} Purple Bytes. All rights reserved.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><button onClick={() => navigate("/")} className={`cursor-pointer ${location.pathname === "/" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground transition-colors"}`}>Dashboard</button></li>
              <li><button onClick={() => navigate("/tasks")} className={`cursor-pointer ${location.pathname === "/tasks" ? "text-foreground font-semibold" : "text-muted-foreground hover:text-foreground transition-colors"}`}>Tasks</button></li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <p className="text-sm text-muted-foreground">
              Email: purplebytes@gmail.com<br />
              Phone: 0912-981-9721 / 0930-175-2455
            </p>
          </div>
        </div>

      </div>
    </footer>
  );
}
