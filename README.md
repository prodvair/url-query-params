# URL - Query Params

Parsing and building url GET params with alias

```
import { URLQueryParams } from '@prodvair/url-query-params'

const qp = new URLQueryParams(<queryAlias>)
```

get query params
```
qp.queryParamsParse(http://test.test?a=b&c[]=1)
// { a: b, c: [1] }
```

build query params

```
qp.queryParamsBuild({ a: b, c: [1] })
// a=b&c[]=1
```



### Default alias:

```
import { DEFAULT_ALIAS } from '@prodvair/url-query-params'

console.log(DEFAULT_ALIAS)
/**
{
    filters: 'f',
    wheres: 'w',
    orders: 'o',
    groupe: 'g',
    column: 'col',
    condition: 'con',
    value: 'val',
    option: 'opt',
}
*/
```

@prodvair