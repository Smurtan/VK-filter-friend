/* global Handlebars */

export default class FriendsList {
    constructor(myListNode, searchNode, friendTemplate, onMove, onDragStart, onDrop) {
        this.myListNode = myListNode;
        this.searchNode = searchNode;
        this.friendTemplate = Handlebars.compile(friendTemplate);
        this.onMove = onMove;
        this.onDragStart = onDragStart;
        this.onDrop = onDrop;
        this.friends = {};
        this.defineDnD();
        this.defineSearch()
    }

    renderDOM() {
        this.myListNode.innerHTML = this.friendTemplate({ items: this.friends });
        this.defineDnD();

        const moveBtnNode = this.myListNode.querySelectorAll('[data-role=move-friend]');
        for (const btn of moveBtnNode) {
            btn.addEventListener('click', (e) => {
                const moveFriendId = this.getCurrentFriendId(e.target);
                if (moveFriendId) {
                    this.onMove(this.friends[moveFriendId], this);
                    this.remove(moveFriendId);
                }
            })
        }
        this.searchFriends();
    }

    add(friends) {
        if (Array.isArray(friends)) {
            for (const friend of friends) {
                this.friends[friend.id] = friend;
            }
        } else {
            this.friends[friends.id] = friends;
        }
        this.renderDOM();
    }

    remove(id) {
        delete this.friends[id];
        const friendNode = this.myListNode.querySelector(`[data-friendid='${id}']`);
        this.myListNode.removeChild(friendNode);
    }

    getCurrentFriendId(from) {
        do {
            if (from.dataset.friendid) {
                return from.dataset.friendid;
            }
        } while (from = from.parentElement)

        return null;
    }

    defineDnD() {
        this.myListNode.addEventListener('dragstart', (e) => {
            const friendId = this.getCurrentFriendId(e.target);

            if (friendId) {
                this.onDragStart(this.friends[friendId], this);
            }
        })

        this.myListNode.addEventListener('dragover', (e) => {
            e.preventDefault()
        })

        this.myListNode.addEventListener('drop', () => {
            this.onDrop(this);
        })
    }

    searchFriends() {
        const searchString = this.searchNode.value.toLowerCase();
        for (const friend in this.friends) {
            if (this.friends[friend].last_name.toLowerCase().startsWith(searchString) ||
                this.friends[friend].first_name.toLowerCase().startsWith(searchString) ||
                `${this.friends[friend].first_name} ${this.friends[friend].last_name}`.toLowerCase().startsWith(searchString) ||
                `${this.friends[friend].last_name} ${this.friends[friend].first_name}`.toLowerCase().startsWith(searchString)
            ) {
                this.myListNode.querySelector(`[data-friendid='${friend}']`).classList.remove('hidden');
            } else {
                this.myListNode.querySelector(`[data-friendid='${friend}']`).classList.add('hidden');
            }
        }
    }

    defineSearch() {
        this.searchNode.addEventListener('input', this.searchFriends.bind(this))
    }
}
