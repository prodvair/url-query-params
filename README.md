# URL - Query Params

Parsing and building url GET params with alias

```
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
```

@prodvair