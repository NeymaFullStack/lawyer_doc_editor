export enum NotificationStatus {
  UNREAD = "UNREAD",
  READ = "READ",
}
export enum NotificationTypes {
  ALERT = "ALERT",
  WORKSPACE_INVITATION_RESPONDED = "WORKSPACE_INVITATION",
  WORKSPACE_INVITATION = "WORKSPACE_INVITATION",
}
export type NotificationType = {
  id: string;
  message: string;
  notification_type: NotificationTypes;
  status: NotificationStatus;
  metadata: { workspace_id: string };
  created_by: string;
  created_at: Date;
};

export enum WorkpaceInvitationAction {
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}
