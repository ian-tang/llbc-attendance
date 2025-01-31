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

/**
 * Object with fields of valid visitor roles
 * @typedef {object} VisitorRoles
 * @property {boolean} volunteer
 * @property {boolean} get-assistance
 * @property {boolean} purchase-parts-bikes
 * @property {boolean} donate-parts-bikes
 */

const VISITOR_ROLES = new Set([
  'volunteer',
  'get-assistance',
  'purchase-parts-bikes',
  'donate-parts-bikes',
])

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

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
   * @param {string} value A string value representing a email
   */
  email: (value) => {
    if (value.length === 0)
      return {
        valid: false,
        message: 'This field is required',
      }
    if (value.match(emailRegex) === null)
      return {
        valid: false,
        message: 'Email is invalid',
      }

    return VALID_ENTRY
  },

  /**
   * @param {boolean} value If the newsletter checkbox is checked
   */
  newsletter: (value) => {
    if (typeof value !== 'boolean')
      return {
        valid: false,
        message: 'Value must be either true or false',
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
   * @param {VisitorRoles} roles An object of visitor roles fields that are checked
   */
  'visitor-role': (roles) => {
    const selectedRoles = Object.entries(roles)
    const hasSelection = selectedRoles.some(([_, v]) => v === true)
    if (!hasSelection)
      return {
        valid: false,
        message: 'Select at least 1 role',
      }

    for (const [k, _] of selectedRoles) {
      if (!VISITOR_ROLES.has(k)) {
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
