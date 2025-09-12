import LabRegister from "../components/LabRegister";
import LabSearch from "../components/LabSearch";

export default function Laboratory() {
    return (
        <div className="grid grid-cols-2 gap-6 h-full">
            <div className="col-span-1">
                <LabRegister />
            </div>

            <div className="col-span-1">
                <LabSearch />
            </div>
        </div>
    );
}
