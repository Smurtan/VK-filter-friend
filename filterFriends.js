import VKApi from "./VKapi.js";
import FriendsList from "./friendsList.js";


export default class FilterFriends {
    constructor() {
        this.vkApi = new VKApi();
        this.friendTemplate = document.querySelector('[data-role=friend-template]').textContent;
        this.allFriendsList = new FriendsList(
            document.querySelector('[data-role=all-friends-list]'),
            this.friendTemplate
        );
        this.selectedFriendsList = new FriendsList(
            document.querySelector('[data-role=selected-friends-list]'),
            this.friendTemplate
        );
        this.login();
    }

    async login() {
        await this.vkApi.auth();
        this.friends = await this.getFriends();
        console.log(this.friends);

        this.allFriendsList.add(this.friends.items);
    }

    async getFriends() {
        return await this.vkApi.callAPI('friends.get', {
            order: 'hints',
            fields: 'photo_50',
            name_case: 'nom'
        });
    }
}
