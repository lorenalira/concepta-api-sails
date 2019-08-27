/**
 * Ticket Controller.
 */

let rp = require('request-promise');
let querystring = require('querystring');

// constants
const PROVIDER_URL = process.env.PROVIDER_API_URL;
const AUTH_GRANT_TYPE = process.env.AUTH_GRANT_TYPE;
const AUTH_USERNAME = process.env.AUTH_USERNAME;
const AUTH_PASSWORD = process.env.AUTH_PASSWORD;
const request = rp.defaults({});

module.exports = {

  /**
   * Find action.
   *
   * @param req
   * @param res
   * @return {Promise<*>}
   */
  find: (req, res) => {

    let language = req.body.Language;
    let currency = req.body.Currency;
    let destination = req.body.Destination;
    let dateFrom = req.body.DateFrom;
    let dateTO = req.body.DateTO;
    let occupancy = req.body.Occupancy;

    // Validate required fields
    if (null === language || undefined === language || '' === language) {
      return res.badRequest(formatError(new Error('Invalid Language attribute.')));
    }
    if (null === currency || undefined === currency || '' === currency) {
      return res.badRequest(formatError(new Error('Invalid Currency attribute.')));
    }
    if (null === destination || undefined === destination || '' === destination) {
      return res.badRequest(formatError(new Error('Invalid Destination attribute.')));
    }
    if (null === dateFrom || undefined === dateFrom || '' === dateFrom) {
      return res.badRequest(formatError(new Error('Invalid DateFrom attribute.')));
    }
    if (null === dateTO || undefined === dateTO || '' === dateTO) {
      return res.badRequest(formatError(new Error('Invalid DateTO attribute.')));
    }
    if (null === occupancy || undefined === occupancy || '' === occupancy) {
      return res.badRequest(formatError(new Error('Invalid Occupancy attribute.')));
    }

    // authorization token data
    let tokenForm = {
      grant_type: AUTH_GRANT_TYPE,
      username: AUTH_USERNAME,
      password: AUTH_PASSWORD
    };
    let formData = querystring.stringify(tokenForm);
    let options = {
      body: formData,
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    };

    // authorization token call
    return request.post(`${PROVIDER_URL}/Token`, options)
      .then((rawResponse) => {
        // log it
        sails.log.debug(rawResponse);
        // parse it
        let response = JSON.parse(rawResponse);
        // validate response
        if (!response.access_token) {
          // bad token
          let error = new Error(`Bad response from provider API:\n${rawResponse}`);
          error.status = 500;
          throw error;
        }
        // tickets data
        let ticketForm = req.body;
        let options = {
          body: ticketForm,
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${response.access_token}`
          },
          json: true
        };
        // tickets call
        return request.post(`${PROVIDER_URL}/api/Ticket/Search`, options);
      })
      .then((response) => {
        // log it
        sails.log.debug(response);
        // transform it
        let transformed = TransformService.parseTickets(response);
        // return it
        return res.send(transformed);
      })
      .catch((cause) => {
        // log it
        sails.log.error(formatError(cause));
        // determine status and message
        let status = ('status' in cause) ? cause.status : 500;
        let message = (cause.message) ? cause.message : 'An unknown internal error occurred.';
        // send error
        return res.status(status).send({message});
      });
  }

};

/**
 * Format error message.
 *
 * @param err
 * @return {String}
 */
function formatError(err) {
  var plainObject = {};
  Object.getOwnPropertyNames(err).forEach(function(key) {
    plainObject[key] = err[key];
  });
  delete plainObject['stack'];
  delete plainObject['__stackCleaned__'];
  return JSON.parse(JSON.stringify(plainObject, null, '\t'));
};
