#!/usr/bin/env node

const { spawn } = require("node:child_process");
const fs = require("node:fs/promises");
const path = require("node:path");

const [
  ,
  ,
  title = "",
  description = "",
  downloadDir = "public/generated/category-images",
] = process.argv;

if (!title) {
  console.error(
    "Usage: node generate-category-image.js <title> <description> [downloadDir]",
  );
  process.exit(1);
}

const helper = path.resolve(__dirname, "server.js");
const child = spawn(process.execPath, [helper, title, description], {
  stdio: ["ignore", "pipe", "inherit"],
  env: {
    ...process.env,
    DOWNLOAD_DIR: downloadDir,
  },
});

let out = "";
child.stdout.on("data", (d) => (out += d));
child.on("close", async (code) => {
  if (code !== 0) process.exit(code);
  const data = JSON.parse(out);
  if (data.local_path) {
    data.image_url =
      "/" + path.relative("public", data.local_path).replace(/\\/g, "/");
  }
  console.log(JSON.stringify(data, null, 2));
});
