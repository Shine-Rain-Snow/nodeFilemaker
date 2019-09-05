// Dependencies
var fs = require('fs');
var url = require('url');
var http = require('http');
var exec = require('child_process').exec;

// App variables
var file_url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
var DOWNLOAD_DIR = './downloads/';

// We will be downloading the files to a directory, so make sure it's there
// This step is not required if you have manually created the directory
var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
var child = exec(mkdir, function (err, stdout, stderr) {
    if (err) throw err;
    else download_file_httpget(file_url);
});

// Function for downloading file using HTTP.get
var download_file_httpget = function (file_url) {
    var cookie = 'X-FMS-Session-Key=d6b2978698aa39133dd6658494ef04da29d933db8d7500f24e1'

    var options = {
        host: url.parse(file_url).host,
        port: 80,
        path: url.parse(file_url).pathname,
        'set-cookie': [cookie]
    };

    var file_name = url.parse(file_url).pathname.split('/').pop();
    var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);

    http.get(options, function (res) {
        res.on('data', function (data) {
            console.log(data);
            console.log(data.toString());
            file.write(data);
        }).on('end', function () {
            file.end();
            console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
        });
    });
};









//
//
// function downloadfile(file_url) {
//     // Dependencies
//     var fs = require('fs');
//     var url = require('url');
//     var http = require('http');
//     var exec = require('child_process').exec;
//
// // App variables
// //     var file_url = 'https://dev.baseintegration.com.au/Streaming_SSL/MainDB/220DF237E1AB8843287ABB0E7D4CC1F5351F46CDE1744E2C31F6077175074DDA.pdf?RCType=SecuredRCFileProcessor';
// //     file_url = 'http://www.orimi.com/pdf-test.pdf';
//     file_url = 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf';
//     var DOWNLOAD_DIR = './downloads/';
//
// // We will be downloading the files to a directory, so make sure it's there
// // This step is not required if you have manually created the directory
//     var mkdir = 'mkdir -p ' + DOWNLOAD_DIR;
//     var child = exec(mkdir, function (err, stdout, stderr) {
//         if (err) throw err;
//         else download_file_httpget(file_url);
//     });
//
// // Function for downloading file using HTTP.get
//     var download_file_httpget = function (file_url) {
//         var cookie = 'X-FMS-Session-Key=' + data.TOKEN;
//
//         var options = {
//             // uri: file_url,
//             host: url.parse(file_url).host,
//             port: 80,
//             path: url.parse(file_url).pathname,
//             Cookie: cookie,
//             headers: {
//                 'Content-Type': 'application/pdf'
//             }
//         };
//
//         console.log(options);
//
//
//         var file_name = url.parse(file_url).pathname.split('/').pop();
//         var file = fs.createWriteStream(DOWNLOAD_DIR + file_name);
//
//         var size = 0;
//         const req = http.get(options, function (res) {
//             res.on('data', function (data) {
//                 console.log(data);
//                 console.log(data.toString());
//                 size += data.length;
//                 file.write(data);
//             }).on('end', function () {
//                 file.end();
//                 console.log("Size " + (size / 1000)+"KB");
//                 logoutSession();
//                 console.log(file_name + ' downloaded to ' + DOWNLOAD_DIR);
//             })
//         });
//
//         req.on('error', (e) => {
//             logoutSession();
//             console.error(e);
//         });
//     };
// }

