import React, { useState, ChangeEvent, DragEvent, RefObject } from 'react'
import styled from 'styled-components'

import { Colors } from '../../lib/style-guide'
import { randomClassName } from '../../lib/rcn'

const rcn = randomClassName()

interface FileUploadProps {
  value: string
  onChange(file: File, binary: string | ArrayBuffer | null): void
  status: string
  percent: number
  abortUpload(): void
  className?: string
}

/**
 * component for upload file
 *
 * @param {string} value
 * @param {Function} onChange
 * @param {string} status
 * @param {number} percent
 * @param {Function} abortUpload
 * @param {string} className
 */
const FileUpload = (props: FileUploadProps) => {
  const [errorState, setErrorState] = useState('')
  const [fileUrl, setfileUrl] = useState('')
  const [highlight, sethighlight] = useState(false)
  const fileInputRef: RefObject<HTMLInputElement> = React.createRef<
    HTMLInputElement
  >()

  const openFileDialog = () => {
    if (!fileInputRef.current) return
    fileInputRef.current.click()
  }

  const onDragOver = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault()
    sethighlight(true)
  }

  const onDragLeave = () => {
    sethighlight(false)
  }

  const onDrop = (evt: DragEvent<HTMLDivElement>) => {
    evt.preventDefault()

    const file = evt.dataTransfer.files[0]
    getFileFromInput(file)
      .then((arrayBuffer) => {
        setfileUrl(file && URL.createObjectURL(file))
        props.onChange(file, arrayBuffer)
      })
      .catch((reason: Error) => {
        console.log(`Error during upload ${reason}`)
        setErrorState("Can't load file")
      })
    sethighlight(false)
  }

  const getFileFromInput = (
    file: File
  ): Promise<string | ArrayBuffer | null> => {
    return new Promise(function(resolve, reject) {
      const reader = new FileReader()
      reader.onerror = reject
      reader.onload = function() {
        resolve(reader.result)
      }
      reader.readAsArrayBuffer(file)
    })
  }

  const onFileAdded = (evt: ChangeEvent<HTMLInputElement>) => {
    const event = evt
    setErrorState('')
    if (event.target === null || event.target.files === null) {
      setErrorState("Can't send file")
      return
    }

    const file = event.target.files[0]
    if (file == null) {
      setErrorState("Can't find file")
      return
    }

    getFileFromInput(file)
      .then((arrayBuffer) => {
        setfileUrl(file && URL.createObjectURL(file))
        props.onChange(file, arrayBuffer)
      })
      .catch((reason: Error) => {
        console.log(`Error during upload ${reason}`)
        setErrorState("Can't load file")
      })
  }

  const radius = 39.5
  const dashArray = radius * Math.PI * 2
  const dashOffset = dashArray - (dashArray * props.percent) / 100

  return (
    <div className={props.className}>
      <div className={'upload-header'}>
        <div className={'header-title header-text'}>Company Logo</div>
        <div className={'header-description header-text'}>
          Logo should be square, 100px size and in png, jpeg file format.
        </div>
      </div>
      <div className={'upload-content'}>
        <div
          className={`content-dropzone ${highlight ? 'content-highlight' : ''}`}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <input
            ref={fileInputRef}
            className="content-fileinput"
            type="file"
            onChange={onFileAdded}
            accept={'.jpg, .jpeg, .png'}
          />
          <svg
            className={'content-icon'}
            width="80"
            height="80"
            viewBox={'0 0 80 80'}
          >
            <circle
              className={'circle-background'}
              cx="40"
              cy="40"
              r={radius}
              strokeWidth="1px"
            />
            <circle
              className="circle-progress"
              cx="40"
              cy="40"
              r={radius}
              strokeWidth="1px"
              transform={'rotate(-90 40 40)'}
              style={{
                strokeDasharray: dashArray,
                strokeDashoffset: dashOffset
              }}
            />
            {props.status === 'done' ? (
              <image
                className={'content-logo'}
                href={props.value !== '' ? props.value : fileUrl}
                height="80"
                width="80"
              />
            ) : (
              <svg
                className={'content-icon-alt'}
                width="29.63"
                height="45.93"
                viewBox="0 0 32 48"
                x="24.69"
                y="18.23"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M28.072 1.87489C29.3858 1.3494 30.8148 2.31692 30.8148 3.73184V46.7037H1.18518V13.9837C1.18518 13.1659 1.68308 12.4305 2.4424 12.1267L28.072 1.87489Z"
                  stroke="#D1E3F8"
                />
                <rect
                  x="7.11108"
                  y="17.0745"
                  width="7.40741"
                  height="8.88889"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="17.0745"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="11.1486"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
                <path
                  d="M7.11108 29.9264C7.11108 29.3741 7.5588 28.9264 8.11108 28.9264H23.8889C24.4411 28.9264 24.8889 29.3741 24.8889 29.9264V46.7041H7.11108V29.9264Z"
                  fill="#D1E3F8"
                />
                <rect
                  x="17.4815"
                  y="23.0004"
                  width="7.40741"
                  height="2.96296"
                  fill="#D1E3F8"
                />
              </svg>
            )}
          </svg>
          <div className={`${rcn('here')} content-text`}>
            {props.status === 'ready' && <span>Drag & drop here</span>}
            {props.status === 'pending' && <span>Uploading</span>}
            {props.status === 'done' && (
              <span>Drag & drop here to replace</span>
            )}
          </div>
          <div className={`${rcn('or')} content-text`}>- or -</div>
          <div
            className={`${rcn('select')} content-text`}
            onClick={
              props.status === 'pending' ? props.abortUpload : openFileDialog
            }
            style={{ cursor: 'pointer' }}
          >
            {props.status === 'ready' && <span>Select file to upload</span>}
            {props.status === 'pending' && <span>Cancel</span>}
            {props.status === 'done' && <span>Select file to replace</span>}
          </div>
          {errorState !== '' && (
            <div className={'upload-error'}>{errorState}</div>
          )}
        </div>
      </div>
    </div>
  )
}

const StyledFileUpload = styled(FileUpload)`
  width: 400px;
  height: 590px;
  align-self: center;
  margin: 0 auto;

  background: ${Colors.PureWhite};
  border: 1px solid ${Colors.BG2};
  box-sizing: border-boxu;

  .upload-header {
    height: 79px;
    border-bottom: 1px solid ${Colors.BG2};
  }

  .header-text {
    position: relative;
    width: 347px;
    height: 20px;
    margin: 0 auto;

    /* font-family: Proxima Nova; */
    font-style: normal;
  }

  .header-title {
    top: 21px;

    font-weight: bold;
    font-size: 20px;
    line-height: 20px;
    /* identical to box height */

    /* TX 1 */

    color: ${Colors.TX1};
  }

  .header-description {
    top: 20px;

    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    display: flex;
    align-items: center;

    /* TX 3 */

    color: ${Colors.TX3};
  }

  .upload-content {
    width: 360px;
    height: 470px;
    margin: 19px auto;
  }

  .content-dropzone {
    height: 100%;
    width: 100%;
    background-color: ${Colors.PureWhite};
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    font-size: 16px;
  }

  .content-highlight {
    background-color: ${Colors.BG3};
    border: 1px dashed ${Colors.BD1};
  }

  .content-icon {
    height: 80px;
    width: 80px;
    border-radius: 50%;
    box-sizing: border-box;
    display: flex;
    overflow: hidden;
  }

  .content-icon-alt {
    align-self: center;
  }

  .content-fileinput {
    display: none;
  }

  .content-text {
    /* font-family: Proxima Nova; */
    font-style: normal;
    font-weight: normal;
    font-size: 12px;
    line-height: 12px;
    /* identical to box height */
    text-align: center;
  }

  .circle-background,
  .circle-progress {
    fill: none;
  }

  .circle-background {
    stroke: ${Colors.BG1};
  }

  .circle-progress {
    stroke: ${(props) =>
      props.status === 'pending' ? Colors.BD1 : Colors.BG1};
  }

  .${rcn('here')} {
    padding-top: 9px;
    /* TX 2 */
    color: ${Colors.TX2};
  }

  .${rcn('or')} {
    padding-top: 8px;
    /* TX 3 */
    color: ${Colors.TX3};
  }

  .${rcn('select')} {
    padding-top: 4px;
    /* Accord Blue */
    color: ${Colors.BD1};
  }

  .upload-error {
    color: red;
    font-size: 12px;
    margin-top: 10px;
  }
`

export { StyledFileUpload as FileUpload }
