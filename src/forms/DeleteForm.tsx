import { useState } from 'react';
import { ActionButton, Input, SectionCard } from '../components';
import { api } from '../lib/api';

export function DeleteForm({
    disabled,
    onStatus,
}: {
    disabled: boolean;
    onStatus: (s: string) => void;
}) {
    const [deleteId, setDeleteId] = useState('');

    async function onDelete(e: React.FormEvent) {
        e.preventDefault();
        onStatus('');
        try {
            const id = deleteId.trim();
            if (!id) throw new Error('ID is empty');
            setDeleteId('');
            const data = await api.deleteCustomer(id);
            onStatus(
                data.deleted
                    ? `🗑️ Deleted: ${id}`
                    : `ℹ️ Not found in the table: ${id}`
            );
        } catch (err: any) {
            onStatus(`❌ ${err.message}`);
        }
    }

    return (
        <SectionCard title="Delete ID" hint="Deletes the record if it exists">
            <form onSubmit={onDelete} className="space-y-3">
                <div>
                    <label htmlFor="deleteId" className="sr-only">
                        Customer ID
                    </label>
                    <Input
                        id="deleteId"
                        value={deleteId}
                        onChange={setDeleteId}
                        placeholder="Enter ID (e.g., abc123)"
                        disabled={disabled}
                    />
                </div>
                <ActionButton disabled={disabled} kind="danger">
                    Delete
                </ActionButton>
            </form>
        </SectionCard>
    );
}
