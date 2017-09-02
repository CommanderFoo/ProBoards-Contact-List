Contact List
============

http://support.proboards.com/thread/638474/simple-embeddable-contact-list

Request done for http://innovation.thecreed.online

Code is specifically aimed at the custom structure for the forum above, but can easily be tweaked to work on other forums.  See the method that handles writing out the list...

https://github.com/PopThosePringles/ProBoards-Contact-List/blob/master/src/contact_list.js#L138

Adds an Add / Remove Contact button to profiles that allow people to add the user to a their private contact list.

As there is no easy way to query if a contact is online, it relies on looking at various things on the forum (info center, profile).   

![List](https://i.imgur.com/RuqOQjx.png)

