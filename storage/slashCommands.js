/*
SUB_COMMAND - 1
SUB_COMMAND_GROUP - 2
STRING - 3
INTEGER - 4
BOOLEAN - 5
USER - 6
CHANNEL - 7
ROLE - 8
MENTIONABLE - 9
NUMBER - 10
ATTACHMENT - 11
*/
module.exports = {
  register: false,
  deleteSlashes: [],
  slashes: [
    {
      name: 'embed',
      type: 1,
      description: 'Create an embed message',
      options: [
        { name: 'id', type: 3, description: 'ID of the embed', required: true },
        { name: 'description', type: 3, description: 'Description of the embed', required: true },
        { name: 'title', type: 3, description: 'Title of the embed', required: false },
        { name: 'color', type: 3, description: 'Color of the embed in HEX', required: false },
        { name: 'thumbnail', type: 3, description: 'Thumbnail URL', required: false },
        { name: 'image', type: 3, description: 'Image URL', required: false },
        { name: 'footer', type: 3, description: 'Footer text', required: false }
      ]
    },
    {
      name: 'display_embed',
      type: 1,
      description: 'Display an embed message',
      options: [
        { name: 'id', type: 3, description: 'ID of the embed', required: true },
      ]
    },
    {
      name: 'delete_embed',
      type: 1,
      description: 'Delete an embed message',
      options: [
        { name: 'id', type: 3, description: 'ID of the embed', required: true },
      ]
    },
    {
      name: 'show_embeds',
      type: 1,
      description: 'Show all embed messages',
    },
    {
      "name": "order",
      "type": 1,
      "description": "Sends an order queue",
      "options": [
        {
          "name": 'user',
          "description": 'Recipient',
          "type": 6,
          "required": true,
        },
        {
          "name": 'product',
          "description": 'Product name',
          "type": 3,
          "required": true,
        },
        {
          "name": 'quantity',
          "description": 'Amount ordered',
          "type": 3,
          "required": true,
        },
        {
          "name": 'mop',
          "description": 'Mode of Payment',
          "type": 3,
          "choices": [
            {
              name: 'GCash',
              value: 'gcash'
            },
            {
              name: 'Robux',
              value: 'robux'
            },
            {
              name: 'Paypal',
              value: 'paypal'
            },
          ],
          "required": true,
        },
        {
          "name": 'price',
          "description": 'Price paid',
          "type": 4,
          "required": true,
        },
      ]
    },
    /*{
      name: "drop",
      type: 1,
      description: "Drops an item to a user",
      options: [
        { 
          name: 'user', type: 6, required: true,
          description: 'Recipient'
        },
        {
          "name": 'item',
          "description": 'Item name',
          "type": 3,
          "choices": [
            {
              name: 'nitro boost',
              value: 'nitro boost'
            },
            {
              name: 'nitro basic',
              value: 'nitro basic'
            },
          ],
          "required": true,
        },
        { 
          name: 'quantity', type: 10, required: true,
          description: 'Amount to send',
        },
      ]
    },
    {
      "name": "queue",
      "type": 1,
      "description": "Sends an order queue",
      "options": [
        {
          "name": 'user',
          "description": 'Recipient',
          "type": 6,
          "required": true,
        },
        {
          "name": 'item',
          "description": 'Item Name',
          "type": 3,
          "required": true,
        },
        {
          "name": 'quantity',
          "description": 'Amount to send',
          "type": 10,
          "required": true,
        },
        {
          "name": 'base_price',
          "description": 'Base price of the item',
          "type": 4,
          "required": true,
        },
        {
          "name": 'ticket',
          "description": 'Ticket channel',
          "type": 7,
          "required": true,
        },
      ]
    },
    {
      "name": "report",
      "type": 1,
      "description": "Sends a report queue",
      "options": [
        {
          "name": 'user',
          "description": 'Recipient',
          "type": 6,
          "required": true,
        },
        {
          "name": 'item',
          "description": 'Item Name',
          "type": 3,
          "required": true,
        },
        {
          "name": 'quantity',
          "description": 'Amount to send',
          "type": 10,
          "required": true,
        },
        {
          "name": 'price_paid',
          "description": 'Price paid of the item',
          "type": 4,
          "required": true,
        },
        {
          "name": 'ticket',
          "description": 'Ticket channel',
          "type": 7,
          "required": true,
        },
      ]
    },
    {
      name: "stocks",
      type: 1,
      description: "Shows a list of available stocks",
    }*/
  ],
};
