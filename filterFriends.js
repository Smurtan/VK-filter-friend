import VKApi from "./VKapi.js";


export default class FilterFriends {
    constructor() {
        this.vkApi = new VKApi();
        this.vkApi.auth()
            .then(() => {
                return this.vkApi.callAPI('friends.get', {
                    order: 'hints',
                    fields: 'photo_50',
                    name_case: 'nom'
                })
            })
            .then(data => {
                console.log(data);
            });
    }
}
