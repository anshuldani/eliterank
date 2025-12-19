import React from 'react';
import { Check } from 'lucide-react';
import { Modal, Button, Input, Textarea } from '../ui';

export default function JudgeModal({
  isOpen,
  onClose,
  judge,
  form,
  onFormChange,
  onSave,
}) {
  const isEditing = !!judge;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Judge' : 'Add Judge'}
      maxWidth="450px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} style={{ width: 'auto' }}>
            Cancel
          </Button>
          <Button
            onClick={onSave}
            icon={Check}
            disabled={!form.name || !form.title}
          >
            {isEditing ? 'Save Changes' : 'Add Judge'}
          </Button>
        </>
      }
    >
      <Input
        label="Full Name"
        value={form.name}
        onChange={(e) => onFormChange({ ...form, name: e.target.value })}
        placeholder="e.g., Victoria Blackwell"
      />
      <Input
        label="Title / Role"
        value={form.title}
        onChange={(e) => onFormChange({ ...form, title: e.target.value })}
        placeholder="e.g., Fashion Editor, Vogue"
      />
      <Textarea
        label="Bio (Optional)"
        value={form.bio}
        onChange={(e) => onFormChange({ ...form, bio: e.target.value })}
        placeholder="Brief description of the judge..."
        rows={3}
      />
    </Modal>
  );
}
