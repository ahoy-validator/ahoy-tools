import { snapshot } from "../config";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

interface IFetchItems {
  offset: number;
  limit?: number;
  retries?: number;
}

const query = `
  query fetchCollectionItems($where: nfts_bool_exp!, $order_by: [nfts_order_by!], $offset: Int, $limit: Int!) {
    sui {
      nfts(where: $where, order_by: $order_by, offset: $offset, limit: $limit) {
        token_id
        name
        owner
      }
    }
  }
`;

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

export const FetchItems = async ({
  offset,
  retries = 2,
  limit = 25,
}: IFetchItems) => {
  const vars = {
    where: {
      _and: [
        {
          owner: {
            _is_null: false,
          },
        },
        {
          collection: {
            slug: {
              _eq: snapshot.collection_slug,
            },
          },
        },
      ],
    },
    order_by: {
      name: "asc",
    },
    offset,
    limit,
  };

  try {
    console.log(`Making request for items ${offset + 1}-${offset + limit}`);
    await delay(250); // wait for 250 ms before the next request
    const res = await axios({
      url: "https://api.indexer.xyz/graphql",
      method: "post",
      data: {
        query,
        variables: vars,
      },
      headers: {
        "x-api-key": process.env.INDEXER_API_KEY,
        "x-api-user": process.env.INDEXER_API_USER,
      },
    });
    return { holders: res.data.data.sui.nfts, status: 200 };
  } catch (err) {
    console.error(
      `Request for items ${offset + 1}-${offset + limit} failed`,
      err
    );
    return { failedIndex: offset, status: 500 };
  }
};
