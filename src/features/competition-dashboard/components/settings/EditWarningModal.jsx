import React, { useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { getEditWarning } from '../../../../utils/fieldEditability';
import { colors, spacing, borderRadius, typography, shadows } from '../../../../styles/theme';
import { Button } from '../../../../components/ui';

/**
 * Confirmation modal for editing fields during live competition
 *
 * @param {boolean} isOpen - Whether modal is open
 * @param {string} fieldName - Field being edited
 * @param {function} onConfirm - Callback when user confirms
 * @param {function} onCancel - Callback when user cancels
 */
export function EditWarningModal({ isOpen, fieldName, onConfirm, onCancel }) {
  const [confirmText, setConfirmText] = useState('');

  if (!isOpen) return null;

  const warningMessage = getEditWarning(fieldName);
  const canConfirm = confirmText.toLowerCase() === 'confirm';

  const handleConfirm = () => {
    if (canConfirm) {
      onConfirm();
      setConfirmText('');
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onCancel();
  };

  const overlayStyle = {
    position: 'fixed',
    inset: 0,
    background: colors.background.overlay,
    backdropFilter: 'blur(8px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 50,
    padding: spacing.xl,
  };

  const modalStyle = {
    background: '#1a1a24',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.xxl,
    width: '100%',
    maxWidth: '400px',
    overflow: 'hidden',
  };

  const closeButtonStyle = {
    position: 'absolute',
    top: spacing.md,
    right: spacing.md,
    background: 'none',
    border: 'none',
    color: colors.text.secondary,
    cursor: 'pointer',
    padding: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  };

  const contentStyle = {
    padding: spacing.xxl,
    textAlign: 'center',
    position: 'relative',
  };

  const iconContainerStyle = {
    width: '64px',
    height: '64px',
    margin: `0 auto ${spacing.lg}`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(245, 158, 11, 0.1)',
    borderRadius: '50%',
    color: colors.status.warning,
  };

  const titleStyle = {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.semibold,
    margin: `0 0 ${spacing.sm}`,
    color: colors.text.primary,
  };

  const messageStyle = {
    color: colors.text.secondary,
    fontSize: typography.fontSize.base,
    margin: `0 0 ${spacing.lg}`,
    lineHeight: typography.lineHeight.relaxed,
  };

  const inputContainerStyle = {
    textAlign: 'left',
    marginBottom: spacing.lg,
  };

  const labelStyle = {
    display: 'block',
    fontSize: typography.fontSize.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  };

  const inputStyle = {
    width: '100%',
    padding: `${spacing.sm} ${spacing.md}`,
    background: 'rgba(255, 255, 255, 0.05)',
    border: `1px solid ${colors.border.primary}`,
    borderRadius: borderRadius.md,
    fontSize: typography.fontSize.base,
    color: colors.text.primary,
    outline: 'none',
    boxSizing: 'border-box',
  };

  const actionsStyle = {
    display: 'flex',
    gap: spacing.sm,
    justifyContent: 'center',
  };

  const warningButtonStyle = {
    background: colors.status.warning,
    color: colors.background.primary,
    padding: `${spacing.sm} ${spacing.lg}`,
    borderRadius: borderRadius.md,
    border: 'none',
    fontWeight: typography.fontWeight.medium,
    cursor: canConfirm ? 'pointer' : 'not-allowed',
    opacity: canConfirm ? 1 : 0.5,
  };

  return (
    <div style={overlayStyle} onClick={handleCancel}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={contentStyle}>
          <button style={closeButtonStyle} onClick={handleCancel}>
            <X size={18} />
          </button>

          <div style={iconContainerStyle}>
            <AlertTriangle size={32} />
          </div>

          <h3 style={titleStyle}>Edit Live Competition?</h3>

          <p style={messageStyle}>{warningMessage}</p>

          <div style={inputContainerStyle}>
            <label style={labelStyle}>
              Type <strong style={{ color: colors.text.primary }}>confirm</strong> to proceed
            </label>
            <input
              type="text"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="confirm"
              style={inputStyle}
              autoFocus
            />
          </div>

          <div style={actionsStyle}>
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <button
              style={warningButtonStyle}
              onClick={handleConfirm}
              disabled={!canConfirm}
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditWarningModal;
