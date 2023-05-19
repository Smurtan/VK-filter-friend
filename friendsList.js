/* global Handlebars */

export default class FriendsList {
    constructor(listNode, friendTemplate) {
        this.listNode = listNode;
        this.friendTemplate = Handlebars.compile(friendTemplate);
        this.friends = {};
    }

    renderDOM() {
        this.listNode.innerHTML = this.friendTemplate({ items: this.friends });
    }

    add(friends) {
        for (const friend in friends) {
            this.friends[friend] = friends[friend];
        }
        this.renderDOM();
    }
}
