/* eslint-disable */

const repDocs = {
  rows: [
    {
      "id": "5d65c58d75b50db4709e63464b07de37",
      "key": "5d65c58d75b50db4709e63464b07de37",
      "value": {
        "rev": "4-5209c202149a237e90c043fb843787d9"
      },
      "doc": {
        "_id": "5d65c58d75b50db4709e63464b07de37",
        "_rev": "4-5209c202149a237e90c043fb843787d9",
        "create_target": true,
        "continuous": true,
        "hash": "892355e434e4a006",
        "target": "https://admin:pswd@md-001.whateverhost.org:6984/books",
        "source": "https://admin:pswd@md-002.whateverhost.org:6984/books",
        "filter": "books/002_to_001_filter",
        "owner": "admin",
        "_replication_state": "error",
        "_replication_state_time": "2018-02-14T16:40:32+00:00",
        "_replication_state_reason": "timeout",
        "_replication_id": "a30645eac9bf3ec65d2a37c51c0229d7"
      }
    },
    {
      "id": "5d65c58d75b50db4709e63464b07e8b4",
      "key": "5d65c58d75b50db4709e63464b07e8b4",
      "value": {
        "rev": "4-2a27fdd80116cdf0e9ca5853d456e247"
      },
      "doc": {
        "_id": "5d65c58d75b50db4709e63464b07e8b4",
        "_rev": "4-2a27fdd80116cdf0e9ca5853d456e247",
        "create_target": true,
        "continuous": true,
        "hash": "892355e434e4a006",
        "target": "https://admin:pswd@md-004.whateverhost.org:6984/movies",
        "source": "https://admin:pswd@md-002.whateverhost.org:6984/movies",
        "owner": "admin",
        "_replication_state": "triggered",
        "_replication_state_time": "2018-02-14T18:43:33+00:00",
        "_replication_id": "ec92473107c9b96abb12eeed5b805914"
      },
    },
  ],
}
export default repDocs
