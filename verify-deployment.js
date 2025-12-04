#!/usr/bin/env node

/**
 * Deployment Verification Script
 *
 * This script verifies that the bot application is correctly deployed by checking:
 * - MIME types for JavaScript and CSS files
 * - Asset loading and availability
 * - Console errors
 * - Telegram WebApp initialization
 *
 * Usage:
 *   node verify-deployment.js <deployment-url>
 *
 * Example:
 *   node verify-deployment.js https://your-bot.vercel.app
 */

import https from "https";
import http from "http";
import { URL } from "url";

const COLORS = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  red: "\x1b[31m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  cyan: "\x1b[36m",
};

function log(message, color = "reset") {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

function logSuccess(message) {
  log(`✓ ${message}`, "green");
}

function logError(message) {
  log(`✗ ${message}`, "red");
}

function logWarning(message) {
  log(`⚠ ${message}`, "yellow");
}

function logInfo(message) {
  log(`ℹ ${message}`, "blue");
}

function logSection(message) {
  log(`\n${"=".repeat(60)}`, "cyan");
  log(message, "cyan");
  log("=".repeat(60), "cyan");
}

async function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const client = urlObj.protocol === "https:" ? https : http;

    client
      .get(url, (res) => {
        let data = "";
        res.on("data", (chunk) => (data += chunk));
        res.on("end", () => {
          resolve({
            statusCode: res.statusCode,
            headers: res.headers,
            body: data,
          });
        });
      })
      .on("error", reject);
  });
}

async function checkIndexHtml(baseUrl) {
  logSection("1. Checking Index HTML");

  try {
    const response = await fetchUrl(baseUrl);

    if (response.statusCode === 200) {
      logSuccess(
        `Index HTML loads successfully (Status: ${response.statusCode})`
      );
    } else {
      logError(`Index HTML returned status ${response.statusCode}`);
      return { success: false, assets: [] };
    }

    // Extract asset references from HTML
    const assetRegex = /(href|src)=["']([^"']+\.(js|css))["']/g;
    const assets = [];
    let match;

    while ((match = assetRegex.exec(response.body)) !== null) {
      assets.push(match[2]);
    }

    logInfo(`Found ${assets.length} asset references in HTML`);

    return { success: true, assets, html: response.body };
  } catch (error) {
    logError(`Failed to fetch index HTML: ${error.message}`);
    return { success: false, assets: [] };
  }
}

async function checkAssetMimeTypes(baseUrl, assets) {
  logSection("2. Checking Asset MIME Types");

  let allPassed = true;
  const results = [];

  for (const asset of assets) {
    try {
      const assetUrl = asset.startsWith("http")
        ? asset
        : new URL(asset, baseUrl).href;
      const response = await fetchUrl(assetUrl);

      const contentType = response.headers["content-type"] || "";
      const extension = asset.split(".").pop();

      let expectedType;
      let isCorrect = false;

      if (extension === "js") {
        expectedType = "application/javascript or text/javascript";
        isCorrect =
          contentType.includes("javascript") ||
          contentType.includes("application/ecmascript");
      } else if (extension === "css") {
        expectedType = "text/css";
        isCorrect = contentType.includes("text/css");
      }

      if (response.statusCode !== 200) {
        logError(`${asset} - Status ${response.statusCode}`);
        allPassed = false;
        results.push({
          asset,
          success: false,
          reason: `HTTP ${response.statusCode}`,
        });
      } else if (!isCorrect) {
        logError(
          `${asset} - Wrong MIME type: ${contentType} (expected ${expectedType})`
        );
        allPassed = false;
        results.push({
          asset,
          success: false,
          reason: `Wrong MIME type: ${contentType}`,
        });
      } else {
        logSuccess(`${asset} - ${contentType}`);
        results.push({ asset, success: true, contentType });
      }
    } catch (error) {
      logError(`${asset} - Failed to fetch: ${error.message}`);
      allPassed = false;
      results.push({ asset, success: false, reason: error.message });
    }
  }

  return { allPassed, results };
}

function checkHtmlForErrors(html) {
  logSection("3. Checking HTML Content");

  let allPassed = true;

  // Check if HTML contains error indicators
  if (html.includes("404") || html.includes("Not Found")) {
    logWarning("HTML may contain 404 error content");
    allPassed = false;
  }

  // Check for proper module script tags
  const moduleScriptRegex = /<script[^>]+type=["']module["'][^>]*>/g;
  const moduleScripts = html.match(moduleScriptRegex);

  if (moduleScripts && moduleScripts.length > 0) {
    logSuccess(`Found ${moduleScripts.length} module script tag(s)`);
  } else {
    logWarning("No module script tags found");
    allPassed = false;
  }

  // Check for Telegram WebApp script
  if (html.includes("telegram-web-app.js")) {
    logSuccess("Telegram WebApp script reference found");
  } else {
    logWarning("Telegram WebApp script not found in HTML");
  }

  return allPassed;
}

function printManualChecklist() {
  logSection("4. Manual Verification Checklist");

  log("\nPlease verify the following manually in a browser:", "yellow");
  log("");
  log("□ Open the application in a browser");
  log("□ Open Developer Tools (F12)");
  log("□ Check Console tab for errors");
  log("□ Verify no MIME type errors appear");
  log("□ Check Network tab:");
  log("  □ All JS files show Content-Type: application/javascript");
  log("  □ All CSS files show Content-Type: text/css");
  log("  □ No requests return HTML when expecting JS/CSS");
  log("□ Test in Telegram WebView:");
  log("  □ Open bot in Telegram Desktop");
  log("  □ Open bot in Telegram Mobile");
  log("  □ Verify window.Telegram.WebApp is available");
  log("  □ Test navigation between routes");
  log("  □ Verify all features work correctly");
  log("");
}

function printSummary(results) {
  logSection("Verification Summary");

  const totalChecks = results.filter((r) => r !== null).length;
  const passedChecks = results.filter((r) => r === true).length;
  const failedChecks = totalChecks - passedChecks;

  log("");
  if (failedChecks === 0) {
    logSuccess(`All automated checks passed (${passedChecks}/${totalChecks})`);
    log("");
    logInfo("Deployment appears to be configured correctly!");
    logInfo("Please complete the manual checklist above to fully verify.");
  } else {
    logError(`${failedChecks} check(s) failed out of ${totalChecks}`);
    log("");
    logWarning(
      "Please review the errors above and fix the deployment configuration."
    );
  }
  log("");
}

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    log("Deployment Verification Script", "cyan");
    log("");
    log("Usage: node verify-deployment.js <deployment-url>");
    log("");
    log("Example:");
    log("  node verify-deployment.js https://your-bot.vercel.app");
    log("");
    process.exit(1);
  }

  const baseUrl = args[0];

  log("");
  log("╔════════════════════════════════════════════════════════════╗", "cyan");
  log("║         Bot Application Deployment Verification           ║", "cyan");
  log("╚════════════════════════════════════════════════════════════╝", "cyan");
  log("");
  logInfo(`Target URL: ${baseUrl}`);
  log("");

  const results = [];

  // Step 1: Check index.html
  const indexResult = await checkIndexHtml(baseUrl);
  results.push(indexResult.success);

  if (!indexResult.success) {
    logError("Cannot proceed without a valid index.html");
    printSummary(results);
    process.exit(1);
  }

  // Step 2: Check asset MIME types
  const mimeResult = await checkAssetMimeTypes(baseUrl, indexResult.assets);
  results.push(mimeResult.allPassed);

  // Step 3: Check HTML content
  const htmlCheck = checkHtmlForErrors(indexResult.html);
  results.push(htmlCheck);

  // Step 4: Print manual checklist
  printManualChecklist();

  // Print summary
  printSummary(results);

  process.exit(results.some((r) => r === false) ? 1 : 0);
}

main().catch((error) => {
  logError(`Unexpected error: ${error.message}`);
  console.error(error);
  process.exit(1);
});
