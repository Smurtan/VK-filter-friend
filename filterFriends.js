import VKApi from "./VKapi.js";
import FriendsList from "./friendsList.js";
import Storage from "./storage.js";


export default class FilterFriends {
    constructor() {
        document.querySelector('[data-role=window-close]')
            .addEventListener('click', () => {
                window.close();
            })
        this.vkApi = new VKApi(51650068, 2);
        this.friendTemplate = document.querySelector('[data-role=friend-template]').textContent;
        this.allFriendsList = new FriendsList(
            document.querySelector('[data-role=all-friends-list]'),
            document.querySelector('[data-role=all-input]'),
            this.friendTemplate,
            this.onMove.bind(this),
            this.onDragStart.bind(this),
            this.onDrop.bind(this)
        );
        this.selectedFriendsList = new FriendsList(
            document.querySelector('[data-role=selected-friends-list]'),
            document.querySelector('[data-role=selected-input]'),
            this.friendTemplate,
            this.onMove.bind(this),
            this.onDragStart.bind(this),
            this.onDrop.bind(this)
        );
        this.storage = new Storage();
        this.login();
    }

    async login() {
        await this.vkApi.auth();
        this.initiateFriends();
    }

    async initiateFriends() {
        this.friends = await this.vkApi.getFriends();
        this.selectedFriends = this.storage.get();

        if (this.selectedFriends.length) {
            for (const friend of this.friends.items) {
                if (this.selectedFriends.indexOf(friend.id.toString()) !== -1) {
                    this.selectedFriendsList.add(friend);
                } else {
                    this.allFriendsList.add(friend);
                }
            }
        } else {
            this.allFriendsList.add(this.friends.items);
        }
    }

    onMove(friend, from) {
        if (from === this.allFriendsList) {
            this.selectedFriendsList.add(friend);
            this.storage.add(friend.id);
        } else {
            this.allFriendsList.add(friend);
            this.storage.remove(friend.id);
        }
    }

    onDragStart(friend, from) {
        this.currentDrag = friend;
        this.fromDragNode = from;
    }

    onDrop(from) {
        if (from !== this.fromDragNode && this.currentDrag) {
            if (from === this.selectedFriendsList) {
                this.storage.add(this.currentDrag.id);
            } else {
                this.storage.remove(this.currentDrag.id);
            }
            this.fromDragNode.remove(this.currentDrag.id);
            from.add(this.currentDrag);
            this.currentDrag = null;
        }
    }
}
