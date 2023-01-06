import React, { FC } from 'react'
import { Button } from 'antd'

export interface IProps {
  text: string
}

const YButton: FC<IProps> = props => {
  const { text } = props
  return <Button>{text}</Button>
}

export default YButton
