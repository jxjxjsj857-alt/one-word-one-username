// One Word, One Username, One Reward — make.fun bounty
// u-rusdyxbt-one-word-one-username-one-reward-1a191fae
//
// The task: send the entrant's own make.fun username and nothing
// else — one word, no explanation, no links, no pitch. A judge
// model reads two usernames at a time and picks the one that feels
// funnier or more interesting, weighing the published criteria in
// order: first that it is a real make.fun username, the entrant's
// own handle; then that it raises a smile on first read, sticks
// in the mind, is a single word, and sounds like a handle its
// owner would happily wear.
//
// The entry below is the entrant's own handle, jxjx-jsj: eight
// characters, one word, no spaces, no padding, no gloss. It is
// the handle Jingwen's agent runs under on make.fun, so criterion
// 1 is met by construction — it is a genuine make.fun username,
// not an invented word. The program writes exactly that word to
// /output/entry.txt, where the sealed scorer gates it (1 to 30
// UTF-8 characters, not only whitespace) and the judge compares
// it two at a time.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

// The entrant's own make.fun username. One word, eight characters.
const USERNAME = "jxjx-jsj";

// The gate the sealed scorer applies, mirrored here so a bad
// entry fails loudly at build time instead of silently at grading.
const MIN_CHARS = 1;
const MAX_CHARS = 30;

// Where the grader looks for the entry.
const OUTPUT_DIR = "/output";
const OUTPUT_FILE = join(OUTPUT_DIR, "entry.txt");

function validate(username: string): string[] {
  const problems: string[] = [];
  if (username.length < MIN_CHARS) {
    problems.push(`username is empty (needs at least ${MIN_CHARS} character)`);
  }
  if (username.length > MAX_CHARS) {
    problems.push(
      `username is ${username.length} characters, over the ${MAX_CHARS} cap`,
    );
  }
  if (username.trim() !== username || /\s/.test(username)) {
    problems.push("username contains whitespace, so it is not one word");
  }
  return problems;
}

function main(): void {
  const problems = validate(USERNAME);
  if (problems.length > 0) {
    for (const problem of problems) {
      console.error(`invalid entry: ${problem}`);
    }
    process.exit(1);
  }

  mkdirSync(dirname(OUTPUT_FILE), { recursive: true });
  writeFileSync(OUTPUT_FILE, USERNAME, "utf8");

  // Read the file back and prove the round trip: the bytes on disk
  // must be exactly the username, with no trailing newline or extra
  // whitespace the gate could count against the 30-character cap.
  const written = readFileSync(OUTPUT_FILE, "utf8");
  if (written !== USERNAME) {
    console.error(
      `round-trip mismatch: file holds ${JSON.stringify(written)}, expected ${JSON.stringify(USERNAME)}`,
    );
    process.exit(1);
  }
  console.log(`wrote ${USERNAME.length}-character entry to ${OUTPUT_FILE}: ${USERNAME}`);
}

main();
