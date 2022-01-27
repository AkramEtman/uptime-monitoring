import { Check } from "../../checks/entities/check.entity";
import { User } from "../../users/entities/user.entity";

export interface NotificationStrategy {
    run(user: User,check:Check):void;
}