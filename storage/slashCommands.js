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
      name: "setnum",
      type: 1,
      description: "Set your GCash phone number",
      options: [
        { 
          name: 'number', type: 6, required: true,
          description: 'Phone number'
        },
        { 
          name: 'initials', type: 6, required: true,
          description: 'Account initials'
        },
      ]
    },
  ],
};

let slashes = [
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
          "name": 'mop',
          "description": 'Mode of payment',
          "type": 3,
          "required": true,
        },
      ]
    },
  {
      name: 'create_embed',
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
      name: 'show_embed',
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
      name: 'my_embeds',
      type: 1,
      description: 'Show all embed messages',
    },
  {
      name: "calculate",
      type: 1,
      description: "Calculate fee based on amount",
      options: [
        {
          "name": 'type',
          "description": 'Type of transaction',
          "type": 3,
          "choices": [
            {
              name: 'Robux Gamepass',
              value: 'robux'
            },
          ],
          "required": true,
        },
        { 
          name: 'amount', type: 10, required: true,
          description: 'Amount to calculate',
        },
      ]
    },
  {
      name: "calculate",
      type: 1,
      description: "Calculator",
      options: [
        {
          "name": 'input',
          "description": 'Math equation',
          "type": 3,
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
]
