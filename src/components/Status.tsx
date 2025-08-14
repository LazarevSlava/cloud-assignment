export function Status({ msg }: { msg: string | null }) {
    if (!msg) return null;
    const isError = msg.startsWith('❌');
    const isSuccess =
        msg.startsWith('✅') || msg.startsWith('🟢') || msg.startsWith('🗑️');
    const tone = isError
        ? 'bg-rose-50 border-rose-300 text-rose-800'
        : isSuccess
        ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
        : 'bg-yellow-50 border-yellow-300 text-yellow-900';
    return (
        <div className={`mt-6 border ${tone} rounded-xl px-4 py-3 text-sm`}>
            {msg}
        </div>
    );
}
