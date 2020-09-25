require("dotenv").config();

const { expect } = require("chai");
const webdriverio = require("webdriverio");
const androidOptions = require("./helpers/caps").androidWebOptions;
const app = require("./helpers/apps").appiumWebview;
const assert = require("chai").assert;

androidOptions.capabilities.app = app;

describe("Create Android session", function () {
  // this.retries(3);
  let client;

  before(async function () {
    client = await webdriverio.remote(androidOptions);
  });

  after(async function () {
    const delete_session = await client.deleteSession();
    assert.isNull(delete_session);
  });

  it("creates a session", async function () {
    const res = await client.status();
    assert.isObject(res.build);

    const current_package = await client.getCurrentPackage();
    assert.equal(current_package, process.env.ANDROID_PACKAGE_NAME);
  });

  it("shows login page", async function () {
    const email = await client.$('input[name="email"]');
    await email.setValue("e2e_test@example.com");

    const text = await email.getValue();
    assert.equal(text, "e2e_test@example.com");
  });
});
