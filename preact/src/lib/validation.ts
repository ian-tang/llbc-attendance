const emailRegex =
  /^(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])$/

const nameRegex = /^\p{Script=Latin}([ -]?\p{Script=Latin})*$/u

const validateName = (name: string) => {
  if (name === '') return 'Name is required'
  if (!nameRegex.test(name)) return 'Only letters are allowed in name fields'
  return ''
}

const validateEmail = (email: string) => {
  if (email === '') return 'Email is required'
  if (!emailRegex.test(email)) return 'Email is invalid'
  return ''
}

const validateVisitorRole = (roles: Set<string>) => {
  if (roles.size === 0) return 'Please select a role'
  return ''
}

const validateLiability = (liability: boolean) => {
  if (!liability) return 'Liability waiver is required'
  return ''
}

export const validate = {
  'first-name': validateName,
  'last-name': validateName,
  email: validateEmail,
  'visitor-role': validateVisitorRole,
  liability: validateLiability,
}
