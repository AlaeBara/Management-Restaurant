import { Injectable } from "@nestjs/common";
import { EventSubscriber, EntitySubscriberInterface, InsertEvent } from "typeorm";
import { Outbox } from "../entities/outbox.entity";

@Injectable()
@EventSubscriber()
export class OutboxListener implements EntitySubscriberInterface<Outbox> {
  constructor(
  ) { }

  listenTo() {
    return Outbox;
  }

  async afterInsert(event: InsertEvent<Outbox>) {
    
  }
}