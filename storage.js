export default class Storage {
    constructor() {
        this.storage = localStorage;
        this.selectedFriends = this.storage.selectedFriends || '';
    }

    add(id) {
        this.selectedFriends += '_' + id;
        this.save();
    }

    remove(id) {
        this.selectedFriends = this.selectedFriends.replace(`_${id}`, '');
        this.save();
    }

    save() {
        this.storage.selectedFriends = this.selectedFriends;
    }

    get() {
        return this.selectedFriends.split('_');
    }
}
