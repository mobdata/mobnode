/* eslint-disable */
const rulesToPush = {
  "body": {
    "rules": [
      {
        "db": "books",
        "source": "002",
        "target": "001",
        "hash": "892355e434e4a006",
        "continuous": true,
        "filter": "002_to_001_filter function(doc,req) { var classyjs = require(\"views/lib/classyjs\");var targetNode = {\"id\":\"8b1487396b59ddd455dac14eb90025d2\",\"rev\":\"3-6c93ed12ca261ac3ba4ea3b6a715b68c\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@md-001.trinityalps.org:6984\",\"node_name\":\"001\",\"username\":\"admin\",\"host\":\"md-001.trinityalps.org\",\"attributes\":{\"office_type\":\"hq\",\"classification\":\"TOP SECRET\",\"company\":\"Google\"},\"port\":\"6984\",\"created_on\":\"2017-10-04T12:50:14.738Z\",\"updated_on\":\"2018-01-25T15:42:02.414Z\",\"edit_password\":\"0eba10c0fb6f5916355366fc63002ea3\"};var sourceNode = {\"id\":\"home_node\",\"rev\":\"2-16975030d253c6ee9ca44072ac772a5f\",\"protocol\":\"https\",\"url\":\"https://admin:undefined@md-002.trinityalps.org:6984\",\"node_name\":\"002\",\"username\":\"admin\",\"host\":\"md-002.trinityalps.org\",\"attributes\":{\"company\":\"Google\",\"office_type\":\"regional\",\"classification\":\"TOP SECRET\"},\"port\":\"6984\",\"updated_on\":\"2017-10-04T12:52:03.130Z\",\"edit_password\":\"home_node\"};if (doc[\"_id\"].indexOf(\"_design\") >= 0) {log(\"REPLICATION FILTER SKIPS design doc: \" + doc[\"_id\"]);return false;}log(\"REQ CONTENTS: \" + toJSON(req));log(\"DOC CONTENTS: \" + toJSON(doc));if (doc[\"md_attributes\"] === undefined || !doc[\"md_attributes\"]) {log(\"REPLICATION FILTER FAILS on md_attributes:\" + doc[\"_id\"]);return false;}return true;}"
      }
    ]
  }
}
export default rulesToPush
