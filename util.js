module.exports.clean2Array = async (array1, array2) => {
    let arr = [];
    await array1.forEach(async d => {
        if(array2.indexOf(d) < 0) arr.push(d);
    });
    return arr;
}

module.exports.sleep = (time) => {
    return new Promise((res) => setTimeout(res, time));
}