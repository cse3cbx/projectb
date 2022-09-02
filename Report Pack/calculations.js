//import Workbook from "exceljs";
import { createReadStream, createWriteStream } from "fs";

//import {parseInt} from "Integer";

const logFinancialDS = () => {
    try {
        var rowArr = new Array();
        createReadStream("finDB.csv")
            .pipe(parse({ delimiter: ",", from_line: 2 }))
            .on("data", function (row) {
                rowArr.push(row);
            })
            .on("end", function () {
                //console.log(rowArr[0]);
                return rowArr
            })
    } catch(err) {
        console.log(err)
    }
}

// TODO: This function needs to be moved to the S3 Fetch Module


// Calculate Card Payments Value - Month by Month
const calcCardPaymentsVal = async (ds) => {
    try {
        var dateTo = new Date()
        var amount = Array(12).fill(0)
        for (var i = 0; i < ds.length; i++) {
            var dateString = ds[i][23]
            var dateParts = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateFrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            var datediff = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
            if (ds[i][9] == 'DEBIT_CREDIT_CARD_API' && ds[i][10] == 'Approved') {
                if (datediff < 12) {
                    amount[datediff] += Number(ds[i][17])
                }
            }
        }
        console.log(amount);
    } catch(err) {
        console.log(err)
    }
}


// Calculate number of approved card payments, month by month
const calcCardPayApprov = async (ds) => {
    try {
        var dateTo = new Date()
        var approved = Array(13).fill(0)
        for (var i = 0; i < ds.length; i++) {
            var dateString = ds[i][23]
            var dateParts = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateFrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            var datediff = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
            if (ds[i][9] == 'DEBIT_CREDIT_CARD_API' && ds[i][10] == 'Approved') {
                if (datediff < 13) {
                    approved[datediff]++
                }
            }
        }
        console.log(approved);
    } catch(err) {
        console.log(err)
    }
}

// Calculate average surcharge rate of card payments, month by month
const calcAvgSurcharRateMBM = async (ds) => {
    try {
        var dateTo = new Date()
        var avgsurchargembmsum = Array(13).fill(0)
        var avgsurchargembmcount = Array(13).fill(0)
        var avgsurcharge = Array(13).fill(0)
        for (var i = 0; i < ds.length; i++) {
            var dateString = ds[i][23]
            var dateParts = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateFrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            var datediff = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
            if (ds[i][9] == 'DEBIT_CREDIT_CARD_API' && ds[i][10] == 'Approved') {
                if (datediff < 13) {
                    avgsurchargembmsum[datediff] += Number(ds[i][14])
                    avgsurchargembmcount[datediff]++
                    avgsurcharge[datediff] = avgsurchargembmsum[datediff]/avgsurchargembmcount[datediff]
                }
            }
        }
        console.log(avgsurcharge);
    } catch(err) {
        console.log(err)
    }
}

// Direct Debits



// Calculate Approved Direct Debit Payments Month by Month
const calcApprovDDPayMBM = async (ds) => {
    try {
        var dateTo = new Date()
        var directDebitPaymentsVal = Array(12).fill(0)
        for (var i = 0; i < ds.length; i++) {




        }
    } catch (err) {
        console.log(err)
    }
}


// Declined Direct Debits Day by Day
const calcDeclDirectDebits = async (ds) => {
    try {
        var dateTo = new Date()
        // Month will be set to May 2022, since the entries for dataset
        // ends on the month of May.
        dateTo.setMonth(4)
        var dishonoredDirectDebits = Array(31).fill(0)
        for (var i = 0; i < ds.length; i++) {
            var dateString = ds[i][23]
            var dateParts = dateString.split("/");
            // month is 0-based, that's why we need dataParts[1] - 1
            var dateFrom = new Date(+dateParts[2], dateParts[1] - 1, +dateParts[0]);
            var datediff = dateTo.getMonth() - dateFrom.getMonth() + (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
            const oneDay = 24 * 60 * 60 * 1000;
            var daysdiff = Math.round((dateTo - dateFrom) / oneDay);
            if (ds[i][9] == 'BRANCH_PAYMENT' && ds[i][10] == 'Declined') {
                console.log(daysdiff)
                if (daysdiff < 31 && daysdiff >= 0) {
                    dishonoredDirectDebits[Math.abs(daysdiff)]++
                }
            }
        }
        console.log("Dis Honored" + dishonoredDirectDebits);
    } catch(err) {
        console.log(err)
    }
}




export { logFinancialDS, calcCardPaymentsVal,
         calcCardPayApprov, calcAvgSurcharRateMBM, calcDeclDirectDebits }
