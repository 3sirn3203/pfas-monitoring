import { useState } from "react";
import { APP_CONFIG } from "../config";

export default function Header() {
    // 나중에 입력 폼으로 바꿀 수 있게 상태로 보관
    const [projectName] = useState<string>(APP_CONFIG.projectName);
    const [teamName] = useState<string>(APP_CONFIG.teamName);

    return (
        <header className="sticky top-0 z-[1500] bg-white/90 backdrop-blur border-b shadow-sm">
            <div className="w-full px-4 py-4">
                <div className="flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h1 className="text-xl md:text-2xl font-semibold">{projectName}</h1>
                        <p className="text-sm text-slate-500">팀명: {teamName}</p>
                    </div>
                    <div className="text-xs text-slate-500">제안용 프로토타입 • v0.1</div>
                </div>
            </div>
        </header>
    );
}
