const detectInstaller = require("../lib/detect-installer");

test("should return brew", async () => {
  expect(await detectInstaller({ cwd: "" })).toBe("brew");
});
