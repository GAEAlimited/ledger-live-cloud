import "babel-polyfill";
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

var app = express();

const PORT = process.env.PORT || 8435;

TransportNodeHid.create(5000, process.env.DEBUG || false).then(
  transport => {
    app.use(cors());

    let pending = false;
    app.post("/", bodyParser.json(), async (req, res) => {
      if (!req.body) return res.sendStatus(400);
      let data = null,
        error = null;
      if (pending) {
        return res
          .status(400)
          .json({ error: "an exchange query was already pending" });
      }
      pending = true;
      try {
        data = await transport.exchange(req.body.apduHex, req.body.statusList);
      } catch (e) {
        error = e.toString();
      }
      pending = false;
      const result = { data, error };
      console.log(req.body, " => ", result);
      res.json(result);
    });

    app.listen(PORT, () => {
      console.log("hw-transport-http-proxy-debug listening on " + PORT + "...");
    });
  },
  e => {
    console.error(e);
    process.exit(1);
  }
);
