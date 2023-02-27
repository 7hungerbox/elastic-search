const { Client, errors} = require('@elastic/elasticsearch')
const csv=require('csvtojson');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
class ElasticSearch{

    constructor() {
        this.ElasticClient = new Client({
            node: 'https://localhost:9200',
            auth: {
                username: 'elastic',
                password: 'CYmSBZncYiAds-ejRytk'
            },
        });
    }

    async addToElastic(data) {
        let status = true;
        await this.ElasticClient.info()
            .then(async () => {
                    for (let idx = 0; idx < data.length; idx++)
                        await this.ElasticClient.index({
                            index: 'hungerbox_questionaire_v1.1.0',
                            body: data[idx],
                        }).catch(error => {
                            status = false;
                            console.log(error);
                        });
                }
            ).catch(error => {
                status = false;
                console.log(error);
            },)
        return status;
    }
}
class CSVConverter{
    constructor() {
        this.JSON_data=[];
    }
    set setJsonData(data){
        this.JSON_data = data;
    }
    async convertToJson(path){
        this.setJsonData = await csv({ignoreEmpty: true,flatKeys:true}).fromFile(path);
    }
    get getJSONdata() {
        return this.JSON_data;
    }
}

async function run(path) {
    let json = new CSVConverter();
    await json.convertToJson(path);
    let data = json.getJSONdata;
    let elastic = new ElasticSearch();
    return await elastic.addToElastic(data);
}

paths= [
    './csv_files/questionairy711.csv',
    './csv_files/questionairyAmex.csv',
    './csv_files/questionairyAmex2.csv',
    './csv_files/questionairyEatgood.csv',
    './csv_files/questionairyITRMG.csv',
    './csv_files/questionairyMicrosoft.csv',
    './csv_files/questionairyZS.csv',
    './csv_files/questionairyZS2.csv',
    './csv_files/questionairyZS3.csv'
]

async function addSheets() {
    for (let i = 0; i < paths.length; i++) {
        let status = await run(paths[i]);
        console.log('File --> '+paths[i]+status?' added Successfully':' couldnt be added');
    }
}
addSheets();
// async function searchElastic(data){
//     let elastic = new ElasticSearch();
//     await elastic.searchElastic(data);
// }
// addSheets();
// searchElastic('detection processes');


