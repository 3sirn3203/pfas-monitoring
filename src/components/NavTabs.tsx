import { NavLink } from "react-router-dom";

const base =
    "inline-flex items-center px-3 py-2 text-sm border-b-2 -mb-px transition-colors";
const active = "border-blue-600 text-blue-600 font-medium";
const inactive = "border-transparent text-slate-600 hover:text-slate-800";

export default function NavTabs() {
    return (
        <nav className="flex gap-4">
            <NavLink
                to="/"
                end
                className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
                대시보드
            </NavLink>

            <NavLink
                to="/analysis"
                className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
                데이터 분석
            </NavLink>

            {/* TODO: Laboratory 결과 등록*/}

            <NavLink
                to="/users"
                className={({ isActive }) => `${base} ${isActive ? active : inactive}`}
            >
                사용자 관리
            </NavLink>
        </nav>
    );
}