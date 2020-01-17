import React, { useState } from 'react'
import { FileUpload } from '../components/shared/file-upload'

const URL =
  'http://storage-upload.googleapis.com/upload-file-test/1570043487646.JPEG'

const CompanyLogo = () => {
  const [req, setReq] = useState(new XMLHttpRequest())
  const [logoUrl, setLogoUrl] = useState('')
  const [uploadProgress, setUploadProgress] = useState({
    state: 'ready',
    percent: 0
  })

  const abortUpload = () => {
    req.abort()
    setUploadProgress({
      state: 'ready',
      percent: 0
    })
  }

  const uploadFile = (file: File, arrayBuffer: string | ArrayBuffer | null) => {
    return new Promise((resolve, reject) => {
      req.upload.addEventListener('progress', (evt) => {
        if (evt.lengthComputable) {
          setUploadProgress({
            state: 'pending',
            percent: (evt.loaded / evt.total) * 100
          })
        }
      })

      req.upload.addEventListener('load', () => {
        setUploadProgress({
          state: 'done',
          percent: 100
        })
        resolve(req.response)
      })

      req.upload.addEventListener('error', () => {
        setUploadProgress({
          state: 'error',
          percent: 0
        })
        reject(req.response)
      })

      req.upload.addEventListener('loadend', () => {
        setReq(new XMLHttpRequest())
      })

      req.upload.addEventListener('onload', () => {
        if (req.readyState === req.DONE) {
          if (req.status === 200) {
            const res = req.response
            setLogoUrl(res['logo_url'])
          }
        }
      })

      const formData = new FormData();
      formData.append("file", file, file.name);

      req.open('POST', URL)
      req.send(formData);
    //   req.send(arrayBuffer)
    })
  }
  return (
    <FileUpload
      onChange={uploadFile}
      value={logoUrl}
      status={uploadProgress.state}
      percent={uploadProgress.percent}
      abortUpload={abortUpload}
    />
  )
}

export default CompanyLogo
