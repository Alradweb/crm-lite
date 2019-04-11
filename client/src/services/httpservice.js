import store from '../redux/store'

export default class HttpService {

    _checkToken = () => {
        let fail = false;
        const lifetime = localStorage.getItem('token-lifetime');
        const hasExpired = Date.now() >= lifetime;
        const {auth: {token}} = store.getState();
        if (!lifetime || hasExpired || !token) fail = true;
        if (fail) {
            setTimeout(() => {
                store.dispatch({type: 'AUTH_LOGOUT'});
                localStorage.removeItem('token-lifetime');
            }, 2000);

        }
        return {token, fail}
    };
    _sendRequest = async (url, body, header) => {
        let headers = {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };
        if (header) {
            headers = {...headers, ...header};
        }
        try {
            const res = await fetch(url, {
                method: 'POST',
                headers,
                body: JSON.stringify(body)
            });

            if (res.status >= 400) {
                const error = await res.json();
                return this.errorHandler(error)
            }

            const data = await res.json();
            return {...data, ok: true}
        } catch (e) {
            return this.errorHandler(e)
        }

    };
    _addQueryParams = (params) => {
        if (!params) return '';
        const keys = Object.keys(params);
        return keys.length ?
            '?' + keys.map(key => `${key}=${params[key]}`)
                .join('&') : ''
    };
    _transformCategories = (category) => {
        if (category !== null && 'name' in category) {
            return {
                ok: true,
                imageSrc: category.imageSrc || '',
                name: category.name,
                id: category._id
            }

        } else return this.errorHandler({message: 'incorrect data'})

    };
    _transformPosition = (position) => {
        if (position) {
            return {
                ok: true,
                positionId: position._id,
                name: position.name,
                cost: position.cost,
                category: position.category
            }

        } else return this.errorHandler({message: 'incorrect data'})

    };
    _transformOrders = (orders) => {
        if (orders) {
            return {
                id: orders._id,
                list: orders.list,
                orderNumber: orders.order,
                date: orders.date,
                orderSummary: sum(orders.list)
            }

        } else return this.errorHandler({message: 'incorrect data'});

        function sum(list) {
            let orderSummary = 0;
            list.forEach(item => orderSummary += (item.cost * item.quantity));
            return orderSummary
        }
    };
    login = async (user) => {
        try {
            return await this._sendRequest('/api/auth/login', user);
        } catch (e) {
            return this.errorHandler(e)
        }
    };

    register = async (user) => {
        try {
            return await this._sendRequest('/api/auth/register', user);
        } catch (e) {
            return this.errorHandler(e)
        }

    };

    errorHandler = (error) => {

        let message = error.message || 'Unknown error';
        if (message === '500') {
            message = 'Something went wrong. Try again.'
        }
        if (error === 404) {
            console.log('404',error);
            message = 'Resource not found.'
        }
        console.warn('Exception HttpService-->', message);
        return {ok: false, message}
    };
    fetchCategories = async (signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch('/api/category', {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            const categories = await  res.json();
            if (!categories.length) {
                return this.errorHandler({message: 'No categories.'});
            }
            return categories.map((category) => this._transformCategories(category));
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    getCategory = async (id, signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/category/${id}`, {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            if (res.status === 200) {
                const category = await res.json();
                return this._transformCategories(category);
            }

        } catch (e) {
            return this.errorHandler(e)
        }
    };
    createOrUpdateCategory = async (name, image, id) => {
        const fd = new FormData();
        fd.append('name', name);
        if (image) {
            fd.append('image', image, image.name);
        }
        const method = id ? 'PATCH' : 'POST';
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/category${id}`, {
                method,
                headers: {'Authorization': check.token},
                body: fd
            });

            if (res.status >= 400) {
                const error = await res.json();
                return this.errorHandler(error)
            }
            const data = await res.json();
            const message = `Category successfully ${id ? 'updated' : 'created'}`;
            return {...data, ok: true, message}
        } catch (e) {
            return this.errorHandler(e);
        }

    };
    removeCategory = async (id) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/category/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': check.token
                }
            });
            return await res.json();
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    getPositionsById = async (id, signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/position/${id}`, {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            const response = await  res.json();
            if (!response.length) {
                return []
            }
            return response.map((position) => this._transformPosition(position));
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    createPosition = async (position, category) => {
        const body = {
            name: position.name,
            cost: position.cost,
            category: category
        };
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const data = await this._sendRequest('/api/position', body, {'Authorization': check.token});
            return {...data, ok: true, message: 'Position successfully added'}
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    updatePosition = async (id, position, signal) => {
        const body = {
            name: position.name,
            cost: position.cost
        };
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/position/${id}`, {
                method: 'PATCH',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                },
                body: JSON.stringify(body)
            });

            if (res.status >= 400) {
                const error = await res.json();
                return this.errorHandler(error)
            }

            const data = await res.json();
            return {...data, ok: true, message: 'Position successfully updated'}
        } catch (e) {
            return this.errorHandler(e)
        }

    };
    removePosition = async (id, signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(`/api/position/${id}`, {
                method: 'DELETE',
                signal : signal,
                headers: {
                    'Authorization': check.token
                }
            });
            return await res.json();
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    createOrder = async (order) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const data = await this._sendRequest('/api/order', order, {'Authorization': check.token});
            return {...data, message: 'Order successfully added'}
        } catch (e) {
            return this.errorHandler(e)
        }
    };

    getOrders = async (params, signal) => {
        const url = `/api/order` + this._addQueryParams(params);

        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch(url, {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            if (res.status === 200) {
                const data = await res.json();
                return data.map(item => this._transformOrders(item))
            } else {
                return this.errorHandler(res.status)
            }

        } catch (e) {
            return this.errorHandler(e)
        }
    };
    getOverview = async (signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch('api/analytics/overview', {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            if (res.status === 200) {
                return await res.json();
            } else {
                return this.errorHandler(res.status)
            }
        } catch (e) {
            return this.errorHandler(e)
        }
    };
    getAnalyticsData = async (signal) => {
        try {
            const check = this._checkToken();
            if (check.fail) {
                return this.errorHandler({message: 'User session expired, log in again.'})
            }
            const res = await fetch('api/analytics/analytics', {
                method: 'GET',
                signal : signal,
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Authorization': check.token
                }
            });
            if (res.status === 200) {
                return await res.json();
            } else {
                return this.errorHandler(res.status)
            }
        } catch (e) {
            if (e.name === 'AbortError') {
                console.log('Fetch aborted');
            }
            return this.errorHandler(e)
        }
    }
}