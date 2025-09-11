import { Routes, Route } from "react-router-dom";
import Header from "./components/Header";
import NavTabs from "./components/NavTabs";
import Dashboard from "./routes/Dashboard";
import DataAnalysis from "./routes/DataAnalysis";
import UserManagement from "./routes/UserManagement";

export default function App() {
    return (
        <div className="min-h-screen bg-slate-50 text-slate-800">
            {/* 상단: 프로젝트명/팀명 */}
            <Header />

            {/* 탭 내비게이션 */}
            <div className="bg-white border-b">
                <div className="w-full px-4">
                    <NavTabs />
                </div>
            </div>

            {/* 라우트 영역 */}
            <main className="w-full px-4 py-6">
                <Routes>
                    <Route path="/" element={<Dashboard />} />
                    <Route path="/analysis" element={<DataAnalysis />} />
                    <Route path="/users" element={<UserManagement />} />
                </Routes>
            </main>
        </div>
    );
}