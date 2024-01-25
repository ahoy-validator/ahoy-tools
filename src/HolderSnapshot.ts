import { snapshot } from "./config";
import fs from "fs";
import { FetchItems, RetryFailedSnapshot } from "./lib";

const dir = "./workspace";

const HolderSnapshot = async () => {
  console.log("Making snapshot...");
  const holders = [];
  const limit = 25;
  const failedRequests = [];

  for (let i = 0; i < snapshot.collection_size; i += limit) {
    const res = await FetchItems({ offset: i, limit });
    if (res.status === 200) {
      holders.push(...res.holders);
    } else {
      failedRequests.push(i);
    }
  }

  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  console.log(
    `Saving to: ./workspace/snapshot-${snapshot.collection_name}.json`
  );
  fs.writeFileSync(
    `./workspace/snapshot-${snapshot.collection_name}.json`,
    JSON.stringify(holders, null, 2),
    "utf8"
  );

  console.log(
    `Snapshot complete with ${failedRequests.length} failed requests`
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
    console.log(
      `Completed snapshot saved to: ./workspace/snapshot-${snapshot.collection_name}.json`
    );
  }
};

if (
  fs.existsSync(
    `./workspace/snapshot-${snapshot.collection_name}-failed.json`
  ) &&
  fs.readFileSync(
    `./workspace/snapshot-${snapshot.collection_name}-failed.json`
  ).length > 0
) {
  RetryFailedSnapshot();
} else {
  HolderSnapshot();
}
