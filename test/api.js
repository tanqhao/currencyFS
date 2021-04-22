const supertest = require("supertest");
const request = supertest(`http://localhost:8080/`);
const chai = require("chai")
expect = chai.expect;



let currency = "SGD";
let base = "SGD";
let date ="2021-04-15"
let symbols = ["USD","AUD"];

describe("GET Currencies list API", () => {
  it("Check Currencies properties exists", (done) => {
    request
      .get("query/list")
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).to.not.be.empty;
        expect(res.body.hasOwnProperty("fiats")).to.be.true;
        let fiats = res.body.fiats;
        expect(fiats).to.not.be.empty;
        expect(fiats["SGD"].hasOwnProperty("currency_name")).to.be.true;
        expect(fiats["SGD"].hasOwnProperty("currency_code")).to.be.true;
        done();
      }).timeout(5000);
  });

  it("GET single Currency info", (done) => {
    request
      .get("query/list")
      .end((err, res) => {
        if (err) throw err;
        let fiats = res.body.fiats;
        expect(fiats[`${currency}`].currency_name).to.equal("Singapore dollar")
        expect(fiats[`${currency}`].currency_code).to.equal("SGD")
        done();
      }).timeout(5000);
  });
});


describe("GET Current Rates API", () => {
  it("Get Current rates from base", (done) => {
    request
      .get(`query/currentRates/?base=${base}`)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).to.not.be.empty;
        expect(res.body.base).to.equal(`${base}`)
        let rates = res.body.rates;
        expect(rates[`${base}`]).to.equal(1);
        done();
      }).timeout(5000);
  });


  it("Get Current rates from base with symbol", (done) => {
    request
    .get(`query/currentRates/?base=${base}&symbols=${symbols[0]},${symbols[1]}`)
    .end((err, res) => {
      if (err) throw err;
      expect(res.body).to.not.be.empty;
      expect(res.body.base).to.equal(`${base}`)
      let rates = res.body.rates;
      expect(rates.hasOwnProperty(symbols[0])).to.be.true;
      expect(rates.hasOwnProperty(symbols[1])).to.be.true;
      done();
      }).timeout(5000);
  });
});

describe("GET History API", () => {
  it("Get History rate from base", (done) => {
    request
      .get(`query/historicalRates/?base=${base}&date=${date}`)
      .end((err, res) => {
        if (err) throw err;
        expect(res.body).to.not.be.empty;
        expect(res.body.base).to.equal(`${base}`)
        expect(res.body.date).to.equal(`${date}`)
        expect(res.body.rates).to.not.be.empty;
        done();
      }).timeout(5000);
  });


  it("Get History rates from base with symbol", (done) => {
    request
    .get(`query/currentRates/?base=${base}&date=${date}&symbols=${symbols}`)
    .end((err, res) => {
      if (err) throw err;
      expect(res.body).to.not.be.empty;
      expect(res.body.base).to.equal(`${base}`)
      let rates = res.body.rates;
      expect(rates.hasOwnProperty(symbols[0])).to.be.true;
      expect(rates.hasOwnProperty(symbols[1])).to.be.true;
      done();
    }).timeout(5000);
  });
});
