export default class VKApi {
    constructor(appId, perms) {
        this.appId = appId;
        this.perms = perms;
    }

    auth() {
        return new Promise((resolve, reject) => {
            VK.init({
                apiId: this.appId
            });

            VK.Auth.login(data => {
                if (data.session) {
                    resolve();
                } else {
                    reject(new Error('Не удалось авторизоваться'));
                }
            }, this.perms);
        })
    }

    callAPI(method, params) {
        params.v = '5.131';
        return new Promise((resolve, reject) => {
            VK.api(method, params, (data) => {
                if (data.error) {
                    reject(data.error);
                } else {
                    resolve(data.response);
                }
            });
        })
    }

    getFriends() {
        const params = {
            order: 'hints',
            fields: ['photo_50'],
            name_case: 'nom'
        };

        return this.callAPI('friends.get', params);
    }
}
