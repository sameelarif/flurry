const { Asarmor, Trashify } = require("asarmor");

const { join } = require("path");

exports.default = async ({ appOutDir, packager }) => {
  try {
    const asarPath = join(packager.getResourcesDir(appOutDir), "app.asar");

    console.log(`Applying asarmor protections to ${asarPath}`);

    const asarmor = new Asarmor(asarPath);

    asarmor.applyProtection(new Trashify([".git", ".env"]));

    asarmor.applyProtection(
      new Trashify(
        ["foo", "bar"],
        Trashify.Randomizers.randomExtension(["js", "ts", "txt"]),
      ),
    );

    asarmor.applyProtection(
      new Trashify(["baz"], Trashify.Randomizers.junkExtension()),
    );

    await asarmor.write(asarPath);
  } catch (err) {
    console.error(err);
  }
};
