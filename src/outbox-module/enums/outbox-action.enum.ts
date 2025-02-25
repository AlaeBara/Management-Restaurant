
export enum OutboxAction {
  RECALCULATE_STOCK_ON_ORDER_CONFIRMATION = 'recalculate_stock_on_order_confirmation',
  RECALCULATE_STOCK_ON_ORDER_DELETE = 'recalculate_stock_on_order_delete',
  PRODUCT_CREATED = 'product_created',
  MENU_ITEM_CREATED = 'menu_item_created',// should calculate quantity of menu item based on stock
  MENU_ITEM_UPDATED = 'menu_item_updated',
  INVENTORY_QUANTITY_UPDATED = 'inventory_quantity_updated',
  NEW_INVENTORY_MOVEMENT = 'new_inventory_movement',
  INVENTORY_MOVEMENT_CREATED = 'inventory_movement_created', // should update quantity of menu items related to the inventory after a movement

  //order events
  ORDER_CREATED = 'order_created',
}

export enum OutboxOrderAction {
  ORDER_VALIDATED = 'order_validated',
}
