import * as _Array from './Array'
import * as _Number from './Number'
import * as _String from './String'
import * as _Type from './Type'
import * as _Url from './Url'
import * as _Promise from './Promise'

const utils = {
  Array: _Array,
  Number: _Number,
  String: _String,
  Type: _Type,
  Url: _Url,
  Promise: _Promise
}

function install (Vue, opts = {}) {
  Vue.prototype[opts.alias || '$u'] = utils
}

export default {
  ...utils,
  install
}
