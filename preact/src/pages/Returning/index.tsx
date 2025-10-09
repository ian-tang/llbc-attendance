import { useState } from 'preact/hooks'
import { Card } from '../../components/Card'
import { TextInput } from '../../components/TextInput'
import { Fieldset } from '../../components/Fieldset'
import { Checkbox } from '../../components/Checkbox'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Button } from '../../components/Button'
import { validate } from '../../lib/validation'
import styles from './Returning.module.css'
import { postResponse } from '../../api'

const REDIRECT = '../submitted'

interface FormState {
  email: string
  'visitor-role': {
    volunteer: boolean
    'get-assistance': boolean
    'purchase-parts-bikes': boolean
    'donate-parts-bikes': boolean
  }
}

export const Returning = () => {
  const [formState, setFormState] = useState<FormState>({
    email: '',
    'visitor-role': {
      volunteer: false,
      'get-assistance': false,
      'purchase-parts-bikes': false,
      'donate-parts-bikes': false,
    },
  })
  const [emailError, setEmailError] = useState('')
  const [roleError, setRoleError] = useState('')

  const handleChange = (e: InputEvent) => {
    const el = e.target as HTMLInputElement
    if (el.name === 'visitor-role') {
      formState['visitor-role'][el.value] = el.checked
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
    setEmailError(validate.email(formState.email))
    setRoleError(validate['visitor-role'](formState['visitor-role']))
    const res = await postResponse(formState)
    if (res.status === 409) {
      setEmailError('This email has not signed in before.')
      return
    }

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
            value="role-volunteer"
          >
            Volunteer my time and help out
          </Checkbox>
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="role-get-assistance"
          >
            Get assistance with repairing my bike
          </Checkbox>
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="role-purchase"
          >
            Buy a bike or bike parts
          </Checkbox>
          <Checkbox
            onInput={handleChange}
            name="visitor-role"
            value="role-donate"
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
