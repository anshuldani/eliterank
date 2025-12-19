import React from 'react';
import ProfileView from './components/ProfileView';
import ProfileEdit from './components/ProfileEdit';

export default function ProfilePage({
  hostProfile,
  isEditing,
  onEdit,
  onSave,
  onCancel,
  onChange,
}) {
  if (isEditing) {
    return (
      <ProfileEdit
        hostProfile={hostProfile}
        onSave={onSave}
        onCancel={onCancel}
        onChange={onChange}
      />
    );
  }

  return <ProfileView hostProfile={hostProfile} onEdit={onEdit} />;
}
