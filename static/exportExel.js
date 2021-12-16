const xls = require('xlsx');
const utils = xls.utils;
let exportExel = exports
exportExel.exportEx = function(data , name){
    let workbook = utils.book_new();
    let sheet = utils.json_to_sheet(data);
    utils.book_append_sheet(workbook , sheet , name);
    let result = xls.writeFile(workbook , `${name}.xls`);
    return result;
}
export default exportExel;