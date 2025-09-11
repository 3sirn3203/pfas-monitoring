import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import type { Alert } from "../types/db";
import { MOCK_ALERTS } from "../mocks/alerts";

export default function AlertsLog() {
    const [openModal, setOpenModal] = useState(false);

    // 시간 순 정렬 (최신 → 오래된 순)
    const sorted: Alert[] = useMemo(() => {
        return [...MOCK_ALERTS].sort((a, b) => Date.parse(b.ts) - Date.parse(a.ts));
    }, []);

    const badgeByState = (state: Alert["status"]) =>
        state === "open" ? "border-red-200 bg-red-50" :
            state === "ack" ? "border-amber-200 bg-amber-50" :
                "border-emerald-200 bg-emerald-50";

    const labelRule = (rule: Alert["rule"]) =>
        rule === "threshold" ? "기준치 초과" : rule === "anomaly_ml" ? "이상치" : "급변";

    const Item = ({ a }: { a: Alert }) => (
        <li key={a.id as unknown as string} className={`rounded-xl border px-3 py-2 ${badgeByState(a.status)}`}>
            <div className="flex items-center justify-between gap-2">
                <div className="flex min-w-0 items-center gap-2">
                    <span className="inline-flex shrink-0 rounded-md bg-white px-2 py-0.5 text-xs font-medium text-slate-700 border">
                        {labelRule(a.rule)}
                    </span>
                    <span className="truncate font-medium">
                        {String(a.species_id)} • 측정 {a.measured} (기준 {a.threshold})
                    </span>
                </div>
                <span className="ml-2 shrink-0 tabular-nums text-xs text-slate-500">{fmt(a.ts)}</span>
            </div>
        </li>
    );

    return (
        <div className="rounded-2xl border bg-white p-4 shadow-sm h-full flex flex-col min-h-0">
            <div className="mb-2 flex items-center justify-between">
                <h3 className="font-semibold">알림 / 이벤트 로그</h3>
                <button
                    onClick={() => setOpenModal(true)}
                    className="rounded-md border bg-white px-3 py-1 text-sm hover:bg-slate-50"
                >
                    전체 보기
                </button>
            </div>

            {/* 스크롤 가능한 리스트 (부모 높이에 맞춰 확장) */}
            <ul className="space-y-2 text-sm flex-1 overflow-y-auto pr-1 min-h-0">
                {sorted.map((a) => <Item key={a.id as unknown as string} a={a} />)}
            </ul>

            {openModal && (
                <Modal onClose={() => setOpenModal(false)} title="전체 알림 로그">
                    <ul className="space-y-2 text-sm max-h-[70vh] overflow-y-auto pr-1">
                        {sorted.map((a) => <Item key={`modal-${a.id as unknown as string}`} a={a} />)}
                    </ul>
                </Modal>
            )}
        </div>
    );
}

function fmt(ts: string) {
    try {
        const d = new Date(ts);
        return d.toLocaleString();
    } catch {
        return ts;
    }
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode; }) {
    return (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center">
            {/* 배경 어둡게 + 블러 */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px]" onClick={onClose} />
            <div className="relative z-[2001] w-[92vw] max-w-2xl rounded-xl border bg-white p-4 shadow-xl">
                <div className="mb-3 flex items-center justify-between">
                    <h4 className="text-lg font-semibold">{title}</h4>
                    <button onClick={onClose} className="rounded-md border bg-white px-2 py-1 text-sm hover:bg-slate-50">닫기</button>
                </div>
                {children}
            </div>
        </div>
    );
}
