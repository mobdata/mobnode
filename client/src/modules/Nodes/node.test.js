import Adapter from 'enzyme-adapter-react-16';// React 16 Enzyme adapter
import TestRenderer from 'react-test-renderer';
import { FilePond } from 'react-filepond'


import { formatNodeUpload, checkIfNode, lookForNodes, csvToObjectArray } from './node.actions';

test('Test formatNodeUpload function fills node', () => {
  const currentNodeJson = {
    "node_name": "122",
    "host": "whateverhost.org",
    "password": "pswd",
    "username": "admin"
  }
  const result = formatNodeUpload(currentNodeJson)
  expect(JSON.stringify(result)).toEqual("{\"node_name\":\"122\","
                                       + "\"host\":\"whateverhost.org\","
                                       + "\"password\":\"pswd\","
                                       + "\"username\":\"admin\","
                                       + "\"port\":\"6984\","
                                       + "\"protocol\":\"https\","
                                       + "\"url\":\"https://whateverhost.org:6984\","
                                       + "\"attributes\":{}}");
})

test('Test CheckIfNode function Pass', () => {
  const currentNodeJson = {
    "protocol": "https",
    "url": "https://whateverhost.org:6984",
    "node_name": "122",
    "host": "whateverhost.org",
    "attributes": {
      "company": "Bobby Flay",
      "office_type": "regional",
      "classification": "UNCLASSIFIED"
    },
    "password": "pswd",
    "port": "6984",
    "username": "admin"
  }

  const result = checkIfNode(currentNodeJson)

  expect(JSON.stringify(result)).toEqual("\"completeNode\"");
})

test('Test CheckIfNode function Pass WO attributes', () => {
  const currentNodeJson = {
    "protocol": "https",
    "url": "https://whateverhost.org:6984",
    "node_name": "122",
    "host": "whateverhost.org",
    "password": "pswd",
    "port": "6984",
    "username": "admin"
  }

  const result = checkIfNode(currentNodeJson)

  expect(JSON.stringify(result)).toEqual("\"completeNode\"");
})

test('Test CheckIfNode function Fail ', () => {
  const currentNodeJson = {
    "protocol": "https",
    "node_name": "122",
    "host": "whateverhost.org",
    "port": "6984",
    "username": "admin"
  }

  const result = checkIfNode(currentNodeJson)

  expect(JSON.stringify(result)).toEqual("\"incompleteNode\"");
})

test('Test lookForNodes function twoNodes', () => {
  const myJSON = require('../../../testdocs/twoNodes.json')
  const complete = [];
  const incomplete = [];
  const result = lookForNodes(myJSON, complete, incomplete)
  expect(complete).toHaveLength(2);
  expect(incomplete).toHaveLength(0);

})

test('Test lookForNodes function Mixed', () => {
  const myJSON = require('../../../testdocs/MixedCompleteIncomplete.json')
  const complete = [];
  const incomplete = [];
  const result = lookForNodes(myJSON, complete, incomplete)
  expect(complete).toHaveLength(3);
  expect(incomplete).toHaveLength(2);

})

test('Test lookForNodes function hiddennode', () => {
  const myJSON = require('../../../testdocs/hiddennode.json')
  const complete = [];
  const incomplete = [];
  const result = lookForNodes(myJSON, complete, incomplete)
  expect(complete).toHaveLength(1);
  expect(incomplete).toHaveLength(0);

})

test('Test lookForNodes function node122.txt', () => {
  // Data from node122.txt. FilePond does the read in automatically in the react code,
  // and attempting to read it in is failing here because of special characters,
  // so I'm just pasting the text in for the test.
  const myJsonText = "{"+
                       "\"protocol\": \"https\","+
                       "\"url\": \"https://whateverhost.org:6984\","+
                       "\"node_name\": \"122\","+
                       "\"host\": \"whateverhost.org\","+
                       "\"attributes\": {"+
                         "\"company\": \"Bobby Flay\","+
                         "\"office_type\": \"regional\","+
                         "\"classification\": \"UNCLASSIFIED\""+
                       "},"+
                       "\"password\": \"pswd\","+
                       "\"port\": \"6984\","+
                       "\"username\": \"admin\""+
                     "}";



  const myJson = JSON.parse(myJsonText);

  const complete = [];
  const incomplete = [];
  const result = lookForNodes(myJson, complete, incomplete)
  expect(complete).toHaveLength(1);
  expect(incomplete).toHaveLength(0);

})

test('Test csvToObjectArray function csvnodes', () => {
// Data from csvnodes.csv. FilePond does the read in automatically in the react code,
// and attempting to read it in is failing here because of special characters,
// so I'm just pasting the text in for the test.
  const csvData = "node_name,protocol,host,port,username,password,company,classification,office_type \n" +
                  "121,https,md-121.whateverhost.org,6984,admin,pswd,google,SECRET,regional \n" +
                  "122,https,md-122.whateverhost.org,6984,admin,pswd,google,TOP SECRET,regional"

  const result = csvToObjectArray(csvData)
  const expected = "[{\"node_name\":\"121\"," +
                      "\"protocol\":\"https\"," +
                      "\"host\":\"md-121.whateverhost.org\"," +
                      "\"port\":\"6984\"," +
                      "\"username\":\"admin\"," +
                      "\"password\":\"pswd\"," +
                      "\"company\":\"google\"," +
                      "\"classification\":\"SECRET\"," +
                      "\"office_type \":\"regional \"}," +
                      "{\"node_name\":\"122\"," +
                      "\"protocol\":\"https\"," +
                      "\"host\":\"md-122.whateverhost.org\"," +
                      "\"port\":\"6984\"," +
                      "\"username\":\"admin\"," +
                      "\"password\":\"pswd\"," +
                      "\"company\":\"google\"," +
                      "\"classification\":\"TOP SECRET\"," +
                      "\"office_type \":\"regional\"}]"

  expect(result).toHaveLength(2);
  expect(JSON.stringify(result)).toEqual(expected);
})

test('Test csvToObjectArray function incompletenodes', () => {
// Data from incompletenodes.csv. FilePond does the read in automatically in the react code,
// and attempting to read it in is failing here because of special characters,
// so I'm just pasting the text in for the test.
  const csvData = "node_name,protocol,host,port,username \n"
  "110,https,whateverhost.org,6984,admin \n"
  "111,https,whateverhost.org,6984,admin"

  const result = csvToObjectArray(csvData)
  const expected = "[{\"node_name\":\"\"}]"

  expect(result).toHaveLength(1);
  expect(JSON.stringify(result)).toEqual(expected);
})