import callApi from 'util/apiCaller'
import { openDialog, closeDialog } from 'components/AppDialog'

export const SET_SCRIPT = 'SET_SCRIPT'
export const ON_ERROR = 'ON_ERROR'
export const FETCH_SCRIPT_ATTEMPT = 'FETCH_SCRIPT_ATTEMPT'
export const FETCH_SCRIPT_SUCCESS = 'FETCH_SCRIPT_SUCCESS'
export const FETCH_SCRIPT_FAILURE = 'FETCH_SCRIPT_FAILURE'
export const FETCH_DBS_ATTEMPT = 'FETCH_DBS_ATTEMPT'
export const FETCH_DBS_SUCCESS = 'FETCH_DBS_SUCCESS'
export const FETCH_DBS_FAILURE = 'FETCH_DBS_FAILURE'
export const FETCH_HOME_ATTEMPT = 'FETCH_HOME_ATTEMPT'
export const FETCH_HOME_SUCCESS = 'FETCH_HOME_SUCCESS'
export const FETCH_HOME_FAILURE = 'FETCH_HOME_FAILURE'
export const PUSH_RULES_ATTEMPT = 'PUSH_RULES_ATTEMPT'
export const PUSH_RULES_SUCCESS = 'PUSH_RULES_SUCCESS'
export const PUSH_RULES_FAILURE = 'PUSH_RULES_FAILURE'
export const PUSH_SCRIPT_ATTEMPT = 'PUSH_SCRIPT_ATTEMPT'
export const PUSH_SCRIPT_SUCCESS = 'PUSH_SCRIPT_SUCCESS'
export const PUSH_SCRIPT_FAILURE = 'PUSH_SCRIPT_FAILURE'

// Synchronous actions
export const setScript = (script, parsedScript) => ({
  type: SET_SCRIPT,
  script,
  parsedScript,
})

export const onError = (script) => ({
  type: ON_ERROR,
  script,
})

export const fetchScriptAttempt = () => ({
  type: FETCH_SCRIPT_ATTEMPT,
})

export const fetchScriptSuccess = (script) => ({
  type: FETCH_SCRIPT_SUCCESS,
  script,
})

export const fetchScriptFailure = (stat, func, msg) => ({
  type: FETCH_SCRIPT_FAILURE,
  errorHandler: {
    status: stat,
    function: func,
    message: msg,
  },
})

export const fetchDbsAttempt = () => ({
  type: FETCH_DBS_ATTEMPT,
})

export const fetchDbsSuccess = (dbs) => ({
  type: FETCH_DBS_SUCCESS,
  dbs,
})

export const fetchDbsFailure = (stat, func, msg) => ({
  type: FETCH_DBS_FAILURE,
  errorHandler: {
    status: stat,
    function: func,
    message: msg,
  },
})

export const fetchHomeAttempt = () => ({
  type: FETCH_HOME_ATTEMPT,
})

export const fetchHomeSuccess = (home) => ({
  type: FETCH_HOME_SUCCESS,
  home,
})

export const fetchHomeFailure = (stat, func, msg) => ({
  type: FETCH_HOME_FAILURE,
  errorHandler: {
    status: stat,
    function: func,
    message: msg,
  },
})

export const pushRulesAttempt = () => ({
  type: PUSH_RULES_ATTEMPT,
})

export const pushRulesSuccess = () => ({
  type: PUSH_RULES_SUCCESS,
})

export const pushRulesFailure = (stat, func, msg) => ({
  type: PUSH_RULES_FAILURE,
  errorHandler: {
    status: stat,
    function: func,
    message: msg,
  },
})

export const pushScriptAttempt = () => ({
  type: PUSH_SCRIPT_ATTEMPT,
})

export const pushScriptSuccess = () => ({
  type: PUSH_SCRIPT_SUCCESS,
})

export const pushScriptFailure = (stat, func, msg) => ({
  type: PUSH_SCRIPT_FAILURE,
  errorHandler: {
    status: stat,
    function: func,
    message: msg,
  },
})

// Asynchronous actions
export const fetchScript = () => async (dispatch) => {
  dispatch(fetchScriptAttempt())
  const res = await callApi('rules/script')
  if (res.status !== 200) {
    return dispatch(fetchScriptFailure(res.status, 'fetchScript', 'Unable to fetch scripts'))
  }
  const script = await res.json()
  return dispatch(fetchScriptSuccess(script))
}

export const fetchDbs = () => async (dispatch) => {
  dispatch(fetchDbsAttempt())
  const res = await callApi('dbs')
  if (res.status !== 200) {
    return dispatch(fetchDbsFailure(res.status, 'fetchDbs', 'Unable to fetch databases'))
  }
  const dbs = await res.json()
  return dispatch(fetchDbsSuccess(dbs.dbs))
}

export const fetchHome = () => async (dispatch) => {
  dispatch(fetchHomeAttempt())
  const res = await callApi('dbs/home')
  if (res.status !== 200) {
    return dispatch(fetchHomeFailure(res.status, 'fetchHome', `Unable to fetch home: ${res.message}`))
  }
  const json = await res.json()
  return dispatch(fetchHomeSuccess(json.name))
}

export const pushRules = (rules, script) => async (dispatch) => {
  dispatch(pushRulesAttempt())
  const rulesRes = await callApi('rules', 'post', rules)
  const rulesResTxt = await rulesRes.json()
  if (rulesRes.status !== 200) {
    // note that rulesResTxt is an array right now for testing returned values
    return dispatch(pushRulesFailure(rulesRes.status, 'pushRules', rulesResTxt.message))
  }
  // skip script update if no message is passed
  if (script.message) {
    dispatch(pushScriptAttempt());
    const scriptRes = await callApi('rules/script', 'post', script)
    const scriptResTxt = await scriptRes.json()
    if (scriptResTxt === undefined || scriptResTxt.message === undefined) {
      scriptResTxt.message = 'No error message found.'
    }
    if (scriptRes.status !== 201) {
      dispatch(pushScriptFailure(scriptRes.status, 'pushRules', scriptResTxt.message));
      dispatch(openDialog(
        'Error Updating Script',
        'The server responded with the following error:',
        [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
        [scriptResTxt.message],
      ))
      return dispatch(pushRulesFailure(scriptRes.status, 'pushRules', scriptResTxt.message))
    }
    dispatch(pushScriptSuccess());
    await dispatch(fetchScript());
  }
  dispatch(openDialog(
    'Success!',
    'Rules updated successfully.',
    [{ label: 'Close', action: () => dispatch(closeDialog()), focused: true }],
    [],
  ))

  return dispatch(pushRulesSuccess())
}
