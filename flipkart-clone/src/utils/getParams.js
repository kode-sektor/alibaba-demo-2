
export default (query) => {

    if (query) {
        const queryString = query.split("?")[1];
        // [cid=5fcf130200b49073b48420c1&type=undefined]

        if (queryString.length > 0) {
            const params = queryString.split("&");
            // ["cid=5fcf130200b49073b48420c1", type=undefined]

            const paramsObj = {};
            
            // cid and type
            params.forEach(param => {
                const keyValue = param.split("=");  // ["cid", "5fcf130200b49073b48420c1"]
                paramsObj[keyValue[0]] = keyValue[1];   // // {cid: "5fcf130200b49073b48420c1", type: "page"}
            });

            return paramsObj;
        }
    }
    return {};
}
