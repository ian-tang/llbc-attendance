import { useState } from 'preact/hooks'
import { Card } from '../../components/Card'
import { TextInput } from '../../components/TextInput'
import { Fieldset } from '../../components/Fieldset'
import { Checkbox } from '../../components/Checkbox'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Button } from '../../components/Button'
import { validate } from '../../lib/validation'
import styles from './Returning.module.css'
import { ActionNetworkAttendanceSubmission, postAttendance } from '../../api'

const REDIRECT = '../submitted'

type FormState = {
  email: string
  'visitor-role': Set<string>
}

function formatForActionNetwork(
  formData: FormState,
): ActionNetworkAttendanceSubmission {
  const tagMap = {
    volunteer: 'volunteer',
    'get-assistance': 'client',
    'donate-parts-bikes': 'bike_parts_donor',
  }

  const formatted: ActionNetworkAttendanceSubmission = {
    person: {
      email_addresses: [
        {
          address: formData.email,
        },
      ],
    },
    add_tags: [],
  }

  formData['visitor-role'].forEach((v) => formatted.add_tags.push(tagMap[v]))

  return formatted
}

export const Returning = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    'visitor-role': new Set(),
  })
  const [emailError, setEmailError] = useState('')
  const [roleError, setRoleError] = useState('')

  const handleChange = (e: InputEvent) => {
    const el = e.target as HTMLInputElement
    if (el.name === 'visitor-role') {
      el.checked
        ? formState['visitor-role'].add(el.value)
        : formState['visitor-role'].delete(el.value)
    } else {
      formState.email = el.value
    }

    const errMsg = validate[el.name](el.value)
    if (errMsg === '') {
      el.name === 'email' ? setEmailError(errMsg) : setRoleError(errMsg)
    }

    setFormState({ ...formState })
  }

  const handleBlur = (e: FocusEvent) => {
    const errMsg = validate.email((e.target as HTMLInputElement).value)
    setEmailError(errMsg)
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    const emailErrMsg = validate.email(formState.email)
    const roleErrMsg = validate['visitor-role'](formState['visitor-role'])
    setEmailError(emailErrMsg)
    setRoleError(roleErrMsg)
    if (emailErrMsg || roleErrMsg) return

    const res = await postAttendance(formatForActionNetwork(formState))

    window.location.href = REDIRECT
  }

  return (
    <Card
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '70vw',
        minWidth: 'calc(320px - 1rem)',
        maxWidth: '30rem',
        margin: '2rem 0.5rem auto 0.5rem',
      }}
    >
      <form className="form" onSubmit={handleSubmit}>
        <h2>Sign in using your email</h2>

        <section className={styles.email}>
          <TextInput
            inputId="email"
            label="Email address"
            name="email"
            onInput={handleChange}
            onBlur={handleBlur}
          />
          <ErrorMessage htmlFor="email" message={emailError} />
        </section>

        <Fieldset
          id="visitor-role"
          heading="What brings you in today?"
          legend="I am here to:"
        >
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="volunteer"
          >
            Volunteer my time and help out
          </Checkbox>
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="get-assistance"
          >
            Get assistance with repairing my bike
          </Checkbox>
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="donate-parts-bikes"
          >
            Donate a bike or bike parts
          </Checkbox>
          <ErrorMessage style={{ marginLeft: '1.7rem' }} message={roleError} />
        </Fieldset>

        <Button style={{ marginTop: '1rem', width: '10rem' }} type="submit">
          Submit
        </Button>
      </form>
    </Card>
  )
}
