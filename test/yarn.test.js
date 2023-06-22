const detectInstaller = require("../lib/detect-installer");

test("should yarn", async () => {
  expect(await detectInstaller({ cwd: "" })).toBe("yarn");
});
