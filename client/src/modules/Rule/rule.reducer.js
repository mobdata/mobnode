import {
  SET_SCRIPT,
  ON_ERROR,
  FETCH_SCRIPT_ATTEMPT,
  FETCH_SCRIPT_SUCCESS,
  FETCH_SCRIPT_FAILURE,
  FETCH_DBS_ATTEMPT,
  FETCH_DBS_SUCCESS,
  FETCH_DBS_FAILURE,
  FETCH_HOME_ATTEMPT,
  FETCH_HOME_SUCCESS,
  FETCH_HOME_FAILURE,
  PUSH_RULES_ATTEMPT,
  PUSH_RULES_SUCCESS,
  PUSH_RULES_FAILURE,
  PUSH_SCRIPT_ATTEMPT,
  PUSH_SCRIPT_SUCCESS,
  PUSH_SCRIPT_FAILURE,
} from 'modules/Rule'

const initialState = {
  script: {},
  parsedScript: {},
  loading: {
    script: false,
    dbs: false,
    home: false,
    pushRules: false,
  },
  failure: {
    pushRules: false,
  },
  error: false,
  dbs: [],
  home: '',
  errorHandler: {
    status: -1,
    function: '',
    message: '',
  },
  showErrorHandler: false,
}

const RuleReducer = (state = initialState, action) => {
  const { type } = action
  switch (type) {
  case SET_SCRIPT:
    return {
      ...state,
      script: {
        ...state.script,
        data: action.script,
      },
      parsedScript: action.parsedScript,
      error: false,
    }
  case ON_ERROR:
    return {
      ...state,
      script: {
        ...state.script,
        data: action.script,
      },
      error: true,
    }
  case FETCH_SCRIPT_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        script: true,
      },
    }
  case FETCH_SCRIPT_SUCCESS:
    return {
      ...state,
      script: {
        ...action.script,
        data: action.script.script,
      },
      loading: {
        ...state.loading,
        script: false,
      },
    }
  case FETCH_SCRIPT_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        script: false,
      },
      errorHandler: {
        status: action.errorHandler.status,
        function: action.errorHandler.function,
        message: action.errorHandler.message,
      },
      showErrorHandler: true,
    }
  case FETCH_DBS_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        dbs: true,
      },
    }
  case FETCH_DBS_SUCCESS:
    return {
      ...state,
      dbs: action.dbs,
      loading: {
        ...state.loading,
        dbs: false,
      },
    }
  case FETCH_DBS_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        dbs: false,
      },
      errorHandler: {
        status: action.errorHandler.status,
        function: action.errorHandler.function,
        message: action.errorHandler.message,
      },
      showErrorHandler: true,
    }
  case FETCH_HOME_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        home: true,
      },
    }
  case FETCH_HOME_SUCCESS:
    return {
      ...state,
      home: action.home,
      loading: {
        ...state.loading,
        home: false,
      },
    }
  case FETCH_HOME_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        home: false,
      },
      errorHandler: {
        status: action.errorHandler.status,
        function: action.errorHandler.function,
        message: action.errorHandler.message,
      },
      showErrorHandler: true,
    }
  case PUSH_SCRIPT_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushScript: true,
      },
    }
  case PUSH_SCRIPT_SUCCESS:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushScript: false,
      },
      failure: {
        ...state.failure,
        pushScript: false,
      },
    }
  case PUSH_SCRIPT_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushScript: false,
      },
      failure: {
        ...state.failure,
        pushScript: true
      },
      errorHandler: {
        status: action.errorHandler.status,
        function: action.errorHandler.function,
        message: action.errorHandler.message,
      },
      showErrorHandler: true,
    }
  case PUSH_RULES_ATTEMPT:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushRules: true,
      },
    }
  case PUSH_RULES_SUCCESS:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushRules: false,
      },
      failure: {
        ...state.failure,
        pushRules: false,
      },
    }
  case PUSH_RULES_FAILURE:
    return {
      ...state,
      loading: {
        ...state.loading,
        pushRules: false,
      },
      failure: {
        ...state.failure,
        pushRules: true,
      },
      errorHandler: {
        status: action.errorHandler.status,
        function: action.errorHandler.function,
        message: action.errorHandler.message,
      },
      showErrorHandler: true,
    }
  default:
    return state
  }
}

export const getScript = (state) => state.rule.script
export const getParsedScript = (state) => state.rule.parsedScript
export const getDbs = (state) => state.rule.dbs
export const getHome = (state) => state.rule.home
export const getPushRulesLoading = (state) => state.rule.loading.pushRules
export const getScriptLoading = (state) => state.rule.loading.script
export const getErrorHandler = (state) => state.rule.errorHandler
export const getShowErrorHandler = (state) => state.rule.showErrorHandler

export default RuleReducer
