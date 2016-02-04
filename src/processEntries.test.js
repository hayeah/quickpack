import {extractEntriesFromArguments,extractEntry} from "./processEntries";

import {assert} from "chai";

const {ok,deepEqual} = assert;

describe("extractEntry",() => {

  describe("defaults",() => {
    let result;
    before(() => {
      result = extractEntry("a.js");
    });

    it("defaults `target` to web",() => {
      assert.propertyVal(result,"target","web");
    });

    it("defaults `entry` to the same as file's basename", () => {
      assert.propertyVal(result,"entry","a");
    });

    it("sets filename", () => {
      assert.propertyVal(result,"filename","a.js");
    });
  });

  describe("b=a.js",() => {
    it("sets entry value to b",() => {
      let result = extractEntry("b=a.js");
      assert.propertyVal(result,"entry","b");
      assert.propertyVal(result,"filename","a.js");
    });

    it("throws error if filename is empty",() => {
      assert.throw(() => {
        extractEntry("b=")
      },/filename cannot be empty/);
      // let result = extractEntry("b=");
      // assert.propertyVal(result,"entry","b");
      // assert.propertyVal(result,"filename","a.js");
    });
  });

  describe("changing target",() => {
    it("b=a.js@node",() => {
      let result = extractEntry("b=a.js@node");
      assert.propertyVal(result,"target","node");
      assert.propertyVal(result,"entry","b");
      assert.propertyVal(result,"filename","a.js");
    });

    it("a.js@node",() => {
      let result = extractEntry("a.js@node");
      assert.propertyVal(result,"target","node");
      assert.propertyVal(result,"entry","a");
      assert.propertyVal(result,"filename","a.js");
    });

    it("a",() => {
      let result = extractEntry("a");
      assert.propertyVal(result,"target","web");
      assert.propertyVal(result,"entry","a");
      assert.propertyVal(result,"filename","a");
    });
  });

});


describe("extractEntriesFromArguments",() => {
  it("groups entries by target platforms",() => {
    assert.deepEqual(extractEntriesFromArguments(["a@node","b=bar","c@node"]),{
      node: {
        a: "a",
        c: "c",
      },

      web: {
        b: "bar"
      }
    });
  });
});