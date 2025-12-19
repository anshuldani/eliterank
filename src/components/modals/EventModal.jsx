import React from 'react';
import { Check } from 'lucide-react';
import { Modal, Button, Input, Select, FormGrid } from '../ui';

export default function EventModal({
  isOpen,
  onClose,
  event,
  form,
  onFormChange,
  onSave,
}) {
  const statusOptions = [
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'active', label: 'Active / Live' },
    { value: 'completed', label: 'Completed' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Event"
      maxWidth="500px"
      footer={
        <>
          <Button variant="secondary" onClick={onClose} style={{ width: 'auto' }}>
            Cancel
          </Button>
          <Button onClick={onSave} icon={Check}>
            Save Changes
          </Button>
        </>
      }
    >
      <Input
        label="Event Name"
        value={form.name}
        onChange={(e) => onFormChange({ ...form, name: e.target.value })}
        placeholder="e.g., Voting Round 1"
      />
      <FormGrid>
        <Input
          label="Start Date"
          type="date"
          value={form.date}
          onChange={(e) => onFormChange({ ...form, date: e.target.value })}
        />
        <Input
          label="End Date (Optional)"
          type="date"
          value={form.endDate}
          onChange={(e) => onFormChange({ ...form, endDate: e.target.value })}
        />
      </FormGrid>
      <FormGrid>
        <Input
          label="Time (Optional)"
          type="time"
          value={form.time}
          onChange={(e) => onFormChange({ ...form, time: e.target.value })}
        />
        <Select
          label="Status"
          value={form.status}
          onChange={(e) => onFormChange({ ...form, status: e.target.value })}
          options={statusOptions}
        />
      </FormGrid>
      <Input
        label="Location (Optional)"
        value={form.location}
        onChange={(e) => onFormChange({ ...form, location: e.target.value })}
        placeholder="e.g., The Plaza Hotel"
      />
    </Modal>
  );
}
