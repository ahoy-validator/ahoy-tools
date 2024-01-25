import fs from "fs";
import { snapshot } from "../config";
import { FetchItems } from "./FetchItems";

export const RetryFailedSnapshot = async () => {
  console.log("Fetching failed requests from the last session...");
  const toRetry = JSON.parse(
    fs
      .readFileSync(
        `./workspace/snapshot-${snapshot.collection_name}-failed.json`
      )
      .toString()
  );

  const retriedSnapshots = [];
  const failedRequests = [];
  for (let offset of toRetry) {
    const res = await FetchItems({ offset });
    if (res.status === 200) {
      retriedSnapshots.push(...res.holders);
    } else {
      failedRequests.push(offset);
    }
  }

  console.log("Appending fetched items to existing data...");
  const previouslySuccessful = JSON.parse(
    fs
      .readFileSync(`./workspace/snapshot-${snapshot.collection_name}.json`)
      .toString()
  );
  const holders = [...previouslySuccessful, ...retriedSnapshots];
  fs.writeFileSync(
    `./workspace/snapshot-${snapshot.collection_name}.json`,
    JSON.stringify(holders, null, 2),
    "utf8"
  );

  if (failedRequests.length) {
    console.log(`Offsets of failed requests: ${failedRequests.join(", ")}`);
    console.log(`Run again to retry these failed requests!`);
    fs.writeFileSync(
      `./workspace/snapshot-${snapshot.collection_name}-failed.json`,
      JSON.stringify(failedRequests, null, 2),
      "utf8"
    );
  } else {
    fs.unlinkSync(
      `./workspace/snapshot-${snapshot.collection_name}-failed.json`
    );
    console.log(
      `Completed snapshot saved to: ./workspace/snapshot-${snapshot.collection_name}.json`
    );
  }
};
