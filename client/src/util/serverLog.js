import callApi from './apiCaller'
import isSet from './isSet'

export default (urgency, customText, errorText, stack) => {
  const typeCheck =    isSet(urgency) && typeof urgency === 'number'
    && isSet(customText) && typeof customText === 'string'
    && isSet(errorText) && typeof errorText === 'string'
    && isSet(stack) && typeof stack === 'string'
  if (!typeCheck) {
    // eslint-disable-next-line no-console
    console.error('Type check failed during call to server log.')
    return
  }
  const date = new Date()
  const day = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
  const secondsWithMilli = date.getSeconds() + (date.getMilliseconds() / 1000)
  const time = `${date.getHours()}:${date.getMinutes()}:${secondsWithMilli}`
  const timeStamp = `[${day}][${time}]`
  const meta = `[CLIENT][lv${urgency}]${timeStamp}`
  const text = `${customText}: ${errorText}`
  callApi('clientError', 'post', { meta, text, stack })
}
