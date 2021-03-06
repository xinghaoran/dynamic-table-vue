((typeof self !== 'undefined' ? self : this)["webpackJsonpdynamictablevue"] = (typeof self !== 'undefined' ? self : this)["webpackJsonpdynamictablevue"] || []).push([[1],{

/***/ 0:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 1:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 10:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 11:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 12:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 2:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 3:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 4:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 5:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 6:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 7:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 8:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ 9:
/***/ (function(module, exports) {

/* (ignored) */

/***/ }),

/***/ "c213":
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, "export_table_to_excel", function() { return /* binding */ export_table_to_excel; });
__webpack_require__.d(__webpack_exports__, "export_json_to_excel", function() { return /* binding */ export_json_to_excel; });
__webpack_require__.d(__webpack_exports__, "processMergeHeader", function() { return /* binding */ processMergeHeader; });

// EXTERNAL MODULE: ./node_modules/xlsx-style/xlsx.js
var xlsx = __webpack_require__("1088");
var xlsx_default = /*#__PURE__*/__webpack_require__.n(xlsx);

// CONCATENATED MODULE: ./src/utils/util.js
/**
 * Determine if it is a number
 * @param val
 */
 function isNumber (val) {
    var regPos = /^\d+(\.\d+)?$/ // 非负浮点数
    var regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/ // 负浮点数
    if (regPos.test(val) || regNeg.test(val)) {
      return true
    } else {
      return false
    }
  }
// CONCATENATED MODULE: ./src/utils/vendor/Export2Excel.js
/* eslint-disable */
__webpack_require__("0fd4");



function generateArray(table) {
  var out = [];
  var rows = table.querySelectorAll('tr');
  var ranges = [];
  for (var R = 0; R < rows.length; ++R) {
    var outRow = [];
    var row = rows[R];
    var columns = row.querySelectorAll('td');
    for (var C = 0; C < columns.length; ++C) {
      var cell = columns[C];
      var colspan = cell.getAttribute('colspan');
      var rowspan = cell.getAttribute('rowspan');
      var cellValue = cell.innerText;
      if (cellValue !== "" && cellValue == +cellValue) cellValue = +cellValue;

      //Skip ranges
      ranges.forEach(function (range) {
        if (R >= range.s.r && R <= range.e.r && outRow.length >= range.s.c && outRow.length <= range.e.c) {
          for (var i = 0; i <= range.e.c - range.s.c; ++i) outRow.push(null);
        }
      });

      //Handle Row Span
      if (rowspan || colspan) {
        rowspan = rowspan || 1;
        colspan = colspan || 1;
        ranges.push({
          s: {
            r: R,
            c: outRow.length
          },
          e: {
            r: R + rowspan - 1,
            c: outRow.length + colspan - 1
          }
        });
      };

      //Handle Value
      outRow.push(cellValue !== "" ? cellValue : null);

      //Handle Colspan
      if (colspan)
        for (var k = 0; k < colspan - 1; ++k) outRow.push(null);
    }
    out.push(outRow);
  }
  return [out, ranges];
};

function datenum(v, date1904) {
  if (date1904) v += 1462;
  var epoch = Date.parse(v);
  return (epoch - new Date(Date.UTC(1899, 11, 30))) / (24 * 60 * 60 * 1000);
}

function sheet_from_array_of_arrays(data, headerLength) {
  var ws = {};
  var range = {
    s: {
      c: 10000000,
      r: 10000000
    },
    e: {
      c: 0,
      r: 0
    }
  };
  
  for (var R = 0; R != data.length; ++R) {
    for (var C = 0; C != data[R].length; ++C) {
      if (range.s.r > R) range.s.r = R;
      if (range.s.c > C) range.s.c = C;
      if (range.e.r < R) range.e.r = R;
      if (range.e.c < C) range.e.c = C;
      if(isNumber(data[R][C])){
        data[R][C] -= 0
      }
      var cell = {
        v: data[R][C],
        s: {
          alignment: {
            /// 自动换行
            // wrapText: 1,
              // 居中
            horizontal: "center",
            vertical: "center",
            // indent: 0
          }
        }
      };
      if (cell.v == null) continue;
      var cell_ref = xlsx_default.a.utils.encode_cell({
        c: C,
        r: R
      });

      if (typeof cell.v === 'number') cell.t = 'n';
      else if (typeof cell.v === 'boolean') cell.t = 'b';
      else if (cell.v instanceof Date) {
        cell.t = 'n';
        cell.z = xlsx_default.a.SSF._table[14];
        cell.v = datenum(cell.v);
      } else cell.t = 's';

      ws[cell_ref] = cell;
    }
  }
  if (range.s.c < 10000000) ws['!ref'] = xlsx_default.a.utils.encode_range(range);
  return ws;
}

function Workbook() {
  if (!(this instanceof Workbook)) return new Workbook();
  this.SheetNames = [];
  this.Sheets = {};
}

function s2ab(s) {
  var buf = new ArrayBuffer(s.length);
  var view = new Uint8Array(buf);
  for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xFF;
  return buf;
}

function export_table_to_excel(id) {
  var theTable = document.getElementById(id);
  var oo = generateArray(theTable);
  var ranges = oo[1];

  /* original data */
  var data = oo[0];
  var ws_name = "SheetJS";

  var wb = new Workbook(),
    ws = sheet_from_array_of_arrays(data);

  /* add ranges to worksheet */
  // ws['!cols'] = ['apple', 'banan'];
  ws['!merges'] = ranges;

  /* add worksheet to workbook */
  wb.SheetNames.push(ws_name);
  wb.Sheets[ws_name] = ws;

  var wbout = xlsx_default.a.write(wb, {
    bookType: 'xlsx',
    bookSST: false,
    type: 'binary'
  });

  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), "test.xlsx")
}

var Export2Excel_wb = new Workbook();
function export_json_to_excel({
  multiHeader = [],
  header,
  data,
  filename,
  merges = [],
  autoWidth = true,
  bookType = 'xlsx',
  sheetName = "Sheet1",
  lastSheet = true
} = {}) {
  /* original data */
  filename = filename || 'excel-list'
  data = [...data]
  if(header.length !== 0){
    data.unshift(header);
  }
  

  for (let i = multiHeader.length - 1; i > -1; i--) {
    data.unshift(multiHeader[i])
  }

  var ws_name = sheetName;
  var ws = sheet_from_array_of_arrays(data, data.length + multiHeader.length);

  if (merges.length > 0) {
    if (!ws['!merges']) ws['!merges'] = [];
    merges.forEach(item => {
      ws['!merges'].push(xlsx_default.a.utils.decode_range(item))
    })
  }

  if (autoWidth) {
    /*设置worksheet每列的最大宽度*/
    const colWidth = data.map(row => row.map(val => {
      /*先判断是否为null/undefined*/
      if (val == null) {
        return {
          'wch': 10
        };
      }
      /*再判断是否为中文*/
      else if (val.toString().charCodeAt(0) > 255) {
        return {
          'wch': val.toString().length * 2
        };
      } else {
        return {
          'wch': val.toString().length
        };
      }
    }))
    /*以第一行为初始值*/
    let result = colWidth[0];
    for (let i = 1; i < colWidth.length; i++) {
      for (let j = 0; j < colWidth[i].length; j++) {
        if (result[j]['wch'] < colWidth[i][j]['wch']) {
          result[j]['wch'] = colWidth[i][j]['wch'];
        }
      }
    }
    ws['!cols'] = result;
  }

  /* add worksheet to workbook */
  Export2Excel_wb.SheetNames.push(ws_name);
  Export2Excel_wb.Sheets[ws_name] = ws;

  if(lastSheet){
    writeExcel(filename, bookType)
  }
}

function writeExcel(filename, bookType){
  var wbout = xlsx_default.a.write(Export2Excel_wb, {
    bookType: bookType,
    bookSST: false,
    type: 'binary'
  });
  saveAs(new Blob([s2ab(wbout)], {
    type: "application/octet-stream"
  }), `${filename}.${bookType}`);
  Export2Excel_wb = new Workbook()
}

function processMergeHeader(multiLineNumber, columns, multiHeader, headerLetters, merges){
  for (let i = 0; i < multiLineNumber; i++) {
    multiHeader.push([])
  }
  for (let i = 0; i < columns.length; i++) {
    columns2multiHeader(columns[i], multiHeader, 0, multiLineNumber)
  }
  for (let i = 0; i < multiHeader.length; i++) {
    for (let j = 0; j < multiHeader[0].length; j++) {
      if (multiHeader[i][j] === '') {
        let flag = false
        for (let c = i - 1; c >= 0; c--) {
          if (multiHeader[c][j] !== '') {
            merges.push(headerLetters[j] + (c + 1) + ':' + headerLetters[j] + (i + 1))
            flag = true
            break
          }
        }
        if (!flag) {
          for (let r = j - 1; r >= 0; r--) {
            if (multiHeader[i][r] !== '') {
              merges.push(headerLetters[r] + (i + 1) + ':' + headerLetters[j] + (i + 1))
              break
            }
          }
        }
      }
    }
  }
  const alreadyExist = []
  for (let m = merges.length - 1; m >= 0; m--) {
    let flag = false
    for (let j = 0; j < alreadyExist.length; j++) {
      const mer = merges[m].split(':')
      const alr = alreadyExist[j].split(':')
      if (mer[0] === alr[0]) {
        flag = true
        break
      }
    }
    if (!flag) {
      alreadyExist.push(merges[m])
    }
  }
  return alreadyExist
}

function columns2multiHeader (column, multiHeader, rowNum, multiLineNumber) {
  const col = column
  if (typeof col.children !== 'undefined') {
    multiHeader[rowNum].push(col.title)
    rowNum++
    for (let n = 0; n < col.children.length; n++) {
      columns2multiHeader(col.children[n], multiHeader, rowNum, multiLineNumber)
    }
  } else {
    multiHeader[rowNum].push(col.title)
    for (let j = 0; j < rowNum; j++) {
      const before = multiHeader[j].length
      const now = multiHeader[rowNum].length
      if (before !== now) {
        for (let n = 0; n < now - before; n++) {
          multiHeader[j].push('')
        }
      }
    }
    for (let j = rowNum + 1; j < multiLineNumber; j++) {
      multiHeader[j].push('')
    }
  }
}

/***/ })

}]);
//# sourceMappingURL=dynamictablevue.umd.1.js.map