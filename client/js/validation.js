/**
 * Object returned by a validation method
 * @typedef {object} ValidationResponse
 * @property {boolean} valid
 * @property {string} message
 */

/** @type {ValidationResponse} */
const VALID_ENTRY = {
  valid: true,
  message: '',
}

const VISITOR_ROLES = new Set([
  'volunteer',
  'get-assistance',
  'purchase-parts-bikes',
  'donate-parts-bikes',
])

/**
 * An object containing properties which map to validation methods
 * for each input field on the form
 */
const validationMethods = {
  /**
   * @param {string} value First name
   */
  'first-name': (value) => {
    if (!value.length)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[0-9]/) > -1)
      return {
        valid: false,
        message: 'Name cannot contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {string} value Last name
   */
  'last-name': (value) => {
    if (!value.length)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[0-9]/) > -1)
      return {
        valid: false,
        message: 'Name cannot contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {string} value A string value representing a phone number
   */
  'phone-number': (value) => {
    if (value.length === 0)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.search(/[\D]/) > -1)
      return {
        valid: false,
        message: 'Phone number can only contain numbers',
      }

    return VALID_ENTRY
  },

  /**
   * @param {boolean} value If the liability waiver checkbox is checked
   */
  'liability-waiver': (value) => {
    if (value !== true)
      return {
        valid: false,
        message: 'Liability waiver is required',
      }

    return VALID_ENTRY
  },

  /**
   * @param {Array.<string>} roles An array of visitor roles that are checked
   */
  'visitor-role': (roles) => {
    if (roles.length === 0)
      return {
        valid: false,
        message: 'Select at least 1 role',
      }

    for (const role of roles) {
      if (!VISITOR_ROLES.has(role)) {
        return {
          valid: false,
          message: 'Contains invalid visitor role',
        }
      }
    }

    return VALID_ENTRY
  },

  /**
   * @param {boolean} value If the photo release checkbox is checked
   */
  'photo-release': (value) => {
    if (typeof value !== 'boolean')
      return {
        valid: false,
        message: 'Value must be either true or false',
      }

    return VALID_ENTRY
  },
}

export default validationMethods
