/**
 * Parser Helper.
 */

let _ = require('lodash');
let moment = require('moment');

/**
 * Parse tickets.
 *
 * @param response
 * @return {[Object]}
 */
const parseTickets =  (response) => {

    // output
    let data = [];

    // input
    let result = response.Result;

    for (let r of result) {

        let ticketInfo = r.TicketInfo;
        let imageThumb = _.find(ticketInfo.ImageList, ['Type', 'S']);
        let imageFull = _.find(ticketInfo.ImageList, ['Type', 'L']);
        let availableModality = r.AvailableModality;
        let modalities = [];

        for (let a of availableModality) {

            let price = _.find(a.PriceList, ['Description', 'SERVICE PRICE']);
            let dates = [];
            for (let date of a.OperationDateList) {
                let operationDate = moment(date.Date, 'YYYYMMDD');
                let from = operationDate.format('MM/DD/YYYY');
                let to = operationDate.add(date.MaximumDuration, 'days').format('MM/DD/YYYY');
                let d = {
                    From: from,
                    To: to
                };
                dates.push(d);
            }

            let modality = {
                Code: a.Code,
                Name: a.Name,
                Contract: a.Contract.Name,
                PriceList: parseFloat(price.Amount.toFixed(2)),
                OperationDateList: dates
            }
            modalities.push(modality);
        }

        // Converted response
        r = {
            Destination: ticketInfo.Destination.Code,
            Code: ticketInfo.Code,
            Classification: ticketInfo.Classification.Value,
            Name: ticketInfo.Name,
            Description: ticketInfo.DescriptionList[0].Value,
            ImageThumb: imageThumb.Url,
            ImageFull: imageFull.Url,
            AvailableModality: modalities
        }

        data.push(r);
    }
    return data;
}

module.exports = {
    parseTickets
};
