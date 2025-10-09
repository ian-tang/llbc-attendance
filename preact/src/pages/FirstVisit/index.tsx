import { useRef, useState } from 'preact/hooks'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { Checkbox } from '../../components/Checkbox'
import { Fieldset } from '../../components/Fieldset'
import { TextInput } from '../../components/TextInput'
import { ErrorMessage } from '../../components/ErrorMessage'
import { Modal } from '../../components/Modal'
import { validate } from '../../lib/validation'
import { LIABILITY_TEXT } from '../../legal/liability_waiver'
import { postNewVisitor } from '../../api'
import styles from './FirstVisit.module.css'

const REDIRECT = '../submitted'

interface FormState {
  'first-name': string
  'last-name': string
  email: string
  'visitor-role': {
    volunteer: boolean
    'get-assistance': boolean
    'purchase-parts-bikes': boolean
    'donate-parts-bikes': boolean
  }
  liability: boolean
  newsletter: boolean
  'photo-release': boolean
}

interface ErrorMessageState {
  'first-name': string
  'last-name': string
  email: string
  'visitor-role': string
  liability: string
}

export const FirstVisit = () => {
  const [formState, setFormState] = useState<FormState>({
    'first-name': '',
    'last-name': '',
    email: '',
    'visitor-role': {
      volunteer: false,
      'get-assistance': false,
      'purchase-parts-bikes': false,
      'donate-parts-bikes': false,
    },
    liability: false,
    newsletter: false,
    'photo-release': false,
  })

  const [errMsgState, setErrMsgState] = useState<ErrorMessageState>({
    'first-name': '',
    'last-name': '',
    email: '',
    'visitor-role': '',
    liability: '',
  })

  const handleChange = (e: InputEvent) => {
    const el = e.target as HTMLInputElement
    // probably not actually type safe
    if (el.name === 'visitor-role') {
      formState[el.name][el.value] = el.checked
    } else {
      formState[el.name] = el.type === 'checkbox' ? el.checked : el.value
    }

    if (validate[el.name]) {
      const errMsg = validate[el.name](el.value)
      if (errMsg === '') {
        errMsgState[el.name] = errMsg
        setErrMsgState({ ...errMsgState })
      }
    }
    setFormState({ ...formState })
  }

  const handleBlur = (e: FocusEvent) => {
    const el = e.target as HTMLInputElement
    if (validate[el.name]) {
      const errMsg = validate[el.name](el.value)
      errMsgState[el.name] = errMsg
      setErrMsgState({ ...errMsgState })
    }
  }

  const handleSubmit = async (e: SubmitEvent) => {
    e.preventDefault()
    // show all error messages
    for (const field of Object.keys(errMsgState)) {
      errMsgState[field] = validate[field] && validate[field](formState[field])
    }
    // scroll first errored field into view
    setErrMsgState({ ...errMsgState })
    for (const [k, v] of Object.entries(errMsgState)) {
      if (v !== '') {
        document
          .getElementById(k)
          .scrollIntoView({ behavior: 'smooth', block: 'center' })
        return
      }
    }

    const res = await postNewVisitor(formState)
    if (!res.ok) return
    window.location.href = REDIRECT
  }

  const modalRef = useRef(null)

  return (
    <div className="page">
      <Modal
        dialogRef={modalRef}
        style={{
          minWidth: '280px',
          maxWidth: '50rem',
          width: '80vw',
        }}
        modalTitle="Liability Waiver for Lefty Loosey Bicycle Collective"
        closeModal={() => modalRef.current && modalRef.current.close()}
      >
        <LIABILITY_TEXT />
        <Checkbox
          style={{ marginTop: '1rem' }}
          name="liability"
          checked={formState.liability}
          onInput={handleChange}
        >
          By checking this box, I certify that I have read, understand, and
          agree to the terms above.
        </Checkbox>
      </Modal>

      <Card style={{ maxWidth: '40rem' }}>
        <form className="form" onSubmit={handleSubmit}>
          <h2>Check in by entering your information</h2>

          <Fieldset heading="Personal Info">
            <div className={styles.personal}>
              <div className={styles['first-name']}>
                <TextInput
                  inputId="first-name"
                  label="First name"
                  name="first-name"
                  onInput={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  htmlFor="first-name"
                  message={errMsgState['first-name']}
                />
              </div>
              <div className={styles['last-name']}>
                <TextInput
                  inputId="last-name"
                  label="Last name"
                  name="last-name"
                  onInput={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  htmlFor="last-name"
                  message={errMsgState['last-name']}
                />
              </div>
              <div className={styles['email']}>
                <TextInput
                  inputId="email"
                  label="Email address"
                  name="email"
                  onInput={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage htmlFor="email" message={errMsgState.email} />
              </div>
            </div>
          </Fieldset>

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
              value="purchase-parts-bikes"
            >
              Buy a bike or bike parts
            </Checkbox>
            <Checkbox
              onInput={handleChange}
              name="visitor-role"
              value="donate-parts-bikes"
            >
              Donate a bike or bike parts
            </Checkbox>
            <ErrorMessage
              style={{ marginLeft: '1.7rem' }}
              message={errMsgState['visitor-role']}
            />
          </Fieldset>

          <Fieldset
            id="liability"
            heading="Liability Waiver"
            legend="Please read and agree to the terms:"
          >
            <Checkbox
              name="liability"
              onInput={handleChange}
              checked={formState.liability}
            >
              <p>
                By checking this box, I certify that I have read, understand,
                and agree to the terms of Lefty Loosey Bike Collective's{' '}
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    modalRef.current && modalRef.current.showModal()
                  }}
                  className={styles['liability-link']}
                  type="button"
                >
                  {' '}
                  Liability Waiver
                </button>
                .
              </p>
            </Checkbox>
            <ErrorMessage
              style={{ marginLeft: '1.7rem' }}
              message={errMsgState.liability}
            />
          </Fieldset>

          <Fieldset
            onInput={handleChange}
            heading="Newsletter"
            legend="Would you like to sign up for our newsletter with your email from above?"
          >
            <Checkbox name="newsletter" onInput={handleChange}>
              Yes, I'd like to receive email newsletter updates (usually
              quarterly).
            </Checkbox>
          </Fieldset>

          <Fieldset
            heading="Photo Release"
            legend="Would you be okay with your photos being used in public media (such as Instagram)?"
          >
            <Checkbox name="photo-release" onInput={handleChange}>
              Yes, I grant permission to Lefty Loosey Bike Collective to use
              videos or photographs of me for educational purposes in accordance
              with the Photo Release.
            </Checkbox>
          </Fieldset>

          <Button style={{ marginTop: '1rem', width: '10rem' }} type="submit">
            Submit
          </Button>
        </form>
      </Card>
    </div>
  )
}
