import SensorMap from "../components/SensorMap";
import AlertsLog from "../components/AlertsLog";
import SensorSearch from "../components/SensorSearch";

export default function Dashboard() {
    return (
        <div className="grid gap-4 md:gap-5 lg:gap-6 lg:grid-cols-5">
            {/* 왼쪽: 지도 (넓은 영역) */}
            <div className="lg:col-span-3 lg:h-[834px]">
                <SensorMap />
            </div>

            {/* 오른쪽: 알림 로그 + 센서 검색 (세로 스택) */}
            <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 lg:col-span-2 lg:h-[834px] min-h-0">
                <div className="flex-[2] min-h-0">
                    <AlertsLog />
                </div>
                <div className="flex-[3] min-h-0">
                    <SensorSearch />
                </div>
            </div>
        </div>
    );
}
