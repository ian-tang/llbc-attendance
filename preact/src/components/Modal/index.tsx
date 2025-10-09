import { JSX } from 'preact/jsx-runtime'
import styles from './Modal.module.css'
import { MutableRef } from 'preact/hooks'

interface ModalProps extends JSX.DialogHTMLAttributes<HTMLDialogElement> {
  modalTitle: string
  dialogRef: MutableRef<HTMLDialogElement | null>
  closeModal: () => void
}
export const Modal = ({
  children,
  modalTitle,
  dialogRef,
  closeModal,
  ...props
}: ModalProps) => {
  const closeBtnOnClick = (event: MouseEvent) => {
    if (event.type === 'click') closeModal()
  }

  return (
    <dialog className={styles.modal} ref={dialogRef} {...props}>
      <header>
        <h3>{modalTitle}</h3>
        <button
          type="button"
          onClick={closeBtnOnClick}
          className={styles['close-btn']}
          name="close-modal"
        />
      </header>
      <hr />
      {children}
    </dialog>
  )
}
