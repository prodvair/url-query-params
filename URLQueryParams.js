function isNumber(str) {
    return str == Number(str);
}

export class URLQueryParams {
    constructor(queryAlias) {
        if (queryAlias) this.constructor.queryAlias == queryAlias;
    }
}

Object.defineProperty(QueryURL.prototype, '$queryParams', {
    get() {
        return this.constructor._queryParams;
    },
});
QueryURL.url = null;
QueryURL._queryParams = {};
QueryURL.queryAlias = {
    filters: 'f',
    wheres: 'w',
    orders: 'o',
    groupe: 'g',
    column: 'col',
    condition: 'con',
    value: 'val',
    option: 'opt',
};

QueryURL.getThisUrl = function (url) {
    var urlParams = document.location.search;
    if (url) urlParams = new URL(url).search;
    const searchParams = new URLSearchParams(urlParams);
    const obj = {};
    for (const [key, value] of searchParams.entries()) {
        obj[key] = value;
    }
    return obj;
};

QueryURL.convertNumber = function (str) {
    return isNumber(str) ? Number(str) : str;
};

QueryURL.convert = function (value) {
    if (value === null) return 'null';
    if (value === false) return 'false';
    if (value === true) return 'true';
    if (value === 'null') return null;
    if (value === 'false') return false;
    if (value === 'true') return true;
    if (value === '') return '';
    return this.convertNumber(value);
};

QueryURL.getAliasName = function (name) {
    return this.queryAlias?.[name] || name;
};

QueryURL.parseAliasName = function (name) {
    Object.entries(this.queryAlias).forEach(([key, value]) => {
        if (value === name) name = key;
    });
    return name;
};

QueryURL.queryParamsBuild = function (
    params,
    name = undefined,
    staples = false
) {
    var string = '';
    if ([null, undefined, ''].includes(params)) return '';

    name = this.getAliasName(name);

    if (typeof params === 'object' && params !== null) {
        if (Array.isArray(params)) {
            params.forEach((item, key) => {
                const keyName = staples
                    ? `${name}[${params.length !== 1 ? key : ''}]`
                    : name;
                string += this.queryParamsBuild(item, keyName, true);
            });
        } else {
            Object.keys(params).forEach((key) => {
                const item = params[key];
                const keyName = staples
                    ? `${name}[${this.getAliasName(key)}]`
                    : key;
                string += this.queryParamsBuild(item, keyName, true);
            });
        }
    } else {
        string += `${name}=${this.convert(params)}&`;
    }

    if (!staples) {
        string = string.slice(0, -1);
    }

    return string;
};
QueryURL.prototype.queryParamsBuild = function (
    params,
) {
    return this.constructor.queryParamsBuild(params);
};

QueryURL.queryParamsParse = function (_queryParams = null, url = null) {
    if (!_queryParams) _queryParams = this.getThisUrl(url);
    var obj;

    Object.keys(_queryParams).forEach((key) => {
        const params = key.match(/([a-zA-Z0-9]+)|\[[a-zA-Z0-9]*\]/g);
        const value = this.convert(_queryParams[key]);

        const recursParse = (names, value, subObj, i = 0) => {
            if (!names[i]) return value;
            const thisName = this.parseAliasName(
                this.convertNumber(names[i].replace(/\[|\]/g, '')) || 0
            );
            if (!thisName && thisName !== 0) return value;
            if (subObj?.[thisName]) {
                subObj[thisName] = recursParse(
                    names,
                    value,
                    subObj[thisName],
                    i + 1
                );
            }

            if (typeof subObj !== 'object') {
                subObj = isNumber(thisName) ? new Array() : {};
            }

            if (!Array.isArray(subObj) || subObj[thisName]) {
                subObj[thisName] = recursParse(
                    names,
                    value,
                    subObj[thisName],
                    i + 1
                );
            } else {
                subObj.push(recursParse(names, value, subObj[thisName], i + 1));
            }
            return subObj;
        };

        if (params[0] && !obj) {
            obj = isNumber(
                this.convertNumber(params[0].replace(/\[|\]/g, '')) || 0
            )
                ? new Array()
                : {};
        }

        obj = recursParse(params, value, obj);
    });

    this._queryParams = obj;

    return obj;
};

QueryURL.prototype.queryParamsParse = function (url = null) {
    return this.constructor.queryParamsParse(null, url);
};
