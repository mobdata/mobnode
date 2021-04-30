/* eslint-disable */
const pastScripts = [
  {
    "_id": "default",
    "_rev": "87-10a0efee0fb4cd535c5d088a3edc1587",
    "script": "libraries = [\"001\", \"002\"],\nsend \"books\" to libraries,\nsend \"movies\" to libraries",
    "message": "2018-02-16T20:00:55.189Z"
  },
  {
    "_id": "default",
    "_rev": "86-b4b70484d82d33d8bfcaa5ee3e4cfa07",
    "script": "libraries = [\"001\", \"002\"],\nsend \"books\" to libraries,\nsend \"movies\" to libraries if source:name is \"Jurassic Park\"",
    "message": "2018-02-16T15:09:40.181Z"
  },
]
export default pastScripts
