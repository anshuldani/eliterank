import React from 'react';
import { Check } from 'lucide-react';
import { Modal, Button, Input, Textarea } from '../ui';
import { useModalForm } from '../../hooks';

const INITIAL_STATE = { name: '', title: '', bio: '' };

export default function JudgeModal({
  isOpen,
  onClose,
  judge,
  onSave,
}) {
  const { form, updateField, getFormData } = useModalForm(INITIAL_STATE, judge, isOpen);
  const isEditing = !!judge;

  const handleSave = () => {
    onSave(getFormData());
  };

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
            onClick={handleSave}
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
        onChange={(e) => updateField('name', e.target.value)}
        placeholder="e.g., Victoria Blackwell"
      />
      <Input
        label="Title / Role"
        value={form.title}
        onChange={(e) => updateField('title', e.target.value)}
        placeholder="e.g., Fashion Editor, Vogue"
      />
      <Textarea
        label="Bio (Optional)"
        value={form.bio}
        onChange={(e) => updateField('bio', e.target.value)}
        placeholder="Brief description of the judge..."
        rows={3}
      />
    </Modal>
  );
}
