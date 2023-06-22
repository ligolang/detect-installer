const detectInstaller = require("../lib/detect-installer");

test("should npm", async () => {
  expect(await detectInstaller({ cwd: "" })).toBe("npm");
});
