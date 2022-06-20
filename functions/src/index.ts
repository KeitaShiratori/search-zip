import * as functions from "firebase-functions";
import axios from "axios";

// Start writing Firebase Functions
// https://firebase.google.com/docs/functions/typescript

const URL = "https://google.co.jp/maps/search/";

export const searchZip = functions.https.onRequest(
  async (request, response) => {
    functions.logger.info("Hello logs!" + JSON.stringify(request.query), {
      structuredData: true,
    });

    if (!request.query?.address?.length) {
      response.status(400).send({
        message: "Invalid Request. usage: GET /searchZip?address=value",
      });
    }

    const address = request.query.address;
    const { data } = await axios({
      method: "GET",
      url: encodeURI(URL + address),
    });

    console.log(JSON.stringify(data, null, "  "));
    const m = data.match(/〒(\d{3}-\d{2,4})/);
    if (!m) {
      response.status(404).send({
        message: "Not Found",
      });
    } else {
      response.send({ zipCode: m[1] });
    }
  }
);
