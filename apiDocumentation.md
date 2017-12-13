# API Route Documentation for our REST interface

## /buttons
Returns array of objects as stored in benek020.buttons

## /click
Requires param id corresponding to the button clicked

increments how many times that button has been clicked or inserts new row for that click in the appropriate table

## /getTrans
Returns the items, their ids, and their quantity in the current transaction, creates a new transaction if one is
not in progress

## /removeItem
Requires param id corresponding to the item to be removed

Decrements the relevant item in the transaction by one, then deletes any items from the transaction that have quantity<=0
