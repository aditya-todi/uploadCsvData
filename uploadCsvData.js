var mongoose = require('mongoose');
var fs = require('fs');

var MONGO_USER = 'devuser'
var MONGO_PASSWORD = 'PAWSSWORD'
var MONGO_PATH = '@pharma-supply-test-h009p.mongodb.net/test?retryWrites=true'
const Schema = mongoose.Schema
const FILE_PATH = 'medData.csv'

mongoose.connect(`mongodb+srv://${MONGO_USER}:${MONGO_PASSWORD}${MONGO_PATH}`, { useNewUrlParser: true, useFindAndModify: false })

let medicine = new Schema({
    id: { type: Schema.Types.ObjectId },
    hsnCode: {
        type: Schema.Types.String,
        required: true
    },
    name: {
        type: Schema.Types.String,
        required: true
    },
    mrp: {
        type: Schema.Types.Decimal128,
        required: true
    },
    brandName: {
        type: Schema.Types.String,
        required: true
    }
})

let Medicine = mongoose.model('Medicine', medicine)

const saveMedicine = (medData) => {
    let medicine = new Medicine(medData)
    medicine.save()
        .then(document => {
            console.log(document)
        })
        .catch(err => {
            console.error(err)
        })
}

const readCsvFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, 'utf-8', (err, data) => {
            if (err) reject(err)
            resolve(data.split('\n').map(line => line.split(',')));
        })
    })
}

readCsvFile(FILE_PATH)
    .then((csvData) => {
        csvData.forEach(medArray => {
            if (medArray.length >= 4)
                saveMedicine({
                    hsnCode: medArray[0],
                    name: medArray[1],
                    mrp: parseFloat(medArray[2]),
                    brandName: medArray[3]
                })
        })
    })
    .catch((err) => console.log(err))
