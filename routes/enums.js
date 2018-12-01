var ActionStatus = Object.freeze({
  pending: 'pending',
  assigned: 'assigned',
  completed_approved: 'completed/approved',
  rejected: 'rejected',
  revoked: 'revoked'
});

var ProcessStatus = Object.freeze({
  started: 'started',
  completed_or_approved: 'completed/approved',
  rejected: 'rejected',
  revoked: 'revoked'
});

var FieldVisibility = Object.freeze({
  hidden: 'hidden',
  readonly: 'readonly',
  editable: 'editable',
  required: 'required'
});
var MemoMode = Object.freeze({
  active: 'active',
  inactive: 'inactive',
  mine: 'mine'
});

module.exports = { ActionStatus, FieldVisibility, ProcessStatus, MemoMode };
