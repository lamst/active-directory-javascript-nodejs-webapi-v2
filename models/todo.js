
"use strict";

class Todo {
    constructor(title, owner) {
        this.Title = title;
        this.Owner = owner;
    }
}

module.exports = Todo;

/**
 * @swagger
 *  components:
 *    schemas:
 *      Todo:
 *        type: object
 *        required:
 *          - Title
 *          - Owner
 *        properties:
 *          Title:
 *            type: string
 *            description: The title of the TODO item
 *          Owner:
 *            type: string
 *            description: The owner of the item.
 *        example:
 *           Title: Buy Grocery
 *           Owner: fake@email.com
 */