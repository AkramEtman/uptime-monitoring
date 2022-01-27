import { Check } from "../../checks/entities/check.entity";
import { User } from "../../users/entities/user.entity";
import { NotificationStrategy } from "../interfaces/notification.interface";

export class NotificationContext {
  private strategy: NotificationStrategy;

    constructor(strategy: NotificationStrategy) {
        this.strategy = strategy;
    }

    public setStrategy(strategy: NotificationStrategy) {
        this.strategy = strategy;
    }

    public send(user:User, check:Check): void {
        this.strategy.run( user, check );
    }
}
