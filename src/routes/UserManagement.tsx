type User = {
    id: string;
    name: string;
    role: "관리자" | "연구자" | "관제요원";
};

const mockUsers: User[] = [
    { id: "u001", name: "홍길동", role: "관리자" },
    { id: "u002", name: "김PFAS", role: "연구자" },
    { id: "u003", name: "박관제", role: "관제요원" },
];

export default function UserManagement() {
    return (
        <div className="rounded-2xl border bg-white p-6">
            <h2 className="text-lg font-semibold">사용자 관리</h2>
            <table className="mt-4 w-full text-sm">
                <thead>
                    <tr className="text-left text-slate-500">
                        <th className="py-2">ID</th>
                        <th className="py-2">이름</th>
                        <th className="py-2">권한</th>
                    </tr>
                </thead>
                <tbody>
                    {mockUsers.map((u) => (
                        <tr key={u.id} className="border-t">
                            <td className="py-2">{u.id}</td>
                            <td className="py-2">{u.name}</td>
                            <td className="py-2">{u.role}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}