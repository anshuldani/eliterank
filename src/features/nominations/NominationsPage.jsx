import React from 'react';
import NomineeColumn from './components/NomineeColumn';
import { spacing } from '../../styles/theme';

export default function NominationsPage({
  nominees,
  onConvert,
  onApprove,
  onReject,
  onSimulateComplete,
  onResend,
}) {
  // Filter nominees into categories
  const activeContestants = nominees.filter((n) => n.status === 'approved');
  const pendingContestants = nominees.filter(
    (n) => n.status === 'pending' || n.status === 'profile-complete'
  );
  const pendingNominees = nominees.filter(
    (n) => n.status === 'pending-approval' || n.status === 'awaiting-profile'
  );

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: spacing.xxl,
      }}
    >
      {/* Active Contestants Column */}
      <NomineeColumn
        type="contestants"
        nominees={activeContestants}
        onConvert={onConvert}
        onApprove={onApprove}
        onReject={onReject}
        onSimulateComplete={onSimulateComplete}
        onResend={onResend}
      />

      {/* Pending Contestants Column */}
      <NomineeColumn
        type="pending"
        nominees={pendingContestants}
        onConvert={onConvert}
        onApprove={onApprove}
        onReject={onReject}
        onSimulateComplete={onSimulateComplete}
        onResend={onResend}
      />

      {/* Pending Nominees Column */}
      <NomineeColumn
        type="nominees"
        nominees={pendingNominees}
        onConvert={onConvert}
        onApprove={onApprove}
        onReject={onReject}
        onSimulateComplete={onSimulateComplete}
        onResend={onResend}
      />
    </div>
  );
}
