import { EmailService } from "../services/email.service";

export const NotificationStrategy = {
    "email": EmailService,
}

export enum NotificationType {
    EMAIL = "email",
}