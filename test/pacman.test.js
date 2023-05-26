const detectInstaller = require("../lib/detect-installer");

test("should be pacman", async () => {
  expect(await detectInstaller({ cwd: "" })).toBe("pacman");
});
