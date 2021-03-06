import Loader from '@sushiswap/ui/loader/Loader'
import { Typography } from '@sushiswap/ui/typography/Typography'
import React, { ReactNode } from 'react'
import { toast, ToastOptions } from 'react-toastify'

const options: ToastOptions = {
  position: 'top-right',
  autoClose: 5000,
  hideProgressBar: true,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  progress: undefined,
  closeButton: false,
  icon: false,
}

type CreateToastPayload = { title: React.ReactNode; description: React.ReactNode; promise?: Promise<any> }
type CreateToast = (x: CreateToastPayload) => void

const content = (title: ReactNode, description: ReactNode) => {
  return (
    <div className="flex flex-col gap-2">
      <Typography variant="sm" weight={700} className="text-slate-200">
        {title}
      </Typography>
      <Typography variant="xs" weight={500}>
        {description}
      </Typography>
    </div>
  )
}

export const createToast: CreateToast = ({ title, description, promise }) => {
  if (!promise) {
    return toast(content(title, description), options)
  }

  return toast.promise(promise, {
    pending: {
      ...options,
      render() {
        return content(title, <Loader size="16" />)
      },
    },
    success: {
      ...options,
      render() {
        return content(title, description)
      },
    },
    error: {
      ...options,
      render() {
        return content(title, 'Oops! Transaction failed...')
      },
    },
  })
}
