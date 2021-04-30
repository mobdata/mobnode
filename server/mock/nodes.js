/* eslint-disable */
const mdNodes = {
  "total_rows": 4,
  "offset": 0,
  "rows": [
    {
      "id": "8b1487396b59ddd455dac14eb90025d2",
      "key": "8b1487396b59ddd455dac14eb90025d2",
      "value": {
        "rev": "3-6c93ed12ca261ac3ba4ea3b6a715b68c"
      },
      "doc": {
        "_id": "8b1487396b59ddd455dac14eb90025d2",
        "_rev": "3-6c93ed12ca261ac3ba4ea3b6a715b68c",
        "node_name": "001",
        "protocol": "https",
        "host": "md-001.whateverhost.org",
        "port": "6984",
        "username": "admin",
        "password": "pswd",
        "attributes": {
          "classification": "TOP SECRET",
          "url": "https://admin:pswd@md-001.whateverhost.org:6984",
          "company": "Google",
          "office_type": "hq",
          "test": "This a test adding a column"
        },
        "created_on": "2017-10-04T12:50:14.738Z",
        "updated_on": "2018-01-25T15:42:02.414Z"
      }
    },
    {
      "id": "8b1487396b59ddd455dac14eb900324a",
      "key": "8b1487396b59ddd455dac14eb900324a",
      "value": {
        "rev": "2-16975030d253c6ee9ca44072ac772a5f"
      },
      "doc": {
        "_id": "8b1487396b59ddd455dac14eb900324a",
        "_rev": "2-16975030d253c6ee9ca44072ac772a5f",
        "node_name": "002",
        "url": "https://admin:pswd@md-002.whateverhost.org:6984",
        "protocol": "https",
        "host": "md-002.whateverhost.org",
        "port": "6984",
        "username": "admin",
        "password": "pswd",
        "company": "Google",
        "office_type": "regional",
        "attributes": {
          "classification": "TOP SECRET"
        },
        "created_on": "2017-10-04T12:50:39.582Z",
        "updated_on": "2017-10-04T12:52:03.130Z"
      }
    },
    {
      "id": "8b1487396b59ddd455dac14eb900364a",
      "key": "8b1487396b59ddd455dac14eb900364a",
      "value": {
        "rev": "2-1307b259adb24bb7659489adada9a276"
      },
      "doc": {
        "_id": "8b1487396b59ddd455dac14eb900364a",
        "_rev": "2-1307b259adb24bb7659489adada9a276",
        "node_name": "004",
        "url": "https://admin:pswd@md-004.whateverhost.org:6984",
        "protocol": "https",
        "host": "md-004.whateverhost.org",
        "port": "6984",
        "username": "admin",
        "password": "pswd",
        "company": "Google",
        "office_type": "regional",
        "attributes": {
          "classification": "TOP SECRET"
        },
        "created_on": "2017-10-04T12:51:15.314Z",
        "updated_on": "2017-10-04T12:51:53.112Z"
      }
    },
    {
      "id": "8b1487396b59ddd455dac14eb9003c3a",
      "key": "8b1487396b59ddd455dac14eb9003c3a",
      "value": {
        "rev": "3-685f67099069741de6e425a12affaf86"
      },
      "doc": {
        "_id": "8b1487396b59ddd455dac14eb9003c3a",
        "_rev": "3-685f67099069741de6e425a12affaf86",
        "node_name": "020",
        "protocol": "https",
        "host": "md-020.whateverhost.org",
        "port": "6984",
        "username": "admin",
        "password": "pswd",
        "attributes": {
          "classification": "UNCLASSIFIED",
          "url": "https://admin:pswd@md-020.whateverhost.org:6984",
          "company": "Apple",
          "office_type": "hq"
        },
        "created_on": "2017-10-04T12:51:47.588Z",
        "updated_on": "2018-01-24T16:24:42.302Z"
      }
    },

    {
     "id": "_design/md_nodes",
     "key": "_design/md_nodes",
     "value": {
      "rev": "1-cd80d9ca551f499104628cb54da16098"
     },
     "doc": {
      "_id": "_design/md_nodes",
      "_rev": "1-cd80d9ca551f499104628cb54da16098",
      "updates": {
       "update": "function(doc, req){if(doc._id && req.id){reqbody = JSON.parse(req.body); doc._id = reqbody['_id']; doc._rev = reqbody['_rev']; doc.edit_password = reqbody['editpassword']; doc.protocol = reqbody['protocol']; doc.url = reqbody['url']; doc.node_name = reqbody['node_name']; doc.username = reqbody['username']; doc.host = reqbody['host']; doc.attributes = reqbody['attributes']; doc.port = reqbody['port']; doc.created_on = reqbody['created_on']; doc.updated_on = reqbody['updated_on']; return [doc,req.body];}}",
       "password": "function(doc, req){reqbody = JSON.parse(req.body); if(doc._id && reqbody['current'] && reqbody['new'] && doc.password === reqbody['current']){doc.password = reqbody['new']; return [doc, JSON.stringify({'result':'SUCCESS', '_rev': doc._rev})]} return [null,JSON.stringify({'result':'FAIL'})]}",
       "addupdatedoc": "function(doc, req) {function errorObject(code, errorName, reason){return [null, {'code': code, 'json': {'error': errorName, 'reason': reason}}];}if (req.method !== 'POST'){return errorObject(400, 'Bad Request', 'Only POST is allowed here.');}else if (doc){log('Inside doc');if (doc._id){log('Updating doc');var updatedValues = JSON.parse(req.body);doc = updatedValues;doc['updated_on'] = new Date();doc['node_name'] = req.headers.Host.split(':')[0];return [doc, {'json': {'status': 'ok', '_id': doc['_id']}}];} else{return errorObject(400, 'Bad Request', 'Document has no _id');}}else if (!req.body){return errorObject(400, 'Bad Request', 'No document to add');}else{try{log('Updating req.body - ' + req.body); var node = JSON.parse(req.body); var node_name = req.headers.Host.split(':')[0]; if (!node._id){node['_id'] = req.uuid;} node['created_on'] = new Date(); node['updated_on'] = node['created_on']; node['node_name'] = node_name; return [node, {'json': {'status': 'ok', '_id': node['_id']}}];} catch (e) {log('Error parsing node: ' + e.toString());return errorObject(400, 'Bad Request','The request body does not contain JSON: ' + req.body.substring(0,50));}}}"
      },
      "views": {
       "passwordless": {
        "map": "function(doc){if(doc._id){emit(doc._id, {'id': doc._id, 'rev': doc._rev, 'edit_password': doc.edit_password, 'protocol': doc.protocol, 'url': doc.url, 'node_name': doc.node_name, 'username': doc.username, 'host': doc.host, 'attributes': doc.attributes, 'port': doc.port, 'created_on': doc.created_on, 'updated_on': doc.updated_on })}}"
       },
       "password": {
        "map": "function(doc){if(doc._id && doc.password){emit([doc._id, doc.password], {'value': doc._id})}}",
        "reduce": "function(keys, values, rereduce){return values.length}"
       },
       "lib": {
        "classyjs": "function bannerEqOrMoreSecureThan(b1, b2) {\n  var splits1 = b1.toUpperCase().split('//');\n  var splits2 = b2.toUpperCase().split('//');\n  var RELTO = 'REL TO';\n  var NOFORN = 'NOFORN';\n  var ORCON = 'ORCON';\n  var RELIDO = 'RELIDO';\n\n  if (splits1.length > 1 && (splits1[1].indexOf(RELTO) > -1\n        || splits1[1].indexOf(NOFORN) > -1\n        || splits1[1].indexOf(ORCON) > -1\n        || splits1[1].indexOf(RELIDO)) > -1) {\n    splits1.splice(1, 0, '');\n  }\n  if (splits2.length > 1 && (splits2[1].indexOf(RELTO) > -1\n        || splits2[1].indexOf(NOFORN) > -1\n        || splits2[1].indexOf(ORCON) > -1\n        || splits2[1].indexOf(RELIDO) > -1)) {\n    splits2.splice(1, 0, '');\n  }\n\n  if (classEqOrMoreSecureThan(splits1[0], splits2[0])) {\n    var scis1 = splits1[1];\n    var scis2 = splits2[1];\n    var disseminations1 = splits1[2];\n    var disseminations2 = splits2[2];\n\n    if (sciEqOrMoreSecureThan(scis1, scis2) && dissemEqOrMoreSecureThan(disseminations1, disseminations2)) {\n      return true;\n    } else {\n      return false;\n    }\n  } else {\n    return false;\n  }\n\n  return false;\n}\n\nfunction classEqOrMoreSecureThan(c1, c2) {\n  var UNCLASSIFIED = 'UNCLASSIFIED';\n  var CONFIDENTIAL = 'CONFIDENTIAL';\n  var SECRET = 'SECRET';\n  var TOP_SECRET = 'TOP SECRET';\n  var classifications = [UNCLASSIFIED, CONFIDENTIAL, SECRET, TOP_SECRET];\n\n  var re = /^(UNCLASSIFIED|CONFIDENTIAL|SECRET|TOP SECRET)$/i;\n  if (!re.test(c1) || !re.test(c2)) {\n    return false;\n  }\n\n  if (classifications.indexOf(c1) === -1 || classifications.indexOf(c2) === -1) {\n    return false;\n  }\n\n  if (classifications.indexOf(c1) >= classifications.indexOf(c2)) {\n    return true;\n  } else {\n    return false;\n  } \n};\n\nfunction sciEqOrMoreSecureThan(sci1, sci2) {\n  var validChars = /[0-9A-z -\\/]*/;\n  if (!validChars.test(sci1) || !validChars.test(sci2)) {\n    return false;\n  }\n\n  if (typeof sci1 === 'undefined' || sci1 === null) {\n    sci1 = '';\n  }\n  if (typeof sci2 === 'undefined' || sci2 === null) {\n    sci2 = '';\n  }\n\n  if (sci1 === sci2) {\n    return true;\n  }\n\n  if (sci1.length === 0) {\n    return false;\n  } else if (sci2.length === 0) {\n    return true;\n  }\n\n  var scis1 = explodeScis(sci1.split('\\/'));\n  var scis2 = explodeScis(sci2.split('\\/'));\n\n  return scis2.every(function (val) {\n    return scis1.indexOf(val) >= 0;\n  });\n};\n\nfunction explodeScis(scis) {\n  var explodedScis = [];\n\n  var reducedScis = scis.filter(function (val) {\n    var sciLabelAndCompartments = headTail(val, '-');\n    if (sciLabelAndCompartments.tail.length > 0) {\n      explodedScis.push(sciLabelAndCompartments.head);\n      sciLabelAndCompartments.tail.forEach(function (compartment) {\n        var compLabelAndSubs = headTail(compartment, ' ');\n        explodedScis.push(sciLabelAndCompartments.head + '-' + compLabelAndSubs.head);\n        compLabelAndSubs.tail.forEach(function (sub) {\n          if (compLabelAndSubs.tail.length > 0) {\n            explodedScis.push(sciLabelAndCompartments.head + '-' + compLabelAndSubs.head + ' ' + sub);\n          }\n        });\n      });\n      return false;\n    }\n    return true;\n  });\n\n  explodedScis.forEach(function (sci) {\n    reducedScis.push(sci);\n  });\n\n  return reducedScis;\n};\n\nfunction headTail(value, separator) {\n  var headAndTail = {};\n  var splitArray = value.split(separator);\n  headAndTail.head = splitArray[0];\n  headAndTail.tail = splitArray.slice(1);\n  return headAndTail;\n};\n\nfunction scrapeOutNfRelto(dissemsArray) {\n  var finalDissems = [];\n  if (dissemsArray.indexOf(\"NOFORN\") > -1) {\n    finalDissems.push(\"NOFORN\");\n  } else {\n    var tempDissems = dissemsArray.filter(function (val) {\n      if (val.indexOf('REL TO') == 0) {\n        return true;\n      }\n      return false;\n    });\n    tempDissems.forEach(function (val) {\n      val.substring(7).split(',').forEach(function (release) {\n        finalDissems.push('REL TO ' + release.trim());\n      });\n    });\n  }\n\n  return finalDissems;\n};\n\n\nfunction reltoEqOrMoreSecureThan(nfreltoArray1, nfreltoArray2) {\n  var RELS = ['USA', 'AUS', 'CAN', 'GBR', 'NZL'];\n\n  if (nfreltoArray2.length === 0) {\n    return true;\n  }\n  if (nfreltoArray1.length === 0) {\n    return false;\n  }\n\n  if (nfreltoArray1.indexOf('NOFORN') > -1) {\n    return true;\n  }\n\n  if (nfreltoArray2.indexOf('NOFORN') > -1) {\n    return false;\n  }\n\n  if (nfreltoArray1.length <= nfreltoArray2.length) {\n    var filteredArray = nfreltoArray1.filter(function (val) {\n      return nfreltoArray2.indexOf(val) > -1;\n    });\n    if (filteredArray.length == nfreltoArray1.length) {\n      return true;\n    }\n  }\n\n  return false;\n};\n\n\nfunction dissemEqOrMoreSecureThan(dissemStr1, dissemStr2) {\n  var validChars = /[A-z -\\/]*/;\n\n  if (!validChars.test(dissemStr1) || !validChars.test(dissemStr2)) {\n    return false;\n  }\n\n  if (typeof dissemStr1 === 'undefined' || dissemStr1 === null) {\n    dissemStr1 = '';\n  }\n  if (typeof dissemStr2 === 'undefined' || dissemStr2 === null) {\n    dissemStr2 = '';\n  }\n  if (dissemStr1 === dissemStr2) {\n    return true;\n  }\n  if (dissemStr2 === '') {\n    return true;\n  }\n\n  var dissems1 = dissemStr1.split('\\/');\n  var dissems2 = dissemStr2.split('\\/');\n\n  var nfrelto1 = scrapeOutNfRelto(dissems1);\n  var nfrelto2 = scrapeOutNfRelto(dissems2);\n\n  if (nfrelto1.indexOf('NOFORN') > -1) {\n    return true;\n  }\n  if (nfrelto2.indexOf('NOFORN') > -1) {\n    return false;\n  }\n\n  if (!reltoEqOrMoreSecureThan(nfrelto1, nfrelto2)) {\n    return false;\n  }\n\n  return true;\n};\n\nmodule.exports = {\n  bannerEqOrMoreSecureThan: bannerEqOrMoreSecureThan,\n  classEqOrMoreSecureThan: classEqOrMoreSecureThan,\n  sciEqOrMoreSecureThan: sciEqOrMoreSecureThan,\n  explodeScis: explodeScis,\n  headTail: headTail,\n  scrapeOutNfRelto: scrapeOutNfRelto,\n  reltoEqOrMoreSecureThan: reltoEqOrMoreSecureThan,\n  dissemEqOrMoreSecureThan: dissemEqOrMoreSecureThan\n};\n"
       },
       "conflicts": {
        "map": "function(doc) {if (doc._conflicts) {emit(doc.last_updated, { winningRev: doc._rev, losingRevs: doc._conflicts } ) }}"
       }
      }
     }
    }
  ]
}
export default mdNodes
