import testNS from "../locale/en.json";

const resources = {
  test: testNS,
  // for forcing use arcscord namespace but typed correctly
  empty: {},
} as const;

export default resources;
